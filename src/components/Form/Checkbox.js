import React from "react";

function Checkbox(props) {
    const {
        inputProps,
        label,
        id,
        name,
        onChange,
        disabled,
        required,
    } = props;

    const debugReadProps = () => {
        console.log("Form.Input :: {Props} = ", props);
    };

    // debugReadProps();

    return (
        <div className="input-field">
            <label className="input-field-label" htmlFor={id}>
                <p>{label ?? name}</p>
                <input
                    type="checkbox"
                    className={`input-field-checkbox`}
                    name={name ?? `checkbox-input`}
                    key={id ?? `checkbox-input`}
                    id={id ?? `checkbox-input`}
                    {...inputProps}
                    onChange={onChange}
                    required={required ?? ""}
                    disabled={disabled ?? ""}
                />
            </label>
        </div>
    );
}

export default Checkbox;
