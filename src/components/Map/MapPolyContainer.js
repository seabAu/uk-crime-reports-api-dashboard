/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiMenu } from "react-icons/fi";
import MapPoly from "./MapPoly";
import { isArray } from "../Utilities/Utilities";
import { arrayIsValid } from "../Utilities/ObjectUtils";

const MapPolyContainer = ( props ) =>
{
    const {
        isFetching,
        theme,
        areas,
        setAreas,
        coordinates,
        setCoordinates,
        geometry,
        setGeometry,
        mapDatatype,
    } = props;
    const [latitude, setLatitude] = useState(51.2296);
    const [longitude, setLongitude] = useState(-2.31653);
    const [zoom, setZoom] = useState(9);
    // const [viewport, setViewport] = useState({
    //     lat: -2.31653, // latitude, // vertical / y-axis
    //     lng: 51.2296, // longitude, // horizontal / x-axis
    //     zoom: 9, // zoom,
    // });
    const viewport = useRef({
        lat: 51.2296, // latitude, // vertical / y-axis
        lng: -2.31653, // longitude, // horizontal / x-axis
        zoom: 9, // zoom,
    });
    const [initialViewport, setInitialViewport] = useState({
        lat: 51.2296, // latitude, // vertical / y-axis
        lng: -2.31653, // longitude, // horizontal / x-axis
        zoom: 9, // zoom,
    });
    
    const [showSidebar, setShowSidebar] = useState(true);
    const [renderData, setRenderData] = useState([]);
    const [drawdata, setDrawdata] = useState([]);

    const getCoordinateFromData = (input) => {
        let locObj;
        if (input) {
            if ("location" in input) {
                // Instance of reports returned by the get-reports-at-location API call.
                locObj = input.location;
            } else if ("centre" in input) {
                // Instance of neighborhood data
                locObj = input.centre;
            }

            if (locObj) {
                if ("latitude" in locObj && "longitude" in locObj) {
                    return [locObj.latitude, locObj.longitude];
                }
            }
        }
    };

    const getCoordinateButtonList = ( input ) =>
    {
        let coordinatesData = [];
        let buttons = [];
        if ( input )
        {
            if ( arrayIsValid( input ) )
            {
                input.forEach((point, index) => {
                    // console.log(
                    //     "Building map sidebar buttons :: input #",
                    //     index,
                    //     " = ",
                    //     input,
                    // );
                    if ( point )
                    {
                        if ( point.lat && point.lng )
                        {
                            // coordinatesData.push([point.lat, point.lng]);
                            buttons.push(
                                <button
                                    className="map-sidebar-button"
                                    id={`map-sidebar-button-${index}`}
                                    key={`map-sidebar-button-${index}`}
                                    // onClick={(event) => {
                                    //     setLatitude(report.location.latitude);
                                    //     setLongitude(report.location.longitude);
                                    // }}
                                >
                                    {`[${point.lat.toFixed(3)}, ${point.lng.toFixed(3)}]`}
                                </button>,
                            );
                        }
                    }
                });
            }
        }
        // setRenderData( coordinatesData );
        return buttons;
    };

    // console.log( "MapPolyContainer.js :: Re-render triggered." );
    return (
        <div className="map-content-container">
            <div className={`map-sidebar ${showSidebar ? "" : "hidden"}`}>
                <div className="map-sidebar-content">
                    <div className="map-sidebar-controls-container">
                        <div className="input-field-container">
                            <label
                                className="input-field-label"
                                htmlFor="latitude">
                                <h2>Latitude</h2>
                                <input
                                    type="number"
                                    name="latitude"
                                    id="latitude"
                                    value={initialViewport.lat}
                                    // defaultValue={viewport.current.lat ?? 0}
                                    placeholder="Latitude"
                                    label="Latitude"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        console.log(initialViewport);
                                        viewport.current = {
                                            ...viewport.current,
                                            lat: event.target.value,
                                            // lng: viewport.current.lng,
                                            // zoom: viewport.current.zoom,
                                        };
                                        setInitialViewport({
                                            ...initialViewport,
                                            lat: event.target.value,
                                        });

                                        console.log(
                                            "MapContainer.js :: latitude input onChange :: viewport = ",
                                            viewport,
                                            viewport.current,
                                            ", initialViewport = ",
                                            initialViewport,
                                        );
                                        // setViewport({
                                        //     ...viewport,
                                        //     lat: event.target.value,
                                        // });
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field-container">
                            <label
                                className="input-field-label"
                                htmlFor="longitude">
                                <h2>Longitude</h2>
                                <input
                                    type="number"
                                    name="longitude"
                                    id="longitude"
                                    value={initialViewport.lng}
                                    // defaultValue={viewport.current.lng}
                                    placeholder="Longitude"
                                    label="Longitude"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        viewport.current = {
                                            ...viewport.current,
                                            lng: event.target.value,
                                            // lng: viewport.current.lng,
                                            // zoom: viewport.current.zoom,
                                        };
                                        // viewport.current = {
                                        //     // ...viewport,
                                        //     lat: viewport.current.lat,
                                        //     lng: event.target.value,
                                        //     zoom: viewport.current.zoom,
                                        // };
                                        // setInitialViewport({
                                        //     lat: viewport.current.lat,
                                        //     lng: viewport.current.lng,
                                        //     zoom: viewport.current.zoom,
                                        // });
                                        setInitialViewport({
                                            ...initialViewport,
                                            lng: event.target.value,
                                        });

                                        console.log(
                                            "MapContainer.js :: longitude input onChange :: viewport = ",
                                            viewport,
                                            viewport.current,
                                            ", initialViewport = ",
                                            initialViewport,
                                        );
                                        // setViewport({
                                        //     ...viewport,
                                        //     lng: event.target.value,
                                        // });
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field-container">
                            <label className="input-field-label" htmlFor="zoom">
                                <h2>Zoom</h2>
                                <input
                                    type="number"
                                    name="zoom"
                                    id="zoom"
                                    value={initialViewport.zoom}
                                    // defaultValue={viewport.current.zoom}
                                    placeholder="Zoom"
                                    label="Zoom"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        // viewport.current = {
                                        //     // ...viewport,
                                        //     lat: viewport.current.lat,
                                        //     lng: viewport.current.lng,
                                        //     zoom: event.target.value,
                                        // };
                                        // setInitialViewport({
                                        //     lat: viewport.current.lat,
                                        //     lng: viewport.current.lng,
                                        //     zoom: viewport.current.zoom,
                                        // });
                                        viewport.current = {
                                            ...viewport.current,
                                            zoom: event.target.value,
                                        };
                                        setInitialViewport({
                                            ...initialViewport,
                                            zoom: event.target.value,
                                        });
                                        console.log(
                                            "MapContainer.js :: zoom input onChange :: viewport = ",
                                            viewport,
                                            viewport.current,
                                            ", initialViewport = ",
                                            initialViewport,
                                        );
                                    }}></input>
                            </label>
                        </div>
                    </div>
                    {coordinates && !isFetching && (
                        <div
                            className="button-list-container"
                            id="map-sidebar-buttons-container">
                            <h2 className="button-list-label">
                                Chosen points:
                            </h2>
                            {getCoordinateButtonList(coordinates)}
                        </div>
                    )}
                </div>
            </div>
            <div className="map-content">
                <div className="map-content-header">
                    <div className="menu-toggle">
                        <FiMenu
                            className="menu-toggle-button"
                            id="map-sidebar-toggle-button"
                            style={{ width: 20, height: 20 }}
                            onClick={() => setShowSidebar(!showSidebar)}
                        />
                    </div>
                    <div className="map-content-header-title">MAPBOX VIEW</div>
                </div>
                {
                    //<MapProvider
                    //    data={ data }
                    //    renderData={renderData}
                    //    latitude={latitude}
                    //    longitude={longitude}
                    //    zoom={zoom}
                    //    setLatitude={setLatitude}
                    //    setLongitude={setLongitude}
                    //    setZoom={ setZoom }></MapProvider>
                    <MapPoly
                        isFetching={isFetching}
                        theme={theme}
                        areas={areas}
                        setAreas={setAreas}
                        coordinates={coordinates}
                        setCoordinates={setCoordinates}
                        geometry={geometry}
                        setGeometry={setGeometry}
                        showSidebar={showSidebar}
                        viewport={viewport}
                        initialViewport={initialViewport}
                        setInitialViewport={setInitialViewport}
                        drawdata={drawdata}
                        setDrawdata={setDrawdata}
                        mapDatatype={mapDatatype}
                        // setViewport={ setViewport }
                    ></MapPoly>
                }
            </div>
        </div>
    );
};

export default MapPolyContainer;

/*
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMenu } from "react-icons/fi";
import MapPoly from "./MapPoly";
import { isArray } from "../Utilities/Utilities";
import { arrayIsValid } from "../Utilities/ObjectUtils";

const MapPolyContainer = ( props ) =>
{
    const {
        isFetching,
        theme,
        areas,
        setAreas,
        coordinates,
        setCoordinates,
    } = props;
    const [latitude, setLatitude] = useState(51.2296);
    const [longitude, setLongitude] = useState(-2.31653);
    const [zoom, setZoom] = useState(9);
    const [viewport, setViewport] = useState({
        lat: -2.31653, // latitude, // vertical / y-axis
        lng: 51.2296, // longitude, // horizontal / x-axis
        zoom: 9, // zoom,
    });
    const [showSidebar, setShowSidebar] = useState(true);
    const [renderData, setRenderData] = useState([]);

    const getCoordinateFromData = (input) => {
        let locObj;
        if (input) {
            if ("location" in input) {
                // Instance of reports returned by the get-reports-at-location API call.
                locObj = input.location;
            } else if ("centre" in input) {
                // Instance of neighborhood data
                locObj = input.centre;
            }

            if (locObj) {
                if ("latitude" in locObj && "longitude" in locObj) {
                    return [locObj.latitude, locObj.longitude];
                }
            }
        }
    };

    const getCoordinateButtonList = ( input ) =>
    {
        let coordinatesData = [];
        let buttons = [];
        if ( input )
        {
            if ( arrayIsValid( input ) )
            {
                input.forEach((point, index) => {
                    console.log(
                        "Building map sidebar buttons :: input #",
                        index,
                        " = ",
                        input,
                    );
                    if ( point )
                    {
                        if ( point.lat && point.lng )
                        {
                            // coordinatesData.push([point.lat, point.lng]);
                            buttons.push(
                                <button
                                    className="map-sidebar-button"
                                    id={`map-sidebar-button-${index}`}
                                    key={`map-sidebar-button-${index}`}
                                    // onClick={(event) => {
                                    //     setLatitude(report.location.latitude);
                                    //     setLongitude(report.location.longitude);
                                    // }}
                                >
                                    {`[${point.lat.toFixed(3)}, ${point.lng.toFixed(3)}]`}
                                </button>,
                            );
                        }
                    }
                });
            }
        }
        // setRenderData( coordinatesData );
        return buttons;
    };

    // console.log( "MapPolyContainer.js :: Re-render triggered." );
    return (
        <div className="map-content-container">
            <div className={`map-sidebar ${showSidebar ? "" : "hidden"}`}>
                <div className="map-sidebar-content">
                    <div className="map-sidebar-controls-container">
                        <div className="input-field-container">
                            <label
                                className="input-field-label"
                                htmlFor="latitude">
                                <h2>Latitude</h2>
                                <input
                                    type="number"
                                    name="latitude"
                                    id="latitude"
                                    value={viewport.lat ?? 0}
                                    defaultValue={viewport.lat ?? 0}
                                    placeholder="Latitude"
                                    label="Latitude"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        setViewport({
                                            ...viewport,
                                            lat: event.target.value,
                                        });
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field-container">
                            <label
                                className="input-field-label"
                                htmlFor="longitude">
                                <h2>Longitude</h2>
                                <input
                                    type="number"
                                    name="longitude"
                                    id="longitude"
                                    value={viewport.lng}
                                    defaultValue={viewport.lng}
                                    placeholder="Longitude"
                                    label="Longitude"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        setViewport({
                                            ...viewport,
                                            lng: event.target.value,
                                        });
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field-container">
                            <label className="input-field-label" htmlFor="zoom">
                                <h2>Zoom</h2>
                                <input
                                    type="number"
                                    name="zoom"
                                    id="zoom"
                                    value={viewport.zoom}
                                    defaultValue={viewport.zoom}
                                    placeholder="Zoom"
                                    label="Zoom"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        setViewport({
                                            ...viewport,
                                            zoom: event.target.value,
                                        });
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field-container">
                            <label
                                className="input-field-label"
                                htmlFor="latitude">
                                <h2>Latitude</h2>
                                <input
                                    type="number"
                                    name="latitude"
                                    id="latitude"
                                    value={latitude}
                                    defaultValue={latitude}
                                    placeholder="Latitude"
                                    label="Latitude"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        setLatitude(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field-container">
                            <label
                                className="input-field-label"
                                htmlFor="longitude">
                                <h2>Longitude</h2>
                                <input
                                    type="number"
                                    name="longitude"
                                    id="longitude"
                                    value={longitude}
                                    defaultValue={longitude}
                                    placeholder="Longitude"
                                    label="Longitude"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        setLongitude(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field-container">
                            <label className="input-field-label" htmlFor="zoom">
                                <h2>Zoom</h2>
                                <input
                                    type="number"
                                    name="zoom"
                                    id="zoom"
                                    value={zoom}
                                    defaultValue={zoom}
                                    placeholder="Zoom"
                                    label="Zoom"
                                    className="input-field-number"
                                    onChange={(event) => {
                                        setZoom(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                    </div>
                    {coordinates && !isFetching && (
                        <div
                            className="button-list-container"
                            id="map-sidebar-buttons-container">
                            <h2 className="button-list-label">
                                Chosen points:
                            </h2>
                            {getCoordinateButtonList(coordinates)}
                        </div>
                    )}
                </div>
            </div>
            <div className="map-content">
                <div className="map-content-header">
                    <div className="menu-toggle">
                        <FiMenu
                            className="menu-toggle-button"
                            id="map-sidebar-toggle-button"
                            style={{ width: 20, height: 20 }}
                            onClick={() => setShowSidebar(!showSidebar)}
                        />
                    </div>
                    <div className="map-content-header-title">MAPBOX VIEW</div>
                </div>
                {
                    //<MapProvider
                    //    data={ data }
                    //    renderData={renderData}
                    //    latitude={latitude}
                    //    longitude={longitude}
                    //    zoom={zoom}
                    //    setLatitude={setLatitude}
                    //    setLongitude={setLongitude}
                    //    setZoom={ setZoom }></MapProvider>
                    <MapPoly
                        isFetching={isFetching}
                        theme={theme}
                        areas={areas}
                        setAreas={setAreas}
                        coordinates={coordinates}
                        setCoordinates={setCoordinates}
                        showSidebar={showSidebar}
                        viewport={viewport}
                        setViewport={setViewport}></MapPoly>
                }
            </div>
        </div>
    );
};

export default MapPolyContainer;

*/

/*
    const getCoordinatesFromData = (input) => {
        let coordinatesArray = [];
        if (input) {
            if (Array.isArray(input)) {
                input.forEach((item, index) => {
                    console.log("MapPolyContainer.js :: Data item = ", item);
                    if (item) {
                        if ("location" in item) {
                            // Instance of reports returned by the get-reports-at-location API call.
                            let locObj = item.location;
                            if (locObj) {
                                if (
                                    "latitude" in locObj &&
                                    "longitude" in locObj
                                ) {
                                    coordinatesArray.push({
                                        latitude: locObj.latitude,
                                        longitude: locObj.longitude,
                                    });
                                }
                            }
                        } else if ("centre" in item) {
                            // Instance of neighborhood data
                            let locObj = item.centre;
                            if (locObj) {
                                if (
                                    "latitude" in locObj &&
                                    "longitude" in locObj
                                ) {
                                    coordinatesArray.push({
                                        latitude: locObj.latitude,
                                        longitude: locObj.longitude,
                                    });
                                }
                            }
                        }
                    }
                });
            }
        }
        // console.log("MAPBOX.js :: coordinatesArray = ", coordinatesArray);
        return coordinatesArray;
    };

    // On component load, get the first available coordinates pair and set it to the starting values.
    useEffect(() => {
        if (data) {
            if (data.length > 0) {
                let report = data[0];
                let loc = getCoordinateFromData(report);
                if (loc) {
                    setLatitude(loc[0]);
                    setLongitude(loc[1]);
                }
            }
        }
    }, []);

*/