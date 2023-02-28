/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMenu } from "react-icons/fi";
import MapProvider from "./MapProvider";
import RenderMap from "./RenderMap";

export default function MapContent({ isFetching, theme, data }) {
    const [latitude, setLatitude] = useState(51.2296);
    const [longitude, setLongitude] = useState(-2.31653);
    const [zoom, setZoom] = useState(9);
    const [showSidebar, setShowSidebar] = useState(true);
    const [ renderData, setRenderData ] = useState( [] );

    const getCoordinateFromData = ( input ) =>
    {
        let locObj;
        if (input) {
            if ("location" in input) {
                // Instance of reports returned by the get-reports-at-location API call.
                locObj = input.location;
            } else if ("centre" in input) {
                // Instance of neighborhood data
                locObj = input.centre;
            }

            if ( locObj )
            {
                if ( "latitude" in locObj && "longitude" in locObj )
                {
                    return [ locObj.latitude, locObj.longitude ];
                }
            }
        }
    }

    const getCoordinatesFromData = (input) => {
        let coordinatesArray = [];
        if (input) {
            if (Array.isArray(input)) {
                input.forEach((item, index) => {
                    console.log( "MapContent.js :: Data item = ", item );
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

    const toggleSidebar = () => {
        if (showSidebar) {
            setShowSidebar(false);
        } else {
            setShowSidebar(true);
        }
    };

    // On component load, get the first available coordinates pair and set it to the starting values.
    useEffect( () =>
    {
        if ( data )
        {
            if ( data.length > 0 )
            {
                let report = data[ 0 ];
                let loc = getCoordinateFromData( report );
                if ( loc )
                {
                    setLatitude( loc[ 0 ] );
                    setLongitude( loc[ 1 ] );
                }
            }
        }
    }, [] );
    

    const getReportButtons = ( reports ) =>
    {
        let coordinatesData = [];
        let buttons = [];
        reports.forEach( ( report, index ) =>
        {
            // console.log( "Building map sidebar buttons :: report #", index, " = ", report );
            if (report) {
                if ("location" in report) {
                    if (
                        report.location !== null &&
                        report.location !== undefined
                    ) {
                        // console.log(
                        //     "Building map sidebar buttons :: location = ",
                        //     report.location,
                        // );
                        coordinatesData.push([
                            report.location.latitude,
                            report.location.longitude,
                        ]);
                        buttons.push(
                            <button
                                className="map-sidebar-button"
                                // onClick={(event) => {
                                //     setLatitude(report.location.latitude);
                                //     setLongitude(report.location.longitude);
                            // }}
                            >
                                {report.id}
                            </button>
                        );
                    }
                }
            }
        } );
        // setRenderData( coordinatesData );
        return buttons;
    }

    // console.log( "MapContent.js :: Re-render triggered." );
    return (
        <div className="map-content-container">
            <div className={`map-sidebar ${showSidebar ? "" : "hidden"}`}>
                <div className="map-sidebar-content">
                    <div className="map-sidebar-controls-container">
                        <div className="input-field-container">
                            <label className="input-field-label" for="Latitude">
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
                                for="Longitude">
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
                            <label className="input-field-label" for="Zoom">
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
                    <h2 className="map-sidebar-results-label">Results:</h2>
                    {data && !isFetching && (
                        <div className="map-sidebar-buttons-container" id="map-sidebar-buttons-container">
                            {
                                getReportButtons( data )
                            }
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
                            onClick={() => {
                                toggleSidebar();
                            }}
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
                    <RenderMap
                        data={data}
                        // renderData={getCoordinatesFromData(data)}
                        latitude={latitude}
                        longitude={longitude}
                        zoom={zoom}
                        setLatitude={setLatitude}
                        setLongitude={setLongitude}
                        setZoom={setZoom}
                        showSidebar={showSidebar}
                        theme={theme}></RenderMap>
                }
            </div>
        </div>
    );
}
