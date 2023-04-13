import React from 'react'
import './formelements.css';

function DebugFields() {
  return (
        <div className="flex-col">
            <input
                type="text"
                label="Category"
                id="categoryTextDisplay"
                placeholder="Category"
                className="input-field"
                onChange={() => {}}
                required
                value={""}></input>
            <input
                type="text"
                label="Force"
                id="forceTextDisplay"
                placeholder="Force"
                className="input-field"
                onChange={() => {}}
                required
                value={""}></input>
            <input
                type="text"
                label="Date"
                id="dateTextDisplay"
                placeholder="Date"
                className="input-field"
                onChange={() => {}}
                required
                value={""}></input>
            <textarea
                required
                rows="15"
                cols="60"
                readonly
                tabindex="-1"
                label="Neighborhood"
                id="forceNeighborhoodTextDisplay"
                placeholder="Neighborhood"
                onChange={() => {}}
                value={""}
                className="input-field input-field-textbox"></textarea>
            <textarea
                required
                rows="15"
                cols="60"
                readonly
                tabindex="-1"
                label="Neighborhoods"
                id="forceNeighborhoodsTextDisplay"
                placeholder="Neighborhoods"
                onChange={() => {}}
                value={""}
                className="input-field input-field-textbox"></textarea>
            <textarea
                required
                rows="15"
                cols="60"
                readonly
                tabindex="-1"
                label="Neighborhood Data"
                id="forceNeighborhoodDataTextDisplay"
                placeholder="Neighborhood Data"
                onChange={() => {}}
                value={""}
                className="input-field input-field-textbox"></textarea>
            <input
                type="text"
                label="Latitude"
                id="latitudeTextDisplay"
                className="input-field"
                placeholder="Latitude"
                onChange={() => {}}
                required
                value={0}></input>
            <input
                type="text"
                label="Longitude"
                id="longitudeTextDisplay"
                className="input-field"
                placeholder="Longitude"
                onChange={() => {}}
                required
                value={0}></input>
        </div>
  )
}

export default DebugFields
