const API_BASE = "https://data.police.uk/api";

const checkInputs = (inputs = []) => {
    for (var i = 0; i < inputs.length; i++) {
        if (!getIsValid(inputs[i])) {
            return false;
        }
    }
    return true;
};

function getIsValid ( value )
{
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

const getCategories = () => {
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/crime-categories`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getForces = () => {
    return new Promise((resolve, reject) => {
        fetch(`${API_BASE}/forces`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
};

const getCrimeReports = (category, force, date) => {
    if(!checkInputs([category, force, date])) {
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
const getCrimeReportsAtLocation = (latitude, longitude) => {
    if(!checkInputs([latitude, longitude])) {
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
    if(!checkInputs([category, force, date])) {
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
    if(!checkInputs([location_id, date])) {
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

const getNeighbourhoodList = (force) => {
    if(!checkInputs([force])) {
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
    if(!checkInputs([force, location_id])) {
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
    if(!checkInputs([force, neighbourhood_id])) {
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

const getCrimeOutcomes = ( crime_id ) =>
{
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
    getNeighbourhoodEvents,
    getNeighbourhoodBoundary,
    getCrimeOutcomes,
};
