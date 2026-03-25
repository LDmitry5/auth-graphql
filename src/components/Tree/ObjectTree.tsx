import React, { useState, useMemo } from "react";
import CheckboxTree, { type Node as CheckboxTreeNode } from "react-checkbox-tree";
import { useQuery } from "@apollo/client/react";
import { GET_OBJECTS_QUERY } from "../../api/objects";
import type { TreeNode } from "../../types";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "./ObjectTree.css";

interface ObjectTreeProps {
  onSelect: (node: TreeNode) => void;
  searchTerm: string;
  filters: {
    assigned: "all" | "yes" | "no";
    inLibrary: "all" | "yes" | "no";
  };
}

// Рекурсивная функция для фильтрации дерева
const filterTree = (nodes: TreeNode[], term: string, filters: ObjectTreeProps["filters"]): TreeNode[] => {
  return nodes.reduce<TreeNode[]>((acc, node) => {
    // Проверка по поиску
    const matchesSearch = !term || node.label.toLowerCase().includes(term.toLowerCase());

    // Проверка по фильтрам
    const matchesAssigned =
      filters.assigned === "all" || (filters.assigned === "yes" && node.isAssigned) || (filters.assigned === "no" && !node.isAssigned);

    const matchesLibrary =
      filters.inLibrary === "all" || (filters.inLibrary === "yes" && node.isInLibrary) || (filters.inLibrary === "no" && !node.isInLibrary);

    if (matchesSearch && matchesAssigned && matchesLibrary) {
      const filteredChildren = node.children ? filterTree(node.children, term, filters) : undefined;

      // Показываем узел, если он соответствует критериям ИЛИ имеет подходящих детей
      if (matchesSearch && matchesAssigned && matchesLibrary) {
        acc.push({
          ...node,
          children: filteredChildren,
        });
      } else if (filteredChildren?.length) {
        acc.push({ ...node, children: filteredChildren });
      }
    }
    return acc;
  }, []);
};

// Конвертация в формат react-checkbox-tree
const convertToCheckboxTree = (nodes: TreeNode[]): CheckboxTreeNode[] => {
  return nodes.map((node) => ({
    value: node.id,
    label: node.label,
    children: node.children ? convertToCheckboxTree(node.children) : undefined,
  }));
};

export const ObjectTree: React.FC<ObjectTreeProps> = ({ onSelect, searchTerm, filters }) => {
  const { data, loading } = useQuery(GET_OBJECTS_QUERY);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);

  const treeData = useMemo(() => {
    if (!data?.objects) return [];
    const filtered = filterTree(data.objects, searchTerm, filters);
    return convertToCheckboxTree(filtered);
  }, [data, searchTerm, filters]);

  const handleExpandAll = () => {
    const getAllValues = (nodes: CheckboxTreeNode[]): string[] => {
      return nodes.flatMap((node) => [node.value, ...(node.children ? getAllValues(node.children) : [])]);
    };
    setExpanded(getAllValues(treeData));
  };

  const handleCollapseAll = () => {
    setExpanded([]);
  };

  const handleNodeClick = (value: string) => {
    // Находим полный объект по ID
    const findNode = (nodes: TreeNode[], id: string): TreeNode | undefined => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
      return undefined;
    };

    if (data?.objects) {
      const selected = findNode(data.objects, value);
      if (selected) onSelect(selected);
    }
  };

  if (loading) return <div className="tree-loading">Загрузка дерева...</div>;

  return (
    <div className="object-tree-container">
      <div className="tree-controls">
        <button onClick={handleExpandAll}>Развернуть все</button>
        <button onClick={handleCollapseAll}>Свернуть все</button>
      </div>

      <CheckboxTree
        nodes={treeData}
        checked={checked}
        expanded={expanded}
        onCheck={setChecked}
        onExpand={setExpanded}
        onClick={(node) => handleNodeClick(node.value)}
        showExpandAll={false}
        expandOnClick={true}
        noCascade={true}
        icons={{
          check: <span className="icon-check">✓</span>,
          uncheck: <span className="icon-uncheck">□</span>,
          halfCheck: <span className="icon-half">◑</span>,
          expandClose: <span className="icon-expand">▶</span>,
          expandOpen: <span className="icon-collapse">▼</span>,
        }}
      />
    </div>
  );
};
