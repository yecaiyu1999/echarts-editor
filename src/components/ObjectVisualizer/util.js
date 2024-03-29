export const objectToString = (thisArg) =>
  Object.prototype.toString.call(thisArg).slice(8, -1);
