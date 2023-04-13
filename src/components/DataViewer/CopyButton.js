import React from 'react';
import { copyToClipboard } from 'copy-lite';

function CopyButton ( props )
{
    const {
        label = 'Copy',
        data = [],
    } = props;
    return (<div className='button-container-fixed'>
        <button
            className='button copy-button'
            onClick={ ( event ) =>
        {
            console.log( "CopyButton :: Clicked :: ", data, label, event );
            if (data) {
                copyToClipboard( data );
            }
        }}>{label ? label : ''}</button>
    </div>);
}

export default CopyButton;
