// import React from "react";
// import ReactDOM  from "react-dom/client";
// import App from './App';

// import {store} from './Redux/store';
// import { Provider } from "react-redux";

// const root=ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <Provider store={store}>
//             <React.StrictMode>
//                 <App/>
//             </React.StrictMode>
//     </Provider>
// )

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure this path matches the location of your App.js file

ReactDOM.createRoot(document.getElementById('root')).render(
        <App />

);
