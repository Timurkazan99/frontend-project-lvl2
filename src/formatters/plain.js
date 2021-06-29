import {
  getAction,
  getValue,
  getNewValue,
  getKey,
  getChildren,
  getAncestor,
  isObject,
} from '../index.js';

const actionNotUnchanged = (item) => getAction(item) !== 'unchanged';

const toComplex = (val) => {
  if (isObject(val)) {
    return '[complex value]';
  }
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  return val;
};

const getPlain = (item, ancestor, fun) => {
  const key = getAncestor(getKey(item), ancestor);
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
    case 'nested':
      return fun(getChildren(item), key);
    default:
      return [];
  }
};

const formatePlain = (array) => {
  const iter = (coll, ancestor = '') => {
    const innerResult = coll
      .filter(actionNotUnchanged)
      .map((item) => getPlain(item, ancestor, iter));
    return innerResult.join('\n');
  };
  return iter(array);
};

export default formatePlain;
