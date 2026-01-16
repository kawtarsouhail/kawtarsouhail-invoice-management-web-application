import React from 'react';
import '../../css/PageNotFound.css'; // Assurez-vous de créer un fichier CSS avec ce nom

const PageNotFound = () => {
    return (
        <div className="page-not-found">
            <h1>404</h1>
            <p>Oups! La page que vous cherchez n'existe pas.</p>
            <a href="/" className="home-link">Retour à la page d'accueil</a>
        </div>
    );
}

export default PageNotFound;


