// React
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
import MapForm from "./MapForm";
import Header from '../../components/Page/Header/Header';
import Sidebar from "../../components/Page/Sidebar/Sidebar";
import Content from "../../components/Page/Content/Content";
import Tabs from "../../components/Tabs/Tabs";
import MapPolyContainer from '../../components/Map/MapPolyContainer';
import Table from '../../components/Table/Table';
import MapContainer from '../../components/Map/MapContainer';
import Droplist from '../../components/Droplist';

// Utility handler imports.
import * as api from '../../api';
import * as ENV_VARS from "../../global/env";
import * as util from '../../utilities/index';
// import { geoObj2geoArray } from "./Utilities/GeoUtilities";
// import * as gutil from "./Utilities/GeoUtilities";
// import * as util from "./Utilities/index";

function MapDashboard ( props )
{
    const {
        progressInfo,
        setProgressInfo,
        showSidebar,
        setShowSidebar,
    } = props;
    const dispatch = useDispatch();
    const {
        menu,
        theme,
        environment,
        debug,
        loading,
        fetching,
        cache,
        reloadData,
    } = useSelector(state => state.root);

    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [abort, setAbort] = useState(false);

    const [showContent, setShowContent] = useState(true);
    const [showTable, setShowTable] = useState(false);
    const [showSearchMap, setShowSearchMap] = useState(false);
    const [showResultsMap, setShowResultsMap] = useState(false);
    const [mapDatatype, setMapDatatype] = useState("point");
    // Drawn areas will be an array containing objects, each containing arrays of coordinate pairs describing an area.
    const [ selectedAreas, setSelectedAreas ] = useState(
        [
            // {
            //     id: 0,
            //     index: 0,
            //     type: "polygon",
            //     geometry: {
            //         center: {
            //             lat: 51.2296,
            //             lng: -2.31653,
            //         },
            //         areasqm: 10, // Write a function that calculates the area using the 'this.' selector.
            //         coordinates: [
            //             {
            //                 lat: 51.2296 + 1,
            //                 lng: -2.31653,
            //             },
            //             {
            //                 lat: 51.2296 - 1,
            //                 lng: -2.31653 - 1,
            //             },
            //             {
            //                 lat: 51.2296 - 1,
            //                 lng: -2.31653 + 1,
            //             },
            //         ],
            //     },
            // },
        ]
    );
    const [selectedArea, setSelectedArea] = useState([]); // = useState([`2022-9`]);

    const [dates, setDates] = useState(util.time.generateDateOptions());
    const [date, setDate] = useState([]); // = useState([`2022-9`]);
    const [coordinates, setCoordinates] = useState([
        {
            lat: 0,
            lng: 0,
        },
    ] ); // = useState([`2022-9`]);
    const [geometry, setGeometry] = useState([
        {
            id: 0,
            index: 0,
            geometry: {
                type: "polygon",
                center: {
                    lat: 51.2296,
                    lng: -2.31653,
                },
                areasqm: 10, // Write a function that calculates the area using the 'this.' selector.
                coordinates: [
                    {
                        lat: 51.2296 + 1,
                        lng: -2.31653,
                    },
                    {
                        lat: 51.2296 - 1,
                        lng: -2.31653 - 1,
                    },
                    {
                        lat: 51.2296 - 1,
                        lng: -2.31653 + 1,
                    },
                ],
            },
        },
        {
            id: 1,
            index: 1,
            geometry: {
                type: "point",
                coordinates: {
                    lat: 0,
                    lng: 0,
                },
            },
        },
    ]);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [errorLog, setErrorLog] = useState([]);
    const [ queryString, setQueryString ] = useState( "" ); // String for the table downloader to use for its filename. It util.ao.has to be set all the way up here!
    
    // Side panel stuff.
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [sidePanelID, setSidePanelID] = useState("");
    const [sidePanelData, setSidePanelData] = useState([]);

    const getSelectedAreaButtons = (areas) => {
        let coordinatesData = [];
        let buttons = [];
        areas.forEach((area, index) => {
            // console.log( "Building map sidebar buttons :: report #", index, " = ", report );
            if (area) {
                if ("center" in area) {
                    if (area.center !== null && area.center !== undefined) {
                        coordinatesData.push([
                            area.center.lat,
                            area.center.lng,
                        ]);
                        buttons.push(
                            <button
                                className="map-sidebar-button"
                                id={`map-sidebar-button-${area.id}`}
                                key={`map-sidebar-button-${area.id}`}
                                // onClick={(event) => {
                                //     setLatitude(report.location.latitude);
                                //     setLongitude(report.location.longitude);
                                // }}
                            >
                                {area.id}
                            </button>,
                        );
                    }
                }
            }
        });
        // setRenderData( coordinatesData );
        return buttons;
    };

    const getFormattedOptions = (
        selectedOptions,
        allOptions,
        optionObjectKey = 'id',
        selectAllOption = 'all'
    ) => {
        if (
            util.val.isValidArray(allOptions, true) &&
            (selectedOptions === selectAllOption ||
                selectedOptions.toString().includes(selectAllOption))
        ) {
            // Get only the date keys in the YYYY-MM format, not their labels.
            return allOptions
                .filter(optionObject => {
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

    // Mainly used for debug, use this to update the text outputs for all the changes in state.
    useEffect(() => {
        console.log(
            "MapDashboard :: \n\n",
            "\n",
            "query = ",
            query,
            "\n",
            "date = ",
            date,
            "\n",
            "selectedAreas = ",
            selectedAreas,
            "\n",
            "selectedArea = ",
            selectedArea,
            "\n",
            "coordinates = ",
            coordinates,
            "\n",
            "isFetching = ",
            isFetching,
            "\n",
            "showContent = ",
            showContent,
            "\n",
            "showTable = ",
            showTable,
            "\n",
            "showSearchMap = ",
            showSearchMap,
            "\n",
            "showResultsMap = ",
            showResultsMap,
            "\n",
            "queryString = ",
            queryString,
            "\n",
            "mapDatatype = ",
            mapDatatype,
        );
    }, [
        query,
        date,
        isFetching,
        showContent,
        showTable,
        showSearchMap,
        showResultsMap,
        queryString,
        selectedAreas,
        selectedArea,
        coordinates,
        mapDatatype,
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
        console.log("MapDashboard :: \n\n", "\n", "query = ", query);
        // Query changed. Check what type of data the map needs and change the mapDatatype.
        if (query) {
            if ("apiValues" in query) {
                if ( "coordinates" in query.apiValues )
                {
                    setSelectedAreas( [] );
                    setMapDatatype("point");
                } else if ("areas" in query.apiValues) {
                    setCoordinates( [] );
                    setMapDatatype("polygon");
                }
            }
        }
    }, [ query ] );
    
    const handleSearch = async (event) => {
        event.preventDefault();
        let src = `MapDashboard :: handleSearch`;
        console.log(
            `${src} triggered :: `,
            date,
            `, query = `,
            query,
            // `, query.apiCall(query) = `,
            // query.apiCall(query),
        );
        // console.log(`${src} triggered :: `, force, date, `, query = `, query, query.apiValues, query.apiCall(), event, event.target, event.target.date.value, event.target.force.value);

        setIsFetching(true);
        setShowResultsMap(false);
        setShowTable(false);
        setShowContent(true);

        // Clear the table.
        setTimeout(() => {
            setSearchResults([]);
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
                'key',
                'all_dates'
            );
        }

        if ("areas" in apiQueryValues) {
            if (!selectedAreas) {
                return;
            }
            // apiQueryValues.areas = getSelectedDates(selectedAreas);
            apiQueryValues.areas = selectedAreas; // getSelectedDates(selectedAreas);
        }

        if ("coordinates" in apiQueryValues) {
            if (!coordinates) {
                return;
            }
            apiQueryValues.coordinates = coordinates;
        }
        apiQuery.apiValues = apiQueryValues;
        console.log(
            `${src} config before fetching call array: :: `,
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
                setQueryString(`${query.id ?? src}_mapsearch`);
                // results = await handleFetchArray(callArray, src, results, []);
                results = await batchFetchArray(callArray, src, results, []);
                let reports = results.results;
                let errors = results.errors;

                if (reports) {
                    setSearchResults(reports);
                    console.log("Setting reports: ", reports);
                }
                if (errors) {
                    setErrorLog(errors);
                    console.log("Setting errors log: ", errors);
                }
                setShowTable(true);
                // Check if there is any location data in the results before enabling the map.
                setShowResultsMap(true);
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

    return (
        <>
            <Sidebar
                isFetching={isFetching}
                showSidebar={showSidebar}
            >
                <MapForm
                    query={query}
                    setQuery={setQuery}
                    isFetching={isFetching}
                    // Arrays of options to pass into the query form on the query menu.
                    selectedAreas={selectedAreas}
                    dates={dates}
                    // Arrays of selected options for the query form on the query menu.
                    date={date}
                    coordinates={coordinates}
                    selectedArea={selectedArea}
                    // State functions for the query form to use to set the new values when selected.
                    setDate={setDate}
                    setCoordinates={setCoordinates}
                    setSelectedArea={setSelectedArea}
                    setSelectedAreas={setSelectedAreas}
                    // Search function
                    handleSearch={handleSearch}
                >
                    <div
                        className="button-list-container"
                        id="map-sidebar-buttons-container"
                    >
                        <h2 className="button-list-label">Results:</h2>
                        {getSelectedAreaButtons(selectedAreas)}
                    </div>
                </MapForm>
                <div className="flex-panel">
                    {util.val.isValidArray(coordinates, true) && (
                        // <div>{JSON.stringify(coordinates, null, 2)}</div>
                        <div className="flex-panel-element">
                            <h4>Coordinates selected:</h4>
                            {util.dom.objArray2List(
                                // util.geo.geoObj2geoArray(coordinates),
                                // util.geo.geoObjArray2geoArrayArray(
                                //     coordinates,
                                // ),
                                coordinates
                            )}
                        </div>
                    )}
                    {util.val.isValidArray(selectedAreas, true) && (
                        <div className="flex-panel-element">
                            <Droplist
                                data={selectedAreas}
                                label={`Areas Selected`}
                            ></Droplist>
                            <div>
                                <h4>Areas selected:</h4>
                            </div>
                            <div>
                                {
                                    // JSON.stringify(selectedAreas, null, 2)
                                    // JSON.stringify(
                                    //     // util.dom.obj2ListText(
                                    //         util.geo.geoObj2geoArray( selectedAreas[ 0 ] )
                                    //     // ),
                                    //     null,
                                    //     2,
                                    // )
                                    util.dom.objArray2List(selectedAreas)
                                    // util.geo.geoObj2geoArray(
                                    // util.geo.geoObjArray2geoArrayArray(
                                    //     //     selectedAreas[0],
                                    //     selectedAreas,
                                    // ),
                                    // selectedAreas.map((area)=>geoObj2geoArray(area))
                                    // )
                                }
                            </div>
                        </div>
                    )}
                </div>
            </Sidebar>
            <div className="page-content">
                <Header
                    showSidebar={showSidebar}
                    toggleSidebar={() => setShowSidebar(!showSidebar)}
                    showTitle={true}
                />
                <Content
                    isFetching={isFetching}
                    isLoading={isLoading}
                    progressInfo={progressInfo}
                    showContent={showContent}
                >
                    {query && mapDatatype && (
                        <Tabs
                            type="top"
                            fillArea={true}
                            centered={true}
                            padContent={false}
                            roundedNav={true}
                        >
                            <div
                                className=""
                                label="Map Search View"
                                id="map-dashboard-map-search-view"
                            >
                                {mapDatatype === 'point' && (
                                    <MapPolyContainer
                                        isFetching={isFetching}
                                        theme={theme}
                                        areas={selectedAreas}
                                        setAreas={setSelectedAreas}
                                        coordinates={coordinates}
                                        setCoordinates={setCoordinates}
                                        geometry={geometry}
                                        setGeometry={setGeometry}
                                        mapDatatype={mapDatatype} // ={'polygon'}
                                    ></MapPolyContainer>
                                )}
                                {mapDatatype === 'polygon' && (
                                    <MapPolyContainer
                                        isFetching={isFetching}
                                        theme={theme}
                                        areas={selectedAreas}
                                        setAreas={setSelectedAreas}
                                        coordinates={coordinates}
                                        setCoordinates={setCoordinates}
                                        geometry={geometry}
                                        setGeometry={setGeometry}
                                        mapDatatype={mapDatatype} // ={'polygon'}
                                    ></MapPolyContainer>
                                )}
                            </div>

                            {util.val.isValidArray(selectedAreas, true) && (
                                <div
                                    className=""
                                    label="Selected Areas View"
                                    id="map-dashboard-selected-areas-droplist-view"
                                >
                                    <div className="flex-panel">
                                        <Droplist
                                            data={selectedAreas}
                                            label={`Areas Selected`}
                                        ></Droplist>
                                    </div>
                                </div>
                            )}
                            {!isFetching &&
                                util.val.isValidArray(searchResults, true) && (
                                    <div
                                        className=""
                                        label="Datatable Results View"
                                        id="query-dashboard-datatable-view"
                                    >
                                        {!isFetching &&
                                            showTable &&
                                            !util.val.isValidArray(
                                                searchResults,
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
                                            util.val.isValidArray(searchResults, true) &&
                                            showTable && (
                                                <Table
                                                    // isVisible={showTable}
                                                    isFetching={isFetching}
                                                    isFilterable={true}
                                                    isSortable={true}
                                                    dataName={queryString}
                                                    tableData={searchResults}
                                                    cellOnClick={event => {}}
                                                    rowOnClick={(
                                                        rowIndex,
                                                        rowData
                                                    ) => {
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
                                )}

                            {showResultsMap &&
                                !isFetching &&
                                util.val.isValidArray(searchResults, true) && (
                                    <div
                                        className=""
                                        label="Map Results View"
                                        id="query-dashboard-map-view"
                                    >
                                        <MapContainer
                                            isFetching={isFetching}
                                            data={searchResults}
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
                                        ></Table>
                                    </div>
                                )}
                        </Tabs>
                    )}
                </Content>
            </div>
        </>
    );
}

export default MapDashboard;

/*
    const getSelectedDates = (input) => {
        if (input === "all_dates" || input.toString().includes("all_dates")) {
            // Get only the date keys in the YYYY-MM format, not their labels.
            return dates
                .filter((dateObject) => {
                    return (
                        dateObject.key !== undefined &&
                        dateObject.key !== "all_dates"
                    );
                })
                .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
        } else {
            // Get only the date keys in the YYYY-MM format, not their labels.
            if (Array.isArray(input)) {
                return input.filter((dateID) => {
                    return dateID !== undefined && dateID !== "all_dates";
                });
                // .map((dateObject) => dateObject.key);
            } else {
                return [input.toString()];
            }
        }
    };
*/