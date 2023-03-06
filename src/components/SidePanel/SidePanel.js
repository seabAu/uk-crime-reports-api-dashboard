// This is an off-canvas panel set on the right side of the window
// for showing additional information after clicking on a row in the table.

import { Button, Offcanvas } from "bootstrap";
import React, { useState } from "react";
import { flatMapObjText, obj2List } from "../Utilities/ObjectUtils";
import Table from "../Table/Table";
import { FiX } from "react-icons/fi";
import { objArray2List } from "../Utilities/DOMUtilities";
function SidePanel({ show, isFetching, setShow, panelDataID, panelData }) {

    // console.log(
    //     "SidePanel :: ",
    //     show,
    //     isFetching,
    //     setShow,
    //     panelDataID,
    //     panelData,
    // );
    return (
        <div className={`side-panel-container ${show ? "" : "hidden"}`}>
            <div className="side-panel">
                <div className="side-panel-header">
                    <div className="button-row">
                        <button
                            className="close-button side-panel-close-button"
                            onClick={() => {
                                setShow( false );
                                
                            }}>
                            <FiX />
                        </button>
                    </div>
                </div>
                <div className="side-panel-body">
                    <div className="side-panel-label">{`Showing detailed data for crime id = ${panelDataID}`}</div>
                    {show &&
                        panelData &&
                        // flatMapObjText(panelData)
                        objArray2List(panelData)}
                </div>
                <div className="side-panel-footer"></div>
            </div>
        </div>
    );
}

export default SidePanel;

/*

            <Offcanvas
                show={isVisible}
                onHide={() => onClick(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    Some text as placeholder. In real life you can have the
                    elements you have chosen. Like, text, images, lists, etc.
                </Offcanvas.Body>
            </Offcanvas>
*/