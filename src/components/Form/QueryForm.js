import React from "react";
import Select from "./Select";

function QueryForm ( { children, name, id, onSubmit, onChange, model, disabled, isFetching } )
{
    // console.log("QueryForm() Init: ", name, id, onSubmit, onChange, model, model.fields);
    return (
        <div className="input-field input-field-select">
            <form
                onSubmit={(event) => {
                    onSubmit(event);
                }}>
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
                                        id={field.id}
                                        name={field.name}
                                        value={field.value ?? 0}
                                        unsetOption={field.unsetOption}
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
                                        disabled={isFetching}
                                        onChange={field.onChange}></Select>
                                );
                            } else if (type === "text") {
                                return (
                                    <input
                                        type="text"
                                        name={field.name ?? "Not Set"}
                                        id={field.id ?? "Not Set"}
                                        defaultValue={field.value ?? "Not Set"}
                                        placeholder={
                                            field.placeholder ?? "Not Set"
                                        }
                                        className="input-field input-field-text"
                                        onChange={field.onChange}
                                        required></input>
                                );
                            } else if (type === "number") {
                                return (
                                    <input
                                        type="number"
                                        name={field.name ?? "Not Set"}
                                        id={field.id ?? "Not Set"}
                                        defaultValue={field.value ?? "Not Set"}
                                        placeholder={
                                            field.placeholder ?? "Not Set"
                                        }
                                        className="input-field input-field-number"
                                        onChange={field.onChange}
                                        required></input>
                                );
                            } else return <div></div>;
                        })
                }
                <button
                    appearance="primary"
                    //iconBefore={SearchIcon}
                    size="large"
                    disabled={isFetching}>
                    {isFetching ? "Searching..." : "Search"}
                </button>
            </form>
        </div>
    );
}

export default QueryForm;
