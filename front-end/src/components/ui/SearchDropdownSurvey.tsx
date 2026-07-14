import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

interface SearchDropdownProps {
  options: string[];
  placeholder: string;
  searchPlaceholder: string;
  value?: string;
  onChange: (value: string) => void;
  excludeItems?: string[];
  showSearch?: boolean;
  // Adicionadas as propriedades para suportar a lógica externa do Step1
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customNoResults?: React.ReactNode;
}

export const SearchDropdown = ({
  options,
  placeholder,
  searchPlaceholder,
  value,
  onChange,
  excludeItems = [],
  showSearch = true,
  searchValue,
  onSearchChange,
  customNoResults,
}: SearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sincroniza o termo de pesquisa usando a propriedade externa ou o estado local
  const search = searchValue !== undefined ? searchValue : localSearch;
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e);
    } else {
      setLocalSearch(e.target.value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(
      (option) =>
        option.toLowerCase().includes(search.toLowerCase()) &&
        !excludeItems.includes(option),
    );
  }, [options, search, excludeItems]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 border border-neutral-blue rounded-lg text-sm text-black bg-white focus:outline-none focus:border-[#003356] flex items-center justify-between"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 flex flex-col overflow-hidden">
          {showSearch && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-white">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full text-sm text-black focus:outline-none bg-transparent"
                autoFocus
              />
            </div>
          )}

          <div className="overflow-y-auto flex-1 py-1 max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    if (onSearchChange) {
                      // Reseta a busca externa simulando evento
                      onSearchChange({
                        target: { value: "" },
                      } as React.ChangeEvent<HTMLInputElement>);
                    } else {
                      setLocalSearch("");
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-black hover:bg-[#eaf5ff] flex items-center justify-between"
                >
                  <span>{option}</span>
                  {value === option && (
                    <Check size={16} className="text-[#0066b2]" />
                  )}
                </button>
              ))
            ) : // Se houver uma UI customizada de "Sem Resultados" injetada, nós a exibimos aqui!
            customNoResults ? (
              customNoResults
            ) : (
              <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mb-2">
                  <Search size={14} className="text-gray-400" />
                </div>
                <p className="text-xs font-bold text-black mb-0.5">
                  Busca não encontrada
                </p>
                <p className="text-[10px] text-gray-400 max-w-50">
                  Tente um termo diferente ou cadastre esse item no sistema.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
