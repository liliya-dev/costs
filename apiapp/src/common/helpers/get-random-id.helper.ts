function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomId(length) {
  if (length <= 0) {
    throw new Error('Length must be a positive integer.');
  }
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return getRandomInt(min, max);
}
