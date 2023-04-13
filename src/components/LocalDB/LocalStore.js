import React, { useState } from "react";

function LocalStore ( properties )
{
    const {
        setData,
        getData
    } = properties;
    const [ localCache, setLocalCache ] = useState( [] );

    return <React.Fragment>

    </React.Fragment>;
}

export default LocalStore;
