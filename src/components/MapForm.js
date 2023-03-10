import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Select from "./Form/Select";
import Form from "./Form/Form";
import {
    arrayIsValid,
    deepGetKey,
    deepSearch,
    has,
} from "./Utilities/ObjectUtils";
import { printDebug } from "./Utilities/Utilities";
const API_BASE = "https://data.police.uk/api"; // TODO :: Put this and the queryconfig in its own file.

const MapForm = ({
    query,
    setQuery,
    isFetching,

    // Arrays of options to pass into the query form on the query menu.
    selectedAreas,
    dates,

    // Arrays of selected options for the query form on the query menu.
    date,
    coordinates,
    selectedArea,

    // State functions for the query form to use to set the new values when selected.
    setDate,
    setCoordinates,
    setSelectedArea,
    setSelectedAreas,

    // Search function
    handleSearch,
}) => {
    // Form helper functions
    const getDateOptions = () => {
        if (dates) {
            return dates.map((option, index) => {
                return {
                    key: `${index}`,
                    value: `${option.key}`,
                    label: `${option.value}`,
                };
            });
        }
    };
    let DateOptions = getDateOptions();

    let queryConfig = [
        {
            id: "crimes-at-location-point",
            api: "crimes-at-location",
            label: "Get Crime Data (By Location, by point)",
            apiValues: {
                date: date,
                coordinates: coordinates,
            },

            apiCall(queryobj) {
                let callsArray = [];
                if (queryobj) {
                    let datesArray = queryobj.apiValues.date;
                    let coordinates = queryobj.apiValues.coordinates;
                    if (arrayIsValid(coordinates, true)) {
                        coordinates.forEach((coordinate) => {
                            if ("lat" in coordinate && "lng" in coordinate) {
                                if (coordinate.lat && coordinate.lng) {
                                    datesArray.forEach((month) => {
                                        callsArray.push({
                                            vars: {
                                                lat: coordinate.lat,
                                                lng: coordinate.lng,
                                                date: month,
                                            },
                                            src: `${queryobj.api}`,
                                            url: `${API_BASE}/${queryobj.api}?date=${month}&lat=${coordinate.lat}&lng=${coordinate.lng}`,
                                        });
                                    });
                                }
                            }
                        });
                    }
                } else {
                    console.error(
                        `apicall called with no query data provided.`,
                    );
                }

                return callsArray;
            },
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            form: {
                formOnSubmit: handleSearch,
                fields: [
                    {
                        type: "select",
                        label: "Choose a month",
                        id: "date",
                        name: "date",
                        required: true,
                        value: date,
                        onChange: setDate,
                        disabled: { isFetching },
                        multiple: "multiple",
                        unsetOption: "Select month*",
                        options: [
                            {
                                value: "all_dates",
                                label: "All Dates",
                            },
                            ...DateOptions,
                        ],
                    },
                    {
                        type: "labellist",
                        label: "Selected coordinates",
                        id: "coordinates-list",
                        name: "coordinates-list",
                        required: false,
                        value: selectedAreas,
                        disabled: { isFetching },
                    },
                    // {
                    //     type: "number",
                    //     label: "Latitude",
                    //     id: "latitude",
                    //     name: "latitude",
                    //     required: true,
                    //     disabled: { isFetching },
                    //     isInvalid: {},
                    //     value: coordinates.lat ? coordinates.lat : null,
                    //     defaultValue: coordinates.lat ? null : coordinates.lat,
                    //     onChange: (event) => {
                    //         setCoordinates({
                    //             ...coordinates,
                    //             lat: event.target.value,
                    //         });
                    //     },
                    //     placeholder: `Latitude`,
                    // },
                    // {
                    //     type: "number",
                    //     label: "Longitude",
                    //     id: "longitude",
                    //     name: "longitude",
                    //     required: true,
                    //     disabled: { isFetching },
                    //     isInvalid: {},
                    //     value: coordinates.lng ? coordinates.lng : null,
                    //     defaultValue: coordinates.lng ? null : coordinates.lng,
                    //     onChange: (event) => {
                    //         setCoordinates({
                    //             ...coordinates,
                    //             lng: event.target.value,
                    //         });
                    //     },
                    //     placeholder: `Longitude`,
                    // },
                ],
            },
        },
        {
            id: "outcomes-at-location-point",
            api: "outcomes-at-location",
            label: "Get Crime Outcomes (By Location)",
            apiValues: {
                date: date,
                coordinates: coordinates,
            },

            apiCall(queryobj) {
                // Latitude/longitude
                // https://data.police.uk/api/outcomes-at-location?date=2017-01&lat=52.629729&lng=-1.131592
                let callsArray = [];
                if (queryobj) {
                    let datesArray = queryobj.apiValues.date;
                    let coordinates = queryobj.apiValues.coordinates;
                    if (arrayIsValid(coordinates, true)) {
                        coordinates.forEach((coordinate) => {
                            if ("lat" in coordinate && "lng" in coordinate) {
                                if (coordinate.lat && coordinate.lng) {
                                    datesArray.forEach((month) => {
                                        callsArray.push({
                                            vars: {
                                                lat: coordinate.lat,
                                                lng: coordinate.lng,
                                                date: month,
                                            },
                                            src: `${queryobj.api}`,
                                            url: `${API_BASE}/${queryobj.api}?date=${month}&lat=${coordinate.lat}&lng=${coordinate.lng}`,
                                        });
                                    });
                                }
                            }
                        });
                    }
                } else {
                    console.error(
                        `apicall called with no query data provided.`,
                    );
                }

                return callsArray;
            },
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            form: {
                formOnSubmit: handleSearch,
                fields: [
                    {
                        type: "select",
                        label: "Choose a month",
                        id: "date",
                        name: "date",
                        required: true,
                        value: date,
                        onChange: setDate,
                        disabled: { isFetching },
                        multiple: "multiple",
                        unsetOption: "Select month*",
                        options: [
                            {
                                value: "all_dates",
                                label: "All Dates",
                            },
                            ...DateOptions,
                        ],
                    },
                    {
                        type: "labellist",
                        label: "Selected coordinates",
                        id: "coordinates-list",
                        name: "coordinates-list",
                        required: false,
                        value: selectedAreas,
                        disabled: { isFetching },
                    },
                ],
            },
        },
        {
            id: "outcomes-at-location-area",
            api: "outcomes-at-location",
            label: "Get Crime Outcomes (By Location, by area)",
            apiValues: {
                date: date,
                areas: selectedAreas,
            },

            apiCall(queryobj) {
                // Custom area
                // https://data.police.uk/api/outcomes-at-location?date=2017-01&poly=52.268,0.543:52.794,0.238:52.130,0.478
                let callsArray = [];
                if (queryobj) {
                    let datesArray = queryobj.apiValues.date;
                    let areas = queryobj.apiValues.areas;

                    // For each area, the coordinates will be extracted and formatted like:
                    // [lat],[lng]:[lat],[lng]:[lat],[lng]
                    areas.forEach((area, index) => {
                        // console.log( "Building map sidebar buttons :: report #", index, " = ", report );
                        if (area) {
                            let coordinatesList = deepGetKey(
                                area,
                                "coordinates",
                            );
                            if (arrayIsValid(coordinatesList, true)) {
                                let coordinatesStr = coordinatesList
                                    .map((point) => {
                                        if ("lat" in point && "lng" in point) {
                                            return `${point.lat},${point.lng}`;
                                        } else {
                                            return ``;
                                        }
                                    })
                                    .join(":");

                                datesArray.forEach((month) => {
                                    let call = {
                                        vars: {
                                            poly: coordinatesStr,
                                            date: month,
                                        },
                                        src: `${queryobj.api}`,
                                        url: `${API_BASE}/${queryobj.api}?date=${month}&poly=${coordinatesStr}`,
                                    };
                                    callsArray.push(call);
                                    console.log(
                                        `MapForm.js :: ApiCall :: ${queryobj.api} :: call = `,
                                        call,
                                    );
                                });
                            }
                        }
                    });
                } else {
                    console.error(
                        `apicall called with no query data provided.`,
                    );
                }

                return callsArray;
            },
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            form: {
                formOnSubmit: handleSearch,
                fields: [
                    {
                        type: "select",
                        label: "Choose a month",
                        id: "date",
                        name: "date",
                        required: true,
                        value: date,
                        onChange: setDate,
                        disabled: { isFetching },
                        multiple: "multiple",
                        unsetOption: "Select month*",
                        options: [
                            {
                                value: "all_dates",
                                label: "All Dates",
                            },
                            ...DateOptions,
                        ],
                    },
                ],
            },
        },
        {
            id: "stop-and-searches-at-location-area",
            api: "stops-street",
            label: "Get Stop and Searches by Area",
            apiValues: {
                date: date,
                areas: selectedAreas,
            },

            apiCall(queryobj) {
                // Custom area
                // https://data.police.uk/api/outcomes-at-location?date=2017-01&poly=52.268,0.543:52.794,0.238:52.130,0.478
                let callsArray = [];
                if (queryobj) {
                    let datesArray = queryobj.apiValues.date;
                    let areas = queryobj.apiValues.areas;

                    // For each area, the coordinates will be extracted and formatted like:
                    // [lat],[lng]:[lat],[lng]:[lat],[lng]
                    areas.forEach((area, index) => {
                        // console.log( "Building map sidebar buttons :: report #", index, " = ", report );
                        if (area) {
                            let coordinatesList = deepGetKey(
                                area,
                                "coordinates",
                            );
                            if (arrayIsValid(coordinatesList, true)) {
                                let coordinatesStr = coordinatesList
                                    .map((point) => {
                                        if ("lat" in point && "lng" in point) {
                                            return `${point.lat},${point.lng}`;
                                        } else {
                                            return ``;
                                        }
                                    })
                                    .join(":");

                                datesArray.forEach((month) => {
                                    let call = {
                                        vars: {
                                            poly: coordinatesStr,
                                            date: month,
                                        },
                                        src: `${queryobj.api}`,
                                        // url: `${API_BASE}/${queryobj.api}?date=${month}&poly=${coordinatesStr}`,
                                        url: `${API_BASE}/${queryobj.api}?poly=${coordinatesStr}&date=${month}`,
                                    };
                                    callsArray.push(call);
                                    console.log(
                                        `MapForm.js :: ApiCall :: ${queryobj.api} :: call = `,
                                        call,
                                    );
                                });
                            }
                        }
                    });
                } else {
                    console.error(
                        `apicall called with no query data provided.`,
                    );
                }

                return callsArray;
            },
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            form: {
                formOnSubmit: handleSearch,
                fields: [
                    {
                        type: "select",
                        label: "Choose a month",
                        id: "date",
                        name: "date",
                        required: true,
                        value: date,
                        onChange: setDate,
                        disabled: { isFetching },
                        multiple: "multiple",
                        unsetOption: "Select month*",
                        options: [
                            {
                                value: "all_dates",
                                label: "All Dates",
                            },
                            ...DateOptions,
                        ],
                    },
                ],
            },
        },
    ];

    return (
        <div className="query-form-container">
            <div className="query-form" key="query-form-query">
                <form
                    className="form-container"
                    key="query-form-query-form-container">
                    <Select
                        height={50}
                        width={100}
                        label="Select a query"
                        id={`querySelect`}
                        name={`querySelect`}
                        value={query.id ?? ""}
                        unsetOption={`Select Query`}
                        optionsConfig={queryConfig.map((queryInfo, index) => {
                            return {
                                key: `${index}`,
                                value: `${queryInfo.id}`,
                                label: `${queryInfo.label}`,
                            };
                        })}
                        disabled={isFetching}
                        onChange={
                            (selected) => {
                                console.log(
                                    "Query selected: ",
                                    selected,
                                    queryConfig.filter(
                                        (value) => value.id === selected,
                                    )[0],
                                );
                                setQuery(
                                    queryConfig.filter(
                                        (value) => value.id === selected,
                                    )[0],
                                );
                            }
                            // setQuery
                        }></Select>
                </form>
            </div>
            <hr className="hr-section-border" />
            <div className="query-form" key="query-form-fetch">
                {query && queryConfig && (
                    <Form
                        key="query-form-fetch-form-container"
                        name={`MapForm`}
                        formID={`MapForm`}
                        onSubmit={
                            queryConfig.filter(
                                (value) => value.id === query.id,
                            )[0].form.formOnSubmit
                        }
                        // onChange={}
                        model={
                            queryConfig.filter(
                                (value) => value.id === query.id,
                            )[0].form
                        }
                        disabled={isFetching}
                        // isFetching={isFetching}
                    ></Form>
                )}
                {query && queryConfig && (
                    <button
                        key={`map-query-button`}
                        id={`map-query-button`}
                        className={`button`}
                        onClick={(event) => {
                            handleSearch(event);
                        }}>
                        Search with selected areas
                    </button>
                )}
            </div>
        </div>
    );
};

MapForm.propTypes = {
    query: PropTypes.object.isRequired,
    setQuery: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    handleSearch: PropTypes.func.isRequired,
    dates: PropTypes.array.isRequired,
    date: PropTypes.string.isRequired,
    selectedAreas: PropTypes.array.isRequired,
    selectedArea: PropTypes.array.isRequired,
    coordinates: PropTypes.array.isRequired,
    setDate: PropTypes.func.isRequired,
    setCoordinates: PropTypes.func.isRequired,
    setSelectedArea: PropTypes.func.isRequired,
    setSelectedAreas: PropTypes.func.isRequired,
};

export default MapForm;
