import { describe, expect, it } from 'vitest';
import {
  formatCost, formatCount, formatDateTime, formatDay, formatMonth, formatTime, safeContact,
} from './format';

describe('format', () => {
  it('formats months and days in Spanish', () => {
    expect(formatMonth('2026-10')).toBe('octubre 2026');
    expect(formatMonth('2026-09')).toBe('septiembre 2026');
    expect(formatDay('2026-10-12')).toBe('12 oct');
    expect(formatDay('2026-10-03')).toBe('3 oct');
  });

  it('formats instants in the Guayaquil zone with a 24 h clock', () => {
    expect(formatTime('2026-10-12T15:04:09Z')).toBe('10:04');
    expect(formatTime('2026-10-12T22:30:00Z')).toBe('17:30');
    expect(formatDateTime('2026-10-12T15:04:09Z')).toBe('12 oct · 10:04');
    expect(formatDateTime('2026-10-01T03:00:00Z')).toBe('30 sept · 22:00');
  });

  it('formats counts with a dot as thousands separator', () => {
    expect(formatCount(48)).toBe('48');
    expect(formatCount(1234)).toBe('1.234');
    expect(formatCount(1234567)).toBe('1.234.567');
  });

  it('formats cost with two decimals and a floor', () => {
    expect(formatCost(1.8432)).toBe('1,84');
    expect(formatCost(0.004)).toBe('< 0,01');
    expect(formatCost(0)).toBe('0,00');
    expect(formatCost(0.0421)).toBe('0,04');
  });

  describe('safeContact', () => {
    it('keeps masked contacts', () => {
      expect(safeContact('+593 ••• ••• 586')).toBe('+593 ••• ••• 586');
      expect(safeContact('web · a1b2c3')).toBe('web · a1b2c3');
    });

    it('hides a contact with seven or more digits in a row', () => {
      expect(safeContact('+593 99 000 0000')).toBe('Contacto oculto');
      expect(safeContact('0990000000')).toBe('Contacto oculto');
      expect(safeContact('099-000-0000')).toBe('Contacto oculto');
    });
  });
});
