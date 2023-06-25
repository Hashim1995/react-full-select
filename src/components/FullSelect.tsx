import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { X, ChevronDown, ChevronUp, ChevronRight } from "react-feather";
import useOnClickOutside from "./useOutSideHook";
import "./FullSelect.css";

interface Option {
  value: string;
  label: string;
  children?: Option[];
  parent_label?: string;
  parent_id?: string;
  all?: boolean;
  not_select_able?: boolean;
}

interface TreeSelectProps {
  options?: Option[];
  isMulti?: boolean;
  isClearable?: boolean;
  onChange?: (value: Option[] | Option | null) => void;
  defaultValue?: Option | Option[] | null;
  name?: string;
  className?: string;
  disabled?: boolean;
  isParent?: boolean;
  isAllParent?: boolean;
  onRemove?: (value: Option | null) => void;
  onFocus?: () => void;
  isLoading?: boolean;
  defaultAllParent?: string[];
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TreeSelect = forwardRef<any, TreeSelectProps>(
  (
    {
      options = [],
      isMulti,
      isClearable,
      onChange,
      defaultValue,
      name,
      className,
      disabled,
      isParent,
      isAllParent,
      onRemove,
      onFocus,
      isLoading,
      defaultAllParent,
      onInputChange,
    },
    ref
  ) => {
    const iconRef = useRef<any>();
    const inputRef2 = useRef<any>();
    const spanRef = useRef<any>();
    const treeClear = useRef<any>();
    const dropdownRef = useRef<any>();
    const singleInputRef = useRef<any>();
    const valueContainerRef = useRef<any>();
    const [search, setSearch] = useState("");
    const [filterData, setFilterData] = useState<Option[]>([]);
    const [treeSelectCheckedValue, setTreeSelectCheckedValue] = useState<
      Option[]
    >([]);
    const [treeSelectValue, setTreeSelectValue] = useState<Option[]>([]);
    const [singleValue, setSingleValue] = useState<Option[]>([]);
    const [onlyParentSelect, setOnlyParentSelect] = useState<Option[]>([]);
    const [remove, setRemove] = useState<Option | null>(null);
    const [dropDownOver, setDropDownOver] = useState(false);
    const [treeClearOver, setTreeClearOver] = useState(false);
    const [show, setShow] = useState(false);
    const [reset, setReset] = useState(false);
    const [gap, setGap] = useState<number | null>(null);
    const [defaultVal, setDefaultVal] = useState<Option[] | Option | null>(
      null
    );
    const [change, setChange] = useState(false);
    const [allParent, setAllParent] = useState<string[] | null>(null);

    useImperativeHandle(ref, () => ({
      onReset() {
        setReset(true);
      },
    }));

    const sendData = (
      e: React.ChangeEvent<HTMLInputElement>,
      nodes: Option
    ) => {
      setDefaultVal(null);
      setChange(true);
      function flatten(items: Option[]) {
        const flat: Option[] = [];
        items?.forEach((item) => {
          flat.push(item);
          if (Array.isArray(item.children) && item.children.length > 0) {
            flat.push(...flatten(item.children));
          }
        });
        return flat;
      }

      const findValue = flatten(options)?.find(
        (find) => find?.value === nodes?.value
      );

      if (findValue) {
        if (isParent && !isMulti && !isAllParent) {
          setTreeSelectCheckedValue([]);
          setOnlyParentSelect([findValue]);
        } else if (isAllParent && !isMulti) {
          setTreeSelectCheckedValue([]);
          setOnlyParentSelect([findValue]);
        } else {
          setOnlyParentSelect([]);
          setTreeSelectCheckedValue([findValue]);
        }
      }

      if (!isParent && !isMulti) {
        setTreeSelectCheckedValue([]);
        setSingleValue([findValue]);
        onChange && onChange(findValue);
      } else if (isParent && !isMulti) {
        setTreeSelectCheckedValue([]);
        setTreeSelectValue([]);
        onChange && onChange(findValue);
      }
    };

    const isParentSelect = (nodes: Option, parent?: Option) => {
      if (nodes?.parent_id) {
        if (nodes?.parent_id === parent?.value) {
          return true;
        } else {
          return isParentSelect(nodes, parent?.parent_label ? nodes : parent);
        }
      }
      return false;
    };

    const allParentShow = () => {
      if (isParent && !isMulti && !isAllParent) {
        return allParent;
      }
      return null;
    };

    const treeSelectLabelClick = (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      nodes: Option
    ) => {
      e.stopPropagation();
      e.preventDefault();

      if (isMulti) {
        const find = treeSelectCheckedValue?.find(
          (f) => f.value === nodes.value
        );
        if (find) {
          const result = treeSelectCheckedValue?.filter(
            (f) => f.value !== find.value
          );
          setTreeSelectCheckedValue(result);
          onChange && onChange(result);
        } else {
          const result = [...(treeSelectCheckedValue || []), nodes];
          setTreeSelectCheckedValue(result);
          onChange && onChange(result);
        }
      } else {
        setTreeSelectCheckedValue([nodes]);
        onChange && onChange(nodes);
      }
    };

    const searchFilter = (value: string) => {
      const searchValue = value.toLowerCase();
      const filterResult: Option[] = [];

      const filter = (item: Option) => {
        if (item.label.toLowerCase().indexOf(searchValue) > -1) {
          filterResult.push(item);
        }
        if (Array.isArray(item.children)) {
          item.children.forEach(filter);
        }
      };

      options.forEach(filter);

      setFilterData(filterResult);
    };

    const clearInput = () => {
      setSearch("");
      setFilterData([]);
      inputRef2.current?.focus();
    };

    const treeBackSpaceDelet = () => {
      if (!search && treeSelectCheckedValue.length > 0) {
        const result = treeSelectCheckedValue.slice(
          0,
          treeSelectCheckedValue.length - 1
        );
        setTreeSelectCheckedValue(result);
        onChange && onChange(result);
      }
    };

    const onFocusInput = () => {
      setChange(false);
      setShow(true);
      onFocus && onFocus();
      setGap(valueContainerRef.current?.offsetHeight);
    };

    useEffect(() => {
      if (defaultValue) {
        setDefaultVal(defaultValue);
      }
    }, [defaultValue]);

    useEffect(() => {
      setReset(false);
    }, [reset]);

    useEffect(() => {
      if (!change) {
        setTreeSelectValue(treeSelectCheckedValue);
      }
    }, [treeSelectCheckedValue]);

    useEffect(() => {
      if (options) {
        if (defaultAllParent) {
          setAllParent(defaultAllParent);
        } else {
          const flattenOptions: Option[] = [];
          const flatten = (items: Option[]) => {
            items?.forEach((item) => {
              flattenOptions.push(item);
              if (Array.isArray(item.children) && item.children.length > 0) {
                flatten(item.children);
              }
            });
          };
          flatten(options);
          const allParentValue = flattenOptions
            .filter((item) => item.all)
            .map((item) => item.value);
          setAllParent(allParentValue);
        }
      }
    }, [options, defaultAllParent]);

    useOnClickOutside(dropdownRef, () => {
      setShow(false);
      setRemove(null);
    });

    useOnClickOutside(valueContainerRef, () => {
      setTreeClearOver(false);
    });

    useEffect(() => {
      if (isParent && !isMulti && !isAllParent && onlyParentSelect.length > 0) {
        onChange && onChange(onlyParentSelect[0]);
      }
    }, [onlyParentSelect]);

    useEffect(() => {
      if (reset) {
        setTreeSelectCheckedValue([]);
        setOnlyParentSelect([]);
        setSingleValue([]);
        onChange && onChange(null);
      }
    }, [reset]);

    useEffect(() => {
      if (remove) {
        setSingleValue([]);
        setRemove(null);
        onRemove && onRemove(null);
      }
    }, [remove]);

    useEffect(() => {
      if (isAllParent && !isMulti && treeSelectCheckedValue.length > 0) {
        const parentCheckedValue = options?.filter((item) =>
          isParentSelect(item, treeSelectCheckedValue[0])
        );

        const result = parentCheckedValue
          .map((item) => item.value)
          .filter((item) => item !== treeSelectCheckedValue[0]?.value);

        const tempValue = [...result, treeSelectCheckedValue[0]?.value];
        setTreeSelectCheckedValue(
          tempValue.map(
            (item) => options.find((option) => option.value === item)!
          )
        );
        onChange &&
          onChange(
            tempValue.map(
              (item) => options.find((option) => option.value === item)!
            )
          );
      }
    }, [treeSelectCheckedValue]);

    return (
      <div className={`tree-select-container ${className ? className : ""}`}>
        <div
          className={`tree-select ${disabled ? "disabled" : ""} ${
            isParent ? "is-parent" : ""
          } ${isAllParent ? "is-all-parent" : ""} ${
            treeSelectCheckedValue.length > 0 ? "selected" : ""
          } ${isLoading ? "loading" : ""} ${show ? "show" : ""} ${
            reset ? "reset" : ""
          }`}
          onClick={() => !disabled && setShow(!show)}
          ref={dropdownRef}
        >
          <div
            className={`tree-select__input-container ${
              isParent ? "is-parent" : ""
            }`}
          >
            <div
              className={`value-container ${
                treeSelectCheckedValue.length > 0 ? "selected" : ""
              }`}
            >
              <div className="single-value-container" ref={valueContainerRef}>
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    <div className="value-labels">
                      {isMulti ? (
                        <>
                          {treeSelectCheckedValue.length > 0 &&
                            treeSelectCheckedValue.map((node) => (
                              <span className="value-label" key={node.value}>
                                {node.label}
                                <span
                                  className="value-remove"
                                  onClick={(e) => treeSelectLabelClick(e, node)}
                                >
                                  <X size={14} />
                                </span>
                              </span>
                            ))}
                          {search && (
                            <input
                              type="text"
                              className="search-input"
                              value={search}
                              onChange={(e) => {
                                setSearch(e.target.value);
                                searchFilter(e.target.value);
                              }}
                              ref={inputRef2}
                            />
                          )}
                          <input
                            type="text"
                            className="input-container"
                            value={search}
                            onFocus={onFocusInput}
                            onChange={(e) => {
                              setSearch(e.target.value);
                              searchFilter(e.target.value);
                              onInputChange && onInputChange(e);
                            }}
                            ref={inputRef2}
                          />
                        </>
                      ) : (
                        <>
                          {singleValue.length > 0 && (
                            <span className="single-value-label">
                              {singleValue[0].label}
                              {isClearable && (
                                <span
                                  className="single-value-remove"
                                  onClick={() => setRemove(singleValue[0])}
                                >
                                  <X size={14} />
                                </span>
                              )}
                            </span>
                          )}
                          {!singleValue.length && !search && (
                            <input
                              type="text"
                              className="input-container"
                              value={search}
                              onFocus={onFocusInput}
                              onChange={(e) => {
                                setSearch(e.target.value);
                                searchFilter(e.target.value);
                                onInputChange && onInputChange(e);
                              }}
                              ref={singleInputRef}
                            />
                          )}
                        </>
                      )}
                    </div>
                    {isMulti &&
                      treeSelectCheckedValue.length === 0 &&
                      search === "" && (
                        <div className="placeholder">{name || "Select"}</div>
                      )}
                  </>
                )}
              </div>
            </div>
            <div
              className={`input-icon-container ${treeClearOver ? "hover" : ""}`}
              ref={treeClear}
            >
              {isMulti && treeSelectCheckedValue.length > 0 && (
                <span
                  className={`tree-clear ${
                    treeSelectCheckedValue.length > 0 ? "active" : ""
                  }`}
                  onMouseOver={() => setTreeClearOver(true)}
                  onMouseOut={() => setTreeClearOver(false)}
                  onClick={() => {
                    setTreeSelectCheckedValue([]);
                    onChange && onChange([]);
                  }}
                >
                  <X size={16} />
                </span>
              )}
              <span
                className={`input-icon ${show ? "active" : ""}`}
                ref={iconRef}
              >
                {isParent ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight
                    size={16}
                    className={`dropdown-icon ${show ? "open" : ""}`}
                  />
                )}
              </span>
            </div>
          </div>
          <div className={`tree-select__dropdown ${show ? "show" : ""}`}>
            {isParent && (
              <div className="all-parent-select">
                {allParentShow()?.map((item) => (
                  <span
                    key={item}
                    className={`all-parent-item ${
                      treeSelectCheckedValue.length > 0 &&
                      treeSelectCheckedValue[0]?.value === item &&
                      !isMulti &&
                      !isAllParent
                        ? "active"
                        : ""
                    }`}
                    onClick={(e) =>
                      sendData(e as any, options.find((f) => f.value === item)!)
                    }
                  >
                    {options.find((f) => f.value === item)?.label}
                  </span>
                ))}
              </div>
            )}
            {isLoading ? (
              <div className="tree-select__loading">Loading...</div>
            ) : (
              <>
                <div className="tree-select__search">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      searchFilter(e.target.value);
                    }}
                    onFocus={onFocusInput}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                </div>
                <ul
                  className={`tree-select__options ${
                    isParent ? "is-parent" : ""
                  }`}
                >
                  {filterData.length > 0 ? (
                    filterData.map((node) => (
                      <li
                        className={`tree-select__option ${
                          treeSelectCheckedValue.find(
                            (f) => f.value === node.value
                          )
                            ? "active"
                            : ""
                        }`}
                        key={node.value}
                        onClick={(e) => treeSelectLabelClick(e, node)}
                      >
                        <span className="tree-select__option-label">
                          {node.label}
                        </span>
                        {isParent &&
                          node.children &&
                          node.children.length > 0 && (
                            <ChevronRight size={16} className="dropdown-icon" />
                          )}
                      </li>
                    ))
                  ) : (
                    <>
                      {options.map((node) => (
                        <li
                          className={`tree-select__option ${
                            treeSelectCheckedValue.find(
                              (f) => f.value === node.value
                            )
                              ? "active"
                              : ""
                          }`}
                          key={node.value}
                          onClick={(e) => treeSelectLabelClick(e, node)}
                        >
                          <span className="tree-select__option-label">
                            {node.label}
                          </span>
                          {isParent &&
                            node.children &&
                            node.children.length > 0 && (
                              <ChevronRight
                                size={16}
                                className="dropdown-icon"
                              />
                            )}
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default TreeSelect;
