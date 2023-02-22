import React from "react";
import TableSubTable from "./TableSubTable";

function TableBody({
    isVisible,
    isFetching,
    tableData,
    hideColumns,
    rowOnClick,
    cellOnClick,
}) {
    //const getIsVisible = ( rowIndex, page, numPerPage, filters = [] ) => {
    //    let startIndex = page * numPerPage;
    //    let endIndex = page * numPerPage + numPerPage - 1;
    //    if ( rowIndex >= startIndex && rowIndex < endIndex )
    //    {
    //        return true;
    //    }
    //    return false;
    //}
    // console.log(
    //     "TableBody(): ",
    //     isVisible,
    //     isFetching,
    //     tableData,
    //     hideColumns,
    //     rowOnClick,
    //     cellOnClick,
    // );

    return (
        <tbody>
            {tableData.map((object, index) => {
                return (
                    <tr
                        id={`row-${index}`}
                        className={`row-${
                            index
                            //getIsVisible(index, pageNum, entriesPerPage, [])
                            //    ? "row-visible"
                            //    : "row-hidden"
                        }`}
                        onClick={(index) => {
                            rowOnClick(index);
                        }}>
                        {Object.entries(object).map((objProperty, index) => {
                            let objKey = objProperty[0];
                            let objValue = objProperty[1];
                            if (
                                typeof objValue === "object" &&
                                objValue !== null
                            ) {
                                return (
                                    <td
                                        rowSpan="1"
                                        className={`col-cell sub-table-container ${
                                            hideColumns.includes(objKey)
                                                ? " col-hidden"
                                                : ""
                                        }`}
                                        onClick={(index) => {
                                            cellOnClick(index);
                                        }}>
                                        <TableSubTable data={objValue}></TableSubTable>
                                    </td>
                                );
                            } else {
                                return (
                                    <td
                                        rowSpan="1"
                                        className={`col-cell ${
                                            hideColumns.includes(objKey)
                                                ? " col-hidden"
                                                : ""
                                        }`}>
                                        {objValue == null ||
                                        objValue === undefined ||
                                        objValue === " " ||
                                        objValue === ""
                                            ? "-"
                                            : objValue}
                                    </td>
                                );
                            }
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}

export default TableBody;