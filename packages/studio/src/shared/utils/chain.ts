export const chain = <T>(...fns: Array<() => (file: T) => T>) => {
  return (file: T) => {
    return fns.reduce((currentFile, fn) => fn()(currentFile), file);
  };
};
