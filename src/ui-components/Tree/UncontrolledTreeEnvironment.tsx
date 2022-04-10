import {
  UncontrolledTreeEnvironment as ComplexUncontrolledTreeEnvironment,
  UncontrolledTreeEnvironmentProps,
  TreeItem,
} from "react-complex-tree";
import { TreeData } from "./Tree";

const getItemTitle = (item: TreeItem<TreeData>): string => item.data.name;

type Props = Omit<
  UncontrolledTreeEnvironmentProps<TreeData>,
  "getItemTitle" | "viewState" | "treeId"
>;

export const UncontrolledTreeEnvironment: React.FC<Props> = ({
  children,
  ...props
}) => (
  <ComplexUncontrolledTreeEnvironment
    {...props}
    viewState={{}}
    getItemTitle={getItemTitle}
  >
    {children}
  </ComplexUncontrolledTreeEnvironment>
);
