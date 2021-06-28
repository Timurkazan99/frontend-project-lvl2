import _ from 'lodash';
import ParseFile from './parsers.js';
import formate from './formatters/formate.js';

const objInclude = (key, obj) => obj[key] !== undefined;
const includeBoth = (key, obj1, obj2) => objInclude(key, obj1) && objInclude(key, obj2);
const firstInclude = (key, obj1, obj2) => objInclude(key, obj1) && !objInclude(key, obj2);

const isObject = (val) => {
  if (val === null) {
    return false;
  }
  return typeof val === 'object';
};

const sortByKeys = (obj1, obj2) => {
  const { key: str1, action: action1 } = obj1;
  const { key: str2, action: action2 } = obj2;
  const temp = str1.localeCompare(str2);
  if (temp === 0) {
    if (action1.startsWith('-')) {
      return 1;
    }
    if (action2.startsWith('-')) {
      return 1;
    }
  }
  return temp;
};

const getKeys = (obj1, obj2, fun) => {
  const keys = _.uniq([...Object.keys(obj1), ...Object.keys(obj2)])
    .filter((key) => fun(key, obj1, obj2));
  return keys;
};

const getAction = (key, value, action, newValue = undefined) => {
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

const getAncestor = (ancestor, key) => (ancestor === '' ? key : `${ancestor}.${key}`);

const compareObj = (obj1, obj2, ancestor = '') => {
  const iter = (acc, key) => { // Функция для сравнения одинаковых свойств
    const temp = [...acc];
    const newAncestor = getAncestor(ancestor, key);
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      temp.push(compareObj(obj1[key], obj2[key], getAncestor(ancestor, key)));
    } else if (obj1[key] === obj2[key]) {
      temp.push(getAction(newAncestor, obj1[key], 'nothing'));
    } else {
      temp.push(getAction(newAncestor, obj1[key], '-Update', obj2[key]));
      temp.push(getAction(newAncestor, obj2[key], '+Update'));
    }
    return temp;
  };

  const common = getKeys(obj1, obj2, includeBoth).reduce(iter, []);
  const unique1 = getKeys(obj1, obj2, firstInclude)
    .map((key) => getAction(getAncestor(ancestor, key), obj1[key], 'Remove'));
  const unique2 = getKeys(obj2, obj1, firstInclude)
    .map((key) => getAction(getAncestor(ancestor, key), obj2[key], 'Add'));
  const result = [...common, ...unique1, ...unique2];
  return result.flat().sort(sortByKeys);
};

const gendiff = (file1, file2, style) => {
  const obj1 = ParseFile(file1);
  const obj2 = ParseFile(file2);
  const temp = compareObj(obj1, obj2);
  const result = formate(temp, style);
  return result;
};

export default gendiff;
