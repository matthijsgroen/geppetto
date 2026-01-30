export const formatTime = (timeInMs: number): string => {
  const totalSeconds = Math.floor(timeInMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = timeInMs % 1000;

  if (timeInMs < 1_000) {
    return `${milliseconds} ms`;
  }

  if (timeInMs < 60_000) {
    return `${Math.round(timeInMs) / 1000} s`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}${milliseconds > 0 ? `.${String(milliseconds).padStart(3, "0")}` : ""}`;
};
