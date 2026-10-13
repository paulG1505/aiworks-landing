'use client';

import { useEffect, useState } from 'react';
import { copy } from '../copy';
import type { ConsoleError } from '../types';

const SKELETON_WIDTHS = ['w-3/4', 'w-full', 'w-2/3', 'w-5/6'];

export function errorMessage(error: ConsoleError): string {
  switch (error.kind) {
    case 'timeout':
      return copy.zone.error.timeout;
    case 'network':
      return copy.zone.error.network;
    case 'server':
      return copy.zone.error.server;
    case 'bad_response':
      return copy.zone.error.badResponse;
    default:
      return copy.zone.error.generic;
  }
}

function RateLimited({ seconds, onRetry }: { seconds: number; onRetry: () => void }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      {left > 0 && <p>{copy.zone.error.rateLimited(left)}</p>}
      {left <= 0 && <RetryButton onRetry={onRetry} />}
    </div>
  );
}

function RetryButton({ onRetry }: { onRetry: () => void }) {
  return (
    <button type="button" onClick={onRetry} className="action action-outline cursor-pointer">
      {copy.zone.retry}
    </button>
  );
}

type ZoneStatusProps =
  | { kind: 'loading'; lines?: number }
  | { kind: 'empty'; message: string; action?: { label: string; onClick: () => void } }
  | { kind: 'error'; error: ConsoleError; onRetry: () => void }
  | { kind: 'message'; message: string };

export function ZoneStatus(props: ZoneStatusProps) {
  if (props.kind === 'loading') {
    const lines = Math.min(6, Math.max(3, props.lines ?? 4));
    return (
      <div>
        <span className="sr-only">{copy.zone.loading}</span>
        <div aria-hidden="true" className="flex flex-col gap-3">
          {Array.from({ length: lines }, (_, i) => (
            <div key={i} className={`h-3 bg-regla ${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}`} />
          ))}
        </div>
      </div>
    );
  }

  if (props.kind === 'empty') {
    return (
      <div className="flex flex-col items-start gap-3">
        <p>{props.message}</p>
        {props.action && (
          <button type="button" onClick={props.action.onClick} className="action action-outline cursor-pointer">
            {props.action.label}
          </button>
        )}
      </div>
    );
  }

  if (props.kind === 'message') {
    return (
      <p role="alert" className="text-tinta">
        {props.message}
      </p>
    );
  }

  if (props.error.kind === 'rate_limited') {
    return <RateLimited seconds={props.error.retryAfterSeconds ?? 60} onRetry={props.onRetry} />;
  }
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p>{errorMessage(props.error)}</p>
      <RetryButton onRetry={props.onRetry} />
    </div>
  );
}
