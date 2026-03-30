import React, { useState } from "react";
import "./SearchPanel.css";
import { Input, Select } from "@alphacore/ui-kit";

interface FilterState {
  yes: boolean;
  no: boolean;
}

interface SearchFilters {
  assigned: FilterState;
  inLibrary: FilterState;
}

interface SearchPanelProps {
  onSearchChange: (term: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

interface DropdownWithCheckbox {
  label: string;
  value: FilterState;
  onChange: (value: FilterState) => void;
}

const DropdownWithCheckbox: React.FC<DropdownWithCheckbox> = ({ label, value, onChange }) => {
  const options = [
    { label: "Да", value: "yes" as const },
    { label: "Нет", value: "no" as const },
  ];

  const handleToggle = (key: "yes" | "no") => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <Select
      singleChoice={false}
      name={`filter-${label}`}
      variant="fill"
      placeholder={label}
      onSelect={(selectedField) => {
        // При клике на опцию переключаем чекбокс
        const key = selectedField.value as "yes" | "no";
        handleToggle(key);
      }}
      style={{ width: "180px" }}
      options={options.map((opt) => ({
        ...opt,
        checked: value[opt.value],
      }))}
      onRemove={(removedField) => {
        // При удалении снимаем чекбокс
        const key = removedField.value as "yes" | "no";
        handleToggle(key);
      }}
      errorHidden={true}
    />
  );
};

export const SearchPanel: React.FC<SearchPanelProps> = ({ onSearchChange, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    assigned: { yes: false, no: false },
    inLibrary: { yes: false, no: false },
  });

  // Дебаунс для поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (key: "assigned" | "inLibrary", newValue: { yes: boolean; no: boolean }) => {
    const newFilters = { ...filters, [key]: newValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="search-panel">
      <div className="search-input-wrapper">
        <Input
          placeholder="Найти классы"
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          errorHidden={true}
        />
      </div>

      <div className="filters-wrapper">
        <DropdownWithCheckbox
          label="Присвоенные"
          value={filters.assigned}
          onChange={(val) => handleFilterChange("assigned", val)}
        />

        <DropdownWithCheckbox
          label='В "Библиотеке"'
          value={filters.inLibrary}
          onChange={(val) => handleFilterChange("inLibrary", val)}
        />
      </div>
    </div>
  );
};
