import { X } from 'lucide-react';
import type { LauncherCopy } from './launcherCopy';

interface LauncherCloudProps {
  copy: LauncherCopy;
  onOpen: () => void;
  onDismiss: () => void;
}

export function LauncherCloud({ copy, onOpen, onDismiss }: LauncherCloudProps) {
  return (
    // Plain text, not a control: the click is a pointer convenience, the button is the keyboard path.
    <div
      onClick={onOpen}
      className="enter-fade relative mb-1 flex max-w-[15.5rem] cursor-pointer items-start gap-1 rounded-[14px_14px_4px_14px] border border-regla bg-papel py-2.5 pl-3.5 pr-1"
    >
      <p className="m-0 text-left">
        <span className="block text-sm font-semibold leading-snug text-tinta">{copy.cloudTitle}</span>
        <span className="mt-0.5 block text-xs leading-snug text-tinta-media">
          {copy.cloudSubtitle}
        </span>
      </p>
      <button
        type="button"
        aria-label={copy.closeCloud}
        onClick={(event) => {
          event.stopPropagation();
          onDismiss();
        }}
        className="-my-1.5 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-tinta-media hover:text-tinta"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
