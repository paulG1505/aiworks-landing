interface RobotIconProps {
  className?: string;
}

export function RobotIcon({ className }: RobotIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M16 4v4" />
      <circle cx="16" cy="3.5" r="1.2" fill="currentColor" stroke="none" />
      <rect x="6" y="8" width="20" height="16" rx="5" />
      <circle cx="12" cy="15" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="20" cy="15" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12.5 19.5c1 .9 2.2 1.3 3.5 1.3s2.5-.4 3.5-1.3" />
      <path d="M6 14H4m24 0h-2M11 27h10" />
    </svg>
  );
}
