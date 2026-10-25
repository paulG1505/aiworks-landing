import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_PAGE_COPY } from './copy.ts';

test('demo price line shows the current founder and plan prices', () => {
  assert.equal(
    DEMO_PAGE_COPY.es.price,
    'Instalación USD 169 + IVA (precio de fundador) · planes desde USD 49 + IVA al mes',
  );
  assert.equal(
    DEMO_PAGE_COPY.en.price,
    'Setup USD 169 + VAT (founder price) · plans from USD 49 + VAT per month',
  );
});
