import React from "react";
import { Pane, Avatar, Heading } from "evergreen-ui";
import logo from "../images/logo.svg";

const Header = ({toggleSidebar}) => {
    return (
        <div className="page-header">
            <div className="page-header-left">
                <div className="page-header-icon-container">
                    <img
                        className="page-header-icon"
                        src={logo}
                        alt="Icon"
                        onClick={ () =>
                        {
                            toggleSidebar()
                        }}></img>
                </div>
                <div className="page-header-title-container">
                    <div className="page-header-title">
                        <h1 className="page-header-title">
                            Browse Open Data about Crime and Policing in the UK
                        </h1>
                    </div>
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