import _ from 'lodash';

const getPrefix = (action) => {
  switch (action) {
    case 'Add':
      return '+ ';
    case 'Remove':
      return '- ';
    case '-Update':
      return '- ';
    case '+Update':
      return '+ ';
    default:
      return '';
  }
};

const getNewKey = (key, prefix) => {
  const keys = key.split('.');
  const depth = keys.length - 1;
  keys[depth] = `${prefix}${keys[depth]}`;
  return keys.join('.');
};

const formateStylish = (array) => {
  const raw = array.reduce((acc, obj) => {
    const { key, value, action } = obj;
    const temp = { ...acc };
    const prefix = getPrefix(action);
    const newKey = getNewKey(key, prefix);
    _.set(temp, newKey, value);
    return temp;
  }, {});
  const result = JSON.stringify(raw, null, '\t')
    .replaceAll(/,|"/g, '')
    .replaceAll('\t', '    ')
    .replaceAll('  -', '-')
    .replaceAll('  +', '+')
    .replaceAll(/ \n/g, '\n');
  return result;
};

const getStyle = (style) => {
  switch (style) {
    case 'stylish':
      return formateStylish;
    default:
      return formateStylish;
  }
};

const formate = (array, style) => {
  const fun = getStyle(style);
  return fun(array);
};

export default formate;
