// React
import React, { Children, Component, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// Redux state management
import { useDispatch, useSelector } from 'react-redux';
import {
    SetEnvironment,
    SetDebug,
    SetLoading,
    SetFetching,
    SetMenu,
    SetCache,
    ReloadData,
} from '../../../redux/rootSlice';

// Components
import { FaDatabase, FaChartBar, FaMap, FaCog } from 'react-icons/fa';

// Utilities
import * as utils from '../../../utilities';
import Nav from '../Nav/Nav';

const Sidebar = props => {
    const dispatch = useDispatch();
    const { menu, environment } = useSelector(state => state.root);

    const { children, isFetching, showSidebar } = props;

    const nav = [
        {
            id: 'query',
            index: 0,
            name: 'query',
            icon: <FaChartBar />,
            onClick: e => {
                dispatch(SetMenu('query'));
            },
            classes: `header-nav-button ${menu === `query` ? 'active' : ''}`,
            enabled: true,
        },
        {
            id: 'database',
            index: 1,
            name: 'database',
            icon: <FaDatabase />,
            onClick: e => {
                dispatch(SetMenu('database'));
            },
            classes: `header-nav-button ${menu === `database` ? 'active' : ''}`,
            enabled: environment ? environment === 'development' : true,
        },
        {
            id: 'map',
            index: 2,
            name: 'map',
            icon: <FaMap />,
            onClick: e => {
                dispatch(SetMenu('map'));
            },
            classes: `header-nav-button ${menu === `map` ? 'active' : ''}`,
            enabled: environment ? environment === 'development' : true,
        },
        {
            id: 'options',
            index: 3,
            name: 'options',
            icon: <FaCog />,
            onClick: e => {
                dispatch(SetMenu('options'));
            },
            classes: `header-nav-button ${menu === `options` ? 'active' : ''}`,
            enabled: true,
        },
    ];

    // const childContents = Children.toArray(children);
    // console.log("Sidebar :: props = ", props, childContents);
    return (
        <div className={`page-sidebar ${showSidebar ? '' : 'hidden'}`}>
            <div className="sidebar-header">
                <div className="nav-button-group">
                    <Nav nav={nav}></Nav>
                </div>
            </div>
            <div className="sidebar-body">
                {props.showSidebar && props.children && <>{props.children}</>}
            </div>
            <div className="sidebar-footer"></div>
        </div>
    );
};

Sidebar.propTypes = {
    children: PropTypes.object.isRequired,
    menu: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    // categoryIsInvalid: PropTypes.bool.isRequired,
    // forceIsInvalid: PropTypes.bool.isRequired,
    // setCategoryIsInvalid: PropTypes.func.isRequired,
    // setForceIsInvalid: PropTypes.func.isRequired,
};

export default Sidebar;

/*
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import DebugFields from "./Form/DebugFields";
import Select from "./Form/Select";
import Form from "./Form/Form";
import { FaDatabase, FaChartBar, FaMap, FaCog } from "react-icons/fa";
import { arrayIsValid, deepGetKey, deepSearch, has } from "./Utilities/ObjectUtils";
import { apiNeighborhoodInformation } from "../api";
import { printDebug } from "./Utilities/Utilities";
const API_BASE = "https://data.police.uk/api"; // TODO :: Put this and the queryconfig in its own file. 

const Sidebar = ({
    query,
    setQuery,
    isFetching,
    showSidebar,
    theme,
    setTheme,
    menu,
    setMenu,
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
                                src: `${this.id}`,
                                url: `${API_BASE}/${queryobj.id}?category=${queryobj.apiValues.category}&force=${queryobj.apiValues.force}&date=${month}`,
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
                    let neighborhoods = queryobj.apiValues.neighborhood; // Contains neighborhood IDs.
                    let neighborhoodsArray = queryobj.apiValues.location_id; // Contains full neighborhood data.
                    let neighborhoodDataArray =
                        queryobj.apiValues.location_centre; // Contains full neighborhood data.

                    neighborhoodsArray.forEach((neighborhood) => {
                        // let lat = deepSearch(
                        //     neighborhood,
                        //     "latitude",
                        //     (k, v) => k === "latitude",
                        //     false,
                        // );
                        // let lng = deepSearch(
                        //     neighborhood,
                        //     "longitude",
                        //     (k, v) => k === "longitude",
                        //     false,
                        // );
                        let lat = deepGetKey(neighborhood, "latitude");
                        let lng = deepGetKey(neighborhood, "longitude");
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
                                src: `${queryobj.id}`,
                                // url: `${API_BASE}/${queryobj.id}?location_id=${neighborhood.id}&date=${month}`,
                                url: `${API_BASE}/${queryobj.id}?date=${month}&lat=${lat}&lng=${lng}`,
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
                                force: force,
                                date: month,
                            },
                            src: `stops-no-location`,
                            url: `${API_BASE}/${this.id}?force=${force}&date=${month}`,
                        });
                        console.log(
                            `Queryconfig :: ${this.id} :: ${this.label} :: callsArray = `,
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
                    let neighborhoodsArray = queryobj.apiValues.location_id;
                    let neighborhoodDataArray =
                        queryobj.apiValues.location_centre;

                    neighborhoodDataArray.forEach((neighborhood) => {
                        if (has(neighborhood, "id")) {
                            datesArray.forEach((month) => {
                                callsArray.push({
                                    vars: {
                                        // force: force,
                                        location_id: neighborhood.id,
                                        date: month,
                                    },
                                    src: `${queryobj.id}`,
                                    url: `${API_BASE}/${queryobj.id}?location_id=${neighborhood.id}&date=${month}`,
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
        <div className={`page-sidebar ${showSidebar ? "" : "hidden"}`}>
            <div className="sidebar-header">
                <div className="nav-button-group">
                    {[
                        { name: "query", icon: <FaChartBar /> },
                        { name: "database", icon: <FaDatabase /> },
                        { name: "map", icon: <FaMap /> },
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
                                    value={query.id}
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
                                        (selected) => {
                                            console.log(
                                                "Query selected: ",
                                                selected,
                                                queryConfig.filter(
                                                    (value) =>
                                                        value.id === selected,
                                                )[0],
                                            );
                                            setQuery(
                                                queryConfig.filter(
                                                    (value) =>
                                                        value.id === selected,
                                                )[0],
                                            );
                                        }
                                        // setQuery
                                    }></Select>
                            </form>
                        </div>
                        <hr className="hr-section-border" />
                        <div className="query-form">
                            {query && queryConfig && (
                                <Form
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
                )}
                {menu === "map" && <button className="button">Load Map</button>}
                {menu === "database" && (
                    <button className="button">Explore Local Database</button>
                )}
                {menu === "options" && (
                    <div className="query-form">
                        <div className="input-field">
                            <label
                                className="input-field-label"
                                htmlFor="theme-buttons">
                                <p>Select a theme: </p>
                                <div className="theme-buttons-container button-group">
                                    {["default", "light", "dark", "cool"].map(
                                        (themeName, index) => {
                                            return (
                                                <button
                                                    className={`button theme-button ${
                                                        theme === themeName
                                                            ? "theme-button-active"
                                                            : ""
                                                    }`}
                                                    key={`theme-button-${themeName}`}
                                                    id={`theme-button-${themeName}`}
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
                                        },
                                    )}
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
    // categoryIsInvalid: PropTypes.bool.isRequired,
    // forceIsInvalid: PropTypes.bool.isRequired,
    // setCategoryIsInvalid: PropTypes.func.isRequired,
    // setForceIsInvalid: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
};

export default Sidebar;

*/
