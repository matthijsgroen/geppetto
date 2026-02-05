export type FileReference = {
  name: string;
  mime: string;
  offset: number; // relative to BIN start
  length: number;
};

export type FileEntry = {
  name: string;
  mime: string;
  data: Uint8Array;
};
