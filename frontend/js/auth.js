const API = 'http://127.0.0.1:5000/api';

async function handleLogin() {
  const identifier = document.getElementById('identifier').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!identifier || !password) {
    document.getElementById('loginError').textContent = 'Please fill in all fields';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();
    console.log('Login response:', data);

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      localStorage.setItem('bloodGroup', data.blood_group || '');

      if (data.role === 'donor')     window.location.href = 'donor-dashboard.html';
      else if (data.role === 'hospital')  window.location.href = 'hospital-dashboard.html';
      else if (data.role === 'bloodbank') window.location.href = 'bloodbank-dashboard.html';
    } else {
      document.getElementById('loginError').textContent = data.error || 'Login failed';
    }
  } catch (err) {
    console.error('Login error:', err);
    document.getElementById('loginError').textContent = 'Cannot connect to server. Is Flask running?';
  }
}

async function handleRegister() {
  const hasHIV  = document.getElementById('chkHIV').checked;
  const hasAIDS = document.getElementById('chkAIDS').checked;

  if (hasHIV || hasAIDS) {
    document.getElementById('regError').textContent = '⚠️ Sorry, donors with HIV or AIDS cannot register.';
    return;
  }

  const age = parseInt(document.getElementById('regAge').value);
  if (age < 18 || age > 65) {
    document.getElementById('regError').textContent = '⚠️ Donors must be between 18 and 65 years old.';
    return;
  }

  const body = {
    name:        document.getElementById('regName').value.trim(),
    phone:       document.getElementById('regPhone').value.trim(),
    email:       document.getElementById('regEmail').value.trim(),
    password:    document.getElementById('regPassword').value,
    blood_group: document.getElementById('regBlood').value,
    age,
    campus:      document.getElementById('regCampus').value.trim(),
    role:        'donor',
    has_hiv:     hasHIV,
    has_aids:    hasAIDS
  };

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log('Register response:', data);

    if (res.ok) {
      alert('✅ Registered successfully! Please login.');
      window.location.href = 'login.html';
    } else {
      document.getElementById('regError').textContent = data.error || 'Registration failed';
    }
  } catch (err) {
    console.error('Register error:', err);
    document.getElementById('regError').textContent = 'Cannot connect to server. Is Flask running?';
  }
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}