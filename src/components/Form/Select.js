import React from "react";

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
    } = props;

    const debugReadProps = () => {
        console.log("Form.Select :: {Props} = ", props);
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
                    name={name}
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
                            //     "\n Attempt at internally fetching the ID of this input field: ",
                            //     document.getElementById({ id }),
                            // );
                            let currValue = value;
                            if (
                                selected !== "" &&
                                selected !== undefined &&
                                selected !== null
                            ) {
                                if (!Array.isArray(currValue)) {
                                    // console.log( "Value is not an array." );
                                    currValue = [currValue];
                                }
                                if (currValue.indexOf(selected) > -1) {
                                    onChange(
                                        currValue.filter((item) => {
                                            return item !== selected;
                                        }),
                                    );
                                } else {
                                    onChange([...currValue, selected]);
                                }
                            }
                        } else {
                            onChange(selected);
                        }
                    }}
                    multiple={multiple === "multiple" ? "multiple" : ""}
                    required={required ?? ""}
                    disabled={disabled ? disabled : false}>
                    <option value="" className="option">
                        {unsetOption}
                    </option>
                    {optionsConfig.map((option, index) => {
                        // console.log(option, index);
                        return (
                            <option
                                className="option"
                                key={option.key}
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
