import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface SelectedTextContextType {
  selectedText: string;
  setSelectedText: (text: string) => void;
  clearSelectedText: () => void;
  triggerExplain: (text: string) => void;
  registerExplainHandler: (handler: (text: string) => void) => void;
}

const SelectedTextContext = createContext<SelectedTextContextType | undefined>(undefined);

export const useSelectedText = () => {
  const context = useContext(SelectedTextContext);
  if (!context) {
    throw new Error('useSelectedText must be used within a SelectedTextProvider');
  }
  return context;
};

interface SelectedTextProviderProps {
  children: ReactNode;
}

export const SelectedTextProvider: React.FC<SelectedTextProviderProps> = ({ children }) => {
  const [selectedText, setSelectedText] = useState('');
  const [explainHandler, setExplainHandler] = useState<((text: string) => void) | null>(null);

  const clearSelectedText = useCallback(() => {
    setSelectedText('');
  }, []);

  const triggerExplain = useCallback((text: string) => {
    if (explainHandler) {
      explainHandler(text);
    }
  }, [explainHandler]);

  const registerExplainHandler = useCallback((handler: (text: string) => void) => {
    setExplainHandler(() => handler);
  }, []);

  return (
    <SelectedTextContext.Provider
      value={{
        selectedText,
        setSelectedText,
        clearSelectedText,
        triggerExplain,
        registerExplainHandler,
      }}
    >
      {children}
    </SelectedTextContext.Provider>
  );
};
