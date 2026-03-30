import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { SearchPanel } from "./SearchPanel";
import { ObjectTree } from "../Tree/ObjectTree";
import { ObjectDetails } from "../Content/ObjectDetails";
import type { TreeNode } from "../../types";
import "./MainLayout.css";
import { Button } from "@alphacore/ui-kit";

interface SearchFilters {
  assigned: { yes: boolean; no: boolean };
  inLibrary: { yes: boolean; no: boolean };
}

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    assigned: { yes: true, no: true },
    inLibrary: { yes: true, no: true },
  });

  // Обработчик выбора узла
  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="main-layout">
      <header className="app-header">
        <div className="user-info">
          <span>👤 {user?.name}</span>
          <Button variant="red" onClick={logout}>
            Выйти
          </Button>
        </div>
        <SearchPanel onSearchChange={setSearchTerm} onFilterChange={setFilters} />
      </header>

      <div className="main-content">
        <aside className="tree-panel">
          <ObjectTree onSelect={handleNodeSelect} searchTerm={searchTerm} filters={filters} />
        </aside>

        <main className="content-panel">
          <ObjectDetails selectedNode={selectedNode} />
        </main>
      </div>
    </div>
  );
};
