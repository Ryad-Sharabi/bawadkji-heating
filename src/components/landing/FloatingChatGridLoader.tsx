type FloatingChatGridLoaderProps = {
  label: string;
  compact?: boolean;
};

export function FloatingChatGridLoader({ label, compact = false }: FloatingChatGridLoaderProps) {
  return (
    <span
      className={`floating-chat-grid-loader${compact ? " is-compact" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {Array.from({ length: 9 }, (_, index) => (
        <span key={index} style={{ animationDelay: `${index * 0.08}s` }} />
      ))}
    </span>
  );
}
