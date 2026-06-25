import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.YOUTUBE_CLIENT_ID,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`YouTube token error: ${data.error_description}`);
  return data.access_token;
}

function fmtARG(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const { slots } = JSON.parse(readFileSync(join(ROOT, 'scripts', 'schedule.json'), 'utf-8'));
const withYt = slots.filter(s => s.yt);

if (withYt.length === 0) {
  console.log('No hay entradas con yt en schedule.json.');
  process.exit(0);
}

const token = await getAccessToken();
const ids = withYt.map(s => s.yt).join(',');

const res = await fetch(
  `https://www.googleapis.com/youtube/v3/videos?part=status,snippet&id=${ids}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
const data = await res.json();

if (data.error) throw new Error(`YouTube API: ${data.error.message}`);

const byId = Object.fromEntries((data.items ?? []).map(v => [v.id, v]));

console.log('\n📺 Estado de videos en YouTube\n');
console.log('─'.repeat(90));

for (const slot of withYt) {
  const v = byId[slot.yt];
  if (!v) {
    console.log(`❓ ${slot.mlId}  yt:${slot.yt}  → NO ENCONTRADO (eliminado o privado sin acceso)`);
    continue;
  }
  const privacy   = v.status.privacyStatus;   // public | private | unlisted
  const publishAt = v.status.publishAt;        // solo si está scheduled
  const igStatus  = slot.ig ? `ig:${slot.ig}` : 'sin ig';

  let icon = '✅';
  let label = 'PÚBLICO';
  if (privacy === 'private' && publishAt) {
    icon = '⏰';
    label = `PROGRAMADO → ${fmtARG(publishAt)} ARG`;
  } else if (privacy === 'private') {
    icon = '🔒';
    label = 'PRIVADO';
  } else if (privacy === 'unlisted') {
    icon = '🔗';
    label = 'NO LISTADO';
  }

  console.log(`${icon} ${slot.mlId}  yt:${slot.yt}  [${igStatus}]  ${label}`);
}

console.log('─'.repeat(90));
