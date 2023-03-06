import React from "react";

function TableSubTable ( props )
{
    const {
        data,
        containerID,
        tableID
    } = props;

    // Convert an object into a vertically-aligned table meant to be contained in the cell of a parent table, with recursion. 
    const obj2SubTable = (obj, containerID, tableID) => {
        if (obj) {
            if (typeof obj === "object") {
                let subtable = [];
                subtable.push(
                    <table
                        className="sub-table"
                        key={`table-${tableID}-sub-table-${containerID}`}>
                        <tbody
                            className="sub-table-body"
                            key={`table-${tableID}-sub-table-${containerID}-body`}
                            id={`table-${tableID}-sub-table-${containerID}-body`}>
                            {Object.entries(obj).map((prop, index) => {
                                // For each object in the array.
                                if (typeof prop[1] === "object") {
                                    prop[1] = obj2SubTable(prop[1]);
                                }
                                return (
                                    <tr
                                        className="sub-table-row"
                                        key={`table-${tableID}-sub-table-${containerID}-row-${index}`}
                                        id={`table-${tableID}-sub-table-${containerID}-row-${index}`}>
                                        <td
                                            className="sub-table-cell-key"
                                            key={`table-${tableID}-sub-table-${containerID}-row-${index}-cell-key-${prop[0]} `}
                                            id={`table-${tableID}-sub-table-${containerID}-row-${index}-cell-key-${prop[0]}`}>
                                            {prop[0]}
                                        </td>
                                        <td
                                            className="sub-table-cell-value"
                                            key={`table-${tableID}-sub-table-${containerID}-row-${index}-cell-value-${prop[0]} `}
                                            id={`table-${tableID}-sub-table-${containerID}-row-${index}-cell-value-${prop[0]}`}>
                                            {prop[1]}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>,
                );
                return subtable;
            }
        }
    };

    return data && typeof data === "object" && obj2SubTable(data, containerID, tableID);
}

export default TableSubTable;
