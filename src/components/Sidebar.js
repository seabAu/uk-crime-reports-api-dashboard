import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import DebugFields from "./Form/DebugFields";
import Select from "./Form/Select";
import QueryForm from "./Form/QueryForm";

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
    handleSearchByLocation,
    handleSequentialSearch,
    categoryIsInvalid,
    forceIsInvalid,
    isFetching,
    showSidebar,
} ) =>
{
    // Form helper functions
    const getDateOptions = () => {
        if ( dates )
        {
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
        if ( forceNeighborhoods )
        {
            return forceNeighborhoods.map((neighborhood, index) => {
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
                        id: "date",
                        name: "date",
                        required: 1,
                        value: date,
                        multiple: "multiple",
                        // onChange: (event)=>formUpdateDate( event ),
                        onChange: (value) => {
                            if (value === "all_dates") {
                                // Get all but the first, which is "all_dates". API won't know what to do with that.
                                //setDate(dates.splice(1, -1));
                                setDate(value);
                            } else {
                                setDate(value);
                            }
                        },
                        //onChange: (event) => {setDate(event.target.value);},
                        disabled: { isFetching },
                        unsetOption: "Select month*",
                        options: DateOptions,
                    },

                    {
                        type: "select",
                        id: "category",
                        name: "category",
                        required: 1,
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
                        id: "force",
                        name: "force",
                        required: 1,
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
                        id: "date",
                        name: "date",
                        required: 1,
                        value: [date],
                        // onChange: (event)=>formUpdateDate( event ),
                        onChange: ( value ) =>
                        {
                            if ( value !== '' && value !== undefined && value !== null )
                            {
                                if (date.indexOf(value) > -1) {
                                    setDate(
                                        date.filter((item) => {
                                            return item !== value;
                                        }),
                                    );
                                } else {
                                    setDate(date.concat(value));
                                }
                            }
                        },
                        //onChange: (event) => {setDate(event.target.value);},
                        multiple: "multiple",
                        disabled: { isFetching },
                        unsetOption: "Select month*",
                        options: DateOptions,
                    },

                    {
                        type: "select",
                        id: "category",
                        name: "category",
                        required: 1,
                        value: category,
                        // onChange: (event) => {setCategory(event.target.value);},
                        onChange: setCategory,
                        multiple: "",
                        disabled: { isFetching },
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Category*",
                        options: CategoryOptions,
                    },

                    {
                        type: "select",
                        id: "force",
                        name: "force",
                        required: 1,
                        value: force,
                        // onChange: (event) => {setForce(event.target.value);}, // setForce,
                        onChange: setForce,
                        multiple: "",
                        disabled: { isFetching },
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                ],
            },
        },
        {
            id: "crimes-at-location",
            label: "Get Crime Data (At Location)",
            apiCall: "getCrimeReportsAtLocation(latitude, longitude)",
            apiValues: [
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
                        id: "force",
                        name: "force",
                        required: 1,
                        value: force,
                        // onChange: (event) => {setForce(event.target.value);},
                        onChange: setForce,
                        disabled: { isFetching },
                        multiple: "",
                        isInvalid: { categoryIsInvalid },
                        unsetOption: "Select Police Force*",
                        options: ForceOptions,
                    },
                    {
                        type: "select",
                        id: "forceNeighborhood",
                        name: "forceNeighborhood",
                        required: 1,
                        value: forceNeighborhood.id,
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
                        id: "latitude",
                        name: "latitude",
                        required: 1,
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        value: neighborhoodCoordinates.latitude,
                        onChange: (event) => {
                            setNeighborhoodCoordinates({
                                latitude: event.target.value,
                                longitude: neighborhoodCoordinates.latitude,
                            });
                        },
                        placeholder: `Latitude`,
                    },
                    {
                        type: "number",
                        id: "longitude",
                        name: "longitude",
                        required: 1,
                        disabled: { isFetching },
                        isInvalid: { forceIsInvalid },
                        value: neighborhoodCoordinates.longitude,
                        onChange: (event) => {
                            setNeighborhoodCoordinates({
                                latitude: neighborhoodCoordinates.latitude,
                                longitude: event.target.value,
                            });
                        },
                        placeholder: `Longitude`,
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
                formOnSubmit: handleSearch,
                fields: [
                    {
                        type: "select",
                        id: "date",
                        name: "date",
                        required: 1,
                    },
                ],
            },
        },
        {
            id: "stops-at-location",
            label: "Get Stops Data (At Location)",
            apiCall: "getStopReportsAtLocation(location_id, date)",
            apiValues: [neighborhoodId, date],
            form: {
                formOnSubmit: handleSearchByLocation,
                fields: [
                    {
                        type: "select",
                        id: "date",
                        name: "date",
                        required: 1,
                    },
                ],
            },
        },
    ];

    return (
        <div className={`page-sidebar ${className}`}>
            <div className="sidebar-header">
                <form className="form-container">
                    <Select
                        height={50}
                        width={100}
                        id={`querySelect`}
                        name={`querySelect`}
                        value={query}
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
                            //(event) => {
                            //setQuery(event.target.value);
                            //}
                            setQuery
                        }></Select>
                </form>
            </div>
            <div className="sidebar-body">
                <div className="query-form">
                    {query && (
                        <QueryForm
                            name={`queryform`}
                            id={`queryform`}
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
            <div className="sidebar-footer">
                <hr />
            </div>
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