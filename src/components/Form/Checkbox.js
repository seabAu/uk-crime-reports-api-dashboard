import React from "react";
import './formelements.css';

function Checkbox(props) {
    const {
        label,
        id,
        name,
        onChange,
        disabled,
        required,
        checked,
        defaultChecked,
        tabIndex,
        classes,
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
                    // onChange={}
                />
                <input
                    type="checkbox"
                    className={`input-field-checkbox ${classes ? classes : ''}`}
                    name={name ?? `checkbox-input`}
                    key={id ?? `checkbox-input`}
                    id={id ?? `checkbox-input`}
                    onChange={onChange}
                    checked={`${checked ? 'checked' : ''}`}
                    defaultChecked={`${defaultChecked ? 'checked' : ''}`}
                    tabindex={`${tabIndex ? tabIndex : ''}`}
                    required={required ?? ''}
                    disabled={disabled ?? ''}
                />
            </label>
        </div>
    );
}

export default Checkbox;
