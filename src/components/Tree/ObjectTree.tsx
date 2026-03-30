// components/Tree/ObjectTree.tsx
import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import { Button, Tree } from "@alphacore/ui-kit";
import { GET_TREE_QUERY } from "../../api/objects";
import type { TreeNode, TreeQueryResponse } from "../../types";
import "./ObjectTree.css";

interface ObjectTreeProps {
  onSelect: (node: TreeNode) => void;
  searchTerm: string;
  filters: {
    assigned: { yes: boolean; no: boolean };
    inLibrary: { yes: boolean; no: boolean };
  };
}

// Генерация фейковых данных для тестирования (если нет ответа от сервера)
const generateFakeTree = (): TreeNode => ({
  id: "root-1",
  label: "Корневой объект",
  name: "root_object",
  description: "Главный элемент иерархии",
  is_assigned: true,
  in_library: true,
  properties: [
    { name: "Тип", value: "Система", value_type: "string", measure: "" },
    { name: "Версия", value: "2.1.0", value_type: "string", measure: "" },
  ],
  relations: [{ name: "parent_of" }],
  children: [
    {
      id: "node-1",
      label: "Модуль А",
      name: "module_a",
      description: "Основной функциональный модуль",
      is_assigned: true,
      in_library: false,
      properties: [{ name: "Статус", value: "Активен", value_type: "string", measure: "" }],
      relations: [{ name: "depends_on" }],
      children: [
        {
          id: "node-1-1",
          label: "Компонент А.1",
          name: "component_a1",
          description: "Подкомпонент для обработки данных",
          is_assigned: false,
          in_library: true,
          properties: [{ name: "Приоритет", value: "Высокий", value_type: "string", measure: "" }],
          relations: [],
          children: [
            {
              id: "node-1-1-1",
              label: "Элемент А.1.1",
              name: "element_a11",
              description: "Базовый элемент",
              is_assigned: true,
              in_library: true,
              properties: [],
              relations: [],
            },
            {
              id: "node-1-1-2",
              label: "Элемент А.1.2",
              name: "element_a12",
              description: "Дополнительный элемент",
              is_assigned: false,
              in_library: false,
              properties: [],
              relations: [],
            },
          ],
        },
        {
          id: "node-1-2",
          label: "Компонент А.2",
          name: "component_a2",
          description: "Интерфейсный компонент",
          is_assigned: true,
          in_library: true,
          properties: [],
          relations: [],
        },
      ],
    },
    {
      id: "node-2",
      label: "Модуль Б",
      name: "module_b",
      description: "Вспомогательный модуль",
      is_assigned: false,
      in_library: true,
      properties: [],
      relations: [],
      children: [
        {
          id: "node-2-1",
          label: "Сервис Б.1",
          name: "service_b1",
          description: "Фоновый сервис",
          is_assigned: true,
          in_library: false,
          properties: [{ name: "Порт", value: "8080", value_type: "number", measure: "" }],
          relations: [],
        },
      ],
    },
  ],
});

// Рекурсивная фильтрация дерева
// ObjectTree.tsx
const filterTree = (nodes: TreeNode[], term: string, filters: ObjectTreeProps["filters"]): TreeNode[] => {
  return nodes.reduce<TreeNode[]>((acc, node) => {
    const matchesSearch = !term || node.label?.toLowerCase().includes(term.toLowerCase());

    // ✅ Фильтр "Присвоенные": показываем, если чекбокс совпадает
    const matchesAssigned =
      (filters.assigned.yes && node.is_assigned) ||
      (filters.assigned.no && !node.is_assigned) ||
      (!filters.assigned.yes && !filters.assigned.no); // если оба выключены — показываем всё

    // ✅ Фильтр "Библиотека"
    const matchesLibrary =
      (filters.inLibrary.yes && node.in_library) ||
      (filters.inLibrary.no && !node.in_library) ||
      (!filters.inLibrary.yes && !filters.inLibrary.no);

    const shouldIncludeNode = matchesSearch && matchesAssigned && matchesLibrary;
    const filteredChildren = node.children ? filterTree(node.children, term, filters) : [];

    if (shouldIncludeNode || filteredChildren.length > 0) {
      acc.push({ ...node, children: filteredChildren.length > 0 ? filteredChildren : undefined });
    }
    return acc;
  }, []);
};

// Вспомогательная функция: собрать все ID из дерева (для expand/collapse all)
const collectAllIds = (nodes: TreeNode[]): string[] => {
  return nodes.flatMap((node) => [String(node.id), ...(node.children ? collectAllIds(node.children) : [])]);
};

export const ObjectTree: React.FC<ObjectTreeProps> = ({ onSelect, searchTerm, filters }) => {
  const { data, loading, error } = useQuery<TreeQueryResponse>(GET_TREE_QUERY);

  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  // Подготовка данных: получение + фильтрация + конвертация ID
  const processedTreeData = useMemo(() => {
    let sourceNodes: TreeNode[] = [];

    const normalizeNode = (node: TreeNode): TreeNode => ({
      ...node,
      id: String(node.id),
      name: node.name?.trim() || node.label || "Без названия",
      label: node.label || node.name || "Без названия",
      children: node.children?.map(normalizeNode),
    });

    if (data?.tree) {
      sourceNodes = [normalizeNode(data.tree)];
    } else {
      sourceNodes = [generateFakeTree()];
    }

    // Применяем фильтры
    return filterTree(sourceNodes, searchTerm, filters);
  }, [data, searchTerm, filters]);

  // Обработчик выбора узла
  const handleSelectNode = useCallback(
    (node: TreeNode) => {
      // Обновляем выбранный узел
      setSelectedNodeIds([node.id]);
      onSelect(node);
    },
    [onSelect],
  );

  // Expand/Collapse all
  const handleExpandAll = useCallback(() => {
    const allIds = collectAllIds(processedTreeData);
    setExpandedNodeIds(new Set(allIds));
  }, [processedTreeData]);

  const handleCollapseAll = useCallback(() => {
    setExpandedNodeIds(new Set());
  }, []);

  if (error) {
    console.error("GraphQL Error:", error);
    return (
      <div className="tree-error" role="alert">
        Не удалось загрузить дерево. <button onClick={() => window.location.reload()}>Повторить</button>
      </div>
    );
  }

  if (loading && !data) {
    return <div className="tree-loading">Загрузка дерева...</div>;
  }

  if (processedTreeData.length === 0) {
    return (
      <div className="tree-empty">
        <p>Объекты не найдены</p>
        <small>Попробуйте изменить параметры фильтрации</small>
      </div>
    );
  }

  return (
    <div className="object-tree-container" role="tree">
      {/* Панель управления */}
      <div className="tree-controls">
        <div className="tree-controls-group">
          <Button onClick={handleExpandAll} type="button" title="Развернуть все узлы">
            Развернуть
          </Button>
          <Button onClick={handleCollapseAll} type="button" title="Свернуть все узлы">
            Свернуть
          </Button>
        </div>
      </div>

      <Tree
        treeData={processedTreeData}
        expandedNodes={expandedNodeIds}
        setExpandedNodes={setExpandedNodeIds}
        onSelectNode={handleSelectNode}
        selectedNodeIds={selectedNodeIds}
        withCheckbox={true}
        clearParent={true}
        height={400}
        width="100%"
      />

      <div className="tree-hint">💡 Клик ЛКМ по названию или кнопка &gt; для разворачивания</div>
    </div>
  );
};
