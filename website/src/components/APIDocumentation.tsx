import React, { FunctionComponent } from "react";
import CodeBlock from "@theme/CodeBlock";
import heading from "@theme/Heading";

const LinkHeading = heading("h3");

type TypeDecl =
  | undefined
  | { type: string; name: string; typeArguments?: TypeDecl[] }
  | { type: string; declaration: DocItem };

interface DocItem {
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

const getSignature = (docItem: DocItem): DocItem => {
  if (
    docItem.kindString === "Method" &&
    docItem.signatures &&
    docItem.signatures.length > 0
  ) {
    return docItem.signatures[0];
  }
  if ("declaration" in docItem.type) {
    const signatures = docItem.type.declaration.signatures;
    return signatures[0];
  }
  return undefined;
};

const generateMethodSignature = (
  docItem: DocItem,
  withTypes = true
): string => {
  const signature = getSignature(docItem);

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

const Arguments: FunctionComponent<{
  signature: DocItem;
  api: DocItem;
  addReturnTypeInfo?: (type: string) => boolean;
}> = ({ signature, api, addReturnTypeInfo = () => true }) => {
  const parameters = (signature.parameters || []).map((docItem) => ({
    name: docItem.name,
    displayType: generateType(docItem.type),
    types: collectTypes(docItem.type),
    text: docItem.comment ? docItem.comment.text : "",
  }));

  const extraCodeBlocks = [
    ...parameters
      .map((p) => api.children.find((c) => p.types.includes(c.name)))
      .filter(Boolean)
      .flatMap(generateDocs),
    ...api.children
      .filter(
        (c) =>
          collectTypes(signature.type).includes(c.name) &&
          addReturnTypeInfo(c.name)
      )
      .flatMap(generateDocs),
  ];

  return parameters.length > 0 ? (
    <>
      <p>
        Returns <code>{generateType(signature.type)}</code>
      </p>
      <h4>Arguments</h4>
      <ul>
        {parameters.map(({ name, displayType, text }) => (
          <li key={name}>
            <strong>{name}</strong> <code>{displayType}</code> {text}
          </li>
        ))}
      </ul>
      {extraCodeBlocks.length > 0 && (
        <CodeBlock className="language-tsx">
          {extraCodeBlocks.join("\n")}
        </CodeBlock>
      )}
    </>
  ) : null;
};

export const MethodSignature: FunctionComponent<Props> = ({ api, element }) => {
  const item = api.children.find((e) => e.name === element);
  const signature = item.signatures[0];

  const code = generateDocs(item, false).join("\n");
  return (
    <>
      <p>{signature.comment.shortText}</p>
      {signature.comment.text && <p>{signature.comment.text}</p>}
      <Arguments
        signature={signature}
        api={api}
        addReturnTypeInfo={() => false}
      />
      <CodeBlock className="language-tsx">{code}</CodeBlock>
    </>
  );
};

export const ObjectMethods: FunctionComponent<
  Props & { omitReturnTypes?: string[] }
> = ({ api, element, omitReturnTypes = [] }) => {
  const item = api.children.find((e) => e.name === element);

  const methods: DocItem[] = item.type.declaration.children;

  return (
    <>
      <p>{item.comment.shortText}</p>

      {methods.map((method) => (
        <div key={method.name}>
          <LinkHeading id={`${element}-${method.name}`}>
            {generateMethodSignature(method, false)}
          </LinkHeading>
          {method.comment && <p>{method.comment.shortText}</p>}
          {method.signatures && method.signatures[0].comment && (
            <p>{method.signatures[0].comment.shortText}</p>
          )}
          <Arguments
            signature={getSignature(method)}
            api={api}
            addReturnTypeInfo={(name) => !omitReturnTypes.includes(name)}
          />
        </div>
      ))}
    </>
  );
};

export default APIDocumentation;
