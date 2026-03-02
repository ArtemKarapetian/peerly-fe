interface ConversationListProps {
  lastMessageText: string;
  lastMessageTime: string;
  onSelect?: () => void;
  isSelected?: boolean;
}

export function ConversationList({
  lastMessageText,
  lastMessageTime,
  onSelect,
  isSelected,
}: ConversationListProps) {
  const Wrapper = onSelect ? "button" : "div";
  const interactiveProps = onSelect
    ? {
        onClick: onSelect,
        className: "w-full p-4 hover:bg-accent transition-colors text-left border-b border-border",
      }
    : { className: "p-4 bg-accent/50 border-b border-border" };

  return (
    <Wrapper {...interactiveProps}>
      <div className="flex items-center gap-3">
        <div
          className={`${isSelected ? "w-12 h-12" : "w-10 h-10"} rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0`}
        >
          <span className={isSelected ? "text-2xl" : "text-lg"}>💬</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-foreground">Служба поддержки</h3>
            <span className="text-xs text-muted-foreground">{lastMessageTime}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{lastMessageText}</p>
        </div>
      </div>
    </Wrapper>
  );
}
