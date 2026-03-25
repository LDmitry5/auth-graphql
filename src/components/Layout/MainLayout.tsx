import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { SearchPanel } from "./SearchPanel";
import { ObjectTree } from "../Tree/ObjectTree";
import { ObjectDetails } from "../Content/ObjectDetails";
import type { TreeNode } from "../../types";
import "./MainLayout.css";

interface SearchFilters {
  assigned: "all" | "yes" | "no";
  inLibrary: "all" | "yes" | "no";
}

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    assigned: "all",
    inLibrary: "all",
  });

  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="main-layout">
      <header className="app-header">
        <div className="user-info">
          <span>
            👤 {user?.firstName} {user?.lastName}
          </span>
          <button onClick={logout} className="logout-btn">
            Выйти
          </button>
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
