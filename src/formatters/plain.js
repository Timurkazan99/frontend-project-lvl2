const toComplex = (val) => {
  if (val === null) {
    return val;
  }
  if (typeof val === 'object') {
    return '[complex value]';
  }
  if (typeof val === 'string') {
    return `'${val}'`;
  }
  return val;
};

const getPlain = (item) => {
  const {
    key, value, action, newValue,
  } = item;
  const checkValue = toComplex(value);
  const checkNewValue = toComplex(newValue);
  switch (action) {
    case 'Add':
      return `Property '${key}' was added with value: ${checkValue}`;
    case 'Remove':
      return `Property '${key}' was removed`;
    case '-Update':
      return `Property '${key}' was updated. From ${checkValue} to ${checkNewValue}`;
    default:
      return [];
  }
};

const formatePlain = (array) => {
  const result = array.filter((item) => {
    const { action } = item;
    const temp = (action !== 'nothing') && (action !== '+Update');
    return temp;
  }).map(getPlain).flat();
  return result.join('\n');
};

export default formatePlain;
