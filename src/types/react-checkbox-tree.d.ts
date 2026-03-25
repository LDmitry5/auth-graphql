declare module "react-checkbox-tree" {
  import * as React from "react";

  export interface CheckboxTreeNode {
    value: string | number;
    label: string | React.ReactNode;
    children?: CheckboxTreeNode[];
    disabled?: boolean;
    icon?: React.ReactNode;
    title?: string;
  }

  export interface CheckboxTreeProps {
    nodes: CheckboxTreeNode[];
    checked: (string | number)[];
    expanded: (string | number)[];
    onCheck: (checked: (string | number)[]) => void;
    onExpand: (expanded: (string | number)[]) => void;
    onClick?: (node: CheckboxTreeNode) => void;
    showExpandAll?: boolean;
    expandOnClick?: boolean;
    noCascade?: boolean;
    icons?: {
      check?: React.ReactNode;
      uncheck?: React.ReactNode;
      halfCheck?: React.ReactNode;
      expandClose?: React.ReactNode;
      expandOpen?: React.ReactNode;
    };
  }

  const CheckboxTree: React.FC<CheckboxTreeProps>;
  export default CheckboxTree;
}
