import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const right = '{\n- follow: false\nhost: hexlet.io\n- proxy: 123.234.53.22\n- timeout: 50\n+ timeout: 20\n+ verbose: true\n}';

test('Flat JSON/JSON', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');
  const actual1 = gendiff(path1, path2);
  expect(actual1).toBe(right);
});

test('Flat YAML/YAML', () => {
  const path1 = getFixturePath('file1.yaml');
  const path2 = getFixturePath('file2.yml');
  const actual1 = gendiff(path1, path2);
  expect(actual1).toBe(right);
});

test('Flat JSON/YAML', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.yml');
  const actual1 = gendiff(path1, path2);
  expect(actual1).toBe(right);
});

test('Flat YAML/JSON', () => {
  const path1 = getFixturePath('file1.yaml');
  const path2 = getFixturePath('file2.json');
  const actual1 = gendiff(path1, path2);
  expect(actual1).toBe(right);
});

test('Wrong files', () => {
  const path1 = getFixturePath('file1.ym');
  const path2 = getFixturePath('file2.jso');
  const actual1 = gendiff(path1, path2);
  expect(actual1).toBe('{\n\n}');
});
