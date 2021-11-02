export type TypeDecl =
  | undefined
  | { type: string; name: string; typeArguments?: TypeDecl[] }
  | { type: string; declaration: DocItem };

export interface DocItem {
  id: number;
  name: string;
  kind: number;
  kindString: string;
  flags: {
    isOptional?: boolean;
  };
  comment?: {
    shortText: string;
    text?: string;
    tags?: { tag: string; text: string }[];
  };
  children?: DocItem[];
  signatures?: DocItem[];
  parameters?: DocItem[];
  type?: TypeDecl;
}

const blockCommentStr = (text: string): string[] =>
  text.split("\n").map((line) => ` * ${line}`);

const commentBlock = (docItem: DocItem): string[] => {
  if (!docItem.comment) return [];
  return [
    "",
    "/**",
    ...blockCommentStr(docItem.comment.shortText),
    ...(docItem.comment.text
      ? [" *", ...blockCommentStr(docItem.comment.text)]
      : []),
    ...(docItem.parameters
      ? docItem.parameters.flatMap((parameter) =>
          parameter.comment
            ? blockCommentStr(
                `@parameter ${parameter.name} ${parameter.comment.text}`
              )
            : []
        )
      : []),
    ...(docItem.comment.tags
      ? docItem.comment.tags.map(({ tag, text }) => ` * @${tag} ${text.trim()}`)
      : []),
    " **/",
  ];
};

const indent = (lines: string[]): string[] => lines.map((line) => `  ${line}`);

const generateParameters = (signature: DocItem, withTypes = true): string => {
  if (signature.parameters) {
    return signature.parameters
      .map((parameter) =>
        withTypes
          ? `${parameter.name}${
              parameter.flags.isOptional ? "?" : ""
            }: ${generateType(parameter.type)}`
          : parameter.flags.isOptional
          ? `[${parameter.name}]`
          : parameter.name
      )
      .join(", ");
  }
  return "";
};

const collectTypes = (itemType: TypeDecl): string[] => {
  if (!itemType) return [];
  if ("name" in itemType && !("typeArguments" in itemType))
    return [itemType.name];
  if ("name" in itemType && itemType.typeArguments)
    return [itemType.name, ...itemType.typeArguments.map(generateType)];
  if ("declaration" in itemType) {
    const signatures = itemType.declaration.signatures;
    if (!signatures || signatures.length === 0) return [];
    const signature = signatures[0];

    return [
      ...(signature.parameters || []).flatMap((parameter) =>
        collectTypes(parameter.type)
      ),
      ...collectTypes(signature.type),
    ];
  }
  return [];
};

const generateType = (itemType: TypeDecl): string => {
  if (!itemType) return "unknown";
  if ("name" in itemType && !("typeArguments" in itemType))
    return itemType.name;
  if ("name" in itemType && itemType.typeArguments)
    return `${itemType.name}<${itemType.typeArguments
      .map(generateType)
      .join(", ")}>`;
  if ("declaration" in itemType) {
    const signatures = itemType.declaration.signatures;
    if (!signatures || signatures.length === 0) return "unknown";
    const signature = signatures[0];

    return `(${generateParameters(signature)}) => ${generateType(
      signature.type
    )}`;
  }

  return "unknown";
};

const getSignature = (docItem: DocItem): DocItem | undefined => {
  if (
    docItem.kindString === "Method" &&
    docItem.signatures &&
    docItem.signatures.length > 0
  ) {
    return docItem.signatures[0];
  }
  if (docItem.type && "declaration" in docItem.type) {
    const signatures = docItem.type.declaration.signatures;
    return signatures ? signatures[0] : undefined;
  }
  return undefined;
};

const generateMethodSignature = (
  docItem: DocItem,
  withTypes = true
): string => {
  const signature = getSignature(docItem);
  if (!signature) return "";

  return withTypes
    ? `${docItem.name}(${generateParameters(signature)}): ${generateType(
        signature.type
      )}`
    : `${docItem.name}(${generateParameters(signature, false)})`;
};

const generateProperties = (docItem: DocItem): string[] =>
  docItem.children
    ? docItem.children.flatMap((child) => {
        if (
          child.kindString === "Method" &&
          child.signatures &&
          child.signatures.length > 0
        ) {
          const signature = child.signatures[0];
          return indent([
            ...commentBlock(signature),
            `${child.name}(${generateParameters(signature)}): ${generateType(
              signature.type
            )};`,
          ]);
        }
        return indent([
          ...commentBlock(child),
          `${child.name}: ${generateType(child.type)};`,
        ]);
      })
    : [];

const generateObjectType = (docItem: DocItem): string[] => [
  ...commentBlock(docItem),
  `type ${docItem.name} = {`,
  ...(docItem.type && "declaration" in docItem.type
    ? generateProperties(docItem.type.declaration)
    : []),
  "};",
];

const generateMethodType = (docItem: DocItem): string[] => {
  if (!docItem.type) return [];
  if (!("declaration" in docItem.type)) return [];
  if (!docItem?.type?.declaration?.signatures) return [];
  if (docItem?.type?.declaration?.signatures?.length === 0) return [];
  const signature = docItem.type.declaration.signatures[0];

  return [
    ...commentBlock(docItem),
    `type ${docItem.name} = (${generateParameters(signature)}): ${generateType(
      signature.type
    )};`,
  ];
};

const generateDocs = (docItem: DocItem, withComments = true): string[] => {
  if (docItem.kindString === "Interface") {
    return [
      ...commentBlock(docItem),
      `interface ${docItem.name} {`,
      ...generateProperties(docItem),
      "};",
    ];
  } else if (docItem.kindString === "Type alias") {
    if (!docItem.type) return [];
    return "declaration" in docItem.type
      ? docItem.type.declaration.children
        ? generateObjectType(docItem)
        : generateMethodType(docItem)
      : [
          ...commentBlock(docItem),
          `type ${docItem.name} = ${docItem.type.name}`,
        ];
  } else if (docItem.kindString === "Function") {
    if (!docItem.signatures) return [];
    if (docItem.signatures.length === 0) return [];
    const signature = docItem.signatures[0];

    return [
      ...(withComments ? commentBlock(signature) : []),
      `const ${docItem.name} = (${generateParameters(
        signature
      )}): ${generateType(signature.type)};`,
    ];
  } else return [`// soon support for ${docItem.kindString}`];
};

const methodArguments = (
  signature: DocItem | undefined,
  api: DocItem,
  filter: (item: string) => boolean
): string => {
  if (!signature) return "";
  const result = [];
  result.push("", `Returns \`${generateType(signature.type)}\``, "");

  const parameters = (signature.parameters || []).map((docItem) => ({
    name: docItem.name,
    displayType: generateType(docItem.type),
    types: collectTypes(docItem.type),
    text:
      docItem.comment && docItem.comment.text
        ? processLinks(docItem.comment.text)
        : "",
  }));
  if (parameters.length > 0) {
    result.push(
      "#### Arguments",
      "",
      ...parameters.map(
        ({ name, displayType, text }) =>
          `- **${name}** \`${displayType}\` ${text}`
      )
    );
  }

  const extraCodeBlocks = [
    ...parameters
      .map((p) => api.children?.find((c) => p.types.includes(c.name)))
      .filter(Boolean)
      .flatMap((x) => (x ? generateDocs(x) : [])),
    ...(api.children || [])
      .filter(
        (c) => collectTypes(signature.type).includes(c.name) && filter(c.name)
      )
      .flatMap((x) => generateDocs(x)),
  ];
  if (extraCodeBlocks.length > 0) {
    result.push("", "```tsx", extraCodeBlocks.join("\n"), "```");
  }

  return result.join("\n");
};

const processLinks = (text: string): string =>
  text.replace(
    /\{\s*@link\s+([\w]+)}/g,
    (_, capture) => `[${capture}](#${capture.toLocaleLowerCase()})`
  );

const comment = (docItem: DocItem): string => {
  if (!docItem.comment) return "";
  return [
    ...(docItem.comment.shortText
      ? [processLinks(docItem.comment.shortText), ""]
      : []),
    ...(docItem.comment.text ? [processLinks(docItem.comment.text), ""] : []),
  ].join("\n");
};

export const methodSignature = (api: DocItem, methodSignature: string) => {
  const item = api.children?.find((e) => e.name === methodSignature);
  const signature = item?.signatures?.[0];
  if (!signature) return "";

  const code = generateDocs(item, false).join("\n");

  return `
## ${methodSignature}

${comment(signature)}
${methodArguments(signature, api, () => false)}

\`\`\`tsx
${code}
\`\`\``;
};

export const objectAPI = (
  api: DocItem,
  objectName: string,
  omitReturnTypes: string[] = []
): string => {
  const item = api.children?.find((e) => e.name === objectName);
  if (!item) return "";
  const methods: DocItem[] =
    item.type && "declaration" in item.type
      ? item.type.declaration.children ?? []
      : [];

  return `
## ${objectName}

${comment(item)}
${methods
  .map(
    (method) =>
      `
### ${generateMethodSignature(
        method,
        false
      )} {#${objectName.toLowerCase()}-${method.name.toLocaleLowerCase()}}

${comment(method)}
${
  (method.signatures &&
    method.signatures[0].comment &&
    processLinks(method.signatures[0].comment.shortText)) ??
  ""
}
${methodArguments(
  getSignature(method),
  api,
  (name) => !omitReturnTypes.includes(name)
)}
`
  )
  .join("\n")}
`;
};
