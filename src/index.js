const getAction = (obj) => obj.type;
const getValue = (obj) => (obj.value === undefined ? obj.oldValue : obj.value);
const getNewValue = (obj) => obj.newValue;
const getKey = (obj) => obj.key;
const getChildren = (obj) => obj.children;
const getAncestor = (key, ancestor) => (ancestor !== '' ? `${ancestor}.${key}` : key);

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
  getChildren,
  getAncestor,
  isObject,
};
