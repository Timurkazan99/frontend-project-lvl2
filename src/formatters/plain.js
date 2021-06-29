import {
  getAction,
  getValue,
  getNewValue,
  getKey,
  isObject,
} from '../index.js';

const toComplex = (val) => {
  if (isObject(val)) {
    return '[complex value]';
  }
  if (val === null) {
    return 'null';
  }
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  return val;
};

const getPlain = (item) => {
  const key = getKey(item);
  const value = getValue(item);
  const newValue = getNewValue(item);
  const action = getAction(item);
  const checkValue = toComplex(value);
  const checkNewValue = toComplex(newValue);
  switch (action) {
    case 'added':
      return `Property '${key}' was added with value: ${checkValue}`;
    case 'removed':
      return `Property '${key}' was removed`;
    case 'changed':
      return `Property '${key}' was updated. From ${checkValue} to ${checkNewValue}`;
    default:
      return [];
  }
};

const formatePlain = (array) => {
  const result = array.filter((item) => item.action !== 'unchanged').map(getPlain).flat();
  return result.join('\n');
};

export default formatePlain;
