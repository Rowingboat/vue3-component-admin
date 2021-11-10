export const SizeEnum = {
  DEFAULT: 'default',
  SMALL: 'small',
  LARGE: 'large',
};

export const SizeNumberEnum = {
  DEFAULT: 48,
  SMALL: 16,
  LARGE: 64,
};

export const sizeMap = (() => {
  const map = new Map();
  map.set(SizeEnum.DEFAULT, SizeNumberEnum.DEFAULT);
  map.set(SizeEnum.SMALL, SizeNumberEnum.SMALL);
  map.set(SizeEnum.LARGE, SizeNumberEnum.LARGE);
  return map;
})();