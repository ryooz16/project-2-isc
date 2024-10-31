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

    const storedUsername = localStorage.getItem('username');

    if (username === storedUsername) {
      alert(`Username ${username} telah digunakan / dibuat, silahkan gunakan username lain`);
    } else if (username && password) {
      const hashedPassword = await hashPassword(password); // Hashing password
      localStorage.setItem('username', username);
      localStorage.setItem('password', hashedPassword);
      alert('Registrasi Berhasil!');
      window.location.href = 'login.html';
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

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const hashedPassword = await hashPassword(password); // Hashing password input untuk dicocokkan

    if (username === storedUsername && hashedPassword === storedPassword) {
      alert('Login Sukses!');
      sessionStorage.setItem('isLoggedIn', 'true');
      window.location.href = '../dashboard.html';
    } else {
      alert('Username atau Password yang anda masukkan salah!');
    }
  });
}

// Logout
function logout() {
  sessionStorage.removeItem('isLoggedIn');
  window.location.href = 'index.html';
}
