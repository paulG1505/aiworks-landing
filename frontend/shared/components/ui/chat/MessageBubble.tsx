import type { ReactNode } from 'react';
import { AssistantAvatar } from './AssistantAvatar';

interface Props {
  role: 'user' | 'assistant';
  speaker: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function MessageBubble({ role, speaker, children, footer }: Props) {
  const isUser = role === 'user';
  return (
    <div className={`chat-message flex items-start gap-2.5 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <AssistantAvatar />}
      <div
        className={`max-w-[85%] rounded-[4px] px-4 py-3 text-[1rem] leading-relaxed ${
          isUser ? 'bg-marca text-papel' : 'bg-arena text-tinta'
        }`}
      >
        <p className="whitespace-pre-line">
          <span className="sr-only">{speaker}: </span>
          {children}
        </p>
        {footer}
      </div>
    </div>
  );
}
