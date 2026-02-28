const API = 'http://127.0.0.1:5000/api';
const token = localStorage.getItem('token');
if (!token) window.location.href = 'login.html';

document.getElementById('donorName').textContent = '👤 ' + (localStorage.getItem('name') || 'Donor');

function showSection(name) {
  document.querySelectorAll('[id^="section-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById('section-' + name).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (name === 'history') loadHistory();
  if (name === 'requests') loadNotifications();
  if (name === 'rewards') loadRewards();
}

async function loadDashboard() {
  // Sample requests - no API call needed for demo
  const sampleRequests = [
    { blood_group: 'O+', patient_name: 'Rajan Kumar', hospital: 'KIMS Hospital, Trivandrum', priority: 'critical', units_needed: 2 },
    { blood_group: 'B-', patient_name: 'Meera Nair',  hospital: 'Amrita Hospital, Kochi',    priority: 'urgent',   units_needed: 1 },
    { blood_group: 'A+', patient_name: 'Suresh Pillai',hospital: 'Medical College, Kozhikode',priority: 'needed',  units_needed: 3 },
  ];

  const container = document.getElementById('donationRequests');
  container.innerHTML = sampleRequests.map(r => `
    <div class="blood-request-card priority-${r.priority}">
      <div>
        <span class="blood-group-badge">${r.blood_group}</span>
        <strong style="margin-left:10px">${r.patient_name}</strong>
        <div style="color:#666;font-size:0.9rem;margin-top:5px">🏥 ${r.hospital} | ${r.units_needed} unit(s)</div>
        <div style="font-size:0.8rem;color:#888">Priority: ${r.priority.toUpperCase()}</div>
      </div>
      <button onclick="startDonate('${r.patient_name}')" class="btn-primary">💉 Donate</button>
    </div>
  `).join('');

  // Emergency banner
  const critical = sampleRequests.filter(r => r.priority === 'critical');
  if (critical.length > 0) {
    document.getElementById('emergencyBanner').classList.remove('hidden');
    document.getElementById('emergencyText').textContent =
      critical.map(r => `${r.blood_group} needed at ${r.hospital}`).join(' | ');
  }

  initMap();
}

function startDonate(patientName) {
  localStorage.setItem('pendingPatient', patientName);
  window.location.href = 'eligibility-test.html';
}

function initMap() {
  const map = L.map('map').setView([10.5276, 76.2144], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  const patients = [
    { lat: 8.5241, lng: 76.9366, name: 'Rajan Kumar', blood: 'O+', hospital: 'KIMS Trivandrum', priority: 'critical' },
    { lat: 9.9312, lng: 76.2673, name: 'Meera Nair', blood: 'B-', hospital: 'Amrita Kochi', priority: 'urgent' },
    { lat: 11.2588, lng: 75.7804, name: 'Suresh Pillai', blood: 'A+', hospital: 'MCH Kozhikode', priority: 'needed' },
  ];
  patients.forEach(p => {
    const color = p.priority === 'critical' ? '#e74c3c' : p.priority === 'urgent' ? '#e67e22' : '#f1c40f';
    const icon = L.divIcon({ html: `<div style="background:${color};color:white;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:bold;white-space:nowrap">🩸 ${p.blood}</div>`, iconSize: [60, 25] });
    L.marker([p.lat, p.lng], { icon }).addTo(map)
      .bindPopup(`<b>${p.name}</b><br>🏥 ${p.hospital}<br>🩸 ${p.blood}<br>Priority: ${p.priority.toUpperCase()}`);
  });
}

async function loadHistory() {
  const res = await fetch(`${API}/donor/history`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  const el = document.getElementById('historyList');
  if (!data.length) { el.innerHTML = '<p style="color:#888">No donations yet. Be the first to donate! 🩸</p>'; return; }
  el.innerHTML = data.map(d => `
    <div class="blood-request-card">
      <div>Donation #${d.id} — ${new Date(d.donated_at).toLocaleDateString()}</div>
      <span style="color:${d.confirmed ? '#27ae60' : '#e67e22'}">${d.confirmed ? '✅ Confirmed' : '⏳ Pending'}</span>
    </div>`).join('');
}

async function loadNotifications() {
  const res = await fetch(`${API}/donor/notifications`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  const el = document.getElementById('notificationsList');
  if (!data.length) { el.innerHTML = '<p style="color:#888">No requests yet.</p>'; return; }
  el.innerHTML = data.map(n => `
    <div class="blood-request-card" style="${!n.read ? 'border-left-color:#e74c3c;background:#fff5f5' : ''}">
      <div>${n.message}</div>
      <small style="color:#888">${new Date(n.time).toLocaleString()}</small>
    </div>`).join('');
}

async function loadRewards() {
    
  const res = await fetch(`${API}/rewards/my-rewards`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  const pct = Math.min((data.points / 2000) * 100, 100);
  document.getElementById('donorPoints').textContent = `${data.points} Points`;
  document.getElementById('pointsDisplay').textContent = `${data.points} / 2000 pts`;
  document.getElementById('pointsFill').style.width = pct + '%';

  // BADGES
  const badges = [
    { threshold: 1,  emoji: '🩸', name: 'First Drop Hero' },
    { threshold: 5,  emoji: '💉', name: 'Life Saver' },
    { threshold: 10, emoji: '🏅', name: 'Blood Champion' },
    { threshold: 25, emoji: '🥇', name: 'Gold Donor' },
    { threshold: 50, emoji: '👑', name: 'Platinum Donor' },
  ];
  document.getElementById('badgesGrid').innerHTML = badges.map(b => {
    const earned = data.donations >= b.threshold;
    return `
      <div style="
        background:${earned ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : '#eee'};
        color:${earned ? 'white' : '#aaa'};
        border-radius:12px; padding:15px; text-align:center;
        box-shadow:${earned ? '0 4px 15px rgba(192,57,43,0.3)' : 'none'};
      ">
        <div style="font-size:2rem">${b.emoji}</div>
        <div style="font-weight:bold;font-size:0.85rem;margin-top:6px">${b.name}</div>
        <div style="font-size:0.75rem;margin-top:4px;opacity:0.85">${b.threshold} donation${b.threshold > 1 ? 's' : ''}</div>
        <div style="font-size:0.75rem;margin-top:6px">${earned ? '✅ Earned' : '🔒 Locked'}</div>
      </div>`;
  }).join('');

  // CATALOGUE
  const catalogue = [
    {
      tier: '🥉 Beginner Rewards',
      range: '10 – 100 points',
      color: '#cd7f32',
      items: [
        { name: 'Lays Packet',   emoji: '🍟', pts: 10 },
        { name: 'Slice Juice',   emoji: '🧃', pts: 10 },
        { name: 'Pen',           emoji: '✏️',  pts: 10 },
        { name: 'Book',          emoji: '📖', pts: 20 },
        { name: 'Keychain',      emoji: '🔑', pts: 40 },
        { name: 'Water Bottle',  emoji: '💧', pts: 50 },
        { name: 'T-Shirt',       emoji: '👕', pts: 100 },
      ]
    },
    {
      tier: '🥈 Intermediate Rewards',
      range: '150 – 500 points',
      color: '#95a5a6',
      items: [
        { name: 'Hoodie',             emoji: '🧥', pts: 200 },
        { name: 'Backpack',           emoji: '🎒', pts: 300 },
        { name: 'Power Bank',         emoji: '🔋', pts: 400 },
        { name: 'Smart Watch (Basic)',emoji: '⌚', pts: 500 },
      ]
    },
    {
      tier: '🥇 Advanced Rewards',
      range: '600 – 1000 points',
      color: '#f39c12',
      items: [
        { name: 'Bluetooth Headphones', emoji: '🎧', pts: 700 },
        { name: 'Tablet',               emoji: '📱', pts: 900 },
        { name: 'Bicycle',              emoji: '🚲', pts: 1000 },
      ]
    },
    {
      tier: '👑 Lifetime Achievement',
      range: '1500 – 2000 points',
      color: '#8e44ad',
      items: [
        { name: 'Laptop',                              emoji: '💻', pts: 1500 },
        { name: 'International Trip (Partial)',         emoji: '✈️',  pts: 1800 },
        { name: 'Platinum Award + Gold Medal',          emoji: '🏆', pts: 2000 },
      ]
    },
  ];

  document.getElementById('rewardsCatalogue').innerHTML = catalogue.map(cat => `
    <div style="margin-bottom:30px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <h3 style="color:${cat.color}">${cat.tier}</h3>
        <span style="color:#888;font-size:0.85rem">(${cat.range})</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px">
        ${cat.items.map(item => {
          const canClaim = data.points >= item.pts;
          return `
            <div style="
              background:white; border-radius:12px; padding:14px 10px;
              text-align:center; box-shadow:0 2px 10px rgba(0,0,0,0.08);
              border:2px solid ${canClaim ? cat.color : '#eee'};
              opacity:${canClaim ? 1 : 0.6};
              transition:transform 0.2s;
            " onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
              <div style="font-size:2rem">${item.emoji}</div>
              <div style="font-weight:600;font-size:0.85rem;margin-top:8px;color:#333">${item.name}</div>
              <div style="color:${cat.color};font-weight:bold;font-size:0.9rem;margin:6px 0">${item.pts} pts</div>
              <button onclick="claimReward('${item.name}', ${item.pts})"
                style="
                  background:${canClaim ? cat.color : '#ccc'};
                  color:white; border:none; padding:5px 14px;
                  border-radius:20px; font-size:0.78rem; cursor:${canClaim ? 'pointer' : 'not-allowed'};
                  width:100%; margin-top:4px;
                "
                ${canClaim ? '' : 'disabled'}>
                ${canClaim ? 'Claim' : 'Locked'}
              </button>
            </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}
function loadBloodInfo() {
  const donorBloodGroup = localStorage.getItem('bloodGroup') || 'O+'; // saved at login

  const bloodData = {
    'A+':  { canDonateTo: ['A+', 'AB+'],                      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'], color: '#e74c3c' },
    'A-':  { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],         canReceiveFrom: ['A-', 'O-'],              color: '#c0392b' },
    'B+':  { canDonateTo: ['B+', 'AB+'],                      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'], color: '#e67e22' },
    'B-':  { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],         canReceiveFrom: ['B-', 'O-'],              color: '#d35400' },
    'AB+': { canDonateTo: ['AB+'],                             canReceiveFrom: ['A+','A-','B+','B-','AB+','AB-','O+','O-'], color: '#8e44ad' },
    'AB-': { canDonateTo: ['AB+', 'AB-'],                     canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'], color: '#6c3483' },
    'O+':  { canDonateTo: ['A+', 'B+', 'AB+', 'O+'],          canReceiveFrom: ['O+', 'O-'],              color: '#27ae60' },
    'O-':  { canDonateTo: ['A+','A-','B+','B-','AB+','AB-','O+','O-'], canReceiveFrom: ['O-'],           color: '#1e8449' },
  };

  const facts = {
    'A+':  '2nd most common blood type. Found in about 35% of people. Great demand in hospitals.',
    'A-':  'Rare and valuable. Can donate red cells to all A and AB types.',
    'B+':  'Common in South Asian populations including Kerala. High hospital demand.',
    'B-':  'Only 2% of people have B-. Extremely valuable for emergencies.',
    'AB+': 'Universal recipient! Can receive from anyone. Plasma donation helps all patients.',
    'AB-': 'Rarest blood type (~1% population). Universal plasma donor.',
    'O+':  'Most common blood type worldwide. Most donated and most needed.',
    'O-':  'Universal donor for red cells. First choice in emergencies when type is unknown.',
  };

  const eligibility = [
    { icon: '🎂', label: 'Age',          note: 'Must be between 18 and 65 years old' },
    { icon: '⚖️',  label: 'Weight',       note: 'Minimum 50 kg body weight required' },
    { icon: '❤️',  label: 'Hemoglobin',   note: 'Min 12.5 g/dL for women, 13 g/dL for men' },
    { icon: '🩺',  label: 'Blood Pressure',note: 'Must be within normal range (80–120 / 60–80 mmHg)' },
    { icon: '🌡️', label: 'Temperature',   note: 'Normal body temperature required (below 37.5°C)' },
    { icon: '🚫',  label: 'Alcohol',       note: 'No alcohol consumption within 48 hours before donation' },
    { icon: '💊',  label: 'Medication',    note: 'Inform staff about any current medication' },
    { icon: '🩸',  label: 'Last Donation', note: 'Minimum 90 days gap between whole blood donations' },
    { icon: '🤒',  label: 'Illness',       note: 'Must be free from cold, fever or infection on donation day' },
    { icon: '🤰',  label: 'Pregnancy',     note: 'Cannot donate during pregnancy or within 6 months of delivery' },
    { icon: '💉',  label: 'Tattoo/Piercing',note: 'Wait at least 6 months after getting a tattoo or piercing' },
    { icon: '🦠',  label: 'Infections',    note: 'Must not have HIV, Hepatitis B/C, Syphilis or Malaria' },
  ];

  const myData = bloodData[donorBloodGroup];

  document.getElementById('bloodInfoContent').innerHTML = `

    <!-- MY BLOOD GROUP CARD -->
    <div style="background:linear-gradient(135deg,${myData.color},#c0392b);color:white;border-radius:16px;padding:25px;margin-bottom:25px;box-shadow:0 6px 20px rgba(0,0,0,0.15)">
      <div style="display:flex;align-items:center;gap:15px;margin-bottom:15px">
        <div style="font-size:3rem;background:rgba(255,255,255,0.2);padding:12px 20px;border-radius:12px;font-weight:900">${donorBloodGroup}</div>
        <div>
          <div style="font-size:1.3rem;font-weight:bold">Your Blood Group</div>
          <div style="opacity:0.85;font-size:0.95rem;margin-top:4px">${facts[donorBloodGroup]}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:10px">
        <div style="background:rgba(255,255,255,0.15);border-radius:10px;padding:12px">
          <div style="font-weight:bold;margin-bottom:8px">✅ You Can Donate To</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${myData.canDonateTo.map(bg => `<span style="background:rgba(255,255,255,0.25);padding:4px 12px;border-radius:20px;font-weight:bold;font-size:0.9rem">${bg}</span>`).join('')}
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.15);border-radius:10px;padding:12px">
          <div style="font-weight:bold;margin-bottom:8px">💉 You Can Receive From</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px">
            ${myData.canReceiveFrom.map(bg => `<span style="background:rgba(255,255,255,0.25);padding:4px 12px;border-radius:20px;font-weight:bold;font-size:0.9rem">${bg}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- ALL BLOOD GROUPS TICKER / PLUCK CARDS -->
    <h3 style="margin-bottom:15px;color:#333">🩸 All Blood Groups — Compatibility</h3>
    <div style="overflow:hidden;margin-bottom:30px">
      <div id="ticker" style="display:flex;gap:15px;animation:scrollTicker 30s linear infinite;width:max-content">
        ${Object.entries(bloodData).map(([bg, d]) => `
          <div style="
            background:white;border-left:5px solid ${d.color};
            border-radius:12px;padding:15px 18px;min-width:200px;
            box-shadow:0 3px 12px rgba(0,0,0,0.08);flex-shrink:0;
          ">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <span style="background:${d.color};color:white;padding:4px 12px;border-radius:20px;font-weight:900;font-size:1.1rem">${bg}</span>
              ${bg === donorBloodGroup ? '<span style="background:#fff3cd;color:#856404;padding:3px 8px;border-radius:10px;font-size:0.75rem;font-weight:bold">YOU</span>' : ''}
            </div>
            <div style="font-size:0.8rem;color:#555;margin-bottom:4px"><strong>Donates to:</strong> ${d.canDonateTo.join(', ')}</div>
            <div style="font-size:0.8rem;color:#555"><strong>Receives from:</strong> ${d.canReceiveFrom.join(', ')}</div>
          </div>
        `).join('')}
        <!-- duplicate for seamless loop -->
        ${Object.entries(bloodData).map(([bg, d]) => `
          <div style="
            background:white;border-left:5px solid ${d.color};
            border-radius:12px;padding:15px 18px;min-width:200px;
            box-shadow:0 3px 12px rgba(0,0,0,0.08);flex-shrink:0;
          ">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <span style="background:${d.color};color:white;padding:4px 12px;border-radius:20px;font-weight:900;font-size:1.1rem">${bg}</span>
              ${bg === donorBloodGroup ? '<span style="background:#fff3cd;color:#856404;padding:3px 8px;border-radius:10px;font-size:0.75rem;font-weight:bold">YOU</span>' : ''}
            </div>
            <div style="font-size:0.8rem;color:#555;margin-bottom:4px"><strong>Donates to:</strong> ${d.canDonateTo.join(', ')}</div>
            <div style="font-size:0.8rem;color:#555"><strong>Receives from:</strong> ${d.canReceiveFrom.join(', ')}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- ELIGIBILITY CRITERIA PLUCK CARDS -->
    <h3 style="margin-bottom:15px;color:#333">✅ Eligibility Criteria for Donation</h3>
    <div style="overflow:hidden">
      <div id="eligibilityTicker" style="display:flex;gap:15px;animation:scrollTicker 35s linear infinite reverse;width:max-content">
        ${[...eligibility, ...eligibility].map(e => `
          <div style="
            background:white;border-radius:12px;padding:15px 18px;
            min-width:220px;flex-shrink:0;
            box-shadow:0 3px 12px rgba(0,0,0,0.08);
            border-top:4px solid #c0392b;
          ">
            <div style="font-size:1.8rem;margin-bottom:8px">${e.icon}</div>
            <div style="font-weight:bold;color:#c0392b;margin-bottom:5px">${e.label}</div>
            <div style="font-size:0.85rem;color:#555;line-height:1.5">${e.note}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <style>
      @keyframes scrollTicker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      #ticker:hover, #eligibilityTicker:hover {
        animation-play-state: paused;
      }
    </style>
  `;
}
function claimReward(name, pts) {
  if (confirm(`🎁 Claim "${name}" for ${pts} points?`)) {
    alert(`✅ "${name}" claimed! Our team will contact you within 3–5 days.`);
  }
}
function submitVerification() {
  alert('✅ Verification request submitted! You will be notified within 2-3 business days.');
}
function getSimPoints() {
  return parseInt(localStorage.getItem('simPoints') || '0');
}

function addPoints(pts) {
  const newTotal = getSimPoints() + pts;
  localStorage.setItem('simPoints', newTotal);
  document.getElementById('simPointsDisplay').textContent = newTotal;
  document.getElementById('donorPoints').textContent = `${newTotal} Points`;
  if (!document.getElementById('section-rewards').classList.contains('hidden')) {
    refreshRewardsWithPoints(newTotal);
  }
}

function resetPoints() {
  localStorage.setItem('simPoints', '0');
  document.getElementById('simPointsDisplay').textContent = '0';
  document.getElementById('donorPoints').textContent = '0 Points';
  if (!document.getElementById('section-rewards').classList.contains('hidden')) {
    refreshRewardsWithPoints(0);
  }
}

function refreshRewardsWithPoints(points) {
  const donations = Math.floor(points / 10);
  const pct = Math.min((points / 2000) * 100, 100);

  document.getElementById('pointsDisplay').textContent = `${points} / 2000 pts`;
  document.getElementById('pointsFill').style.width = pct + '%';
  document.getElementById('simPointsDisplay').textContent = points;

  const badges = [
    { threshold: 1,  emoji: '🩸', name: 'First Drop Hero' },
    { threshold: 5,  emoji: '💉', name: 'Life Saver' },
    { threshold: 10, emoji: '🏅', name: 'Blood Champion' },
    { threshold: 25, emoji: '🥇', name: 'Gold Donor' },
    { threshold: 50, emoji: '👑', name: 'Platinum Donor' },
  ];
  document.getElementById('badgesGrid').innerHTML = badges.map(b => {
    const earned = donations >= b.threshold;
    return `
      <div style="
        background:${earned ? 'linear-gradient(135deg,#c0392b,#e74c3c)' : '#eee'};
        color:${earned ? 'white' : '#aaa'};
        border-radius:12px; padding:15px; text-align:center;
        box-shadow:${earned ? '0 4px 15px rgba(192,57,43,0.3)' : 'none'};
      ">
        <div style="font-size:2rem">${b.emoji}</div>
        <div style="font-weight:bold;font-size:0.85rem;margin-top:6px">${b.name}</div>
        <div style="font-size:0.75rem;margin-top:4px;opacity:0.85">${b.threshold} donation${b.threshold > 1 ? 's' : ''}</div>
        <div style="font-size:0.75rem;margin-top:6px">${earned ? '✅ Earned' : '🔒 Locked'}</div>
      </div>`;
  }).join('');

  const catalogue = [
    { tier:'🥉 Beginner Rewards', range:'10–100 points', color:'#cd7f32',
      items:[{name:'Lays Packet',emoji:'🍟',pts:10},{name:'Slice Juice',emoji:'🧃',pts:10},
             {name:'Pen',emoji:'✏️',pts:10},{name:'Book',emoji:'📖',pts:20},
             {name:'Keychain',emoji:'🔑',pts:40},{name:'Water Bottle',emoji:'💧',pts:50},
             {name:'T-Shirt',emoji:'👕',pts:100}]},
    { tier:'🥈 Intermediate Rewards', range:'150–500 points', color:'#95a5a6',
      items:[{name:'Hoodie',emoji:'🧥',pts:200},{name:'Backpack',emoji:'🎒',pts:300},
             {name:'Power Bank',emoji:'🔋',pts:400},{name:'Smart Watch',emoji:'⌚',pts:500}]},
    { tier:'🥇 Advanced Rewards', range:'600–1000 points', color:'#f39c12',
      items:[{name:'Bluetooth Headphones',emoji:'🎧',pts:700},{name:'Tablet',emoji:'📱',pts:900},
             {name:'Bicycle',emoji:'🚲',pts:1000}]},
    { tier:'👑 Lifetime Achievement', range:'1500–2000 points', color:'#8e44ad',
      items:[{name:'Laptop',emoji:'💻',pts:1500},{name:'International Trip',emoji:'✈️',pts:1800},
             {name:'Platinum Award + Gold Medal',emoji:'🏆',pts:2000}]},
  ];

  document.getElementById('rewardsCatalogue').innerHTML = catalogue.map(cat => `
    <div style="margin-bottom:30px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <h3 style="color:${cat.color}">${cat.tier}</h3>
        <span style="color:#888;font-size:0.85rem">(${cat.range})</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px">
        ${cat.items.map(item => {
          const canClaim = points >= item.pts;
          return `
            <div style="background:white;border-radius:12px;padding:14px 10px;text-align:center;
              box-shadow:0 2px 10px rgba(0,0,0,0.08);border:2px solid ${canClaim ? cat.color : '#eee'};
              opacity:${canClaim?1:0.6};transition:transform 0.2s;"
              onmouseover="this.style.transform='scale(1.04)'"
              onmouseout="this.style.transform='scale(1)'">
              <div style="font-size:2rem">${item.emoji}</div>
              <div style="font-weight:600;font-size:0.85rem;margin-top:8px;color:#333">${item.name}</div>
              <div style="color:${cat.color};font-weight:bold;font-size:0.9rem;margin:6px 0">${item.pts} pts</div>
              <button onclick="claimReward('${item.name}',${item.pts},${points})"
                style="background:${canClaim?cat.color:'#ccc'};color:white;border:none;
                padding:5px 14px;border-radius:20px;font-size:0.78rem;
                cursor:${canClaim?'pointer':'not-allowed'};width:100%;margin-top:4px;"
                ${canClaim?'':'disabled'}>
                ${canClaim?'Claim':'Locked'}
              </button>
            </div>`;
        }).join('')}
      </div>
    </div>`).join('');
}

function claimReward(name, pts, currentPoints) {
  if (currentPoints < pts) { alert('Not enough points!'); return; }
  if (confirm(`🎁 Claim "${name}" for ${pts} points?`)) {
    const newPoints = currentPoints - pts;
    localStorage.setItem('simPoints', newPoints);
    alert(`✅ "${name}" claimed! Remaining points: ${newPoints}`);
    refreshRewardsWithPoints(newPoints);
  }
}

function submitVerification() {
  alert('✅ Verification request submitted! You will be notified within 2-3 business days.');
}

loadDashboard();