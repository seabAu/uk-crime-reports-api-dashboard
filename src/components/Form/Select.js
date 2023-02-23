import React from "react";

function Select({
    height,
    width,
    id,
    name,
    value,
    unsetOption,
    optionsConfig,
    onChange,
    disabled,
    multiple,
}) {
    // console.log(
    //     "Select(): ",
    //     height,
    //     width,
    //     id,
    //     name,
    //     value,
    //     unsetOption,
    //     optionsConfig,
    //     onChange,
    //     disabled,
    //     multiple
    // );
    return (
        <div className="input-field input-field-select">
            <select
                height={height}
                width={width}
                id={id}
                name={name}
                value={value}//{value !== null && value !== undefined ? value : ""}
                onChange={ ( event ) =>
                {
                    //// console.log( "Select: onchange: event = ", event );
                    onChange(event.target.value);
                } }
                multiple={multiple === 'multiple' ? 'multiple' : ''}
                disabled={disabled ? disabled : false}>
                <option value="">{unsetOption}</option>
                {optionsConfig.map((option, index) => {
                    // console.log(option, index);
                    return (
                        <option key={option.key} value={option.value}>
                            {option.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

export default Select;
