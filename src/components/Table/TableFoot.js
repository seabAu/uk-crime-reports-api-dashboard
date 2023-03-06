import React from "react";
import TablePagination from "./TablePagination";
// This will contain the table's pagination and stuff.
function TableFoot(props) {
    const {
        tableID,
        tableHeadings,
        numEntries,
        entriesPerPage,
        pageNum,
        changePage,
    } = props;
    return (
        <tfoot>
            <tr colSpan={`${tableHeadings.length}`}>
                <td
                    colSpan={`${tableHeadings.length}`}
                    key={`table-${tableID}-footer`}
                    id={`table-${tableID}-footer`}
                    className={``}>
                    {numEntries > 0 && (
                        <TablePagination
                            tableID={tableID}
                            numEntries={numEntries}
                            entriesPerPage={parseInt(entriesPerPage)}
                            pageNum={parseInt(pageNum)}
                            changePage={changePage}
                        />
                    )}
                </td>
            </tr>
        </tfoot>
    );
}

export default TableFoot;
