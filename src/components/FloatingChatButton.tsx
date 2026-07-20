import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingChatButtonProps {
  onClick: () => void;
}

export function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated hover:shadow-2xl transition-all z-50"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
}
