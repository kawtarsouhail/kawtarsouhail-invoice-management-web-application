import React, { useState, useEffect } from 'react';
import '../../css/Table.css';
import axios from '../router/axiosInstance';
import Swal from 'sweetalert2';
import { getToken } from '../router/auth';

const TableReliquat = ({ data: initialData, reloadData, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [userCanDelete, setUserCanDelete] = useState(true);
  const [data, setData] = useState(initialData.data || []);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);


  
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





  useEffect(() => {
    if (initialData && Array.isArray(initialData.data)) {
      setData(initialData.data);
    } else {
      console.error('Initial Data is invalid or not an array:', initialData);
      setData([]); 
    }
  }, [initialData]);


  const [formData, setFormData] = useState({
    dateReliquat: '',
    ModeReg: '',
    MontantEnc: '',
    NumRemise: ' ',
    NumCheque: '',
    NumFacture: '',
   // AutreModeReg: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleShowModal = (rowData) => {
    setSelectedRow(rowData);
    setFormData({
      dateReliquat: rowData.dateReliquat,
      ModeReg: rowData.ModeReg,
      MontantEnc: rowData.MontantEnc,
      NumRemise: rowData.remise && rowData.remise.NumRemise ? rowData.remise.NumRemise:'null',
      NumCheque: rowData.cheque && rowData.cheque.NumCheque ? rowData.cheque.NumCheque:'null',
      NumFacture: rowData.facture.NumFacture,
    });
  };

const handleUpdateReliquat = async (e) => {
  e.preventDefault();
  //const modeRegFinal = formData.ModeReg === 'AUTRE' ? formData.AutreModeReg : formData.ModeReg;
  try {
    const updatedData = {
      dateReliquat: formData.dateReliquat,
      ModeReg:formData.ModeReg,
      MontantEnc: formData.MontantEnc,
      NumRemise: formData.NumRemise,
      NumCheque: formData.NumCheque,
      NumFacture: formData.NumFacture,
    };

    const response = await axios.put(`http://localhost:8000/api/reliquats/${selectedRow.id}`, updatedData);

    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Mis à jour!',
        text: `Les données de reliquat ont été mises à jour avec succès.`,
        confirmButtonColor: '#3085d6',
      });
      reloadData();
      handleCloseModal();
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur de mise à jour!',
      text: error.response.data.message || 'Une erreur s\'est produite.',
      confirmButtonColor: '#3085d6',
    });
  }
};


  const handleChangePage = (page) => {
    setCurrentPage(page);
  };


  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  const handleDeleteRow = async () => {
    if (!rowToDelete) {
      console.error('No row selected for deletion');
      return;
    }

    const apiUrl = `http://localhost:8000/api/deleteReliquat/${rowToDelete.id}`;
    try {
      const response = await axios.delete(apiUrl);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Delete successful:', response);
      setData(data.filter(item => item.id !== rowToDelete.id));

      Swal.fire({
        icon: 'success',
        title: 'Supprimé !',
        text: ' a été supprimé.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });

      setRowToDelete(null);
    } catch (error) {
      console.error('Failed to delete the row:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to delete the record.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

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
        <p>Voulez-vous vraiment supprimer cette facture {rowToDelete.NumFacture}?</p>
        <div className='btns' style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className='btn-delete' onClick={handleDeleteRow} style={{ marginRight: '10px' }}>Supprimer</button>
          <button onClick={() => setRowToDelete(null)}>Annuler</button>
        </div>
      </div>
    </div>
  );
};

const renderPagination = () => {
  const pages = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <li className={`page-item ${currentPage === i ? 'active' : ''}`} key={i}>
        <button className="page-link" onClick={() => handleChangePage(i)}>{i}</button>
      </li>
    );
  }

  const previousButton = (
    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
      <button className="page-link" onClick={() => handleChangePage(currentPage - 1)}>Previous</button>
    </li>
  );

  const nextButton = (
    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
      <button className="page-link" onClick={() => handleChangePage(currentPage + 1)}>Next</button>
    </li>
  );

  return (
    <nav>
      <ul className="pagination">
        {previousButton}
        {pages}
        {nextButton}
      </ul>
    </nav>
  );
};

const renderModal = () => {
  if (!selectedRow) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <h3>Mettre à jour les informations :</h3>
        <form onSubmit={handleUpdateReliquat}>
          <div className='modal-items'>
            <div className="modal-item reliquatUpdate">
              <label>Num de Facture :</label>
              <input
                type="text"
                name="NumFacture"
                value={formData.NumFacture}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-item reliquatUpdate">
            <label>Mode de Règlement :</label>
          {/* {formData.ModeReg === 'AUTRE' ? (
            <input
              type="text"
              name="AutreModeReg"
              placeholder="Veuillez entrer le mode de règlement"
              value={formData.AutreModeReg}
              onChange={handleChange}
              required
            />
          ) : ( )} */}
          <select
            name="ModeReg"
            value={formData.ModeReg}
            onChange={handleChange}
            required
            className='selectrole'
          >
            <option value="" disabled>[MODE DE RÈGLEMENT]</option>
            <option value="ESPÈCE">ESPÈCE</option>
            <option value="CHÈQUE">CHÈQUE</option>
            <option value="VIREMENT">VIREMENT</option>
            <option value="VIREMENT ESPECE">VIREEMENT ESPÈCE</option>
            <option value="PAR EFFET">PAR EFFET</option>
          </select>
       
          
          </div>
          <div className="modal-item reliquatUpdate" style={{ display: (formData.ModeReg === 'CHÈQUE') ? 'block' : 'none' }}>
          <label>Numéro de Remise:</label>
          {formData.ModeReg === 'CHÈQUE' && (
            <input
              type="text"
              name="NumRemise"
              value={formData.NumRemise}
              onChange={handleChange}
              required
            />
          )}
        </div>
        <div className="modal-item reliquatUpdate" style={{ display: (formData.ModeReg === 'CHÈQUE') ? 'block' : 'none' }}>
            <label>Numéro de Chèque:</label>
            <input
              type="text"
              name="NumCheque"
              value={formData.NumCheque}
              onChange={handleChange}
              required
            />
          </div>
        <div className="modal-item reliquatUpdate">
              <label>Montant Encaissé :</label>
              <input
                type="text"
                name="MontantEnc"
                value={formData.MontantEnc}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-item reliquatUpdate">
              <label>Date de Reliquat :</label>
              <input
                type="date"
                name="dateReliquat"
                value={formData.dateReliquat}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button style={{ marginLeft: 'auto' }} type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

    const renderTableData = () => {
      console.log('Data:', data);
      console.log('Data Length:', data.length);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      if (!Array.isArray(data) || data.length === 0) {
          return <tr><td colSpan="6"><center>Cette facture n'a pas de reliquat.</center></td></tr>;
      }

      return data.map((row, index) => {
          console.log(`Rendering row ${index}:`, row);
          return (
              <tr key={row.id}>
                  <td>{row.facture.NumFacture}</td>
                  <td>{row.remise && row.remise.NumRemise ? row.remise.NumRemise : 'null'}</td>
                  <td>{row.cheque && row.cheque.NumCheque ? row.cheque.NumCheque : 'null'}</td>
                  <td>{row.MontantEnc}</td>
                  <td>{row.ModeReg}</td>
                  <td>{row.dateReliquat}</td>
                  {userCanDelete && (
                  <td>
                    <div className='actions'>
                        <span className="tooltip">
                            <svg onClick={() => handleShowModal(row)} xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="#78c2ff" d="m21.561 5.318l-2.879-2.879A1.495 1.495 0 0 0 17.621 2c-.385 0-.768.146-1.061.439L13 6H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-9l3.561-3.561c.293-.293.439-.677.439-1.061s-.146-.767-.439-1.06M11.5 14.672L9.328 12.5l6.293-6.293l2.172 2.172zm-2.561-1.339l1.756 1.728L9 15zM16 19H5V8h6l-3.18 3.18c-.293.293-.478.812-.629 1.289c-.16.5-.191 1.056-.191 1.47V17h3.061c.414 0 1.108-.1 1.571-.29c.464-.19.896-.347 1.188-.64L16 13zm2.5-11.328L16.328 5.5l1.293-1.293l2.171 2.172z"></path></svg>
                            <span className="tooltiptext">Modifier</span>
                        </span>
                      
                            <span className="tooltip">
                                <svg onClick={() => handleShowDeleteModal(row)} xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><path fill="#00a6ed" d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m5 5h-2.5l-1-1h-3l-1 1H7v2h10zM9 18h6a1 1 0 0 0 1-1v-7H8v7a1 1 0 0 0 1 1"></path></svg>
                                <span className="tooltiptext">Supprimer</span>
                            </span>
                        
                    </div>
                </td>
                )}
            </tr>
        )
        });
    };

      return (
        <div className="table-container">
          <table className="table TableauReliquat">
            <thead className="thead-dark">
              <tr>
                <th>Nº de Facture</th>
                <th>Nº de Remise</th>
                <th>Nº de Cheque</th>
                <th>Montant Encaisse</th>
                <th>Mode Regelement</th>
                <th>Date de reliquat</th>
                {userCanDelete && ( <th>Action</th> )}
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

    export default TableReliquat;