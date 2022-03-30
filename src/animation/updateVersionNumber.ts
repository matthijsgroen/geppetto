type VersionFromFile<File> = File extends { version: infer Version }
  ? Version
  : unknown;

export const updateVersionNumber = <
  File extends { version: VersionFromFile<File> }
>(
  imageDef: File,
  version: VersionFromFile<File>
): File => ({
  ...imageDef,
  version,
});
