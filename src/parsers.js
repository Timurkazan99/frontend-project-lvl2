import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs';
import yaml from 'js-yaml';

const ParseFile = (file) => {
  const location = path.resolve(process.cwd(), file);
  if (file.endsWith('json')) {
    return JSON.parse(fs.readFileSync(location, 'utf8'));
  }
  if (file.endsWith('yml') || file.endsWith('yaml')) {
    return yaml.load(fs.readFileSync(location, 'utf8'));
  }
  return {};
};

export default ParseFile;
