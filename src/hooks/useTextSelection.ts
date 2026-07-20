import { useState, useEffect, RefObject } from "react";

export const useTextSelectionHandler = (
  contentRef: RefObject<HTMLDivElement>,
  onTextSelect: (text: string) => void
) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (
        selectedText &&
        selectedText.length > 3 &&
        contentRef.current?.contains(selection?.anchorNode || null)
      ) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (rect) {
          setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
          setShowTooltip(true);
          onTextSelect(selectedText);
        }
      } else {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
    };
  }, [contentRef, onTextSelect]);

  return { showTooltip, tooltipPosition, hideTooltip: () => setShowTooltip(false) };
};
