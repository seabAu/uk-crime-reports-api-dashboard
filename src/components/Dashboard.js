import React, { useState, useEffect, useRef } from "react";
import axios, { isCancel, AxiosError } from "axios";

import {
    SanitizeObj,
    SanitizeObjArray,
    SpliceObjArray,
    flatMapObjText,
    valIsValid,
    validate,
    arrayIsValid,
    has,
    objDeepSearch,
    deepSearchObject,
    deepSearch,
} from "./Utilities/ObjectUtils.js";
import { setElementValueById } from "./Utilities/DOMUtilities.js";

import * as api from "../api";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import DashboardContent from "./DashboardContent";
import Header from "./Header";
import SidePanel from "./SidePanel/SidePanel.js";
import { getMetroNeighborhoodsData, getMetroResultsData } from "../api/sampledata.js";
import { AddLocalDBEntry, getByteLength, GetDB, getLocalDBSize, InitializeLocalDB, IsDBSet, localStorageSpace, setDBKey } from "./LocalDB/LocalDatabaseHandler.js";
import Content from "./Content.js";
import QueryDashboard from "./QueryDashboard.js";
import MapDashboard from "./MapDashboard.js";
import DatabaseDashboard from "./DatabaseDashboard.js";
import OptionsDashboard from "./OptionsDashboard.js";

const Dashboard = () =>
{
    const [theme, setTheme] = useState(
        localStorage.getItem("uk-crime-dashboard-theme") ?? "default",
    );
    // const [menu, setMenu] = useState("query"); // Menu options: ["query", "map", "database", "options"]
    const [menu, setMenu] = useState("map");
    const [showSidebar, setShowSidebar] = useState(true);
    const [ debug, setDebug ] = useState( true );
    
    const [progressInfo, setProgressInfo] = useState([
        {
            id: "Not Set",
            message: "Not Set",
            currValue: 0,
            endValue: 1,
            results: 0,
            success: 0,
            failure: 0,
            currentCall: ``,
        },
    ]);
    // axios.defaults.headers.get["Content-Type"] = "application/json;charset=utf-8";
    // axios.defaults.headers.get[ "Access-Control-Allow-Origin" ] = "*";
    const loadContent = (currentmenu) => {
        switch (currentmenu) {
            case "query":
                return (
                    <QueryDashboard
                        menu={menu}
                        setMenu={setMenu}
                        theme={theme}
                        setTheme={setTheme}
                        debug={debug}
                        setDebug={setDebug}
                        progressInfo={progressInfo}
                        setProgressInfo={ setProgressInfo }
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                );
            case "map":
                return (
                    <MapDashboard
                        menu={menu}
                        setMenu={setMenu}
                        theme={theme}
                        setTheme={setTheme}
                        debug={debug}
                        setDebug={setDebug}
                        progressInfo={progressInfo}
                        setProgressInfo={setProgressInfo}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                );
            case "database":
                return (
                    <DatabaseDashboard
                        menu={menu}
                        setMenu={setMenu}
                        theme={theme}
                        setTheme={setTheme}
                        debug={debug}
                        setDebug={setDebug}
                        progressInfo={progressInfo}
                        setProgressInfo={setProgressInfo}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                );
            case "options":
                return (
                    <OptionsDashboard
                        menu={menu}
                        setMenu={setMenu}
                        theme={theme}
                        setTheme={setTheme}
                        debug={debug}
                        setDebug={setDebug}
                        progressInfo={progressInfo}
                        setProgressInfo={setProgressInfo}
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />
                );
            default:
                break;
        }
    };
    return (
        <div className={`page-container theme-${theme}`}>
            {loadContent(menu)}
        </div>
    );
};

export default Dashboard;

/*
    import React, { useState, useEffect, useRef } from "react";
    import axios, { isCancel, AxiosError } from "axios";

    import {
        SanitizeObj,
        SanitizeObjArray,
        SpliceObjArray,
        flatMapObjText,
        valIsValid,
        validate,
        arrayIsValid,
        has,
        objDeepSearch,
        deepSearchObject,
        deepSearch,
    } from "./Utilities/ObjectUtils.js";
    import { setElementValueById } from "./Utilities/DOMUtilities.js";

    import * as api from "../api";
    import Sidebar from "./Sidebar";
    import Loader from "./Loader";
    import DashboardContent from "./DashboardContent";
    import Header from "./Header";
    import SidePanel from "./SidePanel/SidePanel.js";
    import { getMetroNeighborhoodsData, getMetroResultsData } from "../api/sampledata.js";
    import { AddLocalDBEntry, getByteLength, GetDB, getLocalDBSize, InitializeLocalDB, IsDBSet, localStorageSpace, setDBKey } from "./LocalDB/LocalDatabaseHandler.js";
    import Content from "./Content.js";

    const Dashboard = () =>
    {
        const MAX_CONSECUTIVE_CALLS = 10;
        const [query, setQuery] = useState("");
        const [isLoading, setIsLoading] = useState(true);
        const [isFetching, setIsFetching] = useState(false);
        const [abort, setAbort] = useState(false);

        // State arrays for query options.
        const [dates, setDates] = useState([]);
        const [categories, setCategories] = useState([]);
        const [forces, setForces] = useState([]);
        const [forceNeighborhoods, setForceNeighborhoods] = useState([]);

        // State for chosen inputs.
        const [queryString, setQueryString] = useState(""); // String for the table downloader to use for its filename. It has to be set all the way up here!
        const [date, setDate] = useState([]); // = useState([`2022-9`]);
        const [category, setCategory] = useState("");
        const [force, setForce] = useState("");
        const [forceNeighborhood, setForceNeighborhood] = useState([]);

        // State for checking if query input is valid.
        const [error, setError] = useState(null);
        const [crimeReports, setCrimeReports] = useState([]);

        // Show/hide state for various components.
        const [showContent, setShowContent] = useState(false);
        const [showTable, setShowTable] = useState(false);
        const [showMap, setShowMap] = useState(false);
        const [showSidebar, setShowSidebar] = useState(true);
        const [showSidePanel, setShowSidePanel] = useState(false);
        const [sidePanelID, setSidePanelID] = useState("");
        const [sidePanelData, setSidePanelData] = useState([]);
        const bottomRef = useRef();

        const [progressInfo, setProgressInfo] = useState([
            {
                id: "Not Set",
                message: "Not Set",
                currValue: 0,
                endValue: 1,
                success: 0,
                failure: 0,
            },
        ]);
        const [theme, setTheme] = useState(
            localStorage.getItem("uk-crime-dashboard-theme") ?? "default",
        );
        const [menu, setMenu] = useState("query"); // Menu options: ["query", "map", "database", "options"]
        // axios.defaults.headers.get["Content-Type"] = "application/json;charset=utf-8";
        // axios.defaults.headers.get[ "Access-Control-Allow-Origin" ] = "*";
        const [debug, setDebug] = useState(true);
        const [errorLog, setErrorLog] = useState([]);
        const generateDateOptions = () => {
            const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            const startYear = 2017;
            const startMonth = 8;
            const start = new Date(startYear, startMonth);
            const now = new Date();
            // const now = new Date("2020, 8");

            var numMonths =
                now.getMonth() -
                start.getMonth() +
                (now.getYear() - start.getYear()) * 12;
            // var numMonths = differenceInMonths( now, start );
            // var numYears = Math.floor(numMonths / 12);
            const dates = [];
            for (let y = 0; numMonths >= 0; y++) {
                let year = startYear + y;
                // For each year between now and the start date, ascending.
                for (
                    let m = year === startYear ? startMonth : 1;
                    m <= 12 && numMonths >= 0;
                    m++
                ) {
                    // For each month in the year.
                    let month = months[m - 1];
                    dates.unshift({
                        key: `${year}-${m}`,
                        value: `${month} ${year}`,
                    });
                    numMonths--;
                }
            }

            // dates.unshift({
            //     key: "all_dates",
            //     value: "All Dates",
            // });
            // dates.splice(0, 3);
            return dates;
        };

        // Fetch category and force options on load.
        useEffect( () =>
        {
            console.log( "Onload" );
            Promise.all([api.getCategories(), api.getForces()])
                .then(([categories, forces]) => {
                    console.log( "categories, forces = ", [categories, forces] );
                    setCategories(categories);
                    setForces(forces);
                    setDates(generateDateOptions());
                    setIsLoading(false);
                })
                .catch((error) => setError(error))
                .then(() => setIsLoading(false)) //;
                .then(() => {
                    // Boot up the local DB!
                    if (!IsDBSet()) {
                        InitializeLocalDB();
                        setDBKey(`forces`, forces);
                        setDBKey(`categories`, categories);
                        setDBKey(`dates`, dates);
                    } else {
                        console.table(
                            "Local DB = ",
                            GetDB(),
                            ", currently using: ",
                            // getLocalDBSize(),
                            getByteLength(JSON.stringify(GetDB())),
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
            console.log(`Dashboard :: ABORT = ${abort ? "TRUE" : "FALSE"}`);
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

            if (arrayIsValid(neighborhoods)) {
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

        const getSelectedNeighborhoods = (input) => {
            if (
                input === "all_neighborhoods" ||
                input.toString().includes("all_neighborhoods")
            ) {
                // Select all neighborhoods regardless of which ones are selected alongside the "all_neighborhoods" option.
                return forceNeighborhoods
                    .filter((neighborhood) => {
                        // return neighborhood.key !== "all_neighborhoods";
                        return (
                            neighborhood.id !== undefined &&
                            neighborhood.id !== "all_neighborhoods"
                        );
                    })
                    .map((neighborhood) => neighborhood.id); // dates.splice( 1, dates.length );
            } else {
                // More than 1 neighborhood is selected, but not all of them. Run through and make sure none of them are invalid.
                if (Array.isArray(input)) {
                    return input.filter((neighborhood) => {
                        return (
                            neighborhood !== undefined &&
                            neighborhood !== "all_neighborhoods"
                        );
                    });
                    // .map((neighborhood) => neighborhood.key);
                } else {
                    return [input.toString()];
                }
            }
        };

        const getSelectedDates = (input) => {
            if (input === "all_dates" || input.toString().includes("all_dates")) {
                // Get only the date keys in the YYYY-MM format, not their labels.
                return dates
                    .filter((dateObject) => {
                        return dateObject.key !== undefined && dateObject.key !== "all_dates";
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
                apiQueryValues.date = getSelectedDates(date);
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
                apiQueryValues.neighborhood =
                    getSelectedNeighborhoods(forceNeighborhood);
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
                let neighborhoodsArray =
                    getSelectedNeighborhoods(forceNeighborhood);

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
            batchSize = MAX_CONSECUTIVE_CALLS;
            if (callArray.length < MAX_CONSECUTIVE_CALLS) {
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
                            if (arrayIsValid(res)) {
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
                                        //     ", has(val): ",
                                        //     has(result.value),
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
                                                if (has(val, "status")) {
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
                                    let compiled = SpliceObjArray(
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
        if (error) return `An error has occurred: ${error.message}`;

        const loadContent = (currentmenu) => {
            switch (currentmenu) {
                case "query":
                    return (
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
                            menu={menu}></DashboardContent>
                    );
                case "map":
                    return <div className="dashboard-content">map</div>;
                case "database":
                    return <div className="dashboard-content">database</div>;
                case "options":
                    // return <div className="dashboard-content">options</div>;
                    return (
                        <Content
                            menu={ menu }
                            setMenu={ setMenu }
                            isFetching={isFetching}
                            isLoading={isLoading}
                            progressInfo={progressInfo}
                            showContent={showContent}
                        >
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
                                menu={menu}></DashboardContent>
                        </Content>
                    );
                default:
                    break;
            }
        };
        return (
            <div className={`page-container theme-${theme}`}>
                {
                    <Sidebar
                        query={query}
                        setQuery={setQuery}
                        isFetching={isFetching}
                        showSidebar={showSidebar}
                        theme={theme}
                        setTheme={setTheme}
                        menu={menu}
                        setMenu={setMenu}
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
                }
                <div className="page-content">
                    <Header
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                        toggleSidebar={() => setShowSidebar(!showSidebar)}
                        showTitle={!showTable}
                        menu={menu}
                    />
                    {showContent && loadContent(menu)}
                    {showSidePanel && (
                        <SidePanel
                            className={`${showSidePanel ? "" : "hidden"}`}
                            isFetching={isFetching}
                            show={showSidePanel}
                            setShow={setShowSidePanel}
                            panelData={sidePanelData}
                            panelDataID={sidePanelID}></SidePanel>
                    )}
                </div>
            </div>
        );
    };

    export default Dashboard;

*/