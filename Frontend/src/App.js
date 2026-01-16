// import React from "react";
// import { BrowserRouter,Routes,Route } from "react-router-dom";
// import Menu from './Components/Header/Menu';
// import Invoice from './Components/Invoice';
// import Login from './Components/Login';
// import MainVisualiser from "./Components/Visualiser/MainVisualiser";
// import MainSuivi from "./Components/Suivi/MainSuivi";
// import GestionCompte from "./Components/GestionComptes/GestionCompte";
// export default function App(){
//     return(
//         <>
//             <BrowserRouter>
//                 <Login/>
//                 <Menu/>
//                 <Routes>
//                     <Route path='/Visualiser' element={<MainVisualiser/>}/>
//                     <Route path='/Enregistrer' element={<Invoice/>}/>
//                     <Route path="/Suivi" element={<MainSuivi/>}/>
//                     <Route path="/Gestion des comptes" element={<GestionCompte/>}/>
//                 </Routes>
//             </BrowserRouter>
//         </>
//     )
// }

// import React, { useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Menu from './Components/Header/Menu';
// import Invoice from './Components/Invoice';
// import Login from './Components/Login';
// import Visualiser from "./Components/Visualiser/Visualiser";
// import Suivi from "./Components/Suivi/Suivi";
// import GestionCompte from "./Components/GestionComptes/GestionCompte";

// export default function App() {
//     // State to track if the user is logged in
//     const [isLoggedIn, setIsLoggedIn] = useState(false);

//     // Function to simulate login
//     const handleLogin = () => {
//         setIsLoggedIn(true);
//     };

//     return (
//         <BrowserRouter>
//             {!isLoggedIn ? (
//                 // If not logged in, show only the Login component
//                 <Login onLogin={handleLogin} />
//             ) : (
//                 // If logged in, show Menu and other routes
//                 <>
//                     <Menu />
//                     <Routes>
//                         <Route path='/Visualiser' element={<Visualiser />} />
//                         <Route path='/Enregistrer' element={<Invoice />} />
//                         <Route path="/Suivi" element={<Suivi />} />
//                         <Route path="/Gestion des comptes" element={<GestionCompte />} />
//                     </Routes>
//                 </>
//             )}
//         </BrowserRouter>
//     );
// }


// import React from 'react';
// import { RouterProvider } from "react-router-dom";
// import { router } from "./router";  // Adjust the path if your file is named differently or located elsewhere

// function App() {
//     return <RouterProvider router={router} />;
// }

// export default App;

// App.js


// import React from 'react';
// import { RouterProvider } from "react-router-dom";
// import { AuthProvider } from './ProtectionComponent/auth-context'; // Ensure correct import path
// import { router } from "./ProtectionComponent/router";  // Adjust the path if your file is named differently or located elsewhere

// function App() {
//     return (
//         <AuthProvider>
//             <RouterProvider router={router} />
//         </AuthProvider>
//     );
// }

// export default App;

import React from 'react';

import { router } from './Components/router/router';
import { RouterProvider } from 'react-router-dom'; 
function App() {
  return (
    <div>
      <RouterProvider router={router}>
      </RouterProvider>
    </div>
  );
}

export default App;