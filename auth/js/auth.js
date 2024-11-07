// Fungsi hashing password
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Check Login
function checkLogin() {
  const isLogin = sessionStorage.getItem('isLoggedIn');
  if (!isLogin) {
    window.location.href = 'auth/login.html';
  }
}

if (window.location.pathname.includes('dashboard.html')) {
  checkLogin();
}

// Registration
const regisForm = document.getElementById('regisForm');
if (regisForm) {
  regisForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('regisUsername').value;
    const password = document.getElementById('regisPassword').value;
    const regisSuccessToast = new bootstrap.Toast(document.getElementById('regisSuccessToast'));
    const regisFailedToast = new bootstrap.Toast(document.getElementById('regisFailedToast'));

    const storedUsername = localStorage.getItem('username');

    if (username === storedUsername) {
      regisFailedToast.show();
    } else if (username && password) {
      const hashedPassword = await hashPassword(password);
      localStorage.setItem('username', username);
      localStorage.setItem('password', hashedPassword);
      regisSuccessToast.show();
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    } else {
      alert('Masukkan Username dan Password!');
    }
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const loginSuccessToast = new bootstrap.Toast(document.getElementById('loginSuccessToast'));
    const loginFailedToast = new bootstrap.Toast(document.getElementById('loginFailedToast'));

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const hashedPassword = await hashPassword(password);

    if (username === storedUsername && hashedPassword === storedPassword) {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', username);
      loginSuccessToast.show();

      setTimeout(() => {
        window.location.href = '../dashboard.html';
      }, 1500);
    } else {
      loginFailedToast.show();
    }
  });
}

// Check Time
function getTimeOfDay() {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 11) {
    return 'Pagi';
  } else if (hours >= 11 && hours < 15) {
    return 'Siang';
  } else if (hours >= 15 && hours < 18) {
    return 'Sore';
  } else {
    return 'Malam';
  }
}

const username = sessionStorage.getItem('username');
const timeOfDay = getTimeOfDay();

const welcomeMessage = `Halo ${username} Selamat ${timeOfDay}`;
document.getElementById('welcomeMessage').textContent = welcomeMessage;

// Logout
function logout() {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('username');
  window.location.href = 'index.html';
}
