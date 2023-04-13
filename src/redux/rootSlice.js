import { createSlice } from '@reduxjs/toolkit';
const rootSlice = createSlice({
    name: 'root',
    initialState: {
        environment: 'development',
        debug: false,
        loading: false,
        fetching: false,
        menu: 'query',
        theme: localStorage.getItem('uk-crime-dashboard-theme') ?? 'default',
        cache: null,
        reloadData: false,
        // loggedIn: false,
        // user: null,
    },
    reducers: {
        SetEnvironment: (state, action) => {
            // String.
            // Sets the environment variable locally for components to refer to.
            state.environment = action.payload;
        },
        SetDebug: (state, action) => {
            // Boolean.
            // Toggles whether or not debug messages come through to the console, or via messages (via ANTD) in the window.
            state.debug = action.payload;
        },
        SetLoading: (state, action) => {
            // Boolean.
            // Toggles loading screen on or off.
            state.loading = action.payload;
        },
        SetFetching: (state, action) => {
            // Boolean.
            // Toggles loading screen on or off.
            state.fetching = action.payload;
        },
        SetMenu: (state, action) => {
            // String.
            // Which menu is currently rendered.
            // Only the following options are allowed:
            console.log('SetMenu() :: ', action.payload);
            state.menu = ['query', 'map', 'database', 'options'].includes(
                action.payload
            )
                ? action.payload
                : 'query';
        },
        SetTheme: (state, action) => {
            // String.
            // Which menu is currently rendered.
            // Only the following options are allowed:
            console.log('SetTheme() :: ', action.payload);

            state.theme = ['default', 'light', 'dark', 'cool'].includes(
                action.payload
            )
                ? action.payload
                : 'default';
            
        },
        SetCache: (state, action) => {
            // Array.
            // Update cached data.
            state.cache = action.payload;
        },
        ReloadData: (state, action) => {
            // Boolean.
            // Handles triggering a new call to the API to get the latest data.
            // Triggered by form submissions if the data has anything to do with the portfolio data.
            // It is important to turn this back to FALSE immediately after sending the API call, so it doesn't loop endlessly if the call returns an error.
            state.reloadData = action.payload;
        },
    },
});

export default rootSlice.reducer;
export const {
    SetEnvironment,
    SetDebug,
    SetLoading,
    SetFetching,
    SetTheme,
    SetMenu,
    SetCache,
    ReloadData,
} = rootSlice.actions;
