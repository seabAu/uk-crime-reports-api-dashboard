import axios, { isCancel, AxiosError } from "axios";
import {
    arrayIsValid,
    has,
    isJsonString,
    SpliceObjArray,
} from "../components/Utilities/ObjectUtils";

const DEBUG = undefined;
const API_BASE = "https://data.police.uk/api";
const API_DELAY = 1000 / 15; // = 15; // 25; // Math.ceil(( 1 / 15 ) * 1000) + 50; // Add a little buffer
const fetchOptions = {
    method: "GET",
    redirect: "manual",
    crossorigin: true,
    // mode: "no-cors",
};

// Utility functions
export const checkInputs = (inputs = []) => {
    for (var i = 0; i < inputs.length; i++) {
        if (!getIsValid(inputs[i])) {
            return false;
        }
    }

    return true;
};

// return new Promise((resolve, reject) => {
//     fetch(`${API_BASE}/${force}/${location_id}`)
//         .then((response) => response.json())
//         .then((data) => resolve(data))
//         .catch((error) => reject(error));
// });

export function getIsValid(value) {
    // console.log("getIsValid(): ", value);
    if (value) {
        if (value !== undefined) {
            if (value !== null) {
                //if (value instanceof String) {
                //    if (value !== " " && value !== "") {
                //        // Not an empty string.
                //        return true;
                //    } else {
                //        return false;
                //    }
                //} else {
                return true;
                //}
            }
        }
    }

    return false;
}

export function getPolyAreaStr(objArray) {
    return objArray
        .map((point) => {
            if ("latitude" in point && "longitude" in point) {
                return `${point.latitude},${point.longitude}`;
            } else {
                return ``;
            }
        })
        .join(":");
}

// Calling functions
export const getCrimesStreetsDates = () => {
    // https://data.police.uk/docs/method/crimes-street-dates/

    let call = `${API_BASE}/crimes-street-dates`;

    return handleBasicFetch(call);
};

export const getLastUpdated = () => {
    let call = `${API_BASE}/crime-last-updated`;

    return handleBasicFetch(call);
};

export const getCategories = () => {
    let call = `${API_BASE}/crime-categories`;
    return new Promise((resolve, reject) => {
        fetch(call, fetchOptions)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
    // return handleBasicFetch(call);
};

export const getForces = () => {
    // https://data.police.uk/api/forces

    let call = `${API_BASE}/forces`;
    return new Promise((resolve, reject) => {
        fetch(call, fetchOptions)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
    // return handleBasicFetch(call);
};

export const getForceInfo = (force) => {
    // https://data.police.uk/docs/method/force/
    if (!checkInputs([force])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/forces/${force}`;

    return handleBasicFetch(call);
};

export const getForceOfficers = (force) => {
    if (!checkInputs([force])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/forces/${force}/people`;

    return handleBasicFetch(call);
};

// Constructor for our custom error objects.
export const constructFetchError = (src, call, vars, response) => {
    // console.log( "constructFetchError :: ", src, call, vars, response, " RESPONSE = [", response, "]");
    // const responseError = {
    //     ok: response.ok,
    //     statusText: response.statusText,
    //     status: response.status,
    // };
    // if (response.status >= 200 && response.status < 300) {
    //     throw Error(responseError);
    // } else if (response.status === 404) {
    //     throw Error(responseError);
    // }

    // if (
    //     response.toString().toLowerCase().includes("typeError: failed to fetch")
    // ) {
    //     // return `There was an error: 429 Too Many Requests.`;
    //     response = {
    //         body: "",
    //         bodyUsed: false,
    //         ok: false,
    //         status: 429,
    //         statusText: "TypeError: Failed to fetch",
    //         type: "cors",
    //         url: call,
    //     };
    //     console.log(
    //         "constructFetchError :: reconstructed response for 429 error: ",
    //         src,
    //         call,
    //         vars,
    //         response,
    //     );
    // }

    let errData = {
        source: src ?? "",
        vars: vars ?? [],
        call: call ?? "",
        time: new Date(),
        errorMessage: function () {
            if (response) {
                if (typeof response === "object") {
                    if ("status" in response) {
                        if (response.status === 502) {
                            return `There was an error: Network response 502.`;
                        } else if (response.status === 429) {
                            return `There was an error: 429 Too Many Requests.`;
                        } else if (response.status === 404) {
                            return `There was an error: 404 Source Not Found.`;
                        } else {
                            return `There was an error: Network response was not OK.`;
                        }
                    }
                } else {
                    return response;
                }
            } else {
                return "No Response";
            }
            return "";
        },
        response: response, // JSON.stringify(response),
        responseClass: function () {
            if (response) {
                if (typeof response === "object") {
                    if ("status" in response) {
                        if (response.status >= 100 && response.status < 200) {
                            return "100: Informational response";
                        } else if (
                            response.status >= 200 &&
                            response.status < 300
                        ) {
                            return "200: Successful response";
                        } else if (
                            response.status >= 300 &&
                            response.status < 400
                        ) {
                            return "300: Redirection message";
                        } else if (
                            response.status >= 400 &&
                            response.status < 500
                        ) {
                            return "400: Client error response";
                        } else if (
                            response.status >= 500 &&
                            response.status < 600
                        ) {
                            return "500: Server error response";
                        }
                    }
                }
                return response;
            }
            return "No Response";
        },
        status: response
            ? "status" in response
                ? response.status
                    ? response.status
                    : "-"
                : "No status in response"
            : "No Response",
        ok: response
            ? "ok" in response
                ? response.ok
                    ? response.ok
                    : "-"
                : "No ok in response"
            : "No Response",
    };

    return errData;
};

export const handleFetchResponse = (src, call, vars, response) => {
    // console.log( "Handlefetchresponse :: ", src, call, vars, response );
    if (response) {
        if (typeof response === "object") {
            if ("ok" in response) {
                if (response.ok === true) {
                    let data = response.json();
                    // if (DEBUG)
                    //     console.log(
                    //         `Handlefetchresponse :: ${src} :: [${call}, ${new Date()}] :: response.json() = data = `,
                    //         data,
                    //     );
                    // return response.json();
                    return data;
                } else {
                    let errData = constructFetchError(
                        src,
                        call,
                        vars,
                        response,
                    );
                    // if (DEBUG)
                    //     console.log(
                    //         `handleFetchResponse => ${src} :: [${call}, ${new Date()}] :: Throwing error: `,
                    //         JSON.stringify(errData),
                    //     );
                    throw new Error(JSON.stringify(errData));
                }
            } else {
                // No "ok" in response. It is an object, but for some reason does not contain the right keys.
                throw new Error(
                    JSON.stringify(
                        constructFetchError(src, call, vars, response),
                    ),
                );
            }
        } else {
            // Response was not an object.
            throw new Error(
                JSON.stringify(constructFetchError(src, call, vars, response)),
            );
        }
    } else {
        // Response was undefined.
        // console.log(
        //     `Handlefetchresponse :: ${src} :: [${call}, ${new Date()}] :: response was undefined: `, response
        // );
        throw new Error(
            JSON.stringify(
                constructFetchError(src, call, vars, {
                    body: "",
                    bodyUsed: false,
                    headers: {},
                    ok: false,
                    redirected: false,
                    status: 429,
                    statusText: "TypeError: Failed to fetch",
                    type: "cors",
                    url: call,
                }),
            ),
        );
    }
};

// Generic function to handle the errors that can be caught by the post-fetch promise catch block.
export const parseError = (error, srcblock = "") => {
    // console.log(
    //     `parseError :: ${new Date()}] :: ${srcblock} catch block :: Rejected the promise due to an error: `,
    //     error,
    // );
    // return Object.entries(error);
    // console.log(`parseError :: ${srcblock} :: Test: `, error.toString().substring("Error: ".length));
    // return { error: Object.fromEntries(error) };
    if (isJsonString(error)) {
        // The error itself is a custom error object.
        return JSON.parse(error);
    } else if (error.toString().toLowerCase().includes("error: ")) {
        // Most of the time we get this: Our custom error object, combined with the word "Error: " in front. Split it off and return the object part.
        let err = error.toString().substring("Error: ".length);
        if (isJsonString(err)) {
            return JSON.parse(err);
        } else {
            return error;
        }
    } else {
        return error;
    }
};

// Generic function to handle fetch requests, wrapping it in a promise, and handling errors from both the fetch and the promise.
// If an error is encountered, this will return a detailed summary of the error as an object.
export async function handleFetch(call, src = "", vars = [], options = {}) {
    // console.log(
    //     `API :: Handlefetch called with ${call}, ${src}, ${vars}, ${JSON.stringify(
    //         options,
    //     )}`,
    // );
    if (!checkInputs(vars)) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    const { timeout = 8000, abortSignal = false } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let res;
            // console.log(`${src} :: BEFORE fetch stage.`);
            try {
                res = fetch(call, {
                    ...options,
                    method: "GET",
                    redirect: "manual",
                    crossorigin: true,
                    // mode: "no-cors",
                    signal: abortSignal || controller.signal,
                })
                    // .catch((error, response) => {
                    //     // This block will primarily catch undefined or invalid responses if the request failed to fetch.
                    //     console.error(
                    //         "fetchblock caught an error: ",
                    //         error,
                    //         ", response: ~",
                    //         response,
                    //         "~",
                    //         error
                    //             .toString()
                    //             .toLowerCase()
                    //             .includes("failed to fetch"),
                    //     );
                    //     // This is some hacky nonsense but nothing else was catching 429 errors.
                    //     return handleFetchResponse(
                    //         src,
                    //         call,
                    //         vars,
                    //         response,
                    //         // {
                    //         // body: "",
                    //         // bodyUsed: false,
                    //         // headers: {},
                    //         // ok: false,
                    //         // redirected: false,
                    //         // status: 429,
                    //         // statusText: "TypeError: Failed to fetch",
                    //         // type: "cors",
                    //         // url: call,
                    //         // }
                    //     );
                    // })
                    .catch((error) => {
                        // This block will primarily catch undefined or invalid responses if the request failed to fetch.
                        // console.error(
                        //     "fetchblock caught an error: ",
                        //     error,
                        //     error
                        //         .toString()
                        //         .toLowerCase()
                        //         .includes("failed to fetch"),
                        // );
                        // This is some hacky nonsense but nothing else was catching 429 errors.
                        return handleFetchResponse(src, call, vars, undefined);
                    })
                    // .then((response) => handleErrors(src, call, response))
                    .then((response) => {
                        // console.log("response in .then = ", response);
                        return handleFetchResponse(src, call, vars, response);
                    })
                    .catch((error) => {
                        // Catch the error thrown by handleFetchResponse.
                        // console.error(
                        //     `Postfetch block caught an error: ${error}`,
                        // );
                        return reject(
                            error,
                            // JSON.stringify(
                            //     constructFetchError(src, call, vars, error),
                            // ),
                        );
                    })
                    .then((data) => {
                        // If no error is thrown by handleFetchResponse, it returns response.json(). Resolve the result of that.
                        return resolve(data);
                    });
            } catch (error) {
                return parseError(error, "try-catch-fetchCatch");

                // This is the catch block for the promise returned by the fetch call.
                // console.log(
                //     `${src} :: reached catch-error component of the try-catch block. Error = `,
                //     error,
                // );
                // if (error instanceof SyntaxError) {
                //     // Unexpected token < in JSON
                //     console.error(
                //         `${src} :: [${call}, ${new Date()}] :: There was a SyntaxError :: ${error}`,
                //     );
                //     return reject(error);
                // } else {
                //     console.error(
                //         `${src} :: [${call}, ${new Date()}] :: There was an error :: ${error}`,
                //     );
                //     return reject(error);
                // }
            }
            clearTimeout(id);
            // console.log(
            //     `${src} :: [${call}, ${new Date()}] :: Resolved fetch\n\n\n:: res = `,
            //     res,
            // );
        }, API_DELAY); // 67);
    }).catch((error) => {
        // This is the catch block for the promise as a whole. Only executed if the promise is rejected.
        return parseError(error, "promiseCatch");
    });
}

export async function handleBasicFetch(call) {
    return new Promise((resolve, reject) => {
        fetch(call, fetchOptions)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
}

export async function getCrimeReportsNoLocation(category, force, date, options = {}) {
    if (!checkInputs([category, force, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    let src = `getCrimeReportsNoLocation`;
    let vars = [category, force, date];
    let call = `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${date}`;

    return handleBasicFetch(call);

    // return handleFetch(call, src, vars, options);
}

export function apiCrimeReportsNoLocation(category, force, date) {
    // if (!checkInputs(vars)) {
    //     return "ERR: INVALID/UNDEFINED INPUT";
    // }

    return {
        vars: [category, force, date],
        url: `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${date}`,
        src: `apiCrimeReportsNoLocation`,
    };
}

export async function getCrimeReportsByLocation(
    date,
    latitude,
    longitude,
    options = {},
) {
    let call;
    let vars;
    let src = `getCrimeReportsByLocation`;
    if (date === undefined || date === null || date === "") {
        // If no date is provided, the API allows us to make a call without it, though we will get different results.
        vars = [latitude, longitude];
        call = `${API_BASE}/crimes-at-location?lat=${latitude}&lng=${longitude}`;
    } else {
        vars = [date, latitude, longitude];
        call = `${API_BASE}/crimes-at-location?date=${date}&lat=${latitude}&lng=${longitude}`;
    }
    if (!checkInputs(vars)) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    // const { timeout = 8000 } = options;
    // const controller = new AbortController();
    // const id = setTimeout( () => controller.abort(), timeout );

    return handleFetch(call, src, vars, options);
}

export function apiCrimeReportsByLocation(date, latitude, longitude) {
    let call;
    let vars;
    let src = `apiCrimeReportsByLocation`;
    if (date === undefined || date === null || date === "") {
        // If no date is provided, the API allows us to make a call without it, though we will get different results.
        vars = { date: null, lat: latitude, lng: longitude };
        call = `${API_BASE}/crimes-at-location?lat=${latitude}&lng=${longitude}`;
    } else {
        vars = { date: date, lat: latitude, lng: longitude };
        call = `${API_BASE}/crimes-at-location?date=${date}&lat=${latitude}&lng=${longitude}`;
    }

    return {
        vars: vars,
        url: call,
        src: src,
    };
    // if (!checkInputs(vars)) {
    //     return "ERR: INVALID/UNDEFINED INPUT";
    // }
    // const { timeout = 8000 } = options;
    // const controller = new AbortController();
    // const id = setTimeout( () => controller.abort(), timeout );
    // return handleFetch(call, src, vars, options);
}

export const getStopReportsByAreaPoly = (polyObjArray = [], date) => {
    // Response: https://data.police.uk/docs/method/crime-street/
    if (!checkInputs([polyObjArray, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    let poly = getPolyAreaStr(polyObjArray);

    let call = `${API_BASE}/stops-street?poly=${poly}&date=${date}`;

    return handleBasicFetch(call);
};

export const getStopReportsByArea = (lat, lng, date) => {
    // Stop and searches by area
    // https://data.police.uk/docs/method/stops-street/
    // For specific point: https://data.police.uk/api/stops-street?lat=52.629729&lng=-1.131592&date=2018-06
    // For custom area: https://data.police.uk/api/stops-street?poly=52.2,0.5:52.8,0.2:52.1,0.88&date=2018-06
    if (!checkInputs([lat, lng, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/stops-street?lat=${lat}&lng=${lng}&date=${date}`;

    return handleBasicFetch(call);
};

export const getStopReportsAtLocation = (location_id, date) => {
    // Stop and searches by location
    // https://data.police.uk/docs/method/stops-at-location/
    // https://data.police.uk/api/stops-at-location?location_id=883407&date=2017-01
    if (!checkInputs([location_id, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/stops-at-location?location_id=${location_id}&date=${date}`;
    return handleBasicFetch(call);
};

export const getStopReportNoLocation = (force, date) => {
    // Stop and searches with no location
    // https://data.police.uk/docs/method/stops-no-location/
    // https://data.police.uk/api/stops-no-location?force=cleveland&date=2017-01
    if (!checkInputs([force, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/stops-no-location?force=${force}&date=${date}`;

    return handleBasicFetch(call);
};

export const getStopReportsByForce = (force, date) => {
    // Stop and searches by force
    // https://data.police.uk/docs/method/stops-force/
    // https://data.police.uk/api/stops-force?force=avon-and-somerset&date=2017-01
    if (!checkInputs([force, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/stops-force?force=${force}&date=${date}`;

    return handleBasicFetch(call);
};

export const getNeighbourhoodList = (force) => {
    if (!checkInputs([force])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    // console.log("API::getNeighbourhoodList: ", force);

    let call = `${API_BASE}/${force}/neighbourhoods`;
    console.log("getNeighbourhoodList :: ", force, call);
    return handleBasicFetch(call);
};

export const apiNeighborhoodInformation = (force, location_id) => {
    // if (!checkInputs(vars)) {
    //     return "ERR: INVALID/UNDEFINED INPUT";
    // }

    return {
        vars: [force, location_id],
        url: `${API_BASE}/${force}/${location_id}`,
        src: `apiCrimeReportsNoLocation`,
    };
};

export const getNeighbourhoodInformation = (force, location_id) => {
    if (!checkInputs([force, location_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    // console.log( "API::getNeighbourhoodInformation: ", force, location_id );

    let call = `${API_BASE}/${force}/${location_id}`;

    return handleBasicFetch(call);
};

export const getNeighbourhoodCoordinates = (force, neighbourhood_id) => {
    if (!checkInputs([force, neighbourhood_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    let call = `${API_BASE}/${force}/${neighbourhood_id}`;

    return handleBasicFetch(call);

    // const response = new Promise((resolve, reject) => {
    //     fetch(`${API_BASE}/${force}/${neighbourhood_id}`)
    //         .then((response) => response.json())
    //         .then((data) => resolve(data))
    //         .catch((error) => reject(error));
    // });
    // if (response) {
    //     return [response.centre.latitude, response.centre.longitude];
    // } else {
    //     return [];
    // }
};

export const getNeighbourhoodFromCoordinates = (latitude, longitude) => {
    // https://data.police.uk/api/locate-neighbourhood?q=51.500617,-0.124629
    if (!checkInputs([latitude, longitude])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    // console.log( "API::getNeighbourhoodInformation: ", force, location_id );

    let call = `${API_BASE}/locate-neighbourhood?q=${latitude},${longitude}`;

    return handleBasicFetch(call);
};

export const getNeighbourhoodTeam = (force, neighborhood_id) => {
    // https://data.police.uk/api/leicestershire/NC04/people
    if (!checkInputs([force, neighborhood_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/${force}/${neighborhood_id}/people`;

    return handleBasicFetch(call);
};

export const getNeighbourhoodEvents = (force, neighborhood_id) => {
    // Response: https://data.police.uk/docs/method/neighbourhood-events/
    if (!checkInputs([force, neighborhood_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/${force}/${neighborhood_id}/events`;

    return handleBasicFetch(call);
};

export const getNeighbourhoodBoundary = (force, neighborhood_id) => {
    // Response: https://data.police.uk/docs/method/neighbourhood-boundary/
    if (!checkInputs([force, neighborhood_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/${force}/${neighborhood_id}/boundary`;

    return handleBasicFetch(call);
};

export const apiNeighborhoodLocate = (lat, lng) => {
    // if (!checkInputs(vars)) {
    //     return "ERR: INVALID/UNDEFINED INPUT";
    // }

    return {
        vars: [lat, lng],
        url: `${API_BASE}/locate-neighbourhood?q=${lat},${lng}`,
        src: `apiNeighborhoodLocate`,
    };
};

export const getStreetLevelCrimesByCoordinates = (latitude, longitude, date) => {
    // Response: https://data.police.uk/docs/method/crime-street/
    if (!checkInputs([latitude, longitude, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=${date}`;

    return handleBasicFetch(call);
};

export const getStreetLevelCrimesByPolygon = (polyObjArray = [], date) => {
    // Response: https://data.police.uk/docs/method/crime-street/
    if (!checkInputs([polyObjArray, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    let poly = getPolyAreaStr(polyObjArray);

    let call = `${API_BASE}/crimes-street/all-crime?poly=${poly}&date=${date}`;

    return handleBasicFetch(call);
};

export const getCrimeOutcomes = (crime_id) => {
    // Response: https://data.police.uk/docs/method/outcomes-for-crime/
    if (!checkInputs([crime_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let call = `${API_BASE}/outcomes-for-crime/${crime_id}`;

    return handleBasicFetch(call);
};

/*
    // https://stackoverflow.com/questions/39297345/fetch-resolves-even-if-404 //
    function checkResponse(response) {
        if (!response.ok) {
            // make the promise be rejected if we didn't get a 2xx response
            throw new Error("Not 2xx response", { cause: response });
        } else {
            // got the desired response
        }
    }
    
    // Generic fetch function
    function fetchData(url, parameters, callback) {
        fetch(url, {
            method: "GET", // "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parameters),
        })
            .then(async (response) => {
                // status 404 or 500 will set ok to false
                if (response.ok) {
                    // Success: convert data received & run callback
                    let result = await response.json();
                    callback(result);
                } else {
                    throw new Error(response.status + " Failed Fetch ");
                }
            })
            .catch((e) => console.error("EXCEPTION: ", e));
    }
*/

/*
export {
    getCrimesStreetsDates,
    getLastUpdated,
    getCategories,
    getForces,
    getForceInfo,
    getForceOfficers,
    getNeighbourhoodTeam,
    getCrimeReportsNoLocation,
    //getCrimeReportsAtLocation,
    getCrimeReportsByLocation,
    // getCrimeReportsAtLocationMulti,
    getStopReportsByArea,
    getStopReportsByAreaPoly,
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
    apiCrimeReportsNoLocation,
    apiNeighborhoodInformation,
    apiNeighborhoodLocate,
};

*/


/*  // Archived 03-06-23 // 

const getCrimeReports = (category, force, date) => {
    if (!checkInputs([category, force, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }

    let src = `getCrimeReports`;
    let call = `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${date}`;

    return handleBasicFetch(call);

    let res;



    return new Promise((resolve, reject) => {
        res = fetch(call, fetchOptions)
            .then((response) => {
                if (!response.ok) {
                    // throw new Error("Network response was not OK");
                    return reject(
                        `${src} :: ${call} :: There was an error: Network response was not OK`,
                    );
                }
                return response.json();
            })
            // .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) =>
                console.error(
                    `${src} :: ${call} :: There was an error: ${error}`,
                ),
            );
        // .catch((error) => reject(error));
    }).catch(function () {
        // Only executed if the promise is rejected.
        console.log("rejected the promise, something wrong happened");
        return [];
    });
};
*/

/* // Archived 03-04-23 // 

    async function runBulkFetchTask(urls, signal) {
        if (signal === true) {
            return;
        }
        if (arrayIsValid(urls)) {
            let vars;
            let src = `getCrimeReportsByLocation`;
            // for ( const url of urls )
            return urls.map((url, index) => {
                if (signal === true) {
                    return [];
                } else {
                    let call = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            let res;
                            if (DEBUG) console.log(`${src} :: BEFORE fetch stage.`);
                            try {
                                res = fetch(url, fetchOptions)
                                    // .then((response) => handleErrors(src, call, response))
                                    .then((response) => {
                                        return handleFetchResponse(
                                            src,
                                            url,
                                            vars,
                                            response,
                                        );
                                    })
                                    .catch((error) => {
                                        // Catch the error thrown by handleFetchResponse.
                                        if (DEBUG)
                                            console.error(
                                                `Postfetch block caught an error: ${error}`,
                                            );
                                        return reject(error);
                                    })
                                    .then((data) => {
                                        // If no error is thrown by handleFetchResponse, it returns response.json(). Resolve the result of that.
                                        return resolve(data);
                                    });
                            } catch (error) {
                                // This is the catch block for the promise returned by the fetch call.
                                if (DEBUG)
                                    console.log(
                                        `${src} :: reached catch-error component of the try-catch block. Error = `,
                                        error,
                                    );
                                if (error instanceof SyntaxError) {
                                    // Unexpected token < in JSON
                                    if (DEBUG)
                                        console.error(
                                            `${src} :: [${url}, ${new Date()}] :: There was a SyntaxError :: ${error}`,
                                        );
                                    return reject(error);
                                } else {
                                    if (DEBUG)
                                        console.error(
                                            `${src} :: [${url}, ${new Date()}] :: There was an error :: ${error}`,
                                        );
                                    return reject(error);
                                }
                            }
                            if (DEBUG)
                                console.log(
                                    `${src} :: [${url}, ${new Date()}] :: Resolved fetch\n\n\n:: res = `,
                                    res,
                                );
                        }, API_DELAY); // 67);
                    }).catch((error) => {
                        // This is the catch block for the promise as a whole. Only executed if the promise is rejected.
                        return parseError(error, "promiseCatch");
                    });
                    return call;
                }
            });
        }
    }

*/

/*  // Archived 03-02-23 // 

    const handleFetchResponse2 = (src, call, vars, response) => {
        // console.log("Handlefetchresponse :: ", src, call, vars, response);
        if (!response.ok) {
            let errData = constructFetchError(src, call, vars, response);
            // if (DEBUG)
            //     console.log(
            //         `handleFetchResponse => ${src} :: [${call}, ${new Date()}] :: Throwing error: `,
            //         JSON.stringify(errData),
            //     );
            throw new Error(JSON.stringify(errData));
        } else {
            let data = response.json();
            // if (DEBUG)
            //     console.log(
            //         `${src} :: [${call}, ${new Date()}] :: response.json() = data = `,
            //         data,
            //     );
            // return response.json();
            return data;
        }
    };
    // Generic function to handle fetch requests, wrapping it in a promise, and handling errors from both the fetch and the promise.
    // If an error is encountered, this will return a detailed summary of the error as an object.
    async function handleFetch2(call, src = "", vars = [], options = {}) {
        if (DEBUG)
            console.log(
                `API :: Handlefetch called with ${call}, ${src}, ${vars}, ${JSON.stringify(
                    options,
                )}`,
            );
        if (!checkInputs(vars)) {
            return "ERR: INVALID/UNDEFINED INPUT";
        }
        const { timeout = 8000, abortSignal = false } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let res;
                if (DEBUG) console.log(`${src} :: BEFORE fetch stage.`);
                try {
                    res = fetch(call, {
                        ...options,
                        signal: abortSignal || controller.signal,
                    })
                        // .then((response) => handleErrors(src, call, response))
                        .then((response) => {
                            return handleFetchResponse(src, call, vars, response);
                        })
                        .catch((error) => {
                            // Catch the error thrown by handleFetchResponse.
                            if (DEBUG)
                                console.error(
                                    `Postfetch block caught an error: ${error}`,
                                );
                            return reject(error);
                        })
                        .then((data) => {
                            // If no error is thrown by handleFetchResponse, it returns response.json(). Resolve the result of that.
                            return resolve(data);
                        });
                } catch (error) {
                    // This is the catch block for the promise returned by the fetch call.
                    if (DEBUG)
                        console.log(
                            `${src} :: reached catch-error component of the try-catch block. Error = `,
                            error,
                        );
                    if (error instanceof SyntaxError) {
                        // Unexpected token < in JSON
                        if (DEBUG)
                            console.error(
                                `${src} :: [${call}, ${new Date()}] :: There was a SyntaxError :: ${error}`,
                            );
                        return reject(error);
                    } else {
                        if (DEBUG)
                            console.error(
                                `${src} :: [${call}, ${new Date()}] :: There was an error :: ${error}`,
                            );
                        return reject(error);
                    }
                }
                clearTimeout(id);
                if (DEBUG)
                    console.log(
                        `${src} :: [${call}, ${new Date()}] :: Resolved fetch\n\n\n:: res = `,
                        res,
                    );
            }, API_DELAY); // 67);
        }).catch((error) => {
            // This is the catch block for the promise as a whole. Only executed if the promise is rejected.
            return parseError(error, "promiseCatch");
        });
    }

    // Currently working but inefficient version.
    async function getCrimeReportsLocation(date, latitude, longitude) {
        if (!checkInputs([date, latitude, longitude])) {
            return "ERR: INVALID/UNDEFINED INPUT";
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let res;
                let call = `${API_BASE}/crimes-at-location?date=${date}&lat=${latitude}&lng=$
                
                return handleBasicFetch(call);
                {longitude}`;
                if (DEBUG)
                    console.log(
                        `getCrimeReportsByLocation :: BEFORE fetch = (${date}, ${latitude}, ${longitude}) ${new Date()}`,
                    );
                try {
                    res = fetch( call, fetchOptions)
                        .then((response) => {
                            if (DEBUG)
                                console.log(
                                    `getCrimeReportsByLocation :: then-RESPONSE stage = (${date}, ${latitude}, ${longitude}) ${new Date()} :: Response = `,
                                    response,
                                    // "\n\n\nresponse.json() = ",
                                    // data,
                                );
                            if (response.status === 502) {
                                reject(`${response.status}`);
                                return "ERR_ABORTED::502";
                            } else if (response.status === 429) {
                                reject(`${response.status}`);
                                return "ERR_ABORTED::429::(Too Many Requests)";
                            } else {
                                let data = response.json();
                                if (DEBUG)
                                    console.log(
                                        `getCrimeReportsByLocation :: Response.JSON = (${date}, ${latitude}, ${longitude}) ${new Date()} :: response.json() = data = ${data}`,
                                    );
                                // return response.json();
                                return data;
                            }
                        })
                        .then((data) => {
                            if (DEBUG)
                                console.log(
                                    `getCrimeReportsByLocation :: then DATA stage = (${date}, ${latitude}, ${longitude}) ${new Date()}`,
                                );
                            return resolve(data);
                        })
                        .catch((error) => {
                            if (DEBUG) console.log(error);
                        });
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        // Unexpected token < in JSON
                        if (DEBUG)
                            console.log(
                                "getCrimeReportsByLocation :: There was a SyntaxError :: ",
                                error,
                            );
                    } else {
                        if (DEBUG)
                            console.log(
                                "getCrimeReportsByLocation :: There was an error :: ",
                                error,
                            );
                        reject(error);
                    }
                }
                // .catch((error) => reject(error));
                if (DEBUG)
                    console.log(
                        `getCrimeReportsByLocation :: Resolved fetch = (${date}, ${latitude}, ${longitude})! ${new Date()} \n\n\n:: res = ${res}`,
                        res,
                    );
            }, API_DELAY); // 67);
        });
    }

    function getCrimeReportsAtLocationMulti(latitude, longitude) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let res;
                if (DEBUG)
                    console.log(
                        `getCrimeReportsAtLocationMulti :: BEFORE fetch = (${latitude}, ${longitude}) ${new Date()}`,
                    );
                let call = `${API_BASE}/crimes-at-location?lat=${latitude}&lng=${longitude}`;

                return handleBasicFetch(call);

                try {
                    res = fetch(call, fetchOptions)
                        .then((response) => response.json())
                        .then((data) => resolve(data))
                        .catch((error) => console.log(error));
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        // Unexpected token < in JSON
                        if (DEBUG) console.log(
                            "getCrimeReportsAtLocationMulti :: There was a SyntaxError :: ",
                            error,
                        );
                    } else {
                        if (DEBUG) console.log(
                            "getCrimeReportsAtLocationMulti :: There was an error :: ",
                            error,
                        );
                    }
                    reject(error);
                }
                // .catch((error) => reject(error));
                if (DEBUG)
                    console.log(
                        `getCrimeReportsAtLocationMulti :: Resolved fetch = (${latitude}, ${longitude})! ${new Date()}`,
                        res,
                    );
            }, API_DELAY); // 67);
        });
    }

    // Mostly defunct
    const getCrimeReportsAtLocation = (latitude, longitude) => {
        // https://data.police.uk/docs/method/crimes-at-location/
        // Requires: Either [date, location_id] OR [date, latitude, longitude]
        // Example: https://data.police.uk/api/crimes-at-location?date=2017-02&location_id=884227
        // Example: https://data.police.uk/api/crimes-at-location?date=2017-02&lat=52.629729&lng=-1.131592
        if (!checkInputs([latitude, longitude])) {
            return "ERR: INVALID/UNDEFINED INPUT";
        }
        return new Promise((resolve, reject) => {
            fetch(`${API_BASE}/crimes-at-location?lat=${latitude}&lng=${longitude}`)
                .then((response) => response.json())
                .then((data) => resolve(data))
                .catch((error) => reject(error));
        });
    };

*/

/*
    function getCrimeReportsByLocationBackup(date, latitude, longitude) {
        if (!checkInputs([date, latitude, longitude])) {
            return "ERR: INVALID/UNDEFINED INPUT";
        }
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let res;
                console.log(
                    `getCrimeReportsByLocation :: BEFORE fetch = (${date}, ${latitude}, ${longitude}) ${new Date()}`,
                );
                try {
                    res = fetch(
                        `${API_BASE}/crimes-at-location?date=${date}&lat=${latitude}&lng=${longitude}`,
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
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        // Unexpected token < in JSON
                        console.log(
                            "getCrimeReportsByLocation :: There was a SyntaxError :: ",
                            error,
                        );
                    } else {
                        console.log(
                            "getCrimeReportsByLocation :: There was an error :: ",
                            error,
                        );
                        reject(error);
                    }
                }
                // .catch((error) => reject(error));
                console.log(
                    `getCrimeReportsByLocation :: Resolved fetch = (${date}, ${latitude}, ${longitude})! ${new Date()}`,
                    res,
                );
            }, API_DELAY); // 67);
        });
    }

    async function getCrimeReportsNoLocationBackup2(category, force, date) {
        if (!checkInputs([category, force, date])) {
            return "ERR: INVALID/UNDEFINED INPUT";
        }
        let src = `getCrimeReportsNoLocation`;
        let call = `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${date}`;

        return handleBasicFetch(call);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let res;
                console.log(`getCrimeReportsNoLocation :: BEFORE fetch stage.`);
                try {
                    res = fetch(call, {
                        method: "GET",
                        redirect: "manual",
                        crossorigin: true,
                        // mode: "no-cors",
                    })
                        .then((response) => {
                            try {
                                console.log(
                                    `${src} :: [${call}, ${new Date()}] :: then-RESPONSE stage :: Response = `,
                                    response,
                                    " :: Response.status = ",
                                    response.status,
                                    " :: Response.ok = ",
                                    response.ok,
                                    // "\n\n\nresponse.json() = ",
                                    // data,
                                );
                                if (!response.ok) {
                                    reject(`${response.ok}, ${response.stauts}`);
                                } else {
                                    let data = response.json();
                                    console.log(
                                        `${src} :: [${call}, ${new Date()}] :: response.json() = data = `,
                                        data,
                                    );
                                    // return response.json();
                                    return data;
                                }
                            } catch (error) {
                                console.error(error);
                                reject(error);
                            }
                            // console.log(
                            //     `${src} :: [${call}, ${new Date()}] :: then-RESPONSE stage :: Response = `,
                            //     response,
                            //     " :: Response.status = ",
                            //     response.status,
                            //     // "\n\n\nresponse.json() = ",
                            //     // data,
                            // );
                            // if (response.status === 502) {
                            //     reject(`${response.status}`);
                            //     return "ERR_ABORTED::502";
                            // } else if (response.status === 429) {
                            //     reject(`${response.status}`);
                            //     return "ERR_ABORTED::429::(Too Many Requests)";
                            // } else if (response.status === 404) {
                            //     reject(`${response.status}`);
                            //     return "ERR_ABORTED::404::(Source Not Found)";
                            // } else {
                            //     let data = response.json();
                            //     console.log(
                            //         `${src} :: [${call}, ${new Date()}] :: response.json() = data = `, data
                            //     );
                            //     // return response.json();
                            //     return data;
                            // }
                        })
                        .then((data) => {
                            console.log(
                                `${src} :: [${call}, ${new Date()}] :: then DATA=>Resolve stage :: `,
                            );
                            return resolve(data);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        // Unexpected token < in JSON
                        console.error(
                            `${src} :: [${call}, ${new Date()}] :: There was a SyntaxError :: ${error}`,
                        );
                        reject(error);
                    } else {
                        console.error(
                            `${src} :: [${call}, ${new Date()}] :: There was an error :: ${error}`,
                        );
                        reject(error);
                    }
                }
                // .catch((error) => reject(error));
                console.log(
                    `${src} :: [${call}, ${new Date()}] :: Resolved fetch\n\n\n:: res = ${res}`,
                    res,
                );
            }, API_DELAY); // 67);
        });
    }

    function getCrimeReports3(category, force, date) {
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

    const getCrimeReportsBackup = (category, force, date) => {
        if (!checkInputs([category, force, date])) {
            return "ERR: INVALID/UNDEFINED INPUT";
        }
        return new Promise((resolve, reject) => {
            fetch(
                `${API_BASE}/crimes-no-location?category=${category}&force=${force}&date=${date}`,
            )
                .then((response) => response.json())
                .then((data) => resolve(data))
                .catch((error) => reject(error));
        });
    };

    function getCrimeReportsNoLocationBackup(category, force, date) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let res;
                // console.log(
                //     `getCrimeReportsNoLocation :: BEFORE fetch = (${category}, ${force}, ${date}) ${new Date()}`,
                // );
                try {
                    res = fetch(
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
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        // Unexpected token < in JSON
                        console.log(
                            "getCrimeReportsNoLocation :: There was a SyntaxError :: ",
                            error,
                        );
                    } else {
                        console.log(
                            "getCrimeReportsNoLocation :: There was an error :: ",
                            error,
                        );
                    }
                }
                // .catch((error) => reject(error));
                // console.log(
                //     `getCrimeReportsNoLocation :: Resolved fetch = (${category}, ${force}, ${date})! ${new Date()}`,
                //     res,
                // );
            }, API_DELAY); // 67);
        });
    }

*/
