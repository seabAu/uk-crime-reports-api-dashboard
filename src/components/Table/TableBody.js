import React from "react";
import { cleanInvalid } from "../Utilities/ObjectUtils";
import TableSubTable from "./TableSubTable";

function TableBody(props) {
    const {
        // isVisible,
        // isFetching,
        tableID,
        tableData,
        hideColumns,
        rowOnClick,
        cellOnClick,
    } = props;

    return (
        <tbody>
            {tableData.map((object, rowIndex) => {
                return (
                    <tr
                        key={`table-${tableID}-row-${rowIndex}`}
                        id={`table-${tableID}-row-${rowIndex}`}
                        className={`row-${
                            rowIndex
                            //getIsVisible(index, pageNum, entriesPerPage, [])
                            //    ? "row-visible"
                            //    : "row-hidden"
                        }`}
                        onClick={(rowIndex) => {
                            rowOnClick(rowIndex, object);
                        }}>
                        {Object.entries(object).map(
                            (objProperty, cellIndex) => {
                                let objKey = objProperty[0];
                                let objValue = objProperty[1];
                                if (
                                    typeof objValue === "object" &&
                                    objValue !== null
                                ) {
                                    return (
                                        <td
                                            key={`table-${tableID}-cell-${rowIndex}-${cellIndex}-${objKey}`}
                                            id={`table-${tableID}-cell-${rowIndex}-${cellIndex}-${objKey}`}
                                            rowSpan="1"
                                            className={`col-cell sub-table-container ${
                                                hideColumns.includes(objKey)
                                                    ? " col-hidden"
                                                    : ""
                                            }`}
                                            onClick={(cellIndex) => {
                                                cellOnClick(
                                                    cellIndex,
                                                    objProperty,
                                                );
                                            }}>
                                            <TableSubTable
                                                data={objValue}
                                                containerID={`${rowIndex}-${cellIndex}-${objKey}`}
                                                tableID={`${tableID}`}></TableSubTable>
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td
                                            key={`table-${tableID}-cell-${rowIndex}-${cellIndex}-${objKey}`}
                                            id={`table-${tableID}-cell-${rowIndex}-${cellIndex}-${objKey}`}
                                            rowSpan="1"
                                            className={`col-cell ${
                                                hideColumns.includes(objKey)
                                                    ? " col-hidden"
                                                    : ""
                                            }`}>
                                            {cleanInvalid(objValue, "-")}
                                        </td>
                                    );
                                }
                            },
                        )}
                    </tr>
                );
            })}
        </tbody>
    );
}

export default TableBody;