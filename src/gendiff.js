import _ from 'lodash';
import ParseFile from './parsers.js';
import { isObject, getKey } from './index.js';
import formate from './formatters/index.js';

const objInclude = (key, obj) => obj[key] !== undefined;
const includeBoth = (key, obj1, obj2) => objInclude(key, obj1) && objInclude(key, obj2);
const firstInclude = (key, obj1, obj2) => objInclude(key, obj1) && !objInclude(key, obj2);

const getKeys = (obj1, obj2, fun) => {
  const keys = _.uniq([...Object.keys(obj1), ...Object.keys(obj2)])
    .filter((key) => fun(key, obj1, obj2));
  return keys;
};

const setAction = (key, value, action, newValue = undefined) => {
  const withoutNewValue = { key, value, action };
  const withNewValue = {
    key,
    value,
    action,
    newValue,
  };
  if (newValue === undefined) {
    return withoutNewValue;
  }
  return withNewValue;
};

const compareObj = (obj1, obj2, ancestor = '') => {
  const getAncestor = (key) => (ancestor === '' ? key : `${ancestor}.${key}`);
  const iter = (acc, key) => { // Функция для сравнения одинаковых свойств
    const temp = [...acc];
    const newAncestor = getAncestor(key);
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      temp.push(compareObj(obj1[key], obj2[key], newAncestor));
    } else if (obj1[key] === obj2[key]) {
      temp.push(setAction(newAncestor, obj1[key], 'unchanged'));
    } else {
      temp.push(setAction(newAncestor, obj1[key], 'changed', obj2[key]));
    }
    return temp;
  };

  const common = getKeys(obj1, obj2, includeBoth).reduce(iter, []);
  const unique1 = getKeys(obj1, obj2, firstInclude)
    .map((key) => setAction(getAncestor(key), obj1[key], 'removed'));
  const unique2 = getKeys(obj2, obj1, firstInclude)
    .map((key) => setAction(getAncestor(key), obj2[key], 'added'));
  const result = [...common, ...unique1, ...unique2].flat();
  return result;
};

const gendiff = (file1, file2, style) => {
  const obj1 = ParseFile(file1);
  const obj2 = ParseFile(file2);
  const temp = compareObj(obj1, obj2).flat();
  const sorted = _.sortBy(temp, getKey);
  const result = formate(sorted, style);
  return result;
};

export default gendiff;
