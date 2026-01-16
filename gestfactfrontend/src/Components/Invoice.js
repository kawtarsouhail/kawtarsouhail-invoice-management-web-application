import React, { useState } from 'react';
import '../css/invoice.css';
import axios from '../Components/router/axiosInstance';
import Swal from 'sweetalert2';
import { FiX } from 'react-icons/fi'; 

const Invoice = () => {
  const [emetteurList, setEmetteurList] = useState([]);
  const [dynamicInputs, setDynamicInputs] = useState({});

  const [formData, setFormData] = useState({
    NumFacture: "",
    NomClient: "",
    NumBonLiv: "",
    dateBonLiv: "",
    TypeValidation: "WhatsApp",
    NumBonCommande:"",
    MontantHT: "",
    DateFacture: "",
    Taux: "0",
   // TVA: "",
   //MontantTTC: "",
    NomEmetteur: "",
    TypeContrat: "contrat",
    EtabliPar: "",
    EtaPayement: "PAYEE",
    ModeReg: "ESPÈCE",
    MontantEnc: "",
    NumRemise: "",
    NumCheque: "",
    DatePayement:""
  });

    const handleChange = (event) => {
    const { name, value, type } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (type === 'select-one') {
      setDynamicInputs(prev => ({
        ...prev, 
        [name]: value === 'AUTRE'
      }));
    }
  };
 
  const resetInput = (name) => {
    setDynamicInputs(prev => ({ ...prev, [name]: false }));
    const defaultValue = getFieldDefaultValue(name);
    setFormData(prev => ({ ...prev, [name]: defaultValue }));
  };
  
  
  // Cette fonction supplémentaire permet de déterminer la valeur par défaut pour chaque champ
  const getFieldDefaultValue = (name) => {
    const field = fieldsConfig.find(field => field.name === name);
    return field.options[1]; 
  };
  

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'NomEmetteur') {
      let emetteurs = JSON.parse(localStorage.getItem('emetteurs') || '[]');
      if (value && !emetteurs.includes(value)) {
        emetteurs.push(value);
        localStorage.setItem('emetteurs', JSON.stringify(emetteurs));
      }
    }
  };

  const handleFocus = (e) => {
    const name = e.target.name;
    if (name === 'NomEmetteur') {
      const storedEmetteurs = JSON.parse(localStorage.getItem('emetteurs') || '[]');
      setEmetteurList(storedEmetteurs);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/enregistrerFacture', formData);
      Swal.fire({
        icon: 'success',
        title: 'Enregistrement réussi',
        text: 'Les données ont été enregistrées avec succès.'
      });
      setFormData({
        NumFacture: '',
        NomClient: '',
        NumBonLiv: '',
        dateBonLiv: '',
        TypeValidation: 'WhatsApp',
        NumBonCommande: '',
        dateValidation: '',
        MontantHT: '',
        DateFacture: '',
        Taux: '0',
        NomEmetteur: '',
        TypeContrat: 'contrat',
        EtabliPar: '',
        EtaPayement: 'PAYEE',
        ModeReg: 'ESPÈCE',
        MontantEnc: '',
        NumRemise: '',
        NumCheque: '',
        DatePayement: ''
      });
    } catch (error) {
      let errorMessage = 'Une erreur est survenue lors de l\'enregistrement des données. Veuillez réessayer.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage
      });
    }
  };

  const fieldsConfig = [
    { label: 'Nº de Facture', type: 'text', min: '0', name: 'NumFacture' },
    { label: 'Date de Facture', type: 'date', name: 'DateFacture' },
    { label: 'Nom Client', type: 'text', name: 'NomClient' },
    { label: 'Nº Bon de livraison', type: 'text', min: '0', name: 'NumBonLiv' },
    { label: 'Date de Livraison', type: 'date', name: 'dateBonLiv' },
    { label: 'Type de validation', type: 'select', options: ['[Choisir Type Validation]','WHATSSAP', 'BON DE COMMANDE', 'BON ACCORD','AUTRE'], name: 'TypeValidation' },
   // { label: 'DatBon de Commande', type: 'date', name: 'dateBonCommande' },'DatePayement',
    { label: 'Date de validation', type: 'date', name: 'dateValidation' },
    { label: 'Montant HT', type: 'number', min: '0', name: 'MontantHT' },
    { label: 'Taux', type: 'select',options: ['[Taux %]', '0','20','AUTRE'], name: 'Taux' },
    { label: 'Emetteur', type: 'text', name: 'NomEmetteur' },
    { label: 'Type de contrat', type: 'select', options: ['[Choisir Type de contrat]', 'CONTRAT', 'PONCTUEL','AUTRE'], name: 'TypeContrat' },
    { label: 'Etablit Par', type: 'text', name: 'EtabliPar' },
    { label: 'PAYEE / IMPAYEE', type: 'select', options: ['[Choisir PAYEE / IMPAYEE]', 'PAYEE', 'IMPAYEE','AVANCE','AUTRE'], name: 'EtaPayement' },
    { label: 'Mode de reglement', type: 'select', options: ['[MODE DE REGLEMENT]', 'ESPÈCE', 'CHÈQUE', 'VIREMENT','VIREMENT ESPECE','PAR EFFET','AUTRE'], name: 'ModeReg' },
    { label: 'Montant encaisse', type: 'number', min: '0', name: 'MontantEnc' },
    { label: 'Date de Payement', type: 'date', min: '0', name: 'DatePayement' }
  ];
  
  return (
    <div className='invoice'>
      <center><h1>Nouvelle Facture</h1></center>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-container">
          {fieldsConfig.map((field, index) => (
            <div key={index} className='item'>
              <label>{field.label}</label>
              {dynamicInputs[field.name] ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                  />
                <FiX onClick={() => resetInput(field.name)} style={{ cursor: 'pointer', marginLeft: '5px' }} />
                </div>
              )  : field.type === 'select' ? (
                <select
                  className='selectFact'
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                >
                  {field.options.map((option, optionIndex) => (
                    <option
                      key={optionIndex}
                      value={option}
                      disabled={option.startsWith('[') && option !== formData[field.name]}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                
                <input
                  type={field.type === 'sting' ? 'text' : field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onFocus={field.name === 'NomEmetteur' ? handleFocus : undefined}
                  onBlur={field.name === 'NomEmetteur' ? handleBlur : undefined}
                  list={field.name === 'NomEmetteur' ? "emetteur-options" : undefined}
                  min={field.min}
                  required
                />
              )}
              {field.name === 'NomEmetteur' && (
                <datalist id="emetteur-options">
                  {emetteurList.map((emetteur, idx) => (
                    <option key={idx} value={emetteur} />
                  ))}
                </datalist>
              )}
            </div>
          ))}
          {formData.TypeValidation === 'BON DE COMMANDE' && (
            <>
              <div className='item'>
                <label>Num de Bon Commande</label>
                <input
                  type="text"
                  name="NumBonCommande"
                  value={formData.NumBonCommande}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          {/* Champs conditionnels pour le mode de paiement par chèque */}
          {formData.ModeReg === 'CHÈQUE' && (
            <>
              <div className='item'>
                <label>Numéro de Remise</label>
                <input
                  type="text"
                  name="NumRemise"
                  value={formData.NumRemise}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='item'>
                <label>Numéro de Chèque</label>
                <input
                  type="text"
                  name="NumCheque"
                  value={formData.NumCheque}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
        </div>
        <div className="button-container">
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
};

export default Invoice;