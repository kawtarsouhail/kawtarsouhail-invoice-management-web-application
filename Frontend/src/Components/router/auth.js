export function setToken(token) {
  sessionStorage.setItem('token', token);  // Stockage du token dans sessionStorage
}

export function getToken() {
  return sessionStorage.getItem('token') || '';  // Récupération du token de sessionStorage
}

export function deleteToken() {
  sessionStorage.removeItem('token');  // Suppression du token de sessionStorage
}

