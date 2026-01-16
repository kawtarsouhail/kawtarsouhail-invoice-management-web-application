import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/UnauthorizedPage.css';  // Assurez-vous d’ajouter les styles appropriés.

const UnauthorizedPage = () => {
    return (
        <div className="unauthorized-container">
            <h1>Accès Refusé</h1>
            <p>Vous n'avez pas la permission d'accéder à cette page.</p>
        </div>
    );
};

export default UnauthorizedPage;
