import {
  getAction,
  getValue,
  getNewValue,
  getKey,
  getChildren,
  isObject,
} from '../index.js';

const smallIdent = 2;
const indent = 4;

const buildIndent = (depth) => {
  const indentCount = (depth * indent) + smallIdent;
  return ' '.repeat(indentCount);
};

const stringify = (item, depth) => {
  if (!isObject(item)) {
    return item;
  }

  const keys = Object.keys(item);

  const result = keys.map((key) => `${buildIndent(depth + 1)}  ${key}: ${stringify(item[key], depth + 1)}`);

  return `{\n${result.join('\n')}\n${' '.repeat((depth + 1) * indent)}}`;
};

const getStylish = (item, depth, fun) => {
  const key = getKey(item);
  const value = getValue(item);
  const newValue = getNewValue(item);
  const action = getAction(item);
  switch (action) {
    case 'added':
      return `${buildIndent(depth)}+ ${key}: ${stringify(value, depth)}`;
    case 'removed':
      return `${buildIndent(depth)}- ${key}: ${stringify(value, depth)}`;
    case 'changed': {
      const tempStr1 = `${buildIndent(depth)}- ${key}: ${stringify(value, depth)}`;
      const tempStr2 = `${buildIndent(depth)}+ ${key}: ${stringify(newValue, depth)}`;
      return `${tempStr1}\n${tempStr2}`;
    }
    case 'unchanged':
      return `${buildIndent(depth)}  ${key}: ${stringify(value, depth)}`;
    case 'nested':
      return `${buildIndent(depth)}  ${key}: ${fun(getChildren(item), depth + 1)}`;
    default:
      return [];
  }
};

const formateStylish = (array) => {
  const iter = (coll, depth) => {
    const result = coll.map((item) => getStylish(item, depth, iter));
    return `{\n${result.join('\n')}\n${' '.repeat(depth * indent)}}`;
  };

  return iter(array, 0);
};

export default formateStylish;
