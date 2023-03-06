import React from "react";
import { useState } from "react";

function TableHead ( props )
{
    const {
        // isVisible,
        // isFetching,
        tableID,
        tableHeadings,
        isFilterable,
        isSortable,
        headerOnClick,
        hideColumns,
        changeFilters,
    } = props;
    
    const [sortKey, setSortKey] = useState("");
    const [order, setOrder] = useState("asc");
    const [columnData, setColumnData] = useState(tableHeadings);
    const formatText = (text = "") => {
        // return capitalizeFirstLetter(text.replace("_", " "));
        return capitalizeFirstLetter( text.includes("_") ? 
            (
                text.split( "_" )
            ).join( " " ) : text
        );
    };

    const capitalizeFirstLetter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const isColumnHidden = (heading_id) => {
        // hideColumns ? (Array.isArray(hideColumns) ? (hideColumns.includes(column.key) ? " col-hidden" : "") : '') : ''
        if (hideColumns) {
            if (Array.isArray(hideColumns)) {
                if (hideColumns.length > 0) {
                    return hideColumns.includes(heading_id);
                }
            }
        }
        return false;
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
                            key={`table-${tableID}-header-label-${column.key}`}
                            id={`table-${tableID}-header-label-${column.key}`}
                            className={`${
                                isColumnHidden(column.key) ? " col-hidden" : ""
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
                {isFilterable &&
                    tableHeadings.map((column) => {
                        return (
                            <th
                                colSpan="1"
                                key={`table-${tableID}-search-filter-${column.key}`}
                                id={`table-${tableID}-search-filter-${column.key}`}
                                className={`${
                                    isColumnHidden(column.key)
                                        ? " col-hidden"
                                        : ""
                                }`}
                                onClick={(index) => {}}>
                                <input
                                    type="text"
                                    key={`table-${tableID}-search-filter-input-${column.key}`}
                                    id={`table-${tableID}-search-filter-input-${column.key}`}
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
                    })}
            </tr>
        </thead>
    );
}

export default TableHead;
