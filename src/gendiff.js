import * as path from 'path';
import * as process from 'process';
import * as fs from 'fs';
import _ from 'lodash';

const objIncude = (key, obj) => obj[key] !== undefined;

const getFile = (file) => {
  const location = path.resolve(process.cwd(), file);
  return JSON.parse(fs.readFileSync(location));
};

const sortByKeys = (str1, str2) => {
  const newStr1 = str1.replace(/^.? /, '').replace(/:.*/, '');
  const newStr2 = str2.replace(/^.? /, '').replace(/:.*/, '');
  const temp = newStr1.localeCompare(newStr2);
  if (temp === 0) {
    if (str1.startsWith('-')) {
      return 1;
    }
    if (str2.startsWith('-')) {
      return 1;
    }
  }
  return temp;
};

const gendiff = (file1, file2) => {
  const obj1 = getFile(file1);
  const obj2 = getFile(file2);
  const keys = _.uniq([...Object.keys(obj1), ...Object.keys(obj2)]);
  const common = keys
    .filter((key) => objIncude(key, obj1) && objIncude(key, obj2))
    .reduce((acc, key) => {
      const temp = [...acc];
      if (obj1[key] === obj2[key]) {
        temp.push(`${key}: ${obj1[key]}`);
      } else {
        temp.push(`- ${key}: ${obj1[key]}`);
        temp.push(`+ ${key}: ${obj2[key]}`);
      }
      return temp;
    }, []);
  const unique1 = keys
    .filter((key) => objIncude(key, obj1) && !objIncude(key, obj2))
    .map((key) => `- ${key}: ${obj1[key]}`);
  const unique2 = keys
    .filter((key) => !objIncude(key, obj1) && objIncude(key, obj2))
    .map((key) => `+ ${key}: ${obj2[key]}`);
  const result = [...common, ...unique1, ...unique2]
    .sort(sortByKeys)
    .join('\n');
  return `{\n${result}\n}`;
};

export default gendiff;
