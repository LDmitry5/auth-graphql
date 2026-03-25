import React from "react";
import type { TreeNode } from "../../types";
import "./ObjectDetails.css";

interface ObjectDetailsProps {
  selectedNode: TreeNode | null;
}

export const ObjectDetails: React.FC<ObjectDetailsProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div className="object-details empty">
        <p>Выберите объект в дереве для просмотра описания</p>
      </div>
    );
  }

  return (
    <div className="object-details">
      <h3>{selectedNode.label}</h3>
      <div className="detail-row">
        <strong>ID:</strong> {selectedNode.id}
      </div>
      <div className="detail-row">
        <strong>Описание:</strong>
        <p>{selectedNode.description || "Описание отсутствует"}</p>
      </div>
      <div className="detail-row">
        <strong>Присвоен:</strong> {selectedNode.isAssigned ? "Да" : "Нет"}
      </div>
      <div className="detail-row">
        <strong>В библиотеке:</strong> {selectedNode.isInLibrary ? "Да" : "Нет"}
      </div>
    </div>
  );
};
