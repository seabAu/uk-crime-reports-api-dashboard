import React from "react";
import { useState } from "react";
import TableBody from "./TableBody";
import TableDownload from "./TableDownload";
import TableHead from "./TableHead";
import TablePagination from "./TablePagination";

function Table({
    isVisible,
    isFetching,
    dataName,
    tableData,
    hideColumns,
    // entriesPerPage,
    // setEntriesPerPage,
    // pageNum,
    // setPageNum,
    // changePage,
} )
{
    // The tableData contains an array of objects. To construct the header, we use just the first object in the array and grab its keys' names.

    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [pageNum, setPageNum] = useState(0);
    const [ filters, setFilters ] = useState( [] );
    
    const getPageEntries = (data, page, numPerPage, filters = []) => {
        if (!data) {
            return [{"Error": "No data."}];
        }
        let entries = [];
        let startIndex = page * numPerPage;
        let endIndex = page * numPerPage + numPerPage - 1;
        for (var i = 0; i < data.length; i++) {
            if (data[i]) {
                if (i >= startIndex && i < endIndex) {
                    entries.push(data[i]);
                }
            }
        }
        return entries;
    };

    const changePage = (dataLen, page, numPerPage) => {
        // console.log( "changePage(): ", pagenum, pageNum );
        // const crimeReportsClone = [...crimeReports];
        // console.log( "Reached bottom of table: ", crimeReports );
        const numPages = dataLen / numPerPage;
        if (page >= 0 && page < numPages) {
        // if (dataLen > entriesPerPage) {
            setTimeout(() => {
                return setPageNum(page);
            }, 10);
        }
    };
    const getPageButtons = (dataLen, page, numPerPage) => {
        // console.log("getPageButtons(): ", pageNum);
        let buttons = [];
        const numButtons = dataLen / numPerPage;
        buttons.push(
            <li className="">
                <button
                    className={`pagination-button`}
                    onClick={() => {
                        changePage(dataLen, page - 1, numPerPage);
                    }}>
                    {`<<`}
                </button>
            </li>,
        );
        for (var i = 0; i < numButtons; i++) {
            // if ( i - page < page - 3 || i + page > page + 3 ) {
            if (Math.abs(i - page) < 3) {
                buttons.push(
                    <li className="">
                        <button
                            className={`pagination-button ${
                                i == page ? "current-page-button" : ""
                            }`}
                            onClick={(event) => {
                                changePage(dataLen, event.target.innerText, numPerPage);
                            }}>
                            {i}
                        </button>
                    </li>,
                );
            }
        }
        buttons.push(
            <li className="">
                <button
                    className={`pagination-button`}
                    onClick={() => {
                        changePage(dataLen, page + 1, numPerPage);
                    }}>
                    {`>>`}
                </button>
            </li>,
        );
        return buttons;
    };
    return (
        <div className="table-container">
            <TableDownload
                dataName={dataName}
                tableData={tableData}
                downloadFileType="csv"></TableDownload>
            <div className="table">
                <table>
                    {isVisible && tableData && tableData[0] && (
                        <TableHead
                            isVisible={isVisible}
                            isFetching={isFetching}
                            tableHeadings={Object.keys(tableData[0])}
                            hideColumns={hideColumns}></TableHead>
                    )}
                    {isVisible && tableData && (
                        <TableBody
                            isVisible={isVisible}
                            isFetching={isFetching}
                            // tableData={tableData}
                            tableData={getPageEntries(
                                tableData,
                                pageNum,
                                entriesPerPage,
                                [],
                            )}
                            hideColumns={hideColumns}
                            rowOnClick={(rowIndex) => {
                                console.log("Row clicked: ", rowIndex);
                            }}
                            cellOnClick={(cellIndex) => {
                                console.log("Cell clicked: ", cellIndex);
                            }}></TableBody>
                    )}
                </table>
            </div>
            <div className="table-pagination-container">
                {
                    <ul className="table-pagination">
                        {getPageButtons(
                            tableData.length,
                            pageNum,
                            entriesPerPage,
                        )}
                    </ul>
                }
                {
                    <p className="table-pagination-info">
                        {`Viewing ${pageNum * entriesPerPage} to ${
                            pageNum * entriesPerPage + entriesPerPage - 1 >
                            tableData.length
                                ? tableData.length
                                : pageNum * entriesPerPage + entriesPerPage - 1
                        } of ${tableData.length} entries found.`}
                    </p>
                }
            </div>
        </div>
    );
}

export default Table;

/*

                <Table onScrollCapture={handleScroll}>
                    <Dialog
                        isShown={isDialogShown}
                        hasHeader={false}
                        confirmLabel={isCopied ? "Copied!" : "Copy"}
                        onConfirm={(close) => {
                            copyToClipboard(
                                truncatedCrimeReportsList[dialogID]
                                    .persistent_id,
                            );
                            setIsCopied(true);
                        }}
                        onCloseComplete={() => {
                            setIsDialogShown(false);
                            setIsCopied(false);
                        }}
                        id="dialog-modal">
                        <Heading>CRIME_ID:</Heading>
                        <div id="dialog-modal">
                            {
                                // isDialogShown &&
                                // flatMapObj(
                                //     truncatedCrimeReportsList[dialogID],
                                //     "div",
                                //     document.getElementById("dialog-modal"),
                                // )
                            }
                        </div>
                        <Text>
                            {
                                isDialogShown && //( flatMapObjText( truncatedCrimeReportsList[ dialogID ] ) )
                                    Object.entries(
                                        truncatedCrimeReportsList[dialogID],
                                    )
                                        .map((objProperty) => {
                                            // console.log( objProperty, `${<div>{objProperty.join( ": " )}</div>}` );
                                            return (
                                                <div>
                                                    {objProperty.join(": ")}
                                                </div>
                                                //<div>
                                                //    `${objProperty[0]}: ${objProperty[1]}`
                                                //</div>
                                            );
                                        })
                                        .join("\n")
                                // flatMapObj(
                                //     truncatedCrimeReportsList[dialogID],
                                //     "div",
                                //     "dialog-modal"
                                //<div>
                                //    {
                                //        // { flatMapObj ( truncatedCrimeReportsList[ dialogID ],"div" ) }
                                //        // { flatMapObjText ( truncatedCrimeReportsList[ dialogID ],"div" ) }
                                //        () => {
                                //            console.log(truncatedCrimeReportsList[ dialogID ]);
                                //        }
                                //
                                //    }
                                //    <ObjMap obj={truncatedCrimeReportsList[ dialogID ]} wrap={"div"}></ObjMap>
                            }
                        </Text>
                    </Dialog>

                    <Table.Head>
                        {
                            // TODO :: Render the table ONLY AFTER the data has been fetched.
                            // Object.keys(truncatedCrimeReportsList[0])
                            //     .map((objHeader) => {
                            //         return `<th colspan="1">
                            //         ${objHeader}
                            //         </th>`;
                            //     })
                            //     .join("")
                        }
                        <Table.TextHeaderCell>NO.</Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            CATEGORY
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            PERSISTENT_ID
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>DATE</Table.TextHeaderCell>
                        <Table.TextHeaderCell>STATUS</Table.TextHeaderCell>
                    </Table.Head>
                    <Table.Body className="table-body" height={800}>
                        {isFetching && (
                            <Pane
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                height={400}>
                                <Spinner
                                    size={50}
                                    marginX="auto"
                                    marginY={10}
                                />
                            </Pane>
                        )}

                        {!isFetching &&
                            truncatedCrimeReportsList &&
                            truncatedCrimeReportsList[0] === undefined && (
                                <Table.Row>
                                    <Table.TextCell>
                                        <Text size={600} marginLeft={10}>
                                            There is no reports available.
                                        </Text>
                                    </Table.TextCell>
                                </Table.Row>
                            )}

                        {!isFetching &&
                            truncatedCrimeReportsList &&
                            truncatedCrimeReportsList[0] !== undefined &&
                            truncatedCrimeReportsList.map((report, i) => {
                                // debugDumpData();
                                return (
                                    <Table.Row
                                        key={i}
                                        isSelectable
                                        onSelect={() => {
                                            setIsDialogShown(true);
                                            setDialogID(i);
                                        }}>
                                        <Table.TextCell>
                                            {i + 1}
                                        </Table.TextCell>
                                        <Table.TextCell>
                                            {report.category}
                                        </Table.TextCell>
                                        <Table.TextCell>
                                            {report.persistent_id
                                                ? report.persistent_id
                                                : "Not available"}
                                        </Table.TextCell>
                                        <Table.TextCell>
                                            {report.month}
                                        </Table.TextCell>
                                        <Table.TextCell>
                                            {report.outcome_status
                                                ? report.outcome_status
                                                      .category
                                                : "Not available"}
                                        </Table.TextCell>
                                    </Table.Row>
                                );
                            })}

                        {isBottom && (
                            <Spinner
                                size={50}
                                marginX="auto"
                                marginY={10}
                            />
                        )}
                    </Table.Body>
                </Table>
*/
