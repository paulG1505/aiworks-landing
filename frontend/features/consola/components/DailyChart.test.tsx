import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { summaryOf } from '../testing/fixtures';
import { DailyChart } from './DailyChart';

function setup() {
  const view = render(<DailyChart summary={summaryOf('2026-10', [3, 0, 7])} />);
  return { ...view, group: screen.getByRole('group', { name: 'Chats por día de octubre 2026' }) };
}

describe('DailyChart', () => {
  it('Regla de chats por día', async () => {
    const { container, group } = setup();

    expect(container.querySelectorAll('[data-day]')).toHaveLength(31);
    expect(container.querySelectorAll('[data-mark]')).toHaveLength(2);
    expect(screen.getByText('Día con más chats: 3 oct · 7')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.tab();
    expect(group).toHaveFocus();
    await user.keyboard('{Home}{ArrowRight}{ArrowRight}');
    expect(screen.getByText('3 oct · 7 chats')).toBeInTheDocument();
  });

  it('marks the first day with the first arrow and stops at the edges', async () => {
    setup();
    const user = userEvent.setup();
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('1 oct · 3 chats')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByText('1 oct · 3 chats')).toBeInTheDocument();
    await user.keyboard('{End}{ArrowRight}');
    expect(screen.getByText('31 oct · 0 chats')).toBeInTheDocument();
  });

  it('uses the singular for one chat and follows the mouse', async () => {
    render(<DailyChart summary={summaryOf('2026-10', [1, 4])} />);
    const user = userEvent.setup();
    const first = document.querySelector('[data-day="2026-10-01"]') as HTMLElement;
    await user.hover(first);
    expect(screen.getByText('1 oct · 1 chat')).toBeInTheDocument();
  });

  it('says so when the month has no chats and draws no marks', () => {
    const { container } = render(<DailyChart summary={summaryOf('2026-10', [0, 0])} />);
    expect(container.querySelectorAll('[data-mark]')).toHaveLength(0);
    expect(screen.getByText('Sin chats en el mes.')).toBeInTheDocument();
  });

  it('announces the reading politely and has no tooltip', () => {
    setup();
    expect(screen.getByText('Día con más chats: 3 oct · 7')).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
