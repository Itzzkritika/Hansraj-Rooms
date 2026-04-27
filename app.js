// ─────────────────────────────────────────────
//  SHARED LOGIC
// ─────────────────────────────────────────────
const SHORT_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];
const FULL_DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function toMins(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function fmt12(t) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function isOccupied(roomId, day, time) {
  const sd = SHORT_DAYS[FULL_DAYS.indexOf(day)];
  const t = toMins(time);
  return schedules.some(s => s.roomId === roomId && s.days.includes(sd) && toMins(s.start) <= t && t < toMins(s.end));
}

function getOccClass(roomId, day, time) {
  const sd = SHORT_DAYS[FULL_DAYS.indexOf(day)];
  const t = toMins(time);
  return schedules.find(s => s.roomId === roomId && s.days.includes(sd) && toMins(s.start) <= t && t < toMins(s.end));
}

// ─────────────────────────────────────────────
//  FINDER — index.html
// ─────────────────────────────────────────────
async function findEmpty() {
  const day   = document.getElementById('find-day').value;
  const time  = document.getElementById('find-time').value;
  const block = document.getElementById('find-block').value;
  const el    = document.getElementById('results');

  el.innerHTML = `<div style="text-align:center;padding:2rem;color:#9ca3af;font-size:14px;">Loading schedules...</div>`;

  // Always fetch fresh from Supabase
  schedules = await dbGetSchedules();

  const filtered = block ? rooms.filter(r => r.block === block) : rooms;
  const free     = filtered.filter(r => !isOccupied(r.id, day, time));
  const busy     = filtered.filter(r =>  isOccupied(r.id, day, time));
  const blocks   = [...new Set(filtered.map(r => r.block))];

  let html = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.25rem;">
      <div class="stat-box green"><div class="stat-num">${free.length}</div><div class="stat-label">Empty rooms</div></div>
      <div class="stat-box red"><div class="stat-num">${busy.length}</div><div class="stat-label">Occupied rooms</div></div>
      <div class="stat-box"><div class="stat-num">${filtered.length}</div><div class="stat-label">Total rooms</div></div>
    </div>`;

  if (free.length === 0) {
    html += `<div class="empty-state"><div class="icon">📅</div><p>No empty rooms found for ${day} at ${fmt12(time)}.</p></div>`;
  } else {
    blocks.forEach(b => {
      const bFree = free.filter(r => r.block === b);
      if (!bFree.length) return;
      html += `<div class="block-section"><div class="block-label">${b} — ${bFree.length} available</div>`;
      bFree.forEach(r => {
        html += `<div class="room-card">
          <div><div class="room-name">${r.room}</div><div class="room-meta">${r.cap} seats</div></div>
          <span class="badge badge-free">Available</span>
        </div>`;
      });
      html += `</div>`;
    });

    if (busy.length) {
      html += `<div class="section-divider">Occupied rooms (${busy.length})</div>`;
      busy.forEach(r => {
        const sc = getOccClass(r.id, day, time);
        html += `<div class="room-card">
          <div>
            <div class="room-name">${r.room} <span style="font-weight:400;color:#4b5563;font-size:13px;">· ${r.block}</span></div>
            <div class="room-meta">${sc ? sc.subject + ' · until ' + fmt12(sc.end) : 'Occupied'}</div>
          </div>
          <span class="badge badge-busy">Occupied</span>
        </div>`;
      });
    }
  }

  el.innerHTML = html;
}
