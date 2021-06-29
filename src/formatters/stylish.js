import _ from 'lodash';
import {
  getAction,
  getValue,
  getNewValue,
  getKey,
} from '../index.js';

const getNewKey = (key, prefix) => {
  const keys = key.split('.');
  const depth = keys.length - 1;
  const newKey = keys.map((subKey) => {
    if (keys.indexOf(subKey) !== depth) {
      return subKey;
    }
    return `${prefix} ${subKey}`;
  })
    .join('.');
  return newKey;
};

const getStylish = (acc, obj) => {
  const temp = { ...acc };
  const value = getValue(obj);
  const newValue = (getNewValue(obj) === null) ? 'null' : getNewValue(obj);
  const action = getAction(obj);
  const key = getKey(obj);
  switch (action) {
    case 'added':
      _.set(temp, getNewKey(key, '+'), value);
      break;
    case 'removed':
      _.set(temp, getNewKey(key, '-'), value);
      break;
    case 'changed':
      _.set(temp, getNewKey(key, '-'), value);
      _.set(temp, getNewKey(key, '+'), newValue);
      break;
    default:
      _.set(temp, key, value);
      break;
  }
  return temp;
};

const formateStylish = (array) => {
  const raw = array.reduce(getStylish, {});
  const result = JSON.stringify(raw, null, 2);
  return result;
};

export default formateStylish;
