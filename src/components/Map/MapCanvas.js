import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import "mapbox-gl/dist/mapbox-gl.css";
import "./mapbox-gl.css";
import "./mapbox-gl-draw.css";
// import "./Map.css";

// import "https://unpkg.com/@turf/turf@6/turf.min.js";
// import "https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css";
// import "https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.js";
// import DrawControl  from "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.js";
// import "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.css";
import Tooltip from "./Tooltip";
import ReactDOM from "react-dom/client";
import {
    arrayIsValid,
    flatMapObjText,
    has,
    obj2List,
    objArray2List,
} from "../Utilities/ObjectUtils";
import { obj2ListText } from "../Utilities/DOMUtilities";
import * as gutil from "../Utilities/GeoUtilities";
import { MAPBOX_API_KEY_PK } from "../../global/env";
mapboxgl.accessToken = MAPBOX_API_KEY_PK;

const MapCanvas = (props) => {
    const {
        isFetching,
        theme,
        coordinates,
        setCoordinates,
        areas,
        setAreas,
        geometry,
        setGeometry,
        drawdata,
        setDrawdata,
        viewport,
        setViewport,
        initialViewport,
        setInitialViewport,
        showSidebar,
        mapDatatype,
        // latitude,
        // longitude,
        // zoom,
    } = props;
    const mapRef = useRef(null);
    const mapPolyContainerRef = useRef(null);
    const mapCoordinates = useRef([]);
    const [mapMarkers, setMapMarkers] = useState([]);
    const tooltipRef = useRef(new mapboxgl.Popup({ offset: 15 }));
    const [selectedFocusIndex, setSelectedFocusIndex] = useState(0);

    const [pointsGeoJson, setPointsGeoJson] = useState(
        gutil.points2geojsonFeatures(coordinates),
    );
    const [geoJsonFeatures, setGeoJsonFeatures] = useState(
        gutil.data2geojsonfeatures(geometry),
    );

    // const [map, setMap] = useState(data2geojson(data));
    // const [latitude, setLatitude] = useState(51.2296);
    // const [longitude, setLongitude] = useState(-2.31653);
    // const [zoom, setZoom] = useState(9);
    // Initialize map when component mounts

    // Style options: //
    //     mapbox://styles/mapbox/streets-v11
    //     mapbox://styles/mapbox/outdoors-v11
    //     mapbox://styles/mapbox/light-v10
    //     mapbox://styles/mapbox/dark-v10
    //     mapbox://styles/mapbox/satellite-v9
    //     mapbox://styles/mapbox/satellite-streets-v11
    //     mapbox://styles/mapbox/navigation-day-v1
    //     mapbox://styles/mapbox/navigation-night-v1.
    //
    // Generates a random point within 0.025 radius of map center coordinates.
    // @param {CoordinatePair} centerCoordinates - the {@link CoordinatePair} for the map center
    // @return {CoordinatePair} randomly generated coordinate pair
    //
    const getRandomCoordinate = ({
        longitude: centerLon,
        latitude: centerLat,
    }) => {
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
        console.log(
            "MapCanvas.js :: Coordinates changed, updating geo json :: ",
            coordinates,
        );
        setPointsGeoJson(gutil.points2geojsonFeatures(coordinates));
    }, [coordinates]);

    useEffect(() => {
        console.log(
            "MapCanvas.js :: Areas changed, updating geo json :: ",
            areas,
        );
        setPointsGeoJson(gutil.points2geojsonFeatures(areas));
    }, [areas]);

    /*  // mapbox-gl-draw generated featurecollection: 
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "id": "dd7e7a1571f3d632936f57e02a3ac599",
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    -2.372888817501746,
                                    51.300167698350634
                                ],
                                [
                                    -2.4814636611778838,
                                    51.228807060939545
                                ],
                                [
                                    -2.4470831907596846,
                                    51.178504295444725
                                ],
                                [
                                    -2.38386239688343,
                                    51.110387841388814
                                ],
                                [
                                    -2.2409284281207533,
                                    51.14231547273198
                                ],
                                [
                                    -2.0828764476438266,
                                    51.139726116413726
                                ],
                                [
                                    -2.0983976247875944,
                                    51.26840716740446
                                ],
                                [
                                    -2.372888817501746,
                                    51.300167698350634
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                },
                {
                    "id": "616322d65670a3884052c3e96dfda389",
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            -2.062529513217953,
                            51.34815168611749
                        ],
                        "type": "Point"
                    }
                }
            ]
        }
    */

    /*  // Remember, our required data structure is: 
            const [selectedAreas, setSelectedAreas] = useState([
                {
                    id: 0,
                    index: 0,
                    geometry: {
                        type: "polygon",
                        center: {
                            lat: 51.2296,
                            lng: -2.31653,
                        },
                        areasqm: 10, // Write a function that calculates the area using the 'this.' selector.
                        coordinates: [
                            {
                                lat: 51.2296 + 1,
                                lng: -2.31653,
                            },
                            {
                                lat: 51.2296 - 1,
                                lng: -2.31653 - 1,
                            },
                            {
                                lat: 51.2296 - 1,
                                lng: -2.31653 + 1,
                            },
                        ],
                    },
                },
                {
                    id: 1,
                    index: 1,
                    geometry: {
                        type: "point",
                        coordinates: {
                            lat: 0,
                            lng: 0,
                        },
                    },
                },
            ]);
        */
    const updateAreas = (data) => {
        // Unlike the standard mapbox marker placement, mapbox-gl-draw provides us the whole list of rendered coordinates every time we draw something new.

        console.log("MapCanvas.js :: UpdateAreas() :: data = ", data);
        //
        if (has(data, "features")) {
            let newAreas = [];
            let features = data.features;
            console.log(
                "MapCanvas.js :: UpdateAreas() :: unpacking data :: ",
                data,
                features,
            );
            if (arrayIsValid(features, true)) {
                features.forEach((feature, index) => {
                    let area = {
                        id: feature.id,
                        index: arrayIsValid(areas, true) ? areas.length + 1 : 0,
                        geometry: {
                            type: "polygon",
                            center: {
                                lat: 0,
                                lng: 0,
                            },
                            areasqm: 0, // Write a function that calculates the area using the 'this.' selector.
                            coordinates: [],
                        },
                    };
                    let polygeometry = data.features[0].geometry;
                    let polycoordinates =
                        data.features[0].geometry.coordinates[0];
                    console.log(
                        "MapCanvas.js :: UpdateAreas() :: feature #",
                        index,
                        " = ",
                        feature,
                        polygeometry,
                        polycoordinates,
                    );

                    // Get coordinates and format as pointobjects we can use elsewhere.
                    let areacoordinates = [];
                    if (arrayIsValid(polycoordinates, true)) {
                        polycoordinates.forEach((point, index) => {
                            if (gutil.isPointArray(point)) {
                                areacoordinates.push(
                                    gutil.pointArray2PointObj(point),
                                );
                            }
                        });
                    }
                    area.geometry.coordinates = areacoordinates;

                    // Push it to the array of all areas.
                    newAreas.push(area);
                    console.log(
                        "MapCanvas.js :: UpdateAreas() :: newAreas is now = ",
                        newAreas,
                        area,
                    );
                });
            }
            // Coordinates is an array of 2-element arrays.

            // data.features[0].geometry.coordinates[0][0]
            setAreas(newAreas);
        }
    };

    const updateCoordinates = (newCoords, remove = false) => {
        // Check if we already have these coordinates.
        if (remove) {
            // let temp = mapCoordinates.current;
            // temp = temp.filter((point) => {
            //     return !isNearby(
            //         point,
            //         newCoords,
            //         0.001,
            //     );
            // });
            mapCoordinates.current = gutil.filterNearby(
                mapCoordinates.current,
                newCoords,
            );
            setCoordinates(mapCoordinates.current);
        } else {
            let found = false;
            mapCoordinates.current.forEach((point) => {
                if (point) {
                    if (gutil.isNearby(point, newCoords, 0.001)) {
                        found = true;
                    }
                }
            });
            console.log(
                "MapCanvas.js :: updateCoordinates() :: ",
                newCoords,
                remove,
                mapCoordinates.current.includes(newCoords),
                found,
            );
            // }
            if (found) {
                // Currently in coordinates list, so remove it and delete any markers associated with it.
                let temp = mapCoordinates.current;
                temp = temp.filter((point) => {
                    return !gutil.isNearby(point, newCoords, 0.001);
                });
                mapCoordinates.current = temp;
                setCoordinates(mapCoordinates.current);
                return [];
            } else {
                // Not currently in coordinates list, so add it and create a new marker.
                mapCoordinates.current = [...mapCoordinates.current, newCoords];
                // createMarker(points2geojsonFeatures([newCoords])[0]);
                setCoordinates(mapCoordinates.current);
                return gutil.points2geojsonFeatures([newCoords]);
            }
            // Update the geoJson and rerender the markers.
            // let newGeoJson = points2geojsonFeatures(mapCoordinates.current);
            // // newGeoJson.forEach((marker) => {
            // //     createMarker(marker);
            // // });
            // setPointsGeoJson(newGeoJson);
        }
    };

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapPolyContainerRef.current,
            style: `mapbox://styles/mapbox/${
                theme === "dark"
                    ? "dark-v10"
                    : theme === "light"
                    ? "light-v10"
                    : "streets-v11"
            }`,
            // center: [viewport.lng ?? 51.2296, viewport.lat ?? -2.31653],
            // zoom: viewport.zoom ?? 9,
            center: [
                initialViewport.lng ?? 51.2296,
                initialViewport.lat ?? -2.31653,
            ],
            zoom: initialViewport.zoom ?? 9,
        });

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        const onMouseOver = (event) => {
            /*
                (method) mapboxgl.Map.queryRenderedFeatures(pointOrBox?: mapboxgl.PointLike | [mapboxgl.PointLike, mapboxgl.PointLike] | undefined, options?: ({
                    layers?: string[] | undefined;
                    filter?: any[] | undefined;
                } & mapboxgl.FilterOptions) | undefined): mapboxgl.MapboxGeoJSONFeature[]
                Returns an array of GeoJSON Feature objects representing visible features that satisfy the query parameters.

                The properties value of each returned feature object contains the properties of its source feature. For GeoJSON sources, only string and numeric property values are supported (i.e. null, Array, and Object values are not supported).

                Each feature includes top-level layer, source, and sourceLayer properties. The layer property is an object representing the style layer to which the feature belongs. Layout and paint properties in this object contain values which are fully evaluated for the given zoom level and feature.

                Only features that are currently rendered are included. Some features will not be included, like:

                Features from layers whose visibility property is "none".
                Features from layers whose zoom range excludes the current zoom level.
                Symbol features that have been hidden due to text or icon collision.
                Features from all other layers are included, including features that may have no visible contribution to the rendered result; for example, because the layer's opacity or color alpha component is set to 0.

                The topmost rendered feature appears first in the returned array, and subsequent features are sorted by descending z-order. Features that are rendered multiple times (due to wrapping across the antimeridian at low zoom levels) are returned only once (though subject to the following caveat).

                Because features come from tiled vector data or GeoJSON data that is converted to tiles internally, feature geometries may be split or duplicated across tile boundaries and, as a result, features may appear multiple times in query results. For example, suppose there is a highway running through the bounding rectangle of a query. The results of the query will be those parts of the highway that lie within the map tiles covering the bounding rectangle, even if the highway extends into other tiles, and the portion of the highway within each map tile will be returned as a separate feature. Similarly, a point feature near a tile boundary may appear in multiple tiles due to tile buffering.

                @param pointOrBox — The geometry of the query region: either a single point or southwest and northeast points describing a bounding box. Omitting this parameter (i.e. calling Map#queryRenderedFeatures with zero arguments, or with only a options argument) is equivalent to passing a bounding box encompassing the entire map viewport.

                @param options
            */
            // const center = map.getCenter();
            // console.log( "CENTER = ", center );
            const features = map.queryRenderedFeatures(event.point);

            // Limit the number of properties we're displaying for
            // legibility and performance
            const displayProperties = [
                "type",
                "properties",
                "id",
                "layer",
                "source",
                "sourceLayer",
                "state",
            ];

            const displayFeatures = features.map((feat) => {
                const displayFeat = {};
                displayProperties.forEach((prop) => {
                    displayFeat[prop] = feat[prop];
                });
                return displayFeat;
            });

            // Write object as string with an indent of two spaces.
            document.getElementById("features").innerHTML = JSON.stringify(
                displayFeatures,
                null,
                2,
            );

            if (features.length) {
                console.log(
                    "onMouseOver :: ",
                    "\n",
                    "features = ",
                    features,
                    "\n",
                    "features[0] = ",
                    features[0],
                    "\n",
                    "event = ",
                    event,
                    "\n",
                    "event.point = ",
                    event.point,
                    "\n",
                    "map.queryRenderedFeatures(event.point) = ",
                    map.queryRenderedFeatures(event.point),
                );
                const feature = features[0];

                // Create tooltip node
                const tooltipNode = document.createElement("div");
                // ReactDOM.render(<Tooltip feature={feature} />, tooltipNode);
                const tooltipRoot = ReactDOM.createRoot(tooltipNode);
                tooltipRoot.render(<Tooltip feature={feature} />);

                // Set tooltip on map
                if (tooltipRef.current) {
                    tooltipRef.current
                        .setLngLat(event.lngLat)
                        .setDOMContent(tooltipNode)
                        .addTo(map);
                }
            }
        };

        function createMarker(feature) {
            let coords = feature.geometry.coordinates;
            // create the popup
            var popup = new mapboxgl.Popup({
                offset: [0, -10],
                closeButton: false,
                closeOnClick: false,
            })
                .setText(
                    "Construction on the Washington Monument began in 1848.",
                )
                .setHTML(
                    `<p> +
                    ${feature.properties.description}
                </p>`,
                );
            // var marker = new mapboxgl.Marker();
            // marker.setLngLat(clickPosition).addTo(map);

            // Create the parent div.
            var parentElement = document.createElement("div");
            parentElement.className = "marker coordinates-marker";
            parentElement.style.width = `${10}px`;
            parentElement.style.height = `${10}px`;
            console.log(
                `Creating new marker at ${feature.geometry.coordinates}`,
            );

            // create the marker
            let marker = new mapboxgl.Marker(parentElement).setLngLat(coords);

            // get the marker element
            const markerElement = marker.getElement();
            markerElement.id = "marker";
            // hover event listener
            markerElement.addEventListener("mouseenter", (event) => {
                popup.addTo(map);

                // Update the marker's appearance.
                parentElement.style.width = `${14}px`;
                parentElement.style.height = `${14}px`;
                console.log("Marker :: mouseenter :: ", coords, event);
                // onMouseOver( event );
            });
            markerElement.addEventListener("mouseleave", (event) => {
                popup.remove();

                // Update the marker's appearance.
                parentElement.style.width = `${10}px`;
                parentElement.style.height = `${10}px`;
            });
            markerElement.addEventListener("click", (event) => {
                console.log(
                    "Marker was clicked: ",
                    marker,
                    parentElement,
                    markerElement,
                    event,
                );
                parentElement.style.display = "none";
                markerElement.style.display = "none";
                marker.remove();
                updateCoordinates(coords, true);
                // Since this is an existing point, remove it from the array.
                // Since mapbox re-renders are wonky, just hide it until the next rerender.
                let markerCoordinates = coords; // marker.geometry.coordinates;
                let temp = mapCoordinates.current;
                temp = temp.filter((point) => {
                    return !gutil.isNearby(
                        [point.lat, point.lng],
                        markerCoordinates,
                        0.001,
                    );
                });
                mapCoordinates.current = temp;
                setCoordinates(mapCoordinates.current);
            });

            // add popup to marker
            marker.setPopup(popup);
            // add marker to map
            marker.addTo(map);
        }

        if (mapDatatype === "point") {
            map.on("click", (event) => {
                // var marker = new mapboxgl.Marker();
                var clickPosition = event.lngLat; // clickPosition :: {lat: #, lng: #}
                let clickPosGeoJson = updateCoordinates(clickPosition);
                console.log(
                    "MapCanvas.js :: Clicked: ",
                    clickPosition,
                    ", coordinates list is now = ",
                    coordinates,
                    ", mapCoordinates = ",
                    mapCoordinates,
                    ", new position geojson = ",
                    clickPosGeoJson,
                );
                if (arrayIsValid(clickPosGeoJson, true)) {
                    // setCoordinates(mapCoordinates.current);
                    createMarker(clickPosGeoJson[0]);
                }
            });
        } else if (mapDatatype === "polygon") {
            const draw = new MapboxDraw({
                displayControlsDefault: false,
                // Select which mapbox-gl-draw control buttons to add to the map.
                controls: {
                    // polygon: true,
                    // trash: true,
                    point: true,
                    line_string: true,
                    polygon: true,
                    trash: true,
                    combine_features: true,
                    uncombine_features: true,
                },
                // Set mapbox-gl-draw to draw by default.
                // The user does not have to click the polygon control button first.
                defaultMode: "draw_polygon",
            });
            map.addControl(draw);
            map.on("draw.create", (event) => {
                updateArea(event);
            });
            map.on("draw.delete", (event) => {
                updateArea(event);
            });
            map.on("draw.update", (event) => {
                updateArea(event);
            });

            function updateArea(e) {
                const data = draw.getAll();
                console.log(
                    "MapCanvas.js :: updateArea :: data = draw.getAll() = ",
                    e,
                    data,
                );
                // Just using this state array for debug:
                setDrawdata(data);
                // Call one of our own functions to extract the coordinates and update the stored polygonal arrays of coordinates.
                // Construct it such that it can be reused to reconstruct the areas selected on reload.
                let areasGeoJson = updateAreas(data);

                // const answer = document.getElementById("calculated-area");
                // if (data.features.length > 0) {
                //     const area = turf.area(data);
                //     // Restrict the area to 2 decimal points.
                //     const rounded_area = Math.round(area * 100) / 100;
                //     answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
                // } else {
                //     answer.innerHTML = "";
                //     if (e.type !== "draw.delete") alert("Click the map to draw a polygon.");
                // }
            }
        }

        map.on("load", () => {
            console.log(
                "MAP-POLYAREA :: onLOAD :: ",
                // data,
                // "\n\nRenderData = ",
                // renderData,
            );
            debugComponentProps();

            if (arrayIsValid(coordinates, true)) {
                if (!pointsGeoJson) {
                    setPointsGeoJson(gutil.points2geojsonFeatures(coordinates));
                }
                if (pointsGeoJson) {
                    // Create selected-coordinate-points layer.
                    let pointsFeaturesGeoJson = {
                        type: "geojson",
                        data: {
                            type: "FeatureCollection",
                            features: pointsGeoJson,
                        },
                        // cluster: true,
                        // clusterMaxZoom: 13,
                        // clusterRadius: 25,
                    };
                    map.addSource("selectedCoordinates", pointsFeaturesGeoJson);
                    // Add a circle layer
                    // map.addLayer({
                    //     id: "pointsGeoJsonLayer",
                    //     type: "circle",
                    //     source: "selectedCoordinates",
                    //     paint: {
                    //         "circle-color": "#ff4444",
                    //         "circle-radius": 8,
                    //         "circle-stroke-width": 1,
                    //         "circle-stroke-color": "#ff4444",
                    //     },
                    // });

                    // Create a popup, but don't add it to the map yet.
                    const popup = new mapboxgl.Popup({
                        closeButton: true,
                        closeOnClick: true,
                    });

                    pointsGeoJson.forEach((marker) => {
                        createMarker(marker);
                    });
                }
            } // End of arrayIsValid(coordinates)
        }); // end of map.on("load").

        //////////////// Generc stuff below ///////////////
        // Handling updating the center of the viewport when we finish panning the map around.
        map.on("moveend", () => {
            // setLongitude(map.getCenter().lng.toFixed(4));
            // setLatitude(map.getCenter().lat.toFixed(4));
            // setZoom(map.getZoom().toFixed(2));
            // console.log(
            //     "MAPPROVIDER.JS :: During execution :: onMOVE :: map = ",
            //     map,
            //     "\n\n",
            //     "mapPolyContainerRef = ",
            //     mapPolyContainerRef,
            //     "\n\n",
            //     "CENTER = ", map.getCenter()
            // );
            // setViewport({
            //     // ...viewport,
            //     lng: map.getCenter().lng.toFixed(4),
            //     lat: map.getCenter().lat.toFixed(4),
            //     zoom: map.getZoom().toFixed(2),
            // });
            viewport.current = {
                // ...viewport,
                lat: map.getCenter().lat.toFixed(4),
                lng: map.getCenter().lng.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            };
            setInitialViewport({
                // lat: viewport.current.lat,
                // lng: viewport.current.lng,
                // zoom: viewport.current.zoom,
                lat: map.getCenter().lat.toFixed(4),
                lng: map.getCenter().lng.toFixed(4),
                zoom: map.getZoom().toFixed(2),
            });
            console.log(
                "MAP-POLYAREA :: onMoveEnd :: viewport.current is now = ",
                viewport.current,
                ", initialViewport = ",
                initialViewport,
            );
        });

        // Handling displaying information whatever the cursor is hovering over.
        // change cursor to pointer when user hovers over a clickable feature
        map.on("mouseenter", (e) => {
            if (e.features.length) {
                console.log("Mouseenter :: e = ", e);
                onMouseOver(e);
                console.log("Mouseenter :: e.features = ", e.features);
                map.getCanvas().style.cursor = "pointer";
            }
        });

        // reset cursor to default when user is no longer hovering over a clickable feature
        map.on("mouseleave", () => {
            map.getCanvas().style.cursor = "auto";
        });
        map.on("mousemove", (event) => {
            map.getCanvas().style.cursor = "auto";
        });

        mapRef.current = map;
        // Clean up on unmount
        // return () => map.off("click", console.log("Test"));
        return () => map.remove();
    }, [viewport]); // eslint-disable-line react-hooks/exhaustive-deps

    const debugComponentProps = () => {
        console.log("MapCanvas.js re-render :: props = ", props);
        console.log(
            "MapCanvas.js :: OnRender :: ",
            "\n",
            "props = ",
            props,
            "\n",
            "mapPolyContainerRef.current = ",
            mapPolyContainerRef.current,
            "\n",
            "mapRef.current = ",
            mapRef.current,
            "\n",
            "isFetching = ",
            isFetching,
            "\n",
            "theme = ",
            theme,
            "\n",
            "coordinates = ",
            coordinates,
            "\n",
            "areas = ",
            areas,
            "\n",
            "geometry = ",
            geometry,
            "\n",
            "drawdata = ",
            drawdata,
            "\n",
            "viewport = ",
            viewport,
            "\n",
            "initialViewport = ",
            initialViewport,
            "\n",
            "showSidebar = ",
            showSidebar,
            "\n",
            "mapDatatype = ",
            mapDatatype,
            "\n",
            "TEST :: Area geo-obj format to area geo-array format = ",
            gutil.geoObj2geoArray(areas[0]),
        );

        // mapRef.current.map.easeTo({
        //     center: [longitude, latitude],
        //     zoom: zoom,
        // });
    };

    useEffect(() => {
        debugComponentProps();
    }, [props]);

    debugComponentProps();
    return (
        <div
            className=""
            style={{ width: `100%`, height: `100%` }}
            ref={mapPolyContainerRef}
        />
    );
};

export default MapCanvas;