import React from "react";

function TablePagination ( {numEntries,
    entriesPerPage,
pageNum,
    setPageNum,
changePage,
} )
{
    const getPageButtons = () =>
    {
        console.log( "getPageButtons(): ", pageNum );
        let buttons = [];
        for ( var i = 0; i < numEntries / entriesPerPage; i++ )
        {
            buttons.push(
                <li className="">
                    <button
                        className={`pagination-button ${
                            i === pageNum ? "current-page-button" : ""
                        }`}
                        onClick={changePage(i)}>
                        {i}
                    </button>
                </li>,
            );
        }
        return buttons;
    }
    return (
            <div className="table-pagination-container">
                {
                    <ul className="table-pagination">
                        { getPageButtons() }
                    </ul>
                }
            </div>
    );
}

export default TablePagination;
