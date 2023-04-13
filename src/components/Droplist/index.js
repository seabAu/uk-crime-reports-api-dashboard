import React, { useEffect, useState } from 'react';

// Creates a controllable, managed unordered list from arbitrary JSON data.
import * as util from '../../utilities';
import './droplist.css';

function Droplist ( props )
{
    const { label, data, type } = props;
    const [ renderData, setRenderData ] = useState( data );
    const [showExpandable, setShowExpandable] = useState(false);
    const [showCompact, setShowCompact] = useState(true);

    useEffect(() => {}, []);
    
    console.log('Droplist.js :: props = ', props);

    // Generic function to turn any label-value pair into a <li></li> wrapped DOM element with appropriate styling and interactivity elements.
    // When called from functions dealing with array elements, the data label will simply be the array index.
    // When called from functions delaing with object elements, the data label and value will be the key-value pair.
    const valToListElement = (
        dataLabel,
        dataValue,
        classPrefix,
        parentIndex,
        expandable = false,
        checked = false
    ) => {
        // console.log(
        //     'elementToListElement :: inputs = [',
        //     'dataLabel = ',
        //     dataLabel,
        //     'dataValue = ',
        //     dataValue,
        //     'classPrefix = ',
        //     classPrefix,
        //     'parentIndex = ',
        //     parentIndex,
        //     'expandable = ',
        //     expandable,
        //     'checked = ',
        //     checked,
        //     ']'
        // );
        let value = util.val.isArray(dataValue)
                ? // Object value is a nested array.
                  dataToList(dataValue, classPrefix, `${parentIndex}`, expandable)
                : util.val.isObject(dataValue)
                ? // Object value is a nested object
                  dataToList(dataValue, classPrefix, `${parentIndex}`, expandable)
                : // Object value is not a nested object; is a scalar.
                  util.ao.cleanInvalid(dataValue, '-');
        if ( expandable )
        {
            return (
                <li className={`${classPrefix}-item`}>
                    <label
                        for={`tab-${parentIndex}`}
                        name="tab"
                        tabindex="-1"
                        role="tab"
                        className={`${classPrefix}-key`}
                    >
                        {dataLabel}
                    </label>
                    <input
                        type="checkbox"
                        defaultChecked={`${checked ? 'checked' : ''}`}
                        className="tab"
                        id={`tab-${parentIndex}`}
                        tabindex={`${parentIndex}`}
                        // onChange={}
                    />
                    <span className="open-close-icon">
                        <i className="fas fa-plus"></i>
                        <i className="fas fa-minus"></i>
                    </span>
                    <div className={`${classPrefix}-content`}>{value}</div>
                </li>
            );
        } else {
            return (
                <li className={ `${ classPrefix }-item` }>
                    <div className={ `${ classPrefix }-key` }>{ dataLabel }: </div>
                    <div className={ `${ classPrefix }-value` }>{value}</div>
                </li>
            );
        }
    };
    const dataToList = ( input, classPrefix, parentIndex, expandable ) =>
    {
        if (util.val.isArray(input)) {
            // Top-level input is an array.
            return (
                <ul
                    className={`${classPrefix}-array ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    {input.map((arrElement, arrayIndex) => {
                        // Map for each item in the array.
                        return valToListElement(
                            arrayIndex,
                            arrElement,
                            classPrefix,
                            `${parentIndex}-${arrayIndex}`,
                            expandable,
                            true
                        );
                    })}
                </ul>
            );
        } else if (util.val.isObject(input)) {
            // Top-level input is an object.
            // return objToList(input, classPrefix, parentIndex, expandable);

            // Input is an object.
            return (
                <ul
                    className={`${classPrefix}-obj ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    {Object.entries(input).map((prop, objIndex) => {
                        // Iterate for each entry in the object.
                        let objKey = prop[0];
                        let objValue = prop[1];
                        return valToListElement(
                            objKey,
                            objValue,
                            classPrefix,
                            `${parentIndex}-${objIndex}`,
                            expandable,
                            false
                        );
                    })}
                </ul>
            );
        }
    }

    return (
        <>
            {util.val.isValidArray(renderData, true) && (
                <div className="data-list-container">
                    <div className="options-container">
                        <div className="input-group">
                            {label && (
                                <div className="data-list-label">
                                    <h4>{label}:</h4>
                                </div>
                            )}
                            <div className="input-field input-field-inline">
                                <label
                                    className="input-field-label"
                                    htmlFor={`droplist-checkbox-input-toggle-expandable`}
                                >
                                    <p className="input-field-label-text">
                                        Expandable
                                    </p>
                                    <input
                                        type="checkbox"
                                        className={`input-field-checkbox`}
                                        name={`droplist-checkbox-input-toggle-expandable`}
                                        key={`droplist-checkbox-input-toggle-expandable`}
                                        id={`droplist-checkbox-input-toggle-expandable`}
                                        defaultChecked={showExpandable}
                                        onChange={event => {
                                            setShowExpandable(
                                                event.target.checked
                                            );
                                        }}
                                        disabled={''}
                                    />
                                </label>
                            </div>
                            <div className="input-field input-field-inline">
                                <label
                                    className="input-field-label"
                                    htmlFor={`droplist-checkbox-input-toggle-compact`}
                                >
                                    <p className="input-field-label-text">
                                        Compact View
                                    </p>
                                    <input
                                        type="checkbox"
                                        className={`input-field-checkbox`}
                                        name={`droplist-checkbox-input-toggle-compact`}
                                        key={`droplist-checkbox-input-toggle-compact`}
                                        id={`droplist-checkbox-input-toggle-compact`}
                                        defaultChecked={showCompact}
                                        onChange={event => {
                                            setShowCompact(
                                                event.target.checked
                                            );
                                        }}
                                        disabled={''}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`data-list ${
                            showCompact ? 'data-list-compact' : ''
                        } `}
                    >
                        {
                            // JSON.stringify(selectedAreas, null, 2)
                            // JSON.stringify(
                            //     // util.dom.objToListText(
                            //         util.geo.geoObj2geoArray( selectedAreas[ 0 ] )
                            //     // ),
                            //     null,
                            //     2,
                            // )
                            // util.dom.objArrayToList(
                            // objArrayToList(
                            dataToList(
                                renderData,
                                `data-list`,
                                0,
                                showExpandable
                                // util.geo.geoObj2geoArray(
                                // util.geo.geoObjArray2geoArrayArray(
                                //     //     selectedAreas[0],
                                //     selectedAreas,
                                // ),
                                // selectedAreas.map((area)=>geoObj2geoArray(area))
                            )
                        }
                    </div>
                </div>
            )}
        </>
    );
}

export default Droplist;

/*
    const elementToListElement = (
            dataLabel,
            dataValue,
            classPrefix,
            parentIndex,
            expandable = false,
            checked = false
        ) => {
            // console.log(
            //     'elementToListElement :: inputs = [',
            //     'dataLabel = ',
            //     dataLabel,
            //     'dataValue = ',
            //     dataValue,
            //     'classPrefix = ',
            //     classPrefix,
            //     'parentIndex = ',
            //     parentIndex,
            //     'expandable = ',
            //     expandable,
            //     'checked = ',
            //     checked,
            //     ']'
            // );
            if (expandable) {
                return (
                    <li className={`${classPrefix}-item`}>
                        <label
                            for={`tab-${parentIndex}`}
                            name="tab"
                            tabindex="-1"
                            role="tab"
                            className={`${classPrefix}-key`}
                        >
                            {dataLabel}
                        </label>
                        <input
                            type="checkbox"
                            defaultChecked={`${checked ? 'checked' : ''}`}
                            className="tab"
                            id={`tab-${parentIndex}`}
                            tabindex={ `${ parentIndex }` }
                            // onChange={}
                        />
                        <span className="open-close-icon">
                            <i className="fas fa-plus"></i>
                            <i className="fas fa-minus"></i>
                        </span>
                        <div className={`${classPrefix}-content`}>{dataValue}</div>
                    </li>
                );
            } else {
                return (
                    <li className={`${classPrefix}-item`}>
                        <div className={`${classPrefix}-key`}>{dataLabel}: </div>
                        <div className={`${classPrefix}-value`}>{dataValue}</div>
                    </li>
                );
            }
        };
    // Turns an object array into an unordered list, with recursion.
    const objArrayToList = (input, classPrefix, parentIndex, expandable) => {
        // console.log("objArrayToList :: input = ", input);
        if (util.val.isArray(input)) {
            // Top-level input is an array.
            return (
                <ul
                    className={`${classPrefix}-array ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    {input.map((arrElement, arrayIndex) => {
                        // Map for each item in the array.
                        return elementToListElement(
                            arrayIndex,
                            util.val.isArray(arrElement)
                                ? // Object value is a nested array.
                                  objArrayToList(
                                      arrElement,
                                      classPrefix,
                                      `${parentIndex}-${arrayIndex}`,
                                      expandable
                                  )
                                : util.val.isObject(arrElement)
                                ? // Object value is a nested object
                                  objToList(
                                      arrElement,
                                      classPrefix,
                                      `${parentIndex}-${arrayIndex}`,
                                      expandable
                                  )
                                : // Object value is not a nested object; is a scalar.
                                  util.ao.cleanInvalid(arrElement, '-'),
                            classPrefix,
                            `${parentIndex}-${arrayIndex}`,
                            expandable,
                            true
                        );
                    })}
                </ul>
            );
        } else if (util.val.isObject(input)) {
            // Top-level input is an object.
            return objToList(input, classPrefix, parentIndex, expandable);
        }
    };

    // Turns an object into an unordered list, with recursion.
    const objToList = (input, classPrefix, parentIndex, expandable) => {
        // console.log("objToList :: input = ", input);
        if (util.val.isArray(input)) {
            // Input is an array.
            return objArrayToList(input, classPrefix, parentIndex, expandable);
        } else if (util.val.isObject(input)) {
            // Input is an object.
            return (
                <ul
                    className={`${classPrefix}-obj ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    { Object.entries( input ).map( ( prop, objIndex ) =>
                    {
                        // Iterate for each entry in the object.
                        let objKey = prop[0];
                        let objValue = prop[1];
                        return elementToListElement(
                            objKey,
                            util.val.isArray(objValue)
                                ? // Object value is a nested array.
                                  objArrayToList(
                                      objValue,
                                      classPrefix,
                                      `${parentIndex}-${objIndex}`,
                                      expandable
                                  )
                                : util.val.isObject(objValue)
                                ? // Object value is a nested object
                                  objToList(
                                      objValue,
                                      classPrefix,
                                      `${parentIndex}-${objIndex}`,
                                      expandable
                                  )
                                : // Object value is not a nested object; is a scalar.
                                  util.ao.cleanInvalid(objValue, '-'),
                            classPrefix,
                            `${parentIndex}-${objIndex}`,
                            expandable,
                            false
                        );
                    })}
                </ul>
            );
        }
    };

*/

/*
    const getExpandableDropdown = (
        label,
        content,
        checked,
        classPrefix,
        id,
        index = Math.round(Math.random() * 1000)
    ) => {
        return `
                <label for='tab-${index}' name='tab' tabindex='-1' role='tab' class="${classPrefix}-key">
                  ${label}
                  </label>
                  <input type="checkbox" ${
                      checked ? 'checked' : ''
                  } class="tab" id="tab-${index}" tabindex="0" />
                  <span class="open-close-icon">
                      <i class="fas fa-plus"></i>
                      <i class="fas fa-minus"></i>
                  </span>
                        <div class="${classPrefix}-content">
                            ${content}
                        </div>
               `;
    };

    const arrayToListText = (input, classPrefix, expandable, parentIndex) => {
        // console.log("expandable = ", expandable);
        if (util.val.isArray(input)) {
            // Input is an array.
            // return `<ul class="${classPrefix}-array ${classPrefix}-expandable">
            return `<ul class="${classPrefix}-obj ${
                expandable ? `${classPrefix}-expandable` : ''
            }">
            ${input
                .map((value, index) => {
                    if (typeof value === 'object') {
                        // Nested object
                        let nestedValue = objToListText(
                            value,
                            classPrefix,
                            expandable,
                            index
                        );
                        return `
                        <li class="${classPrefix}-item">
                            ${
                                expandable
                                    ? getExpandableDropdown(
                                          '',
                                          nestedValue,
                                          true,
                                          classPrefix,
                                          `${parentIndex}-${index}`,
                                          `${parentIndex}-${index}`
                                      )
                                    : nestedValue
                            }
                        </li>
                        `;
                    } else if (util.val.isArray(input)) {
                        // Nested array.
                        let nestedValue = arrayToListText(
                            value,
                            classPrefix,
                            expandable,
                            index
                        );
                        return `
                        <li class="${classPrefix}-item">
                            <div class="${classPrefix}-content">
                                ${
                                    // arrayToListText(value, classPrefix, expandable, index)
                                    getExpandableDropdown(
                                        '',
                                        nestedValue,
                                        false,
                                        classPrefix,
                                        `${parentIndex}-${index}`,
                                        `${parentIndex}-${index}`
                                    )
                                }
                            </div>
                        </li>
                        `;
                    } else {
                        // Not a nested item.
                        return `
                        <li class="${classPrefix}-item">
                            <div class="${classPrefix}-value">
                                ${util.ao.cleanInvalid(value, '-')}
                            </div>
                        </li>
                        `;
                    }
                })
                .join('')}</ul>`;
        } else if (typeof input === 'object') {
            // Input is an object.
            // result =
            return objToListText(input);
        } else {
            // Input is anything else.
            return `<li class="${classPrefix}-item"><div class="${classPrefix}-value">${util.ao.cleanInvalid(
                input,
                '-'
            )}</div></li>`;
        }
    };

    const objToListText = (input, classPrefix, expandable, parentIndex) => {
        // console.log("expandable = ", expandable);
        if (util.val.isArray(input)) {
            // Input is an array.
            return arrayToListText(input, classPrefix, expandable, parentIndex);
        } else if (typeof input === 'object') {
            // Input is an object.
            // result =
            // let class = `${expandable ? `${classPrefix}-expandable` : ''}`;
            return `<ul class="${classPrefix}-obj ${
                expandable ? `${classPrefix}-expandable` : ''
            }">${Object.entries(input)
                .map((prop, index) => {
                    let objKey = prop[0];
                    let objValue = prop[1];
                    if (typeof objValue === 'object' && objValue !== null) {
                        // Nested object
                        let nestedValue = objToListText(
                            objValue,
                            classPrefix,
                            expandable,
                            index
                        );
                        return `
                        <li class="${classPrefix}-item">
                            ${
                                expandable
                                    ? getExpandableDropdown(
                                          objKey,
                                          nestedValue,
                                          false,
                                          classPrefix,
                                          `${parentIndex}-${index}-${objKey}`,
                                          `${parentIndex}-${index}-${objKey}`
                                      )
                                    : nestedValue
                            }
                        </li>
                        `;
                    } else if (util.val.isArray(input)) {
                        // Nested array.
                        let nestedValue = arrayToListText(
                            objValue,
                            classPrefix,
                            expandable,
                            index
                        );
                        return `
                        <li class="${classPrefix}-item">
                            ${
                                expandable
                                    ? getExpandableDropdown(
                                          objKey,
                                          nestedValue,
                                          false,
                                          classPrefix,
                                          `${parentIndex}-${index}-${objKey}`,
                                          `${parentIndex}-${index}-${objKey}`
                                      )
                                    : nestedValue
                            }
                        </li>
                        `;
                    } else {
                        // Not a nested object.
                        return `
                            <li class="${classPrefix}-item">
                                <div class="${classPrefix}-key">
                                    ${objKey}: 
                                </div>
                                <div class="${classPrefix}-value">
                                    ${util.ao.cleanInvalid(objValue, '-')}
                                </div> 
                            </li>
                        `;
                    }
                })
                .join('')}</ul>`;
        } else {
            // Input is anything else.
            return `<li className="${classPrefix}-item"><div class="${classPrefix}-value">${util.ao.cleanInvalid(
                input,
                '-'
            )}</div> </li>`;
        }
    };

    const objArrayToListText = (
        input,
        classPrefix,
        expandable,
        parentIndex = Math.round(Math.random() * 1000)
    ) => {
        // console.log( "objToListText :: input = ", input );
        const resultElement = document.createElement('div');
        let result;
        if (util.val.isArray(input)) {
            // Input is an array.
            // return objArrayToListText(input, classPrefix, parentIndex);
            return arrayToListText(input, classPrefix, expandable, parentIndex);
        } else if (typeof input === 'object') {
            // Input is an object.
            // result =
            // return objToListText(input);
            return objToListText(input, classPrefix, expandable, parentIndex);
        } else {
            // Input is anything else.
            return `<li class="${classPrefix}-item"><div class="${classPrefix}-value">${util.ao.cleanInvalid(
                input,
                '-'
            )}</div> </li>`;
        }
    };

    const getExpandable = (
        dataLabel,
        dataValue,
        checked,
        classPrefix,
        id,
        index = Math.round(Math.random() * 1000)
    ) => {
        return (
            <li className={`${classPrefix}-item`}>
                <label
                    for="tab-${index}"
                    name="tab"
                    tabindex="-1"
                    role="tab"
                    class="${classPrefix}-key"
                >
                    ${dataLabel}
                </label>
                <input
                    type="checkbox"
                    checked={`${checked ? 'checked' : ''}`}
                    class="tab"
                    id={`tab-${index}`}
                    tabindex="0"
                />
                <span class="open-close-icon">
                    <i class="fas fa-plus"></i>
                    <i class="fas fa-minus"></i>
                </span>
                <div class={`${classPrefix}-content`}>${dataValue}</div>
            </li>
        );
    };

    // Turns an object array into an unordered list, with recursion.
    const objArrayToList2 = (input, classPrefix, parentIndex, expandable) => {
        // console.log("objArrayToList :: input = ", input);
        if (util.val.isArray(input)) {
            // Top-level input is an array.
            return (
                <ul
                    className={`${classPrefix}-array ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    {input.map((arrElement, arrayIndex) => {
                        // Map for each item in the array.

                        if (util.val.isArray(arrElement)) {
                            // Array element is a nested array.
                            return (
                                <li className={`${classPrefix}-item`}>
                                    <div className={`${classPrefix}-key`}>
                                        {arrayIndex}:{' '}
                                    </div>
                                    <div className={`${classPrefix}-value`}>
                                        {objArrayToList(
                                            arrElement,
                                            classPrefix,
                                            `${parentIndex}-${arrayIndex}`,
                                            expandable
                                        )}
                                    </div>
                                </li>
                            );
                        } else if (util.val.isObject(arrElement)) {
                            // Array element is a nested object.
                            return (
                                <li className={`${classPrefix}-item`}>
                                    <div className={`${classPrefix}-key`}>
                                        {arrayIndex}:{' '}
                                    </div>
                                    <div className={`${classPrefix}-value`}>
                                        {objToList(
                                            arrElement,
                                            classPrefix,
                                            `${parentIndex}-${arrayIndex}`,
                                            expandable
                                        )}
                                    </div>
                                </li>
                            );
                        } else {
                            // Array element is a scalar.
                            return (
                                <li className={`${classPrefix}-item`}>
                                    <div className={`${classPrefix}-key`}>
                                        {arrayIndex}:{' '}
                                    </div>
                                    <div className={`${classPrefix}-value`}>
                                        {util.ao.cleanInvalid(arrElement, '-')}
                                    </div>
                                </li>
                            );
                        }
                    })}
                </ul>
            );
        } else if (util.val.isObject(input)) {
            // Top-level input is an object.
            return objToList(input, classPrefix, parentIndex, expandable);
        }
    };

    // Turns an object into an unordered list, with recursion.
    const objToList2 = (input, classPrefix, expandable, parentIndex) => {
        // console.log("objToList :: input = ", input);
        if (util.val.isArray(input)) {
            // Input is an array.
            return objArrayToList(input, classPrefix, parentIndex, expandable);
        } else if (util.val.isObject(input)) {
            // Input is an object.
            return (
                <ul
                    className={`${classPrefix}-obj ${
                        expandable ? `${classPrefix}-expandable` : ''
                    }`}
                >
                    {Object.entries(input).map((prop, objIndex) => {
                        let objKey = prop[0];
                        let objValue = prop[1];
                        return util.val.isArray(objValue)
                            ? // Object value is a nested array.
                              elementToListElement(
                                  objKey,
                                  objArrayToList(
                                      objValue,
                                      classPrefix,
                                      `${parentIndex}-${objIndex}`,
                                      expandable
                                  ),
                                  classPrefix,
                                  `${parentIndex}-${objIndex}`,
                                  expandable,
                                  false
                              )
                            : util.val.isObject(objValue)
                            ? // Object value is a nested object
                              elementToListElement(
                                  objKey,
                                  objToList(
                                      objValue,
                                      classPrefix,
                                      `${parentIndex}-${objIndex}`,
                                      expandable
                                  ),
                                  classPrefix,
                                  `${parentIndex}-${objIndex}`,
                                  expandable,
                                  false
                              )
                            : // Object value is not a nested object; is a scalar.
                              elementToListElement(
                                  objKey,
                                  util.ao.cleanInvalid(objValue, '-')
                              );
                        // if (util.val.isObject(objValue)) {
                        //     // Object value is a nested object
                        //     return (
                        //         <li className={`${classPrefix}-item`}>
                        //             <div className={`${classPrefix}-key`}>
                        //                 {objKey}:{' '}
                        //             </div>
                        //             <div className={`${classPrefix}-value`}>
                        //                 {objToList(
                        //                     objValue,
                        //                     classPrefix,
                        //                     `${parentIndex}-${objIndex}`,
                        //                     expandable
                        //                 )}
                        //             </div>
                        //         </li>
                        //     );
                        // } else if (util.val.isArray(objValue)) {
                        //     // Object value is a nested array.
                        //     return (
                        //         <li className={`${classPrefix}-item`}>
                        //             <div className={`${classPrefix}-key`}>
                        //                 {objKey}:{' '}
                        //             </div>
                        //             <div className={`${classPrefix}-value`}>
                        //                 {objArrayToList(
                        //                     objValue,
                        //                     classPrefix,
                        //                     `${parentIndex}-${objIndex}`,
                        //                     expandable
                        //                 )}
                        //             </div>
                        //         </li>
                        //     );
                        // } else {
                        //     // Object value is not a nested object; is a scalar.
                        //     return (
                        //         <li className={`${classPrefix}-item`}>
                        //             <div className={`${classPrefix}-key`}>
                        //                 {objKey}:{' '}
                        //             </div>
                        //             <div className={`${classPrefix}-value`}>
                        //                 {util.ao.cleanInvalid(
                        //                     objValue,
                        //                     '-'
                        //                 )}
                        //             </div>
                        //         </li>
                        //     );
                        // }
                    })}
                </ul>
            );
            // return (
            //     <ul className="obj-list">
            //         {Object.entries(input).map((objProperty, index) => {
            //             let objKey = objProperty[0];
            //             let objValue = objProperty[1];
            //             if (typeof objValue === 'object' && objValue !== null) {
            //                 // Nested object
            //                 return (
            //                     <li className="obj-list-item">
            //                         <div className="obj-list-key">{objKey}</div>
            //                         :{' '}
            //                         <div className="obj-list-value">
            //                             {objToList(objValue, classPrefix, expandable, parentIndex)}
            //                         </div>
            //                     </li>
            //                 );
            //             } else {
            //                 // Not a nested object.
            //                 // Sanitize the value if it's null or undefined.
            //                 return (
            //                     <li className="obj-list-item">
            //                         <div className="obj-list-key">{objKey}</div>
            //                         :{' '}
            //                         <div className="obj-list-value">
            //                             {util.ao.cleanInvalid(objValue, '-')}
            //                         </div>
            //                     </li>
            //                 );
            //             }
            //         })}
            //     </ul>
            // );
        }
    };

*/