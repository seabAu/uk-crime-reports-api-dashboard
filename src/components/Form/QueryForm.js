import React from "react";
import Datalist from "./Datalist";
import Input from "./Input";
import Select from "./Select";
import Checkbox from "./Checkbox";
import Range from "./Range";

function QueryForm ( props )
{
    const {
        children,
        name,
        formID,
        onSubmit,
        onChange,
        model,
        disabled,
        isFetching,
    } = props;
    const validInputTypes = [
        "button",
        "checkbox",
        "color",
        "date",
        "datetime-local",
        "file",
        "image",
        "month",
        "radio",
        "range",
        "reset",
        "submit",
        "time",
        "week",
    ];
    // console.log( "QueryForm :: props = ", props );
    // console.log(
    //     "QueryForm() Init: ",
    //     "\nchildren = ", children,
    //     "\nname = ", name,
    //     "\nformID = ", formID,
    //     "\nonSubmit = ", onSubmit,
    //     "\nonChange = ", onChange,
    //     "\nmodel = ", model,
    //     "\nmodel.fields = ", model.fields,
    //     "\ndisabled = ", disabled,
    //     "\nisFetching = ", isFetching,
    // );
    return (
        <form
            className="form-container"
            id={formID}
            onSubmit={(event) => {
                onSubmit(event);
            }}>
            <div className="form-group">
                {
                    // `${ console.log( name, id, onSubmit, onChange, model, model.fields) }`
                    model &&
                        model.fields.map((field, index) => {
                            // console.log(field);
                            const type = field.type;
                            if (type === "select") {
                                return (
                                    <Select
                                        height={50}
                                        width={100}
                                        label={field.label ?? ""}
                                        key={`${formID}-${
                                            field.id ?? ""
                                        }-${index}`}
                                        id={`${formID}-${
                                            field.id ?? ""
                                        }-${index}`}
                                        name={field.name ?? ""}
                                        value={field.value ?? 0}
                                        unsetOption={field.unsetOption ?? ""}
                                        optionsConfig={
                                            field.options &&
                                            field.options.map(
                                                (option, index) => {
                                                    return {
                                                        key: `${option.key}`,
                                                        value: `${option.value}`,
                                                        label: `${option.label}`,
                                                    };
                                                },
                                            )
                                        }
                                        required={field.required ?? `false`}
                                        multiple={field.multiple}
                                        disabled={isFetching ?? ""}
                                        onChange={
                                            field.onChange ?? ""
                                        }></Select>
                                );
                            } else if (type === "datalist") {
                                if (
                                    "inputType" in field &&
                                    "placeholder" in field &&
                                    "datalistID" in field
                                ) {
                                    return (
                                        <Datalist
                                            height={50}
                                            width={100}
                                            inputType={field.inputType}
                                            placeholder={field.placeholder}
                                            datalistID={field.listID}
                                            label={field.label ?? ""}
                                            key={`${formID}-${
                                                field.id ?? ""
                                            }-${index}`}
                                            id={`${formID}-${
                                                field.id ?? ""
                                            }-${index}`}
                                            name={field.name ?? ""}
                                            value={field.value ?? 0}
                                            unsetOption={
                                                field.unsetOption ?? ""
                                            }
                                            optionsConfig={
                                                field.options &&
                                                field.options.map(
                                                    (option, index) => {
                                                        return {
                                                            key: `${option.key}`,
                                                            value: `${option.value}`,
                                                            label: `${option.label}`,
                                                        };
                                                    },
                                                )
                                            }
                                            required={field.required ?? `false`}
                                            disabled={isFetching ?? ""}
                                            onChange={
                                                field.onChange ?? ""
                                            }></Datalist>
                                    );
                                } else {
                                }
                            } else if (
                                [
                                    "email",
                                    "hidden",
                                    "number",
                                    "password",
                                    "search",
                                    "tel",
                                    "text",
                                    "url",
                                ].includes(type)
                            ) {
                                let inputProps;
                                if (field.value) {
                                    inputProps = { value: field.value };
                                }

                                if (field.defaultValue) {
                                    inputProps = {
                                        defaultValue: field.defaultValue,
                                    };
                                }

                                return (
                                    <Input
                                        inputProps={inputProps}
                                        type={field.type}
                                        label={field.label ?? ""}
                                        // className="input-field input-field-text"
                                        name={field.name ?? "Not Set"}
                                        id={`${formID}-${
                                            field.id ?? field.type
                                        }-${index}`}
                                        // defaultValue={field.value ?? "Not Set"}
                                        placeholder={
                                            field.placeholder ?? `${type}`
                                        }
                                        onChange={field.onChange}
                                        disabled={isFetching ?? ""}
                                        required={field.required ?? ""}></Input>
                                );
                            }

                            // .map catch-all for invalid inputs.
                            return (
                                <div className="error-message">{`Queryform :: ${field.type} :: Form element config error. Check your config settings.`}</div>
                            );
                        })
                }
                <div className="form-submit-container">
                    <button
                        appearance="primary"
                        className="button button-form-submit"
                        //iconBefore={SearchIcon}
                        size="large"
                        disabled={isFetching}>
                        {isFetching ? "Searching..." : "Search"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default QueryForm;
