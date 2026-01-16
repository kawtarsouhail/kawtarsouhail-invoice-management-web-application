import React, { useState , useEffect} from 'react';
import '../../css/Table.css'; // Import custom CSS file for styling
import axios from '../router/axiosInstance';
import { getToken } from '../router/auth';
import Swal from 'sweetalert2';


const Table = ({ data: initialData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [data, setData] = useState(initialData);
  const [role, setRole] = useState(null); 
  const [error, setError] = useState(null); 
  const [userCanDelete, setUserCanDelete] = useState(true);
  
  console.log(data)
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
  }, [role]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleShowModal = (rowData) => {
    setSelectedRow(rowData);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  const handleDeleteRow = async () => {
    if (!rowToDelete) {
      console.error('No row selected for deletion');
      return;
    }
    
  
    const apiUrl = `http://localhost:8000/api/deleteFacture/${rowToDelete.id}`; // Adjust the URL to your actual API endpoint
    try {
      const response = await axios.delete(apiUrl);
  
      if (response.status!==200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Optionally, parse the response if you expect any message/data back from your server
      const result = await response;
      console.log('Delete successful:', result);
  
      // Update the data in the state to reflect the change
      setData(data.filter(item => item.id !== rowToDelete.id));
  
      // Swal success alert
      Swal.fire({
        icon: 'success',
        title: 'Supprimé !',
        text: ' a été supprimé.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
  
      // Reset the selected row to delete
      setRowToDelete(null);
  
    } catch (error) {
      console.error('Failed to delete the row:', error);
      // Swal error alert
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to delete the record.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  };
  
  
  
  const handleShowDeleteModal = (item) => {
    setRowToDelete(item);
  };  

  const renderDeleteConfirmationModal = () => {
    if (!rowToDelete) return null;
  
    return (
      <div className="modal-delete">
        <div className="modal-content">
          <span className="close" onClick={() => setRowToDelete(null)}>&times;</span>
          <h2>Confirmation de suppression</h2>
          <p>Voulez-vous vraiment supprimer cette facture {rowToDelete.column1}?</p>
          <div className='btns' style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className='btn-delete' onClick={handleDeleteRow} style={{ marginRight: '10px'}}>Supprimer</button>
            <button onClick={() => setRowToDelete(null)}>Annuler</button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTableData = () => {
      if (!data || data.length === 0) {
        return (
          <tr>
            <td colSpan="6">Chargement des données...</td>
          </tr>
        );
      }
      else{
      return(
      <tr>
        <td>{data.NumFacture}</td>
        <td>{data.cheque && data.cheque.NumCheque ? data.cheque.NumCheque:'null'}</td>
        <td>{data.remise && data.remise.NumRemise ? data.remise.NumRemise:'null'}</td>
        <td>{data.MontantEnc}</td>
        <td>{data.ModeReg}</td>
        <td>{data.DatePayement}</td>
        <td>
          <div className='actions'>
            <span class="tooltip">
              <svg onClick={() => handleShowModal(data)}  xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 32 32"><g fill="none"><rect width={28} height={28} x={2} y={2} fill="#00a6ed" rx={4}></rect><path fill="#fff" d="M16 9.971a1.978 1.978 0 1 0 0-3.956a1.978 1.978 0 0 0 0 3.956m1.61 3.747a1.75 1.75 0 1 0-3.5 0v10.59a1.75 1.75 0 1 0 3.5 0z"></path></g></svg>
              <span class="tooltiptext">Plus d'infos</span>
            </span>
          </div>
        </td>
      </tr>
      )
    }
  };
  
  const renderModal = () => {
    if (!selectedRow) return null;

    return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <h2>Details</h2>
        <div className='modal-items'>
          <div className="modal-item">
            <p>Nº de Facture: <span className="facture">{selectedRow.NumFacture ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Nom Client: <span className="client">{selectedRow.client?.NomClient ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Nº Bon de livraison: <span className="bon">{selectedRow.bon_livraison?.NumBonLiv ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Date de Livraison:<span className="dateLiv">{selectedRow.bon_livraison?.dateBonLiv ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Type de validation: <span className="validation">{selectedRow.bon_livraison?.TypeValidation ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Montant HT <span className="MontantHT">{selectedRow.ModeReg ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Date de Facture: <span className="dateFacture">{selectedRow.DateFacture ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Taux: <span className="Taux">{selectedRow.Taux ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>TVA: <span className="TVA">{selectedRow.TVA ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Montant TTC: <span className="MontantTTC">{selectedRow.MontantTTC ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Emetteur: <span className="reglement">{selectedRow.emetteur?.NomEmetteur ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Type de Contract: <span className="TypeContract">{selectedRow.TypeContrat ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Etablit Par: <span className="EtablitPar">{selectedRow.EtabliPar ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>PAYEE / IMPAYEE: <span className="EtatPayement">{selectedRow.EtaPayement ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Numéro de Remise: <span className="NumRemise">{selectedRow.remise?.NumRemise ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Numéro de Chèque: <span className="NumCheque">{selectedRow.cheque?.NumCheque ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Mode de Règlement: <span className="reglement">{selectedRow.ModeReg ?? 'null'}</span></p>
          </div>
          <div className="modal-item">
            <p>Montant encaisse: <span className="MontantEnc">{selectedRow.MontantEnc ?? 'null'} Dh</span></p>
          </div>
          <div className="modal-item">
            <p>Date Payement: <span className="MontantEnc">{selectedRow.DatePayement ?? 'null'}</span></p>
          </div>
        </div>

      </div>
    </div>
    );
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Nº de Facture</th>
            <th>Nº de Cheque</th>
            <th>Nº de Remise</th>           
            <th>Montant Encaisse</th>
            <th>Mode Règlement</th>
            <th>Date Payement</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {renderTableData()}
        </tbody>
      </table>
      {renderModal()}
      {renderDeleteConfirmationModal()}
    </div>
  );
};

export default Table;
