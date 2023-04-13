import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Select from '../../components/Form/Select';
import Form from '../../components/Form/Form';
import * as util from '../../utilities/index';

const API_BASE = "https://data.police.uk/api"; // TODO :: Put this and the queryconfig in its own file.

const QueryForm = ({
    query,
    setQuery,
    isFetching,
    abort,
    setAbort,

    // Arrays of options to pass into the query form on the query menu.
    categories,
    forces,
    dates,
    forceNeighborhoods,

    // Arrays of selected options for the query form on the query menu.
    category,
    force,
    forceNeighborhood,
    date,

    // State functions for the query form to use to set the new values when selected.
    setCategory,
    setForce,
    setForceNeighborhood,
    setDate,

    // Search function
    handleSearch,
}) => {
    // Form helper functions
    const getCategoryOptions = () => {
        if (categories) {
            return categories.map((option, index) => {
                return {
                    key: `${index}`,
                    value: `${option.url}`,
                    label: `${option.name}`,
                };
            });
        }
    };
    const getForceOptions = () => {
        if (forces) {
            return forces.map((option, index) => {
                return {
                    key: `${index}`,
                    value: `${option.id}`,
                    label: `${option.name}`,
                };
            });
        }
    };
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
    const getForceNeighborhoodOptions = () => {
        if (forceNeighborhoods) {
            let neighborhoodsTemp = forceNeighborhoods;
            return neighborhoodsTemp.map((option, index) => {
                return {
                    key: `${index}`,
                    value: `${option.id}`,
                    label: `${option.name}`,
                };
            });
        }
    };

    let DateOptions = getDateOptions();
    let CategoryOptions = getCategoryOptions();
    let ForceOptions = getForceOptions();
    let ForceNeighborhoodOptions = getForceNeighborhoodOptions();

    let queryConfig = [
        {
            id: "crimes-no-location",
            api: "crimes-no-location",
            label: "Get Crime Data (No Location)",
            // apiCall: "getCrimeReports(category, force, date)",
            apiValues: {
                category: category,
                force: force,
                date: date,
            },

            apiCall(queryobj) {
                let callsArray = [];
                if (queryobj) {
                    // let datesArray = getSelectedDates(queryobj.apiValues.date);
                    let datesArray = queryobj.apiValues.date;

                    if (datesArray.length > 0) {
                        datesArray.forEach((month) => {
                            callsArray.push({
                                vars: {
                                    category: queryobj.apiValues.category,
                                    force: queryobj.apiValues.force,
                                    date: month,
                                },
                                src: `${queryobj.api}`,
                                url: `${API_BASE}/${queryobj.api}?category=${queryobj.apiValues.category}&force=${queryobj.apiValues.force}&date=${month}`,
                            });
                        });
                    }
                } else {
                    console.error(
                        `apicall called with no query data provided.`,
                    );
                }

                return callsArray;
            },
            // apiValues: [ category, force, date ],
            form: {
                formOnSubmit: handleSearch, // handleSearchCrimesNoLocation, // handleSearch,
                fields: [
                    {
                        type: "select",
                        label: "Choose a month",
                        id: "date",
                        name: "date",
                        required: true,
                        value: date,
                        // onChange: (event)=>formUpdateDate( event ),
                        onChange: setDate,
                        // (value) => {
                        //     if (value === "all_dates") {
                        //         // Get all but the first, which is "all_dates". API won't know what to do with that.
                        //         //setDate(dates.splice(1, -1));
                        //         setDate(value);
                        //     } else {
                        //         setDate(value);
                        //     }
                        // },
                        //onChange: (event) => {setDate(event.target.value);},
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
                        type: "select",
                        label: "Choose a category",
                        id: "category",
                        name: "category",
                        required: true,
                        value: category,
                        // onChange: (event) => {setCategory(event.target.value);},
                        onChange: setCategory,
                        disabled: { isFetching },
                        // isInvalid: false,
                        multiple: "",
                        unsetOption: "Select Category*",
                        options: CategoryOptions,
                    },

                    {
                        type: "select",
                        label: "Choose a police force",
                        id: "force",
                        name: "force",
                        required: true,
                        value: force,
                        // onChange: (event) => {setForce(event.target.value);}, // setForce,
                        onChange: setForce,
                        disabled: { isFetching },
                        // isInvalid: false,
                        multiple: "",
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                ],
            },
        },
        {
            id: "crimes-at-location", // id: "crimes-all-locations",
            api: "crimes-at-location", // id: "crimes-all-locations",
            label: "Get Crime Data (By Location)", // label: "Get Crime Data For Jurisdiction (All Locations)",
            apiValues: {
                force: force,
                date: date,
                neighborhood: forceNeighborhood,
                location_centre: "",
                location_id: "",
            },

            apiCall(queryobj) {
                let callsArray = [];
                if (queryobj) {
                    let datesArray = queryobj.apiValues.date; // Contains date callstrings.
                    // let neighborhoods = queryobj.apiValues.neighborhood; // Contains neighborhood IDs.
                    let neighborhoodsArray = queryobj.apiValues.location_id; // Contains full neighborhood data.
                    // let neighborhoodDataArray = queryobj.apiValues.location_centre; // Contains full neighborhood data.

                    neighborhoodsArray.forEach((neighborhood) => {
                        let lat = util.ao.deepGetKey(neighborhood, "latitude");
                        let lng = util.ao.deepGetKey(neighborhood, "longitude");
                        datesArray.forEach((month) => {
                            callsArray.push({
                                vars: {
                                    // force: force,
                                    // location_id: neighborhood.id,
                                    lat: lat,
                                    lng: lng,
                                    date: month,
                                    // neighborhood: neighborhood,
                                    neighborhood_id: neighborhood.id ?? "",
                                    neighborhood_info:
                                        neighborhood.neighborhood_info ?? "",
                                },
                                src: `${queryobj.api}`,
                                // url: `${API_BASE}/${queryobj.id}?location_id=${neighborhood.id}&date=${month}`,
                                url: `${API_BASE}/${queryobj.api}?date=${month}&lat=${lat}&lng=${lng}`,
                            });
                        });
                    });
                } else {
                    console.error(
                        `apicall called with no query data provided.`,
                    );
                }

                return callsArray;
            },
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            // select elements for the force -> force-neighborhood -> force-neighborhood-data -> lat/long.
            form: {
                formOnSubmit: handleSearch, // handleSearchCrimesByLocation,
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
                        type: "select",
                        label: "Choose a police force",
                        id: "force",
                        name: "force",
                        required: true,
                        value: force,
                        // onChange: (event) => {setForce(event.target.value);},
                        onChange: setForce,
                        disabled: { isFetching },
                        // isInvalid: false,
                        multiple: "",
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                    {
                        type: "select",
                        label: "Choose a neighborhood",
                        id: "forceNeighborhood",
                        name: "forceNeighborhood",
                        required: true,
                        value: forceNeighborhood ? forceNeighborhood : [],
                        // ? "id" in forceNeighborhood
                        //     ? forceNeighborhoods.map((neighborhood, index) => neighborhood.id)
                        //     : ""
                        // : "",
                        onChange: (selected) => {
                            // formUpdateNeighborhood(selected);
                            if (Array.isArray(selected)) {
                                setForceNeighborhood(selected.flat());
                            } else {
                                setForceNeighborhood([selected]);
                            }
                        },
                        multiple: "multiple",
                        disabled: { isFetching },
                        // isInvalid: false,
                        unsetOption: "Select Neighborhood*",
                        options: [
                            {
                                value: "all_neighborhoods",
                                label: "All Neighborhoods",
                            },
                            ...ForceNeighborhoodOptions,
                        ],
                    },
                ],
            },
        },
        {
            id: "stops-no-location",
            api: "stops-no-location",
            label: "Get Stops Data (No Location)",
            apiValues: {
                force: force,
                date: date,
            },
            apiCall(queryobj) {
                let callsArray = [];
                if (queryobj) {
                    // let datesArray = getSelectedDates( date );
                    let datesArray = queryobj.apiValues.date;

                    datesArray.forEach((month) => {
                        callsArray.push({
                            vars: {
                                force: queryobj.apiValues.force,
                                date: month,
                            },
                            src: `${queryobj.api}`,
                            url: `${API_BASE}/${queryobj.api}?force=${queryobj.apiValues.force}&date=${month}`,
                        });
                        console.log(
                            `Queryconfig :: ${queryobj.api} :: ${queryobj.label} :: callsArray = `,
                            callsArray,
                            `, this.apiValues.force = `,
                            force,
                            `, this.apiValues.date = `,
                            date,
                        );
                    });
                } else {
                    console.error(
                        `apicall called with no query data provided.`,
                    );
                }
                return callsArray;
            },
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
                        type: "select",
                        label: "Choose a police force",
                        id: "force",
                        name: "force",
                        required: true,
                        value: force,
                        // onChange: (event) => {setForce(event.target.value);}, // setForce,
                        onChange: setForce,
                        multiple: "",
                        disabled: { isFetching },
                        // isInvalid: false,
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                ],
            },
        },
        {
            id: "stops-at-location",
            api: "stops-at-location",
            label: "Get Stops Data (At Location)",
            apiValues: {
                location_id: forceNeighborhoods,
                location_centre: "",
                date: date,
            },
            apiCall: async (queryobj = {}) => {
                let callsArray = [];
                if (queryobj) {
                    // let datesArray = getSelectedDates(queryobj.apiValues.date);
                    let datesArray = queryobj.apiValues.date;
                    // let neighborhoodsArray = queryobj.apiValues.location_id;
                    let neighborhoodDataArray =
                        queryobj.apiValues.location_centre;

                    neighborhoodDataArray.forEach((neighborhood) => {
                        if (util.ao.has(neighborhood, "id")) {
                            datesArray.forEach((month) => {
                                callsArray.push({
                                    vars: {
                                        // force: force,
                                        location_id: neighborhood.id,
                                        date: month,
                                    },
                                    src: `${queryobj.api}`,
                                    url: `${API_BASE}/${queryobj.api}?location_id=${neighborhood.id}&date=${month}`,
                                });
                            });
                        }
                    });
                } else {
                    console.error(
                        `apicall called with no query data provided.`,
                    );
                }
                return callsArray;
            },
            form: {
                // formOnSubmit: handleSequentialSearchByLocation,
                formOnSubmit: handleSearch, // handleSearchCrimesByLocation, // handleSearchByLocation,
                fields: [
                    {
                        type: "select",
                        label: "Choose a police force",
                        id: "force",
                        name: "force",
                        value: force,
                        // onChange: (event) => {setForce(event.target.value);},
                        onChange: setForce,
                        disabled: { isFetching },
                        required: true,
                        multiple: "",
                        // isInvalid: false,
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                    {
                        type: "select",
                        label: "Choose a neighborhood",
                        id: "forceNeighborhood",
                        name: "forceNeighborhood",
                        required: true,
                        value: forceNeighborhood ? forceNeighborhood : [],
                        // ? "id" in forceNeighborhood
                        //     ? forceNeighborhoods.map((neighborhood, index) => neighborhood.id)
                        //     : ""
                        // : "",
                        onChange: (selected) => {
                            // formUpdateNeighborhood(selected);
                            if (Array.isArray(selected)) {
                                setForceNeighborhood(selected.flat());
                            } else {
                                setForceNeighborhood([selected]);
                            }
                        },
                        multiple: "multiple",
                        disabled: { isFetching },
                        // isInvalid: false,
                        unsetOption: "Select Neighborhood*",
                        options: [
                            {
                                value: "all_neighborhoods",
                                label: "All Neighborhoods",
                            },
                            ...ForceNeighborhoodOptions,
                        ],
                    },
                    // {
                    //     type: "number",
                    //     label: "Location ID",
                    //     id: "location_id",
                    //     name: "location_id",
                    //     required: true,
                    //     disabled: { isFetching },
                    //     isInvalid: { forceIsInvalid },
                    //     value: neighborhoodCoordinates.id
                    //         ? neighborhoodCoordinates.id
                    //         : null,
                    //     defaultValue: neighborhoodCoordinates.id
                    //         ? null
                    //         : neighborhoodCoordinates.id,
                    //     onChange: (event) => {
                    //         setNeighborhoodCoordinates({
                    //             id: event.target.value,
                    //             latitude: neighborhoodCoordinates
                    //                 ? neighborhoodCoordinates.latitude
                    //                 : 0.0,
                    //             longitude: neighborhoodCoordinates
                    //                 ? neighborhoodCoordinates.longitude
                    //                 : 0.0,
                    //         });
                    //     },
                    //     placeholder: `Location ID`,
                    // },
                ],
            },
        },
    ];

    return (
        <div className="query-form-container">
            <div className="query-form" key="query-form-query">
                <form className="form-container"  key="query-form-query-form-container">
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
                        name={`QueryForm`}
                        formID={`QueryForm`}
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
                {query && queryConfig && isFetching && (
                    <button
                        key={`abort-query-button`}
                        id={`abort-query-button`}
                        className={`button header-nav-button ${
                            abort === true ? "active" : ""
                        }`}
                        onClick={(event) => {
                            if (abort === true) {
                                setAbort(false);
                            } else if (abort === false) {
                                setAbort(true);
                            }
                        }}>
                        Abort Query
                    </button>
                )}
            </div>
        </div>
    );
};

QueryForm.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    handleSearch: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    forces: PropTypes.array.isRequired,
    category: PropTypes.string.isRequired,
    force: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    setCategory: PropTypes.func.isRequired,
    setForce: PropTypes.func.isRequired,
    setDate: PropTypes.func.isRequired,
    // categoryIsInvalid: PropTypes.bool.isRequired,
    // forceIsInvalid: PropTypes.bool.isRequired,
    // setCategoryIsInvalid: PropTypes.func.isRequired,
    // setForceIsInvalid: PropTypes.func.isRequired,
};

export default QueryForm;
