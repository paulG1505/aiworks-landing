import { test } from 'node:test';
import assert from 'node:assert/strict';
import { es } from './es.ts';
import { en } from './en.ts';

function appointmentSection(sections: readonly { title: string; paragraphs: readonly string[] }[]) {
  return sections.find((s) => s.paragraphs.join(' ').includes('Google'));
}

test('the Spanish policy describes the appointment data of the demos', () => {
  const section = appointmentSection(es.legal.privacy.sections);
  assert.ok(section);
  const text = section.paragraphs.join(' ');
  for (const word of ['nombre', 'teléfono', 'calendario', 'todas las noches', 'datos inventados']) {
    assert.match(text, new RegExp(word));
  }
});

test('the English policy describes the appointment data of the demos', () => {
  const section = appointmentSection(en.legal.privacy.sections);
  assert.ok(section);
  const text = section.paragraphs.join(' ');
  for (const word of ['name', 'phone', 'calendar', 'every night', 'made-up']) {
    assert.match(text, new RegExp(word));
  }
});

test('both languages keep the same number of privacy sections', () => {
  assert.equal(es.legal.privacy.sections.length, en.legal.privacy.sections.length);
});
