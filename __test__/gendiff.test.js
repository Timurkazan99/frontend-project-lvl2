import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);
const path = getFixturePath('right.json');
const right = fs.readFileSync(path, 'utf-8').trim();

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
  expect(actual1).toBe('{}');
});
