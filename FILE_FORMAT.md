# Geppetto File Format (.gep)

```
┌──────────────┐
│ Header       │  fixed 32 bytes
├──────────────┤
│ JSON chunk   │  UTF-8 metadata
├──────────────┤
│ BIN chunk    │  raw binary assets
└──────────────┘
```

## Header 32 bytes, little endian

| Offset | Size | Type    | Meaning               |
| ------ | ---- | ------- | --------------------- |
| 0      | 4    | char[4] | Magic "GEP1"          |
| 4      | 4    | uint32  | Total file length     |
| 8      | 4    | uint32  | JSON chunk offset     |
| 12     | 4    | uint32  | JSON chunk length     |
| 16     | 4    | uint32  | BIN chunk offset      |
| 20     | 4    | uint32  | BIN chunk length      |
| 24     | 8    | uint64  | Reserved (future use) |

## Implementation

Reader: @geppetto/types fileReader
Writer: @geppetto/types fileWriter
