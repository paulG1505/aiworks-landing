'use client';

import { useEffect, useId, type FormEvent, type KeyboardEvent, type RefObject } from 'react';
import { ArrowUp } from 'lucide-react';

export const COUNTER_THRESHOLD = 300;
const MAX_FIELD_HEIGHT = 132;

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  fieldRef: RefObject<HTMLTextAreaElement | null>;
  maxChars: number;
  fieldLabel: string;
  placeholder: string;
  sendLabel: string;
  charactersLabel: (n: number, max: number) => string;
  hint: string | null;
  disabled: boolean;
  busy: boolean;
}

export function Composer({
  value,
  onChange,
  onSubmit,
  fieldRef,
  maxChars,
  fieldLabel,
  placeholder,
  sendLabel,
  charactersLabel,
  hint,
  disabled,
  busy,
}: Props) {
  const fieldId = useId();
  const hintId = useId();
  const showCounter = value.length > COUNTER_THRESHOLD;
  const hasHint = hint !== null || showCounter;
  const canSend = !disabled && !busy && value.trim().length > 0;

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_FIELD_HEIGHT)}px`;
  }, [value, fieldRef]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (canSend) onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-4 pt-3 sm:px-5">
      <div
        id={hintId}
        className={`flex items-center justify-between gap-4 text-[0.8125rem] text-tinta-media ${hasHint ? 'mb-2' : 'sr-only'}`}
      >
        <p role="status">{hint}</p>
        {showCounter && (
          <p className={`tabular ml-auto ${maxChars - value.length <= 50 ? 'text-tinta' : ''}`}>
            <span className="sr-only">{charactersLabel(value.length, maxChars)}</span>
            <span aria-hidden="true">
              {value.length}/{maxChars.toLocaleString('es-EC')}
            </span>
          </p>
        )}
      </div>
      <div className="flex items-end gap-1 rounded-[4px] border border-[var(--regla-arena)] bg-papel pl-3.5 pr-1 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-marca">
        <label htmlFor={fieldId} className="sr-only">
          {fieldLabel}
        </label>
        <textarea
          id={fieldId}
          ref={fieldRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-describedby={hasHint ? hintId : undefined}
          maxLength={maxChars}
          disabled={disabled}
          className="chat-field block max-h-[132px] min-h-11 w-full resize-none bg-transparent py-3 text-[1rem] leading-snug text-tinta outline-none placeholder:text-tinta-media disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label={sendLabel}
          className="mb-1 grid size-11 shrink-0 cursor-pointer place-items-center rounded-[4px] bg-[var(--boton)] text-[var(--sobre-boton)] transition-colors duration-150 hover:bg-[var(--boton-hover)] disabled:cursor-not-allowed disabled:bg-arena disabled:text-tinta-media"
        >
          <ArrowUp className="size-5" strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
