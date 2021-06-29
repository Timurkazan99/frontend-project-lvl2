const getAction = (obj) => obj.action;
const getValue = (obj) => obj.value;
const getNewValue = (obj) => obj.newValue;
const getKey = (obj) => obj.key;

const isObject = (val) => {
  if (val === null) {
    return false;
  }
  return typeof val === 'object';
};

export {
  getAction,
  getValue,
  getNewValue,
  getKey,
  isObject,
};
