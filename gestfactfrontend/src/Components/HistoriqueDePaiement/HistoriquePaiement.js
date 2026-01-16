import React, { useState, useEffect } from 'react';
import Table from './TableFacture';
import TableReliquat from './TableReliquat';
import axios from '../router/axiosInstance';
import '../../css/HistoriquePaiement.css';
import '../../css/Visualiser.css';
import Swal from 'sweetalert2';


const HistoriquePaiement = () => {
    const [numeroFacture, setNumeroFacture] = useState('');
    const [loading, setLoading] = useState(false);
    const [reliquatsData, setReliquatsData] = useState([]);
    const [factureData, setFactureData] = useState([]);
    const [showTables, setShowTables] = useState(false);

    const fetchFactureAndReliquats = async () => {
        if (!numeroFacture) return; // Empêche l'exécution sans numéro de facture
        
        setLoading(true);
    try {
        const responseFacture = await axios.get(`http://localhost:8000/api/getFactureByNumero/${numeroFacture}`);
            setFactureData(responseFacture.data); // Assurez-vous que la réponse est un tableau

            const responseReliquats = await axios.get(`http://localhost:8000/api/getReliquatByNumF/${numeroFacture}`);
              setReliquatsData(responseReliquats.data); // Assurez-vous que la réponse est un tableau
              setShowTables(true);
              console.log(responseReliquats.data)
    } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 404) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur 404',
                text: "Cette facture n'a pas été trouvée",
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: `Erreur : ${error.message}`,
            });
        }
      
    }
    setLoading(false);
}; 
    const handleSearch = () => {
        fetchFactureAndReliquats();
    };

    const handleChangefiltrage = (event) => {
        setNumeroFacture(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchFactureAndReliquats();
        }
    };


     
    return (
        <div>
            <center>
                <div className="form-group Search">
                    <input
                        type="text"
                        className="form-control"
                        id="textInput"
                        placeholder="Entrer le numéro de facture"
                        value={numeroFacture}
                        onChange={handleChangefiltrage}
                        onKeyPress={handleKeyPress}
                    />
                   <div className='searchButton'>
                       <button onClick={handleSearch} className='searchButtonInside'>
                        <div>
                            Rechercher 
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="0.89em" height="1em" viewBox="0 0 740 840"><path fill="white" d="M734 668q8 9 0 17l-49 49q-3 3-8 3t-8-3L519 584q-50 38-112 55t-133 6q-53-8-99-33t-83-61t-59-85T3 366q-10-79 16-150T96 95t121-76T367 3q53 7 100 30t84 59t62 82t33 100q11 69-6 131t-55 114zM325 557q48 0 90-18t74-50t50-74t18-90t-18-90t-50-74t-74-50t-90-18t-90 18t-73 50t-50 74t-18 90t18 90t50 74t73 50t90 18"/></svg>
                        </div>
                        </button>
                   </div>
                </div>

            </center>
            {
                (loading) && <div class="loader"></div>
            }
            {showTables && (
                <>
                    {factureData && <Table data={factureData} />}
                    <center>
                        <h4>Tableau Reliquats de la facture</h4>
                        {reliquatsData && <TableReliquat data={reliquatsData} reloadData={fetchFactureAndReliquats} />}
                    </center>
                </>
            )}
        </div>
    );

    
};

export default HistoriquePaiement;
