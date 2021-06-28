#!/usr/bin/env node
import { Command } from 'commander';
import gendiff from '../src/gendiff.js';

const program = new Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1>')
  .arguments('<filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, type) => console.log(gendiff(filepath1, filepath2, type)))
  .parse();
