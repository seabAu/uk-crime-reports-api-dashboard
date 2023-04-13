// Parent component encapsulating the header, the sidebar, the main content area (and its datatable), and the footer.
import React, { useState } from "react";
import PropTypes from "prop-types";
import Dashboard from './pages/Dashboard';

const App = ({ children }) => {
    const [theme, setTheme] = useState(
        localStorage.getItem("uk-crime-dashboard-theme") ?? "default",
    );
    return (
        <Dashboard/>
    );
};

App.propTypes = {
    children: PropTypes.node,
};

export default App;
