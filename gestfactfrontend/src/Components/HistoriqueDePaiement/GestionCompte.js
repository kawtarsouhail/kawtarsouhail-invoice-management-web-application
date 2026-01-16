import React, { useState, useEffect } from 'react';
import '../../css/GestionCompte.css';
import Swal from 'sweetalert2';
import axios from '../router/axiosInstance';
import HistoriquePaiement from './HistoriquePaiement';
import { getToken } from '../router/auth';

const GestionCompte2 = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [TableVisible, setTableVisible] = useState(false);
  const [activeBoxId, setActiveBoxId] = useState(null);
  const [dateReliquat, setdateReliquat] = useState('');
  const [ModeReg, setModeReg] = useState('');
  const [NumFacture,setNumFacture]=useState('');
  const [NumRemise,setNumRemise]=useState('');
  const [NumCheque,setNumCheque]=useState('');
  const [MontantEnc,setMontantEnc]=useState('');
  const [error,setError] = useState('');
  const [role , setRole] = useState('');
  const [relisquat,setReliquat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCanDelete, setUserCanDelete] = useState(true);
  //const [AutreModeReg, setAutreModeReg] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();

        if (token) {
          const response = await axios.get('http://localhost:8000/api/user', {
          });
          setRole(response.data.role);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (role === 'Super Admin' || role === 'Admin') {
      setUserCanDelete(true);
    } else if (role === 'Utilisateur') {
      setUserCanDelete(false);
    } else {
      console.error('Unknown role');
    }
  }, [role]);


  const fetchReliquat = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get('http://localhost:8000/api/getReliquat');
        console.log(response);
        setReliquat(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch Reliquat:", error);
      } finally {
        setIsLoading(false); // End loading, success or error
      }
  };

  useEffect(() => {
    fetchReliquat();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //const modeDeReglement = ModeReg === 'AUTRE' ? AutreModeReg : ModeReg;
    try {
      const response = await axios.post('http://localhost:8000/api/createReliquat', {
        dateReliquat,  ModeReg, MontantEnc, NumRemise, NumCheque, NumFacture
      });
  
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Enregistré avec succès',
          text: 'Le reliquat a été créé avec succès!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        
        // Reset states after successful creation
        setReliquat('');
        setModeReg('');
        setMontantEnc('');
        setNumRemise('');
        setNumCheque('');
        setNumFacture('');
        setdateReliquat('');
        fetchReliquat(); 
      } else {
        handleError(response);
      }
    } catch (err) {
      let errorMessage = 'Échec de la creation due à une erreur serveur';
      
      if (err.response) {
        errorMessage = err.response.data.message || 'Un problème est survenu lors de l\'enregistrement.';
      } else if (err.request) {
        errorMessage = 'Le serveur ne répond pas.';
      } else {
        errorMessage = err.message;
      }
  
      setError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Erreur Serveur',
        text: errorMessage,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  };
  
  function handleError(response) {
    let errorMessage = 'Erreur inconnue';
  
    if (response && response.data) {
      errorMessage = response.data.message || 'Erreur lors du traitement de la demande.';
    }
  
    setError(errorMessage);
    Swal.fire({
      icon: 'error',
      title: 'Échec de l\'enregistrement',
      text: errorMessage,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
  }
  
  const handleBoxClick = (boxId) => {
    setActiveBoxId(boxId); // Sets the active box ID

    if (boxId === 'create') {
      setTableVisible(false);
      setFormVisible(true); // Shows the form when a box is clicked
    } else if (boxId === 'manage') {
      setFormVisible(false);
      setTableVisible(true); // Assumes there is a similar hook for table visibility
    }
  };



  if (isLoading) {
    return <div>Loading...</div>; // Or use a spinner/loading graphic
  }

  return (
    <div className="GestionCompte">
    <div className={`container ${formVisible ? "smaller" : ""} styleReliquat`}>
    <div className={`box management ${activeBoxId === 'manage' ? 'active' : ''} ${activeBoxId !== null ? 'active-top' : ''}`} onClick={() => handleBoxClick('manage')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48"><g fill="none" stroke="#ffff" strokeLinecap="round" strokeWidth={4}><path strokeLinejoin="round" d="M6 5V30.0036H42V5"></path><path strokeLinejoin="round" d="M30 37L24 43L18 37"></path><path strokeLinejoin="round" d="M24 30V43"></path><path strokeLinejoin="round" d="M27.9887 10.9785L33 16L27.9887 21.0902"></path><path d="M15.0009 16.001H33"></path></g></svg><div>Suivi des reliquats</div>
      </div>
      {userCanDelete && (
      <div className={`box add ${activeBoxId === 'create' ? 'active' : ''} ${activeBoxId !== null ? 'active-top' : ''}`} onClick={() => handleBoxClick('create')}>
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 750 710"><path fill="#ffff" d="M713 39q11-3 20 4t8 18v369q0 8-4 14t-12 9q-58 17-116 18t-116-5t-116-18t-116-18t-116-7t-116 16q-11 3-20-5t-9-18V48q0-18 16-23Q74 8 132 6t116 6t117 17l116 18q57 9 116 7t116-15M371 355q17 0 32-9t26-25t18-37t6-45t-6-45t-18-37t-26-25t-32-9t-32 9t-27 25t-17 37l-7 45q-4 24 7 45t17 37t27 25t32 9"></path></svg><div>Ajouter Reliquat</div>
      </div>
        )}
    </div>

{formVisible && (
        <form className="form form-add-user form-Reliquat-Style" onSubmit={handleSubmit}>
          <div className="form-add-row form-add-row-select">
            <div className="form-group">
              <label htmlFor="NumDeFacture">Nº de Facture :</label>
              <input
                id="NumDeFacture"
                type="text"
                placeholder="Nº de Facture"
                name='NumFacture'
                required
                value={NumFacture} // This ensures the input is controlled by React state
                onChange={(e) => setNumFacture(e.target.value)}
              />
            </div>
            </div>
            <div className="form-add-row form-add-row-select">
            <div className="form-group ">
            <label htmlFor="ModeReg">Mode de Règlement :</label>
            {/* {ModeReg === 'AUTRE' ? (
              <input
                type="text"
                placeholder="Veuillez entrer le mode de règlement"
                value={AutreModeReg}
                onChange={(e) => setAutreModeReg(e.target.value)}
                required
              />
            ) : (   )} */}
              <select
                name="ModeReg"
                required=""
                value={ModeReg}
                onChange={(e) => setModeReg(e.target.value)}
                className="selectrole"
              >
                <option value="" disabled>
                  [MODE DE RÈGLEMENT]
                </option>
                <option value="ESPÈCE">ESPÈCE</option>
                <option value="VIREMENT ESPÈCE">VIREMENT ESPÈCE</option>
                <option value="CHÈQUE">CHÈQUE</option>
                <option value="VIREMENT">VIREMENT</option>
                <option value="PAR EFFET">PAR EFFET</option>
              </select>
              </div>
          </div>
          {ModeReg === 'CHÈQUE' && ( // Afficher seulement si le mode de règlement est "CHÈQUE"
            <div className="form-add-row">
              <div className="form-group">
                <label htmlFor="NumRemisei">Nº de Remise :</label>
                <input
                  id="NumDeRemise"
                  type="text"
                  placeholder="Nº de Remise"
                  name='NumRemise'
                  required
                  value={NumRemise} // Binding state to input
                  onChange={(e) => setNumRemise(e.target.value)}
                />
              </div>
              <div className="form-group form-add-row-select">
                <label htmlFor="nom">Nº de Cheque :</label>
                <input
                  id="NumDeCheque"
                  type="text"
                  name='NumCheque'
                  placeholder="Nº de Cheque"
                  required
                  value={NumCheque} // This ensures the input is controlled by React state
                  onChange={(e) => setNumCheque(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="form-add-row  form-add-row-select ajoutReliquat">
            <div className="form-group">
              <label htmlFor="MontantEncaisse">Montant Encaisse :</label>
              <input
                id="MontantEncaisse"
                name='MontantEnc'
                type="text"
                placeholder="Montant Encaisse"
                required
                value={MontantEnc} // Binding state to input
                onChange={(e) => setMontantEnc(e.target.value)}
              />
            </div>
          </div>
          <div className="form-add-row form-add-row-select ajoutReliquat">
            <div className="form-group">
              <label htmlFor="role">Date de Reliquat</label>
              <input type="date" 
               name='dateReliquat'
               placeholder="Date de Reliquat"
               required
               value={dateReliquat} 
               onChange={(e) =>setdateReliquat(e.target.value)}

              />
            </div>
          </div>
          <button type="submit">Enregistrer</button>
        </form>
      )}

    {TableVisible && (
      <HistoriquePaiement/>
    )}

  </div>
  );
}

export default GestionCompte2;