import React, { useState, useEffect } from 'react';
import axios from '../router/axiosInstance';
import Table from './Table';
import '../../css/Visualiser.css';


const Suivi = () => {
  const [filtrageItem, setItemFiltrage] = useState('Valeur :');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [remiseNum, setRemiseNum] = useState('');
  const [totalMontant, setTotalMontant] = useState(0);
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    try {
      axios.get('http://localhost:8000/api/getFacture')
        .then(response => {
          setData(response.data.donnees);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    setDisplayData(data);
  }, [data]);

  // useEffect(() => {
  //   if (filtrageItem === 'Nº De Remise:') {
  //     const total = displayData.reduce((acc, curr) => acc + (curr.montant || 0), 0);
  //     setTotalMontant(total);
  //   }
  // }, [displayData, filtrageItem]);

  const handleChangefiltrage = (e) => {
    const newFiltrageItem = e.target.value;
    setItemFiltrage(newFiltrageItem);
  
    // Réinitialiser l'état de l'input de filtrage et les données affichées
    setRemiseNum('');
    setTotalMontant(0);
    setDisplayData(data);
  
    // Si on sélectionne "Toutes les Factures", on réinitialise complètement
    if (newFiltrageItem === 'Valeur :') {
      setRemiseNum(''); // Assurez-vous que l'input est vidé
    }
  };
  
  

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

  const CalculMontantantTotal=(inputRemise)=>{
    const total = data.reduce((total, item) => {
      console.log(item); // Log each item to see its structure
      if (String(item.remise?.NumRemise).trim().toUpperCase() === inputRemise) {
        console.log('Match found', item);
        return total + (item.MontantEnc || 0);
      }
      return total;
    }, 0);
    console.log('Total Calculated:', total);
    setTotalMontant(total);
  }

  // const handleNumChequeChange = (e) => {
  //   const inputCheque = e.target.value.toUpperCase();
  //   setRemiseNum(inputCheque);
  //   if (inputCheque.trim()) {
  //     const filteredData = data.filter(item => String(item.cheque?.NumCheque) === inputCheque.trim());
  //     setDisplayData(filteredData);
  //   } else {
  //     setDisplayData(data);
  //   }
  // };

  const handleInputChange = (e) => {
    const value = e.target.value.trim().toUpperCase();
    setRemiseNum(value);  // Mettre à jour l'état avec la nouvelle valeur
  
    if (filtrageItem === 'Nº De Remise:') {
      CalculMontantantTotal(value);
      const filteredData = data.filter(item => String(item.remise?.NumRemise).trim().toUpperCase() === value);
      setDisplayData(filteredData.length > 0 ? filteredData : data);
    } else if (filtrageItem === 'Nº De Cheque :') {
      const filteredData = data.filter(item => String(item.cheque?.NumCheque).trim().toUpperCase() === value);
      setDisplayData(filteredData.length > 0 ? filteredData : data);
    }
  };
  

  const renderInputOrSelect = () => {
    if (filtrageItem === 'Nº De Remise:' || filtrageItem === 'Nº De Cheque :') {
      return (
        <input
          type="text"
          className="form-control"
          id="textInput"
          placeholder="Entrer Valeur"
          value={remiseNum}
          onChange={handleInputChange}
          disabled={filtrageItem === 'Valeur :'}
        />
      );
    } else {
      // Cette branche peut ne pas être nécessaire si aucune entrée n'est requise pour "Valeur :"
      return (
        <input
          type="text"
          className="form-control"
          id="textInput"
          placeholder="Enter value"
          value="" // Garantir que l'input est vide
          disabled={true}
        />
      );
    }
  };
  

  if (loading) return <div className='loader'></div>;
  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>No data available</div>;

  return (
    <div className="Visualiser">
      <center>
        <h2>Suivi des paiements</h2>
      </center>
      <div className="form-group">
        <label htmlFor="selectOption">Element de Filtrage:</label>
        <select id="selectOption" className="form-control" onChange={handleChangefiltrage}>
          <option value="Valeur :">[ Toutes les Factures ]</option>
          <option value="Nº De Remise:">Nº De Remise</option>
          <option value="Nº De Cheque :">Nº De Cheque</option>
        </select>
        <label htmlFor="textInput">{filtrageItem}</label>
        {renderInputOrSelect()}
        <select id="itemsPerPageSelect" onChange={handleItemsPerPageChange} title="Nombre de colonnes">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
      <div className='total-montant'>
        {filtrageItem === 'Nº De Remise:' && (
          <p className='total'>Total du montant encaissé : {totalMontant.toFixed(2)} Dh</p>
        )}
      </div>

      <Table data={displayData} itemsPerPage={itemsPerPage} />
    </div>
  );
};

export default Suivi;
