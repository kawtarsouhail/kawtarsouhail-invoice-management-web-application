import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken,deleteToken } from "../router/auth";
import axios from "../router/axiosInstance";
import '../../css/Menu.css';

export default function Menu() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); 
    
  
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = getToken();
    
                if (token) {
                    const response = await axios.get('http://localhost:8000/api/user', {
                    
                    });
                    setUser(response.data.user);
                    setRole(response.data.role); 
                }
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };
    
        fetchUser();
    }, []);
    


    const handleLogout = async () => {
        try {
          const token = getToken();
      
          if (token) {
            await axios.post('http://localhost:8000/api/logout', null, {
            });
            deleteToken();
            navigate('/');  
          }
        } catch (error) {
          console.error('Logout failed', error);
        }
      };
    const handleMenuClick = () => {
        document.getElementById('checkbox_toggle').checked = false;
    }
    return (
        <>
            <div className="Menu sidebar">
                <header>
                    <div className="LOGO">
                        <img src={require('../../Ressources/LOGO-HEADER-WINBEST-CLIMATISATION-SOCIETE-CLIMATISATION-CASABLANCA.webp')} alt="Logo"/>
                    </div>
                    <div className="Profil">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2.3em" height="2.3em" viewBox="0 0 24 24"><path fill="#78c2ff" d="M15.71 12.71a6 6 0 1 0-7.42 0a10 10 0 0 0-6.22 8.18a1 1 0 0 0 2 .22a8 8 0 0 1 15.9 0a1 1 0 0 0 1 .89h .11a1 1 0 0 0 .88-1.1a10 10 0 0 0-6.25-8.19M12 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4"/></svg>
                        </div>
                        <div className="Infos-css">
                            <a href="#" className="Profil-Link-css">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <p>{user.name.toUpperCase()}</p>
                            )}
                        </a> 
                        <small>
                            <div className="green-circle"></div>
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <p>{role.toUpperCase()}</p>
                            )}
                            </small>
                        </div>
                    </div>
                </header>
                <div className="menu-bar">
                    <div className="menu">
                        <ul className="menu-links-css">
                            <li className="nav-links-css">
                                <Link to='/Visualiser'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2.5em" viewBox="0 0 50 50"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke="white" d="M25 29.167a4.167 4.167 0 1 0 0-8.334a4.167 4.167 0 0 0 0 8.334"/><path stroke="white" d="M43.75 25S37.5 37.5 25 37.5S6.25 25 6.25 25S12.5 12.5 25 12.5S43.75 25 43.75 25"/></g></svg>
                                    <span className="text nav-text visual">Visualiser les factures</span>
                                </Link>
                            </li>
                            {(role === 'Super Admin' || role === 'Admin') && (
                            <li className="nav-links-css">
                                <Link to='/Enregistrer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2em" viewBox="0 0 24 24"><path fill="#ffff" d="M13 16H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m-4-6h2a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2m12 2h-3V3a1 1 0 0 0-.5-.87a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0A1 1 0 0 0 2 3v16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1M5 20a1 1 0 0 1-1-1V4.73l2 1.14a1.08 1.08 0 0 0 1 0l3-1.72l3 1.72a1.08 1.08 0 0 0 1 0l2-1.14V19a3 3 0 0 0 .18 1Zm15-1a1 1 0 0 1-2 0v-5h2Zm-7-7H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2"/></svg>
                                    <span className="text nav-text">Enregistrer facture</span>
                                </Link>
                            </li>
                             )}
                            <li className="nav-links-css">
                                <Link to='/Suivi'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2em" viewBox="0 0 24 24"><path fill="white" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m-1 14H5c-.55 0-1-.45-1-1v-5h16v5c0 .55-.45 1-1 1m1-10H4V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1z"></path></svg>
                                    <span className="text nav-text">Suivi des paiements</span>
                                </Link>
                            </li>
                            <li className="nav-links-css">
                                <Link to='/HistoriquePaiement'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#ffff" d="M12 2a10 10 0 0 0-6.88 2.77V3a1 1 0 0 0-2 0v4.5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 0-2h-2.4A8 8 0 1 1 4 12a1 1 0 0 0-2 0A10 10 0 1 0 12 2m0 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2h-1V9a1 1 0 0 0-1-1"></path></svg>
                                <span className="text nav-text visual">Historique de Paiement</span>
                                </Link>
                            </li>  
                            {(role === 'Super Admin') && (
                            <li className="nav-links-css">
                                <Link to='/Gestion des comptes'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="1.8em" viewBox="0 0 2048 2048"><path fill="white" d="M1148 1152q-83-62-179-95t-201-33q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-120 35-231t101-205t156-167t204-115q-56-35-100-82t-76-104t-47-119t-17-129q0-106 40-199t110-162T569 41T768 0t199 40t162 110t110 163t41 199q0 66-16 129t-48 119t-76 103t-101 83q60 23 113 54v152zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1664 768v768H1024v-768h256v-256h512v256zm-640 0h256v-128h-256zm512 384h-128v128h-128v-128h-256v128h-128v-128h-128v256h768zm0-256h-768v128h768z"></path></svg>
                                    <span className="text nav-text">Gestion des comptes</span>
                                </Link>
                            </li>
                              )}
                        </ul>
                    </div>
                </div>
                <div className="Mode-Deconnexion">
                    <div className="Mode">
                        <p>Se déconnecter</p>
                    </div>
                    <div className="Deconnexion">
                        <a onClick={handleLogout}>
                            <i className='bx bx-log-out'></i>
                        </a>
                    </div>
                </div>    
            </div>
            {/* <div className="Mynav">
            <nav class="navbar">
                
                <div class="Nav-logo">
                    <img src={require('../../Ressources/LOGO-HEADER-WINBEST-CLIMATISATION-SOCIETE-CLIMATISATION-CASABLANCA.webp')} alt="Logo_ofppt"/>
                </div>
                
                <ul class="nav-links-css">
                    <input type="checkbox" id="checkbox_toggle" />
                    <label for="checkbox_toggle" class="toggle">&#9776;</label>

                    <div class="Nav-menu">
                        <li className="nav-links-css"> 
                                <Link to='/Visualiser'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2.5em" viewBox="0 0 50 50"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke="white" d="M25 29.167a4.167 4.167 0 1 0 0-8.334a4.167 4.167 0 0 0 0 8.334"/><path stroke="white" d="M43.75 25S37.5 37.5 25 37.5S6.25 25 6.25 25S12.5 12.5 25 12.5S43.75 25 43.75 25"/></g></svg>
                                    <span className="text nav-text visual">Visualiser les factures</span>
                                </Link>
                        </li>
                        {(role === 'Super Admin' || role === 'Admin') && (
                        <li className="nav-links-css"> 
                                <Link to='/Enregistrer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2em" viewBox="0 0 24 24"><path fill="#ffff" d="M13 16H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m-4-6h2a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2m12 2h-3V3a1 1 0 0 0-.5-.87a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0A1 1 0 0 0 2 3v16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1M5 20a1 1 0 0 1-1-1V4.73l2 1.14a1.08 1.08 0 0 0 1 0l3-1.72l3 1.72a1.08 1.08 0 0 0 1 0l2-1.14V19a3 3 0 0 0 .18 1Zm15-1a1 1 0 0 1-2 0v-5h2Zm-7-7H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2"/></svg>
                                    <span className="text nav-text">Enregistrer facture</span>
                                </Link>
                        </li>
                        )}
                        <li className="nav-links-css"> 
                                <Link to='/Suivi'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2em" viewBox="0 0 24 24"><path fill="white" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m-1 14H5c-.55 0-1-.45-1-1v-5h16v5c0 .55-.45 1-1 1m1-10H4V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1z"></path></svg>
                                    <span className="text nav-text">Suivi des paiements</span>
                                </Link>
                        </li>
                        <li className="nav-links-css"> 
                                <Link to='/HistoriquePaiement'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#ffff" d="M12 2a10 10 0 0 0-6.88 2.77V3a1 1 0 0 0-2 0v4.5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 0-2h-2.4A8 8 0 1 1 4 12a1 1 0 0 0-2 0A10 10 0 1 0 12 2m0 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2h-1V9a1 1 0 0 0-1-1"></path></svg>
                                    <span className="text nav-text visual">Historique de Paiement</span>
                                </Link>
                        </li>
                        {role === 'Super Admin' && (
                        <li className="nav-links-css"> 
                                <Link to='/Gestion des comptes'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="1.8em" viewBox="0 0 2048 2048"><path fill="white" d="M1148 1152q-83-62-179-95t-201-33q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-120 35-231t101-205t156-167t204-115q-56-35-100-82t-76-104t-47-119t-17-129q0-106 40-199t110-162T569 41T768 0t199 40t162 110t110 163t41 199q0 66-16 129t-48 119t-76 103t-101 83q60 23 113 54v152zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1664 768v768H1024v-768h256v-256h512v256zm-640 0h256v-128h-256zm512 384h-128v128h-128v-128h-256v128h-128v-128h-128v256h768zm0-256h-768v128h768z"></path></svg>
                                    <span className="text nav-text">Gestion des comptes</span>
                                </Link>
                        </li>
                        )}
                        <li className="nav-links-css"> 
                        <div >
                                <div className="Deconnexion">
                                    <a href="#"><h5>Se deconnecter   <i class='bx bx-log-out' onClick={handleLogout}></i></h5>
                                    </a>
                                </div>
                            </div>
                        </li>

                    </div>
                </ul>
            </nav>
            </div> */}
            
        <div className="Mynav">
            <nav className="navbar">
                <div className="Nav-logo">
                    <img src={require('../../Ressources/LOGO-HEADER-WINBEST-CLIMATISATION-SOCIETE-CLIMATISATION-CASABLANCA.webp')} alt="Logo_ofppt" />
                </div>

                <ul className="nav-links-css">
                    <input type="checkbox" id="checkbox_toggle" />
                    <label htmlFor="checkbox_toggle" className="toggle">&#9776;</label>

                    <div className="Nav-menu">
                        <li className="nav-links-css" onClick={handleMenuClick}> 
                            <Link to='/Visualiser'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2.5em" viewBox="0 0 50 50">
                                    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                        <path stroke="white" d="M25 29.167a4.167 4.167 0 1 0 0-8.334a4.167 4.167 0 0 0 0 8.334"/>
                                        <path stroke="white" d="M43.75 25S37.5 37.5 25 37.5S6.25 25 6.25 25S12.5 12.5 25 12.5S43.75 25 43.75 25"/>
                                    </g>
                                </svg>
                                <span className="text nav-text visual">Visualiser les factures</span>
                            </Link>
                        </li>
                        {(role === 'Super Admin' || role === 'Admin') && (
                            <li className="nav-links-css" onClick={handleMenuClick}> 
                                <Link to='/Enregistrer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2em" viewBox="0 0 24 24">
                                        <path fill="#ffff" d="M13 16H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2m-4-6h2a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2m12 2h-3V3a1 1 0 0 0-.5-.87a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0l-3 1.72l-3-1.72a1 1 0 0 0-1 0A1 1 0 0 0 2 3v16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1M5 20a1 1 0 0 1-1-1V4.73l2 1.14a1.08 1.08 0 0 0 1 0l3-1.72l3 1.72a1.08 1.08 0 0 0 1 0l2-1.14V19a3 3 0 0 0 .18 1Zm15-1a1 1 0 0 1-2 0v-5h2Zm-7-7H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2"/>
                                    </svg>
                                    <span className="text nav-text">Enregistrer facture</span>
                                </Link>
                            </li>
                        )}
                        <li className="nav-links-css" onClick={handleMenuClick}> 
                            <Link to='/Suivi'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.9em" height="2em" viewBox="0 0 24 24">
                                    <path fill="white" d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m-1 14H5c-.55 0-1-.45-1-1v-5h16v5c0 .55-.45 1-1 1m1-10H4V7c0-.55.45-1 1-1h14c.55 0 1 .45 1 1z"></path>
                                </svg>
                                <span className="text nav-text">Suivi des paiements</span>
                            </Link>
                        </li>
                        <li className="nav-links-css" onClick={handleMenuClick}> 
                            <Link to='/HistoriquePaiement'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24">
                                    <path fill="#ffff" d="M12 2a10 10 0 0 0-6.88 2.77V3a1 1 0 0 0-2 0v4.5a1 1 0 0 0 1 1h4.5a1 1 0 0 0 0-2h-2.4A8 8 0 1 1 4 12a1 1 0 0 0-2 0A10 10 0 1 0 12 2m0 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2h-1V9a1 1 0 0 0-1-1"></path>
                                </svg>
                                <span className="text nav-text visual">Historique de Paiement</span>
                            </Link>
                        </li>
                        {role === 'Super Admin' && (
                            <li className="nav-links-css" onClick={handleMenuClick}> 
                                <Link to='/Gestion des comptes'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="1.8em" viewBox="0 0 2048 2048">
                                        <path fill="white" d="M1148 1152q-83-62-179-95t-201-33q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-120 35-231t101-205t156-167t204-115q-56-35-100-82t-76-104t-47-119t-17-129q0-106 40-199t110-162T569 41T768 0t199 40t162 110t110 163t41 199q0 66-16 129t-48 119t-76 103t-101 83q60 23 113 54v152zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1664 768v768H1024v-768h256v-256h512v256zm-640 0h256v-128h-256zm512 384h-128v128h-128v-128h-256v128h-128v-128h-128v256h768zm128-256h-256v128h256v-128zm-128-384h-128v128h128v-128z"/>
                                    </svg>
                                    <span className="text nav-text">Gestion des comptes</span>
                                </Link>
                            </li>
                        )}
                        <li className="nav-links-css" onClick={handleLogout}>
                            <div >
                                <div className="Deconnexion">
                                    <a href="#"><h5>Se deconnecter   <i class='bx bx-log-out' onClick={handleLogout}></i></h5>
                                    </a>
                                </div>
                            </div>
                        </li>
                    </div>
                </ul>
            </nav>
        </div>
    );

        </>
    );
}