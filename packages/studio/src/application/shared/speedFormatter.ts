export const formatSpeed = (speed: number) => {
  if (speed < 1) {
    return `${1 / speed}× slower`;
  }
  if (speed > 1) {
    return `${speed}× faster`;
  }
  return "Original speed";
};
