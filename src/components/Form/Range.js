import React, { useState } from "react";

function Range(props) {
    const {
        type,
        inputProps, // Contains value and defaultvalue, to allow/disallow interaction.
        min = 0,
        max,
        label,
        id,
        name,
        placeholder,
        onChange,
        disabled,
        required,
    } = props;

    const [value, setValue] = useState(0);
    const debugReadProps = () => {
        console.log("inputProps = ", inputProps);
    };

    // debugReadProps();

    const getBackgroundSize = () => {
        return { backgroundSize: `${(value * 100) / max}% 100%` };
    };
    return (
        <div className="input-field">
            <label className="input-field-label" htmlFor={id}>
                <p>{label ?? name}</p>
                <input
                    type="range"
                    className={`input-field-${type}`}
                    style={getBackgroundSize()}
                    name={name ?? `${type}-input`}
                    key={id ?? `${type}-input`}
                    id={id ?? `${type}-input`}
                    { ...inputProps }
                    min={ min }
                    max={max}
                    placeholder={placeholder ?? `${type}`}
                    onChange={onChange}
                    required={required ?? ""}
                    disabled={disabled ?? ""}
                />
            </label>
        </div>
    );
}

export default Range;
