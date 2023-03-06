import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
// import "./Map.css";
import Tooltip from "./Tooltip";
import ReactDOM from "react-dom/client";
import {
    flatMapObjText,
    obj2List,
    objArray2List,
} from "../Utilities/ObjectUtils";
import { obj2ListText } from "../Utilities/DOMUtilities";

const MAPBOX_API_KEY_SK =
    "sk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlamUzdjZzMDIwMzQxbG00eHpjaDk0MyJ9.0BDFwYgJp3IxMgYB6Bc2KQ";
const MAPBOX_API_KEY_PK =
    "pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ";
mapboxgl.accessToken = MAPBOX_API_KEY_PK;
// mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const RenderMap = ({
    data,
    renderData,
    latitude,
    longitude,
    zoom,
    setLatitude,
    setLongitude,
    setZoom,
    showSidebar,
    theme,
} ) =>
{
    const mapRef = useRef(null);
    const mapContainerRef = useRef( null );

    const data2geojson = () => {
        let points = [];
        // Construct a points list in JSON out of the provided coordinates.
        if (data) {
            if (data.length > 0) {
                if (Array.isArray(data)) {
                    data.forEach((report, index) => {
                        // console.log( "MapContent.js :: Data item = ", item );
                        // let pointCoordinates = [];
                        let locObj;
                        if (report) {
                            if ("location" in report) {
                                // Instance of reports returned by the get-reports-at-location API call.
                                locObj = report.location;
                            } else if ("centre" in report) {
                                // Instance of neighborhood data
                                locObj = report.centre;
                            }
                            // console.log(
                            //     "RENDERMAP.JS :: onLOAD :: report = ",
                            //     report,
                            //     ",report.location = ",
                            //     report.location,
                            //     ", locObj = ",
                            //     locObj,
                            // );
                        }

                        // Check that we have coordinates at this point. If we do, proceed with building the mouseover info.
                        if (locObj) {
                            if ("latitude" in locObj && "longitude" in locObj) {
                                let desc = obj2ListText( report );
                                if ( desc )
                                {
                                    // console.log( "Desc = ", desc );
                                    points.push({
                                        type: "Feature",
                                        properties: {
                                            description: desc,
                                            // description: `<ul className="obj-list">${ properties.join( "" ) }</ul>`,
                                            // objArray2List(report).toString(),
                                        },
                                        geometry: {
                                            type: "Point",
                                            coordinates: [
                                                parseFloat(locObj.longitude) +
                                                    0.0001 * Math.random(),
                                                parseFloat(locObj.latitude) +
                                                    0.0001 * Math.random(),
                                            ],
                                        },
                                    });
                                    // console.log(
                                    //     "RENDERMAP.JS :: onLOAD :: points = ",
                                    //     points,
                                    //     // "properties.join('<li>') = ",
                                    //     // properties.join("<li>"),
                                    // );
                                }
                            }
                        }
                    });
                }
            }
        }
        // console.log("RENDERMAP.JS :: points in renderPoints() :: ", points);
        return points;
    };

    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
    const [dataPoints, setDataPoints] = useState(data2geojson(data));
    const [viewport, setViewport] = useState({
        longitude: latitude,
        latitude: longitude,
        zoom: zoom,
    });
    const [selectedFocusIndex, setSelectedFocusIndex] = useState(0);

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
                if ("longitude" in locObj && "latitude" in locObj) {
                    return [locObj.longitude, locObj.latitude];
                }
            }
        }
    };

    // const [map, setMap] = useState(data2geojson(data));
    // const [latitude, setLatitude] = useState(51.2296);
    // const [longitude, setLongitude] = useState(-2.31653);
    // const [zoom, setZoom] = useState(9);
    // Initialize map when component mounts
    /* // Style options: //
        mapbox://styles/mapbox/streets-v11
        mapbox://styles/mapbox/outdoors-v11
        mapbox://styles/mapbox/light-v10
        mapbox://styles/mapbox/dark-v10
        mapbox://styles/mapbox/satellite-v9
        mapbox://styles/mapbox/satellite-streets-v11
        mapbox://styles/mapbox/navigation-day-v1
        mapbox://styles/mapbox/navigation-night-v1.
    */
    /**
    //* Generates a random point within 0.025 radius of map center coordinates.
    //* @param {CoordinatePair} centerCoordinates - the {@link CoordinatePair} for the map center
    //* @return {CoordinatePair} randomly generated coordinate pair
    //*/
    const getRandomCoordinate = ({longitude: centerLon,latitude: centerLat,}) => {
        const r = 0.025 * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const latitude = centerLat + r * Math.cos(theta);
        const longitude = centerLon + r * Math.sin(theta);
        return { longitude, latitude };
    };

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

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: `mapbox://styles/mapbox/${
                theme === "dark"
                    ? "dark-v10"
                    : theme === "light"
                    ? "light-v10"
                    : "streets-v11"
            }`,
            center: [longitude, latitude],
            zoom: zoom ?? 9,
        });

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
            console.log(
                "RENDERMAP.JS :: onLOAD :: Data = ",
                data,
                "\n\nRenderData = ",
                renderData,
            );

            // Hacky functionality to make sure the map resizes when the sidebar expands or shrinks.
            var mapCanvas =
                document.getElementsByClassName("mapboxgl-canvas")[0];
            var toggleButton = document.getElementById(
                "map-sidebar-toggle-button",
            );
            if (mapCanvas && toggleButton) {
                toggleButton.onclick = function () {
                    if (!showSidebar) {
                        mapCanvas.style.width = "100%";
                        //showSidebar = true;
                    } else {
                        mapCanvas.style.width = "100%";
                        //showSidebar = "bigger";
                    }
                    setTimeout(() => {
                        map.resize();
                    }, 1000);
                };
                // fixButton.onclick = function () {
                //     map.resize();
                // };
            }

            // Hacky way of setting up the different zoom-to buttons that are created in the parent element.
            // Later we'll just merge the functionality and have the buttons be created here.
            var sidebarButtonContainer = document.getElementById(
                "map-sidebar-buttons-container",
            );
            var sidebarButtons =
                document.getElementsByClassName("map-sidebar-button");
            // console.log(
            //     "RENDERMAP.JS :: onLOAD :: sidebarButtonContainer = ",
            //     sidebarButtonContainer,
            //     "\n\n",
            //     "sidebarButtons = ",
            //     sidebarButtons,
            // );
            if (sidebarButtons) {
                for ( var i = 0; i < sidebarButtons.length; i++ )
                {
                    if (data[i]) {
                        let coordinates = getCoordinateFromData(data[i]);
                        if (coordinates) {
                            sidebarButtons[i].onclick = function (i) {
                                setSelectedFocusIndex(i);
                                setViewport({
                                    longitude: coordinates.longitude,
                                    latitude: coordinates.latitude,
                                    zoom: 5.0,
                                });
                            };
                        }
                    }
                }
                // sidebarButtons.forEach( ( button, index ) =>
                // {
                //     button.onclick = function ()
                //     {
                //         setSelectedFocusIndex(index);
                //     }
                // })
            }
            // Hacky way of setting the initial position of the map.
            // Get initial coordinates from first entry in data.
            if (data) {
                if (data.length > selectedFocusIndex) {
                    let coordinates = getCoordinateFromData(
                        data[selectedFocusIndex],
                    );
                    if (coordinates) {
                        map.easeTo({
                            center: coordinates,
                            zoom: zoom,
                        });
                    }
                }
            }

            if (!dataPoints) {
                // Only generate this data if we need to; avoid excessive re-calculation.
                setDataPoints(data2geojson(data));
            }
            // Construct a points list in JSON out of the provided coordinates.
            if (dataPoints) {
                map.addSource("points", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: dataPoints,
                    },
                    cluster: true,
                    clusterMaxZoom: 13,
                    clusterRadius: 25,
                });
                // Add a circle layer
                map.addLayer({
                    id: "reportsLocations",
                    type: "circle",
                    source: "points",
                    paint: {
                        "circle-color": "#ff4444",
                        "circle-radius": 8,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#ff4444",
                    },
                });

                const total_reports = data.length;
                map.addLayer({
                    id: "clusters",
                    type: "circle",
                    source: "points",
                    filter: ["has", "point_count"],
                    paint: {
                        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                        // with three steps to implement three types of circles:
                        //   * Blue, 20px circles when point count is less than 100
                        //   * Yellow, 30px circles when point count is between 100 and 750
                        //   * Pink, 40px circles when point count is greater than or equal to 750
                        "circle-color": [
                            "step",
                            ["get", "point_count"],
                            `#ffbbd6`,
                            Math.round(total_reports * 0.25), // 25th percentile
                            `#ffa075`,
                            Math.round(total_reports * 0.5), // 50th percentile
                            `#ff8cb1`,
                            Math.round(total_reports * 0.75), // 75th percentile
                            `#ff5555`,
                        ],
                        "circle-radius": [
                            "step",
                            ["get", "point_count"],
                            8,
                            Math.round(total_reports * 0.15), // 15th percentile
                            16,
                            Math.round(total_reports * 0.25), // 25th percentile
                            24,
                            Math.round(total_reports * 0.95), // 95th percentile
                            32,
                        ],
                    },
                });

                map.addLayer({
                    id: "cluster-count",
                    type: "symbol",
                    source: "points",
                    filter: ["has", "point_count"],
                    layout: {
                        "text-field": ["get", "point_count_abbreviated"],
                        "text-font": [
                            "DIN Offc Pro Medium",
                            "Arial Unicode MS Bold",
                        ],
                        "text-size": 12,
                    },
                });

                map.addLayer({
                    id: "unclustered-point",
                    type: "circle",
                    source: "points",
                    filter: ["!", ["has", "point_count"]],
                    paint: {
                        "circle-color": "#11b4da",
                        "circle-radius": 4,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#fff",
                    },
                });

                // inspect a cluster on click
                map.on("click", "clusters", (e) => {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: ["clusters"],
                    });
                    const clusterId = features[0].properties.cluster_id;
                    map.getSource("points").getClusterExpansionZoom(
                        clusterId,
                        (err, zoom) => {
                            if (err) return;

                            map.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom,
                            });
                        },
                    );
                });

                // When a click event occurs on a feature in
                // the unclustered-point layer, open a popup at
                // the location of the feature, with
                // description HTML from its properties.
                map.on("click", "unclustered-point", (e) => {
                    const coordinates =
                        e.features[0].geometry.coordinates.slice();
                    // const mag = e.features[0].properties.mag;
                    // const tsunami = e.features[0].properties.tsunami === 1 ? "yes" : "no";
                    const description = e.features[0].properties.description;

                    // Ensure that if the map is zoomed out such that
                    // multiple copies of the feature are visible, the
                    // popup appears over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] +=
                            e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    new mapboxgl.Popup({
                        closeButton: true,
                        closeOnClick: true,
                    })
                        .setLngLat(coordinates)
                        .setHTML(
                            description,
                            // `magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`,
                        )
                        .addTo(map);
                });

                map.on("mouseenter", "clusters", () => {
                    map.getCanvas().style.cursor = "pointer";
                });
                map.on("mouseleave", "clusters", () => {
                    map.getCanvas().style.cursor = "";
                });
                // Create a popup, but don't add it to the map yet.
                const popup = new mapboxgl.Popup({
                    closeButton: true,
                    closeOnClick: true,
                });

                // Center the map on the coordinates of any clicked circle from the 'circle' layer.
                map.on("click", "reportsLocations", (e) => {
                    map.flyTo({
                        center: e.features[0].geometry.coordinates,
                    });

                    // Copy coordinates array.
                    const coordinates =
                        e.features[0].geometry.coordinates.slice();
                    const description = e.features[0].properties.description;

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] +=
                            e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup
                        .setLngLat(coordinates)
                        .setHTML(description)
                        .addTo(map);
                });

                map.on("mouseenter", "reportsLocations", (e) => {
                    // Change the cursor style as a UI indicator.
                    map.getCanvas().style.cursor = "pointer";
                });

                map.on("mouseleave", "reportsLocations", () => {
                    map.getCanvas().style.cursor = "";
                    // popup.remove();
                });
            }
        }); // end of map.on("load").

        map.on("moveend", () => {
            setLongitude(map.getCenter().lng.toFixed(4));
            setLatitude(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
            // console.log(
            //     "MAPPROVIDER.JS :: During execution :: onMOVE :: map = ",
            //     map,
            //     "\n\n",
            //     "mapContainerRef = ",
            //     mapContainerRef,
            //     "\n\n",
            //     "CENTER = ", map.getCenter()
            // );
        });

        // // Clean up on unmount
        // return () => map.remove();
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

        // /*
        // add tooltip when users mouse move over a point
        map.on("mousemove", (e) => {
            // const center = map.getCenter();
            // console.log( "CENTER = ", center );
            const features = map.queryRenderedFeatures(e.point);
            if (features.length) {
                const feature = features[0];

                // Create tooltip node
                const tooltipNode = document.createElement("div");
                // ReactDOM.render(<Tooltip feature={feature} />, tooltipNode);
                const tooltipRoot = ReactDOM.createRoot(tooltipNode);

                tooltipRoot.render(<Tooltip feature={feature} />);

                // Set tooltip on map
                if (tooltipRef.current) {
                    tooltipRef.current
                        .setLngLat(e.lngLat)
                        .setDOMContent(tooltipNode)
                        .addTo(map);
                }
            }
        });
        // */

        mapRef.current = map;
        // Clean up on unmount
        return () => map.remove();
    // }, [selectedFocusIndex]); // eslint-disable-line react-hooks/exhaustive-deps
    }, [viewport]); // eslint-disable-line react-hooks/exhaustive-deps

    const debugComponentProps = () => {
        console.log(
            "RENDERMAP.JS :: OnRender :: ",
            "\ndata = ",
            data,
            "\nrenderData = ",
            renderData,
            "\nlatitude = ",
            latitude,
            "\nlongitude = ",
            longitude,
            "\nzoom = ",
            zoom,
            "\nsetLatitude = ",
            setLatitude,
            "\nsetLongitude = ",
            setLongitude,
            "\nsetZoom = ",
            setZoom,
        );

        console.log(
            "mapContainerRef.current = ",
            mapContainerRef.current,
            "\n\n",
            "mapRef.current = ",
            mapRef.current,
        );

        // mapRef.current.map.easeTo({
        //     center: [longitude, latitude],
        //     zoom: zoom,
        // });
    };
    // debugComponentProps();
    return (
        <div
            className=""
            style={{ width: `100%`, height: `100%` }}
            ref={mapContainerRef}
        />
    );
};

export default RenderMap;

/*
    const data2geojson = () => {
        let points = [];
        // Construct a points list in JSON out of the provided coordinates.
        if (data) {
            if (data.length > 0) {
                if (Array.isArray(data)) {
                    data.forEach((report, index) => {
                        // console.log( "MapContent.js :: Data item = ", item );
                        // let pointCoordinates = [];
                        let locObj;
                        if (report) {
                            if ("location" in report) {
                                // Instance of reports returned by the get-reports-at-location API call.
                                locObj = report.location;
                            } else if ("centre" in report) {
                                // Instance of neighborhood data
                                locObj = report.centre;
                            }
                            // console.log(
                            //     "RENDERMAP.JS :: onLOAD :: report = ",
                            //     report,
                            //     ",report.location = ",
                            //     report.location,
                            //     ", locObj = ",
                            //     locObj,
                            // );
                        }

                        // Check that we have coordinates at this point. If we do, proceed with building the mouseover info.
                        if (locObj) {
                            if ("latitude" in locObj && "longitude" in locObj) {
                                const properties = Object.entries(report).map(
                                    (prop, index) => {
                                        let key = prop[0];
                                        let value = prop[1];

                                        if (
                                            value !== undefined &&
                                            value !== null &&
                                            value !== "" &&
                                            key !== undefined &&
                                            key !== null &&
                                            key !== ""
                                        ) {
                                            return `<li className="obj-list-item"><div className="obj-list-key">${key}</div><div className="obj-list-value">${value}</div></li>`;
                                        } else {
                                            return "";
                                        }
                                    },
                                );

                                if ( properties )
                                {
                                    let desc = obj2ListText( report );
                                    console.log( "Desc = ", desc );
                                    points.push({
                                        type: "Feature",
                                        properties: {
                                            description: desc,
                                            // description: `<ul className="obj-list">${ properties.join( "" ) }</ul>`,
                                            // objArray2List(report).toString(),
                                        },
                                        geometry: {
                                            type: "Point",
                                            coordinates: [
                                                parseFloat(locObj.longitude) +
                                                    0.0001 * Math.random(),
                                                parseFloat(locObj.latitude) +
                                                    0.0001 * Math.random(),
                                            ],
                                        },
                                    });
                                    // console.log(
                                    //     "RENDERMAP.JS :: onLOAD :: points = ",
                                    //     points,
                                    //     // "properties.join('<li>') = ",
                                    //     // properties.join("<li>"),
                                    // );
                                }
                            }
                        }
                    });
                }
            }
        }
        console.log("RENDERMAP.JS :: points in renderPoints() :: ", points);
        return points;
    };
*/