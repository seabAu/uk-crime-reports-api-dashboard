import React from "react";

function TableSubTable({data}) {
    const obj2SubTable = (obj) => {
        if (obj) {
            if (typeof obj === "object") {
                let subtable = [];
                subtable.push(
                    <table className="sub-table">
                        <tbody className="sub-table-body">
                            {Object.entries(obj).map((object, index) => {
                                // For each object in the array.
                                if (typeof object[1] === "object") {
                                    object[1] = obj2SubTable(object[1]);
                                }
                                return (
                                    <tr className="sub-table-row">
                                        <td className="sub-table-cell-key">
                                            {object[0]}
                                        </td>
                                        <td className="sub-table-cell-value">
                                            {object[1]}
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

    return (
        data &&
        typeof data === "object" &&
        obj2SubTable(data)
    );
}

export default TableSubTable;
