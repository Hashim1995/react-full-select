import { useEffect } from "react";
var useOnClickOutside = function (ref, handler) {
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, handler]);
};
export default useOnClickOutside;
