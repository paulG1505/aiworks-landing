import type { ReactNode } from 'react';

interface Props {
  href: string;
  ariaLabel: string;
  children: ReactNode;
}

export function ActionLink({ href, ariaLabel, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="action action-primary min-h-11 !rounded-[4px] !px-5 !py-2.5 !text-[0.9375rem]"
    >
      {children}
    </a>
  );
}
