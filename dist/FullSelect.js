var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, } from "react";
import { X, ChevronDown, ChevronRight } from "react-feather";
import useOnClickOutside from "./useOutSideHook";
import "./index.css";
var TreeSelect = forwardRef(function (_a, ref) {
    var _b;
    var _c = _a.options, options = _c === void 0 ? [] : _c, isMulti = _a.isMulti, isClearable = _a.isClearable, onChange = _a.onChange, defaultValue = _a.defaultValue, name = _a.name, className = _a.className, disabled = _a.disabled, isParent = _a.isParent, isAllParent = _a.isAllParent, onRemove = _a.onRemove, onFocus = _a.onFocus, isLoading = _a.isLoading, defaultAllParent = _a.defaultAllParent, onInputChange = _a.onInputChange;
    var iconRef = useRef();
    var inputRef2 = useRef();
    var spanRef = useRef();
    var treeClear = useRef();
    var dropdownRef = useRef();
    var singleInputRef = useRef();
    var valueContainerRef = useRef();
    var _d = useState(""), search = _d[0], setSearch = _d[1];
    var _e = useState([]), filterData = _e[0], setFilterData = _e[1];
    var _f = useState([]), treeSelectCheckedValue = _f[0], setTreeSelectCheckedValue = _f[1];
    var _g = useState([]), treeSelectValue = _g[0], setTreeSelectValue = _g[1];
    var _h = useState([]), singleValue = _h[0], setSingleValue = _h[1];
    var _j = useState([]), onlyParentSelect = _j[0], setOnlyParentSelect = _j[1];
    var _k = useState(null), remove = _k[0], setRemove = _k[1];
    var _l = useState(false), dropDownOver = _l[0], setDropDownOver = _l[1];
    var _m = useState(false), treeClearOver = _m[0], setTreeClearOver = _m[1];
    var _o = useState(false), show = _o[0], setShow = _o[1];
    var _p = useState(false), reset = _p[0], setReset = _p[1];
    var _q = useState(null), gap = _q[0], setGap = _q[1];
    var _r = useState(null), defaultVal = _r[0], setDefaultVal = _r[1];
    var _s = useState(false), change = _s[0], setChange = _s[1];
    var _t = useState(null), allParent = _t[0], setAllParent = _t[1];
    useImperativeHandle(ref, function () { return ({
        onReset: function () {
            setReset(true);
        },
    }); });
    var sendData = function (e, nodes) {
        var _a;
        setDefaultVal(null);
        setChange(true);
        function flatten(items) {
            var flat = [];
            items === null || items === void 0 ? void 0 : items.forEach(function (item) {
                flat.push(item);
                if (Array.isArray(item.children) && item.children.length > 0) {
                    flat.push.apply(flat, flatten(item.children));
                }
            });
            return flat;
        }
        var findValue = (_a = flatten(options)) === null || _a === void 0 ? void 0 : _a.find(function (find) { return (find === null || find === void 0 ? void 0 : find.value) === (nodes === null || nodes === void 0 ? void 0 : nodes.value); });
        if (findValue) {
            if (isParent && !isMulti && !isAllParent) {
                setTreeSelectCheckedValue([]);
                setOnlyParentSelect([findValue]);
            }
            else if (isAllParent && !isMulti) {
                setTreeSelectCheckedValue([]);
                setOnlyParentSelect([findValue]);
            }
            else {
                setOnlyParentSelect([]);
                setTreeSelectCheckedValue([findValue]);
            }
        }
        if (!isParent && !isMulti) {
            setTreeSelectCheckedValue([]);
            setSingleValue([findValue]);
            onChange && onChange(findValue);
        }
        else if (isParent && !isMulti) {
            setTreeSelectCheckedValue([]);
            setTreeSelectValue([]);
            onChange && onChange(findValue);
        }
    };
    var isParentSelect = function (nodes, parent) {
        if (nodes === null || nodes === void 0 ? void 0 : nodes.parent_id) {
            if ((nodes === null || nodes === void 0 ? void 0 : nodes.parent_id) === (parent === null || parent === void 0 ? void 0 : parent.value)) {
                return true;
            }
            else {
                return isParentSelect(nodes, (parent === null || parent === void 0 ? void 0 : parent.parent_label) ? nodes : parent);
            }
        }
        return false;
    };
    var allParentShow = function () {
        if (isParent && !isMulti && !isAllParent) {
            return allParent;
        }
        return null;
    };
    var treeSelectLabelClick = function (e, nodes) {
        e.stopPropagation();
        e.preventDefault();
        if (isMulti) {
            var find_1 = treeSelectCheckedValue === null || treeSelectCheckedValue === void 0 ? void 0 : treeSelectCheckedValue.find(function (f) { return f.value === nodes.value; });
            if (find_1) {
                var result = treeSelectCheckedValue === null || treeSelectCheckedValue === void 0 ? void 0 : treeSelectCheckedValue.filter(function (f) { return f.value !== find_1.value; });
                setTreeSelectCheckedValue(result);
                onChange && onChange(result);
            }
            else {
                var result = __spreadArray(__spreadArray([], (treeSelectCheckedValue || []), true), [nodes], false);
                setTreeSelectCheckedValue(result);
                onChange && onChange(result);
            }
        }
        else {
            setTreeSelectCheckedValue([nodes]);
            onChange && onChange(nodes);
        }
    };
    var searchFilter = function (value) {
        var searchValue = value.toLowerCase();
        var filterResult = [];
        var filter = function (item) {
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
    var clearInput = function () {
        var _a;
        setSearch("");
        setFilterData([]);
        (_a = inputRef2.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    var treeBackSpaceDelet = function () {
        if (!search && treeSelectCheckedValue.length > 0) {
            var result = treeSelectCheckedValue.slice(0, treeSelectCheckedValue.length - 1);
            setTreeSelectCheckedValue(result);
            onChange && onChange(result);
        }
    };
    var onFocusInput = function () {
        var _a;
        setChange(false);
        setShow(true);
        onFocus && onFocus();
        setGap((_a = valueContainerRef.current) === null || _a === void 0 ? void 0 : _a.offsetHeight);
    };
    useEffect(function () {
        if (defaultValue) {
            setDefaultVal(defaultValue);
        }
    }, [defaultValue]);
    useEffect(function () {
        setReset(false);
    }, [reset]);
    useEffect(function () {
        if (!change) {
            setTreeSelectValue(treeSelectCheckedValue);
        }
    }, [treeSelectCheckedValue]);
    useEffect(function () {
        if (options) {
            if (defaultAllParent) {
                setAllParent(defaultAllParent);
            }
            else {
                var flattenOptions_1 = [];
                var flatten_1 = function (items) {
                    items === null || items === void 0 ? void 0 : items.forEach(function (item) {
                        flattenOptions_1.push(item);
                        if (Array.isArray(item.children) && item.children.length > 0) {
                            flatten_1(item.children);
                        }
                    });
                };
                flatten_1(options);
                var allParentValue = flattenOptions_1
                    .filter(function (item) { return item.all; })
                    .map(function (item) { return item.value; });
                setAllParent(allParentValue);
            }
        }
    }, [options, defaultAllParent]);
    useOnClickOutside(dropdownRef, function () {
        setShow(false);
        setRemove(null);
    });
    useOnClickOutside(valueContainerRef, function () {
        setTreeClearOver(false);
    });
    useEffect(function () {
        if (isParent && !isMulti && !isAllParent && onlyParentSelect.length > 0) {
            onChange && onChange(onlyParentSelect[0]);
        }
    }, [onlyParentSelect]);
    useEffect(function () {
        if (reset) {
            setTreeSelectCheckedValue([]);
            setOnlyParentSelect([]);
            setSingleValue([]);
            onChange && onChange(null);
        }
    }, [reset]);
    useEffect(function () {
        if (remove) {
            setSingleValue([]);
            setRemove(null);
            onRemove && onRemove(null);
        }
    }, [remove]);
    useEffect(function () {
        var _a;
        if (isAllParent && !isMulti && treeSelectCheckedValue.length > 0) {
            var parentCheckedValue = options === null || options === void 0 ? void 0 : options.filter(function (item) {
                return isParentSelect(item, treeSelectCheckedValue[0]);
            });
            var result = parentCheckedValue
                .map(function (item) { return item.value; })
                .filter(function (item) { var _a; return item !== ((_a = treeSelectCheckedValue[0]) === null || _a === void 0 ? void 0 : _a.value); });
            var tempValue = __spreadArray(__spreadArray([], result, true), [(_a = treeSelectCheckedValue[0]) === null || _a === void 0 ? void 0 : _a.value], false);
            setTreeSelectCheckedValue(tempValue.map(function (item) { return options.find(function (option) { return option.value === item; }); }));
            onChange &&
                onChange(tempValue.map(function (item) { return options.find(function (option) { return option.value === item; }); }));
        }
    }, [treeSelectCheckedValue]);
    return (React.createElement("div", { className: "tree-select-container ".concat(className ? className : "") },
        React.createElement("div", { className: "tree-select ".concat(disabled ? "disabled" : "", " ").concat(isParent ? "is-parent" : "", " ").concat(isAllParent ? "is-all-parent" : "", " ").concat(treeSelectCheckedValue.length > 0 ? "selected" : "", " ").concat(isLoading ? "loading" : "", " ").concat(show ? "show" : "", " ").concat(reset ? "reset" : ""), onClick: function () { return !disabled && setShow(!show); }, ref: dropdownRef },
            React.createElement("div", { className: "tree-select__input-container ".concat(isParent ? "is-parent" : "") },
                React.createElement("div", { className: "value-container ".concat(treeSelectCheckedValue.length > 0 ? "selected" : "") },
                    React.createElement("div", { className: "single-value-container", ref: valueContainerRef }, isLoading ? ("Loading...") : (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "value-labels" }, isMulti ? (React.createElement(React.Fragment, null,
                            treeSelectCheckedValue.length > 0 &&
                                treeSelectCheckedValue.map(function (node) { return (React.createElement("span", { className: "value-label", key: node.value },
                                    node.label,
                                    React.createElement("span", { className: "value-remove", onClick: function (e) { return treeSelectLabelClick(e, node); } },
                                        React.createElement(X, { size: 14 })))); }),
                            search && (React.createElement("input", { type: "text", className: "search-input", value: search, onChange: function (e) {
                                    setSearch(e.target.value);
                                    searchFilter(e.target.value);
                                }, ref: inputRef2 })),
                            React.createElement("input", { type: "text", className: "input-container", value: search, onFocus: onFocusInput, onChange: function (e) {
                                    setSearch(e.target.value);
                                    searchFilter(e.target.value);
                                    onInputChange && onInputChange(e);
                                }, ref: inputRef2 }))) : (React.createElement(React.Fragment, null,
                            singleValue.length > 0 && (React.createElement("span", { className: "single-value-label" },
                                singleValue[0].label,
                                isClearable && (React.createElement("span", { className: "single-value-remove", onClick: function () { return setRemove(singleValue[0]); } },
                                    React.createElement(X, { size: 14 }))))),
                            !singleValue.length && !search && (React.createElement("input", { type: "text", className: "input-container", value: search, onFocus: onFocusInput, onChange: function (e) {
                                    setSearch(e.target.value);
                                    searchFilter(e.target.value);
                                    onInputChange && onInputChange(e);
                                }, ref: singleInputRef }))))),
                        isMulti &&
                            treeSelectCheckedValue.length === 0 &&
                            search === "" && (React.createElement("div", { className: "placeholder" }, name || "Select")))))),
                React.createElement("div", { className: "input-icon-container ".concat(treeClearOver ? "hover" : ""), ref: treeClear },
                    isMulti && treeSelectCheckedValue.length > 0 && (React.createElement("span", { className: "tree-clear ".concat(treeSelectCheckedValue.length > 0 ? "active" : ""), onMouseOver: function () { return setTreeClearOver(true); }, onMouseOut: function () { return setTreeClearOver(false); }, onClick: function () {
                            setTreeSelectCheckedValue([]);
                            onChange && onChange([]);
                        } },
                        React.createElement(X, { size: 16 }))),
                    React.createElement("span", { className: "input-icon ".concat(show ? "active" : ""), ref: iconRef }, isParent ? (React.createElement(ChevronDown, { size: 16 })) : (React.createElement(ChevronRight, { size: 16, className: "dropdown-icon ".concat(show ? "open" : "") }))))),
            React.createElement("div", { className: "tree-select__dropdown ".concat(show ? "show" : "") },
                isParent && (React.createElement("div", { className: "all-parent-select" }, (_b = allParentShow()) === null || _b === void 0 ? void 0 : _b.map(function (item) {
                    var _a, _b;
                    return (React.createElement("span", { key: item, className: "all-parent-item ".concat(treeSelectCheckedValue.length > 0 &&
                            ((_a = treeSelectCheckedValue[0]) === null || _a === void 0 ? void 0 : _a.value) === item &&
                            !isMulti &&
                            !isAllParent
                            ? "active"
                            : ""), onClick: function (e) {
                            return sendData(e, options.find(function (f) { return f.value === item; }));
                        } }, (_b = options.find(function (f) { return f.value === item; })) === null || _b === void 0 ? void 0 : _b.label));
                }))),
                isLoading ? (React.createElement("div", { className: "tree-select__loading" }, "Loading...")) : (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "tree-select__search" },
                        React.createElement("input", { type: "text", className: "search-input", placeholder: "Search...", value: search, onChange: function (e) {
                                setSearch(e.target.value);
                                searchFilter(e.target.value);
                            }, onFocus: onFocusInput, onClick: function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                            } })),
                    React.createElement("ul", { className: "tree-select__options ".concat(isParent ? "is-parent" : "") }, filterData.length > 0 ? (filterData.map(function (node) { return (React.createElement("li", { className: "tree-select__option ".concat(treeSelectCheckedValue.find(function (f) { return f.value === node.value; })
                            ? "active"
                            : ""), key: node.value, onClick: function (e) { return treeSelectLabelClick(e, node); } },
                        React.createElement("span", { className: "tree-select__option-label" }, node.label),
                        isParent &&
                            node.children &&
                            node.children.length > 0 && (React.createElement(ChevronRight, { size: 16, className: "dropdown-icon" })))); })) : (React.createElement(React.Fragment, null, options.map(function (node) { return (React.createElement("li", { className: "tree-select__option ".concat(treeSelectCheckedValue.find(function (f) { return f.value === node.value; })
                            ? "active"
                            : ""), key: node.value, onClick: function (e) { return treeSelectLabelClick(e, node); } },
                        React.createElement("span", { className: "tree-select__option-label" }, node.label),
                        isParent &&
                            node.children &&
                            node.children.length > 0 && (React.createElement(ChevronRight, { size: 16, className: "dropdown-icon" })))); }))))))))));
});
export default TreeSelect;
