import React from "react";

function ObjMap ( { object, elementWrap } )
{
    console.log( "ObjMap():\n\n", object, elementWrap );
    // This flattens an object into HTML elements.
    const flatMapObj = (obj, wrap = "") => {
        let wrapBefore = "";
        let wrapAfter = "";
        if (wrap) {
            wrapBefore = `<${wrap}>`;
            wrapAfter = `</${wrap}>`;
        } else {
            wrap = "div";
        }
        console.log("flatMapObj(): ", obj, wrap);
        return Object.entries(obj)
            .map((objProperty) => {
                const wrapElement = document.createElement(`${wrap}`);
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    wrapElement.innerText = `${flatMapObj(
                        objProperty[1],
                        wrap,
                    )}`;
                    // console.log(wrapElement);
                    return wrapElement;
                    // return `${ flatMapObj( objProperty[ 1 ], ) }`;
                } else {
                    wrapElement.innerText = `${objProperty[0]}: ${objProperty[1]}`;
                    // console.log(wrapElement);
                    return wrapElement;
                    // return `${wrapBefore}${objProperty[0]}: ${objProperty[1]}${wrapAfter}`;
                }
            })
            .join("");
    };

    return (
        <div>
            {flatMapObj(object, elementWrap)}
        </div>
    );
}

export default ObjMap;

/*
    const weHaveHasAtHome = (input, search) => {
        let src = [
            "weHaveHasAtHome( [", util.val.isObject(input) ? Object.keys(input) : [input], "], [", search, "] )", ].join("");
        console.log(`${src} called`);
        // Trying a simpler method - get all keys of input, and use array.includes.
        if (util.val.isArray(search)) {
            // console.log(src, " :: search is array :: ", search);
            if (util.val.isValidArray(search, true)) {
                let results = [];
                console.log(src, " :: search is valid array :: ", search);
                search.every((str) => {
                    if (util.val.isString(str)) {
                        let result = weHaveHasAtHome(input, str);
                        results.push(result);
                        if (result === false) {
                            console.log(
                                src, " :: search is valid array :: weHaveHasAtHome( ", input, ", ", str, " ) returned FALSE. :: ", result, );
                            return false;
                        }
                        console.log(
                            src, " :: search is valid array :: weHaveHasAtHome( ", input, ", ", str, " ) returned TRUE :: ", result, );
                    }
                    return true;
                });
                // If we get here yadda yadda send true
                console.log(
                    src, " :: search = ", search, ", input = ", input, " :: after all athome tests for this search term. Results = ", results, );
                // return true;
                if (results.includes(false)) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            console.log(src, " :: search is string :: ", search);
            if (util.val.isObject(input)) {
                console.log(
                    src, " :: input is object :: ", input, search, Object.keys(input), Object.keys(input).includes(search), );
                // return Object.keys(input).includes(search);
                return input ? hasOwnProperty.call(input, search) : false;
                // if ( !Object.keys( input ).includes( search ) ) { return false; }
                // return true;
            } else if (util.val.isArray(input)) {
                let results = [];
                console.log(
                    src, " :: input is array :: ", input, ", search is object :: ", search, );
                if (util.val.isValidArray(input)) {
                    // console.log(src, " :: input is valid array :: ", input);
                    input.every((obj) => {
                        let result;
                        // console.log(src, " :: input loop :: obj = ", obj);
                        if (util.val.isObject(obj)) {
                            // console.log(
                            //     src, " :: input loop :: obj is actually an obj yuay = ", //     obj, //     ", hasathome test (", obj, ", ", search, ") = ", //     weHaveHasAtHome(obj, search), // );
                            result = weHaveHasAtHome(obj, search);
                            results.push(result);
                            if (result === false) {
                                console.log(
                                    src, " :: search = ", search, ", input obj = ", obj, " :: after athome test, hasathome test (", obj, ", ", search, ") has returned ", result, );
                                return false;
                            }
                            console.log(
                                src, " :: search = ", search, ", input obj = ", obj, " :: after athome test, hasathome test (", obj, ", ", search, ") has not returned. :: ", result, );
                        }
                        return true;
                    });
                    // If we get here yadda yadda send true
                    console.log(
                        src, " :: search = ", search, ", input = ", input, " :: after all athome tests for this search term. Results = ", results, );
                    // return true;
                    if (results.includes(false)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const has2ElectricBoogaloo = (input, search) => {
        let src = [
            "has2ElectricBoogaloo( [", util.val.isObject(input) ? Object.keys(input) : [input], "], [", search, "] )", ].join("");
        console.log(`${src} called`);
        // Trying a simpler method - get all keys of input, and use array.includes.
        if (util.val.isArray(search)) {
            // console.log(src, " :: search is array :: ", search);
            if (util.val.isValidArray(search, true)) {
                console.log(src, " :: search is valid array :: ", search);
                let results = search.every((str) => {
                    if (util.val.isString(str)) {
                        let result = has2ElectricBoogaloo(input, str);
                        results.push(result);
                        if (result === false) {
                            console.log(
                                src, " :: search is valid array :: has2ElectricBoogaloo( ", input, ", ", str, " ) returned FALSE. :: ", result, );
                            return false;
                        }
                        console.log(
                            src, " :: search is valid array :: has2ElectricBoogaloo( ", input, ", ", str, " ) returned TRUE :: ", result, );
                    }
                    return true;
                });
                // If we get here yadda yadda send true
                console.log(
                    src, " :: search = ", search, ", input = ", input, " :: after all athome tests for this search term. Results = ", results, );
                // return true;
                if (results.includes(false)) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            console.log(src, " :: search is string :: ", search);
            if (util.val.isObject(input)) {
                console.log(
                    src, " :: input is object :: ", input, search, Object.keys(input), Object.keys(input).includes(search), );
                // return Object.keys(input).includes(search);
                return input ? hasOwnProperty.call(input, search) : false;
                // if ( !Object.keys( input ).includes( search ) ) { return false; }
                // return true;
            } else if (util.val.isArray(input)) {
                console.log(
                    src, " :: input is array :: ", input, ", search is object :: ", search, );
                if (util.val.isValidArray(input)) {
                    // console.log(src, " :: input is valid array :: ", input);
                    let results = input.every((obj) => {
                        let result;
                        // console.log(src, " :: input loop :: obj = ", obj);
                        if (util.val.isObject(obj)) {
                            // console.log(
                            //     src, " :: input loop :: obj is actually an obj yuay = ", //     obj, //     ", hasathome test (", obj, ", ", search, ") = ", //     weHaveHasAtHome(obj, search), // );
                            result = has2ElectricBoogaloo(obj, search);
                            results.push(result);
                            if (result === false) {
                                console.log(
                                    src, " :: search = ", search, ", input obj = ", obj, " :: after athome test, hasathome test (", obj, ", ", search, ") has returned ", result, );
                                return false;
                            }
                            console.log(
                                src, " :: search = ", search, ", input obj = ", obj, " :: after athome test, hasathome test (", obj, ", ", search, ") has not returned. :: ", result, );
                        }
                        return true;
                    });
                    // If we get here yadda yadda send true
                    console.log(
                        src, " :: search = ", search, ", input = ", input, " :: after all athome tests for this search term. Results = ", results, );
                    // return true;
                    if (results.includes(false)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
        return false;
    };

*/

/* // Sequential fetch junk pile from Dashboard.js.

    // Example POST method implementation:
    async function getData(url = "", ) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    async function sequentialCall(force, category, datesArray) {
        // for ( let month of datesArray )
        // {
        //     console.log( "SequentialCall: Calling ", category, force, month );
        //     await getReports2(category, force, month);
        // }
        // console.log( "SequentialCall: Finished" );
        datesArray.reduce(
            (acc, curr) =>
                acc.then(() => {
                    return getReports2(force, category, curr);
                }),
            Promise.resolve(),
        );
    }

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

        // Create the query string so the downloadable file has the right filename.
        setQueryString(
            `SearchNoLocation_${[force, category, "all-dates"].join("_")}`,
        );
        console.log("queryString = ", queryString);
        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        let datesArray = [];
        if ( date === "all_dates" )
        {
            datesArray = dates
                .filter( ( dateObject ) =>
                {
                    return dateObject.key !== "all_dates";
                } )
                .map( ( dateObject ) => dateObject.key ); // dates.splice( 1, dates.length );
            console.log(
                "handleSequentialSearch with all_dates: ",
                dates,
                datesArray,
            );
        }
        else
        {
            datesArray = date.map( ( dateObject ) => dateObject.key );
            console.log(
                "handleSequentialSearch with specific dates array: ",
                date,
                dates,
                datesArray,
            );
        }

            // Promise.all([getCategories(), getForces()])
            //     .then(([categories, forces]) => {
            //         setCategories(categories);
            //         setForces(forces);
            //         setDates(generateDateOptions());
            //         setIsLoading(false);
            //     })
            //     .catch((error) => setError(error))
            //     .then(() => setIsLoading(false));
            // sequentialCall( force, category, datesArray );
            // datesArray.reduce(async (previousPromise, nextID) => {
            //     console.log(
            //         `Creating promise for getCrimeReports( ${category}, ${force}, ${nextID} ) at ${new Date()}`,
            //     );
            //
            //     const thispromise = getReports2( category, force, nextID );
            //     console.log("thispromise = ", thispromise);
            // });

            // reports.then((e) => {
            //     console.log("Sequential promises result = ", reports);
            // });

            // let promises = [];
            // for (let month of datesArray) {
            //     console.log(
            //         `Creating promise for getReports( ${category}, ${force}, ${month} ) at ${new Date()}`,
            //     );
            //     promises.push(getReports2(category, force, month));
            // }
            // Promise.all(promises).then(function (results) {
            //     console.log(results);
            // });
            let reports = [];
            for (const month of datesArray) {
                let res = await getReports( category, force, month );
                
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
            
            // let reports = [];
            // let result = datesArray.reduce( ( accumulatorPromise, nextID ) =>
            // {
            //     console.log(`Loop! getReports( ${category}, ${force}, ${nextID} ) at ${new Date()}: `, accumulatorPromise);

            //     return accumulatorPromise.then( () =>
            //     {
            //         // if ( accumulatorPromise.response )
            //         // {
            //             console.log( "accumulatorPromise.response = ", accumulatorPromise.response );
            //             reports.push(accumulatorPromise.response);
            //         // } 
            //         return methodThatReturnsAPromise(category, force, nextID);
            //     });
            // }, Promise.resolve() );
            // 
            // result.then( ( e ) =>
            // {
            //     console.log("Resolved: ", result, result.response, reports);
            // })

            // Promise.all(
            //     datesArray.reduce((acc, curr) => {
            //         console.log(
            //             `Creating promise for getReports( ${category}, ${force}, ${curr} ) at ${new Date()}`,
            //         );
            //         return axios(
            //             `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${curr}`,
            //             {
            //                 method: "GET",
            //                 mode: "no-cors",
            //                 headers: {
            //                     "Access-Control-Allow-Origin": "*",
            //                     "Content-Type": "application/json",
            //                 },
            //                 withCredentials: true,
            //                 credentials: "same-origin",
            //             },
            //         )
            //             .then((response) => {
            //                 console.log("Axios response: ", response);
            //             })
            //             .catch((error) => {
            //                 console.log("Axios error: ", error);
            //             });
            //     }),
            // ).then(function (results) {
            //     console.log(results);
            // });

            setIsFetching(false);
        // }
    };

    function getReports(category, force, date) {
        return new Promise((resolve, reject) => {
            setTimeout( () => {
                let res;
                console.log(
                    `BEFORE fetch = (${category}, ${force}, ${date}) ${new Date()}`,
                );
                try {
                    res = fetch(
                        `${ API_BASE }/crimes-no-location?category=${ category }&force=${ force }&date=${ date }`,
                        {
                            method: "GET",
                            redirect: "manual",
                            crossorigin: true,
                            // mode: "no-cors",
                        } )
                    .then((response) => response.json())
                    .then((data) => resolve(data))
                    .catch((error) => console.log(error));
                } catch (error) {
                      if (error instanceof SyntaxError) {
                        // Unexpected token < in JSON
                        console.log('There was a SyntaxError', error);
                      } else {
                        console.log('There was an error', error);
                      }
                }
                // .catch((error) => reject(error));
                console.log(
                    `Resolved fetch = (${category}, ${force}, ${date})! ${new Date()}`,
                    res,
                );
            
            }, 200); // 67);
        });
    }
        
    function getReports2(category, force, date) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(
                    `BEFORE fetch = (${category}, ${force}, ${date}) ${new Date()}`,
                );
                const res = fetch(
                    `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${date}`,
                    {
                        method: "GET",
                        redirect: "manual",
                        crossorigin: true,
                        // mode: "no-cors",
                    },
                )
                    .then((response) => response.json())
                    .then((data) => resolve(data))
                    .catch((error) => console.log(error));
                // .catch((error) => reject(error));
                console.log(
                    `Resolved fetch = (${category}, ${force}, ${date})! ${new Date()}`,
                    res,
                );
            }, 200); // 67);
        });
    }
        
*/

/*
    function getReports(category, force, date) {
        return fetch(
            `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${date}`,
        );
    }

    function getReports2(category, force, date) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch(
                    `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${date}`,
                    {
                        method: "GET",
                        crossorigin: true,
                        mode: "no-cors",
                    },
                )
                    .then((response) => response.json())
                    .then((data) => resolve(data))
                    .catch((error) => reject(error));
            }, 1000);
        });
    }
    
    const handleSequentialSearch3 = (event) => {
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

        // Create the query string so the downloadable file has the right filename.
        setQueryString(
            `SearchNoLocation_${[force, category, "all-dates"].join("_")}`,
        );
        console.log("queryString = ", queryString);
        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        if (date === "all_dates") {
            let datesArray = dates
                .filter((dateObject) => {
                    return dateObject.key !== "all_dates";
                })
                .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
            console.log(
                "handleSequentialSearch with all_dates: ",
                dates,
                datesArray,
            );

            // Promise.all([getCategories(), getForces()])
            //     .then(([categories, forces]) => {
            //         setCategories(categories);
            //         setForces(forces);
            //         setDates(generateDateOptions());
            //         setIsLoading(false);
            //     })
            //     .catch((error) => setError(error))
            //     .then(() => setIsLoading(false));
            let reports = [];
            datesArray.reduce(async (previousPromise, nextID) => {
                console.log(
                    `Creating promise for getCrimeReports( ${category}, ${force}, ${nextID} ) at ${new Date()}`,
                );

                // const response = getReports( category, force, nextID );
                const fetchPromise = fetch(
                    `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${nextID}`,
                    {
                        method: "GET",
                        withCredentials: true,
                        crossorigin: true,
                        mode: "no-cors",
                    },
                );
                console.log("fetchPromise = ", fetchPromise);

                fetchPromise.then((response) => {
                    const responseCode = response.status;
                    if (responseCode === 404) {
                        console.log(
                            `Received 404 response: ${response.status}`,
                        );
                    } else {
                        const data = response.json();
                        // reports = [ ...reports, ...data ];
                        if (Array.isArray(data)) {
                            reports.push(data);
                        }
                        console.log(
                            `Received response: ${response.status}, ${data}, ${reports}`,
                        );
                    }
                });
                //const data = await response.json();
                //console.log( `Promise response for ${ nextID }: `, data );
            }, Promise.resolve());

            // reports.then((e) => {
            //     console.log("Sequential promises result = ", reports);
            // });

            setIsFetching(false);
        }
    };

    const handleSequentialSearch2 = (event) => {
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

        // Create the query string so the downloadable file has the right filename.
        setQueryString(
            `SearchNoLocation_${[force, category, "all-dates"].join("_")}`,
        );
        console.log("queryString = ", queryString);
        // Clear the table.
        setTimeout(() => {
            setCrimeReports([]);
        }, 1000);

        if (date === "all_dates") {
            let datesArray = dates
                .filter((dateObject) => {
                    return dateObject.key !== "all_dates";
                })
                .map((dateObject) => dateObject.key); // dates.splice( 1, dates.length );
            console.log(
                "handleSequentialSearch with all_dates: ",
                dates,
                datesArray,
            );

            // Promise.all([getCategories(), getForces()])
            //     .then(([categories, forces]) => {
            //         setCategories(categories);
            //         setForces(forces);
            //         setDates(generateDateOptions());
            //         setIsLoading(false);
            //     })
            //     .catch((error) => setError(error))
            //     .then(() => setIsLoading(false));

            // datesArray.reduce( ( previousValue, currentValue, currentIndex ) =>
            // {
            //     console.log(
            //         "datesArray.reduce test: ",
            //         previousValue,
            //         currentValue,
            //         currentIndex,
            //     );
            //     return previousValue;
            // } );
            let reports = datesArray.reduce(async (previousPromise, nextID) => {
                console.log(
                    `Creating promise for getCrimeReports( ${category}, ${force}, ${nextID} ) at ${new Date()}`,
                );
                await previousPromise;
                return getReports(category, force, nextID);
            }, Promise.resolve());

            reports.then((e) => {
                console.log("Sequential promises result = ", reports);
            });

            // let reports = datesArray.reduce((accumulatorPromise, nextID) => {
            //     console.log(
            //         `Creating promise for getCrimeReports( ${category}, ${force}, ${nextID} ) at ${new Date()}`);
            //     return accumulatorPromise.then( () =>
            //     {
            //         console.log(`Promise thennable at: ${new Date()}`);
            //         return getReports( category, force, nextID );
            //     }, Promise.resolve() );
            //     // return getCrimeReports(category, force, month).then(
            //     //     (response) => {
            //     //         console.log(
            //     //             "Response for getCrimeReports( ",
            //     //             category,
            //     //             force,
            //     //             month,
            //     //             "): ",
            //     //             response,
            //     //         );
            //     //         reports.push(response.json());
            //     //         return response.json();
            //     //     },
            //     // );
            // });

            // console.log("Promise.all(promises): ", promises, reports);
            //
            // Promise.all(promises).then((results) => {
            //     console.log(
            //         "Promise.all(promises) response: ",
            //         results,
            //         ...results,
            //     );
            //     setCrimeReports(...results);
            // });
            setIsFetching(false);
        }
    };

*/

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

/*

    // This flattens an object into HTML elements.
    const flatMapObj = (obj, elementWrap = "", parentElement) => {
        if (obj == null) {
            return;
        }
        if (!parentElement) {
            return;
        }
        if (!elementWrap) {
            elementWrap = "div";
        }
        console.log(
            "DashboardContent::flatMapObj(): ",
            obj,
            elementWrap,
            parentElement,
        );
        const flattened = document.createElement("div");
        let objList = Object.entries(obj);
        console.log(objList);
        objList.forEach((value, index) => {
            const objLine = document.createElement(elementWrap);
            objLine.innerText = `${value[0]}: ${value[1]}`;
            flattened.appendChild(objLine);
        });
        // flattened.innerHTML = objList.map((objProperty) => {
        //         const wrapElement = document.createElement(`${elementWrap}`);
        //         if (
        //             typeof objProperty[1] === "object" &&
        //             objProperty[1] !== null
        //         ) {
        //             wrapElement.innerText = `${flatMapObj(
        //                 objProperty[1],
        //                 elementWrap,
        //                 parentElement
        //             )}`;
        //             console.log(wrapElement);
        //             return wrapElement;
        //             // return `${ flatMapObj( objProperty[ 1 ], ) }`;
        //         } else {
        //             wrapElement.innerText = `${objProperty[0]}: ${objProperty[1]}`;
        //             console.log(wrapElement);
        //             return wrapElement;
        //             // return `${wrapBefore}${objProperty[0]}: ${objProperty[1]}${wrapAfter}`;
        //         }
        //     })
        //     .join("");
        console.log("DashboardContent::flatMapObj(): flattened = ", flattened);
        parentElement.appendChild(flattened);
        return flattened;
    };

    // This flattens an object into HTML elements.
    const flatMapObj2 = (obj, elementWrap = "", parentElement) => {
        if (obj == null) {
            return;
        }
        if (!parentElement) {
            return;
        }
        if (!elementWrap) {
            elementWrap = "div";
        }
        console.log("DashboardContent::flatMapObj(): ", obj, elementWrap);
        const flattened = document.createElement("div");
        flattened.innerHTML = Object.entries(obj)
            .map((objProperty) => {
                const wrapElement = document.createElement(`${elementWrap}`);
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    wrapElement.innerText = `${flatMapObj(
                        objProperty[1],
                        elementWrap,
                    )}`;
                    console.log(wrapElement);
                    return wrapElement;
                    // return `${ flatMapObj( objProperty[ 1 ], ) }`;
                } else {
                    wrapElement.innerText = `${objProperty[0]}: ${objProperty[1]}`;
                    console.log(wrapElement);
                    return wrapElement;
                    // return `${wrapBefore}${objProperty[0]}: ${objProperty[1]}${wrapAfter}`;
                }
            })
            .join("");
        console.log("DashboardContent::flatMapObj(): flattened = ", flattened);
        document.getElementById(parentElement).appendChild(flattened);
    };

    // This flattens an object into HTML elements.
    const flatMapObjText = (obj) => {
        // console.log("flatMapObj(): ", obj, elementWrap);
        return Object.entries(obj)
            .map((objProperty) => {
                if (
                    typeof objProperty[1] === "object" &&
                    objProperty[1] !== null
                ) {
                    return `${flatMapObj(objProperty[1])}`;
                } else {
                    return `${objProperty[0]}: ${objProperty[1]}`;
                }
            })
            .join("");
    };

    const AppendRows = (objArray, tableElement) => {};

    // const changePage = (pagenum) => {
    //     // console.log( "changePage(): ", pagenum, pageNum );
    //     const crimeReportsClone = [...crimeReports];
    //     // console.log( "Reached bottom of table: ", crimeReports );
    //     if (crimeReportsClone.length > listNumber) {
    //         setTimeout( () =>
    //         {
    //             return setPageNum(pagenum);
    //         }, 10 );
    //     }
    // };

*/