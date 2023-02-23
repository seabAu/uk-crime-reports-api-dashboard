import axios, { isCancel, AxiosError } from "axios";

const API_BASE = "https://data.police.uk/api";
const API_DELAY = 200;

const checkInputs = (inputs = []) => {
    for (var i = 0; i < inputs.length; i++) {
        if (!getIsValid(inputs[i])) {
            return false;
        }
    }
    return true;
};

function getIsValid(value) {
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

const getCrimesStreetsDates = () => {
    // https://data.police.uk/docs/method/crimes-street-dates/
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/crimes-street-dates`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getLastUpdated = () => {
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/crime-last-updated`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getCategories = () => {
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/crime-categories`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getForces = () => {
    // https://data.police.uk/api/forces
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/forces`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getForceInfo = (force) => {
    // https://data.police.uk/docs/method/force/
    if (!checkInputs([force])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/forces/${force}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getForceOfficers = (force) => {
    if (!checkInputs([force])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/forces/${force}/people`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getNeighbourhoodTeam = (force, neighborhood_id) => {
    // https://data.police.uk/api/leicestershire/NC04/people
    if (!checkInputs([force, neighborhood_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/${force}/${neighborhood_id}/people`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getCrimeReports = (category, force, date) => {
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

function getCrimeReportsMulti(category, force, date) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let res;
            console.log(
                `BEFORE fetch = (${category}, ${force}, ${date}) ${new Date()}`,
            );
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
                    console.log("There was a SyntaxError", error);
                } else {
                    console.log("There was an error", error);
                }
            }
            // .catch((error) => reject(error));
            console.log(
                `Resolved fetch = (${category}, ${force}, ${date})! ${new Date()}`,
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
    
const getCrimeReportsAtLocation = (latitude, longitude) => {
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

const getStopReports = (category, force, date) => {
    // https://data.police.uk/api/stops-street?lat=52.629729&lng=-1.131592&date=2018-06
    // https://data.police.uk/api/stops-street?poly=52.2,0.5:52.8,0.2:52.1,0.88&date=2018-06
    if (!checkInputs([category, force, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/stops-no-location?force=${force}&date=${date}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getStopReportsAtLocation = (location_id, date) => {
    // https://data.police.uk/api/stops-at-location?location_id=883407&date=2017-01
    if (!checkInputs([location_id, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(
            `${API_BASE}/stops-at-location?location_id=${location_id}&date=${date}`,
        )
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getStopReportNoLocation = (force, date) => {
    // https://data.police.uk/api/stops-no-location?force=cleveland&date=2017-01
    if (!checkInputs([force, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/stops-no-location?force=${force}&date=${date}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getStopReportsByForce = (force, date) => {
    // https://data.police.uk/api/stops-force?force=avon-and-somerset&date=2017-01
    if (!checkInputs([force, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/stops-force?force=${force}&date=${date}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getNeighbourhoodList = (force) => {
    if (!checkInputs([force])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    // console.log("API::getNeighbourhoodList: ", force);
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/${force}/neighbourhoods`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getNeighbourhoodInformation = (force, location_id) => {
    if (!checkInputs([force, location_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    // console.log( "API::getNeighbourhoodInformation: ", force, location_id );
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/${force}/${location_id}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getNeighbourhoodCoordinates = (force, neighbourhood_id) => {
    if (!checkInputs([force, neighbourhood_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    const response = new Promise((resolve, reject) => {
        fetch(`${API_BASE}/${force}/${neighbourhood_id}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
    if (response) {
        return [response.centre.latitude, response.centre.longitude];
    } else {
        return [];
    }
};

const getNeighbourhoodFromCoordinates = (latitude, longitude) => {
    // https://data.police.uk/api/locate-neighbourhood?q=51.500617,-0.124629
    if (!checkInputs([latitude, longitude])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    // console.log( "API::getNeighbourhoodInformation: ", force, location_id );
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/locate-neighbourhood?q=${latitude},${longitude}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getNeighbourhoodEvents = (force, neighborhood_id) => {
    // Response: https://data.police.uk/docs/method/neighbourhood-events/
    if (!checkInputs([force, neighborhood_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/${force}/${neighborhood_id}/events`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getNeighbourhoodBoundary = (force, neighborhood_id) => {
    // Response: https://data.police.uk/docs/method/neighbourhood-boundary/
    if (!checkInputs([force, neighborhood_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/${force}/${neighborhood_id}/boundary`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getStreetLevelCrimesByCoordinates = (latitude, longitude, date) => {
    // Response: https://data.police.uk/docs/method/crime-street/
    if (!checkInputs([latitude, longitude, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(
            `${API_BASE}/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=${date}`,
        )
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getStreetLevelCrimesByPolygon = (polyObjArray = [], date) => {
    // Response: https://data.police.uk/docs/method/crime-street/
    if (!checkInputs([polyObjArray, date])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    let poly = polyObjArray
        .map((point) => {
            if ("latitude" in point && "longitude" in point) {
                return `${point.latitude},${point.longitude}`;
            } else {
                return ``;
            }
        })
        .join(":");
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/crimes-street/all-crime?poly=${poly}&date=${date}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getCrimeOutcomes = (crime_id) => {
    // Response: https://data.police.uk/docs/method/outcomes-for-crime/
    if (!checkInputs([crime_id])) {
        return "ERR: INVALID/UNDEFINED INPUT";
    }
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/outcomes-for-crime?${crime_id}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

export {
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
};
