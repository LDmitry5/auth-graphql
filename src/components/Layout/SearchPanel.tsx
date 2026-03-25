import React, { useState } from "react";
import "./SearchPanel.css";

interface SearchFilters {
  assigned: "all" | "yes" | "no";
  inLibrary: "all" | "yes" | "no";
}

interface SearchPanelProps {
  onSearchChange: (term: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

const DropdownWithCheckbox: React.FC<{
  label: string;
  value: SearchFilters[keyof SearchFilters];
  onChange: (value: "all" | "yes" | "no") => void;
}> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDisplayText = () => {
    switch (value) {
      case "yes":
        return "Да";
      case "no":
        return "Нет";
      default:
        return "Все";
    }
  };

  return (
    <div className="dropdown-container">
      <label>{label}:</label>
      <div className="dropdown" onClick={() => setIsOpen(!isOpen)}>
        {getDisplayText()} ▼
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {(["all", "yes", "no"] as const).map((option) => (
            <label key={option} className="dropdown-item">
              <input
                type="radio"
                name={label}
                checked={value === option}
                onChange={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              />
              {option === "all" ? "Все" : option === "yes" ? "Да" : "Нет"}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export const SearchPanel: React.FC<SearchPanelProps> = ({ onSearchChange, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    assigned: "all",
    inLibrary: "all",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: "all" | "yes" | "no") => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="search-panel">
      <div className="search-input-wrapper">
        <input type="text" placeholder="Поиск по объектам..." value={searchTerm} onChange={handleSearchChange} className="search-input" />
      </div>

      <div className="filters-wrapper">
        <DropdownWithCheckbox label="Присвоенные" value={filters.assigned} onChange={(val) => handleFilterChange("assigned", val)} />

        <DropdownWithCheckbox label='В "Библиотеке"' value={filters.inLibrary} onChange={(val) => handleFilterChange("inLibrary", val)} />
      </div>
    </div>
  );
};
