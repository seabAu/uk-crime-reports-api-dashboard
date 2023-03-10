import React from "react";
import { arrayIsValid } from "../Utilities/ObjectUtils";

function Select(props) {
    const {
        height,
        width,
        label,
        id,
        name,
        value,
        unsetOption,
        optionsConfig,
        onChange,
        disabled,
        required,
        multiple,
        dropdown,
    } = props;
    // console.log("Select :: props = ", props);

    const debugReadProps = () => {
        console.log("Form.Select :: {Props} = ", props);
    };

    const isOptionSelected = (optionValue, selected) => {
        if (optionValue && arrayIsValid(selected)) {
            if ( selected.includes(optionValue) )
            {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    return (
        <div className="input-field">
            <label className="input-field-label" htmlFor={id}>
                <p>{label ?? name}</p>
                <select
                    className="input-field-select"
                    height={height}
                    width={width}
                    key={id}
                    id={id}
                    name={ name }
                    size={`1`}
                    value={multiple === "multiple" ? value : value} //{value !== null && value !== undefined ? value : ""}
                    onChange={(event) => {
                        let selected = event.target.value;
                        if (selected === unsetOption) {
                            return;
                        }
                        if (multiple === "multiple") {
                            // console.log(
                            //     "Select: onchange: event = ",
                            //     event,
                            //     "\n value = ",
                            //     value,
                            //     "\n typeof value = ",
                            //     typeof value,
                            //     "\n event.target.value = ",
                            //     event.target.value,
                            //     // "\n Attempt at internally fetching the ID of this input field: ",
                            //     // document.getElementById({ id }),
                            // );
                            let currValue = value;
                            if (
                                selected !== "" &&
                                selected !== undefined &&
                                selected !== null
                            ) {
                                if (!Array.isArray(currValue)) {
                                    // console.log( "Value is not an array :: ", currValue );
                                    currValue = [currValue];
                                }
                                if ( currValue.indexOf( selected ) > -1 )
                                {
                                    // Selected value is already selected, so unselect it.
                                    // console.log(
                                    //     "Select :: Multiple :: currValue = ", currValue, " :: returning ",
                                    //     currValue.filter((item) => {
                                    //         return (
                                    //             item !== selected &&
                                    //             item !== "" &&
                                    //             item !== undefined &&
                                    //             item !== null
                                    //         );
                                    //     }),
                                    // );
                                    onChange(
                                        currValue.filter((item) => {
                                            return item !== selected && item !== '' && item !== undefined && item !== null;
                                        }),
                                    );
                                } else
                                {
                                    // Selected value is not yet selected, so return it to be added to the state array.
                                    // console.log(
                                    //     "Select :: Multiple :: currValue = ", currValue, " :: returning ",
                                    //     [
                                    //         ...currValue.filter(
                                    //             (val) =>
                                    //                 val !== "" &&
                                    //                 val !== undefined &&
                                    //                 val !== null,
                                    //         ),
                                    //         selected,
                                    //     ],
                                    // );
                                    onChange([...(currValue.filter((val)=>(val !== '' && val !== undefined && val !== null))), selected]);
                                }
                            }
                        } else {
                            onChange(selected);
                        }
                    }}
                    multiple={multiple === "multiple" && dropdown !== true ? "multiple" : ""}
                    required={required ?? ""}
                    disabled={disabled ? disabled : false}>
                    <option value="" className="option">
                        {unsetOption}
                    </option>
                    {optionsConfig.map((option, index) => {
                        // console.log(option, index);
                        return (
                            <option
                                className={`option ${isOptionSelected(option.value, value) ? 'option-selected' : ''}`}
                                key={index}
                                value={option.value}>
                                {option.label}
                            </option>
                        );
                    })}
                </select>
            </label>
        </div>
    );
}

export default Select;
