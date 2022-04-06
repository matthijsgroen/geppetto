import {
  UncontrolledTreeEnvironment,
  Tree as ComplexTree,
  TreeDataProvider as ComplexTreeDataProvider,
} from "react-complex-tree";
import "react-complex-tree/lib/style.css";
import "./Tree.module.css";

export type TreeData = {
  name: string;
};

export type TreeDataProvider = ComplexTreeDataProvider<TreeData>;

type TreeProps = {
  dataProvider: TreeDataProvider;
};

export const Tree: React.VFC<TreeProps> = ({ dataProvider }) => {
  return (
    <UncontrolledTreeEnvironment
      dataProvider={dataProvider}
      getItemTitle={(item) => item.data.name}
      viewState={{}}
    >
      <ComplexTree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
    </UncontrolledTreeEnvironment>
  );
};
