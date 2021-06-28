#!/usr/bin/env node
import { Command } from 'commander';
import gendiff from '../src/gendiff.js';

const program = new Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<filepath1>')
  .arguments('<filepath2>')
  .option('-f, --format <style>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    const style = options.format;
    console.log(gendiff(filepath1, filepath2, style));
  })
  .parse();
