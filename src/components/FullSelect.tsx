import React, { useRef, useState } from "react";
import "./TreeSelect.scss";
import useOnClickOutside from "./useOutSideHook";

interface Option {
  id: string;
  label: string;
  children?: Option[];
}

interface TreeSelectProps {
  options: Option[];
  isMulti?: boolean;
  defaultValue?: string | string[];
  onChange?: (selectedValues: string | string[]) => void;
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  options,
  isMulti = false,
  defaultValue = "",
  onChange = () => {},
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const treeRef = useRef();

  const [selectedValues, setSelectedValues] = useState<string[]>(
    Array.isArray(defaultValue)
      ? defaultValue
      : defaultValue
      ? [defaultValue]
      : []
  );

  const handleOptionClick = (value: string) => {
    let newSelectedValues;
    if (isMulti) {
      if (selectedValues.includes(value)) {
        newSelectedValues = selectedValues.filter((v) => v !== value);
      } else {
        newSelectedValues = [...selectedValues, value];
      }
    } else {
      newSelectedValues = [value];
    }
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const renderOptions = (options: Option[]) => {
    return options.map((option: Option) => (
      <li key={option.id} className="tree-select__option">
        <div
          className="tree-select__option-label"
          onClick={() => handleOptionClick(option.id)}
        >
          {option.label}
        </div>
        {option.children && (
          <ul className="tree-select__option-children">
            {renderOptions(option.children)}
          </ul>
        )}
      </li>
    ));
  };

  const filteredOptions = options.filter((option: Option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  useOnClickOutside(treeRef, () => {
    setShowOptions(false);
  });

  return (
    <div ref={treeRef} className="tree-select">
      <div className="tree-select__input">
        <div className="tree-select__selected-items">
          {selectedValues.map((value) => (
            <span key={value} className="tree-select__selected-item">
              {options.find((option) => option.id === value)?.label}
              <button
                className="tree-select__remove-button"
                onClick={() => handleOptionClick(value)}
              >
                &#x2715;
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="tree-select__search-input"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
        />
        <span
          onClick={() => setShowOptions(!showOptions)}
          className="tree-select__arrow"
        >
          &#x25B6;
        </span>
      </div>
      {showOptions && (
        <ul className="tree-select__options">
          {renderOptions(filteredOptions)}
        </ul>
      )}
    </div>
  );
};

export default TreeSelect;
