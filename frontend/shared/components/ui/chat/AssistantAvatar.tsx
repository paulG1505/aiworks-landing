import { RobotIcon } from './RobotIcon';

export function AssistantAvatar() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[var(--regla-arena)] text-marca"
    >
      <RobotIcon className="size-5" />
    </span>
  );
}
