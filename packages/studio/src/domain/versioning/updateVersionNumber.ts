export const updateVersionNumber = <File extends { version: unknown }>(
  imageDef: File,
  version: File["version"]
): File => ({
  ...imageDef,
  version,
});
