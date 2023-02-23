// Parent component encapsulating the header, the sidebar, the main content area (and its datatable), and the footer.
import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Dashboard from "./Dashboard";

const Content = ( { children } ) =>
{
    return (
        <Dashboard />
    );
};

Content.propTypes = {
    children: PropTypes.node,
};

export default Content;
