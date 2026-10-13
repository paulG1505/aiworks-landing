import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConsoleParams } from './useConsoleParams';

const TENANTS = ['aiworks', 'demo-panaderia'];

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
});
afterEach(() => vi.useRealTimers());

const mount = () => renderHook(() => useConsoleParams(TENANTS));
const goto = (url: string) => window.history.replaceState(null, '', url);

describe('useConsoleParams', () => {
  it('reads every parameter from the URL', () => {
    goto('/consola?mes=2026-08&tenant=demo-panaderia&canal=web&listas=1&c=c_8f2a19d0');
    const { result } = mount();
    expect(result.current.params).toEqual({
      month: '2026-08',
      tenantId: 'demo-panaderia',
      channel: 'web',
      readyOnly: true,
      conversationId: 'c_8f2a19d0',
    });
  });

  it('falls back to defaults on a clean URL', () => {
    const { result } = mount();
    expect(result.current.params).toEqual({
      month: '2026-10', tenantId: undefined, channel: undefined, readyOnly: false, conversationId: undefined,
    });
  });

  it('ignores invalid values', () => {
    goto('/consola?mes=2025-01&tenant=desconocido&canal=sms&listas=0&c=a%20b%2F..');
    const { result } = mount();
    expect(result.current.params).toEqual({
      month: '2026-10', tenantId: undefined, channel: undefined, readyOnly: false, conversationId: undefined,
    });
    goto('/consola?mes=2026-13');
    expect(mount().result.current.params.month).toBe('2026-10');
  });

  it('replaces the URL without default values and without growing the history', () => {
    const { result } = mount();
    const length = window.history.length;

    act(() => result.current.update({ channel: 'whatsapp', readyOnly: true }));
    expect(window.location.pathname + window.location.search).toBe('/consola?canal=whatsapp&listas=1');

    act(() => result.current.update({ month: '2026-09', conversationId: 'c1' }));
    expect(window.location.search).toBe('?mes=2026-09&canal=whatsapp&listas=1&c=c1');

    act(() => result.current.update({ month: '2026-10', channel: undefined, readyOnly: false, conversationId: undefined }));
    expect(window.location.pathname + window.location.search).toBe('/consola');
    expect(window.history.length).toBe(length);
  });

  it('keeps the open conversation when a filter changes', () => {
    goto('/consola?c=c7');
    const { result } = mount();
    act(() => result.current.update({ tenantId: 'aiworks' }));
    expect(window.location.search).toBe('?tenant=aiworks&c=c7');
  });
});
