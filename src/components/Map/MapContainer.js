/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as util from '../../utilities';
import { FiMenu } from 'react-icons/fi';
import RenderMap from "./RenderMap";

const MapContainer = ({ isFetching, theme, data }) => {
    const [latitude, setLatitude] = useState(51.2296);
    const [longitude, setLongitude] = useState(-2.31653);
    const [zoom, setZoom] = useState(9);
    // const [viewport, setViewport] = useState({
    //     lat: 51.2296, // latitude, // vertical / y-axis
    //     lng: -2.31653, // longitude, // horizontal / x-axis
    //     zoom: 9, // zoom,
    // } );
    const viewport = useRef({
        lat: 51.2296, // latitude, // vertical / y-axis
        lng: -2.31653, // longitude, // horizontal / x-axis
        zoom: 9, // zoom,
    } );
    const [initialViewport, setInitialViewport] = useState({
        lat: 51.2296, // latitude, // vertical / y-axis
        lng: -2.31653, // longitude, // horizontal / x-axis
        zoom: 9, // zoom,
    });
    
    
    const [showSidebar, setShowSidebar] = useState(true);
    const [ renderData, setRenderData ] = useState( [] );

    // const getCoordinateFromData = ( input ) =>
    // {
    //     let locObj;
    //     if (input) {
    //         if ("location" in input) {
    //             // Instance of reports returned by the get-reports-at-location API call.
    //             locObj = input.location;
    //         } else if ("centre" in input) {
    //             // Instance of neighborhood data
    //             locObj = input.centre;
    //         }
    //         
    //         if ( locObj )
    //         {
    //             if ( "latitude" in locObj && "longitude" in locObj )
    //             {
    //                 return [ locObj.latitude, locObj.longitude ];
    //             }
    //         }
    //     }
    // }

    const getCoordinateFromData = input => {
        let lat = util.ao.deepGetKey(input, 'latitude');
        let lng = util.ao.deepGetKey(input, 'longitude');
        if (lat && lng) {
            return [lng, lat];
        } else {
            return [];
        }
    };

    const getCoordinatesFromData = (input) => {
        let coordinatesArray = [];
        if (input) {
            if (Array.isArray(input)) {
                input.forEach((item, index) => {
                    console.log( "MapContainer.js :: Data item = ", item );
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
    useEffect( () =>
    {
        console.log( "MapContainer :: Viewport = ", viewport );
        if ( data )
        {
            if ( data.length > 0 )
            {
                let report = data[ 0 ];
                let loc = getCoordinateFromData( report );
                if ( loc )
                {
                    // setViewport({
                    //     ...viewport,
                    //     lat: loc[ 0 ],
                    //     lng: loc[ 1 ],
                    // });
                    viewport.current = {
                        // ...viewport,
                        lat: loc[0],
                        lng: loc[ 1 ],
                        zoom: viewport.current.zoom,
                    };
                    // setLatitude( loc[ 0 ] );
                    // setLongitude( loc[ 1 ] );
                }
            }
        }
    }, [] );
    

    useEffect(() => {
        console.log(
            "MapContainer.js :: viewport changed :: viewport = ",
            viewport,
            viewport.current, ", initialViewport = ",
            initialViewport,
        );
    }, [ viewport ] );
    
    const maxCallSize = 1000;
    const getReportButtons = ( reports ) =>
    {
        console.log( "MapContainer.js :: getReportButtons :: reports = ", reports );
        let coordinatesData = [];
        let buttons = []; 
        reports = reports.slice( 1, maxCallSize + 1 );
        reports.forEach( ( report, index ) =>
        {
            // console.log( "Building map sidebar buttons :: report #", index, " = ", report );
            if (report) {
                let coords = getCoordinateFromData( report );
                if ( coords.length > 0 )
                {
                    let id = util.ao.deepGetKey( report, 'id' );
                    coordinatesData.push(coords);

                    if (id) {
                        buttons.push(
                            <button
                                className="map-sidebar-button"
                                id={`map-sidebar-button-${coords[0]}-${coords[1]}-${Math.random() * 100000}`}
                                key={`map-sidebar-button-${coords[0]}-${coords[1]}-${Math.random() * 100000}`}
                                // onClick={(event) => {
                                //     setLatitude(report.location.latitude);
                                //     setLongitude(report.location.longitude);
                                // }}
                            >
                                {id}
                            </button>
                        );
                    }
                }
            }
        } );
        // setRenderData( coordinatesData );
        return buttons;
    }

    // console.log( "MapContainer.js :: Re-render triggered." );
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
                                    onChange={ ( event ) =>
                                    {
                                        console.log( initialViewport );
                                        viewport.current = {
                                            ...viewport.current,
                                            lat: event.target.value,
                                            // lng: viewport.current.lng,
                                            // zoom: viewport.current.zoom,
                                        };
                                        setInitialViewport( {
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
                    {data && !isFetching && (
                        <div
                            className="button-list-container"
                            id="map-sidebar-buttons-container">
                            <h2 className="button-list-label">Results:</h2>
                            {getReportButtons(data)}
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
                    <RenderMap
                        data={data}
                        // renderData={getCoordinatesFromData(data)}
                        viewport={viewport}
                        initialViewport={initialViewport}
                        setInitialViewport={setInitialViewport}
                        // setViewport={setViewport}
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

export default MapContainer;

/*

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
                                id={`map-sidebar-button-${report.id}`}
                                key={`map-sidebar-button-${report.id}`}
                                // onClick={(event) => {
                                //     setLatitude(report.location.latitude);
                                //     setLongitude(report.location.longitude);
                                // }}
                            >
                                {report.id}
                            </button>,
                        );
                    }
                }
            }
        } );
        // setRenderData( coordinatesData );
        return buttons;
    }

*/