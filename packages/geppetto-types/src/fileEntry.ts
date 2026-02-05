export type FileEntry = {
  name: string;
  mime: string;
  offset: number; // relative to BIN start
  length: number;
};
