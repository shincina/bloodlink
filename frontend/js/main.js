const API = 'http://localhost:5000/api';

function openRequestModal() {
  document.getElementById('requestModal').classList.remove('hidden');
}
function closeRequestModal() {
  document.getElementById('requestModal').classList.add('hidden');
}

async function submitRequest() {
  const token = localStorage.getItem('token');
  if (!token) { alert('Please login as a hospital first'); window.location.href = 'login.html'; return; }
  
  const body = {
    patient_name: document.getElementById('patientName').value,
    age: document.getElementById('patientAge').value,
    gender: document.getElementById('patientGender').value,
    blood_group: document.getElementById('bloodGroup').value,
    hospital: document.getElementById('hospitalName').value,
    priority: document.getElementById('priority').value,
    units_needed: document.getElementById('unitsNeeded').value,
    latitude: 10.5, longitude: 76.2
  };

  const res = await fetch(`${API}/hospital/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (res.ok) {
    closeRequestModal();
    await showMatchedDonors(data.id, body.blood_group);
  } else {
    alert(data.error || 'Failed to submit request');
  }
}

async function showMatchedDonors(requestId, bloodGroup) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}/hospital/match/${requestId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const donors = await res.json();
  const container = document.getElementById('donorsList');
  const section = document.getElementById('matchedDonors');
  section.classList.remove('hidden');
  
  if (!donors.length) { container.innerHTML = '<p>No matching donors found nearby.</p>'; return; }
  container.innerHTML = donors.map(d => `
    <div class="donor-match-card">
      <div>
        <strong>${d.name}</strong> ${d.is_verified ? '<span style="color:#e74c3c">✅</span>' : ''}
        <div style="color:#666;font-size:0.9rem">🩸 ${d.blood_group} | 📍 ${d.campus} | Last donated: ${d.last_donated}</div>
      </div>
      <div>
        <a href="tel:${d.phone}" class="btn-secondary" style="text-decoration:none;padding:8px 15px;font-size:0.9rem">📞 ${d.phone}</a>
      </div>
    </div>`).join('');
}