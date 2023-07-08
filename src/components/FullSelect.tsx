import React, { useCallback, useMemo, useRef, useState } from "react";
import "./TreeSelect.scss";
import useOnClickOutside from "./useOutSideHook";
import { findById, flatten } from "./utils";
import { IOption } from "./types";

interface TreeSelectProps {
  options: IOption[];
  isMulti?: boolean;
  placeholder?: string;
  isClearable: boolean;
  defaultValue?: IOption | IOption[];
  onChange?: (selectedValues: IOption | IOption[]) => void;
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  options,
  placeholder = "search",
  isMulti = true,
  isClearable,
  defaultValue,
  onChange = () => {},
}) => {
  const [searchValue, setSearchValue] = useState("");

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const treeRef = useRef();

  const [selectedValues, setSelectedValues] = useState<IOption | IOption[]>(
    isMulti ? [] : null
  );
  const memoizedFlatten = useCallback(flatten, []);

  const flattenSelectedValues = useMemo(() => {
    return Array.isArray(selectedValues)
      ? memoizedFlatten(selectedValues)
      : selectedValues;
  }, [selectedValues]);

  const handleOptionClick = (option: IOption, onlyParent) => {
    console.log(option, "akif");
    let newSelectedValues: IOption | IOption[];
    if (isMulti) {
      if (Array.isArray(selectedValues)) {
        if (findById(flattenSelectedValues, option?.value, false)) {
          if (isClearable) {
            newSelectedValues = selectedValues?.filter(
              (v) => v?.value !== option?.value
            );
          }
        } else {
          onlyParent && delete option.children;
          newSelectedValues = [...selectedValues, option];
        }
      } else {
        newSelectedValues = option;
      }
    } else {
      delete option?.children;
      if (isClearable && !Array.isArray(selectedValues)) {
        if (selectedValues?.value === option?.value) {
          newSelectedValues = null;
        } else {
          newSelectedValues = option;
        }
      } else {
        newSelectedValues = option;
      }
    }
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const renderOptions = (options: IOption[]) => {
    return options.map((option: IOption) => (
      <li key={self.crypto.randomUUID()} className={`tree-select__option`}>
        <div className="tree-select__option-wrapper">
          {isMulti && (
            <input
              type="checkbox"
              checked={checkIfOptionSelectedBool(option.value)}
              onChange={(e) => {
                handleOptionClick(option, false);
              }}
            />
          )}
          <div
            onClick={() => handleOptionClick(option, true)}
            className={`tree-select__option-label ${checkIfOptionSelected(
              option.value
            )}`}
          >
            {option.label}
          </div>
        </div>
        {option.children?.length > 0 && (
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

  const handleSelectedItems = (par: IOption | IOption[]) => {
    if (Array.isArray(par)) {
      return par?.map((item: IOption) => (
        <span
          key={self.crypto.randomUUID()}
          className="tree-select__selected-item"
        >
          {item?.label}
          {isClearable && (
            <button
              className="tree-select__remove-button"
              onClick={() => handleOptionClick(item, false)}
            >
              &#x2715;
            </button>
          )}
        </span>
      ));
    } else {
      return (
        <>
          {selectedValues && (
            <span className="tree-select__selected-item">{par?.label}</span>
          )}
        </>
      );
    }
  };
  const checkIfOptionSelected = (id: string) => {
    if (findById(flattenSelectedValues, id, false)) {
      return "tree-select__option-selected";
    }
    return "";
  };
  const checkIfOptionSelectedBool = (id: string) => {
    if (findById(flattenSelectedValues, id, false)) {
      return true;
    }
    return false;
  };

  return (
    <div ref={treeRef} className="tree-select">
      <div
        onClick={() => setShowOptions(!showOptions)}
        className="tree-select__input"
      >
        <div className="tree-select__selected-items">
          {handleSelectedItems(flattenSelectedValues)}
        </div>
        <input
          type="text"
          className="tree-select__search-input"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
        />
        {isClearable && selectedValues && (
          <span
            onClick={() => {
              setSelectedValues(null);
            }}
          >
            X
          </span>
        )}
        <span className={`tree-select__arrow ${showOptions ? "up" : "down"}`}>
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
