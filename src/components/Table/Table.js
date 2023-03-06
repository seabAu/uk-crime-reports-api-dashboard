import React, { useEffect, useState } from "react";
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
    getObjKeys,
    arrayIsValid,
    filterDataFast,
} from "../Utilities/ObjectUtils.js";
import Select from "../Form/Select";
import TableFoot from "./TableFoot";

function Table(props) {
    // The tableData contains an array of objects. To construct the header, we use just the first object in the array and grab its keys' names.
    const {
        // isVisible,
        isFetching,
        isFilterable,
        isSortable,
        dataName,
        tableData,
        setShowSidePanel,
        setSidePanelID,
    } = props;

    const appendIndex = (data) => {
        // Simple routine to add an index key-value pair to each entry in the dataset.
        return data.map((obj, index) => {
            let proparray = Object.entries(obj);
            proparray.unshift(["index", index]);
            return Object.fromEntries(proparray);
        });
    };

    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [pageNum, setPageNum] = useState(0);
    const [columnsVisible, setColumnsVisible] = useState([]);
    const [filters, setFilters] = useState([]);
    const [renderData, setRenderData] = useState(appendIndex(tableData));
    const [headers, setHeaders] = useState([]);
    const [tableID, setTableID] = useState(Math.floor(Math.random() * 1000000));

    const getPageEntries = (data, page, numPerPage, filters = []) => {
        if (!data) {
            return [{ Error: "No data." }];
        }

        let entries = [];
        let startIndex = page * numPerPage;
        let endIndex = page * numPerPage + numPerPage - 1;
        for (var i = 0; i < data.length; i++) {
            if (data[i]) {
                if (i >= startIndex && i <= endIndex) {
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
        const numPages = Math.ceil(dataLen / parseInt(numPerPage));
        if (page >= 0 && page < numPages) {
            // if (dataLen > entriesPerPage) {
            setTimeout(() => {
                return setPageNum(parseInt(page));
            }, 10);
        }
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

    
    useEffect(() => {
        changePage(renderData.length, 0, entriesPerPage);
    }, [entriesPerPage]);
    
    useEffect( () =>
    {
        if ( arrayIsValid( tableData, true ) )
        {
            let temp = appendIndex(tableData);
            setHeaders(getObjKeys(temp[0]));
            // setRenderData(filterData(temp, filters));
            setRenderData(filterDataFast(temp, filters));
        }
    }, [tableData, filters]);
    
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
                <div className="table-options">
                    <Select
                        height={50}
                        width={100}
                        label="Set results per page"
                        key="table-set-pagelength"
                        id="table-set-pagelength"
                        name="table-set-pagelength"
                        value={entriesPerPage}
                        unsetOption="-"
                        optionsConfig={[
                            5, 10, 15, 20, 30, 50, 75, 100, 200,
                        ].map((option, index) => {
                            return {
                                key: `${index}`,
                                value: `${option}`,
                                label: `${option}`,
                            };
                        })}
                        multiple=""
                        disabled={isFetching ?? ""}
                        onChange={(value) => {
                            if (value) {
                                if (!isNaN(value)) {
                                    if (value > 0 && value < 200) {
                                        setEntriesPerPage(+value);
                                    }
                                }
                            }
                        }}></Select>
                    {headers && arrayIsValid(tableData, true) && (
                        <Select
                            height={50}
                            width={100}
                            label="Hide or show columns"
                            key="table-set-columns"
                            id="table-set-columns"
                            name="table-set-columns"
                            value={columnsVisible}
                            unsetOption="-"
                            optionsConfig={
                                headers // getObjKeys(tableData[0])
                                //.map( ( option, index ) =>
                                //{
                                //return {
                                //    key: `${index}`,
                                //    value: `${option}`,
                                //    label: `${option}`,
                                //};
                                //} )
                            }
                            multiple="multiple"
                            dropdown={true}
                            disabled={isFetching ?? ""}
                            onChange={(selected) => {
                                if (selected) {
                                    console.log(
                                        "Selected = ",
                                        selected,
                                        ", columnsVisible = ",
                                        columnsVisible,
                                    );
                                    setColumnsVisible(selected);
                                }
                            }}></Select>
                    )}
                </div>
            </div>
            <div className="table table-fixed-head">
                <table sortable={isSortable ? "true" : ""}>
                    <caption>{dataName}</caption>
                    {renderData &&
                        headers && ( // tableData && tableData[0] && (
                            <TableHead
                                tableID={tableID}
                                isFilterable={isFilterable}
                                isSortable={isSortable ? "true" : ""}
                                tableHeadings={headers}
                                changeFilters={changeFilters}
                                headerOnClick={(headerIndex, key, order) => {
                                    sortDataByKey(renderData, key, order);
                                }}
                                hideColumns={columnsVisible}></TableHead>
                        )}
                    {renderData && tableData && (
                        <TableBody
                            tableID={tableID}
                            tableData={getPageEntries(
                                renderData,
                                pageNum,
                                entriesPerPage,
                                [],
                            )}
                            hideColumns={columnsVisible}
                            rowOnClick={(rowIndex, rowData) => {
                                if (rowData) {
                                    if ("persistent_id" in rowData) {
                                        setSidePanelID(rowData.persistent_id);
                                    }
                                }
                            }}
                            cellOnClick={(
                                cellIndex,
                                cellData,
                            ) => {}}></TableBody>
                    )}
                    {renderData && headers && (
                        <TableFoot
                            tableID={tableID}
                            tableHeadings={headers}
                            numEntries={renderData.length}
                            entriesPerPage={parseInt(entriesPerPage)}
                            pageNum={parseInt(pageNum)}
                            changePage={changePage}
                        ></TableFoot>
                    )}
                </table>
            </div>
            {renderData && renderData.length > 0 && (
                <TablePagination
                    tableID={tableID}
                    numEntries={renderData.length}
                    entriesPerPage={parseInt(entriesPerPage)}
                    pageNum={parseInt(pageNum)}
                    changePage={changePage}
                />
            )}
        </div>
    );
}

export default Table;

