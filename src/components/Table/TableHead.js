import React from "react";

function TableHead({ isVisible, isFetching, tableHeadings, hideColumns }) {
    const formatText = (text = "") => {
        return capitalizeFirstLetter(text.replace("_", " "));
    };

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };
    return (
        <thead>
            <tr>
                {tableHeadings.map((heading) => {
                    return (
                        <th
                            colSpan="1"
                            className={`${ hideColumns.includes( heading ) ? ' col-hidden' : '' }`}>
                            {formatText(heading)}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

export default TableHead;
