import React from "react";
import './formelements.css';

function Input ( props )
{
    const {
        type,
        inputProps,
        label,
        id,
        name,
        value,
        defaultValue,
        placeholder,
        onChange,
        disabled,
        required,
    } = props;

    const validInputTypes = [
        "button",
        "checkbox",
        "color",
        "date",
        "datetime-local",
        "email",
        "file",
        "hidden",
        "image",
        "month",
        "number",
        "password",
        "radio",
        "range",
        "reset",
        "search",
        "submit",
        "tel",
        "text",
        "time",
        "url",
        "week",
    ];

    const debugReadProps = () =>
    {
        console.log("inputProps = ", inputProps);
        console.log( "Form.Input :: {Props} = ",  props );
    }

    // debugReadProps();

    return (
        <div className="input-field">
            <label className="input-field-label" htmlFor={id}>
                <p>{label ?? name}</p>
                <input
                    type={type}
                    className={`input-field-${type}`}
                    name={name ?? `${type}-input`}
                    key={id ?? `${type}-input`}
                    id={id ?? `${type}-input`}
                    {...inputProps}
                    // value={value}
                    // defaultValue={defaultValue}
                    placeholder={placeholder ?? `${type}`}
                    onChange={onChange}
                    required={required ?? ""}
                    disabled={disabled ?? ""}
                />
            </label>
        </div>
    );
}

export default Input;
