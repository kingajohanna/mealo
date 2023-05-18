export const hashCode = function (s: string) {
  return s
    .split("")
    .reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
    .toString();
};
