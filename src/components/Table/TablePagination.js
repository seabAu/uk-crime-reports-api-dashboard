import React from "react";

function TablePagination ( props )
{
    const {
        numEntries,
        entriesPerPage,
        pageNum,
        changePage,
        tableID,
    } = props;
    
    const getPageButtons = (dataLen, page, numPerPage) => {
        // console.log("getPageButtons(): ", dataLen, page, numPerPage);
        let buttons = [];
        const numButtons = Math.ceil(dataLen / numPerPage);
        buttons.push(
            <li
                className=""
                id={`table-${tableID}-pagination-container-back`}
                key={`table-${tableID}-pagination-container-back`}>
                <button
                    id={`table-${tableID}-pagination-button-back`}
                    key={`table-${tableID}-pagination-button-back`}
                    className={`pagination-button`}
                    onClick={() => {
                        changePage(dataLen, +page - 1, numPerPage);
                    }}>
                    {`<<`}
                </button>
            </li>,
        );
        for (let i = 0; i < numButtons; i++) {
            // if ( i - page < page - 3 || i + page > page + 3 ) {
            if (Math.abs(i - page) < 3 || i === 0 || i === numButtons - 1) {
                buttons.push(
                    <li
                        className=""
                        id={`table-${tableID}-pagination-container-${i}`}
                        key={`table-${tableID}-pagination-container-${i}`}>
                        <button
                            id={`table-${tableID}-pagination-button-${i}`}
                            key={`table-${tableID}-pagination-button-${i}`}
                            className={`pagination-button ${
                                i === page ? "current-page-button" : ""
                            }`}
                            onClick={(event) => {
                                changePage(
                                    dataLen,
                                    i, // event.target.innerText,
                                    numPerPage,
                                );
                            }}>
                            {i}
                        </button>
                    </li>,
                );
            }
        }
        buttons.push(
            <li
                className=""
                id={`table-${tableID}-pagination-container-next`}
                key={`table-${tableID}-pagination-container-next`}>
                <button
                    id={`table-${tableID}-pagination-button-next`}
                    key={`table-${tableID}-pagination-button-next`}
                    className={`pagination-button`}
                    onClick={() => {
                        changePage(dataLen, +page + 1, numPerPage);
                    }}>
                    {`>>`}
                </button>
            </li>,
        );
        return buttons;
    };

    return (
        <div className="table-pagination-container">
            {
                <ul className="table-pagination">
                    {getPageButtons(numEntries, pageNum, entriesPerPage)}
                </ul>
            }
            {
                <p className="table-pagination-info">
                    {`Viewing ${pageNum * entriesPerPage} to ${
                        pageNum * entriesPerPage + entriesPerPage - 1 >
                        numEntries
                            ? numEntries
                            : pageNum * entriesPerPage + entriesPerPage - 1
                    } of ${numEntries} entries found.`}
                </p>
            }
        </div>
    );
}

export default TablePagination;

/*
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

*/
