/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import Tooltip from "./Tooltip";
import ReactDOM from "react-dom";
import Map from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import MapMarkers from "./MapMarkers";
import ReactMapGl from "react-map-gl";
import axios from "axios";
// import styles from "./Map.module.css";
import { FiMenu } from "react-icons/fi";
// import filterCrimeNames from "../../functions/filterCrimeNames";
import mapboxgl from "mapbox-gl";
const MAPBOX_API_KEY_SK =
    "sk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlamUzdjZzMDIwMzQxbG00eHpjaDk0MyJ9.0BDFwYgJp3IxMgYB6Bc2KQ";
const MAPBOX_API_KEY_PK =
    "pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ";
mapboxgl.accessToken = MAPBOX_API_KEY_PK;

const MapProvider = ( { data, renderData, latitude, longitude, zoom, setLatitude, setLongitude, setZoom } ) =>
{
    var map;
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
    const [viewport, setViewport] = useState({
        height: "100%",
        width: "100%",
        longitude: -2.31653,
        latitude: 51.2296,
        zoom: 15,
    } );
    
    const filterCrimeNames = (array, character) => {
        let newNames = [];
        for (let index = 0; index < array.length; index++) {
            let element = array[index];
            element.category = element.category.split(character).join(" ");

            newNames.push(element);
        }
        return newNames;
    };

    useEffect(() => {
        console.log("MAPPROVIDER.JS :: Pre-init :: map = ", map, "\n\n", "mapRef = ", mapRef, "\n\n");
        if (map) return; // initialize map only once
        map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [longitude, latitude],
            zoom: zoom,
        } );
        mapRef.current = map;
        // map.current = new mapboxgl.Map({
        //     container: mapContainerRef.current,
        //     style: "mapbox://styles/mapbox/streets-v12",
        //     center: [longitude, latitude],
        //     zoom: zoom,
        // });
        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl());
        console.log("MAPPROVIDER.JS :: Post-init :: map = ", map, "\n\n", "mapRef = ", mapRef, "\n\n", "mapRef.current = ", mapRef.current);
    });
    
    useEffect(() => {
        // if (!map) return; // wait for map to initialize
        map.on("move", () => {
            setLongitude(map.getCenter().longitude.toFixed(4));
            setLatitude(map.getCenter().latitude.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });
        // // Clean up on unmount
        // return () => map.remove();
        console.log("MAPPROVIDER.JS :: During execution :: map = ", map, "\n\n", "mapRef = ", mapRef, "\n\n", "mapRef.current = ", mapRef.current);
    } );

    return (
        <div
            className="map-container"
            style={{ width: `100%`, height: `100%` }}
            ref={mapContainerRef}>
            {
                // <Map
                //     id="mymap"
                //     initialViewState={{
                //         longitude: -122.4,
                //         latitude: 37.8,
                //         zoom: 14,
                //     }}
                //     style={{ width: `auto`, height: `auto` }}
                //     mapStyle="mapbox://styles/mapbox/streets-v9"
                //     mapboxAccessToken="pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ"
                // />
                // <ReactMapGl
                //     {...viewport}
                //     mapboxApiAccessToken={MAPBOX_API_KEY_PK}
                //     onViewportChange={(viewport) => setViewport(viewport)}
                //     mapStyle="mapbox://styles/mapbox/streets-v11" // "mapbox://styles/sjohnston00/ckfzik7uk19n419nyty2pubtj?optimze=true"
                //     onClick={() => setSelectedCrime(null)}>
                //     <MapMarkers
                //         policeData={policeData}
                //         setSelectedCrime={setSelectedCrime}
                //         selectedCrime={selectedCrime}
                //     />
                // </ReactMapGl>
            }
        </div>
    );
}

export default MapProvider;




/*
    import React, { useRef, useEffect, useState } from "react";
    import Tooltip from "./Tooltip";
    import ReactDOM from "react-dom";
    import Map from "react-map-gl";

    import "mapbox-gl/dist/mapbox-gl.css";
    import MapMarkers from "./MapMarkers";
    import ReactMapGl from "react-map-gl";
    import axios from "axios";
    // import styles from "./Map.module.css";
    import { FiMenu } from "react-icons/fi";
    // import filterCrimeNames from "../../functions/filterCrimeNames";
    import mapboxgl from "mapbox-gl";
    const MAPBOX_API_KEY_SK =
        "sk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlamUzdjZzMDIwMzQxbG00eHpjaDk0MyJ9.0BDFwYgJp3IxMgYB6Bc2KQ";
    const MAPBOX_API_KEY_PK =
        "pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ";
    mapboxgl.accessToken = MAPBOX_API_KEY_PK;

    const MapProvider = ({data, renderData, latitude, longitude, zoom, setLatitude, setLongitude, setZoom}) => {
        const mapRef = useRef(null);
        const mapContainerRef = useRef(null);
        const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
        const [viewport, setViewport] = useState({
            height: "100%",
            width: "100%",
            longitude: -2.31653,
            latitude: 51.2296,
            zoom: 15,
        });
        const [loading, setLoading] = useState(true);
        const [policeData, setPoliceData] = useState([]);
        const [selectedCrime, setSelectedCrime] = useState(null);

        const filterCrimeNames = (array, character) => {
            let newNames = [];
            for (let index = 0; index < array.length; index++) {
                let element = array[index];
                element.category = element.category.split(character).join(" ");

                newNames.push(element);
            }
            return newNames;
        };

        // useEffect(() => {
        //     //get the current users location with permision
        //     navigator.geolocation.getCurrentPosition((pos) => {
        //         setViewport({
        //             ...viewport,
        //             latitude: pos.coords.latitude,
        //             longitude: pos.coords.longitude,
        //         });
        //     });
        //     setLoading(true);
        // }, []);

        // Initialize map when component mounts
        // useEffect(() => {
        //     const map = new mapboxgl.Map({
        //         container: mapContainerRef.current,
        //         style: "mapbox://styles/mapbox/streets-v11",
        //         center: [-79.38, 43.65],
        //         zoom: 12.5,
        //     });
        //
        //     // change cursor to pointer when user hovers over a clickable feature
        //     map.on("mouseenter", (e) => {
        //         if (e.features.length) {
        //             map.getCanvas().style.cursor = "pointer";
        //         }
        //     });
        //
        //     // reset cursor to default when user is no longer hovering over a clickable feature
        //     map.on("mouseleave", () => {
        //         map.getCanvas().style.cursor = "";
        //     });
        //
        //     // add tooltip when users mouse move over a point
        //     map.on("mousemove", (e) => {
        //         const features = map.queryRenderedFeatures(e.point);
        //         if (features.length) {
        //             const feature = features[0];
        //
        //             // Create tooltip node
        //             const tooltipNode = document.createElement("div");
        //             ReactDOM.render(<Tooltip feature={feature} />, tooltipNode);
        //
        //             // Set tooltip on map
        //             tooltipRef.current
        //                 .setLngLat(e.lngLat)
        //                 .setDOMContent(tooltipNode)
        //                 .addTo(map);
        //         }
        //     });
        //
        //     // Clean up on unmount
        //     return () => map.remove();
        // }, []); // eslint-disable-line react-hooks/exhaustive-deps

        // Initialize map when component mounts
        //useEffect(() => {
        //    const map = new mapboxgl.Map({
        //        container: mapContainerRef.current,
        //        style: "mapbox://styles/mapbox/streets-v11",
        //        center: [longitude, latitude],
        //        zoom: zoom,
        //    });
    //
        //    // Add navigation control (the +/- zoom buttons)
        //    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    //
        //    map.on("move", () => {
        //        setLongitude(map.getCenter().longitude.toFixed(4));
        //        setLatitude(map.getCenter().latitude.toFixed(4));
        //        setZoom(map.getZoom().toFixed(2));
        //    });
    //
        //    // Clean up on unmount
        //    return () => map.remove();
        //}, []); // eslint-disable-line react-hooks/exhaustive-deps

        useEffect(() => {
            if (mapRef.current) return; // initialize map only once
            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [longitude, latitude],
                zoom: zoom,
            } );
            mapRef.current = map;
            // map.current = new mapboxgl.Map({
            //     container: mapContainerRef.current,
            //     style: "mapbox://styles/mapbox/streets-v12",
            //     center: [longitude, latitude],
            //     zoom: zoom,
            // });
            // Add navigation control (the +/- zoom buttons)
            map.addControl(new mapboxgl.NavigationControl());
        });
        
        useEffect(() => {
            if (!mapRef.current) return; // wait for map to initialize
            mapRef.current.on("move", () => {
                setLongitude(mapRef.current.getCenter().longitude.toFixed(4));
                setLatitude(mapRef.current.getCenter().latitude.toFixed(4));
                setZoom(mapRef.current.getZoom().toFixed(2));
            });
            // // Clean up on unmount
            // return () => map.remove();
        } );

        return (
            <div
                className="map-container"
                style={{ width: `100%`, height: `100%` }}
                ref={mapContainerRef}>
                {
                    // <Map
                    //     id="mymap"
                    //     initialViewState={{
                    //         longitude: -122.4,
                    //         latitude: 37.8,
                    //         zoom: 14,
                    //     }}
                    //     style={{ width: `auto`, height: `auto` }}
                    //     mapStyle="mapbox://styles/mapbox/streets-v9"
                    //     mapboxAccessToken="pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ"
                    // />
                    // <ReactMapGl
                    //     {...viewport}
                    //     mapboxApiAccessToken={MAPBOX_API_KEY_PK}
                    //     onViewportChange={(viewport) => setViewport(viewport)}
                    //     mapStyle="mapbox://styles/mapbox/streets-v11" // "mapbox://styles/sjohnston00/ckfzik7uk19n419nyty2pubtj?optimze=true"
                    //     onClick={() => setSelectedCrime(null)}>
                    //     <MapMarkers
                    //         policeData={policeData}
                    //         setSelectedCrime={setSelectedCrime}
                    //         selectedCrime={selectedCrime}
                    //     />
                    // </ReactMapGl>
                }
            </div>
        );
    }

    export default MapProvider;

*/






/*
    import React, { useEffect, useRef, useState } from "react";
    import ReactDOM from "react-dom";
    import { render } from "react-dom";

    import { FiMenu } from "react-icons/fi";
    import ReactMapGl, { GeolocateControl } from "react-map-gl";
    import Map, { Marker } from "react-map-gl";
    import "mapbox-gl/dist/mapbox-gl.css";
    import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
    import Tooltip from "./Tooltip";
    const MAPBOX_API_KEY_SK =
        "sk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlamUzdjZzMDIwMzQxbG00eHpjaDk0MyJ9.0BDFwYgJp3IxMgYB6Bc2KQ";
    const MAPBOX_API_KEY_PK =
            "pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ";
    mapboxgl.accessToken = MAPBOX_API_KEY_PK;
    function DataMap({ data }) {
        // https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/256/{z}/{x}/{y}@2x?access_token={access_token}
        const MAPBOX_API_ROUTE = "https://api.mapbox.com/styles/v1/";
        const mapContainer = useRef(null);
        const map = useRef(null);
        
        // const [lng, setLongitude] = useState(-70.9);
        // const [lat, setLatitude] = useState(42.35);
        const [longitude, setLongitude] = useState(-2.31653);
        const [latitude, setLatitude] = useState(51.2296);
        const [zoom, setZoom] = useState(9);
        const [renderData, setRenderData] = React.useState([]);
        const [showSidebar, setShowSidebar] = useState(true);

        const getMap = () =>
        {
            return new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v12",
                center: [longitude, latitude],
                zoom: zoom,
            });
        }
        
        const toggleSidebar = () => {
            if (showSidebar) {
                setShowSidebar(false);
            } else {
                setShowSidebar(true);
            }
        };

        const getCoordinatesFromData = (input) => {
            let coordinatesArray = [];
            if (input) {
                if (Array.isArray(input)) {
                    input.forEach((item, index) => {
                        // console.log( "DATAMAP.js :: Data item = ", item );
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
            console.log("MAPBOX.js :: coordinatesArray = ", coordinatesArray);
            return coordinatesArray;
        };

        useEffect(() => {
            if (!renderData) {
                setRenderData(getCoordinatesFromData(data));
            }
        }, [renderData, data]);
        

        

        return (
            <div className="map-container">
                <div className={`map-sidebar ${showSidebar ? "" : "hidden"}`}>
                    <div className="map-sidebar-content">
                        <div className="input-field">
                            <label for="Latitude">
                                <h2>Latitude</h2>
                                <input
                                    type="number"
                                    name="latitude"
                                    id="latitude"
                                    defaultValue={latitude}
                                    placeholder="Latitude"
                                    label="Latitude"
                                    className="input-field input-field-number"
                                    onChange={(event) => {
                                        setLongitude(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field">
                            <label for="Longitude">
                                <h2>Longitude</h2>
                                <input
                                    type="number"
                                    name="longitude"
                                    id="longitude"
                                    defaultValue={longitude}
                                    placeholder="Longitude"
                                    label="Longitude"
                                    className="input-field input-field-number"
                                    onChange={(event) => {
                                        setLatitude(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field">
                            <label for="Zoom">
                                <h2>Zoom</h2>
                                <input
                                    type="number"
                                    name="zoom"
                                    id="zoom"
                                    defaultValue={zoom}
                                    placeholder="Zoom"
                                    label="Zoom"
                                    className="input-field input-field-number"
                                    onChange={(event) => {
                                        setZoom(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="map-content">
                    <div className="map-content-header">
                        <div className="menu-toggle">
                            <FiMenu
                                className="menu-toggle-button"
                                style={{ width: 20, height: 20 }}
                                onClick={() => {
                                    toggleSidebar();
                                }}
                            />
                        </div>
                        <div className="map-content-header-title">MAPBOX VIEW</div>
                    </div>
                    <div className="map-content-box">
                        <Map
                            initialViewState={{
                                latitude: { latitude },
                                longitude: { longitude },
                                zoom: { zoom },
                            }}
                            style={{ width: `auto`, height: `auto` }}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            mapboxAccessToken={MAPBOX_API_KEY_PK}>
                            <Marker
                                longitude={longitude}
                                latitude={latitude}
                                color="red"
                            />
                        </Map>
                    </div>
                </div>
            </div>
        );
    }

    export default DataMap;
*/

/*
    useEffect(() => {
            console.log("DATAMAP.JS :: pre init :: map = ", map, "\n\n\n", map.current);
        if (!map.current) {
            // initialize map only once
            // Add navigation control (the +/- zoom buttons)
            // map.addControl(new mapboxgl.NavigationControl(), "top-right");
            
            map.current = getMap();
            map.current.addControl( new mapboxgl.NavigationControl() );
            console.log("DATAMAP.JS :: post init :: map = ", map, "\n\n\n", map.current);
            setRenderData(getCoordinatesFromData(data));
        } else if (map.current) {
            // wait for map to initialize
            console.log(
                "DATAMAP.JS :: during execution :: map = ",
                map,
                "\n\n\n",
                map.current,
                "\n\n\n",
            );
            map.current.on("move", () => {
                setLongitude(map.current.getCenter().longitude.toFixed(4));
                setLatitude(map.current.getCenter().latitude.toFixed(4));
                setZoom(map.current.getZoom().toFixed(2));
            });
        }
        // // Clean up on unmount
        // return () => map.remove();
    });

*/

/*
    import React, { useEffect, useRef, useState } from "react";
    import ReactDOM from "react-dom";
    import { FiMenu } from "react-icons/fi";
    import ReactMapGl, { GeolocateControl } from "react-map-gl";
    import Map, { Marker } from "react-map-gl";
    import "mapbox-gl/dist/mapbox-gl.css";
    import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
    import Tooltip from "./Tooltip";
    mapboxgl.accessToken =
        "pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ";
    function DataMap({ data }) {
        // https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/256/{z}/{x}/{y}@2x?access_token={access_token}
        const MAPBOX_API_ROUTE = "https://api.mapbox.com/styles/v1/";
        const MAPBOX_API_KEY_SK =
            "sk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlamUzdjZzMDIwMzQxbG00eHpjaDk0MyJ9.0BDFwYgJp3IxMgYB6Bc2KQ";
        const mapContainer = useRef(null);
        const map = useRef(null);
        const [viewState, setViewState] = React.useState({
            longitude: 51.2296,
            latitude: -2.31653,
            zoom: 3.5,
        });
        // const [lng, setLongitude] = useState(-70.9);
        // const [lat, setLatitude] = useState(42.35);
        const [longitude, setLongitude] = useState(-2.31653);
        const [latitude, setLatitude] = useState(51.2296);
        const [zoom, setZoom] = useState(9);
        const [renderData, setRenderData] = React.useState([]);
        const [showSidebar, setShowSidebar] = useState(true);

        // const [viewport, setViewport] = useState({});
        // useEffect(() => {
        //   navigator.geolocation.getCurrentPosition((pos) => {
        //       setViewport({
        //           ...viewport,
        //           latitude: pos.coords.latitude,
        //           longitude: pos.coords.longitude,
        //           zoom: 3.5,
        //       });
        //   });
        // }, []);

        // useEffect(() => {
        //     if (map.current) return; // initialize map only once
        //     map.current = new mapboxgl.Map({
        //         container: mapContainer.current,
        //         style: "mapbox://styles/mapbox/streets-v12",
        //         center: [longitude, latitude],
        //         zoom: zoom,
        //     });
        //     // Add navigation control (the +/- zoom buttons)
        //     map.addControl(new mapboxgl.NavigationControl(), "top-right");
        // });
        //
        // useEffect(() => {
        //     if (!map.current) return; // wait for map to initialize
        //     map.current.on("move", () => {
        //         setLongitude(map.current.getCenter().longitude.toFixed(4));
        //         setLatitude(map.current.getCenter().latitude.toFixed(4));
        //         setZoom(map.current.getZoom().toFixed(2));
        //     });
        //     // // Clean up on unmount
        //     // return () => map.remove();
        // } );

        const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));

        // Initialize map when component mounts
        useEffect( () =>
        {
            if ( !map.current )
            {
                const map = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: "mapbox://styles/mapbox/streets-v11",
                    center: [-79.38, 43.65],
                    zoom: 12.5,
                });
            }

            if ( map.current )
            {
                // change cursor to pointer when user hovers over a clickable feature
                map.on("mouseenter", (e) => {
                    if (e.features.length) {
                        map.getCanvas().style.cursor = "pointer";
                    }
                });

                // reset cursor to default when user is no longer hovering over a clickable feature
                map.on("mouseleave", () => {
                    map.getCanvas().style.cursor = "";
                });

                // add tooltip when users mouse move over a point
                map.on("mousemove", (e) => {
                    const features = map.queryRenderedFeatures(e.point);
                    if (features.length) {
                        const feature = features[0];

                        // Create tooltip node
                        const tooltipNode = document.createElement("div");
                        ReactDOM.render(<Tooltip feature={feature} />, tooltipNode);

                        // Set tooltip on map
                        tooltipRef.current
                            .setLngLat(e.lngLat)
                            .setDOMContent(tooltipNode)
                            .addTo(map);
                    }
                });
            }

        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        const toggleSidebar = () => {
            if (showSidebar) {
                setShowSidebar(false);
            } else {
                setShowSidebar(true);
            }
        };

        const getCoordinatesFromData = (input) => {
            let coordinatesArray = [];
            if (input) {
                if (Array.isArray(input)) {
                    input.forEach((item, index) => {
                        // console.log( "DATAMAP.js :: Data item = ", item );
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
            console.log("MAPBOX.js :: coordinatesArray = ", coordinatesArray);
            return coordinatesArray;
        };

        setRenderData(getCoordinatesFromData(data));

        return (
            <div className="map-container">
                <div className={`map-sidebar ${showSidebar ? "" : "hidden"}`}>
                    <div className="map-sidebar-content">
                        <div className="input-field">
                            <label for="Latitude">
                                <h2>Latitude</h2>
                                <input
                                    type="number"
                                    name="latitude"
                                    id="latitude"
                                    defaultValue={latitude}
                                    placeholder="Latitude"
                                    label="Latitude"
                                    className="input-field input-field-number"
                                    onChange={(event) => {
                                        setLongitude(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field">
                            <label for="Longitude">
                                <h2>Longitude</h2>
                                <input
                                    type="number"
                                    name="longitude"
                                    id="longitude"
                                    defaultValue={longitude}
                                    placeholder="Longitude"
                                    label="Longitude"
                                    className="input-field input-field-number"
                                    onChange={(event) => {
                                        setLatitude(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                        <div className="input-field">
                            <label for="Zoom">
                                <h2>Zoom</h2>
                                <input
                                    type="number"
                                    name="zoom"
                                    id="zoom"
                                    defaultValue={zoom}
                                    placeholder="Zoom"
                                    label="Zoom"
                                    className="input-field input-field-number"
                                    onChange={(event) => {
                                        setZoom(event.target.value);
                                    }}></input>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="map-content">
                    <div className="map-content-header">
                        <div className="menu-toggle">
                            <FiMenu
                                className="menu-toggle-button"
                                style={{ width: 20, height: 20 }}
                                onClick={() => {
                                    toggleSidebar();
                                }}
                            />
                        </div>
                        <div className="map-content-header-title">MAPBOX VIEW</div>
                    </div>
                    <div className="map-content-box">
                        <div
                            ref={mapContainer}
                            className="map-container"
                            style={{ width: `auto` }}></div>
                    </div>
                </div>
            </div>
        );
    }

    export default DataMap;

*/

/*
{
    "category": "shoplifting",
    "location_type": "Force",
    "location": {
        "latitude": "51.229274",
        "street": {
            "id": 2289372,
            "name": "On or near "
        },
        "longitude": "-2.316799"
    },
    "context": "",
    "outcome_status": {
        "category": "Under investigation",
        "date": "2022-12"
    },
    "persistent_id": "7104490b1568322a49108a1d0b490fcecfe4e7d0479e12e8ff49c7057dd946dd",
    "id": 106881764,
    "location_subtype": "",
    "month": "2022-12"
}
*/

/*
    import React, { useEffect, useState } from "react";
    import ReactMapGl, { GeolocateControl } from "react-map-gl";
    import Map, { Marker } from "react-map-gl";
    import "mapbox-gl/dist/mapbox-gl.css";
    function DataMap({ data }) {
        // https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/256/{z}/{x}/{y}@2x?access_token={access_token}
        const MAPBOX_API_ROUTE = "https://api.mapbox.com/styles/v1/";
        const MAPBOX_API_KEY =
            "sk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlamUzdjZzMDIwMzQxbG00eHpjaDk0MyJ9.0BDFwYgJp3IxMgYB6Bc2KQ";
        const [viewState, setViewState] = React.useState({
            longitude: 51.2296,
            latitude: -2.31653,
            zoom: 3.5,
        });

        const [viewport, setViewport] = useState({});
        // useEffect(() => {
        //   navigator.geolocation.getCurrentPosition((pos) => {
        //       setViewport({
        //           ...viewport,
        //           latitude: pos.coords.latitude,
        //           longitude: pos.coords.longitude,
        //           zoom: 3.5,
        //       });
        //   });
        // }, []);
        return (
            <div className="map-container">
                <div className="map-sidebar">MAPBOX SIDEBAR</div>
                <div className="map-content">
                    <div className="map-content-label">MAPBOX LABEL</div>
                    <div className="map-content-box">
                        <Map
                            {...viewState}
                            onMove={(evt) => setViewState(evt.viewState)}
                            // initialViewState={{
                            //     longitude: 51.2296,
                            //     latitude: -2.31653,
                            //     zoom: 3.5,
                            // }}
                            style={{ width: 600, height: 400 }}
                            mapStyle={"mapbox://styles/mapbox/streets-v9"}
                            mapboxAccessToken={MAPBOX_API_KEY}>
                            <GeolocateControl
                                positionOptions={{ enableHighAccuracy: true }}
                                trackUserLocation={true}
                            />
                            <Marker
                                longitude={-122.4}
                                latitude={37.8}
                                color="red"
                            />
                        </Map>
                    </div>
                </div>
            </div>
        );
    }

    export default DataMap;

*/
