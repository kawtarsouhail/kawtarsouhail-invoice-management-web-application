import React, { useState, useEffect } from 'react';
import '../../css/GestionCompte.css'; 
import TableUsers from '../../Components/GestionComptes/TableUsers';
import Swal from 'sweetalert2';
import axios from '../router/axiosInstance';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 


const GestionCompte = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [TableVisible, setTableVisible] = useState(false);
  const [activeBoxId, setActiveBoxId] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [role, setRole] = useState('');
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  const [setError] = useState('');
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [emailError, setEmailError] = useState('');
  


  const fetchUsers = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get('http://localhost:8000/api/afficher');
        if (response.data) {
          setUsers(response.data.map(user => ({
              ...user.user,  // user information is expected under 'user' key
              roles: user.roles.join(", ")  // Since roles are now in array form, join them
          })));
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false); // End loading, success or error
      }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setPassword(newPass);
    if (!passwordRegex.test(newPass)) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(password)) {
      setPasswordError('Le mot de passe doit respecter les critères requis.');
      return;
    }
    if (password !== password_confirmation) {
      setPasswordError("Mots de passe différents !");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/register', { name, email, role, password, password_confirmation });
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Enregistré avec succès',
          text: 'L\'utilisateur a été créé avec succès!',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        // Réinitialiser les champs et les erreurs après un enregistrement réussi
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('');
        setEmailError('');
        setPasswordError('');
        fetchUsers();
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data.errors || {}; 
        if (errors.email) {
          setEmailError(errors.email[0]); //Assumer que l'erreur est renvoyée sous forme de tableau
        }
        // Traitez d'autres erreurs de champ ici
        Swal.fire({
          icon: 'error',
          title: 'Erreur Serveur',
          text: 'Un problème est survenu lors de l\'enregistrement.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      } else {
        setError('Échec de la connexion due à une erreur serveur');
        Swal.fire({
          icon: 'error',
          title: 'Erreur Serveur',
          text: 'Un problème est survenu lors de l\'enregistrement.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK'
        });
      }
    }
  };
  

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

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value)); // Convert the value to an integer
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or use a spinner/loading graphic
  }

  return (
    <div className="GestionCompte">
    <div className={`container ${formVisible ? "smaller" : ""}`}>
      <div className={`box add ${activeBoxId === 'create' ? 'active' : ''} ${activeBoxId !== null ? 'active-top' : ''}`} onClick={() => handleBoxClick('create')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="4em" viewBox="0 0 24 24"><path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 10h3m3 0h-3m0 0V7m0 3v3M1 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1m-7-8a4 4 0 1 0 0-8a4 4 0 0 0 0 8"></path></svg>           
          <div>Créer un utilisateur</div>
      </div>
      <div className={`box management ${activeBoxId === 'manage' ? 'active' : ''} ${activeBoxId !== null ? 'active-top' : ''}`} onClick={() => handleBoxClick('manage')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="4em" height="5em" viewBox="0 0 2048 2048"><path fill="white" d="M1148 1152q-83-62-179-95t-201-33q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-120 35-231t101-205t156-167t204-115q-56-35-100-82t-76-104t-47-119t-17-129q0-106 40-199t110-162T569 41T768 0t199 40t162 110t110 163t41 199q0 66-16 129t-48 119t-76 103t-101 83q60 23 113 54v152zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1664 768v768H1024v-768h256v-256h512v256zm-640 0h256v-128h-256zm512 384h-128v128h-128v-128h-256v128h-128v-128h-128v256h768zm0-256h-768v128h768z"></path></svg>  
          <div>Editer les comptes</div>
      </div>

    </div>
    
    {formVisible && (
      <form className="form form-add-user" onSubmit={handleSubmit}>
        <div className="form-add-row inputUpdate">
          <div className="form-group">
            <label htmlFor="nom">Nom Complet</label>
            <input
              id="nom"
              type="text"
              placeholder="Nom Complet"
              required
              value={name} 
              onChange={(e) => setName(e.target.value)}
            /></div>
            </div>
          <div className="form-add-row inputUpdate">
          <div className="form-group">
            <label htmlFor="email">Adresse Email</label>
            <input
              id="email"
              type="email"
              placeholder="Adresse Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>
          </div>
          <div className="form-add-row form-add-row-select inputUpdate">
          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select name="role" id="role" required value={role} onChange={handleRoleChange} className='selectrole'>
              <option disabled selected value="">[Choisir un rôle]</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Utilisateur">Utilisateur</option>
            </select>
          </div>
      </div>
        <div className="form-add-row inputUpdate">
          <div className="form-group">
            <label htmlFor="password1">Mot de passe</label>
            <input
              id="password1"
              type={showPassword1 ? "text" : "password"}
              placeholder="Mot de passe"
              required
              value={password}
              onChange={handlePasswordChange}
              title="Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule et un chiffre"
              className={passwordError ? 'input-error input-infos' : ''}
            />
            <span className="password-toggle-icon" onClick={() => setShowPassword1(!showPassword1)}>
              {showPassword1 ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="form-add-row inputUpdate">
          <div className="form-group password-input-container">
            <label htmlFor="password2">Confirmer le mot de passe</label>
            <input
              id="password2"
              type={showPassword2 ? "text" : "password"}
              placeholder="Confirmer le mot de passe"
              required
              value={password_confirmation}
              onChange={handleConfirmPasswordChange}
              className={passwordError ? 'input-error' : ''}
            />
            <span className="password-toggle-icon" onClick={() => setShowPassword2(!showPassword2)}>
              {showPassword2 ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
      <div className="form-add-row">
        <div className="form-group">
          { <div className=''>{passwordError}</div> && <div className='errorIdentical'>{passwordError}</div>}
        </div>
        </div>
      <button type="submit">Enregistrer</button>
      </form>

    )}

    {TableVisible && (
      <div>
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
        <TableUsers data={users} itemsPerPage={itemsPerPage} reloadData={fetchUsers} />
      </div>
    )}

  </div>
  );
}

export default GestionCompte;
