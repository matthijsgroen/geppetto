# @geppetto/types

TypeScript type definitions for Geppetto animation file format version 2.x

## Overview

This package contains all type definitions and validators for the Geppetto file format 2.x. It provides a strongly-typed interface for working with Geppetto animation files.

## Usage

```typescript
import { GeppettoImage, isFormat2File, MutationVector } from '@geppetto/types';

// Type guard to check if a file is format 2.x
if (isFormat2File(data)) {
  // data is now typed as GeppettoImage
  console.log(data.version); // "2.0", "2.1", etc.
}
```

## Package Structure

The types are organized by category:

- **common.ts** - Basic types like `Vec2`
- **hierarchy.ts** - Tree structure types
- **layers.ts** - Layer and folder definitions
- **mutations.ts** - All mutation vector types (deform, rotate, translate, etc.)
- **controls.ts** - Control and keyframe definitions
- **animations.ts** - Animation track and event types
- **image.ts** - Main `GeppettoImage` type
- **validators.ts** - Type guard functions

## Format Version

This package follows the Geppetto file format version (2.x). The package version aligns with the file format version it supports.

## License

MIT
