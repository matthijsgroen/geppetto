declare module "*.css" {
  const value: Record<string, string>;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.json" {
  const value: JSON;
  export default value;
}
