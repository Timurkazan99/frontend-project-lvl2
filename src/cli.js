import { Command } from 'commander';

const init = () => {
  const program = new Command();

  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1>')
    .arguments('<filepath2>')
    .option('-f, --format <type>', 'output format')
    .parse();
  return program;
}

export default init;
