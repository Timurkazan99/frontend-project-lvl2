import _ from 'lodash';
import ParseFile from './parsers.js';

const objIncude = (key, obj) => obj[key] !== undefined;

const sortByKeys = (str1, str2) => {
  const newStr1 = str1.replace(/^.? /, '').replace(/:.*/, '');
  const newStr2 = str2.replace(/^.? /, '').replace(/:.*/, '');
  const temp = newStr1.localeCompare(newStr2);
  console.log(temp);
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
  const obj1 = ParseFile(file1);
  const obj2 = ParseFile(file2);
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
