import React, { useState, useEffect } from 'react';
import axios from '../router/axiosInstance';
import '../../css/Table.css'; 
import Swal from 'sweetalert2';
import { getToken,deleteToken } from '../router/auth';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 


const TableUsers = ({ data: initialData, itemsPerPage, reloadData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [role,setRole] = useState('');
  const [data, setData] = useState(initialData);
  const [passwordError, setPasswordError] = useState('');
  const [error,setError] = useState(null); 
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [emailError, setEmailError] = useState('');
    
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();

        if (token) {
          const response = await axios.get('http://localhost:8000/api/user', {
          });
          setUser(response.data.user.id);
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    password_confirmation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    handleChange(e)
  };

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

const handleUpdateUser = async (e) => {
  e.preventDefault();

  // Check if passwords match and meet criteria
  if (password !== password_confirmation) {
    setPasswordError("Les mots de passe ne correspondent pas !");
    return;
  } 

  setPasswordError(''); 

  try {
    const updatedData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };
    
    const response = await axios.put(`http://localhost:8000/api/modifier/${selectedRow.id}`, updatedData);

    if (response.data) {
      reloadData();
      handleCloseModal();

      if (selectedRow.id !== user) {
        Swal.fire({
          icon: 'success',
          title: 'Mis à jour!',
          text: `Le compte de ${updatedData.name} a été mis à jour avec succès.`,
          confirmButtonColor: '#3085d6',
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Mis à jour!',
          text: `Le compte de ${updatedData.name} a été mis à jour avec succès. Merci de vous reconnecter.`,
          confirmButtonColor: '#3085d6',
        });
        handleLogout();
      }
    }
  }catch (err) {
    if (err.response && err.response.data) {
      if (err.response.data.errors.email) {
        setEmailError(err.response.data.errors.email[0]); 
      }
      Swal.fire({
        icon: 'error',
        title: 'Erreur Serveur',
        text: 'Un problème est survenu lors de la modification.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    } else {
      setError('Échec de la connexion due à une erreur serveur');
      Swal.fire({
        icon: 'error',
        title: 'Erreur Serveur',
        text: 'Un problème est survenu lors de  la modification.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    }
  }
};

const handlePasswordChange = (e) => {
  const newPass = e.target.value;
  setPassword(newPass);
    handleChange(e)
  if (!passwordRegex.test(newPass)) {
    setPasswordError('Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.');
  } else {
    setPasswordError('');
  }

};

  const handleShowModal = (rowData) => {
    setSelectedRow(rowData);
    setFormData({
      name: rowData.name,
      email: rowData.email,
      role: rowData.roles,
      password: '',
      password_confirmation: ''
    });
    console.log(formData);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setPasswordError(''); 
  };


  const handleDeleteRow = async () => {
    if (!rowToDelete) return;

    try {
      const ItemId=rowToDelete.id;
      const response = await axios.delete(`http://localhost:8000/api/supprimer/${ItemId}`);

      if (response.status !== 200) {
        throw new Error('Failed to delete the user');
      }

      reloadData();
      setData(data.filter(item => item.id !== rowToDelete.id));
      setRowToDelete(null);

      Swal.fire({
        icon: 'success',
        title: 'Supprimé!',
        text: `Le compte ${rowToDelete.name} a été supprimé avec succès.`,
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleShowDeleteModal = (item) => {
    setRowToDelete(item);
  };  
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
     handleChange(e) 
  };
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const renderDeleteConfirmationModal = () => {
    if (!rowToDelete) return null;

    return (
      <div className="modal-delete">
        <div className="modal-content">
          <span className="close" onClick={() => setRowToDelete(null)}>&times;</span>
          <h2>Confirmation de suppression</h2>
          <p>Voulez-vous vraiment supprimer ce compte {rowToDelete.name}?</p>
          <div className='btns' style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className='btn-delete' onClick={handleDeleteRow} style={{ marginRight: '10px'}}>Supprimer</button>
            <button onClick={() => setRowToDelete(null)}>Annuler</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex).map((item, index) => (
      <tr key={startIndex + index}>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.roles}</td>
        <td>***********</td>
        <td>
          <div className='actions'>
            <span className="tooltip">
              <svg onClick={() => handleShowModal(item)} xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#78c2ff" d="m21.561 5.318l-2.879-2.879A1.495 1.495 0 0 0 17.621 2c-.385 0-.768.146-1.061.439L13 6H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-9l3.561-3.561c.293-.293.439-.677.439-1.061s-.146-.767-.439-1.06M11.5 14.672L9.328 12.5l6.293-6.293l2.172 2.172zm-2.561-1.339l1.756 1.728L9 15zM16 19H5V8h6l-3.18 3.18c-.293.293-.478.812-.629 1.289c-.16.5-.191 1.056-.191 1.47V17h3.061c.414 0 1.108-.1 1.571-.29c.464-.19.896-.347 1.188-.64L16 13zm2.5-11.328L16.328 5.5l1.293-1.293l2.171 2.172z"></path></svg>
              <span className="tooltiptext">Modifier</span>
            </span>
            <span className="tooltip">
              <svg onClick={() => handleShowDeleteModal(item)}  xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><path fill="#00a6ed" d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m5 5h-2.5l-1-1h-3l-1 1H7v2h10zM9 18h6a1 1 0 0 0 1-1v-7H8v7a1 1 0 0 0 1 1"></path></svg>
              <span className="tooltiptext">Supprimer</span>
            </span>
          </div>
        </td>
      </tr>
    ));
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
    console.log(formData);
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={handleCloseModal}>&times;</span>
          <h3>Mettre à jour les informations :</h3>
          <form onSubmit={handleUpdateUser}>
            <div className='modal-items'>
              <div className="modal-item">
                <label>Nom Complet :</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-item">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
               {emailError && <div className="error-message">{emailError}</div>}
              </div>
              <div className="modal-item">
              <label>Mot de passe:</label>
              <div className="password-input-container">
                <input
                  type={showPassword1 ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                  title="Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule et un chiffre"
                  className={passwordError ? 'input-error input-infos' : ''}
                />
                <span className="password-toggle-iconUpdate" onClick={() => setShowPassword1(!showPassword1)}>
                  {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="modal-item">
              <label>Confirmer Mot de passe:</label>
              <div className="password-input-container">
                <input
                  type={showPassword2 ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={passwordError ? 'input-error' : ''}
                />
                <span className="password-toggle-iconUpdate" onClick={() => setShowPassword2(!showPassword2)}>
                  {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && <div style={{ color: 'red', marginTop: '5px' }}>{passwordError}</div>}
            </div>

              <div className="modal-item">
                <label htmlFor="role">Rôle:</label>
                <select name="role" id="role" required value={formData.role}  onChange={handleRoleChange} className='selectrole'>
                  <option value="" disabled selected>Choose a role</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Utilisateur">Utilisateur</option>
                </select>
              </div>
            </div>
            <button type="submit">Enregistrer</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Nom</th>
            <th>Adresse Email</th>
            <th>Rôle</th>
            <th>Mot de passe</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {renderTableData()}
        </tbody>
      </table>
      {renderPagination()}
      {renderModal()}
      {renderDeleteConfirmationModal()}
    </div>
  );
};

export default TableUsers;
