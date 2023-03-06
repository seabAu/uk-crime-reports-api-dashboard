import React, { useState, useEffect, useRef } from "react";
import axios, { isCancel, AxiosError } from "axios";

import {
    SanitizeObj,
    SanitizeObjArray,
    SpliceObjArray,
    flatMapObjText,
    valIsValid,
    validate,
} from "./Utilities/ObjectUtils.js";

import {
    getCrimesStreetsDates,
    getLastUpdated,
    getCategories,
    getForces,
    getForceInfo,
    getForceOfficers,
    getNeighbourhoodTeam,
    getCrimeReports,
    getCrimeReportsNoLocation,
    getCrimeReportsAtLocation,
    getCrimeReportsByLocation,
    getCrimeReportsAtLocationMulti,
    getStopReports,
    getStopReportsAtLocation,
    getStopReportNoLocation,
    getStopReportsByForce,
    getNeighbourhoodList,
    getNeighbourhoodInformation,
    getNeighbourhoodCoordinates,
    getNeighbourhoodFromCoordinates,
    getNeighbourhoodEvents,
    getNeighbourhoodBoundary,
    getStreetLevelCrimesByCoordinates,
    getStreetLevelCrimesByPolygon,
    getCrimeOutcomes,
    constructFetchError,
    handleFetch,
    apiCrimeReportsByLocation,
} from "../api";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import DashboardContent from "./DashboardContent";
import Header from "./Header";
import SidePanel from "./SidePanel/SidePanel.js";
import { setElementValueById } from "./Utilities/DOMUtilities.js";
import { objDeepSearch } from "./Utilities/ObjectUtils.js";
import { deepSearchObject } from "./Utilities/ObjectUtils.js";
import { deepSearch } from "./Utilities/ObjectUtils.js";
import { getMetroNeighborhoodsData } from "../api/sampledata.js";

const DashboardBackup = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [abort, setAbort] = useState(false);

    // State arrays for query options.
    const [categories, setCategories] = useState([]);
    const [forces, setForces] = useState([]);
    const [forceNeighborhoods, setForceNeighborhoods] = useState([]);
    const [dates, setDates] = useState([]);

    // State for chosen inputs.
    const [category, setCategory] = useState("");
    const [force, setForce] = useState("");
    const [forceNeighborhood, setForceNeighborhood] = useState([]);
    const [forceNeighborhoodData, setForceNeighborhoodData] = useState({});
    const [date, setDate] = useState([]); // = useState([`2022-9`]);
    const [neighborhoodId, setNeighborhoodId] = useState("Not Set");
    const [neighborhoodCoordinates, setNeighborhoodCoordinates] = useState({
        id: "",
        latitude: 0.0,
        longitude: 0.0,
    });
    const [queryString, setQueryString] = useState(""); // String for the table downloader to use for its filename. It has to be set all the way up here!

    // State for checking if query input is valid.
    const [categoryIsInvalid, setCategoryIsInvalid] = useState(false);
    const [forceIsInvalid, setForceIsInvalid] = useState(false);
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
    useEffect(() => {
        Promise.all([getCategories(), getForces()])
            .then(([categories, forces]) => {
                setCategories(categories);
                setForces(forces);
                setDates(generateDateOptions());
                setIsLoading(false);
            })
            .catch((error) => setError(error))
            .then(() => setIsLoading(false));
    }, []);

    // Handle updates when the selected Force is changed.
    useEffect(() => {
        // setForce(force);
        ////// setIsLoading(true);
        if (force) {
            Promise.all([getNeighbourhoodList(force)])
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
            "\ncategory = ",
            category,
            "\nforce = ",
            force,
            "\nforceNeighborhoods = ",
            forceNeighborhoods,
            "\nforceNeighborhood = ",
            forceNeighborhood,
            "\nforceNeighborhoodData = ",
            forceNeighborhoodData,
            "\ndate = ",
            date,
            "\nneighborhoodId = ",
            neighborhoodId,
            "\nneighborhoodCoordinates = ",
            neighborhoodCoordinates,
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
        force,
        date,
        category,
        forceNeighborhoods,
        forceNeighborhood,
        forceNeighborhoodData,
        neighborhoodCoordinates,
        neighborhoodId,
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
            Promise.all([getCrimeOutcomes(sidePanelID)])
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
        if (abort === true) {
            // Abort whatever query we're performing right now.
            console.log("Dashboard :: ABORT = TRUE");
            // Reset the value.
            setAbort(false);
        }
    }, [abort]);

    // Handles searching for multiple (or all) dates. Will later expand to allow multiple neighborhoods as well for multi-location search.
    const handleSearchCrimesNoLocation = async (event) => {
        event.preventDefault();
        console.log(
            "handleSearchCrimesNoLocation triggered:: ",
            force,
            category,
            date,
        );
        if (!category) return setCategoryIsInvalid(true);
        if (!force) return setForceIsInvalid(true);

        setCategoryIsInvalid(false);
        setForceIsInvalid(false);
        setIsFetching(true);
        setShowMap(false);
        setShowTable(false);
        setShowContent(true);

        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        // Construct the array of available dates.
        let datesArray = [];
        if (date === "all_dates" || date.toString().includes("all_dates")) {
            // all_dates is selected, so add every date in the global dates array to our calling array.
            // Create the query string so the downloadable file has the right filename.
            setQueryString(
                `SearchNoLocation_${[force, category, "all-dates"].join("_")}`,
            );
            datesArray = dates
                .filter((dateObject) => {
                    return dateObject.key !== "all_dates";
                })
                .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
        } else {
            // Create the query string so the downloadable file has the right filename.
            setQueryString(
                `SearchNoLocation_${[force, category, date.join("+")].join(
                    "_",
                )}`,
            );
            // More than one date is selected, so make sure they're valid and add to the array we'll call with.
            if (Array.isArray(date)) {
                datesArray = date.filter((dateID) => {
                    return dateID !== undefined && dateID !== "all_dates";
                });
                // .map((dateObject) => dateObject.key);
            } else {
                // Only one date is selected, so make an array out of it.
                datesArray = [date.toString()];
            }
        }
        console.log(
            "handleSearchCrimesNoLocation proceeding with data :: ",
            "\nforce = ",
            force,
            "\ncategory = ",
            category,
            "\ndatesArray = ",
            datesArray,
        );

        let reports = [];
        let errLog = [];
        let numCalls = datesArray.length;
        let currCall = 0;
        let callstr;
        let successes = 0;
        let failures = 0;
        let startTime = new Date();
        for (const month of datesArray) {
            callstr = `getCrimeReportsNoLocation(${category}, ${force}, ${month})`;
            // let resawait = getCrimeReportsNoLocation(category, force, month);
            let res = await getCrimeReportsNoLocation(category, force, month, {
                timeout: 8000,
                abortSignal: abort,
            });
            let currTime = new Date();
            // resawait.catch( function ()
            // {
            //     // Only executed if the promise is rejected.
            //     console.log("rejected the promise, something wrong happened");
            // })
            // resawait.resolve( ()=> {
            //     console.log(`Resolved the promise :: result = `, resawait, res);
            // });
            // console.log(
            //     `handleSearchCrimesNoLocation :: ${callstr} :: resawait = `,
            //     resawait,
            // );
            // let res = await resawait;
            setProgressInfo([
                {
                    id: "handleSearchNoLocationProgress",
                    message: `Fetching crime reports for month ${currCall} of ${numCalls}`,
                    currValue: currCall,
                    endValue: numCalls,
                    results: reports.length,
                    startTime: startTime,
                    currTime: currTime,
                    success: successes,
                    failure: failures,
                },
            ]);
            currCall++;
            // reports.concat( res );
            console.log(
                `handleSearchCrimesNoLocation :: ${callstr} returned RES = `,
                res,
                // " \nresawait = ",
                // resawait,
            );
            if (res) {
                if (Array.isArray(res)) {
                    successes++;
                    if (res.length > 0) {
                        console.log(
                            `handleSearchCrimesNoLocation :: ${callstr} successfully returned an array of reports = `,
                            res,
                        );
                        let compiled = SpliceObjArray(res, {
                            force_id: force,
                            category: category,
                        });
                        reports = [...reports, ...compiled];
                    }
                } else {
                    // if ( typeof res === "object" ) {
                    // Returned an error descriptor object. Push it into the error log.
                    errLog.push(res);
                    // }
                    failures++;
                }
            } else {
                // The returned error is undefined, so define it here.
                errLog.push({
                    source: `handleSearchCrimesNoLocation::getCrimeReportsNoLocation`,
                    call: callstr,
                    time: new Date(),
                    errorMessage: "",
                    response: res,
                    status: null,
                    ok: null,
                });
                failures++;
            }
            console.log(
                "res = ",
                res,
                "res as string = ",
                JSON.stringify(res),
                "reports = ",
                reports,
                ", time = ",
                new Date(),
            );
        }
        if (reports) {
            setCrimeReports(reports);
            console.log("Setting reports: ", reports);
        }
        if (errLog) {
            setErrorLog(errLog);
        }
        console.log("reports = ", reports);

        setShowTable(true);
        setProgressInfo([{ message: "", currValue: 0 }]);
        setIsFetching(false);
        // }
    };

    const getNeighbourhoodDataMulti = async (force, neighborhoods) => {
        console.log(`getNeighbourhoodDataMulti :: `, force, neighborhoods);
        if (neighborhoods) {
            if (Array.isArray(neighborhoods)) {
                if (neighborhoods.length > 0) {
                    let locations = [];
                    let numCalls = neighborhoods.length;
                    let currCall = 0;
                    let success = 0;
                    let failure = 0;
                    let startTime = new Date();
                    for (const neighborhood of neighborhoods) {
                        // Update the fetch loader message
                        setProgressInfo([
                            {
                                message: `Fetching coordinates for location ${currCall} of ${numCalls}`,
                                currValue: currCall,
                                endValue: numCalls,
                                startTime: startTime,
                                currTime: new Date(),
                                results: locations.length,
                                success: success,
                                failure: failure,
                            },
                        ]);
                        currCall++;
                        if (neighborhood) {
                            let id;
                            if (typeof neighborhood === "object") {
                                if ("id" in neighborhood) {
                                    id = neighborhood.id;
                                }
                            } else {
                                id = neighborhood;
                            }
                            // if ("id" in neighborhood) {
                            let res = await getNeighbourhoodInformation(
                                force,
                                // neighborhood.id,
                                id, // neighborhood,
                            );

                            // reports.concat( res );
                            // Make sure it returned valid data we can use.
                            if (res) {
                                if (typeof res === "object") {
                                    if ("centre" in res) {
                                        // Combine the data.
                                        res = Object.assign(
                                            res,
                                            { force_id: force },
                                            { neighborhood_id: neighborhood },
                                        );
                                        locations.push(res); // .centre);
                                        success++;
                                        // console.log("RES was valid :: ", res);
                                    }
                                } else {
                                    failure++;
                                    console.error("RES was invalid :: ", res);
                                }
                                // locations = [...locations, ...res];
                            }
                            // console.log(
                            //     `getNeighbourhoodDataMulti() :: `,
                            //     "res = ",
                            //     res,
                            //     "locations = ",
                            //     locations,
                            //     ", time = ",
                            //     new Date(),
                            // );
                        }
                        // }
                    }
                    console.log(
                        "getNeighbourhoodDataMulti() :: post-execution :: locations = ",
                        locations,
                    );

                    // return locations.map( ( loc, index ) =>
                    // {
                    //     if ( loc )
                    //     {
                    //         return loc.centre;
                    //     }
                    //     else { return ''; }
                    // } );
                    return locations;
                }
            } else {
                console.error(
                    "ERR::getNeighborhoodDataMulti::Given non-array data. :: ",
                    force,
                    neighborhoods,
                );
                return [];
            }
        } else {
            console.error(
                "ERR::getNeighborhoodDataMulti::Given undefined values :: ",
                force,
                neighborhoods,
            );
            return [];
        }
    };

    const getSelectedNeighborhoods = () => {
        if (
            forceNeighborhood === "all_neighborhoods" ||
            forceNeighborhood.toString().includes("all_neighborhoods")
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
            if (Array.isArray(forceNeighborhood)) {
                return forceNeighborhood.filter((neighborhood) => {
                    return (
                        neighborhood !== undefined &&
                        neighborhood !== "all_neighborhoods"
                    );
                });
                // .map((neighborhood) => neighborhood.key);
            } else {
                return [forceNeighborhood.toString()];
            }
        }
    };

    const getSelectedDates = () => {
        if (date === "all_dates" || date.toString().includes("all_dates")) {
            // Get only the date keys in the YYYY-MM format, not their labels.
            return dates
                .filter((dateObject) => {
                    return dateObject.key !== "all_dates";
                })
                .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
        } else {
            // Get only the date keys in the YYYY-MM format, not their labels.
            if (Array.isArray(date)) {
                return date.filter((dateID) => {
                    return dateID !== undefined && dateID !== "all_dates";
                });
                // .map((dateObject) => dateObject.key);
            } else {
                return [date.toString()];
            }
        }
    };

    // Handles searching for multiple (or all) neighborhoods.
    // Due to the nature of the relational database's schema (see: <insert photo of a dumpster fire here>),
    // we first have to call the API for the location coordinates for each and every neighborhood listed for the
    // selected force.
    const handleSearchCrimesByLocationFast = async (event) => {
        event.preventDefault();
        console.log("handleSearchCrimesByLocationFast triggered.");
        setShowMap(false);
        setShowTable(false);
        setIsFetching(true);
        setShowContent(true);

        if (!force) return setForceIsInvalid(true);

        setCategoryIsInvalid(false);
        setForceIsInvalid(false);

        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        setQueryString(`SearchByLocation_${force}`);

        // Construct the array of neighborhood ids/coordinate pairs.
        let neighborhoodsArray = getSelectedNeighborhoods();

        let neighborhoodDataArray;
        if (force === "metropolitan") {
            neighborhoodDataArray = getMetroNeighborhoodsData();
        } else {
            neighborhoodDataArray = await getNeighbourhoodDataMulti(
                force,
                neighborhoodsArray,
            );
        }

        // Construct the array of available dates.
        let datesArray = getSelectedDates();
        // If there's no dates set, then use the alternate API call to skip using dates altogether.
        let noDatesMode = !(datesArray.length > 0);

        // Vars for updating the loader progress bar UI.
        let src = "handleSearchCrimesByLocationFast";
        let numNeighborhoods = neighborhoodDataArray.length;
        let currNeighborhood = 0;
        let numMonths = datesArray.length;
        let callArray = [];
        // New method: for each set of input vars, we create a URL.
        // Once an array of URLs has been built, parse them in groups of up to 15.
        // This allows for a greater degree of generalization in this code.
        for (const neighborhoodData of neighborhoodDataArray) {
            // Call for each neighborhood.
            // console.log( "neighborhoodData = ", neighborhoodData );
            if (neighborhoodData) {
                let lat = deepSearch(
                    neighborhoodData,
                    "latitude",
                    (k, v) => k === "latitude",
                    false,
                );
                let lng = deepSearch(
                    neighborhoodData,
                    "longitude",
                    (k, v) => k === "longitude",
                    false,
                );

                if (lat && lng) {
                    // Latitude and longitude are valid.
                    if (noDatesMode) {
                        // Call for each neighborhood.
                        let newCall = apiCrimeReportsByLocation(null, lat, lng);
                        callArray.push({
                            ...newCall,
                            ...{
                                force_id: force,
                                neighborhood_name: neighborhoodData.name,
                                neighborhood_id: neighborhoodData.id,
                            },
                        });
                        // console.log("newcall = ", newCall, ", callArray is now = ", callArray);
                    } else {
                        // Call for each neighborhood, for each date.
                        for (const month of datesArray) {
                            // callArray.push(
                            //     apiCrimeReportsByLocation(month, lat, lng),
                            // );
                            // callArray.push(
                            // {
                            //     ...apiCrimeReportsByLocation( month, lat, lng ),
                            //     force_id: force,
                            //     neighborhood_name: neighborhoodData.name,
                            //     neighborhood_id: neighborhoodData.id,
                            // },
                            let newCall = apiCrimeReportsByLocation(
                                month,
                                lat,
                                lng,
                            );
                            callArray.push({
                                ...newCall,
                                ...{
                                    force_id: force,
                                    neighborhood_name: neighborhoodData.name,
                                    neighborhood_id: neighborhoodData.id,
                                },
                            });
                            // console.log("newcall = ", newCall, ", callArray is now = ", callArray);
                        } // End of inner month loop
                    }
                }
            } else {
                console.error(
                    "neighborhoodData = ",
                    neighborhoodData,
                    " was undefined.",
                );
            }
        }

        /*
        if (callArray) {
            if (callArray.length > 0) {
                // Start callin'!

                let callNum = 0;
                let successes = 0;
                let failures = 0;
                let currCall = "";
                let startTime = new Date();
                let callVars;
                let callURL;
                
                // Use these 2 to handle breaking after 502 errors, so we don't venture past the limit of the data available for a given neighborhood.
                let lastCallVars = [];
                let lastCallURL;
                let invalidDate;
                let invalidLat;
                let invalidLng;
                let skip = false;
                // for (const call of callArray) {
                let i = 0;
                for ( i = 0; i < callArray.length; i++ )
                {
                    let call = callArray[ i ];
                    let currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    let currMonth = callVars.date;
                    // let currLat = callVars.lat;
                    // let currLng = callVars.lng;

                    setProgressInfo([
                        {
                            id: "crimesByLocationProgress",
                            message: `Fetching reports for call ${callNum} of ${callArray.length}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: reports.length,
                            success: successes,
                            failure: errLog.length,
                        },
                    ]);
                    if ( invalidDate )
                    {
                        if ( invalidDate <= currMonth )
                        {
                            console.log( `currMonth = ${ currMonth }, invalidDate = ${ invalidDate }, currMonth is ${ invalidDate > currMonth ? 'less than' : 'greater than' } the month limit :: skipping!` );
                            skip = true;
                        }
                        else
                        {
                            skip = false;
                        }
                    }

                    // Reset the invalidDate if we've moved on to new coordinates.
                    if ( invalidLat && invalidLng )
                    {
                        console.log( `Invalid coords test: ${ invalidLat }, ${ invalidLng }` );
                        if ( invalidLat !== callVars.lat && invalidLng !== callVars.lng )
                        {
                            console.log(
                                `currlat = ${callVars.lat}, currlng = ${callVars.lng} :: invalid =  ${invalidLat}, ${invalidLng}`,
                            );

                            // We've moved to the next set of calls (different neighborhood), so reset the invalid markers.
                            invalidLat = null;
                            invalidLng = null;
                            invalidDate = null;
                            skip = false;
                        }
                    }

                    if ( !skip )
                    {

                        currCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;
                        let res;
                        try {
                            res = await handleFetch(callURL, src, callVars, {
                                abortSignal: abort,
                                timeout: 8000,
                            });
                        } catch (error) {
                            errLog.push(
                                constructFetchError(
                                    `${src}::${callURL}`,
                                    callURL,
                                    callVars,
                                    res,
                                ),
                            );
                        }
                        console.log(
                            `${src} :: Called ${currCall} with RES = `,
                            res,
                        );
                        callNum++;
                        if (res) {
                            if (Array.isArray(res)) {
                                // Success, append it to our reports list.
                                if (res.length > 0) {
                                    let compiled = SpliceObjArray(res, {
                                        force_id: force,
                                        // neighborhood: neighborhoodData.name,
                                    });
                                    successes++;
                                    reports = [...reports, ...compiled];
                                    console.log(
                                        "\n\nneighborhoodDataArray = ",
                                        neighborhoodDataArray,
                                        "\n\nres = ",
                                        res,
                                        "\n\ncompiled = ",
                                        compiled,
                                        "\n\nreports = ",
                                        reports,
                                        "\n\nerrLog = ",
                                        errLog,
                                    );
                                } else {
                                    // Response is an array, but has no data in it.
                                }
                            } else {
                                // Returned an error descriptor object. Push it into the error log.
                                errLog.push(res);
                                if (typeof res === "object") {
                                    if ("status" in res) {
                                        if (res.status === 502) {
                                            // We encountered a 502 error, so we need to avoid calling for earlier dates than the one we just called.
                                            invalidDate = callVars.date;
                                            invalidLat = callVars.lat;
                                            invalidLng = callVars.lng;
                                            console.log(
                                                "Res.status = ",
                                                res.status,
                                                " on month = ",
                                                invalidDate,
                                                " at coordinates ",
                                                [invalidLat, invalidLng],
                                            );
                                            
                                            // New strategy: filter out all entries in the callArray with matching coordinates and months less than or equal to the one that returned an invalid response.
                                            // let callArrayTemp =
                                            //     callArray.filter(
                                            //         (call, index) => {
                                            //             return (
                                            //                 call.vars.date >
                                            //                     invalidDate &&
                                            //                 call.vars.lat !==
                                            //                     invalidLat &&
                                            //                 call.vars.lng !==
                                            //                     invalidLng
                                            //             );
                                            //         },
                                            //     );
                                            // callArray = callArrayTemp
                                            // break;
                                        }
                                    }
                                }
                            }
                        } else {
                            // The returned response is undefined, so define a new error here.
                            errLog.push(
                                constructFetchError(
                                    `${src}::${callURL}`,
                                    callURL,
                                    callVars,
                                    res,
                                ),
                            );
                        }

                        lastCallURL = callURL;
                        lastCallVars = callVars;
                    }
                }
            }
        }
        */

        let errors = [];
        let results = [];
        console.log("CallArray constructed :: ", callArray);
        if (callArray) {
            results = await handleFetchArray(callArray, src, results, []);
            let reports = results.results;
            errors = results.errors;

            if (reports) {
                setCrimeReports(reports);
                console.log("Setting reports: ", reports);
            }
            if (errors) {
                setErrorLog(errors);
            }
        } else {
            return;
        }
        console.log("reports = ", results);

        setProgressInfo([{ message: "", currValue: 0 }]);
        setIsFetching(false);
        setShowTable(true);
        setShowMap(true);

        // Finally, update the local DB with the query vars, the query results, and the query error log.

        // }
    };

    // This version clumps urls into groups of (up to) 15 fetch-promises and uses Promise.AllSettled to batch resolve them.
    const batchFetchArray = async (callArray, src, results, errors) => {
        // let errLog = [];
        // let reports = [];
        console.log("CallArray constructed :: ", callArray);
        if (callArray) {
            if (callArray.length > 0) {
                // Start callin'!

                let callNum = 0;
                let successes = 0;
                let currCall = "";
                let startTime = new Date();
                let callVars;
                let callURL;

                // Use these 2 to handle breaking after 502 errors, so we don't venture past the limit of the data available for a given neighborhood.
                let lastCallVars = [];
                let lastCallURL;
                let invalidDate;
                let invalidLat;
                let invalidLng;
                let skip = false;

                let promiseBatch = [];
                let i = 0;
                for (i = 0; i < callArray.length; i++) {
                    // First, if abort is triggered, halt the loop and return what we have so far.
                    if (abort) {
                        console.log(
                            "Aborting! Returning results = ",
                            results,
                            " and error log = ",
                            errors,
                        );
                        return {
                            results: results,
                            errors: errors,
                        };
                    }
                    let call = callArray[i];

                    // for (const call of callArray) {
                    let currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    let currMonth = callVars.date;
                    let currLat = callVars.lat;
                    let currLng = callVars.lng;

                    setProgressInfo([
                        {
                            id: "crimesByLocationProgress",
                            message: `Fetching results for call ${callNum} of ${callArray.length}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: results.length,
                            success: successes,
                            failure: errors.length,
                        },
                    ]);

                    currCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;
                    let res;
                    try {
                        res = await handleFetch(callURL, src, callVars, {
                            abortSignal: abort,
                            timeout: 8000,
                        });
                    } catch (error) {
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }
                    console.log(
                        `${src} :: Called ${currCall} with RES = `,
                        res,
                    );
                    callNum++;
                    if (res) {
                        if (Array.isArray(res)) {
                            // Success, append it to our reports list.
                            if (res.length > 0) {
                                let compiled = SpliceObjArray(res, {
                                    force_id: force,
                                    // neighborhood: neighborhoodData.name,
                                });
                                successes++;
                                results = [...results, ...compiled];
                            } else {
                                // Response is an array, but has no data in it.
                            }
                        } else {
                            // Returned an error descriptor object. Push it into the error log.
                            errors.push(res);
                            if (typeof res === "object") {
                                if ("status" in res) {
                                    if (res.status === 502) {
                                        // We encountered a 502 error, so we need to avoid calling for earlier dates than the one we just called.
                                        invalidDate = callVars.date;
                                        invalidLat = callVars.lat;
                                        invalidLng = callVars.lng;
                                        // New strategy: filter out all entries in the callArray with matching coordinates and months less than or equal to the one that returned an invalid response.
                                        let temp = callArray.slice(i + 1, -1);
                                        let skipResults =
                                            await handleFetchArray(
                                                temp.filter((call, index) => {
                                                    if (
                                                        call.vars.lat ===
                                                            invalidLat &&
                                                        call.vars.lng ===
                                                            invalidLng
                                                    ) {
                                                        if (
                                                            call.vars.date >
                                                            invalidDate
                                                        ) {
                                                            return false;
                                                        }
                                                        return true;
                                                    } else {
                                                        return true;
                                                    }
                                                }),
                                                src,
                                                results,
                                                errors,
                                            );
                                        return skipResults;
                                        break;
                                        // let callArrayTemp =
                                        //     callArray.filter(
                                        //         ( call, index ) =>
                                        //         {
                                        //             if ( call.vars.lat === invalidLat && call.vars.lng === invalidLng )
                                        //             {
                                        //                 if ( call.vars.date > invalidDate )
                                        //                 {
                                        //                     return false;
                                        //                 }
                                        //                 return true;
                                        //             }
                                        //             else {
                                        //                 return true;
                                        //             }
                                        //             return (
                                        //                 call.vars.date >
                                        //                     invalidDate &&
                                        //                 call.vars.lat !==
                                        //                     invalidLat &&
                                        //                 call.vars.lng !==
                                        //                     invalidLng
                                        //             );
                                        //     },
                                        // );
                                        // callArray = callArrayTemp;
                                        // console.log(
                                        //     "Res.status = ",
                                        //     res.status,
                                        //     " on month = ",
                                        //     invalidDate,
                                        //     " at coordinates ",
                                        //     [ invalidLat, invalidLng ],
                                        //     " :: Modifying the loop array: ",
                                        //     callArray
                                        // );

                                        // break;
                                    }
                                }
                            }
                        }
                    } else {
                        // The returned response is undefined, so define a new error here.
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }

                    lastCallURL = callURL;
                    lastCallVars = callVars;
                } // End of loop //
            }
        }

        return {
            results: results,
            errors: errors,
        };
    };

    // This version recursively slices out calls that it knows will result in a 502 error, meaning that the API does not have data going that far back in time.
    const handleFetchArray = async (callArray, src, results, errors) => {
        // let errLog = [];
        // let reports = [];
        console.log("CallArray constructed :: ", callArray);
        if (callArray) {
            if (callArray.length > 0) {
                // Start callin'!

                let callNum = 0;
                let successes = 0;
                let currCall = "";
                let startTime = new Date();
                let callVars;
                let callURL;

                // Use these 2 to handle breaking after 502 errors, so we don't venture past the limit of the data available for a given neighborhood.
                let lastCallVars = [];
                let lastCallURL;
                let invalidDate;
                let invalidLat;
                let invalidLng;
                let skip = false;

                let promiseBatch = [];
                let i = 0;
                for (i = 0; i < callArray.length; i++) {
                    // First, if abort is triggered, halt the loop and return what we have so far.
                    if (abort) {
                        console.log(
                            "Aborting! Returning results = ",
                            results,
                            " and error log = ",
                            errors,
                        );
                        return {
                            results: results,
                            errors: errors,
                        };
                    }
                    let call = callArray[i];

                    // for (const call of callArray) {
                    let currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    let currMonth = callVars.date;
                    let currLat = callVars.lat;
                    let currLng = callVars.lng;

                    setProgressInfo([
                        {
                            id: "crimesByLocationProgress",
                            message: `Fetching results for call ${callNum} of ${callArray.length}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: results.length,
                            success: successes,
                            failure: errors.length,
                        },
                    ]);

                    currCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;
                    let res;
                    try {
                        res = await handleFetch(callURL, src, callVars, {
                            abortSignal: abort,
                            timeout: 8000,
                        });
                    } catch (error) {
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }
                    console.log(
                        `${src} :: Called ${currCall} with RES = `,
                        res,
                    );
                    callNum++;
                    if (res) {
                        if (Array.isArray(res)) {
                            // Success, append it to our reports list.
                            if (res.length > 0) {
                                let compiled = SpliceObjArray(res, {
                                    force_id: force,
                                    // neighborhood: neighborhoodData.name,
                                });
                                successes++;
                                results = [...results, ...compiled];
                            } else {
                                // Response is an array, but has no data in it.
                            }
                        } else {
                            // Returned an error descriptor object. Push it into the error log.
                            errors.push(res);
                            if (typeof res === "object") {
                                if ("status" in res) {
                                    if (res.status === 502) {
                                        // We encountered a 502 error, so we need to avoid calling for earlier dates than the one we just called.
                                        invalidDate = callVars.date;
                                        invalidLat = callVars.lat;
                                        invalidLng = callVars.lng;
                                        // New strategy: filter out all entries in the callArray with matching coordinates and months less than or equal to the one that returned an invalid response.
                                        let temp = callArray.slice(i + 1, -1);
                                        let skipResults =
                                            await handleFetchArray(
                                                temp.filter((call, index) => {
                                                    if (
                                                        call.vars.lat ===
                                                            invalidLat &&
                                                        call.vars.lng ===
                                                            invalidLng
                                                    ) {
                                                        if (
                                                            call.vars.date >
                                                            invalidDate
                                                        ) {
                                                            return false;
                                                        }
                                                        return true;
                                                    } else {
                                                        return true;
                                                    }
                                                }),
                                                src,
                                                results,
                                                errors,
                                            );
                                        return skipResults;
                                        break;
                                        // let callArrayTemp =
                                        //     callArray.filter(
                                        //         ( call, index ) =>
                                        //         {
                                        //             if ( call.vars.lat === invalidLat && call.vars.lng === invalidLng )
                                        //             {
                                        //                 if ( call.vars.date > invalidDate )
                                        //                 {
                                        //                     return false;
                                        //                 }
                                        //                 return true;
                                        //             }
                                        //             else {
                                        //                 return true;
                                        //             }
                                        //             return (
                                        //                 call.vars.date >
                                        //                     invalidDate &&
                                        //                 call.vars.lat !==
                                        //                     invalidLat &&
                                        //                 call.vars.lng !==
                                        //                     invalidLng
                                        //             );
                                        //     },
                                        // );
                                        // callArray = callArrayTemp;
                                        // console.log(
                                        //     "Res.status = ",
                                        //     res.status,
                                        //     " on month = ",
                                        //     invalidDate,
                                        //     " at coordinates ",
                                        //     [ invalidLat, invalidLng ],
                                        //     " :: Modifying the loop array: ",
                                        //     callArray
                                        // );

                                        // break;
                                    }
                                }
                            }
                        }
                    } else {
                        // The returned response is undefined, so define a new error here.
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }

                    lastCallURL = callURL;
                    lastCallVars = callVars;
                } // End of loop //
            }
        }

        return {
            results: results,
            errors: errors,
        };
    };

    const handleFetchArrayBackup = async (callArray, src, results, errors) => {
        // let errLog = [];
        // let reports = [];
        console.log("CallArray constructed :: ", callArray);
        if (callArray) {
            if (callArray.length > 0) {
                // Start callin'!

                let callNum = 0;
                let successes = 0;
                let currCall = "";
                let startTime = new Date();
                let callVars;
                let callURL;

                // Use these 2 to handle breaking after 502 errors, so we don't venture past the limit of the data available for a given neighborhood.
                let lastCallVars = [];
                let lastCallURL;
                let invalidDate;
                let invalidLat;
                let invalidLng;
                let skip = false;

                let promiseBatch = [];
                let i = 0;
                for (i = 0; i < callArray.length; i++) {
                    let call = callArray[i];

                    // for (const call of callArray) {
                    let currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    let currMonth = callVars.date;
                    let currLat = callVars.lat;
                    let currLng = callVars.lng;

                    setProgressInfo([
                        {
                            id: "crimesByLocationProgress",
                            message: `Fetching results for call ${callNum} of ${callArray.length}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: results.length,
                            success: successes,
                            failure: errors.length,
                        },
                    ]);

                    currCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;
                    let res;
                    try {
                        res = await handleFetch(callURL, src, callVars, {
                            abortSignal: abort,
                            timeout: 8000,
                        });
                    } catch (error) {
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }
                    console.log(
                        `${src} :: Called ${currCall} with RES = `,
                        res,
                    );
                    callNum++;
                    if (res) {
                        if (Array.isArray(res)) {
                            // Success, append it to our reports list.
                            if (res.length > 0) {
                                let compiled = SpliceObjArray(res, {
                                    force_id: force,
                                    // neighborhood: neighborhoodData.name,
                                });
                                successes++;
                                results = [...results, ...compiled];
                            } else {
                                // Response is an array, but has no data in it.
                            }
                        } else {
                            // Returned an error descriptor object. Push it into the error log.
                            errors.push(res);
                            if (typeof res === "object") {
                                if ("status" in res) {
                                    if (res.status === 502) {
                                        // We encountered a 502 error, so we need to avoid calling for earlier dates than the one we just called.
                                        invalidDate = callVars.date;
                                        invalidLat = callVars.lat;
                                        invalidLng = callVars.lng;
                                        console.log(
                                            "Res.status = ",
                                            res.status,
                                            " on month = ",
                                            invalidDate,
                                            " at coordinates ",
                                            [invalidLat, invalidLng],
                                        );

                                        // New strategy: filter out all entries in the callArray with matching coordinates and months less than or equal to the one that returned an invalid response.
                                        let callArrayTemp = callArray.filter(
                                            (call, index) => {
                                                return (
                                                    call.vars.date >
                                                        invalidDate &&
                                                    call.vars.lat !==
                                                        invalidLat &&
                                                    call.vars.lng !== invalidLng
                                                );
                                            },
                                        );
                                        callArray = callArrayTemp;
                                        // break;
                                    }
                                }
                            }
                        }
                    } else {
                        // The returned response is undefined, so define a new error here.
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }

                    lastCallURL = callURL;
                    lastCallVars = callVars;
                } // End of loop //
            }
        }

        return {
            results: results,
            errors: errors,
        };
    };

    // Handles searching for multiple (or all) neighborhoods.
    // Due to the nature of the relational database's schema (see: <insert photo of a dumpster fire here>),
    // we first have to call the API for the location coordinates for each and every neighborhood listed for the
    // selected force.
    const handleSearchCrimesByLocation = async (event) => {
        event.preventDefault();
        setShowMap(false);
        setShowTable(false);
        setIsFetching(true);
        setShowContent(true);
        // console.log(
        //     "handleSearchCrimesByLocation triggered :: ",
        //     force,
        //     category,
        //     forceNeighborhoods,
        //     "event values: ",
        //     event.values,
        // );
        if (!force) return setForceIsInvalid(true);

        setCategoryIsInvalid(false);
        setForceIsInvalid(false);

        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        setQueryString(`SearchAllLocationsAllDates_${force}`);

        // Construct the array of neighborhood ids/coordinate pairs.
        let neighborhoodsArray = [];
        // Create the query string so the downloadable file has the right filename.
        // Get only the date keys in the YYYY-MM format, not their labels.
        // neighborhoodsArray = forceNeighborhoods.filter((neighborhood) => {
        //     return (
        //         neighborhood.id !== undefined &&
        //         neighborhood.id !== "all_neighborhoods"
        //     );
        // });
        if (
            forceNeighborhood === "all_neighborhoods" ||
            forceNeighborhood.toString().includes("all_neighborhoods")
        ) {
            // Select all neighborhoods regardless of which ones are selected alongside the "all_neighborhoods" option.
            neighborhoodsArray = forceNeighborhoods
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
            if (Array.isArray(forceNeighborhood)) {
                neighborhoodsArray = forceNeighborhood.filter(
                    (neighborhood) => {
                        return (
                            neighborhood !== undefined &&
                            neighborhood !== "all_neighborhoods"
                        );
                    },
                );
                // .map((neighborhood) => neighborhood.key);
            } else {
                neighborhoodsArray = [forceNeighborhood.toString()];
            }
        }

        let neighborhoodDataArray = await getNeighbourhoodDataMulti(
            force,
            neighborhoodsArray,
        );

        // Construct the array of available dates.
        let datesArray = [];
        if (date === "all_dates" || date.toString().includes("all_dates")) {
            // Get only the date keys in the YYYY-MM format, not their labels.
            datesArray = dates
                .filter((dateObject) => {
                    return dateObject.key !== "all_dates";
                })
                .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
        } else {
            // Get only the date keys in the YYYY-MM format, not their labels.
            if (Array.isArray(date)) {
                datesArray = date.filter((dateID) => {
                    return dateID !== undefined && dateID !== "all_dates";
                });
                // .map((dateObject) => dateObject.key);
            } else {
                datesArray = [date.toString()];
            }
        }
        console.log(
            "handleSearchCrimesByLocation with neighborhoods array: ",
            neighborhoodsArray,
            "\nforceNeighborhoods = ",
            forceNeighborhoods,
            "\nDates = ",
            dates,
            "\ndate = ",
            date,
            "\n\nDate array = ",
            datesArray,
        );

        // If there's no dates set, then use the alternate API call to skip using dates altogether.
        let noDatesMode = !(datesArray.length > 0);

        // Vars for updating the loader progress bar UI.
        let src = "handleSearchCrimesByLocation";
        let startTime = new Date();
        let callnum = 0;
        let numNeighborhoods = neighborhoodDataArray.length;
        let currNeighborhood = 0;

        let numMonths = datesArray.length;
        let successes = 0;
        let failures = 0;
        let reports = [];
        let errLog = [];
        let currCall = "";
        // console.log("locations = ", neighborhoodDataArray);
        for (const neighborhoodData of neighborhoodDataArray) {
            // Call for each neighborhood.
            // console.log( "neighborhoodData = ", neighborhoodData );

            currNeighborhood++;
            if (neighborhoodData) {
                let lat = deepSearch(
                    neighborhoodData,
                    "latitude",
                    (k, v) => k === "latitude",
                    false,
                );
                let lng = deepSearch(
                    neighborhoodData,
                    "longitude",
                    (k, v) => k === "longitude",
                    false,
                );
                if (lat && lng) {
                    let currTime = new Date();
                    if (noDatesMode) {
                        // Call for each neighborhood.
                        currCall = `getCrimeReportsByLocation( ${lat}, ${lng} )`;
                        let currTime = new Date();
                        let res;
                        try {
                            // res = await getCrimeReportsAtLocationMulti(
                            //     lat,
                            //     lng,
                            // );
                            res = await getCrimeReportsByLocation(
                                null,
                                lat,
                                lng,
                                { abortSignal: abort, timeout: 8000 },
                            );
                        } catch (error) {
                            console.error(
                                `handleSearchCrimesByLocation :: Calling ${currCall} returned with an error. :: RES = `,
                                res,
                            );
                        }
                        setProgressInfo([
                            {
                                id: "neighborhoodsProgress",
                                message: `Fetching reports for location ${currNeighborhood} of ${numNeighborhoods}`,
                                currValue: currNeighborhood,
                                endValue: numNeighborhoods,
                                startTime: startTime,
                                currTime: currTime,
                                success: successes,
                                failure: failures,
                            },
                        ]);
                        if (res) {
                            if (Array.isArray(res)) {
                                // Success, append it to our reports list.
                                if (res.length > 0) {
                                    let compiled = SpliceObjArray(res, {
                                        force_id: force,
                                        neighborhood: neighborhoodData.name,
                                    });
                                    successes++;
                                    reports = [...reports, ...compiled];
                                    console.log(
                                        "\n\nneighborhoodData = ",
                                        neighborhoodData,
                                        "\n\nres = ",
                                        res,
                                        "\n\nreports = ",
                                        reports,
                                        "\n\ncompiled = ",
                                        compiled,
                                        // "\n\nsanitized = ",
                                        // sanitizeObjArray( compiled )
                                        // "\ntime = ",
                                        // new Date(),
                                    );
                                }
                            } else {
                                // if ( typeof res === "object" ) {
                                // Returned an error descriptor object. Push it into the error log.
                                errLog.push(res);
                                // }
                                failures++;
                            }
                        } else {
                            // The returned error is undefined, so define it here.
                            errLog.push({
                                source: `handleSearchCrimesNoLocation::getCrimeReportsNoLocation`,
                                call: currCall,
                                time: new Date(),
                                errorMessage: "",
                                response: res,
                                status: null,
                                ok: null,
                            });
                            failures++;
                        }
                    } else {
                        // Call for each neighborhood, for each date.
                        let currMonth = 0;
                        let dateFails = 0;
                        let dateSuccesses = 0;
                        let monthsStartTime = new Date();
                        for (const month of datesArray) {
                            let monthsCurrTime = new Date();
                            setProgressInfo([
                                {
                                    id: "overallProgress",
                                    // message: `Fetching reports for query #${ currNeighborhood * numMonths + currMonth } of ${numNeighborhoods * numMonths}`,
                                    message: `Fetching reports for query #${
                                        callnum
                                        // currNeighborhood * numMonths + currMonth
                                    } of ${numNeighborhoods * numMonths}`,
                                    currValue: callnum, // currNeighborhood * numMonths + currMonth,
                                    endValue: numNeighborhoods * numMonths,
                                    startTime: startTime,
                                    currTime: currTime,
                                    results: reports.length,
                                    success: dateSuccesses + successes,
                                    failure: dateFails + failures,
                                    // estimate:
                                },
                                {
                                    id: "neighborhoodsProgress",
                                    message: `Fetching reports for location ${currNeighborhood} of ${numNeighborhoods}`,
                                    currValue: currNeighborhood,
                                    endValue: numNeighborhoods,
                                    startTime: startTime,
                                    currTime: currTime,
                                    success: successes,
                                    failure: failures,
                                },
                                {
                                    id: "monthsProgress",
                                    message: `Fetching reports for month ${currMonth} of ${numMonths}`,
                                    currValue: currMonth,
                                    endValue: numMonths,
                                    startTime: monthsStartTime,
                                    currTime: monthsCurrTime,
                                    success: dateSuccesses,
                                    failure: dateFails,
                                },
                            ]);
                            callnum++;
                            currMonth++;

                            currCall = `getCrimeReportsByLocation( ${month}, ${lat}, ${lng} )`;
                            let res;
                            try {
                                res = await getCrimeReportsByLocation(
                                    month,
                                    lat,
                                    lng,
                                    { abortSignal: abort, timeout: 8000 },
                                    // abort, // signal,
                                );
                            } catch (error) {
                                errLog.push(
                                    constructFetchError(
                                        `${src}::${currCall}`,
                                        currCall,
                                        [month, lat, lng],
                                        res,
                                    ),
                                );
                            }
                            console.log(
                                `${src} :: Called ${currCall} with RES = `,
                                res,
                            );
                            // reports.concat( res );
                            if (res) {
                                if (Array.isArray(res)) {
                                    // Success, append it to our reports list.
                                    if (res.length > 0) {
                                        let compiled = SpliceObjArray(res, {
                                            force_id: force,
                                            neighborhood: neighborhoodData.name,
                                        });
                                        dateSuccesses++;
                                        reports = [...reports, ...compiled];
                                        console.log(
                                            "\n\nneighborhoodData = ",
                                            neighborhoodData,
                                            "\n\nres = ",
                                            res,
                                            "\n\ncompiled = ",
                                            compiled,
                                            "\n\nreports = ",
                                            reports,
                                            "\n\nerrLog = ",
                                            errLog,
                                            // "\n\nsanitized = ",
                                            // sanitizeObjArray( compiled )
                                            // "\ntime = ",
                                            // new Date(),
                                        );
                                    } else {
                                        // Response is an array, but has no data in it.
                                    }
                                } else {
                                    // Returned an error descriptor object. Push it into the error log.
                                    errLog.push(res);
                                    if (typeof res === "object") {
                                        if ("status" in res) {
                                            console.log(
                                                "Res.status = ",
                                                res.status,
                                            );
                                            if (res.status === 502) {
                                                break;
                                            }
                                        }
                                    }
                                    dateFails++;
                                }
                            } else {
                                // The returned response is undefined, so define a new error here.
                                errLog.push(
                                    constructFetchError(
                                        `${src}::${currCall}`,
                                        currCall,
                                        [month, lat, lng],
                                        res,
                                    ),
                                );
                                dateFails++;
                            }
                            console.log(
                                `${src}::${currCall}::Errlog is currently: `,
                                errLog,
                            );
                        } // End of inner month loop
                        successes += dateSuccesses;
                        failures += dateFails;
                    }
                } else {
                    failures++;
                    errLog.push(
                        `handleSearchCrimesByLocation :: neighborhoodData was missing coordinates data :: neighborhoodData = ${neighborhoodData}`,
                    );
                }
            } else {
                failures++;
                console.error(
                    "neighborhoodData = ",
                    neighborhoodData,
                    " was undefined.",
                );
            }
        }
        if (reports) {
            setCrimeReports(reports);
            console.log("Setting reports: ", reports);
        }
        if (errLog) {
            setErrorLog(errLog);
        }
        console.log("reports = ", reports);

        setProgressInfo([{ message: "", currValue: 0 }]);
        setIsFetching(false);
        setShowTable(true);
        setShowMap(true);
        // }
    };

    // if (isLoading) return <Loader progressInfo={progressInfo} />;
    if (error) return `An error has occurred: ${error.message}`;

    const toggleSidebar = () => {
        if (showSidebar) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
    };

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
                return <div className="dashboard-content">options</div>;
            default:
                break;
        }
    };
    return (
        <div className={`page-container theme-${theme}`}>
            {
                <Sidebar
                    className={`${showSidebar ? "" : "hidden"}`}
                    query={query}
                    setQuery={setQuery}
                    categories={categories}
                    forces={forces}
                    dates={dates}
                    forceNeighborhoods={forceNeighborhoods}
                    category={category}
                    force={force}
                    forceNeighborhood={forceNeighborhood}
                    forceNeighborhoodData={forceNeighborhoodData}
                    date={date}
                    setCategory={setCategory}
                    setForce={setForce}
                    setForceNeighborhood={setForceNeighborhood}
                    setForceNeighborhoodData={setForceNeighborhoodData} // Grab the coordinates and other data of the selected neighbourhood.
                    setDate={setDate}
                    neighborhoodId={neighborhoodId}
                    setNeighborhoodId={setNeighborhoodId}
                    neighborhoodCoordinates={neighborhoodCoordinates}
                    setNeighborhoodCoordinates={setNeighborhoodCoordinates}
                    // Pass search functions
                    // handleSearch={handleSearch}
                    // handleSearchAtLocation={handleSearchAtLocation}
                    // handleSearchByLocation={handleSearchByLocation}
                    handleSearchCrimesNoLocation={handleSearchCrimesNoLocation}
                    handleSearchCrimesByLocation={handleSearchCrimesByLocation}
                    handleSearchCrimesByLocationFast={
                        handleSearchCrimesByLocationFast
                    }
                    categoryIsInvalid={categoryIsInvalid}
                    forceIsInvalid={forceIsInvalid}
                    setCategoryIsInvalid={setCategoryIsInvalid}
                    setForceIsInvalid={setForceIsInvalid}
                    isFetching={isFetching}
                    showSidebar={showSidebar}
                    theme={theme}
                    setTheme={setTheme}
                    menu={menu}
                    setMenu={setMenu}
                    abort={abort}
                    setAbort={setAbort}
                />
            }
            <div className="page-content">
                <Header
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                    toggleSidebar={toggleSidebar}
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

export default DashboardBackup;

// Archived 03-04-23 // 

/*   

    // This version clumps urls into groups of (up to) 15 fetch-promises and uses Promise.AllSettled to batch resolve them.
    const batchFetchArray = async (callArray, src, splicekeys, isRetry = false, batchSize = MAX_CONSECUTIVE_CALLS) => {
        let errors = [];
        let results = [];
        if ( callArray.length < MAX_CONSECUTIVE_CALLS )
        {
            batchSize = callArray.length; //  - 1;
        }

        console.log(`batchFetchArray :: CallArray received :: `, callArray);
        if ( callArray ) 
        {
            if (callArray.length > 0) {
                // Start callin'!

                let callNum = 0;
                let successes = 0;
                let currCall = "";
                let startTime = new Date();
                let callVars;
                let callURL;

                let retryCalls = [];
                let promiseBatch = [];
                let i = 0;
                for ( i = 0; i < callArray.length && abort !== true; i++ )
                {
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
                    let currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    callNum++;
                    currCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;
;
                    let seconds = (currTime.getTime() - startTime.getTime()) / 1000;
                    let secondsPerCall = seconds / i;
                    let callsPerSecond = i / seconds;
                    setProgressInfo([
                        {
                            id: "crimesByLocationProgress",
                            message: `Fetching results for call ${callNum} of ${callArray.length}\n${seconds}s => ${callsPerSecond} per sec`, // :: ${currCall}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: results.length,
                            success: successes,
                            failure: errors.length,
                        },
                    ]);

                    let res;
                    promiseBatch.push(
                        handleFetch(callURL, src, callVars, {
                            abortSignal: abort,
                            timeout: 8000,
                        }),
                    );
                    // console.log(
                    //     `batchFetchArray :: i = ${i}, max batch size = ${batchSize}, current batch size = ${
                    //         promiseBatch.length
                    //     }, callArray length = ${
                    //         callArray.length
                    //     }, how many left in array = ${
                    //         callArray.length - i
                    //     }, difference: ${
                    //         callArray.length - i - promiseBatch.length
                    //     } :: batchSize - promiseBatch.length = ${
                    //         batchSize - promiseBatch.length
                    //     }`,
                    // );
                    // if (
                    //     promiseBatch.length < batchSize
                    //     &&
                    //     (callArray.length - i) > promiseBatch.length
                    // ) {
                    //     // Add another to the stack.
                    //     // setTimeout( () =>
                    //     // {
                    //     promiseBatch.push(
                    //         handleFetch(callURL, src, callVars, {
                    //             abortSignal: abort,
                    //             timeout: 8000,
                    //         }),
                    //     );
                    //     // }, 1000 / 10 );
                    // } else {
                    if ( promiseBatch.length >= batchSize
                        || ( callArray.length - i ) <= promiseBatch.length )
                    {
                        // Process them

                        try {
                            res = await Promise.allSettled(promiseBatch)
                                .then((data) => (res = data))
                                .catch((error) =>
                                    console.log("Allsettled error: ", error),
                                );
                            // .then( ( results ) =>
                            // {
                            //     console.log( "allsettled=>then :: Results = ", results );
                            // });
                        } catch (error) {
                            errors.push(
                                constructFetchError(
                                    `${src}::${callURL}`,
                                    callURL,
                                    callVars,
                                    res,
                                ),
                            );
                        }

                        console.log(
                            `${src} :: Called promise batch (${
                                promiseBatch.length
                            }): ${JSON.stringify(
                                promiseBatch,
                            )} with response RES = `,
                            res,
                        );

                        const succeededValues = res
                            .filter((o) => o.status === "fulfilled")
                            .map((s) => s.value);

                        const failedValues = res
                            .filter((o) => o.status === "rejected")
                            .map((f) => f.reason);
                        console.log(
                            "res = ",
                            res,
                            ", succeededValues = ",
                            succeededValues,
                            ", failedValues = ",
                            failedValues,
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
                                    if ( result.value )
                                    {
                                        let val = result.value;
                                        if ( Array.isArray( val ) )
                                        {
                                            if ( val[ 0 ] !== undefined && val[ 0 ] !== null)
                                            {
                                                data = [ ...data, ...val ];
                                            } else
                                            {
                                            }
                                        }
                                        else if ( typeof val === "object" )
                                        {
                                            // Val is an object.
                                            // Our custom errors will come through as fulfilled, so we have to filter them out.
                                            if ( has( val, "status" ) )
                                            {
                                                if ( val.status === 502 )
                                                {
                                                    // console.log(
                                                    //     `val had 502 error: `,
                                                    //     val,
                                                    // );
                                                } else if ( val.status === 429 )
                                                {
                                                    retryCalls.push( call );
                                                    console.log(
                                                        `val had 429 error: `,
                                                        val,
                                                        ", retryCalls is now: ",
                                                        retryCalls,
                                                    );
                                                }

                                                errors.push( val );
                                            }
                                            else
                                            {
                                                // We've received a single object as our resulting data instead of our custom errors. This usually happens with the neighborhood information calls.
                                                // data = [...data, val];
                                                // data.push( ...val );
                                                data.push( val );
                                            }
                                        }
                                    }
                                } else if (result.status === "rejected") {
                                    errors.push(result);
                                    // The returned response is undefined, so define a new error here.
                                    // errors.push(
                                    //     constructFetchError(
                                    //         `${src}::${callURL}`,
                                    //         callURL,
                                    //         callVars,
                                    //         r,
                                    //     ),
                                    // );
                                }
                            });
                            if ( data.length > 0 )
                            {
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
                                ", succeededValues = ",
                                succeededValues,
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
                                constructFetchError(
                                    `${src}::${callURL}`,
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
                if ( retryCalls && !isRetry )
                {
                    if ( retryCalls.length > 0 )
                    {
                        let retry = await batchFetchArray( retryCalls, src, splicekeys, true, batchSize );
                        if ( retry )
                        {
                            if ( "results" in retry )
                            {
                                console.log( `batchFetchArray :: recieved retry results = `, retry, `, returning: `,
                                    {
                                        calldata: callArray,
                                        results: [...results, ...retry.results],
                                        errors: [...errors, ...retry.errors],
                                    }
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
            }
            else
            {
                // Callarray provided was defined but empty.
            }
        }
        else
        {
            // Callarray provided was undefined.
        }
        return {
            calldata: callArray,
            results: results,
            errors: errors,
        };
    };

    // This version clumps urls into groups of (up to) 15 fetch-promises and uses Promise.AllSettled to batch resolve them.
    const batchFetchArray = async (callArray, src, splicekeys) => {
        let errors = [];
        let results = [];
        let batchSize = MAX_CONSECUTIVE_CALLS;
        if ( callArray.length < MAX_CONSECUTIVE_CALLS )
        {
            batchSize = callArray.length; //  - 1;
        }

        console.log("CallArray constructed :: ", callArray);
        if (callArray) {
            if (callArray.length > 0) {
                // Start callin'!

                let callNum = 0;
                let successes = 0;
                let currCall = "";
                let startTime = new Date();
                let callVars;
                let callURL;

                let retryCalls = [];
                let promiseBatch = [];
                let i = 0;
                for ( i = 0; i < callArray.length && abort !== true; i++ )
                {
                    console.log(`batchFetchArray :: running call #${i}: `, callArray[i]);
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
                    let currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    callNum++;
                    currCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;

                    let seconds = timeElapsed( startTime.getTime(), currTime.getTime() );
                    let secondsPerCall = seconds / i;
                    setProgressInfo([
                        {
                            id: "crimesByLocationProgress",
                            message: `Fetching results for call ${callNum} of ${callArray.length} :: ${seconds}s => ${secondsPerCall} per call :: ${currCall}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: results.length,
                            success: successes,
                            failure: errors.length,
                        },
                    ]);

                    let res;
                    console.log(
                        `batchFetchArray :: i = ${i}, max batch size = ${batchSize}, current batch size = ${
                            promiseBatch.length
                        }, callArray length = ${
                            callArray.length
                        }, how many left in array = ${
                            callArray.length - i
                        }, difference: ${
                            callArray.length - i - promiseBatch.length
                        } :: batchSize - promiseBatch.length = ${
                            batchSize - promiseBatch.length
                        }`,
                    );
                    if (
                        promiseBatch.length < batchSize
                        &&
                        (callArray.length - i) > promiseBatch.length
                    ) {
                        // Add another to the stack.
                        // setTimeout( () =>
                        // {
                        promiseBatch.push(
                            handleFetch(callURL, src, callVars, {
                                abortSignal: abort,
                                timeout: 8000,
                            }),
                        );
                        // }, 1000 / 10 );
                    } else {
                        // Process them

                        try {
                            res = await Promise.allSettled(promiseBatch)
                                .then((data) => (res = data))
                                .catch((error) =>
                                    console.log("Allsettled error: ", error),
                                );
                            // .then( ( results ) =>
                            // {
                            //     console.log( "allsettled=>then :: Results = ", results );
                            // });
                        } catch (error) {
                            errors.push(
                                constructFetchError(
                                    `${src}::${callURL}`,
                                    callURL,
                                    callVars,
                                    res,
                                ),
                            );
                        }

                        console.log(
                            `${src} :: Called promise batch (${
                                promiseBatch.length
                            }): ${JSON.stringify(
                                promiseBatch,
                            )} with response RES = `,
                            res,
                        );

                        const succeededValues = res
                            .filter((o) => o.status === "fulfilled")
                            .map((s) => s.value);

                        const failedValues = res
                            .filter((o) => o.status === "rejected")
                            .map((f) => f.reason);
                        console.log(
                            "res = ",
                            res,
                            ", succeededValues = ",
                            succeededValues,
                            ", failedValues = ",
                            failedValues,
                        );

                        promiseBatch = [];
                        if (arrayIsValid(res)) {
                            // Success, append it to our reports list.
                            let data = [];
                            res.forEach((result, index) => {
                                if (result.status === "fulfilled") {
                                    let val = result.value;
                                    console.log( `Result value #${ index } of res = `, val, " :: type = ", typeof val, ", isarray? = ", Array.isArray(val) );
                                    if (arrayIsValid(val)) {
                                        data = [ ...data, ...val ];
                                        
                                    } else {
                                        // Our custom errors will come through as fulfilled, so we have to filter them out.
                                        if (has(val, "status")) {
                                            if (val.status === 502) {
                                                console.log(
                                                    `val had 502 error: `,
                                                    val,
                                                );
                                            } else if (val.status === 429) {
                                                retryCalls.push(call);
                                                console.log(
                                                    `val had 429 error: `,
                                                    val,
                                                    ", retryCalls is now: ",
                                                    retryCalls,
                                                );
                                            }

                                            errors.push(val);
                                        } else if (has(val))
                                        {
                                            // We've received a single object as our resulting data instead of our custom errors. This usually happens with the neighborhood information calls.
                                            // data = [...data, val];
                                            // data.push( ...val );
                                            data.concat(val);
                                        }
                                    }
                                } else if (result.status === "rejected") {
                                    errors.push(result);
                                    // The returned response is undefined, so define a new error here.
                                    // errors.push(
                                    //     constructFetchError(
                                    //         `${src}::${callURL}`,
                                    //         callURL,
                                    //         callVars,
                                    //         r,
                                    //     ),
                                    // );
                                }
                            });
                            let compiled = SpliceObjArray(
                                data,
                                call,
                                // {
                                //     // force_id: force,
                                //     // neighborhood: neighborhoodData.name,
                                // }
                            );
                            successes++;
                            results = [...results, ...compiled];

                            // Handle errors

                            console.log(
                                "res = ",
                                res,
                                ", succeededValues = ",
                                succeededValues,
                                "Data = ",
                                data,
                                // "res as string = ",
                                // JSON.stringify(res),
                                "compiled = ",
                                compiled,
                                "results = ",
                                results,
                                ", errors = ",
                                errors,
                            );
                        } else {
                            // The returned response is undefined, so define a new error here.
                            errors.push(
                                constructFetchError(
                                    `${src}::${callURL}`,
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
            }
        }

        return {
            results: results,
            errors: errors,
        };
    };

    // This version recursively slices out calls that it knows will result in a 502 error, meaning that the API does not have data going that far back in time.
    const handleFetchArray = async (callArray, src, results, errors) => {
        // let errLog = [];
        // let reports = [];
        console.log("CallArray constructed :: ", callArray);
        if (callArray) {
            if (callArray.length > 0) {
                // Start callin'!

                let callNum = 0;
                let successes = 0;
                let currCall = "";
                let startTime = new Date();
                let callVars;
                let callURL;

                // Use these 2 to handle breaking after 502 errors, so we don't venture past the limit of the data available for a given neighborhood.
                let lastCallVars = [];
                let lastCallURL;
                let invalidDate;
                let invalidLat;
                let invalidLng;
                let skip = false;

                let promiseBatch = [];
                let i = 0;
                for (i = 0; i < callArray.length; i++) {
                    // First, if abort is triggered, halt the loop and return what we have so far.
                    if (abort) {
                        console.log(
                            "Aborting! Returning results = ",
                            results,
                            " and error log = ",
                            errors,
                        );
                        return {
                            results: results,
                            errors: errors,
                        };
                    }
                    let call = callArray[i];

                    // for (const call of callArray) {
                    let currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    let currMonth = callVars.date;
                    let currLat = callVars.lat;
                    let currLng = callVars.lng;

                    setProgressInfo([
                        {
                            id: "crimesByLocationProgress",
                            message: `Fetching results for call ${callNum} of ${callArray.length}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: results.length,
                            success: successes,
                            failure: errors.length,
                        },
                    ]);

                    currCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;
                    let res;
                    try {
                        res = await handleFetch(callURL, src, callVars, {
                            abortSignal: abort,
                            timeout: 8000,
                        });
                    } catch (error) {
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }
                    console.log(
                        `${src} :: Called ${currCall} with RES = `,
                        res,
                    );
                    callNum++;
                    if (res) {
                        if (Array.isArray(res)) {
                            // Success, append it to our reports list.
                            if (res.length > 0) {
                                let compiled = SpliceObjArray(res, {
                                    force_id: force,
                                    // neighborhood: neighborhoodData.name,
                                });
                                successes++;
                                results = [...results, ...compiled];
                            } else {
                                // Response is an array, but has no data in it.
                            }
                        } else {
                            // Returned an error descriptor object. Push it into the error log.
                            errors.push(res);
                            if (typeof res === "object") {
                                if ("status" in res) {
                                    if (res.status === 502) {
                                        // We encountered a 502 error, so we need to avoid calling for earlier dates than the one we just called.
                                        invalidDate = callVars.date;
                                        invalidLat = callVars.lat;
                                        invalidLng = callVars.lng;
                                        // New strategy: filter out all entries in the callArray with matching coordinates and months less than or equal to the one that returned an invalid response.
                                        let temp = callArray.slice(i + 1, -1);
                                        let skipResults =
                                            await handleFetchArray(
                                                temp.filter((call, index) => {
                                                    if (
                                                        call.vars.lat ===
                                                            invalidLat &&
                                                        call.vars.lng ===
                                                            invalidLng
                                                    ) {
                                                        if (
                                                            call.vars.date >
                                                            invalidDate
                                                        ) {
                                                            return false;
                                                        }
                                                        return true;
                                                    } else {
                                                        return true;
                                                    }
                                                }),
                                                src,
                                                results,
                                                errors,
                                            );
                                        return skipResults;
                                        break;
                                        // let callArrayTemp =
                                        //     callArray.filter(
                                        //         ( call, index ) =>
                                        //         {
                                        //             if ( call.vars.lat === invalidLat && call.vars.lng === invalidLng )
                                        //             {
                                        //                 if ( call.vars.date > invalidDate )
                                        //                 {
                                        //                     return false;
                                        //                 }
                                        //                 return true;
                                        //             }
                                        //             else {
                                        //                 return true;
                                        //             }
                                        //             return (
                                        //                 call.vars.date >
                                        //                     invalidDate &&
                                        //                 call.vars.lat !==
                                        //                     invalidLat &&
                                        //                 call.vars.lng !==
                                        //                     invalidLng
                                        //             );
                                        //     },
                                        // );
                                        // callArray = callArrayTemp;
                                        // console.log(
                                        //     "Res.status = ",
                                        //     res.status,
                                        //     " on month = ",
                                        //     invalidDate,
                                        //     " at coordinates ",
                                        //     [ invalidLat, invalidLng ],
                                        //     " :: Modifying the loop array: ",
                                        //     callArray
                                        // );

                                        // break;
                                    }
                                }
                            }
                        }
                    } else {
                        // The returned response is undefined, so define a new error here.
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }

                    lastCallURL = callURL;
                    lastCallVars = callVars;
                } // End of loop //
            }
        }

        return {
            results: results,
            errors: errors,
        };
    };

    const handleFetchArrayBackup = async (callArray, src, results, errors) => {
        // let errLog = [];
        // let reports = [];
        console.log("CallArray constructed :: ", callArray);
        if (callArray) {
            if (callArray.length > 0) {
                // Start callin'!

                let callNum = 0;
                let successes = 0;
                let currCall = "";
                let startTime = new Date();
                let callVars;
                let callURL;

                // Use these 2 to handle breaking after 502 errors, so we don't venture past the limit of the data available for a given neighborhood.
                let lastCallVars = [];
                let lastCallURL;
                let invalidDate;
                let invalidLat;
                let invalidLng;
                let skip = false;

                let promiseBatch = [];
                let i = 0;
                for (i = 0; i < callArray.length; i++) {
                    let call = callArray[i];

                    // for (const call of callArray) {
                    let currTime = new Date();
                    callVars = call.vars;
                    callURL = call.url;
                    let currMonth = callVars.date;
                    let currLat = callVars.lat;
                    let currLng = callVars.lng;

                    setProgressInfo([
                        {
                            id: "crimesByLocationProgress",
                            message: `Fetching results for call ${callNum} of ${callArray.length}`,
                            currValue: callNum,
                            endValue: callArray.length,
                            startTime: startTime,
                            currTime: currTime,
                            results: results.length,
                            success: successes,
                            failure: errors.length,
                        },
                    ]);

                    currCall = `handleFetch( ${callURL}, ${callVars}, ${src} )`;
                    let res;
                    try {
                        res = await handleFetch(callURL, src, callVars, {
                            abortSignal: abort,
                            timeout: 8000,
                        });
                    } catch (error) {
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }
                    console.log(
                        `${src} :: Called ${currCall} with RES = `,
                        res,
                    );
                    callNum++;
                    if (res) {
                        if (Array.isArray(res)) {
                            // Success, append it to our reports list.
                            if (res.length > 0) {
                                let compiled = SpliceObjArray(res, {
                                    force_id: force,
                                    // neighborhood: neighborhoodData.name,
                                });
                                successes++;
                                results = [...results, ...compiled];
                            } else {
                                // Response is an array, but has no data in it.
                            }
                        } else {
                            // Returned an error descriptor object. Push it into the error log.
                            errors.push(res);
                            if (typeof res === "object") {
                                if ("status" in res) {
                                    if (res.status === 502) {
                                        // We encountered a 502 error, so we need to avoid calling for earlier dates than the one we just called.
                                        invalidDate = callVars.date;
                                        invalidLat = callVars.lat;
                                        invalidLng = callVars.lng;
                                        console.log(
                                            "Res.status = ",
                                            res.status,
                                            " on month = ",
                                            invalidDate,
                                            " at coordinates ",
                                            [invalidLat, invalidLng],
                                        );

                                        // New strategy: filter out all entries in the callArray with matching coordinates and months less than or equal to the one that returned an invalid response.
                                        let callArrayTemp = callArray.filter(
                                            (call, index) => {
                                                return (
                                                    call.vars.date >
                                                        invalidDate &&
                                                    call.vars.lat !==
                                                        invalidLat &&
                                                    call.vars.lng !== invalidLng
                                                );
                                            },
                                        );
                                        callArray = callArrayTemp;
                                        // break;
                                    }
                                }
                            }
                        }
                    } else {
                        // The returned response is undefined, so define a new error here.
                        errors.push(
                            constructFetchError(
                                `${src}::${callURL}`,
                                callURL,
                                callVars,
                                res,
                            ),
                        );
                    }

                    lastCallURL = callURL;
                    lastCallVars = callVars;
                } // End of loop //
            }
        }

        return {
            results: results,
            errors: errors,
        };
    };
*/



////////////////////////////////
/*  // Archived 03-02-23 // 

        const handleSearch = async (event) => {
            event.preventDefault();
            setShowTable(false);
            setShowMap(false);
            setShowContent(true);
            console.log(
                "handleSearch triggered:: ",
                force,
                category,
                date,
                "event values: ",
                event.values,
            );
            if (!category) return setCategoryIsInvalid(true);
            if (!force) return setForceIsInvalid(true);

            setCategoryIsInvalid(false);
            setForceIsInvalid(false);
            setIsFetching(true);

            // Create the query string so the downloadable file has the right filename.
            setQueryString(`SearchNoLocation_${[force, category, date].join("_")}`);
            console.log("queryString = ", queryString);
            // Clear the table.
            setTimeout(() => {
                setCrimeReports([]);
            }, 1000);

            if (date === "all_dates" || Array.isArray(date)) {
                handleSearchCrimesNoLocation(event);
                return;
            } else {
                setTimeout(() => {
                    getCrimeReports(category, force, date)
                        .then((crimeReports) => {
                            if (crimeReports) {
                                setCrimeReports(crimeReports);
                            }
                        })
                        .then(() => setIsFetching(false))
                        // .then(() => scrollBottom())
                        .catch((error) => setError(error));
                }, 1000);
            }
            setShowTable(true);
        };

        // Handles searching for multiple (or all) neighborhoods.
        // Due to the nature of the relational database's schema (see: <insert photo of a dumpster fire here>),
        // we first have to call the API for the location coordinates for each and every neighborhood listed for the
        // selected force.
        const handleSearchCrimesByLocation = async (event) => {
            event.preventDefault();
            setShowMap(false);
            setShowTable(false);
            setIsFetching(true);
            setShowContent(true);
            // console.log(
            //     "handleSearchCrimesByLocation triggered :: ",
            //     force,
            //     category,
            //     forceNeighborhoods,
            //     "event values: ",
            //     event.values,
            // );
            if (!force) return setForceIsInvalid(true);

            setCategoryIsInvalid(false);
            setForceIsInvalid(false);

            // Clear the table.
            setTimeout(() => {
                setCrimeReports([]);
            }, 1000);

            setQueryString(`SearchAllLocationsAllDates_${force}`);

            // Construct the array of neighborhood ids/coordinate pairs.
            let neighborhoodsArray = [];
            // Create the query string so the downloadable file has the right filename.
            // Get only the date keys in the YYYY-MM format, not their labels.
            // neighborhoodsArray = forceNeighborhoods.filter((neighborhood) => {
            //     return (
            //         neighborhood.id !== undefined &&
            //         neighborhood.id !== "all_neighborhoods"
            //     );
            // });
            if (
                forceNeighborhood === "all_neighborhoods" ||
                forceNeighborhood.toString().includes("all_neighborhoods")
            ) {
                // Select all neighborhoods regardless of which ones are selected alongside the "all_neighborhoods" option.
                neighborhoodsArray = forceNeighborhoods.filter((neighborhood) => {
                    // return neighborhood.key !== "all_neighborhoods";
                    return (
                        neighborhood.id !== undefined &&
                        neighborhood.id !== "all_neighborhoods"
                    );
                }).map((neighborhood) => neighborhood.id); // dates.splice( 1, dates.length );
            } else {
                // More than 1 neighborhood is selected, but not all of them. Run through and make sure none of them are invalid.
                if (Array.isArray(forceNeighborhood)) {
                    neighborhoodsArray = forceNeighborhood.filter(
                        (neighborhood) => {
                            return (
                                neighborhood !== undefined &&
                                neighborhood !== "all_neighborhoods"
                            );
                        },
                    );
                    // .map((neighborhood) => neighborhood.key);
                } else {
                    neighborhoodsArray = [forceNeighborhood.toString()];
                }
            }

            let neighborhoodDataArray = await getNeighbourhoodDataMulti(
                force,
                neighborhoodsArray,
            );

            // Construct the array of available dates.
            let datesArray = [];
            if (date === "all_dates" || date.toString().includes("all_dates")) {
                // Get only the date keys in the YYYY-MM format, not their labels.
                datesArray = dates
                    .filter((dateObject) => {
                        return dateObject.key !== "all_dates";
                    })
                    .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
            } else {
                // Get only the date keys in the YYYY-MM format, not their labels.
                if (Array.isArray(date)) {
                    datesArray = date.filter((dateID) => {
                        return dateID !== undefined && dateID !== "all_dates";
                    });
                    // .map((dateObject) => dateObject.key);
                } else {
                    datesArray = [date.toString()];
                }
            }
            console.log(
                "handleSearchCrimesByLocation with neighborhoods array: ",
                neighborhoodsArray,
                "\nforceNeighborhoods = ",
                forceNeighborhoods,
                "\nDates = ",
                dates,
                "\ndate = ",
                date,
                "\n\nDate array = ",
                datesArray,
            );

            // If there's no dates set, then use the alternate API call to skip using dates altogether.
            let noDatesMode = !(datesArray.length > 0);

            // Vars for updating the loader progress bar UI.
            let startTime = new Date();
            let callnum = 0;
            let numNeighborhoods = neighborhoodDataArray.length;
            let currNeighborhood = 0;

            let numMonths = datesArray.length;
            let successes = 0;
            let failures = 0;
            let reports = [];
            let errLog = [];
            let currCall = "";
            // console.log("locations = ", neighborhoodDataArray);
            for (const neighborhoodData of neighborhoodDataArray) {
                // Call for each neighborhood.
                // console.log( "neighborhoodData = ", neighborhoodData );

                currNeighborhood++;
                if ( neighborhoodData )
                {
                    let lat = deepSearch( neighborhoodData, "latitude", (k, v) => k === "latitude", false );
                    let lng = deepSearch( neighborhoodData, "longitude", ( k, v ) => k === "longitude", false );
                    if ( lat && lng ) 
                    {
                    // if ("centre" in neighborhoodData) {
                        // if (
                        //     "latitude" in neighborhoodData.centre &&
                        //     "longitude" in neighborhoodData.centre
                        // ) {
                            // Quick test of deep nested value search:
                            // console.log(
                            //     `Quick test of deep nested value search: deepSearchObject( ${neighborhoodData}, "latitude" ) = ${deepSearchObject(
                            //         neighborhoodData,
                            //         "latitude",
                            //     )} :: deepSearch(${neighborhoodData}, "centre", (k, v) => k === "latitude") => `,
                            //     deepSearch(
                            //         neighborhoodData,
                            //         "latitude",
                            //         (k, v) => k === "latitude",
                            //         false,
                            //     ),
                            // );
                            if (noDatesMode) {
                                // Call for each neighborhood.
                                currCall = `getCrimeReportsAtLocationMulti( ${lat}, ${lng} )`;
                                let res;
                                try {
                                    res = await getCrimeReportsAtLocationMulti(
                                        lat,
                                        lng,
                                    );
                                } catch (error) {
                                    console.error(
                                        `handleSearchCrimesByLocation :: Calling ${currCall} returned with an error. :: RES = `,
                                        res,
                                    );
                                }
                                setProgressInfo([
                                    {
                                        id: "neighborhoodsProgress",
                                        message: `Fetching reports for location ${currNeighborhood} of ${numNeighborhoods}`,
                                        currValue: currNeighborhood,
                                        endValue: numNeighborhoods,
                                        startTime: startTime,
                                        success: successes,
                                        failure: failures,
                                    },
                                ]);
                                if (res) {
                                    if (res === "ERR: INVALID/UNDEFINED INPUT") {
                                        failures++;
                                        errLog.push(
                                            `handleSearchCrimesByLocation :: Calling ${currCall} resulted in ERR: INVALID/UNDEFINED INPUT :: res = `,
                                            res,
                                        );
                                    } else if (res === "ERR_ABORTED::502") {
                                        errLog.push(
                                            `handleSearchCrimesByLocation :: Calling ${currCall} resulted in ERR_ABORTED::502 :: res = `,
                                            res,
                                        );
                                    } else {
                                        let compiled = SpliceObjArray(res, {
                                            force_id: force,
                                            neighborhood: neighborhoodData.name,
                                        });
                                        successes++;
                                        reports = [...reports, ...compiled];
                                        // console.log(
                                        //     "\n\nneighborhoodData = ",
                                        //     neighborhoodData,
                                        //     "\n\nres = ",
                                        //     res,
                                        //     "\n\nreports = ",
                                        //     reports,
                                        //     "\n\ncompiled = ",
                                        //     compiled,
                                        //     // "\n\nsanitized = ",
                                        //     // sanitizeObjArray( compiled )
                                        //     // "\ntime = ",
                                        //     // new Date(),
                                        // );
                                    }
                                } else {
                                    failures++;
                                    errLog.push(
                                        `handleSearchCrimesByLocation :: Calling ${currCall} returned undefined :: RES = `,
                                        res,
                                    );
                                }
                            } else {
                                // Call for each neighborhood, for each date.
                                let currMonth = 0;
                                let dateFails = 0;
                                let dateSuccesses = 0;
                                let monthsStartTime = new Date();
                                for (const month of datesArray) {
                                    setProgressInfo([
                                        {
                                            id: "overallProgress",
                                            message: `Fetching reports for query #${
                                                currNeighborhood * numMonths +
                                                currMonth
                                            } of ${numNeighborhoods * numMonths}`,
                                            currValue:
                                                currNeighborhood * numMonths +
                                                currMonth,
                                            endValue: numNeighborhoods * numMonths,
                                            startTime: startTime,
                                            results: reports.length,
                                            success: dateSuccesses + successes,
                                            failure: dateFails + failures,
                                            // estimate: 
                                        },
                                        {
                                            id: "neighborhoodsProgress",
                                            message: `Fetching reports for location ${currNeighborhood} of ${numNeighborhoods}`,
                                            currValue: currNeighborhood,
                                            endValue: numNeighborhoods,
                                            startTime: startTime,
                                            success: successes,
                                            failure: failures,
                                        },
                                        {
                                            id: "monthsProgress",
                                            message: `Fetching reports for month ${currMonth} of ${numMonths}`,
                                            currValue: currMonth,
                                            endValue: numMonths,
                                            startTime: monthsStartTime,
                                            success: dateSuccesses,
                                            failure: dateFails,
                                        },
                                    ]);
                                    currMonth++;
                                    currCall = `getCrimeReportsByLocation( ${month}, ${lat}, ${lng} )`;
                                    let res;
                                    try {
                                        res = await getCrimeReportsByLocation(
                                            month,
                                            lat,
                                            lng,
                                        );
                                        callnum++;
                                    } catch (error) {
                                        errLog.push(
                                            `handleSearchCrimesByLocation :: Calling ${currCall} returned with an error. :: RES = `,
                                            res,
                                        );
                                    }
                                    console.log(
                                        `handleSearchCrimesByLocation :: Calling ${currCall} with RES = `,
                                        res,
                                    );
                                    // reports.concat( res );
                                    if (res) {
                                        if (
                                            res === "ERR: INVALID/UNDEFINED INPUT"
                                        ) {
                                            dateFails++;
                                            errLog.push(
                                                `handleSearchCrimesByLocation :: Calling ${currCall} resulted in ERR: INVALID/UNDEFINED INPUT :: res = `,
                                                res,
                                            );
                                            // console.error( `handleSearchCrimesByLocation :: Calling getCrimeReportsByLocation( ${month}, ${neighborhoodData.centre.latitude}, ${neighborhoodData.centre.longitude} ) resulted in ERR: INVALID/UNDEFINED INPUT`
                                            // );
                                        } else {
                                            // let compiled = Object.assign(
                                            //     res,
                                            //     { force_id: force },
                                            //     neighborhoodData,
                                            // );
                                            let compiled = SpliceObjArray(res, {
                                                force_id: force,
                                                neighborhood: neighborhoodData.name,
                                            });
                                            dateSuccesses++;
                                            successes++;
                                            reports = [...reports, ...compiled];
                                            console.log(
                                                "\n\nneighborhoodData = ",
                                                neighborhoodData,
                                                "\n\nres = ",
                                                res,
                                                "\n\nreports = ",
                                                reports,
                                                "\n\ncompiled = ",
                                                compiled,
                                                // "\n\nsanitized = ",
                                                // sanitizeObjArray( compiled )
                                                // "\ntime = ",
                                                // new Date(),
                                            );
                                        }
                                    } else {
                                        failures++;
                                        errLog.push(
                                            `handleSearchCrimesByLocation :: Calling ${currCall} returned undefined :: RES = `,
                                            res,
                                        );
                                    }
                                } // End of inner month loop
                            }
                        // } else {
                        //     failures++;
                        //     errLog.push(
                        //         `handleSearchCrimesByLocation :: neighborhoodData was missing coordinates data :: neighborhoodData = ${neighborhoodData}`,
                        //     );
                        // }
                    } else {
                        failures++;
                        errLog.push(
                            `handleSearchCrimesByLocation :: neighborhoodData was missing coordinates data :: neighborhoodData = ${neighborhoodData}`,
                        );
                    }
                } else {
                    failures++;
                    console.error(
                        "neighborhoodData = ",
                        neighborhoodData,
                        " was undefined.",
                    );
                }
            }
            if (reports) {
                setCrimeReports(reports);
                console.log("Setting reports: ", reports);
            }
            if ( errLog )
            {
                setErrorLog( errLog );
            }
            console.log("reports = ", reports);

            setProgressInfo([{ message: "", currValue: 0 }]);
            setIsFetching(false);
            setShowTable(true);
            setShowMap(true);
            // }
        };

    */

/*
        const handleSearchAtLocation = async (event) => {
            event.preventDefault();
            setShowMap(false);
            setShowTable(false);
            setShowContent(true);
            if (neighborhoodCoordinates) {
                if (
                    "latitude" in neighborhoodCoordinates &&
                    "longitude" in neighborhoodCoordinates
                ) {
                    let latitude = neighborhoodCoordinates.latitude;
                    let longitude = neighborhoodCoordinates.longitude;

                    console.log(
                        "handleSearchAtLocation triggered:: ",
                        latitude,
                        longitude,
                    );
                    if (!latitude) {
                        console.log(
                            "handleSearchAtLocation(): ",
                            "Err: Undefined coordinates",
                        );
                        return;
                    } // setCategoryIsInvalid(true);
                    if (!longitude) {
                        console.log(
                            "handleSearchAtLocation(): ",
                            "Err: Undefined coordinates",
                        );
                        return;
                    } // setForceIsInvalid(true);

                    // Create the query string so the downloadable file has the right filename.
                    setQueryString(
                        `SearchByLocation_${[latitude, longitude].join("_")}`,
                    );

                    // Clear the table.
                    setTimeout(() => {
                        setCrimeReports([]);
                    }, 1000);

                    setIsFetching(true);
                    setTimeout(() => {
                        getCrimeReportsAtLocation(latitude, longitude)
                            .then((crimeReports) => {
                                if (crimeReports) {
                                    setCrimeReports(crimeReports);
                                }
                            })
                            .then(() => {
                                console.log(crimeReports);
                            })
                            .then(() => setIsFetching(false))
                            // .then(() => scrollBottom())
                            .catch((error) => setError(error));
                    }, 1000);
                    setProgressInfo([{ message: "", currValue: 0 }]);
                    setShowTable(true);
                    setShowMap(true);
                }
            }
        };

        const handleSearchByLocation = async (event) => {
            event.preventDefault();
            setShowMap(false);
            setShowTable(false);
            setShowContent(true);
            if (date && neighborhoodCoordinates) {
                let latitude;
                let longitude;
                let location_id;
                if (
                    "latitude" in neighborhoodCoordinates &&
                    "longitude" in neighborhoodCoordinates
                ) {
                    latitude = neighborhoodCoordinates.latitude;
                    longitude = neighborhoodCoordinates.longitude;

                    console.log(
                        "handleSearchByLocation triggered:: ",
                        latitude,
                        longitude,
                    );

                    if (!latitude) {
                        console.log(
                            "handleSearchByLocation(): ",
                            "Err: Undefined coordinates",
                        );
                        return;
                    } // setCategoryIsInvalid(true);
                    if (!longitude) {
                        console.log(
                            "handleSearchByLocation(): ",
                            "Err: Undefined coordinates",
                        );
                        return;
                    } // setForceIsInvalid(true);

                    // Create the query string so the downloadable file has the right filename.
                    setQueryString(
                        `SearchByLocation_${[latitude, longitude].join("_")}`,
                    );

                    // Clear the table.
                    setTimeout(() => {
                        setCrimeReports([]);
                    }, 1000);

                    setIsFetching(true);
                    setTimeout(() => {
                        getCrimeReportsByLocation(date, latitude, longitude)
                            .then((crimeReports) => {
                                if (crimeReports) {
                                    setCrimeReports(crimeReports);
                                }
                            })
                            .then(() => {
                                console.log(
                                    `getCrimeReportsByLocation(${date}, ${latitude}, ${longitude}) = `,
                                    crimeReports,
                                );
                            })
                            .then(() => setIsFetching(false))
                            // .then(() => scrollBottom())
                            .catch((error) => setError(error));
                    }, 1000);
                    setProgressInfo([{ message: "", currValue: 0 }]);
                    setShowTable(true);
                    setShowMap(true);
                }
            }
        };

    */

/*
        // Handle updates when the ForceNeighborhoods list is changed.
        useEffect(() => {
            if (forceNeighborhoods) {
                
                setForceNeighborhood([forceNeighborhoods[0].id]);
            } else {
                setForceNeighborhood([
                    {
                        id: "Not set",
                        name: "Not Set",
                    },
                ]);
            }
        }, [forceNeighborhoods]);

        // Handle updates when the selected ForceNeighborhood is changed.
        useEffect(() => {
            if (
                forceNeighborhood === undefined ||
                forceNeighborhood.id === undefined
            ) {
                return;
            }
            // setIsLoading(false);
            if (force && forceNeighborhood) {
                Promise.all([
                    getNeighbourhoodInformation(force, forceNeighborhood.id),
                ])
                    .then(([forceNeighborhoodData]) => {
                        setForceNeighborhoodData(forceNeighborhoodData);
                    })
                    .catch((error) => setError(error))
                    .then(() => setIsLoading(false));
            }
        }, [forceNeighborhood]);

        // Update lat and long coordinates based on neighborhood chosen.
        useEffect(() => {
            if (valIsValid(forceNeighborhoodData)) {
                let dataTemp = {
                    id: "",
                    latitude: 0,
                    longitude: 0,
                };
                if ("centre" in forceNeighborhoodData) {
                    if (
                        "latitude" in forceNeighborhoodData.centre &&
                        "longitude" in forceNeighborhoodData.centre
                    ) {
                        dataTemp.latitude = forceNeighborhoodData.centre.latitude;
                        dataTemp.longitude = forceNeighborhoodData.centre.longitude;
                    }
                }
                if ("id" in forceNeighborhoodData) {
                    dataTemp.id = forceNeighborhoodData.id;
                }
                console.log("Setting neighborhood coordinates = ", dataTemp);
                setNeighborhoodCoordinates(dataTemp);
            }
        }, [forceNeighborhoodData]);

        // Update lat and long coordinates based on neighborhood chosen.
        useEffect(() => {
            if (valIsValid(neighborhoodCoordinates)) {
                if (
                    "id" in neighborhoodCoordinates &&
                    "latitude" in neighborhoodCoordinates &&
                    "longitude" in neighborhoodCoordinates
                )
                {
                    setElementValueById("latitude", neighborhoodCoordinates.latitude);
                    setElementValueById("longitude", neighborhoodCoordinates.longitude);
                    setElementValueById("location_id", neighborhoodCoordinates.id);
                }
            }
        }, [neighborhoodCoordinates]);

        // Mainly used for debug, use this to update the text outputs for all the changes in state.
        useEffect(() => {
            debugPrintState();
            if (force !== undefined) {
                if (valIsValid(force)) {
                    // , String ) ) {
                    const forceElement =
                        document.getElementById("forceTextDisplay");
                    if (forceElement) {
                        forceElement.value = force;
                    }
                }
            }
            if (category !== undefined) {
                if (valIsValid(category)) {
                    const categoryElement = document.getElementById(
                        "categoryTextDisplay",
                    );
                    if (categoryElement) {
                        categoryElement.value = category;
                    }
                }
            }
            if (date !== undefined) {
                if (valIsValid(date)) {
                    const dateElement = document.getElementById("dateTextDisplay");
                    if (dateElement) {
                        dateElement.value = date;
                    }
                }
            }
            if (forceNeighborhoods !== undefined) {
                if (valIsValid(forceNeighborhoods)) {
                    const forceNeighborhoodsElement = document.getElementById(
                        "forceNeighborhoodsTextDisplay",
                    );
                    if (forceNeighborhoodsElement) {
                        forceNeighborhoodsElement.value =
                            // JSON.stringify(forceNeighborhoods);
                            flatMapObjText(forceNeighborhoods);
                    }
                }
            }
            if (forceNeighborhood !== undefined) {
                if (valIsValid(forceNeighborhood)) {
                    const forceNeighborhoodElement = document.getElementById(
                        "forceNeighborhoodTextDisplay",
                    );
                    if (forceNeighborhoodElement) {
                        forceNeighborhoodElement.value =
                            // JSON.stringify(forceNeighborhood);
                            flatMapObjText(forceNeighborhood);
                    }
                }
            }
            if (forceNeighborhoodData !== undefined) {
                if (valIsValid(forceNeighborhoodData)) {
                    const forceNeighborhoodDataElement = document.getElementById(
                        "forceNeighborhoodDataTextDisplay",
                    );
                    if (forceNeighborhoodDataElement) {
                        forceNeighborhoodDataElement.value =
                            // JSON.stringify( forceNeighborhoodData );
                            flatMapObjText(forceNeighborhoodData);
                    }
                    if ("centre" in forceNeighborhoodData) {
                        if ("latitude" in forceNeighborhoodData.centre) {
                            const latitudeElement = document.getElementById(
                                "latitudeTextDisplay",
                            );
                            if (latitudeElement) {
                                latitudeElement.value =
                                    forceNeighborhoodData.centre.latitude;
                            }
                            // latitudeElement.value =
                            //     (forceNeighborhood !== undefined)
                            //         ? (forceNeighborhoodData !== undefined && forceNeighborhoodData != null)
                            //             ? (forceNeighborhoodData.centre.latitude !== undefined)
                            //                 ? forceNeighborhoodData.centre.latitude
                            //                 : 0
                            //             : 0
                            //         : 0;
                        }
                        if ("longitude" in forceNeighborhoodData.centre) {
                            const longitudeElement = document.getElementById(
                                "longitudeTextDisplay",
                            );
                            if (longitudeElement) {
                                longitudeElement.value =
                                    forceNeighborhoodData.centre.longitude;
                            }
                        }
                    }
                }
            }
        }, [
            force,
            date,
            category,
            forceNeighborhoods,
            forceNeighborhood,
            forceNeighborhoodData,
        ]);
    */

/*

        // Handles searching for multiple (or all) neighborhoods.
        // Due to the nature of the relational database's schema (see: <insert photo of a dumpster fire here>),
        // we first have to call the API for the location coordinates for each and every neighborhood listed for the
        // selected force.
        const handleSequentialSearchByLocation = async (event) => {
            event.preventDefault();
            setShowMap(false);
            setShowTable(false);
            setShowContent(true);
            // console.log(
            //     "handleSequentialSearchByLocation triggered :: ",
            //     force,
            //     category,
            //     forceNeighborhoods,
            //     "event values: ",
            //     event.values,
            // );
            if (!force) return setForceIsInvalid(true);

            setCategoryIsInvalid(false);
            setForceIsInvalid(false);
            setIsFetching(true);

            // Clear the table.
            setTimeout(() => {
                setCrimeReports([]);
            }, 1000);

            setQueryString(`SearchAllLocations_${force}`);
            let neighborhoodsArray = [];
            // Create the query string so the downloadable file has the right filename.
            // Get only the date keys in the YYYY-MM format, not their labels.
            neighborhoodsArray = forceNeighborhoods.filter((neighborhood) => {
                return neighborhood.id !== undefined;
            });
            console.log(
                "handleSequentialSearchByLocation with specific neighborhoods array: ",
                force,
                category,
                neighborhoodsArray,
            );

            let neighborhoodDataArray = await getNeighbourhoodDataMulti(
                force,
                neighborhoodsArray,
            );

            // Update the fetch loader message
            setProgressInfo([
                {
                    message: "Fetching crime reports data for coordinates...",
                    currValue: 0,
                },
            ]);
            let numCalls = neighborhoodDataArray.length;
            let currCall = 0;
            let reports = [];
            // console.log("locations = ", neighborhoodDataArray);
            for (const neighborhoodData of neighborhoodDataArray) {
                // console.log( "neighborhoodData = ", neighborhoodData );

                setProgressInfo([
                    {
                        message: `Fetching reports for location ${currCall} of ${numCalls}`,
                        currValue: currCall,
                        endValue: numCalls,
                    },
                ]);
                currCall++;
                if (neighborhoodData) {
                    if ("centre" in neighborhoodData) {
                        if (
                            "latitude" in neighborhoodData.centre &&
                            "longitude" in neighborhoodData.centre
                        ) {
                            let res = await getCrimeReportsAtLocationMulti(
                                neighborhoodData.centre.latitude,
                                neighborhoodData.centre.longitude,
                            );
                            // reports.concat( res );
                            if (res) {
                                // let compiled = Object.assign(
                                //     res,
                                //     { force_id: force },
                                //     neighborhoodData,
                                // );
                                let compiled = SpliceObjArray(res, {
                                    force_id: force,
                                    neighborhood: neighborhoodData.name,
                                });
                                reports = [...reports, ...compiled];
                                console.log(
                                    "\n\nneighborhoodData = ",
                                    neighborhoodData,
                                    "\n\nres = ",
                                    res,
                                    "\n\nreports = ",
                                    reports,
                                    "\n\ncompiled = ",
                                    compiled,
                                    // "\n\nsanitized = ",
                                    // sanitizeObjArray( compiled )
                                    // "\ntime = ",
                                    // new Date(),
                                );
                            } else {
                                console.error("RES was invalid :: ", res);
                            }
                        } else {
                            console.error(
                                "neighborhoodData = ",
                                neighborhoodData,
                                " didn't have coordinates data",
                            );
                        }
                    } else {
                        console.error(
                            "neighborhoodData = ",
                            neighborhoodData,
                            " didn't have centre data",
                        );
                    }
                } else {
                    console.error(
                        "neighborhoodData = ",
                        neighborhoodData,
                        " was undefined.",
                    );
                }
            }
            if (reports) {
                setCrimeReports(reports);
                console.log("Setting reports: ", reports);
            }
            console.log("reports = ", reports);

            setProgressInfo([{ message: "", currValue: 0 }]);
            setIsFetching(false);
            setShowTable(true);
            setShowMap(true);
            // }
        };

    */
