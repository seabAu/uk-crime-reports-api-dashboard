import React from "react";

function TableSubTable({ parentKey, data }) {
    const obj2SubTable = (obj) => {
        if (obj) {
            if (typeof obj === "object") {
                let subtable = [];
                subtable.push(
                    <table className="sub-table" key={`sub-table-${parentKey}`}>
                        <tbody
                            className="sub-table-body"
                            key={`sub-table-${parentKey}-body`}
                            id={`sub-table-${parentKey}-body`}>
                            {Object.entries(obj).map((prop, index) => {
                                // For each object in the array.
                                if (typeof prop[1] === "object") {
                                    prop[1] = obj2SubTable(prop[1]);
                                }
                                return (
                                    <tr 
                                        className="sub-table-row"
                                        key={`sub-table-${parentKey}-row-${index}`}
                                        id={`sub-table-${parentKey}-row-${index}`}>
                                        <td
                                            className="sub-table-cell-key"
                                            key={`sub-table-${parentKey}-row-${index}-cell-key-${prop[0]} `}
                                            id={`sub-table-${parentKey}-row-${index}-cell-key-${prop[0]}`}>
                                            {prop[0]}
                                        </td>
                                        <td
                                            className="sub-table-cell-value"
                                            key={`sub-table-${parentKey}-row-${index}-cell-value-${prop[0]} `}
                                            id={`sub-table-${parentKey}-row-${index}-cell-value-${prop[0]}`}>
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

    return data && typeof data === "object" && obj2SubTable(data);
}

export default TableSubTable;
