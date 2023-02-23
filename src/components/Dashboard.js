import React, { useState, useEffect, useRef } from "react";
import axios, { isCancel, AxiosError } from "axios";

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

const Dashboard = () => {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // State for query input data.
    const [categories, setCategories] = useState([]);
    const [forces, setForces] = useState([]);
    const [forceNeighborhoods, setForceNeighborhoods] = useState([]);
    const [dates, setDates] = useState([]);
    const [category, setCategory] = useState("");
    const [force, setForce] = useState("");
    const [forceNeighborhood, setForceNeighborhood] = useState({
        id: "Not set",
        name: "Not Set",
    });
    const [forceNeighborhoodData, setForceNeighborhoodData] = useState({});
    const [date, setDate] = useState([`2022-9`]);
    const [neighborhoodId, setNeighborhoodId] = useState("Not Set");
    const [neighborhoodCoordinates, setNeighborhoodCoordinates] = useState({
        latitude: 0.0,
        longitude: 0.0,
    });
    const [queryString, setQueryString] = useState(""); // String for the table downloader to use for its filename. It has to be set all the way up here!

    // State for checking if query input is valid.
    const [categoryIsInvalid, setCategoryIsInvalid] = useState(false);
    const [forceIsInvalid, setForceIsInvalid] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [crimeReports, setCrimeReports] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [error, setError] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const bottomRef = useRef();

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

        const startYear = 2022;
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
            setForceNeighborhood({});
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
            if ("centre" in forceNeighborhoodData) {
                if (
                    "latitude" in forceNeighborhoodData.centre &&
                    "longitude" in forceNeighborhoodData.centre
                ) {
                    setNeighborhoodCoordinates({
                        latitude: forceNeighborhoodData.centre.latitude,
                        longitude: forceNeighborhoodData.centre.longitude,
                    });
                }
            }
        }
    }, [forceNeighborhoodData]);

    // Update lat and long coordinates based on neighborhood chosen.
    useEffect(() => {
        if (getIsValid(neighborhoodCoordinates)) {
            if (
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
            }
        }
    }, [neighborhoodCoordinates]);

    // This flattens an object into HTML elements.
    const flatMapObjText = (obj) => {
        // console.log("flatMapObjText(): ", obj);
        return Object.entries(obj)
            .map((objProperty) => {
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    return `${flatMapObjText(objProperty[1])}`;
                } else {
                    return `${objProperty[0]}: ${objProperty[1]}`;
                }
            })
            .join("");
    };

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
        setShowTable(true);

        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        let datesArray = [];
        if ( date === "all_dates" )
        {
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
        }
        else
        {
            // Create the query string so the downloadable file has the right filename.
            setQueryString(
                `SearchNoLocation_${[force, category, date.join("+")].join("_")}`,
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
            for (const month of datesArray) {
                let res = await getCrimeReportsMulti(category, force, month);
                
                // reports.concat( res );
                if ( res )
                {
                    reports = [ ...reports, ...res ];
                }
                console.log( "res = ", res, "reports = ", reports, ", time = ", new Date() );
            }
            if (reports) {
                setCrimeReports( reports );
                console.log("Setting reports: ", reports);
            }
            console.log( "reports = ", reports );
            
            setIsFetching(false);
        // }
    };

    // }, [forceNeighborhood]);
    const handleSearch = (event) => {
        event.preventDefault();
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
        setShowTable(true);

        // Create the query string so the downloadable file has the right filename.
        setQueryString(`SearchNoLocation_${[force, category, date].join("_")}`);
        console.log("queryString = ", queryString);
        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        if ( date === "all_dates" )
        {
            handleSequentialSearch(event);
            return;
            //let datesArray = dates.map((dateObject) => {
            //    return dateObject.key;
            //}); // dates.splice( 1, dates.length );
            //let reports = [];
            //console.log(
            //    "handleSearch with all_dates: ",
            //    dates,
            //    datesArray,
            //    reports,
            //);
//
            //let promises = datesArray.map((value) => {
            //    console.log(
            //        "Creating promise for getCrimeReports( ",
            //        category,
            //        force,
            //        value,
            //        ")",
            //    );
            //    return getCrimeReports(category, force, value).then(
            //        (response) => {
            //            console.log(
            //                "Response for getCrimeReports( ",
            //                category,
            //                force,
            //                value,
            //                "): ",
            //                response,
            //            );
            //            reports.push(response.json());
            //            return response.json();
            //        },
            //    );
            //});
            //
            //console.log("Promise.all(promises): ", promises, reports);
            //
            //Promise.all(promises).then((results) => {
            //    console.log(
            //        "Promise.all(promises) response: ",
            //        results,
            //        ...results,
            //    );
            //    setCrimeReports(...results);
            //});
            //setIsFetching(false);
        } else {
            setTimeout(() => {
                getCrimeReports(category, force, date)
                    .then((crimeReports) => {
                        if (crimeReports) {
                            setCrimeReports(crimeReports);
                        }
                    })
                    .then(() => setIsFetching(false))
                    .then(() => scrollBottom())
                    .catch((error) => setError(error));
            }, 1000);
        }
    };

    const handleSearchByLocation = (event) => {
        event.preventDefault();
        if (neighborhoodCoordinates) {
            if (
                "latitude" in neighborhoodCoordinates &&
                "longitude" in neighborhoodCoordinates
            ) {
                let latitude = neighborhoodCoordinates.latitude;
                let longitude = neighborhoodCoordinates.longitude;

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
                setShowTable(true);
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
                        .then(() => scrollBottom())
                        .catch((error) => setError(error));
                }, 1000);
            }
        }
    };
    const scrollBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
    };

    if (isLoading) return <Loader />;
    if (error) return `An error has occurred: ${error.message}`;

    const toggleSidebar = () => {
        if (showSidebar) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
    };
    return (
        <div className="page-container">
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
                    handleSearch={handleSearch} // Pass search function
                    handleSearchByLocation={handleSearchByLocation}
                    handleSequentialSearch={handleSequentialSearch}
                    // onSetForceGetNeighborhoods={onSetForceGetNeighborhoods} // Pass setting force neighbourhoods function (triggered after a force is selected)
                    // onSetForceNeighborhoodGetData={onSetForceNeighborhoodGetData}
                    categoryIsInvalid={categoryIsInvalid}
                    forceIsInvalid={forceIsInvalid}
                    setCategoryIsInvalid={setCategoryIsInvalid}
                    setForceIsInvalid={setForceIsInvalid}
                    isFetching={isFetching}
                    showSidebar={showSidebar}
                />
            }
            <div className="page-content">
                <Header toggleSidebar={toggleSidebar} />
                {showTable && (
                    <DashboardContent
                        isFetching={isFetching}
                        crimeReports={crimeReports}
                        queryString={queryString}
                        bottomRef={bottomRef}
                        showTable={showTable}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
