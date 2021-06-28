import formateStylish from './stylish.js';
import formatePlain from './plain.js';

const getStyle = (style) => {
  switch (style) {
    case 'stylish':
      return formateStylish;
    case 'plain':
      return formatePlain;
    default:
      return formateStylish;
  }
};

const formate = (array, style) => {
  const fun = getStyle(style);
  return fun(array);
};

export default formate;
