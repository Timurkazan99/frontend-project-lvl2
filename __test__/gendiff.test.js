import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test('JSON/JSON stylish', () => {
  const path = getFixturePath('right.json');
  const right = fs.readFileSync(path, 'utf-8').trim();
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const actual1 = gendiff(file1, file2, 'stylish');
  expect(actual1).toBe(right);
});

test('JSON/JSON default', () => {
  const path = getFixturePath('right.json');
  const right = fs.readFileSync(path, 'utf-8').trim();
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.json');
  const actual1 = gendiff(file1, file2);
  expect(actual1).toBe(right);
});

test('YAML/YAML stylish', () => {
  const path = getFixturePath('right.json');
  const right = fs.readFileSync(path, 'utf-8').trim();
  const file1 = getFixturePath('file1.yaml');
  const file2 = getFixturePath('file2.yml');
  const actual1 = gendiff(file1, file2, 'stylish');
  expect(actual1).toBe(right);
});

test('YAML/YAML default', () => {
  const path = getFixturePath('right.json');
  const right = fs.readFileSync(path, 'utf-8').trim();
  const file1 = getFixturePath('file1.yaml');
  const file2 = getFixturePath('file2.yml');
  const actual1 = gendiff(file1, file2);
  expect(actual1).toBe(right);
});

test('JSON/YAML stylish', () => {
  const path = getFixturePath('right.json');
  const right = fs.readFileSync(path, 'utf-8').trim();
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.yml');
  const actual1 = gendiff(file1, file2, 'stylish');
  expect(actual1).toBe(right);
});

test('JSON/YAML default', () => {
  const path = getFixturePath('right.json');
  const right = fs.readFileSync(path, 'utf-8').trim();
  const file1 = getFixturePath('file1.json');
  const file2 = getFixturePath('file2.yml');
  const actual1 = gendiff(file1, file2);
  expect(actual1).toBe(right);
});

test('YAML/JSON stylish', () => {
  const path = getFixturePath('right.json');
  const right = fs.readFileSync(path, 'utf-8').trim();
  const file1 = getFixturePath('file1.yaml');
  const file2 = getFixturePath('file2.json');
  const actual1 = gendiff(file1, file2);
  expect(actual1).toBe(right);
});

test('YAML/JSON default', () => {
  const path = getFixturePath('right.json');
  const right = fs.readFileSync(path, 'utf-8').trim();
  const file1 = getFixturePath('file1.yaml');
  const file2 = getFixturePath('file2.json');
  const actual1 = gendiff(file1, file2);
  expect(actual1).toBe(right);
});

test('Wrong files', () => {
  const path1 = getFixturePath('file1.ym');
  const path2 = getFixturePath('file2.jso');
  const actual1 = gendiff(path1, path2);
  expect(actual1).toBe('{}');
});
