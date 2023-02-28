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
} from "../ObjectUtils/ObjectUtils";

const MAPBOX_API_KEY_SK =
    "sk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlamUzdjZzMDIwMzQxbG00eHpjaDk0MyJ9.0BDFwYgJp3IxMgYB6Bc2KQ";
const MAPBOX_API_KEY_PK =
    "pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ";
mapboxgl.accessToken = MAPBOX_API_KEY_PK;
// mapboxgl.accessToken = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const RenderMap2 = ({
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
}) => {
    const mapContainerRef = useRef(null);
    const renderDataPoints = () => {
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

                                if (properties) {
                                    points.push({
                                        type: "Feature",
                                        properties: {
                                            description: `<ul className="obj-list">${properties.join(
                                                "",
                                            )}</ul>`, // objArray2List(report).toString(),
                                        },
                                        geometry: {
                                            type: "Point",
                                            coordinates: [
                                                locObj.longitude,
                                                locObj.latitude,
                                            ],
                                        },
                                    });
                                    // console.log(
                                    //     "RENDERMAP.JS :: onLOAD :: points = ",
                                    //     points,
                                    //     "properties.join('<li>') = ",
                                    //     properties.join("<li>"),
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

    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
    const [dataPoints, setDataPoints] = useState(renderDataPoints(data));
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

            let points = [];
            if (!dataPoints) {
                // Only generate this data if we need to; avoid excessive re-calculation.
                setDataPoints(renderDataPoints(data));
            }
            // Construct a points list in JSON out of the provided coordinates.
            /*
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
                                if (
                                    "latitude" in locObj &&
                                    "longitude" in locObj
                                ) {
                                    const properties = Object.entries(
                                        report,
                                    ).map((prop, index) => {
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
                                            return `<li><div className="obj-list-key">${key}</div><div className="obj-list-value">${value}</div></li>`;
                                        } else {
                                            return "";
                                        }
                                    });

                                    if ( properties )
                                    {
                                        points.push({
                                            type: "Feature",
                                            properties: {
                                                description:
                                                    `<ul className="obj-list">${properties.join("")}</ul>`, // objArray2List(report).toString(),
                                            },
                                            geometry: {
                                                type: "Point",
                                                coordinates: [
                                                    locObj.longitude,
                                                    locObj.latitude,
                                                ],
                                            },
                                        });
                                        console.log(
                                            "RENDERMAP.JS :: onLOAD :: points = ",
                                            points,
                                            "properties.join('<li>') = ",
                                            properties.join("<li>"),
                                        );
                                    }
                                }
                            }
                        });
                    }
                    // renderData.forEach( point =>
                    // {
                    //     if ( point && typeof point === "object")
                    //     {
                    //         if ( "latitude" in point && "longitude" in point )
                    //         {
                    //             points.push({
                    //                 type: "Feature",
                    //                 properties: {},
                    //                 geometry: {
                    //                     type: "Point",
                    //                     coordinates: [point.longitude, point.latitude],
                    //                 },
                    //             });
                    //         }
                    //     }
                    // });
                }
            }
            */
            if (dataPoints) {
                map.addSource("points", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: dataPoints,
                    },
                });
                // Add a circle layer
                map.addLayer({
                    id: "reportsLocations",
                    type: "circle",
                    source: "points",
                    paint: {
                        "circle-color": "#ff4444",
                        "circle-radius": 6,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#ffffff",
                    },
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

        map.on("move", () => {
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

        /*
            // add tooltip when users mouse move over a point
            map.on( "mousemove", ( e ) =>
            {
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
        */

        // Clean up on unmount
        return () => map.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    };

    return (
        <div
            className=""
            style={{ width: `100%`, height: `100%` }}
            ref={mapContainerRef}
        />
    );
};

export default RenderMap2;
