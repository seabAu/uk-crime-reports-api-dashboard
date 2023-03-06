// Parent component encapsulating the header, the sidebar, the main content area (and its datatable), and the footer.
import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Dashboard from "./Dashboard";
/*
    New structure to better organize this project: 

    Currently: 
        Dashboard handles all fetch logic, showing the selected menu via the Sidebar and DashboardContent, and the header.
        Sidebar handles rendering the query form.

        index.js
            Content.js
                Dashboard <=> Receives input from sidebar, rerenders child components when query or menu changes
                    DashboardContent
                        > Table
                        > Database
                        > Map
                        > (Options menu, not needed lol)
                    Sidebar
                        > QueryForm
                            [Form elements]
                        > Database Selectors
                        > Map Buttons
                        > Options Buttons
        
        
    Need a centralized data manager instead of using the Dashboard as a combo view-model-controller.
    Need to put everything fetching and query related into its own handler.
    Content.js is essentially our App.js file, except it's sitting in the components folder instead of root. 

    More organized setup: 

    index.js
        App.js
            Dashboard.js => Handles changing the menu and theme. 
                Header.js
                Sidebar.js * needs to reflect changes to the state data.
                    > QuerySidebarContent.js
                        QueryForm.js => Contains all logic for handling fetching, loading the form, etc.
                            Form.js => Basic form constructor component, taking QueryForm.js's current job.
                                [Form elements]
                    > DatabaseSidebarContent.js
                    > MapSidebarContent.js
                    > OptionsSidebarContent.js
                DashboardContent.js * needs to reflect changes to the state data.
                    > QueryContent.js
                    > DatabaseContent.js
                    > MapContent.js
                    > OptionsContent.js


    index.js
        App.js
            Dashboard.js => Handles changing the menu and theme. 
                Header.js
                > QueryDashbosrd.js
                    Sidebar.js {with menu-specific child components}
                        QueryForm.js => Contains all logic for handling fetching, loading the form, etc.
                            Form.js => Basic form constructor component, taking QueryForm.js's current job.
                                [Form elements]
                    DashboardContent.js {with menu-specific child components}
                        Table.js
                        SidePanel.js
                > DatabaseDashbosrd.js
                    Sidebar.js {with menu-specific child components}
                    DashboardContent.js {with menu-specific child components}

                > MapDashbosrd.js
                    Sidebar.js {with menu-specific child components}
                    DashboardContent.js {with menu-specific child components}

                > OptionsDashbosrd.js
                    Sidebar.js {with menu-specific child components}
                    DashboardContent.js {with menu-specific child components}





*/

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
