import React, { FunctionComponent } from "react";
import CodeBlock from "@theme/CodeBlock";

type TypeDecl =
  | undefined
  | { type: string; name: string; typeArguments?: TypeDecl[] }
  | { type: string; declaration: DocItem };

interface DocItem {
  id: number;
  name: string;
  kind: number;
  kindString: string;
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

type Props = {
  api: DocItem;
  element: string;
  title?: string;
};

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

const generateParameters = (signature: DocItem): string => {
  if (signature.parameters) {
    return signature.parameters
      .map((parameter) => `${parameter.name}: ${generateType(parameter.type)}`)
      .join(", ");
  }
  return "";
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
  "",
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
    "",
  ];
};

const generateDocs = (docItem: DocItem, withComments = true): string[] => {
  if (docItem.kindString === "Interface") {
    return [
      ...commentBlock(docItem),
      `interface ${docItem.name} {`,
      ...generateProperties(docItem),
      "};",
      "",
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
          "",
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
      "",
    ];
  } else return [`// soon support for ${docItem.kindString}`];
};

const APIDocumentation: FunctionComponent<Props> = ({
  api,
  element,
  title,
}) => {
  const item = api.children.find((e) => e.name === element);
  const code = generateDocs(item).join("\n");
  return (
    <CodeBlock className="language-tsx" title={title}>
      {code}
    </CodeBlock>
  );
};

export const MethodSignature: FunctionComponent<Props> = ({
  api,
  element,
  title,
}) => {
  const item = api.children.find((e) => e.name === element);
  const signature = item.signatures[0];

  const parameters = (signature.parameters || []).map((docItem) => ({
    name: docItem.name,
    type: generateType(docItem.type),
    text: docItem.comment.text,
  }));

  const code = generateDocs(item, false).join("\n");
  return (
    <>
      <p>{signature.comment.shortText}</p>
      {signature.comment.text && <p>{signature.comment.text}</p>}
      {parameters.length > 0 && (
        <>
          <h4>Parameters</h4>
          <ul>
            {parameters.map(({ name, type, text }) => (
              <li key={name}>
                <strong>{name}</strong> <code>{type}</code> {text}
              </li>
            ))}
          </ul>
        </>
      )}
      <CodeBlock className="language-tsx">{code}</CodeBlock>
    </>
  );
};

export default APIDocumentation;
