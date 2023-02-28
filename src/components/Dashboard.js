import React, { useState, useEffect, useRef } from "react";
import axios, { isCancel, AxiosError } from "axios";

import {
    SanitizeObj,
    SanitizeObjArray,
    SpliceObjArray,
    flatMapObjText,
    isValid,
} from "./ObjectUtils/ObjectUtils.js";

import {
    getCrimesStreetsDates,
    getLastUpdated,
    getCategories,
    getForces,
    getForceInfo,
    getForceOfficers,
    getNeighbourhoodTeam,
    getCrimeReports,
    getCrimeReportsMulti,
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
} from "../api";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import DashboardContent from "./DashboardContent";
import Header from "./Header";
import SidePanel from "./SidePanel/SidePanel.js";

const Dashboard = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    // State for query input data.
    const [categories, setCategories] = useState([]);
    const [forces, setForces] = useState([]);
    const [forceNeighborhoods, setForceNeighborhoods] = useState([]);
    const [dates, setDates] = useState([]);
    const [category, setCategory] = useState("");
    const [force, setForce] = useState("");
    const [forceNeighborhood, setForceNeighborhood] = useState([
        {
            id: "Not set",
            name: "Not Set",
        },
    ]);
    const [forceNeighborhoodData, setForceNeighborhoodData] = useState({});
    const [date, setDate] = useState([`2022-9`]);
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

        dates.unshift({
            key: "all_dates",
            value: "All Dates",
        });
        // dates.splice(0, 3);
        return dates;
    };

    const debugPrintState = () => {
        console.log(
            "\nquery = ",
            query,
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
        );
    };

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
                })
                .catch((error) => setError(error))
                .then(() => setIsLoading(false));
        }
    }, [force]);

    // Handle updates when the ForceNeighborhoods list is changed.
    useEffect(() => {
        if (forceNeighborhoods) {
            setForceNeighborhood(forceNeighborhoods[0]);
        } else {
            setForceNeighborhood({
                id: "Not set",
                name: "Not Set",
            });
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
        if (getIsValid(forceNeighborhoodData)) {
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
        if (getIsValid(neighborhoodCoordinates)) {
            if (
                "id" in neighborhoodCoordinates &&
                "latitude" in neighborhoodCoordinates &&
                "longitude" in neighborhoodCoordinates
            ) {
                const latitudeElement = document.getElementById("latitude");
                if (latitudeElement) {
                    latitudeElement.value = neighborhoodCoordinates.latitude;
                }
                const longitudeElement = document.getElementById("longitude");
                if (longitudeElement) {
                    longitudeElement.value = neighborhoodCoordinates.longitude;
                }
                const locationIDElement =
                    document.getElementById("location_id");
                if (longitudeElement) {
                    locationIDElement.value = neighborhoodCoordinates.id;
                }
            }
        }
    }, [neighborhoodCoordinates]);

    // Mainly used for debug, use this to update the text outputs for all the changes in state.
    useEffect(() => {
        debugPrintState();
        if (force !== undefined) {
            if (getIsValid(force)) {
                // , String ) ) {
                const forceElement =
                    document.getElementById("forceTextDisplay");
                if (forceElement) {
                    forceElement.value = force;
                }
            }
        }
        if (category !== undefined) {
            if (getIsValid(category)) {
                const categoryElement = document.getElementById(
                    "categoryTextDisplay",
                );
                if (categoryElement) {
                    categoryElement.value = category;
                }
            }
        }
        if (date !== undefined) {
            if (getIsValid(date)) {
                const dateElement = document.getElementById("dateTextDisplay");
                if (dateElement) {
                    dateElement.value = date;
                }
            }
        }
        if (forceNeighborhoods !== undefined) {
            if (getIsValid(forceNeighborhoods)) {
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
            if (getIsValid(forceNeighborhood)) {
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
            if (getIsValid(forceNeighborhoodData)) {
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

    function getIsValid(value) {
        // console.log( "getIsValid:", value, typeof value );
        if (value !== undefined) {
            if (value !== null) {
                // if ( value instanceof expectedType )
                if (value) {
                    return true;
                }
            }
        }
        return false;
    }

    // Handles searching for multiple (or all) dates. Will later expand to allow multiple neighborhoods as well for multi-location search.
    const handleSequentialSearch = async (event) => {
        event.preventDefault();
        console.log(
            "handleSequentialSearch triggered:: ",
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
        setShowMap(false);
        setShowTable(false);
        setShowContent(true);

        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        let datesArray = [];
        if (date === "all_dates") {
            // Create the query string so the downloadable file has the right filename.
            setQueryString(
                `SearchNoLocation_${[force, category, "all-dates"].join("_")}`,
            );

            // Get only the date keys in the YYYY-MM format, not their labels.
            datesArray = dates
                .filter((dateObject) => {
                    return dateObject.key !== "all_dates";
                })
                .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
            console.log(
                "handleSequentialSearch with all_dates: ",
                dates,
                datesArray,
            );
        } else {
            // Create the query string so the downloadable file has the right filename.
            setQueryString(
                `SearchNoLocation_${[force, category, date.join("+")].join(
                    "_",
                )}`,
            );

            // Get only the date keys in the YYYY-MM format, not their labels.
            datesArray = date.map((dateObject) => dateObject.key);
            console.log(
                "handleSequentialSearch with specific dates array: ",
                date,
                dates,
                datesArray,
            );
        }

        let reports = [];
        let numCalls = datesArray.length;
        let currCall = 0;
        for (const month of datesArray) {
            let res = await getCrimeReportsMulti(category, force, month);

            setProgressInfo([{
                message: `Fetching crime reports for month ${currCall} of ${numCalls}`,
                currValue: currCall,
                endValue: numCalls,
            }]);
            currCall++;
            // reports.concat( res );
            if (res) {
                reports = [...reports, ...res];
            }
            console.log(
                "res = ",
                res,
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
        console.log("reports = ", reports);

        setShowTable(true);
        setProgressInfo([{ message: "", currValue: 0 }]);
        setIsFetching(false);
        // }
    };

    // }, [forceNeighborhood]);
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
            handleSequentialSearch(event);
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

    const getNeighbourhoodDataMulti = async (force, neighborhoods) => {
        console.log(`getNeighbourhoodDataMulti :: `, force, neighborhoods);
        let locations = [];
        let numCalls = neighborhoods.length;
        let currCall = 0;
        for (const neighborhood of neighborhoods) {
            // Update the fetch loader message
            setProgressInfo([{
                message: `Fetching coordinates for location ${currCall} of ${numCalls}`,
                currValue: currCall,
                endValue: numCalls,
            }]);
            currCall++;
            if (neighborhood) {
                if ("id" in neighborhood) {
                    let res = await getNeighbourhoodInformation(
                        force,
                        neighborhood.id,
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
                                    neighborhood,
                                );
                                locations.push(res); // .centre);
                                // console.log("RES was valid :: ", res);
                            }
                        } else {
                            console.error("RES was invalid :: ", res);
                        }
                        // locations = [...locations, ...res];
                    }
                    console.log(`getNeighbourhoodDataMulti() :: `,
                        "res = ",
                        res,
                        "locations = ",
                        locations,
                        ", time = ",
                        new Date(),
                    );
                }
            }
        }
        console.log("getNeighbourhoodDataMulti() :: post-execution :: locations = ", locations);

        // return locations.map( ( loc, index ) =>
        // {
        //     if ( loc )
        //     {
        //         return loc.centre;
        //     }
        //     else { return ''; }
        // } );
        return locations;
    };

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
        setProgressInfo([{
            message: "Fetching crime reports data for coordinates...",
            currValue: 0,
        }]);
        let numCalls = neighborhoodDataArray.length;
        let currCall = 0;
        let reports = [];
        // console.log("locations = ", neighborhoodDataArray);
        for (const neighborhoodData of neighborhoodDataArray) {
            // console.log( "neighborhoodData = ", neighborhoodData );

            setProgressInfo([{
                message: `Fetching reports for location ${currCall} of ${numCalls}`,
                currValue: currCall,
                endValue: numCalls,
            }]);
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

    // Handles searching for multiple (or all) neighborhoods.
    // Due to the nature of the relational database's schema (see: <insert photo of a dumpster fire here>),
    // we first have to call the API for the location coordinates for each and every neighborhood listed for the
    // selected force.
    const handleSequentialSearchAllLocationsAllDates = async (event) => {
        event.preventDefault();
        setShowMap(false);
        setShowTable(false);
        setIsFetching(true);
        setShowContent(true);
        // console.log(
        //     "handleSequentialSearchAllLocationsAllDates triggered :: ",
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

        setQueryString( `SearchAllLocationsAllDates_${ force }` );
        
        // Construct the array of neighborhood ids/coordinate pairs.
        let neighborhoodsArray = [];
        // Create the query string so the downloadable file has the right filename.
        // Get only the date keys in the YYYY-MM format, not their labels.
        neighborhoodsArray = forceNeighborhoods.filter((neighborhood) => {
            return neighborhood.id !== undefined && neighborhood.id !== "all_neighborhoods";
        });

        let neighborhoodDataArray = await getNeighbourhoodDataMulti(
            force,
            neighborhoodsArray,
        );

        // Construct the array of available dates.
        
        let datesArray = [];
        if (date === "all_dates") {
            // Get only the date keys in the YYYY-MM format, not their labels.
            datesArray = dates
                .filter((dateObject) => {
                    return dateObject.key !== "all_dates";
                })
                .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
        } else {
            // Get only the date keys in the YYYY-MM format, not their labels.
            if ( Array.isArray( date ) )
            {
                datesArray = date
                    .filter((dateObject) => {
                        return dateObject.key !== undefined && dateObject.key !== "all_dates";
                    })
                    .map((dateObject) => dateObject.key);
            }
            else
            {
                datesArray = [date.toString()];
            }
        }

        console.log(
            "handleSequentialSearchAllLocationsAllDates with neighborhoods array: ",
            force,
            category,
            neighborhoodsArray, " and dates array: ", datesArray
        );

        // Update the fetch loader message
        let numNeighborhoods = neighborhoodDataArray.length;
        let currNeighborhood = 0;
        
        let numMonths = datesArray.length;
        let successes = 0;
        let failures = 0;
        let reports = [];
        // console.log("locations = ", neighborhoodDataArray);
        for ( const neighborhoodData of neighborhoodDataArray )
        {
            // Call for each neighborhood.
            // console.log( "neighborhoodData = ", neighborhoodData );

            currNeighborhood++;
            if (neighborhoodData) {
                if ("centre" in neighborhoodData) {
                    if (
                        "latitude" in neighborhoodData.centre &&
                        "longitude" in neighborhoodData.centre
                    )
                    {
                        let currMonth = 0;
                        // Call for each date.
                        for ( const month of datesArray )
                        {
                            setProgressInfo([
                                {
                                    id: "neighborhoodsProgress",
                                    message: `Fetching reports for location ${currNeighborhood} of ${numNeighborhoods}`,
                                    currValue: currNeighborhood,
                                    endValue: numNeighborhoods,
                                    success: successes,
                                    failure: failures,
                                },
                                {
                                    id: "monthsProgress",
                                    message: `Fetching reports for month ${currMonth} of ${numMonths}`,
                                    currValue: currMonth,
                                    endValue: numMonths,
                                    success: successes,
                                    failure: failures,
                                },
                            ]);
                            currMonth++;
                            // console.log( "CURRMONTH = ", currMonth );
                            let res = await getCrimeReportsByLocation(
                                month,
                                neighborhoodData.centre.latitude,
                                neighborhoodData.centre.longitude,
                            );
                            // console.log(
                            //     `handleSequentialSearchAllLocationsAllDates :: Calling getCrimeReportsByLocation( ${month}, ${neighborhoodData.centre.latitude}, ${neighborhoodData.centre.longitude} ) with RES = `, res
                            // );
                            // reports.concat( res );
                            if ( res )
                            {
                                if ( res === "ERR: INVALID/UNDEFINED INPUT" )
                                {
                                    failures++;
                                    // console.error( `handleSequentialSearchAllLocationsAllDates :: Calling getCrimeReportsByLocation( ${month}, ${neighborhoodData.centre.latitude}, ${neighborhoodData.centre.longitude} ) resulted in ERR: INVALID/UNDEFINED INPUT`
                                    // );
                                } else
                                {
                                    // let compiled = Object.assign(
                                    //     res,
                                    //     { force_id: force },
                                    //     neighborhoodData,
                                    // );
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
                                console.error("RES was invalid :: ", res);
                            }
                        }
                    } else {
                        failures++;
                        console.error(
                            "neighborhoodData = ",
                            neighborhoodData,
                            " didn't have coordinates data",
                        );
                    }
                } else {
                    failures++;
                    console.error(
                        "neighborhoodData = ",
                        neighborhoodData,
                        " didn't have centre data",
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
        console.log("reports = ", reports);

        setProgressInfo([{ message: "", currValue: 0 }]);
        setIsFetching(false);
        setShowTable(true);
        setShowMap(true);
        // }
    };

    useEffect(() => {
        console.log("isFetching = ", isFetching);
    }, [isFetching]);

    useEffect(() => {
        console.log("showContent = ", showContent);
    }, [showContent]);

    useEffect(() => {
        console.log("showTable = ", showTable);
    }, [showTable]);

    useEffect(() => {
        console.log("showMap = ", showMap);
    }, [showMap]);

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

    // if (isLoading) return <Loader progressInfo={progressInfo} />;
    if (error) return `An error has occurred: ${error.message}`;

    const toggleSidebar = () => {
        if (showSidebar) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
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
                    handleSearch={handleSearch}
                    handleSearchAtLocation={handleSearchAtLocation}
                    handleSearchByLocation={handleSearchByLocation}
                    handleSequentialSearch={handleSequentialSearch}
                    handleSequentialSearchByLocation={
                        handleSequentialSearchByLocation
                    }
                    handleSequentialSearchAllLocationsAllDates={
                        handleSequentialSearchAllLocationsAllDates
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
                {showContent && (
                    <>
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
                            theme={theme}
                            menu={menu}
                            setSidePanelData={
                                setSidePanelData
                            }></DashboardContent>
                        <SidePanel
                            className={`${showSidePanel ? "" : "hidden"}`}
                            isFetching={isFetching}
                            show={showSidePanel}
                            setShow={setShowSidePanel}
                            panelData={sidePanelData}
                            panelDataID={sidePanelID}></SidePanel>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
