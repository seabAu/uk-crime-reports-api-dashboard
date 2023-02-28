import React from "react";

function Datalist ( props )
{
    const {
        height,
        width,
        label,
        id,
        name,
        inputType,
        placeholder,
        datalistID,
        value,
        optionsConfig,
        onChange,
        disabled,
        required,
    } = props;
    const debugReadProps = () => {
        console.log("Form.Select :: {Props} = ", props);
    };
    
    return (
        <div className="input-field">
            <label className="input-field-label" htmlFor={id}>
                <p>{label ?? name}</p>
                <input
                    className="input-field-datalist"
                    type={inputType}
                    list={datalistID}
                    id={id}
                    name={name}
                    defaultValue={value}
                    placeholder={placeholder}
                    onChange={(event) => {
                        console.log(
                            "Datalist: onchange: event = ",
                            event,
                            "\n event.target.value = ",
                            event.target.value,
                        );
                        onChange(event.target.value);
                    }}
                    required={required}
                    disabled={disabled}
                />
                <datalist id={datalistID}>
                    {optionsConfig.map((option, index) => {
                        // console.log(option, index);
                        return (
                            <option
                                className="datalist-option"
                                key={option.key}
                                value={option.value}></option>
                        );
                    })}
                </datalist>
            </label>
        </div>
    );
}

export default Datalist;
