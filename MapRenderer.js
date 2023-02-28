import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
//import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
// import "./Map.css";
import Tooltip from "./Tooltip";
import ReactDOM from "react-dom";

mapboxgl.accessToken =
    "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

const RenderMap = ({
    data,
    renderData,
    // latitude,
    // longitude,
    // zoom,
    // setLatitude,
    // setLongitude,
    // setZoom,
}) => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));

    const [latitude, setLatitude] = useState(51.2296);
    const [longitude, setLongitude] = useState(-2.31653);
    const [zoom, setZoom] = useState(9);
    // Initialize map when component mounts
    // useEffect(() => {
    //     const map = new mapboxgl.Map({
    //         container: mapContainerRef.current,
    //         style: "mapbox://styles/mapbox/streets-v11",
    //         center: [longitude ?? -2.31653, latitude ?? 51.2296],
    //         zoom: zoom ?? 9,
    //     });
    //
    //     map.on("move", () => {
    //         setLongitude(map.getCenter().longitude.toFixed(4));
    //         setLatitude(map.getCenter().latitude.toFixed(4));
    //         setZoom(map.getZoom().toFixed(2));
    //     });
    //     // // Clean up on unmount
    //     // return () => map.remove();
    //     console.log("MAPPROVIDER.JS :: During execution :: map = ", map, "\n\n", "mapContainerRef = ", mapContainerRef);
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
    // }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (mapRef.current) return; // initialize map only once
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [longitude, latitude],
            zoom: zoom,
        });
        // Add navigation control (the +/- zoom buttons)
        mapRef.current.addControl(
            new mapboxgl.NavigationControl(),
            "top-right",
        );
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
    });
    return (
        <div
            className=""
            style={{ width: `100%`, height: `100%` }}
            ref={mapContainerRef}
        />
    );
};

export default RenderMap;
