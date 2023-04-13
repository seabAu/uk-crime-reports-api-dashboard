// React
import React from 'react';

// Utilities
import * as utils from '../../../utilities';

function Nav(props) {
    const { children, nav } = props;
    const buildNav = input => {
        let navButtons = [];
        if (utils.val.isValidArray(input, true)) {
            input.forEach((button, index) => {
                if (button.enabled) {
                    navButtons.push(
                        <button
                            key={`nav-menu-button-${button.name}`}
                            id={`nav-menu-button-${button.name}`}
                            className={`nav-button ${button.classes ? button.classes : ''}`}
                            onClick={button.onClick}
                        >
                            {button.icon}
                        </button>
                    );
                }
            });
        }
        return navButtons;
    };

    return (
        <div className="nav-button-group">
            {nav &&
                utils.val.isValidArray(nav, true) &&
                buildNav(nav)}
        </div>
    );
}

export default Nav;
