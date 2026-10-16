import type { ReactNode, Ref } from 'react';

interface Props {
  text: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function EndedNotice({ text, children, ref }: Props) {
  return (
    <div ref={ref} tabIndex={-1} className="chat-message outline-none mt-2 border-t border-regla pt-5">
      <p className="max-w-[48ch] whitespace-pre-line text-[1rem] leading-relaxed text-tinta">{text}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
