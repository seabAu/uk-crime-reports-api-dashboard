import React, { useState, useEffect, useRef } from "react";


import {
    getCategories,
    getForces,
    getCrimeReports,
    getCrimeReportsAtLocation,
    getStopReports,
    getStopReportsAtLocation,
    getNeighbourhoodList,
    getNeighbourhoodInformation,
    getNeighbourhoodCoordinates,
    getNeighbourhoodFromCoordinates,
} from "../api";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import DashboardContent from "./DashboardContent";
import Header from "./Header";

const Dashboard = () =>
{
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // State for query input data.
    const [categories, setCategories] = useState([]);
    const [forces, setForces] = useState([]);
    const [ forceNeighborhoods, setForceNeighborhoods ] = useState( [] );
    const [ dates, setDates ] = useState( [] );
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

    // State for checking if query input is valid.
    const [categoryIsInvalid, setCategoryIsInvalid] = useState(false);
    const [forceIsInvalid, setForceIsInvalid] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [crimeReports, setCrimeReports] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [error, setError] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const bottomRef = useRef();
    let queryString = ""; // String for the table downloader to use for its filename. It has to be set all the way up here!

    const generateDateOptions = () =>
    {
        const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
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
        const startMonth = 1;
        const start = new Date(startYear, startMonth);
        const now = new Date();
        const currMonth = now.getMonth();
        const currYear = now.getFullYear();

        var numMonths = (now.getTime() - start.getTime()) / 1000;
        numMonths /= 60 * 60 * 24 * 7 * 4;
        numMonths = Math.abs(Math.round(numMonths));
        // console.log( currMonth, currYear, numMonths, numMonths % 12 );

        const dates = [];
        for (let i = 0; i < years.length; i++) {
            for (let j = years[i] === 2017 ? 8 : 0; j < months.length; j++) {
                dates.unshift({
                    key: `${years[i]}-${j + 1}`,
                    value: `${months[j]} ${years[i]}`,
                });
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
                setForces( forces );
                setDates( generateDateOptions() );
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
                    latitudeElement.value =
                        neighborhoodCoordinates.latitude;
                }
                const longitudeElement =
                    document.getElementById("longitude");
                if (longitudeElement) {
                    longitudeElement.value =
                        neighborhoodCoordinates.longitude;
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
        setShowTable( true );
        
        // Create the query string so the downloadable file has the right filename.
        queryString = [ force, category, date ].join( '_' );

        // Clear the table.
        setTimeout( () =>
        {
            setCrimeReports( [] );
        }, 1000 );

        if ( date === "all_dates" )
        {
            let datesArray = dates.map( ( dateObject ) =>
            {
                return dateObject.key;
            }); // dates.splice( 1, dates.length );
            let reports = [];
            console.log(
                "handleSearch with all_dates: ",
                dates, datesArray,
                reports,
            );

        Promise.all([getCategories(), getForces()])
            .then(([categories, forces]) => {
                setCategories(categories);
                setForces(forces);
                setDates(generateDateOptions());
                setIsLoading(false);
            })
            .catch((error) => setError(error))
                .then( () => setIsLoading( false ) );
            
            let promises = datesArray.map( ( value ) =>
            {
                console.log( "Creating promise for getCrimeReports( ", category, force, value, ")" );
                return getCrimeReports( category, force, value ).then( ( response ) =>
                {
                    console.log( "Response for getCrimeReports( ", category, force, value, "): ", response );
                    reports.push( response.json() );
                    return response.json();
                });
            } );

            console.log("Promise.all(promises): ", promises, reports);
            
            Promise.all( promises ).then( results =>
            {
                console.log( "Promise.all(promises) response: ", results, ...results );
                setCrimeReports( ...results );
            })
            // datesArray.forEach( ( value, index ) =>
            // {
            //     setTimeout(() => {
            //         getCrimeReports( category, force, value )
            //             .then( ( reports ) =>
            //             {
            //                 if (reports) {
            //                     setCrimeReports([...crimeReports, ...reports]);
            //                 }
            //             })
            //             .catch(
            //             (error) => setError(error),
            //         );
            //     }, 1000);
            // });
            setIsFetching( false );
        }
        else
        {
            
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

        // setTimeout(() => {
        //     getCrimeReports(category, force, date)
        //         .then((crimeReports) => {
        //             if (crimeReports) {
        //                 setCrimeReports(crimeReports);
        //             }
        //         })
        //         .then(() => setIsFetching(false))
        //         .then(() => scrollBottom())
        //         .catch((error) => setError(error));
        // }, 1000);
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
                queryString = [ force, category, date ].join( "_" );
                
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
                    setQuery={ setQuery }
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

/*
    const handleSearchByLocation2 = (event) => {
        event.preventDefault();
        if (forceNeighborhoodData) {
            if ("centre" in forceNeighborhoodData) {
                if (
                    "latitude" in forceNeighborhoodData.centre &&
                    "longitude" in forceNeighborhoodData.centre
                ) {
                    let latitude = forceNeighborhoodData.centre.latitude;
                    let longitude = forceNeighborhoodData.centre.longitude;

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

                    setCategoryIsInvalid(false);
                    setForceIsInvalid(false);
                    setIsFetching(true);
                    setShowTable(true);

                    setTimeout(() => {
                        getCrimeReportsAtLocation(latitude, longitude)
                            .then((crimeReports) =>
                                setCrimeReports(crimeReports),
                            )
                            .then(() => setIsFetching(false))
                            .then(() => scrollBottom())
                            .catch((error) => setError(error));
                    }, 1000);
                }
            }
        }
    };

    // This flattens an object into HTML elements.
    const flatMapObj = (obj, elementWrap = "") => {
        let wrapBefore = "";
        let wrapAfter = "";
        if (elementWrap) {
            wrapBefore = `<${elementWrap}>`;
            wrapAfter = `</${elementWrap}>`;
        }
        return Object.entries(obj)
            .map((objProperty) => {
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    return `${wrapBefore}${flatMapObj(
                        objProperty[1],
                    )}${wrapAfter}`;
                } else {
                    return `${wrapBefore}${objProperty[0]}: ${objProperty[1]}${wrapAfter}`;
                }
            })
            .join("");
    };
*/