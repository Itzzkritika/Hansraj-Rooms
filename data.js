// ─────────────────────────────────────────────
//  ADMIN PASSWORD — change this!
// ─────────────────────────────────────────────
const ADMIN_PASSWORD = 'hansraj2024';

// ─────────────────────────────────────────────
//  SUPABASE CONFIG
// ─────────────────────────────────────────────
const SUPABASE_URL = 'https://mznwuljzwwovoyytjmoq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BEhdKS2W8scluJwOKVO2iA_wrJ9dkI8';

// ─────────────────────────────────────────────
//  SUPABASE HELPERS
// ─────────────────────────────────────────────
async function dbGetSchedules() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/schedules?select=*`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return Array.isArray(data) ? data.map(s => ({
      id: s.id, roomId: s.room_id, subject: s.subject,
      days: s.days, start: s.start_time, end: s.end_time
    })) : [];
  } catch(e) { console.error('Load error:', e); return []; }
}

async function dbAddSchedule(s) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/schedules`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', 'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ id: s.id, room_id: s.roomId, subject: s.subject, days: s.days, start_time: s.start, end_time: s.end })
  });
  return res.ok;
}

async function dbDeleteSchedule(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/schedules?id=eq.${id}`, {
    method: 'DELETE',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
  });
  return res.ok;
}

// ─────────────────────────────────────────────
//  ROOMS — from hansraj.collegett.in
// ─────────────────────────────────────────────
let rooms = [
  {id:'A-1',block:'Block A',room:'A-1',cap:84},
  {id:'A-2',block:'Block A',room:'A-2',cap:39},
  {id:'A-3',block:'Block A',room:'A-3',cap:36},
  {id:'A-4',block:'Block A',room:'A-4',cap:36},
  {id:'A-101',block:'Block A',room:'A-101',cap:39},
  {id:'A-102',block:'Block A',room:'A-102',cap:39},
  {id:'A-103',block:'Block A',room:'A-103',cap:39},
  {id:'A-104',block:'Block A',room:'A-104',cap:81},
  {id:'A-105',block:'Block A',room:'A-105',cap:39},
  {id:'A-106',block:'Block A',room:'A-106',cap:33},
  {id:'A-107',block:'Block A',room:'A-107',cap:33},
  {id:'A-108',block:'Block A',room:'A-108',cap:42},
  {id:'A-109',block:'Block A',room:'A-109',cap:54},
  {id:'A-110',block:'Block A',room:'A-110',cap:57},
  {id:'A-111',block:'Block A',room:'A-111',cap:21},
  {id:'A-112',block:'Block A',room:'A-112',cap:51},
  {id:'A-113',block:'Block A',room:'A-113',cap:36},
  {id:'A-114',block:'Block A',room:'A-114',cap:36},
  {id:'A-115',block:'Block A',room:'A-115',cap:18},
  {id:'A-116',block:'Block A',room:'A-116',cap:36},
  {id:'A-117',block:'Block A',room:'A-117',cap:36},
  {id:'A-118',block:'Block A',room:'A-118',cap:33},
  {id:'A-119',block:'Block A',room:'A-119',cap:39},
  {id:'A-201',block:'Block A',room:'A-201',cap:87},
  {id:'A-202',block:'Block A',room:'A-202',cap:84},
  {id:'A-203',block:'Block A',room:'A-203',cap:39},
  {id:'A-204',block:'Block A',room:'A-204',cap:75},
  {id:'A-205',block:'Block A',room:'A-205',cap:36},
  {id:'A-206',block:'Block A',room:'A-206',cap:72},
  {id:'A-207',block:'Block A',room:'A-207',cap:39},
  {id:'A-208',block:'Block A',room:'A-208',cap:57},
  {id:'A-209',block:'Block A',room:'A-209',cap:57},
  {id:'A-210',block:'Block A',room:'A-210',cap:57},
  {id:'A-211',block:'Block A',room:'A-211',cap:84},
  {id:'A-212',block:'Block A',room:'A-212',cap:57},
  {id:'A-213',block:'Block A',room:'A-213',cap:57},
  {id:'A-214',block:'Block A',room:'A-214',cap:33},
  {id:'A-215',block:'Block A',room:'A-215',cap:39},
  {id:'B-103',block:'Block B',room:'B-103',cap:51},
  {id:'B-105',block:'Block B',room:'B-105',cap:78},
  {id:'B-106',block:'Block B',room:'B-106',cap:81},
  {id:'B-2',block:'Block B',room:'B-2',cap:36},
  {id:'B-203',block:'Block B',room:'B-203',cap:45},
  {id:'B-3',block:'Block B',room:'B-3',cap:57},
  {id:'B-7',block:'Block B',room:'B-7',cap:84},
  {id:'B-MPH',block:'Block B',room:'B-MP Hall',cap:78},
  {id:'BOT-L1',block:'Block B',room:'Bot Lab 1',cap:25},
  {id:'BOT-L2',block:'Block B',room:'Bot Lab 2',cap:17},
  {id:'BOT-L3',block:'Block B',room:'Bot Lab 3',cap:21},
  {id:'BOT-L4',block:'Block B',room:'Bot Lab 4',cap:15},
  {id:'CHE-L6',block:'Block B',room:'Chem Lab 6',cap:15},
  {id:'C-101',block:'Block C',room:'C-101',cap:36},
  {id:'C-102',block:'Block C',room:'C-102',cap:42},
  {id:'C-103',block:'Block C',room:'C-103',cap:42},
  {id:'C-104',block:'Block C',room:'C-104',cap:42},
  {id:'C-105',block:'Block C',room:'C-105',cap:30},
  {id:'C-106',block:'Block C',room:'C-106',cap:42},
  {id:'C-107',block:'Block C',room:'C-107',cap:70},
  {id:'C-201',block:'Block C',room:'C-201',cap:87},
  {id:'C-202',block:'Block C',room:'C-202',cap:87},
  {id:'C-203',block:'Block C',room:'C-203',cap:85},
  {id:'C-204',block:'Block C',room:'C-204',cap:60},
];

let schedules = [];
