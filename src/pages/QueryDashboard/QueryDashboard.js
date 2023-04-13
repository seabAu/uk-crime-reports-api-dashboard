import React, { useState, useEffect, useRef } from "react";

// Redux state management
import { useDispatch, useSelector } from 'react-redux';
import {
    SetMenu,
    SetTheme,
    SetEnvironment,
    SetDebug,
    SetLoading,
    SetFetching,
    SetCache,
    ReloadData,
} from '../../redux/rootSlice';

// Components
import axios, { isCancel, AxiosError } from "axios";

import QueryForm from "./QueryForm";
import Header from '../../components/Page/Header/Header';
import Sidebar from "../../components/Page/Sidebar/Sidebar";
import Content from "../../components/Page/Content/Content.js";
import Table from "../../components/Table/Table";
import Tabs from "../../components/Tabs/Tabs";
import MapContainer from "../../components/Map/MapContainer";
// import Loader from "./Loader";
// import DashboardContent from "./DashboardContent";
import SidePanel from "../../components/Page/SidePanel/SidePanel.js";
// import {
//     getMetroNeighborhoodsData,
//     getMetroResultsData,
// } from "../api/sampledata.js";
import CopyButton from "../../components/DataViewer/CopyButton.js";

// Utilities
import * as util from '../../utilities';
import * as api from '../../api';
import * as db from '../../components/LocalDB/LocalDatabaseHandler.js';
import * as ENV_VARS from '../../global/env';
function QueryDashboard( props )
{
    const {
        progressInfo,
        setProgressInfo,
        showSidebar,
        setShowSidebar,
    } = props;

    const dispatch = useDispatch();
    const { menu, theme, environment, debug, loading, fetching, cache, reloadData } =
        useSelector(state => state.root);

    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [abort, setAbort] = useState(false);

    // Show/hide state for various components.
    const [showContent, setShowContent] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [sidePanelID, setSidePanelID] = useState("");
  const [ sidePanelData, setSidePanelData ] = useState( [] );
  
    // State arrays for query options.
    const [dates, setDates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [forces, setForces] = useState([]);
    const [forceNeighborhoods, setForceNeighborhoods] = useState([]);

    // State for chosen inputs.
    const [queryString, setQueryString] = useState(""); // String for the table downloader to use for its filename. It util.ao.has to be set all the way up here!
    const [date, setDate] = useState([]); // = useState([`2022-9`]);
    const [category, setCategory] = useState("");
    const [force, setForce] = useState("");
    const [forceNeighborhood, setForceNeighborhood] = useState([]);

    // State for checking if query input is valid.
    const [error, setError] = useState(null);
    const [errorLog, setErrorLog] = useState([]);
    const [crimeReports, setCrimeReports] = useState([]);

    // const bottomRef = useRef();

    // axios.defaults.headers.get["Content-Type"] = "application/json;charset=utf-8";
    // axios.defaults.headers.get[ "Access-Control-Allow-Origin" ] = "*";
    
    // Fetch category and force options on load.
    useEffect(() => {
        console.log("Onload");
        Promise.all([api.getCategories(), api.getForces()])
            .then(([categories, forces]) => {
                console.log("categories, forces = ", [categories, forces]);
                setCategories(categories);
                setForces(forces);
                // setDates(generateDateOptions());
                setDates(util.time.generateDateOptions(2017, 8));
                setIsLoading(false);
            })
            .catch((error) => setError(error))
            .then(() => setIsLoading(false)) //;
            .then(() => {
                // Boot up the local DB!
                if (!db.IsDBSet()) {
                    db.InitializeLocalDB();
                    db.setDBKey(`forces`, forces);
                    db.setDBKey(`categories`, categories);
                    db.setDBKey(`dates`, dates);
                } else {
                    console.table(
                        "Local DB = ",
                        db.GetDB(),
                        ", currently using: ",
                        // db.getLocalDBSize(),
                        db.getByteLength(JSON.stringify(db.GetDB())),
                    );
                }
            });
    }, []);

    // Handle updates when the selected Force is changed.
    useEffect(() => {
        // setForce(force);
        ////// setIsLoading(true);
        if (force) {
            Promise.all([api.getNeighbourhoodList(force)])
                .then(([forceNeighborhoods]) => {
                    setForceNeighborhoods(forceNeighborhoods);
                    // Reset the selected force neighborhood too.
                    setForceNeighborhood([]);
                })
                .catch((error) => setError(error))
                .then(() => setIsLoading(false));
        }
    }, [force]);

    // Mainly used for debug, use this to update the text outputs for all the changes in state.
    useEffect(() => {
        console.log(
            "\nquery = ",
            query,
            "\nmenu = ",
            menu,
            "\ncategories = ",
            categories,
            "\ncategory = ",
            category,
            "\nforces = ",
            forces,
            "\nforce = ",
            force,
            "\nforceNeighborhoods = ",
            forceNeighborhoods,
            "\nforceNeighborhood = ",
            forceNeighborhood,
            "\ndate = ",
            date,
            "\nisFetching = ",
            isFetching,
            "\nshowContent = ",
            showContent,
            "\nshowTable = ",
            showTable,
            "\nshowMap = ",
            showMap,
            "\nqueryString = ",
            queryString,
        );
    }, [
        query,
        menu,
        forces,
        force,
        date,
        categories,
        category,
        forceNeighborhoods,
        forceNeighborhood,
        isFetching,
        showContent,
        showTable,
        showMap,
        queryString,
    ]);

    // Useeffect for handling the side panel
    useEffect(() => {
        console.log("SidePanelID = ", sidePanelID);
        if (sidePanelID && sidePanelID !== " ") {
            Promise.all([api.getCrimeOutcomes(sidePanelID)])
                .then(([sidePanelData]) => {
                    setSidePanelData(sidePanelData);
                    setIsLoading(false);
                    console.log(
                        "SidePanelID = ",
                        sidePanelID,
                        ", sidePanelData = ",
                        sidePanelData,
                    );
                })
                .then(() => {
                    setShowSidePanel(true);
                })
                .catch((error) => setError(error))
                .then(() => setIsLoading(false));
        } else {
            setSidePanelData([{ data: "No data provided." }]);
        }
    }, [sidePanelID]);

    useEffect(() => {
        console.log(`QueryDashboard :: ABORT = ${abort ? "TRUE" : "FALSE"}`);
        if (abort === true) {
            // Abort whatever query we're performing right now.
            // Reset the value.
            setTimeout(() => {
                // Reset the abort flag.
                setAbort(false);
            }, 8000);
        }
    }, [abort]);

    const getDataForNeighborhoods = async (force, neighborhoods) => {
        let src = `getDataForNeighborhoods`;
        // console.log(`${src} :: `, force, neighborhoods);

        if (util.val.isValidArray(neighborhoods)) {
            // console.log(`${src} :: `, neighborhoods, ` is a valid array. `);
            let callArray = [];
            for (const neighborhood of neighborhoods) {
                // console.log(`${src} :: `, neighborhood);
                if (neighborhood) {
                    let id;
                    if (typeof neighborhood === "object") {
                        if ("id" in neighborhood) {
                            id = neighborhood.id;
                        }
                    } else {
                        id = neighborhood;
                    }
                    let newCall = api.apiNeighborhoodInformation(force, id);
                    callArray.push({
                        ...newCall,
                        neighborhood_info: {
                            force_id: force,
                            id: id,
                        },
                    });
                    // console.log(`${src} :: CallArray is now: `, callArray);
                    // let res = await getNeighbourhoodInformation(
                    //     force,
                    //     id,
                    // );
                }
            }
            // return locations;

            let errors = [];
            let results = [];
            // console.log(
            //     `${src} :: CallArray constructed :: `,
            //     callArray,
            // );
            if (callArray) {
                // results = await handleFetchArray(callArray, src, results, []);
                results = await batchFetchArray(callArray, src, [
                    "force_id",
                    "neighborhood_name",
                    // "neighborhood_id",
                ]);
                results = results.results;
                errors = results.errors;
                console.log(
                    `${src} :: results = `,
                    results,
                    `, errors = `,
                    errors,
                );
                return results;
            } else {
                console.error(
                    `ERR::${src} :: CallArray was not constructed correctly :: `,
                    force,
                    neighborhoods,
                );
                return [];
            }
        } else {
            console.error(
                `ERR::${src} :: Given undefined values :: `,
                force,
                neighborhoods,
            );
            return [];
        }
    };

    const getFormattedOptions = (
        selectedOptions,
        allOptions,
        optionObjectKey = 'id',
        selectAllOption = 'all'
    ) =>
    {
        if ( util.val.isValidArray( allOptions, true ) && (
                selectedOptions === selectAllOption ||
                selectedOptions.toString().includes(selectAllOption)
            )
        )
        {
            // Get only the date keys in the YYYY-MM format, not their labels.
            return allOptions
                .filter( optionObject =>
                {
                    
                    return (
                        optionObject[optionObjectKey] !== undefined &&
                        optionObject[optionObjectKey] !== selectAllOption
                    );
                })
                .map(optionObject => optionObject[optionObjectKey]);
        } else {
            // Get only the date keys in the YYYY-MM format, not their labels.
            if (Array.isArray(selectedOptions)) {
                return selectedOptions.filter(option => {
                    return option !== undefined && option !== selectAllOption;
                });
            } else {
                return [selectedOptions.toString()];
            }
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        let src = `handleSearch`;
        console.log(
            `${src} triggered :: `,
            force,
            date,
            `, query = `,
            query,
            // `, query.apiCall(query) = `,
            // query.apiCall(query),
        );
        // console.log(`${src} triggered :: `, force, date, `, query = `, query, query.apiValues, query.apiCall(), event, event.target, event.target.date.value, event.target.force.value);

        setIsFetching(true);
        setShowMap(false);
        setShowTable(false);
        setShowContent(true);

        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        // For some reason, the query object won't have the latest state data, so let's pass it along to it.
        let apiQuery = query;
        let apiQueryValues = apiQuery.apiValues;
        if ("date" in apiQueryValues) {
            if (!date) {
                return;
            }
            // apiQueryValues.date = getSelectedDates(date);
            apiQueryValues.date = getFormattedOptions(
                date,
                dates,
                "key",
                'all_dates');
        }
        if ("force" in apiQueryValues) {
            if (!force) {
                return;
            }
            apiQueryValues.force = force;
        }
        if ("category" in apiQueryValues) {
            if (!category) {
                return;
            }
            apiQueryValues.category = category;
        }

        if ("neighborhood" in apiQueryValues) {
            if (!forceNeighborhood) {
                return;
            }
            // apiQueryValues.neighborhood = getSelectedNeighborhoods(forceNeighborhood);
            apiQueryValues.neighborhood = getFormattedOptions(
                forceNeighborhood,
                forceNeighborhoods,
                'id',
                'all_neighborhoods'
            );
        }

        // if ( "lat" in apiQueryValues || "lng" in apiQueryValues )
        if (
            "location_centre" in apiQueryValues ||
            "location_id" in apiQueryValues
        ) {
            if (!forceNeighborhood) {
                return;
            }
            // Wait for data to come back about the selected set of neighborhoods.
            let neighborhoodsArray = // getSelectedNeighborhoods(forceNeighborhood);
            getFormattedOptions(
                forceNeighborhood,
                forceNeighborhoods,
                'id',
                'all_neighborhoods'
            );

            let neighborhoodDataArray = await getDataForNeighborhoods(
                force,
                neighborhoodsArray,
            );
            if ("location_centre" in apiQueryValues) {
                apiQueryValues.location_centre = neighborhoodDataArray;
            }
            if ("location_id" in apiQueryValues) {
                apiQueryValues.location_id = neighborhoodDataArray;
            }
        }

        apiQuery.apiValues = apiQueryValues;
        console.log(
            `${src} config before fetching call array: :: `,
            force,
            date,
            `, query = `,
            query,
            `, query.apiCall(query) = `,
            query.apiCall(apiQuery),
        );
        let callArray = await query.apiCall(apiQuery);

        let results = [];
        console.log(`${src} :: CallArray constructed :: `, callArray);
        if (callArray) {
            if (callArray.length > 0) {
                setQueryString(`${query.id ?? src}_${force}`);
                // results = await handleFetchArray(callArray, src, results, []);
                results = await batchFetchArray(callArray, src, results, []);
                let reports = results.results;
                let errors = results.errors;

                if (reports) {
                    setCrimeReports(reports);
                    console.log("Setting reports: ", reports);
                }
                if (errors) {
                    setErrorLog(errors);
                    console.log("Setting errors log: ", errors);
                }
                setShowTable(true);
                // Check if there is any location data in the results before enabling the map.
                setShowMap(true);
            }
        } else {
            return;
        }
        console.log("reports = ", results);

        setProgressInfo([{ message: "", currValue: 0 }]);
        setIsFetching(false);

        // Finally, update the local DB with the query vars, the query results, and the query error log.
    };

    // This version clumps urls into groups of (up to) 15 fetch-promises and uses Promise.AllSettled to batch resolve them.
    const batchFetchArray = async (
        callArray,
        src,
        splicekeys,
        isRetry = false,
        batchSize,
    ) => {
        let errors = [];
        let results = [];
        batchSize = ENV_VARS.MAX_CONSECUTIVE_CALLS;
        if (callArray.length < ENV_VARS.MAX_CONSECUTIVE_CALLS) {
            batchSize = callArray.length; //  - 1;
        }

        console.log(`batchFetchArray :: CallArray received :: `, callArray);
        if (callArray) {
            if (callArray.length > 0) {
                // Start callin'!

                let currTime = new Date();
                let callNum = 0;
                let successes = 0;
                let startTime = new Date();
                let callVars;
                let callURL;

                let retryCalls = [];
                let promiseBatch = [];

                setProgressInfo([
                    {
                        id: `batchFetchProgress_${src}`,
                        message: `Fetching results for call ${callNum} of ${callArray.length}`, // :: ${currCall}`,
                        currValue: 0,
                        endValue: callArray.length,
                        startTime: startTime,
                        currTime: currTime,
                        results: 0,
                        success: 0,
                        failure: 0,
                        currentCall: ``,
                    },
                ]);

                let i = 0;
                for (i = 0; i < callArray.length && abort !== true; i++) {
                    // console.log(`batchFetchArray :: running call #${i}: `, callArray[i]);
                    // First, if abort is triggered, halt the loop and return what we have so far.
                    // if ( abort === true )
                    // {
                    //     promiseBatch = [];
                    //     console.log(
                    //         "Aborting! Returning results = ",
                    //         results,
                    //         " and error log = ",
                    //         errors,
                    //     );
                    //     return {
                    //         results: results,
                    //         errors: errors,
                    //     };
                    // }
                    let call = callArray[i];

                    // for (const call of callArray) {
                    currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    callNum++;
                    let currentCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;
                    let seconds =
                        (currTime.getTime() - startTime.getTime()) / 1000;
                    let callsPerSecond = Math.round((i / seconds) * 100) / 100;
                    setProgressInfo([
                        {
                            id: `batchFetchProgress_${src}`,
                            message: `Fetching results for call ${callNum} of ${callArray.length}\n\n${callsPerSecond} per sec`, // :: ${currCall}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: results.length,
                            success: successes,
                            failure: errors.length,
                            currentCall: currentCall,
                        },
                    ]);

                    let res;
                    promiseBatch.push(
                        api.handleFetch(callURL, src, callVars, {
                            abortSignal: abort,
                            timeout: 8000,
                        }),
                    );

                    if (
                        promiseBatch.length >= batchSize ||
                        callArray.length - i <= promiseBatch.length
                    ) {
                        // Process them

                        try {
                            res = await Promise.allSettled(promiseBatch)
                                .then((data) => (res = data))
                                .catch((error) =>
                                    console.log("Allsettled error: ", error),
                                );
                        } catch (error) {
                            errors.push(
                                api.constructFetchError(
                                    `${src}::${currentCall}`,
                                    callURL,
                                    callVars,
                                    res,
                                ),
                            );
                        }

                        // const succeededValues = res
                        //     .filter((o) => o.status === "fulfilled")
                        //     .map((s) => s.value);
                        //
                        // const failedValues = res
                        //     .filter((o) => o.status === "rejected")
                        //     .map( ( f ) => f.reason );

                        console.log(
                            `${src} :: Called promise batch (${
                                promiseBatch.length
                            }): ${JSON.stringify(
                                promiseBatch,
                            )} with response RES = `,
                            res,
                        );

                        promiseBatch = [];
                        if (util.val.isValidArray(res)) {
                            // Success, append it to our reports list.
                            let data = [];
                            res.forEach((result, index) => {
                                if (result.status === "fulfilled") {
                                    // console.log(
                                    //     `Result value #${index} of res = `,
                                    //     result.value,
                                    //     " :: type = ",
                                    //     typeof result.value,
                                    //     ", isarray? = ",
                                    //     Array.isArray(result.value),
                                    //     ", util.ao.has(val): ",
                                    //     util.ao.has(result.value),
                                    // );
                                    if (result.value) {
                                        let val = result.value;
                                        if (Array.isArray(val)) {
                                            if (
                                                val[0] !== undefined &&
                                                val[0] !== null
                                            ) {
                                                data = [...data, ...val];
                                            } else {
                                            }
                                        } else if (typeof val === "object") {
                                            // Val is an object.
                                            // Our custom errors will come through as fulfilled, so we have to filter them out.
                                            if (util.ao.has(val, "status")) {
                                                if (val.status === 429) {
                                                    retryCalls.push(call);
                                                    console.log(
                                                        `val had 429 error: `,
                                                        val,
                                                        ", retryCalls is now: ",
                                                        retryCalls,
                                                    );
                                                }

                                                errors.push(val);
                                            } else {
                                                // We've received a single object as our resulting data instead of our custom errors. This usually happens with the neighborhood information calls.
                                                // data = [...data, val];
                                                // data.push( ...val );
                                                data.push(val);
                                            }
                                        }
                                    }
                                } else if (result.status === "rejected") {
                                    errors.push(result);
                                }
                            });
                            if (data.length > 0) {
                                successes += data.length;
                                let compiled = util.ao.SpliceObjArray(
                                    data,
                                    call,
                                    // {
                                    //     // force_id: force,
                                    //     // neighborhood: neighborhoodData.name,
                                    // }
                                );
                                results = [...results, ...compiled];
                            }

                            // Handle errors
                            console.log(
                                "res = ",
                                res,
                                // ", succeededValues = ",
                                // succeededValues,
                                "Data = ",
                                data,
                                // "res as string = ",
                                // JSON.stringify(res),
                                // "compiled = ",
                                // compiled,
                                "results = ",
                                results,
                                ", errors = ",
                                errors,
                            );
                        } else {
                            // The returned response is undefined, so define a new error here.
                            errors.push(
                                api.constructFetchError(
                                    `${src}::${currentCall}`,
                                    callURL,
                                    callVars,
                                    res,
                                ),
                            );
                        }
                    }
                    // lastCallURL = callURL;
                    // lastCallVars = callVars;
                } // End of loop //

                // Retry calls that received 429 errors
                if (retryCalls && !isRetry) {
                    if (retryCalls.length > 0) {
                        let retry = await batchFetchArray(
                            retryCalls,
                            src,
                            splicekeys,
                            true,
                            batchSize,
                        );
                        if (retry) {
                            if ("results" in retry) {
                                console.log(
                                    `batchFetchArray :: recieved retry results = `,
                                    retry,
                                    `, returning: `,
                                    {
                                        calldata: callArray,
                                        results: [...results, ...retry.results],
                                        errors: [...errors, ...retry.errors],
                                    },
                                );
                                return {
                                    calldata: callArray,
                                    results: [...results, ...retry.results],
                                    errors: [...errors, ...retry.errors],
                                };
                            }
                        }
                    }
                }
            } else {
                // Callarray provided was defined but empty.
            }
        } else {
            // Callarray provided was undefined.
        }
        return {
            calldata: callArray,
            results: results,
            errors: errors,
        };
    };

    // if (isLoading) return <Loader progressInfo={progressInfo} />;
    if (error) return `An error util.ao.has occurred: ${error.message}`;

    return (
        <>
            <Sidebar
                isFetching={isFetching}
                showSidebar={showSidebar}
            >
                <QueryForm
                    query={query}
                    setQuery={setQuery}
                    isFetching={isFetching}
                    abort={abort}
                    setAbort={setAbort}
                    // Arrays of options to pass into the query form on the query menu.
                    categories={categories}
                    forces={forces}
                    dates={dates}
                    forceNeighborhoods={forceNeighborhoods}
                    // Arrays of selected options for the query form on the query menu.
                    category={category}
                    force={force}
                    forceNeighborhood={forceNeighborhood}
                    date={date}
                    // State functions for the query form to use to set the new values when selected.
                    setCategory={setCategory}
                    setForce={setForce}
                    setForceNeighborhood={setForceNeighborhood}
                    setDate={setDate}
                    // Search function
                    handleSearch={handleSearch}
                />
            </Sidebar>
            <div className="page-content">
                <Header
                    showSidebar={showSidebar}
                    toggleSidebar={() => setShowSidebar(!showSidebar)}
                    showTitle={!showTable}
                    menu={menu}
                />
                {
                    <Content
                        isFetching={isFetching}
                        isLoading={isLoading}
                        progressInfo={progressInfo}
                        showContent={showContent}
                    >
                        <Tabs
                            type="top"
                            fillArea={true}
                            centered={true}
                            padContent={false}
                            roundedNav={true}
                        >
                            <div
                                className=""
                                label="Datatable View"
                                id="query-dashboard-datatable-view"
                            >
                                {!isFetching &&
                                    showTable &&
                                    !util.val.isValidArray(
                                        crimeReports,
                                        true
                                    ) && (
                                        <Table
                                            isVisible={showTable}
                                            isFetching={isFetching}
                                            dataName={queryString}
                                            tableData={[
                                                {
                                                    'no results':
                                                        'There was no data available for this search.',
                                                },
                                            ]}
                                            hideColumns={[]}
                                        ></Table>
                                    )}

                                {!isFetching &&
                                    util.val.isValidArray(crimeReports, true) &&
                                    showTable && (
                                        <Table
                                            // isVisible={showTable}
                                            isFetching={isFetching}
                                            isFilterable={true}
                                            isSortable={true}
                                            dataName={queryString}
                                            tableData={crimeReports}
                                            setShowSidePanel={setShowSidePanel}
                                            setSidePanelID={setSidePanelID}
                                            cellOnClick={event => {}}
                                            rowOnClick={(rowIndex, rowData) => {
                                                console.log(
                                                    'Rowonclick triggered :: ',
                                                    rowIndex,
                                                    rowData
                                                );
                                                if (rowData) {
                                                    if (
                                                        'persistent_id' in
                                                        rowData
                                                    ) {
                                                        setSidePanelID(
                                                            rowData.persistent_id
                                                        );
                                                    }
                                                }
                                            }}
                                        ></Table>
                                    )}
                            </div>
                            {showMap &&
                                !isFetching &&
                                util.val.isValidArray(crimeReports, true) && (
                                    <div
                                        className=""
                                        label="Map View"
                                        id="query-dashboard-map-view"
                                    >
                                        <MapContainer
                                            isFetching={isFetching}
                                            data={crimeReports}
                                            theme={theme}
                                        ></MapContainer>
                                    </div>
                                )}
                            {debug &&
                                !isFetching &&
                                util.val.isValidArray(errorLog, true) && (
                                    <div
                                        className=""
                                        label="Debug View"
                                        id="query-dashboard-debug-view"
                                    >
                                        <Table
                                            // isVisible={debug}
                                            isFetching={isFetching}
                                            isFilterable={true}
                                            isSortable={true}
                                            dataName={`${queryString}_errorlog`}
                                            tableData={errorLog}
                                            setShowSidePanel={setShowSidePanel}
                                            setSidePanelID={setSidePanelID}
                                        ></Table>
                                    </div>
                                )}
                        </Tabs>
                    </Content>
                }
                {sidePanelID && (
                    <SidePanel
                        isFetching={isFetching}
                        show={showSidePanel}
                        setShow={setShowSidePanel}
                        label={`${
                            sidePanelID
                                ? `Showing detailed data for crime id = ${sidePanelID}`
                                : 'Nothing selected.'
                        }`}
                        copydata={sidePanelData}
                    >
                        <>
                            {sidePanelData !== null &&
                                sidePanelData !== undefined &&
                                (typeof sidePanelData === 'object' ||
                                    Array.isArray(sidePanelData)) &&
                                util.dom.objArray2List(sidePanelData)}
                            {sidePanelData !== null &&
                                sidePanelData !== undefined &&
                                (typeof sidePanelData === 'object' ||
                                    Array.isArray(sidePanelData)) && (
                                    <CopyButton
                                        label={`${sidePanelID}`}
                                        data={sidePanelData}
                                    ></CopyButton>
                                )}
                        </>
                    </SidePanel>
                )}
            </div>
        </>
    );
};

export default QueryDashboard;

/*
    const getSelectedNeighborhoods = (input) => {
        if (
            input === "all_neighborhoods" ||
            input.toString().includes("all_neighborhoods")
        ) {
            // Select all neighborhoods regardless of which ones are selected alongside the "all_neighborhoods" option.
            return forceNeighborhoods
                .filter((neighborhood) => {
                    return (
                        neighborhood.id !== undefined &&
                        neighborhood.id !== "all_neighborhoods"
                    );
                })
                .map((neighborhood) => neighborhood.id);
        } else {
            // More than 1 neighborhood is selected, but not all of them. Run through and make sure none of them are invalid.
            if (Array.isArray(input)) {
                return input.filter((neighborhood) => {
                    return (
                        neighborhood !== undefined &&
                        neighborhood !== "all_neighborhoods"
                    );
                });
            } else {
                return [input.toString()];
            }
        }
    };

    const getSelectedDates = (input) => {
        if ( input === "all_dates" ||
             input.toString().includes( "all_dates" ) )
        {
            // Get only the date keys in the YYYY-MM format, not their labels.
            return dates
                .filter((dateObject) => {
                    return (
                        dateObject.key !== undefined &&
                        dateObject.key !== "all_dates"
                    );
                })
                .map((dateObject) => dateObject.key);
        } else {
            // Get only the date keys in the YYYY-MM format, not their labels.
            if (Array.isArray(input)) {
                return input.filter((dateID) => {
                    return ( dateID !== undefined &&
                             dateID !== "all_dates" );
                });
            } else {
                return [input.toString()];
            }
        }
    };

                        <DashboardContent
                            isFetching={isFetching}
                            isLoading={isLoading}
                            progressInfo={progressInfo}
                            crimeReports={crimeReports}
                            queryString={queryString}
                            bottomRef={bottomRef}
                            showContent={showContent}
                            showTable={showTable}
                            showMap={showMap}
                            setShowSidePanel={setShowSidePanel}
                            setSidePanelID={setSidePanelID}
                            setSidePanelData={setSidePanelData}
                            theme={theme}
                            debug={debug}
                            errorLog={errorLog}
                            menu={menu}
                        />

*/