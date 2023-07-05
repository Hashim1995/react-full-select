import React, { useRef, useState } from "react";
import "./TreeSelect.scss";
import useOnClickOutside from "./useOutSideHook";
import { findById } from "./utils";
import { IOption } from "./types";

interface TreeSelectProps {
  options: IOption[];
  isMulti?: boolean;
  placeholder?: string;
  defaultValue?: IOption | IOption[];
  onChange?: (selectedValues: IOption) => void;
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  options,
  placeholder = "search",
  isMulti = true,
  defaultValue,
  onChange = () => {},
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const treeRef = useRef();

  const [selectedValues, setSelectedValues] = useState<IOption[]>(
    Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  );

  const handleOptionClick = (option: IOption) => {
    let newSelectedValues;
    if (isMulti) {
      if (findById(selectedValues, option?.value)) {
        newSelectedValues = selectedValues.filter(
          (v) => v?.value !== option?.value
        );
      } else {
        newSelectedValues = [...selectedValues, option];
      }
    } else {
      newSelectedValues = [option];
    }
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const renderOptions = (options: IOption[]) => {
    return options.map((option: IOption) => (
      <li key={option.value} className="tree-select__option">
        <div
          className="tree-select__option-label"
          onClick={() => handleOptionClick(option)}
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

  const filteredOptions = options.filter((option: IOption) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  useOnClickOutside(treeRef, () => {
    setShowOptions(false);
  });

  return (
    <div ref={treeRef} className="tree-select">
      <div className="tree-select__input">
        <div className="tree-select__selected-items">
          {selectedValues.map((item) => (
            <span key={item?.value} className="tree-select__selected-item">
              {item?.label}
              <button
                className="tree-select__remove-button"
                onClick={() => handleOptionClick(item)}
              >
                &#x2715;
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="tree-select__search-input"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
        />
        <span
          onClick={() => setShowOptions(!showOptions)}
          className={`tree-select__arrow ${showOptions ? "up" : "down"}`}
        >
          &uarr;
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
