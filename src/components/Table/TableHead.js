import React from "react";
import { useState } from "react";

function TableHead({
    isVisible,
    isFetching,
    isFilterable,
    isSortable,
    tableHeadings,
    headerOnClick,
    hideColumns,
    changeFilters,
}) {
    const [sortKey, setSortKey] = useState("");
    const [order, setOrder] = useState("asc");
    const [columnData, setColumnData] = useState(tableHeadings);
    const formatText = (text = "") => {
        return capitalizeFirstLetter(text.replace("_", " "));
    };

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    // console.log( "TableHead :: ", tableHeadings );
    return (
        <thead>
            <tr>
                {tableHeadings.map((column) => {
                    let headingId = column.key;
                    let headingLabel = formatText(column.key);

                    return (
                        <th
                            colSpan="1"
                            key={`table-header-label-${column.key}`}
                            id={`table-header-label-${column.key}`}
                            className={`${
                                hideColumns.includes(headingId)
                                    ? " col-hidden"
                                    : ""
                            }`}
                            onClick={(index) => {
                                if (isSortable) {
                                    const sortOrder =
                                        headingId === sortKey && order === "asc"
                                            ? "desc"
                                            : "asc";
                                    setSortKey(headingId);
                                    setOrder(sortOrder);
                                    headerOnClick(index, headingId, sortOrder);
                                }
                            }}>
                            {headingLabel}
                        </th>
                    );
                })}
            </tr>
            <tr>
                {isFilterable && (tableHeadings.map((column) => {

                    return (
                        <th
                            colSpan="1"
                            key={`table-search-filter-${column.key}`}
                            id={`table-search-filter-${column.key}`}
                            className={`${
                                hideColumns.includes(column.key)
                                    ? " col-hidden"
                                    : ""
                            }`}
                            onClick={(index) => {}}>
                            <input
                                type="text"
                                id={`table-search-filter-input-${column.key}`}
                                className="table-search-filter"
                                placeholder={`Filter ${column.key}`}
                                onChange={(event) => {
                                    changeFilters(
                                        column.key,
                                        event.target.value,
                                    );
                                }}></input>
                        </th>
                    );
                }))}
            </tr>
        </thead>
    );
}

export default TableHead;
