import React from "react";
import { FiMenu } from "react-icons/fi";

const Header = ( props ) =>
{
    const { showSidebar, toggleSidebar, showTitle = true } = props;
    return (
        <div className="page-header">
            <div className="page-header-left">
                <div className="page-header-icon-container">
                    <div className="menu-toggle">
                        <FiMenu
                            className="menu-toggle-button"
                            style={{ width: 20, height: 20 }}
                            onClick={() => {
                                toggleSidebar();
                            }}
                        />
                    </div>
                </div>
                <div className="page-header-title-container">
                    {showTitle && (<h1 className="page-header-title">
                        Browse Open Data about Crime and Policing in the UK
                    </h1>)}
                </div>
            </div>
            <div className="page-header-center"></div>
            <div className="page-header-right">
                <div className="page-header-nav-container flex-spread-box">
                    <div className="flex-row"></div>
                </div>
            </div>
        </div>
    );
};

export default Header;

/*
                    <img
                        className="page-header-icon"
                        src={logo}
                        alt="Icon"
                        onClick={() => {
                            toggleSidebar();
                        }}></img>
            <Pane
                elevation={1}
                display="flex"
                padding={12}
                background="tint2"
                border={true}
                borderRadius={8}
                alignItems="center">
                <Avatar
                    name="Crime Reports UK"
                    src={logo}
                    size={40}
                    marginRight={12}
                />
                <Heading size={600}>
                    Browse Open Data about Crime and Policing in the UK
                </Heading>
            </Pane>
*/