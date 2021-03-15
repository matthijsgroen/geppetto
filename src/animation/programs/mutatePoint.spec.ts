import {
  FolderDefinition,
  MutationVector,
  ShapeDefinition,
  SpriteDefinition,
} from "src/lib/types";
import { createMutationList } from "./mutatePoint";

describe("createMutationList", () => {
  const createFolder = (
    name: string,
    mutationVectors: MutationVector[],
    items: ShapeDefinition[]
  ): FolderDefinition => ({
    name,
    type: "folder",
    mutationVectors,
    items,
  });

  const createSprite = (
    name: string,
    mutationVectors: MutationVector[]
  ): SpriteDefinition => ({
    name,
    type: "sprite",
    points: [
      [0, 1],
      [1, 1],
    ],
    translate: [0, 0],
    mutationVectors,
  });

  it("returns a list of mutators as Vec4", () => {
    const shapes: ShapeDefinition[] = [
      createSprite("Layer1", [
        {
          name: "Mutator1",
          type: "translate",
          origin: [15, 1],
        },
      ]),
    ];

    const {
      shapeMutatorMapping,
      parentList,
      vectorSettings,
    } = createMutationList(shapes);

    expect(shapeMutatorMapping).toEqual({ Layer1: 0 });
    expect(parentList).toEqual(new Float32Array([-1]));
    expect(vectorSettings).toEqual([[1, 15, 1, 0]]);
  });

  it("attaches to mutation of parent", () => {
    const shapes: ShapeDefinition[] = [
      createFolder(
        "Folder1",
        [
          {
            name: "Mutator1",
            type: "translate",
            origin: [15, 1],
          },
        ],
        [createSprite("Layer1", [])]
      ),
    ];

    const {
      shapeMutatorMapping,
      parentList,
      vectorSettings,
    } = createMutationList(shapes);

    expect(shapeMutatorMapping).toEqual({ Folder1: 0, Layer1: 0 });
    expect(parentList).toEqual(new Float32Array([-1]));
    expect(vectorSettings).toEqual([[1, 15, 1, 0]]);
  });

  it("chains mutators together", () => {
    const shapes: ShapeDefinition[] = [
      createFolder(
        "Folder1",
        [
          {
            name: "Mutator1",
            type: "translate",
            origin: [15, 1],
          },
        ],
        [
          createSprite("Layer1", [
            {
              name: "Mutator2",
              type: "stretch",
              origin: [15, 1],
            },
          ]),
        ]
      ),
    ];

    const {
      shapeMutatorMapping,
      parentList,
      vectorSettings,
    } = createMutationList(shapes);

    expect(shapeMutatorMapping).toEqual({ Folder1: 0, Layer1: 1 });
    expect(parentList).toEqual(new Float32Array([-1, 0]));
    expect(vectorSettings).toEqual([
      [1, 15, 1, 0],
      [2, 15, 1, 0],
    ]);
  });

  it("can branch to multiple paths", () => {
    const shapes: ShapeDefinition[] = [
      createFolder(
        "Folder1",
        [
          {
            name: "Mutator1",
            type: "translate",
            origin: [15, 1],
          },
        ],
        [
          createSprite("Layer1", [
            {
              name: "Mutator2",
              type: "stretch",
              origin: [15, 1],
            },
            {
              name: "Mutator4",
              type: "translate",
              origin: [15, 1],
            },
          ]),
          createSprite("Layer2", [
            {
              name: "Mutator3",
              type: "rotate",
              origin: [15, 1],
            },
          ]),
        ]
      ),
    ];

    const {
      shapeMutatorMapping,
      parentList,
      vectorSettings,
    } = createMutationList(shapes);

    expect(shapeMutatorMapping).toEqual({ Folder1: 0, Layer1: 2, Layer2: 3 });
    expect(parentList).toEqual(new Float32Array([-1, 0, 1, 0]));
    expect(vectorSettings).toEqual([
      [1, 15, 1, 0],
      [2, 15, 1, 0],
      [1, 15, 1, 0],
      [3, 15, 1, 0],
    ]);
  });
});
