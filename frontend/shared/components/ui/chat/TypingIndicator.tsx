import { AssistantAvatar } from './AssistantAvatar';

export function TypingIndicator({ label }: { label: string }) {
  return (
    <div className="chat-message flex items-start gap-2.5">
      <AssistantAvatar />
      <div className="flex h-11 items-center gap-1.5 rounded-[4px] bg-arena px-4" aria-hidden="true">
        <span className="typing-dot" style={{ ['--d' as string]: '0ms' }} />
        <span className="typing-dot" style={{ ['--d' as string]: '160ms' }} />
        <span className="typing-dot" style={{ ['--d' as string]: '320ms' }} />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
