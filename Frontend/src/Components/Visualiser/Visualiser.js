import React,{useState,useEffect} from 'react';
import Table from './Table';
import axios from '../router/axiosInstance';
import '../../css/Visualiser.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const Visualiser = () => {
  const [filtrageItem, setItemFiltrage] = useState('Valeur :');
  const [itemsPerPage, setItemsPerPage] = useState(5); 
  const [payeeOrImpayee, setPayeeOrImpayee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtrageValue, setFiltrageValue] = useState('');
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]); 

  const [loading] = useState(false);
  const [error] = useState(null);
  
  useEffect(() => {
    try {
      axios.get('http://localhost:8000/api/getFacture')
        .then(response => {
          setData(response.data.donnees);
          setDisplayData(response.data.donnees);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  console.log(data)
  const handleChangefiltrage=(e)=>{
    e.preventDefault();
    setItemFiltrage(e.target.value);
  }

  const handleNumeroFactureChange = (e) => {
    const inputNum = e.target.value;
    setFiltrageValue(inputNum);
  
    if (inputNum.trim()) {  // Ensure input is not just white space
      const filteredData = data.filter(item => String(item.NumFacture) === inputNum.trim());
      setDisplayData(filteredData);  // Always set the filtered data, even if empty
    } else {
      setDisplayData(data);  // If no input, show all data
    }
  };

  const handleNomClientChange = (e) => {
    const inputNom = e.target.value.toUpperCase();
    setFiltrageValue(inputNom);
  
    if (inputNom.trim()) {  // Ensure input is not just white space
      const filteredData = data.filter(item => String(item.client.NomClient) === inputNom.trim());
      setDisplayData(filteredData);  // Always set the filtered data, even if empty
    } else {
      setDisplayData(data);  // If no input, show all data
    }
  };

  const handleEtatPayementChange = (e) => {
    const inputEtatPayment = e.target.value.toUpperCase();
    setPayeeOrImpayee(inputEtatPayment);
    console.log(inputEtatPayment);
    setFiltrageValue(inputEtatPayment);

  
    if (inputEtatPayment.trim()) {  // Ensure input is not just white space
      const filteredData = data.filter(item => String(item.EtaPayement) === inputEtatPayment.trim());
      setDisplayData(filteredData);  // Always set the filtered data, even if empty
    } else {
      setDisplayData(data);  // If no input, show all data
      console.log('failed')
    }
  };
  
  console.log('dataToDisplay',displayData);
  useEffect(() => {
    const applyFilters = () => {
      let filtered = data; // Commencez avec l'ensemble complet des données
  
      // Application des filtres textuels
      if (filtrageValue) {
        switch (filtrageItem) {
          case 'Nº de Facture :':
            filtered = filtered.filter(item => String(item.NumFacture) === filtrageValue.trim());
            break;
          case 'Nom Client :':
            filtered = filtered.filter(item => String(item.client.NomClient).toUpperCase() === filtrageValue.trim());
            break;
          case 'Payée/Impayée :':
            filtered = filtered.filter(item => String(item.EtaPayement).toUpperCase() === filtrageValue.trim());
            break;
          default:
            break;
        }
      }
  
      // Filtre de date
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Inclut tout le jour de la date de fin
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.DateFacture);
          return itemDate >= start && itemDate <= end;
        });
      }
  
      setDisplayData(filtered);
    };
  
    applyFilters();
  }, [data, filtrageValue, filtrageItem, startDate, endDate]); // Inclure startDate et endDate comme dépendances
  
  
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value)); // Convertir la valeur en nombre entier
  };  

  const renderInputOrSelect = () => {

    if (filtrageItem === 'Payée/Impayée :') {
      return (
        <select
          id="payeeOrImpayeeSelect"
          className="form-control"
          value={payeeOrImpayee}
          onChange={handleEtatPayementChange}
        >
          <option value="" disabled>[Choisir]</option>
          <option value="PAYEE">Payée</option>
          <option value="IMPAYEE">Impayée</option>
        </select>
      );
    } else if(filtrageItem === 'Nom Client :'){
      return (
        <input
          type="text"
          className="form-control"
          id="textInput"
          placeholder="Enter value"
          disabled={filtrageItem === 'Valeur :'}
          onChange={handleNomClientChange}
        />
      );
    }

    else{
      return (
        <input
          type="text"
          className="form-control"
          id="textInput"
          placeholder="Enter value"
          disabled={filtrageItem === 'Valeur :'}
          onChange={handleNumeroFactureChange}
        />
      );
    }
  };
  
  const filterByDate = () => {
    if (!startDate || !endDate) return; // Assurez-vous que les deux dates sont définies
  
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Inclut tout le jour de la date de fin
  
    const filtered = data.filter(item => {
      const itemDate = new Date(item.DateFacture);
      return itemDate >= start && itemDate <= end;
    });
  
    setDisplayData(filtered);
  };  

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    filterByDate();
  };

  const resetDates = (e) => {
    e.preventDefault();
    setStartDate(null);
    setEndDate(null);
    setDisplayData(data); // Reafficher toutes les données puisque les filtres de dates sont enlevés
  };
  const exportToExcel = () => {
    const dataToExport = displayData.map(item => {
      console.log(item.cheque); // Vérifiez le contenu de cheque
      return {
        NomClient: item.client.NomClient,
        NumFacture: item.NumFacture,
        DateFacture: item.DateFacture,
        MontantTTC: item.MontantTTC,
        ModeReg: item.ModeReg,
        DatePayement: item.DatePayement,
        EtaPayement: item.EtaPayement,
        NumCheque: item.cheque?.NumCheque ?? 'null',
      };
    });
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'data.xlsx');
  };
  
  if (loading) return <div class="loader loader-center"></div>;

  if (error) return <p>Error: {error}</p>;
  return (
    <div className="Visualiser">
      <center>
        <h2>Visualiser Facture</h2>
      </center>
      <div className="form-group">
        <label htmlFor="selectOption">Element de Filtrage:</label>
        <select
          id="selectOption"
          className="form-control"
          onChange={(e) => handleChangefiltrage(e)}
        >
          <option value="Valeur :">[ Toutes les Factures ]</option>
          <option value="Nº de Facture :">Nº de Facture</option>
          <option value="Nom Client :">Nom Client</option>
          <option value="Payée/Impayée :">Payée/Impayée</option>
        </select>

        <label htmlFor="textInput">{filtrageItem}</label>
        {renderInputOrSelect()}
        <select
          id="itemsPerPageSelect"
          onChange={(e) => handleItemsPerPageChange(e)}
          title="Nombre de colonnes"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
      <div className="date-filters">
          <label htmlFor="startDate">Date de Facture De :</label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate || ''} // S'assure que la valeur est toujours une chaîne valide
            onChange={(e) => handleStartDateChange(e)}
          />

          <label htmlFor="endDate">À :</label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate || ''} // S'assure que la valeur est toujours une chaîne valide
            onChange={(e) => handleEndDateChange(e)}
          />

          <div onClick={resetDates} className='resetDateBtn' title='Actualiser les dates'>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 21 21"><g fill="none" fillRule="evenodd" stroke="#ffff" strokeLinecap="round" strokeLinejoin="round"><path d="M3.578 6.487A8 8 0 1 1 2.5 10.5"></path><path d="M7.5 6.5h-4v-4"></path></g></svg>
          </div>
        </div>
        <div className='exportButton'>
          <button  onClick={exportToExcel} >Exporter vers Excel</button>
        </div>
      <Table data={displayData} itemsPerPage={itemsPerPage} />
    </div>
  );
};
  
export default Visualiser;
