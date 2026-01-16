// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import React,{useState,useEffect} from 'react';
// import Login from '../Login';
// import PageNotFound from '../errors/PageNotFound';
// import Layout from '../Header/Layout';
// import Invoice from '../Invoice';
// import Visualiser from '../Visualiser/Visualiser';
// import GestionCompte from '../GestionComptes/GestionCompte';
// import Suivi from '../Suivi/Suivi';
// import { getToken } from '../router/auth';
// import GestionCompte2 from '../HistoriqueDePaiement/GestionCompte'

// const ProtectedRoute = ({ children }) => {
//   const [isAuth, setIsAuth] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const token = getToken();
//     setIsAuth(!!token);
//     setIsLoading(false); // Met fin au chargement une fois que l'authentification est vérifiée
//   }, []);

//   if (isLoading) {
//     return <div>Loading...</div>; // Affiche un message de chargement pendant la vérification de l'authentification
//   }

//   return isAuth ? children : <Navigate to="/" />;
// };

// export const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Login />,
//     index: true
//   },
//   {
//     path: '/',
//     element: <ProtectedRoute><Layout /></ProtectedRoute>,
//     children: [
//       { path: 'Enregistrer', element: <Invoice /> },
//       { path: 'Visualiser', element: <Visualiser /> },
//       { path: 'HistoriquePaiement', element: <GestionCompte2 /> },
//       { path: 'Gestion des Comptes', element: <GestionCompte /> },
//       { path: 'Suivi', element: <Suivi /> }
//     ]
//   },
//   { path: '*', element: <PageNotFound /> }
// ]);

import { createBrowserRouter, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from '../Login';
import PageNotFound from '../errors/PageNotFound';
import Layout from '../Header/Layout';
import Invoice from '../Invoice';
import Visualiser from '../Visualiser/Visualiser';
import GestionCompte from '../GestionComptes/GestionCompte';
import Suivi from '../Suivi/Suivi';
import { getToken } from '../router/auth';
import GestionCompte2 from '../HistoriqueDePaiement/GestionCompte';
import UnauthorizedPage from '../errors/UnauthorizedPage';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null); // Ajouter l'état pour le rôle de l'utilisateur

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();

        if (token) {
          const response = await axios.get('http://localhost:8000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsAuth(true);
          setRole(response.data.role); 
        } else {
          setIsAuth(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user', error);
        setIsAuth(false);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <div class="loader"></div>;
  }

  return isAuth ? React.cloneElement(children, { role }) : <Navigate to="/" />;
};

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();

        if (token) {
          const response = await axios.get('http://localhost:8000/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsAuth(true);
          setRole(response.data.role);
        } else {
          setIsAuth(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user', error);
        setIsAuth(false);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return <div class="loader"></div>;
  }

  return allowedRoles.includes(role) ? children : <UnauthorizedPage />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    index: true,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'Enregistrer', element: <Invoice /> },
      { path: 'Visualiser', element: <Visualiser /> },
      { path: 'HistoriquePaiement', element: <GestionCompte2 /> },
      {
        path: 'Gestion des Comptes',
        element: (
          <RoleProtectedRoute allowedRoles={['Super Admin']}>
            <GestionCompte />
          </RoleProtectedRoute>
        ),
      },
      { path: 'Suivi', element: <Suivi /> },
    ],
  },
  { path: '*', element: <PageNotFound /> },
]);