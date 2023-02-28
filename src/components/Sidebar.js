import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import DebugFields from "./Form/DebugFields";
import Select from "./Form/Select";
import QueryForm from "./Form/QueryForm";
import { FaDatabase, FaChartBar, FaMap, FaCog } from "react-icons/fa";

const Sidebar = ({
    className,
    query,
    setQuery,
    queryString,
    categories,
    forces,
    dates,
    forceNeighborhoods,
    category,
    force,
    forceNeighborhood,
    forceNeighborhoodData,
    date,
    neighborhoodId,
    neighborhoodCoordinates,
    setCategory,
    setForce,
    setForceNeighborhood,
    setForceNeighborhoodData,
    setDate,
    setNeighborhoodId,
    setNeighborhoodCoordinates,
    onSetForceGetNeighborhoods,
    onSetForceNeighborhoodGetData,
    handleSearch,
    handleSearchAtLocation,
    handleSearchByLocation,
    handleSequentialSearch,
    handleSequentialSearchByLocation,
    handleSequentialSearchAllLocationsAllDates,
    categoryIsInvalid,
    forceIsInvalid,
    isFetching,
    showSidebar,
    theme,
    setTheme,
    menu,
    setMenu,
}) => {
    // Form helper functions
    const getDateOptions = () => {
        if (dates) {
            let tempDates = dates;

            return tempDates.map((option, index) => {
                return {
                    key: `${index}`,
                    value: `${option.key}`,
                    label: `${option.value}`,
                };
            });
        }
    };
    const getCategoryOptions = () => {
        // console.log("getCategoryOptions(): ", categories);
        if (categories) {
            return categories.map((category, index) => {
                return {
                    key: `${index}`,
                    value: `${category.url}`,
                    label: `${category.name}`,
                };
            });
        }
    };
    const getForceOptions = () => {
        // console.log("getForceOptions(): ", forces);
        if (forces) {
            return forces.map((force, index) => {
                return {
                    key: `${index}`,
                    value: `${force.id}`,
                    label: `${force.name}`,
                };
            });
        }
    };

    const getForceNeighborhoodOptions = () => {
        // console.log("getForceNeighborhoodOptions(): ", forceNeighborhoods);
        if (forceNeighborhoods) {
            let neighborhoodsTemp = forceNeighborhoods;
            // neighborhoodsTemp.unshift( { id: "all_neighborhoods", name: "All Neighborhoods" } );
            return neighborhoodsTemp.map((neighborhood, index) => {
                return {
                    key: `${index}`,
                    value: `${neighborhood.id}`,
                    label: `${neighborhood.name}`,
                };
            });
        }
    };

    let DateOptions = getDateOptions();
    let CategoryOptions = getCategoryOptions();
    let ForceOptions = getForceOptions();
    let ForceNeighborhoodOptions = getForceNeighborhoodOptions();

    const queryConfig = [
        {
            id: "crimes-no-location",
            label: "Get Crime Data (No Location)",
            apiCall: "getCrimeReports(category, force, date)",
            apiValues: [category, force, date],
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
                        multiple: "multiple",
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
                        unsetOption: "Select month*",
                        options: DateOptions,
                    },

                    {
                        type: "select",
                        label: "Choose a category",
                        id: "category",
                        name: "category",
                        required: true,
                        value: category,
                        multiple: "",
                        // onChange: (event) => {setCategory(event.target.value);},
                        onChange: setCategory,
                        disabled: { isFetching },
                        isInvalid: { categoryIsInvalid },
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
                        multiple: "",
                        // onChange: (event) => {setForce(event.target.value);}, // setForce,
                        onChange: setForce,
                        disabled: { isFetching },
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                ],
            },
        },
        {
            id: "crimes-no-location-all-dates",
            label: "Get Crime Data (No Location, All Dates)",
            apiCall: "getCrimeReports(category, force, date)",
            apiValues: [category, force, date],
            form: {
                formOnSubmit: handleSequentialSearch,
                fields: [
                    {
                        type: "select",
                        label: "Choose a month",
                        id: "date",
                        name: "date",
                        required: true,
                        value: [date],
                        // onChange: (event)=>formUpdateDate( event ),
                        onChange: setDate,
                        // ( value ) =>
                        //     {
                        //     if (
                        //         value !== "" &&
                        //         value !== undefined &&
                        //         value !== null
                        //     ) {
                        //         if (date.indexOf(value) > -1) {
                        //             setDate(
                        //                 date.filter((item) => {
                        //                     return item !== value;
                        //                 }),
                        //             );
                        //         } else {
                        //             setDate(date.concat(value));
                        //         }
                        //     }
                        //
                        // },
                        // stateFunction: setDate,
                        //onChange: (event) => {setDate(event.target.value);},
                        multiple: "multiple",
                        disabled: { isFetching },
                        unsetOption: "Select month*",
                        options: DateOptions,
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
                        // multiple: "",
                        disabled: { isFetching },
                        isInvalid: { categoryIsInvalid },
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
                        // multiple: "",
                        disabled: { isFetching },
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                ],
            },
        },
        {
            id: "crimes-at-location-no-date",
            label: "Get Crime Data (At Location)",
            apiCall: "getCrimeReportsAtLocation(latitude, longitude)",
            apiValues: [
                neighborhoodCoordinates.latitude,
                neighborhoodCoordinates.longitude,
            ],
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            // select elements for the force -> force-neighborhood -> force-neighborhood-data -> lat/long.
            form: {
                formOnSubmit: handleSearchAtLocation,
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
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                    {
                        type: "select",
                        label: "Choose a neighborhood",
                        id: "forceNeighborhood",
                        name: "forceNeighborhood",
                        required: true,
                        value: forceNeighborhood
                            ? "id" in forceNeighborhood
                                ? forceNeighborhood.id
                                : ""
                            : "",
                        onChange: (event) => {
                            console.log("formUpdateNeighborhood: ", event);
                            setForceNeighborhood(
                                forceNeighborhoods.find((item) => {
                                    console.log(
                                        "formUpdateNeighborhood: ",
                                        item,
                                    );
                                    return item.id === event;
                                }),
                            );
                        },
                        multiple: "",
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        unsetOption: "Select Police Force Neighborhood*",
                        options: ForceNeighborhoodOptions,
                    },
                    {
                        type: "number",
                        label: "Latitude",
                        id: "latitude",
                        name: "latitude",
                        required: true,
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        value: neighborhoodCoordinates.latitude
                            ? neighborhoodCoordinates.latitude
                            : null,
                        defaultValue: neighborhoodCoordinates.latitude
                            ? null
                            : neighborhoodCoordinates.latitude,
                        onChange: (event) => {
                            console.log(
                                "Latitude onchange :: ",
                                event,
                                event.target.value,
                                neighborhoodCoordinates,
                            );
                            setNeighborhoodCoordinates({
                                latitude: event.target.value,
                                longitude: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.longitude
                                    : 0.0,
                            });
                        },
                        placeholder: `Latitude`,
                    },
                    {
                        type: "number",
                        label: "Longitude",
                        id: "longitude",
                        name: "longitude",
                        required: true,
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        value: neighborhoodCoordinates.longitude
                            ? neighborhoodCoordinates.longitude
                            : null,
                        defaultValue: neighborhoodCoordinates.longitude
                            ? null
                            : neighborhoodCoordinates.longitude,
                        onChange: (event) => {
                            setNeighborhoodCoordinates({
                                latitude: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.latitude
                                    : 0.0,
                                longitude: event.target.value,
                            });
                        },
                        placeholder: `Longitude`,
                    },
                ],
            },
        },
        {
            id: "crimes-at-location-with-dates",
            label: "Get Crime Data (At Location)",
            apiCall: "getCrimeReportsByLocation(date, latitude, longitude)",
            apiValues: [
                date,
                neighborhoodCoordinates.latitude,
                neighborhoodCoordinates.longitude,
            ],
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            // select elements for the force -> force-neighborhood -> force-neighborhood-data -> lat/long.
            form: {
                formOnSubmit: handleSearchByLocation,
                fields: [
                    {
                        type: "select",
                        label: "Choose a month",
                        id: "date",
                        name: "date",
                        required: true,
                        value: date,
                        multiple: "multiple",
                        onChange: setDate,
                        disabled: { isFetching },
                        unsetOption: "Select month*",
                        options: DateOptions,
                    },

                    {
                        type: "select",
                        label: "Choose a police force",
                        id: "force",
                        name: "force",
                        value: force,
                        onChange: setForce,
                        disabled: { isFetching },
                        required: true,
                        multiple: "",
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                    {
                        type: "select",
                        label: "Choose a neighborhood",
                        id: "forceNeighborhood",
                        name: "forceNeighborhood",
                        required: true,
                        value: forceNeighborhood
                            ? "id" in forceNeighborhood
                                ? forceNeighborhood.id
                                : ""
                            : "",
                        onChange: (event) => {
                            console.log("formUpdateNeighborhood: ", event);
                            setForceNeighborhood(
                                forceNeighborhoods.find((item) => {
                                    console.log(
                                        "formUpdateNeighborhood: ",
                                        item,
                                    );
                                    return item.id === event;
                                }),
                            );
                        },
                        multiple: "",
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        unsetOption: "Select Police Force Neighborhood*",
                        options: ForceNeighborhoodOptions,
                    },
                    {
                        type: "number",
                        label: "Location ID",
                        id: "location_id",
                        name: "location_id",
                        required: true,
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        value: neighborhoodCoordinates.id
                            ? neighborhoodCoordinates.id
                            : null,
                        defaultValue: neighborhoodCoordinates.id
                            ? null
                            : neighborhoodCoordinates.id,
                        onChange: (event) => {
                            console.log(
                                "ID onchange :: ",
                                event,
                                event.target.value,
                                neighborhoodCoordinates,
                            );
                            setNeighborhoodCoordinates({
                                id: event.target.value,
                                latitude: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.latitude
                                    : "",
                                longitude: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.longitude
                                    : 0.0,
                            });
                        },
                        placeholder: `Location ID`,
                    },
                    {
                        type: "number",
                        label: "Latitude",
                        id: "latitude",
                        name: "latitude",
                        required: true,
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        value: neighborhoodCoordinates.latitude
                            ? neighborhoodCoordinates.latitude
                            : null,
                        defaultValue: neighborhoodCoordinates.latitude
                            ? null
                            : neighborhoodCoordinates.latitude,
                        onChange: (event) => {
                            console.log(
                                "Latitude onchange :: ",
                                event,
                                event.target.value,
                                neighborhoodCoordinates,
                            );
                            setNeighborhoodCoordinates({
                                id: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.id
                                    : "",
                                latitude: event.target.value,
                                longitude: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.longitude
                                    : 0.0,
                            });
                        },
                        placeholder: `Latitude`,
                    },
                    {
                        type: "number",
                        label: "Longitude",
                        id: "longitude",
                        name: "longitude",
                        required: true,
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        value: neighborhoodCoordinates.longitude
                            ? neighborhoodCoordinates.longitude
                            : null,
                        defaultValue: neighborhoodCoordinates.longitude
                            ? null
                            : neighborhoodCoordinates.longitude,
                        onChange: (event) => {
                            setNeighborhoodCoordinates( {
                                id: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.id
                                    : "",
                                latitude: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.latitude
                                    : 0.0,
                                longitude: event.target.value,
                            });
                        },
                        placeholder: `Longitude`,
                    },
                ],
            },
        },
        {
            id: "crimes-all-locations",
            label: "Get Crime Data For Jurisdiction (All Locations)",
            apiCall: "getCrimeReportsAtLocationMulti(latitude, longitude)",
            apiValues: [force],
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            // select elements for the force -> force-neighborhood -> force-neighborhood-data -> lat/long.
            form: {
                formOnSubmit: handleSequentialSearchByLocation,
                fields: [
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
                        multiple: "",
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                ],
            },
        },
        {
            id: "crimes-all-locations-all-dates",
            label: "Get Crime Data For Jurisdiction (All Locations, All Dates)",
            apiCall: "getCrimeReportsAtLocationMulti(latitude, longitude)",
            apiValues: [force],
            // Provide the lat and long inputs as entry fields, but allow the user to fill it in via provided
            // select elements for the force -> force-neighborhood -> force-neighborhood-data -> lat/long.
            form: {
                formOnSubmit: handleSequentialSearchAllLocationsAllDates,
                fields: [
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
                        multiple: "",
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                ],
            },
        },
        {
            id: "stops-no-location",
            label: "Get Stops Data (No Location)",
            apiCall: "getStopReports(category, force, date)",
            apiValues: [category, force, date],
            form: {
                formOnSubmit: handleSequentialSearch,
                fields: [
                    {
                        type: "select",
                        label: "Choose a month",
                        id: "date",
                        name: "date",
                        required: true,
                        value: [date],
                        onChange: setDate,
                        multiple: "multiple",
                        disabled: { isFetching },
                        unsetOption: "Select month*",
                        options: DateOptions,
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
                        // multiple: "",
                        disabled: { isFetching },
                        isInvalid: { categoryIsInvalid },
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
                        // multiple: "",
                        disabled: { isFetching },
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                ],
            },
        },
        {
            id: "stops-at-location",
            label: "Get Stops Data (At Location)",
            apiCall: "getStopReportsAtLocation(location_id, date)",
            apiValues: [neighborhoodCoordinates.id, date],
            form: {
                // formOnSubmit: handleSequentialSearchByLocation,
                formOnSubmit: handleSearchByLocation,
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
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                    {
                        type: "select",
                        label: "Choose a neighborhood",
                        id: "forceNeighborhood",
                        name: "forceNeighborhood",
                        required: true,
                        value: forceNeighborhood
                            ? "id" in forceNeighborhood
                                ? forceNeighborhood.id
                                : ""
                            : "",
                        onChange: (event) => {
                            console.log("formUpdateNeighborhood: ", event);
                            setForceNeighborhood(
                                forceNeighborhoods.find((item) => {
                                    console.log(
                                        "formUpdateNeighborhood: ",
                                        item,
                                    );
                                    return item.id === event;
                                }),
                            );
                        },
                        multiple: "",
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        unsetOption: "Select Police Force Neighborhood*",
                        options: ForceNeighborhoodOptions,
                    },
                    {
                        type: "number",
                        label: "Location ID",
                        id: "location_id",
                        name: "location_id",
                        required: true,
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        value: neighborhoodCoordinates.id
                            ? neighborhoodCoordinates.id
                            : null,
                        defaultValue: neighborhoodCoordinates.id
                            ? null
                            : neighborhoodCoordinates.id,
                        onChange: (event) => {
                            setNeighborhoodCoordinates({
                                id: event.target.value,
                                latitude: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.latitude
                                    : 0.0,
                                longitude: neighborhoodCoordinates
                                    ? neighborhoodCoordinates.longitude
                                    : 0.0,
                            });
                        },
                        placeholder: `Location ID`,
                    },
                ],
            },
        },
    ];

    return (
        <div className={`page-sidebar ${className}`}>
            <div className="sidebar-header">
                <div className="nav-button-group">
                    {[
                        { name: "query", icon: <FaDatabase /> },
                        { name: "map", icon: <FaChartBar /> },
                        { name: "database", icon: <FaMap /> },
                        { name: "options", icon: <FaCog /> },
                    ].map((button, index) => {
                        return (
                            <button
                                key={`nav-menu-button-${button.name}`}
                                id={`nav-menu-button-${button.name}`}
                                className={`header-nav-button ${
                                    menu === button.name ? "active" : ""
                                }`}
                                onClick={(event) => {
                                    setMenu(button.name);
                                }}>
                                {button.icon}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="sidebar-body">
                {menu === "query" && (
                    <div className="query-form-container">
                        <div className="query-form">
                            <form className="form-container">
                                <Select
                                    height={50}
                                    width={100}
                                    label="Select a query"
                                    id={`querySelect`}
                                    name={`querySelect`}
                                    value={query}
                                    unsetOption={`Select Query`}
                                    optionsConfig={queryConfig.map(
                                        (queryInfo, index) => {
                                            return {
                                                key: `${index}`,
                                                value: `${queryInfo.id}`,
                                                label: `${queryInfo.label}`,
                                            };
                                        },
                                    )}
                                    disabled={isFetching}
                                    onChange={
                                        //(event) => {
                                        //setQuery(event.target.value);
                                        //}
                                        setQuery
                                    }></Select>
                            </form>
                        </div>
                        <hr className="hr-section-border" />
                        <div className="query-form">
                            {query && (
                                <QueryForm
                                    name={`queryform`}
                                    formID={`queryform`}
                                    onSubmit={
                                        queryConfig.filter(
                                            (value) => value.id === query,
                                        )[0].form.formOnSubmit
                                    }
                                    // onChange={}
                                    model={
                                        queryConfig.filter(
                                            (value) => value.id === query,
                                        )[0].form
                                    }
                                    disabled={isFetching}
                                    // isFetching={isFetching}
                                ></QueryForm>
                            )}
                        </div>
                    </div>
                )}
                {menu === "options" && (
                            <div className="query-form">
                                <div className="input-field">
                                    <label
                                        className="input-field-label"
                                        for="theme-buttons">
                                        <p>Select a theme: </p>
                                        <div className="theme-buttons-container button-group">
                                            {[
                                                "default",
                                                "light",
                                                "dark",
                                                "cool",
                                            ].map((themeName, index) => {
                                                return (
                                                    <button
                                                        className={`button theme-button ${
                                                            theme === themeName
                                                                ? "theme-button-active"
                                                                : ""
                                                        }`}
                                                        onClick={(event) => {
                                                            setTheme(
                                                                `${themeName}`,
                                                            );
                                                            localStorage.setItem(
                                                                "uk-crime-dashboard-theme",
                                                                themeName,
                                                            );
                                                        }}>
                                                        {themeName.toUpperCase()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </label>
                                </div>
                            </div>
                )}
            </div>
            <div className="sidebar-footer"></div>
        </div>
    );
};

Sidebar.propTypes = {
    categories: PropTypes.array.isRequired,
    forces: PropTypes.array.isRequired,
    category: PropTypes.string.isRequired,
    force: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    setCategory: PropTypes.func.isRequired,
    setForce: PropTypes.func.isRequired,
    setDate: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired,
    categoryIsInvalid: PropTypes.bool.isRequired,
    forceIsInvalid: PropTypes.bool.isRequired,
    setCategoryIsInvalid: PropTypes.func.isRequired,
    setForceIsInvalid: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
};

export default Sidebar;

/*
    <Button
        appearance="primary"
        iconBefore={SearchIcon}
        size="large"
        disabled={isFetching}>
        {isFetching ? "Searching..." : "Search"}
    </Button>
*/