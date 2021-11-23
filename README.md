This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

Theme taken from [Material UI Template here](https://github.com/minimal-ui-kit/material-kit-react).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Improvements

Here's what else I would have done with more time:
+ Improve on UI for the adding doors pop-up (currently the selection dropdown covers the buttons)
+ Pagination in the tables
+ Separate the current groupsSlice into purely groupsSlice and groupLocksSlice
+ A few places I commented 'TODO' in the code
+ Unit tests
+ Dealing with errors from APIs (so far only handled for adding locks)
+ Ability to cancel an in-progress request using axios
+ Optimisations for loading and caching of data, e.g. using createSelector and createEntityAdapter
+ RTK Query (encountered this while reading online, seems useful and worth trying next time)
+ Add prop types for components
+ More consistent use of inline CSS vs CSS file
+ Toasts upon a successful add / delete
+ UI improvements such as Favicon icon, better loading pages (more descriptive, better formatting) etc.
+ Responsive design
