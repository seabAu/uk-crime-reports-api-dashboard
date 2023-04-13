import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import area from 'turf';
import './map.css';

// import "https://unpkg.com/@turf/turf@6/turf.min.js";
// import "https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css";
// import "https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.js";
// import DrawControl  from "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.js";
// import "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import "mapbox-gl/dist/mapbox-gl.css";
import "./mapbox-gl.css";
import "./mapbox-gl-draw.css";
// import "./Map.css";

import Tooltip from "./Tooltip";
import ReactDOM from "react-dom/client";

import * as util from '../../utilities';

mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default; // eslint-disable-line
// import { MAPBOX_API_KEY_PK } from "../../global/env";
mapboxgl.accessToken = "pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ";

const MapPoly = (props) => {
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
        util.geo.points2geojsonFeatures(coordinates),
    );
    const [geoJsonFeatures, setGeoJsonFeatures] = useState(
        util.geo.data2geojsonfeatures(geometry),
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
            "MapPoly.js :: Coordinates changed, updating geo json :: ",
            coordinates,
        );
        setPointsGeoJson(util.geo.points2geojsonFeatures(coordinates));
    }, [coordinates]);

    useEffect(() => {
        console.log(
            "MapPoly.js :: Areas changed, updating geo json :: ",
            areas,
        );
        setPointsGeoJson(util.geo.points2geojsonFeatures(areas));
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
    
    const updateAreas = ( data ) =>
    {
        // Unlike the standard mapbox marker placement, mapbox-gl-draw provides us the whole list of rendered coordinates every time we draw something new.

        console.log("MapPoly.js :: UpdateAreas() :: data = ", data);
        //
        if (util.ao.has(data, "features")) {
            let newAreas = [];
            let features = data.features;
            console.log(
                "MapPoly.js :: UpdateAreas() :: unpacking data :: ",
                data,
                features,
            );
            if (util.val.isValidArray(features, true)) {
                features.forEach((feature, index) => {
                    let area = {
                        id: feature.id,
                        index: util.val.isValidArray(areas, true) ? areas.length + 1 : 0,
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
                        "MapPoly.js :: UpdateAreas() :: feature #",
                        index,
                        " = ",
                        feature,
                        polygeometry,
                        polycoordinates,
                    );

                    // Get coordinates and format as pointobjects we can use elsewhere.
                    let areacoordinates = [];
                    if (util.val.isValidArray(polycoordinates, true)) {
                        polycoordinates.forEach((point, index) => {
                            if (util.geo.isPointArray(point)) {
                                areacoordinates.push(
                                    util.geo.pointArray2PointObj(point),
                                );
                            }
                        });
                    }
                    area.geometry.coordinates = areacoordinates;

                    // Push it to the array of all areas.
                    newAreas.push(area);
                    console.log(
                        "MapPoly.js :: UpdateAreas() :: newAreas is now = ",
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

    function createMarker ( feature )
    {
        // Marker API Reference: https://docs.mapbox.com/mapbox-gl-js/api/markers/
        let coords = feature.geometry.coordinates;
        // create the popup
        var popup = new mapboxgl.Popup({
            offset: [0, -10],
            closeButton: false,
            closeOnClick: false,
        })
            .setText('Construction on the Washington Monument began in 1848.')
            .setHTML(
                `<p> +
                    ${feature.properties.description}
                </p>`
            );
        // var marker = new mapboxgl.Marker();
        // marker.setLngLat(clickPosition).addTo(map);
        // const markerHeight = 50;
        // const markerRadius = 10;
        // const linearOffset = 25;
        // const popupOffsets = {
        //     top: [0, 0],
        //     'top-left': [0, 0],
        //     'top-right': [0, 0],
        //     bottom: [0, -markerHeight],
        //     'bottom-left': [
        //         linearOffset,
        //         (markerHeight - markerRadius + linearOffset) * -1,
        //     ],
        //     'bottom-right': [
        //         -linearOffset,
        //         (markerHeight - markerRadius + linearOffset) * -1,
        //     ],
        //     left: [markerRadius, (markerHeight - markerRadius) * -1],
        //     right: [-markerRadius, (markerHeight - markerRadius) * -1],
        // };
        // const popup = new mapboxgl.Popup({
        //     offset: popupOffsets,
        //     className: 'my-class',
        // })
        //     .setLngLat(e.lngLat)
        //     .setHTML('<h1>Hello World!</h1>')
        //     .setMaxWidth('300px')
        //     .addTo(map);

        // Create the parent div.
        var parentElement = document.createElement('div');
        parentElement.className = 'marker coordinates-marker';
        parentElement.style.width = `${10}px`;
        parentElement.style.height = `${10}px`;
        console.log(`Creating new marker at ${feature.geometry.coordinates}`);

        // create the marker
        // Set marker options.
        // const marker = new mapboxgl.Marker({
        //     color: '#FFFFFF',
        //     draggable: true,
        // })
        //     .setLngLat([30.5, 50.5])
        //     .addTo(map);
        let marker = new mapboxgl.Marker(parentElement).setLngLat(coords);

        // get the marker element
        const markerElement = marker.getElement();
        markerElement.id = 'marker';
        // hover event listener
        markerElement.addEventListener('mouseenter', event => {
            popup.addTo(mapRef.current);

            // Update the marker's appearance.
            parentElement.style.width = `${14}px`;
            parentElement.style.height = `${14}px`;
            console.log('Marker :: mouseenter :: ', coords, event);
            // onMouseOver( event );
        });
        markerElement.addEventListener('mouseleave', event => {
            popup.remove();

            // Update the marker's appearance.
            parentElement.style.width = `${10}px`;
            parentElement.style.height = `${10}px`;
        });
        markerElement.addEventListener('click', event => {
            console.log(
                'Marker was clicked: ',
                marker,
                parentElement,
                markerElement,
                event
            );
            parentElement.style.display = 'none';
            markerElement.style.display = 'none';
            marker.remove();
            updateCoordinates(coords, true);
            // Since this is an existing point, remove it from the array.
            // Since mapbox re-renders are wonky, just hide it until the next rerender.
            let markerCoordinates = coords; // marker.geometry.coordinates;
            let temp = mapCoordinates.current;
            temp = temp.filter(point => {
                return !util.geo.isNearby(
                    [point.lat, point.lng],
                    markerCoordinates,
                    0.001
                );
            });
            mapCoordinates.current = temp;
            setCoordinates(mapCoordinates.current);
        });

        // add popup to marker
        marker.setPopup(popup);
        // add marker to map
        marker.addTo(mapRef.current);
    }

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
            mapCoordinates.current = util.geo.filterNearby(
                mapCoordinates.current,
                newCoords,
            );
            setCoordinates(mapCoordinates.current);
        } else {
            let found = false;
            mapCoordinates.current.forEach((point) => {
                if (point) {
                    if (util.geo.isNearby(point, newCoords, 0.001)) {
                        found = true;
                    }
                }
            });
            console.log(
                "MapPoly.js :: updateCoordinates() :: ",
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
                    return !util.geo.isNearby(point, newCoords, 0.001);
                });
                mapCoordinates.current = temp;
                setCoordinates(mapCoordinates.current);
                return [];
            } else {
                // Not currently in coordinates list, so add it and create a new marker.
                mapCoordinates.current = [...mapCoordinates.current, newCoords];
                // createMarker(points2geojsonFeatures([newCoords])[0]);
                setCoordinates(mapCoordinates.current);
                return util.geo.points2geojsonFeatures([newCoords]);
            }
            // Update the geoJson and rerender the markers.
            // let newGeoJson = points2geojsonFeatures(mapCoordinates.current);
            // // newGeoJson.forEach((marker) => {
            // //     createMarker(marker);
            // // });
            // setPointsGeoJson(newGeoJson);
        }
    };

    const map = useRef(null);
    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
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
            zoom: initialViewport.zoom ?? 13,
            antialias: true,
        });
        map.current = mapRef.current;

        // Add navigation control (the +/- zoom buttons)
        mapRef.current.addControl(
            new mapboxgl.NavigationControl(),
            "top-right",
        );

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
            const features = mapRef.current.queryRenderedFeatures(event.point);

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
                    mapRef.current.queryRenderedFeatures(event.point),
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
                        .addTo(mapRef.current);
                }
            }
        };

        if (mapDatatype === "point") {
            mapRef.current.on("click", (event) => {
                // var marker = new mapboxgl.Marker();
                var clickPosition = event.lngLat; // clickPosition :: {lat: #, lng: #}
                let clickPosGeoJson = updateCoordinates(clickPosition);
                console.log(
                    "MapPoly.js :: Clicked: ",
                    clickPosition,
                    ", coordinates list is now = ",
                    coordinates,
                    ", mapCoordinates = ",
                    mapCoordinates,
                    ", new position geojson = ",
                    clickPosGeoJson,
                );
                if (util.val.isValidArray(clickPosGeoJson, true)) {
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
            mapRef.current.addControl(draw);
            mapRef.current.on("draw.create", (event) => {
                updateArea(event);
            });
            mapRef.current.on("draw.delete", (event) => {
                updateArea(event);
            });
            mapRef.current.on("draw.update", (event) => {
                updateArea(event);
            });

            function updateArea(e) {
                const data = draw.getAll();
                console.log(
                    "MapPoly.js :: updateArea :: data = draw.getAll() = ",
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

        mapRef.current.on("load", () => {
            console.log(
                "MAP-POLYAREA :: onLOAD :: ",
                // data,
                // "\n\nRenderData = ",
                // renderData,
            );
            debugComponentProps();

            if (util.val.isValidArray(coordinates, true)) {
                if (!pointsGeoJson) {
                    setPointsGeoJson(util.geo.points2geojsonFeatures(coordinates));
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
                    mapRef.current.addSource(
                        "selectedCoordinates",
                        pointsFeaturesGeoJson,
                    );
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
                    // const popup = new mapboxgl.Popup({
                    //     closeButton: true,
                    //     closeOnClick: true,
                    // });

                    pointsGeoJson.forEach((marker) => {
                        createMarker(marker);
                    });
                }
            } // End of util.val.isValidArray(coordinates)
        }); // end of map.on("load").

        //////////////// Generc stuff below ///////////////
        // Handling updating the center of the viewport when we finish panning the map around.
        mapRef.current.on("moveend", () => {
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
                lat: mapRef.current.getCenter().lat.toFixed(4),
                lng: mapRef.current.getCenter().lng.toFixed(4),
                zoom: mapRef.current.getZoom().toFixed(2),
            };
            setInitialViewport({
                // lat: viewport.current.lat,
                // lng: viewport.current.lng,
                // zoom: viewport.current.zoom,
                lat: mapRef.current.getCenter().lat.toFixed(4),
                lng: mapRef.current.getCenter().lng.toFixed(4),
                zoom: mapRef.current.getZoom().toFixed(2),
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
        mapRef.current.on("mouseenter", (e) => {
            if (e.features.length) {
                console.log("Mouseenter :: e = ", e);
                onMouseOver(e);
                console.log("Mouseenter :: e.features = ", e.features);
                mapRef.current.getCanvas().style.cursor = "pointer";
            }
        });

        // reset cursor to default when user is no longer hovering over a clickable feature
        mapRef.current.on("mouseleave", () => {
            mapRef.current.getCanvas().style.cursor = "auto";
        });
        mapRef.current.on("mousemove", (event) => {
            mapRef.current.getCanvas().style.cursor = "auto";
        });

        // mapRef.current = map;
        // map = mapRef.current;
        // Clean up on unmount
        // return () => map.off("click", console.log("Test"));
        // return () => map.remove();
        return () => map.current.remove();
    }, [viewport]); // eslint-disable-line react-hooks/exhaustive-deps

    const debugComponentProps = () => {
        console.log("MapPoly.js re-render :: props = ", props);
        console.log(
            "MapPoly.js :: OnRender :: ",
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
            util.geo.geoObj2geoArray(areas[0]),
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

export default MapPoly;

/*
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

// import "https://unpkg.com/@turf/turf@6/turf.min.js";
// import "https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.css";
// import "https://api.mapbox.com/mapbox-gl-js/v2.13.0/mapbox-gl.js";
// import DrawControl  from "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.js";
// import "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.0/mapbox-gl-draw.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import "mapbox-gl/dist/mapbox-gl.css";
import "./mapbox-gl.css";
import "./mapbox-gl-draw.css";
// import "./Map.css";

import Tooltip from "./Tooltip";
import ReactDOM from "react-dom/client";
import {
    util.val.isValidArray,
    flatMapObjText,
    util.ao.has,
    obj2List,
    objArray2List,
} from "../Utilities/ObjectUtils";
import { obj2ListText } from "../Utilities/DOMUtilities";
import * as util.geo from "../Utilities/GeoUtilities";

mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default; // eslint-disable-line
// import { MAPBOX_API_KEY_PK } from "../../global/env";
mapboxgl.accessToken = "pk.eyJ1Ijoic2JzaWJ5bGxpbmUiLCJhIjoiY2xlajgxdWplMDh1NzN1cDd0cDl6dXk1aiJ9.buwlClZxBHJqe-0OOXdOVQ";

const MapPoly = (props) => {
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
        util.geo.points2geojsonFeatures(coordinates),
    );
    const [geoJsonFeatures, setGeoJsonFeatures] = useState(
        util.geo.data2geojsonfeatures(geometry),
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
            "MapPoly.js :: Coordinates changed, updating geo json :: ",
            coordinates,
        );
        setPointsGeoJson(util.geo.points2geojsonFeatures(coordinates));
    }, [coordinates]);

    useEffect(() => {
        console.log(
            "MapPoly.js :: Areas changed, updating geo json :: ",
            areas,
        );
        setPointsGeoJson(util.geo.points2geojsonFeatures(areas));
    }, [areas]);

    const updateAreas = (data) => {
        // Unlike the standard mapbox marker placement, mapbox-gl-draw provides us the whole list of rendered coordinates every time we draw something new.

        console.log("MapPoly.js :: UpdateAreas() :: data = ", data);
        //
        if (util.ao.has(data, "features")) {
            let newAreas = [];
            let features = data.features;
            console.log(
                "MapPoly.js :: UpdateAreas() :: unpacking data :: ",
                data,
                features,
            );
            if (util.val.isValidArray(features, true)) {
                features.forEach((feature, index) => {
                    let area = {
                        id: feature.id,
                        index: util.val.isValidArray(areas, true) ? areas.length + 1 : 0,
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
                        "MapPoly.js :: UpdateAreas() :: feature #",
                        index,
                        " = ",
                        feature,
                        polygeometry,
                        polycoordinates,
                    );

                    // Get coordinates and format as pointobjects we can use elsewhere.
                    let areacoordinates = [];
                    if (util.val.isValidArray(polycoordinates, true)) {
                        polycoordinates.forEach((point, index) => {
                            if (util.geo.isPointArray(point)) {
                                areacoordinates.push(
                                    util.geo.pointArray2PointObj(point),
                                );
                            }
                        });
                    }
                    area.geometry.coordinates = areacoordinates;

                    // Push it to the array of all areas.
                    newAreas.push(area);
                    console.log(
                        "MapPoly.js :: UpdateAreas() :: newAreas is now = ",
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
            mapCoordinates.current = util.geo.filterNearby(
                mapCoordinates.current,
                newCoords,
            );
            setCoordinates(mapCoordinates.current);
        } else {
            let found = false;
            mapCoordinates.current.forEach((point) => {
                if (point) {
                    if (util.geo.isNearby(point, newCoords, 0.001)) {
                        found = true;
                    }
                }
            });
            console.log(
                "MapPoly.js :: updateCoordinates() :: ",
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
                    return !util.geo.isNearby(point, newCoords, 0.001);
                });
                mapCoordinates.current = temp;
                setCoordinates(mapCoordinates.current);
                return [];
            } else {
                // Not currently in coordinates list, so add it and create a new marker.
                mapCoordinates.current = [...mapCoordinates.current, newCoords];
                // createMarker(points2geojsonFeatures([newCoords])[0]);
                setCoordinates(mapCoordinates.current);
                return util.geo.points2geojsonFeatures([newCoords]);
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
            zoom: initialViewport.zoom ?? 13,
            antialias: true,
        });

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        const onMouseOver = (event) => {
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
                    return !util.geo.isNearby(
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
                    "MapPoly.js :: Clicked: ",
                    clickPosition,
                    ", coordinates list is now = ",
                    coordinates,
                    ", mapCoordinates = ",
                    mapCoordinates,
                    ", new position geojson = ",
                    clickPosGeoJson,
                );
                if (util.val.isValidArray(clickPosGeoJson, true)) {
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
                    "MapPoly.js :: updateArea :: data = draw.getAll() = ",
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

            if (util.val.isValidArray(coordinates, true)) {
                if (!pointsGeoJson) {
                    setPointsGeoJson(util.geo.points2geojsonFeatures(coordinates));
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
            } // End of util.val.isValidArray(coordinates)
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
        console.log("MapPoly.js re-render :: props = ", props);
        console.log(
            "MapPoly.js :: OnRender :: ",
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
            util.geo.geoObj2geoArray(areas[0]),
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

export default MapPoly;
*/


/*
    const buildMarker = ( feature, mapref ) =>
    {
        
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
                popup.addTo(mapref);

                // Update the marker's appearance.

                // parentElement.style.scale = `${1.125}`;
                // parentElement.style.transform = `scale${1.125}`;
                // parentElement.style.height = `${14}px`;
                parentElement.style.width = `${14}px`;
                parentElement.style.height = `${14}px`;
                console.log("Marker :: mouseenter :: ", coords, event);
                // onMouseOver( event );
            });
            markerElement.addEventListener("mouseleave", (event) => {
                popup.remove();

                // Update the marker's appearance.

                // parentElement.style.scale = `${1.0}`;
                // parentElement.style.transform = `scale${1.0}`;
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
                // let markerCoordinates = coords; // marker.geometry.coordinates;
                // let temp = mapCoordinates.current;
                // temp = temp.filter((point) => {
                //     return !isNearby(
                //         [point.lat, point.lng],
                //         markerCoordinates,
                //         0.001,
                //     );
                // });
                // mapCoordinates.current = temp;
                // setCoordinates(mapCoordinates.current);
            });

    }

*/
/*
        // Handling creating a new marker with clicked coordinates
        // var marker = new mapboxgl.Marker();
        // function add_marker(event) {
        //     var marker = new mapboxgl.Marker();
        //     var clickPosition = event.lngLat;
        //     marker.setLngLat(clickPosition).addTo(map);
        //     mapCoordinates.current = [
        //         ...mapCoordinates.current,
        //         {
        //             lat: clickPosition.lat,
        //             lng: clickPosition.lng,
        //         },
        //     ];
        //     setCoordinates(mapCoordinates.current);
        //     console.log(
        //         "MapPoly.js :: Clicked: Lng:",
        //         clickPosition.lng,
        //         "Lat:",
        //         clickPosition.lat,
        //         ", coordinates list is now = ",
        //         coordinates,
        //         ", mapCoordinates = ",
        //         mapCoordinates,
        //     );
        // }
        // map.on("click", add_marker);

        // var marker = new mapboxgl.Marker();
        function add_coordinates(event) {
            // var marker = new mapboxgl.Marker();
            var clickPosition = event.lngLat; // clickPosition :: {lat: #, lng: #}
            let clickPosGeoJson = updateCoordinates(clickPosition);
            console.log(
                "MapPoly.js :: Clicked: ",
                clickPosition,
                ", coordinates list is now = ",
                coordinates,
                ", mapCoordinates = ",
                mapCoordinates,
                ", new position geojson = ",
                clickPosGeoJson,
            );
            if (util.val.isValidArray(clickPosGeoJson, true)) {
                // setCoordinates(mapCoordinates.current);
                createMarker(clickPosGeoJson[0]);
            }
        }

    map.on("mouseenter", "pointsGeoJsonLayer", (e) => {
        if (e.features.length) {
            map.getCanvas().style.cursor = "pointer";
        }
    });
    map.on("mouseleave", "pointsGeoJsonLayer", () => {
        map.getCanvas().style.cursor = "";
    });

    map.on("mouseenter", "pointsGeoJsonLayer", (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";

        // Copy coordinates array.
        const coordinates =
            e.features[0].geometry.coordinates.slice();
        const description =
            e.features[0].properties.description;

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

    map.on("mouseleave", "pointsGeoJsonLayer", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
    });

    map.on("click", "pointsGeoJsonLayer", (event) => {
        // Copy coordinates array.
        const location =
            event.features[0].geometry.coordinates.slice();
        const description =
            event.features[0].properties.description;
        console.log(
            "Clicked on coordinate point - ",
            location,
            description,
            ", mapCoordinates.current = ",
            mapCoordinates.current,
            ", coordinates = ",
            coordinates,
        );

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(event.lngLat.lng - location[0]) > 180) {
            location[0] +=
                event.lngLat.lng > location[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup
            .setLngLat(location)
            .setHTML(description)
            .addTo(map);
    });
*/
/*

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
                    filter: ["util.ao.has", "point_count"],
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
                    filter: ["util.ao.has", "point_count"],
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
                    filter: ["!", ["util.ao.has", "point_count"]],
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

        // 
        // add tooltip when users mouse move over a point
        // map.on("mousemove", (e) => {
        //     // const center = map.getCenter();
        //     // console.log( "CENTER = ", center );
        //     const features = map.queryRenderedFeatures(e.point);
        //     if (features.length) {
        //         const feature = features[0];
        // 
        //         // Create tooltip node
        //         const tooltipNode = document.createElement("div");
        //         // ReactDOM.render(<Tooltip feature={feature} />, tooltipNode);
        //         const tooltipRoot = ReactDOM.createRoot(tooltipNode);
        // 
        //         tooltipRoot.render(<Tooltip feature={feature} />);
        // 
        //         // Set tooltip on map
        //         if (tooltipRef.current) {
        //             tooltipRef.current
        //                 .setLngLat(e.lngLat)
        //                 .setDOMContent(tooltipNode)
        //                 .addTo(map);
        //         }
        //     }
        // });
        // 

        mapRef.current = map;
        // Clean up on unmount
        return () => map.remove();
        // }, [selectedFocusIndex]); // eslint-disable-line react-hooks/exhaustive-deps
    }, [viewport]); // eslint-disable-line react-hooks/exhaustive-deps

*/
