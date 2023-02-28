import React, { useEffect } from "react";
import { useState } from "react";
import TableBody from "./TableBody";
import TableDownload from "./TableDownload";
import TableHead from "./TableHead";
import TablePagination from "./TablePagination";

import {
    SanitizeObj,
    SanitizeObjArray,
    SpliceObjArray,
    flatMapObjText,
    isValid,
} from "../ObjectUtils/ObjectUtils.js";
import Select from "../Form/Select";

function Table({
    isVisible,
    isFetching,
    isFilterable,
    isSortable,
    dataName,
    tableData,
    hideColumns,
    // entriesPerPage,
    // setEntriesPerPage,
    // pageNum,
    // setPageNum,
    // changePage,
    setShowSidePanel,
    setSidePanelID,
}) {
    // The tableData contains an array of objects. To construct the header, we use just the first object in the array and grab its keys' names.

    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [pageNum, setPageNum] = useState(0);
    const [filters, setFilters] = useState([]);
    const [renderData, setRenderData] = useState(tableData);

    // console.log( "Table onrender :: ",
    // "\nisVisible = ", isVisible,
    // "\nisFetching = ", isFetching,
    // "\ndataName = ", dataName,
    // "\ntableData = ", tableData,
    // "\nhideColumns = ", hideColumns,
    // "\nsetShowSidePanel = ", setShowSidePanel,
    // "\nentriesPerPage = ", entriesPerPage,
    // "\npageNum = ", pageNum,
    // "\nfilters = ", filters,
    // "\nrenderData = ", renderData,
    // );

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
                                changePage(
                                    dataLen,
                                    event.target.innerText,
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

    // Sorting function from https://blog.logrocket.com/creating-react-sortable-table/
    const sortDataByKey = (data, key, order = "asc") => {
        if (key) {
            const sortedData = [...data].sort((a, b) => {
                if (a[key] === null) return 1;
                if (b[key] === null) return -1;
                if (a[key] === null && b[key] === null) return 0;
                return (
                    a[key].toString().localeCompare(b[key].toString(), "en", {
                        numeric: true,
                    }) * (order === "asc" ? 1 : -1)
                );
            });
            setRenderData(sortedData);
        }
    };

    const getPageEntries = (data, page, numPerPage, filters = []) => {
        if (!data) {
            return [{ Error: "No data." }];
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

    useEffect(() => {
        setRenderData(filterData(tableData, filters));
    }, [filters]);
    
    function filterObject ( obj, callback )
    {
        return Object.fromEntries(
            Object.entries(obj).filter(([key, val]) => callback(val, key)),
        );
    }

    const filterData3 = (data, filters) => {
        if (data) {
            if (filters.length > 0) {
                // New tactic: run loop for each object in data, and run the internal loop on each filter inside that.
                let filteredData = [];
                data.forEach((item, index) => {});
            } else {
                // Do nothing, just return the input.
                return data;
            }
        } else {
            // Do nothing, just return the input.
            return data;
        }
    };

    const filterData = (data, filters) => {
        // console.log(
        //     "FilterData() :: BEFORE :: ",
        //     "\ndata",
        //     data,
        //     "\ndata has ",
        //     data.length,
        //     "elements.",
        // );
        // console.log( "FilterData :: ", filters.length );
        if (filters.length > 0) {
            let filteredData = data;
            // Filters in the format {key: key, value: filterString}.
            filters.forEach((element) => {
                if (element.key && element.value) {
                    // For each filter.
                    let filterKey = element.key;
                    let filterValue = element.value.toLowerCase();
                    // console.log(
                    //     "FilterData() :: ",
                    //     "\nfilters", filters,
                    //     "\nfilterKey", filterKey,
                    //     "\nfilterValue", filterValue,
                    //     "\nfilteredData", filteredData,
                    //     "\nfilteredData has ", filterData.length, "elements."
                    // );
                    filteredData = filteredData.filter((obj, index) => {
                        // Filter for each object in the array.

                        // console.log(
                        //     "Filtering obj = ",
                        //     obj,
                        //     "obj[filterKey] = ",
                        //     obj[filterKey],
                        //     " with filter = ",
                        //     filterValue,
                        // );
                        if (obj) {
                            // Object is valid.
                            if (obj.hasOwnProperty(filterKey)) {
                                // Object contains the key we're filtering for.
                                if (obj[filterKey]) {
                                    // Object has a valid value.
                                    if (typeof obj[filterKey] === "object") {
                                        // Not (easily) filterable.
                                        // return obj;
                                        // console.log(
                                        //     "Filtering object = ",
                                        //     obj,
                                        //     obj[filterKey],
                                        //     Object.values(obj[filterKey])
                                        //         .toString()
                                        //         .toLowerCase(),
                                        // );
                                        // return JSON.stringify(obj[filterKey]).toLowerCase().includes(filterValue);
                                        // return obj[ filterKey ].toString().toLowerCase().includes( filterValue );
                                        return Object.values(obj[filterKey])
                                            .toString()
                                            .toLowerCase()
                                            .includes(filterValue);
                                    } else if (Array.isArray(obj[filterKey])) {
                                        // Not (easily) filterable.
                                        // return obj[filterKey].filter((item) => {
                                        //     return item
                                        //         .toLowerCase()
                                        //         .includes(filterValue);
                                        // });
                                        return obj[filterKey].some((item) => {
                                            return item
                                                .toLowerCase()
                                                .includes(filterValue);
                                        });
                                    } else {
                                        // console.log( "Filtering normal input: ", obj[ filterKey ] );
                                        return obj[filterKey]
                                            .toString()
                                            .toLowerCase()
                                            .includes(filterValue);
                                    }
                                } else {
                                    // Object does not have a valid value.
                                    // This could be something like undefined, null, '', or some other invalid value.
                                    return true;
                                }
                            } else {
                                // Object does not contain the key we're filtering for.
                                return true;
                            }
                        } else {
                            // Object is invalid.
                            return true;
                        }
                    });
                }
            });
            // console.log(
            //     "FilterData() :: AFTER :: ",
            //     "\nfilteredData", filteredData,
            //     "\nfilteredData has ", filterData.length, "elements."
            // );
            return filteredData;
        } else {
            // Return data as-is.
            return data;
        }
    };

    const changeFilters = (key, filter) => {
        // Set up to one filter per header key.
        // First check if filters already includes this key.
        // console.log("changeFilters :: key = ", key, " :: filter = ", filter, " :: filters = ", filters);
        if (filters) {
            let filterKeys = filters.map((item, index) => {
                return item.key;
            });
            if (filterKeys.indexOf(key) > -1) {
                // We already have a filter for this key, update it.
                if (filter !== undefined && filter !== null && filter !== "") {
                    setFilters(
                        filters.map((item) => {
                            if (item.key === key) {
                                // Replace with new filter string.
                                return { key: item.key, value: filter };
                            } else {
                                // Return the current value.
                                return { key: item.key, value: item.value };
                            }
                        }),
                    );
                } else {
                    // Invalid filter, delete its entry.
                    setFilters(
                        filters.filter((item) => {
                            return item.key !== key;
                        }),
                    );
                }
            } else {
                // We don't currently have a filter for this key, add it.
                if (
                    key !== undefined &&
                    key !== null &&
                    key !== "" &&
                    filter !== undefined &&
                    filter !== null &&
                    filter !== ""
                ) {
                    // setFilters(filters.concat({ key: key, value: filter }));
                    setFilters([...filters, { key: key, value: filter }]);
                }
            }
        } else {
            // We don't have any filters yet, so just add it!
            if (
                key !== undefined &&
                key !== null &&
                key !== "" &&
                filter !== undefined &&
                filter !== null &&
                filter !== ""
            ) {
                setFilters({ key: key, value: filter });
            }
        }

        // Prune out any invalid filter entries.
        // if ( filters )
        // {
        //     setFilters(
        //         filters.filter((element) => {
        //             return (
        //                 element.key !== undefined &&
        //                 element.key !== null &&
        //                 element.key !== "" &&
        //                 element.value !== undefined &&
        //                 element.value !== null &&
        //                 element.value !== ""
        //             );
        //         }),
        //     );
        // }

        // console.log( "changeFilters :: filters is now = ", filters );
        // setRenderData(filterData(renderData, filters));
    };

    return (
        <div className="table-container">
            <div className="flex-row">
                <TableDownload
                    dataName={dataName}
                    tableData={tableData}
                    downloadFileType="csv"></TableDownload>
                <div className="">
                    <Select
                        height={50}
                        width={ 100 }
                        label="Set results per page"
                        key="table-set-pagelength"
                        id="table-set-pagelength"
                        name="table-set-pagelength"
                        value={entriesPerPage}
                        unsetOption="-"
                        optionsConfig={
                            [5, 10, 15, 20, 30, 50, 75, 100, 200].map( ( option, index ) => {
                                return {
                                    key: `${index}`,
                                    value: `${option}`,
                                    label: `${option}`,
                                };
                            })
                        }
                        multiple="false"
                        disabled={isFetching ?? ""}
                        onChange={ ( value ) =>
                        { 
                            if ( value )
                            {
                                if ( !isNaN( value ) )
                                {
                                    if ( value > 0 && value < 200 )
                                    {
                                        setEntriesPerPage( value ); 
                                    }
                                }
                            }
                        }}></Select>
                </div>
            </div>
            <div className="table">
                <table sortable={isSortable ? "true" : ""}>
                    <caption>{dataName}</caption>
                    {isVisible && renderData && tableData && tableData[0] && (
                        <TableHead
                            isVisible={isVisible}
                            isFetching={isFetching}
                            isFilterable={isFilterable}
                            isSortable={isSortable ? "true" : ""}
                            tableHeadings={Object.keys(tableData[0]).map(
                                (key, index) => {
                                    return {
                                        id: index,
                                        key: key,
                                        // sortOrder: 'asc'
                                    };
                                },
                            )}
                            changeFilters={changeFilters}
                            headerOnClick={(headerIndex, key, order) => {
                                // console.log(
                                //     "Header clicked: ",
                                //     headerIndex,
                                //     key,
                                // );
                                // sortDataByKey(renderData, key, 1);
                                sortDataByKey(renderData, key, order);
                            }}
                            hideColumns={hideColumns}></TableHead>
                    )}
                    {isVisible && renderData && tableData && (
                        <TableBody
                            isVisible={isVisible}
                            isFetching={isFetching}
                            // tableData={tableData}
                            tableData={getPageEntries(
                                renderData,
                                pageNum,
                                entriesPerPage,
                                [],
                            )}
                            hideColumns={hideColumns}
                            rowOnClick={(rowIndex, rowData) => {
                                // console.log("Row clicked: ", rowIndex, rowData);
                                if (rowData) {
                                    if ("persistent_id" in rowData) {
                                        setSidePanelID(rowData.persistent_id);
                                    }
                                }
                            }}
                            cellOnClick={(cellIndex, cellData) => {
                                // console.log(
                                //     "Cell clicked: ",
                                //     cellIndex,
                                //     cellData,
                                // );
                            }}></TableBody>
                    )}
                </table>
            </div>
            {isVisible && renderData && renderData.length > 0 && (
                <div className="table-pagination-container">
                    {
                        <ul className="table-pagination">
                            {getPageButtons(
                                renderData.length,
                                pageNum,
                                entriesPerPage,
                            )}
                        </ul>
                    }
                    {
                        <p className="table-pagination-info">
                            {`Viewing ${pageNum * entriesPerPage} to ${
                                pageNum * entriesPerPage + entriesPerPage - 1 >
                                renderData.length
                                    ? renderData.length
                                    : pageNum * entriesPerPage +
                                      entriesPerPage -
                                      1
                            } of ${renderData.length} entries found.`}
                        </p>
                    }
                </div>
            )}
        </div>
    );
}

export default Table;

/*  // Sorting function snippet graveyard. // 
    // Abandon hope all ye who enter here. // 

    const sortDataByKey = (data, key, order) => {
        let sortedData = data.sort(compareValues(key, order));
        console.log(
            "Table :: sortDataByKey(): \n\n\nbefore = ",
            JSON.stringify(data),
            " :: \n\n\nafter = ",
            JSON.stringify(data.sort(compareValues(key, order))),
            " :: \n\n\ntest = ",
            JSON.stringify(data.sort(sortByKey(key, order))),
            " :: \n\n\ntest = ",
            JSON.stringify(sortArrayOfObjects(data, key)),
        );

        const data5 = [...data].sort((a, b) =>
            a[key].toString().localeCompare(b[key].toString(), "en", {
                numeric: true,
            }),
        );
        console.log("");
        // return data.sort( sortByKey( key, order ) ); // sortedData;
        setRenderData(sortedData);
        return sortedData;
        // return sortArrayOfObjects(data, key);
    };

    function compareValues(key, order = 1) {
        return function innerSort(a, b) {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA =
                typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
            const varB =
                typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            // console.log(`Table :: compareValues(): comparing [ ${varA}, ${varB} ] :: ${varA > varB} :: comparison = ${comparison}`); // sort by name
            return comparison * order;
        };
    }

    const sortArrayOfObjects = (arr, key) => {
        return arr.sort((a, b) => {
            return a[key] - b[key];
        });
    };

    const sortByKey = (sortKey, order) => (a, b) => {
        // return a[ sortKey ].toLowerCase() > b[ sortKey ].toLowerCase() ? 1 : -1;

        const varA =
            typeof a[sortKey] === "string"
                ? a[sortKey].toLowerCase()
                : a[sortKey];
        const varB =
            typeof b[sortKey] === "string"
                ? b[sortKey].toLowerCase()
                : b[sortKey];
        console.log(
            `Table :: compareValues( ${a}, ${b} ): comparing [ ${varA}, ${varB} ] :: ${
                varA > varB
            }`,
        ); // sort by name
        return varA > varB ? 1 * order : -1 * order;
    };

*/

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
