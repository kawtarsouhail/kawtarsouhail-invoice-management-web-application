import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from './router/auth';
import axios from './router/axiosInstance';
import '../css/Login.css'; 
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  // const submit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('/login', { 
  //       email,
  //       password,
  //     });

  //     if (response.status === 200) {
  //       const token = response.data.token;
  //       setToken(token); 
  //       navigate('/Visualiser');
  //     }
  //   }  catch (err) {
  //     if (err.response && err.response.status === 422 || err.response.status === 401) {
  //       setError('Email ou mot de passe incorrect.');
  //     } else {
  //       setError('Login failed due to server error');
  //     }
  //   }
  // }
  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', { 
        email,
        password,
      });
  
      if (response.status === 200) {
        const token = response.data.token;
        setToken(token); 
        navigate('/Visualiser');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 422 || err.response.status === 401) {
          setError('Email ou mot de passe incorrect.');
        } else {
          setError('Login failed due to server error');
        }
      } else {
        setError('Network error. Please try again later.');
        console.error('Error:', err.message); // Log the actual error message for debugging
      }
    }
  }
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <div className="Mycontainer Main-login">
      <div className="Mycolumn bg-image image"></div>
      <div className="Mycolumn">
        <div className='login'>
          <h3 className="display-4">Se connecter</h3>
          <p className="text-muted mb-4">Merci de remplir vos données</p>
          <form onSubmit={submit}>
            <div className="MyMyform-group mb-3">
              <input
                id="inputEmail"
                type="email"
                placeholder="Email address"
                required
                autoFocus
                className={`form-control rounded-pill border-0 shadow-sm px-4 ${error ? 'is-invalid' : ''}`}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="MyMyform-group mb-3">
              <input
                id="inputPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className={`form-control rounded-pill border-0 shadow-sm px-4 text-primary ${error ? 'is-invalid' : ''}`}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>
            <div className="Myform-group Myform-check mb-3">
              <input 
                id="AfficherMdp" 
                type="checkbox" 
                className="form-check-input" 
                onChange={toggleShowPassword}
              />
              <label htmlFor="AfficherMdp" className="form-check-label">Afficher le mot de passe</label>
            </div>
            <button type="submit" className="Mybtn">SIGN IN</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;