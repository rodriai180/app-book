import { createServer } from 'http';
import { readFileSync } from 'fs';
import { exec } from 'child_process';
import { URL } from 'url';

const creds = JSON.parse(readFileSync(new URL('./google-oauth.json', import.meta.url))).installed;
const { client_id, client_secret } = creds;

const SCOPES = 'https://www.googleapis.com/auth/youtube.upload';
const REDIRECT_URI = 'http://localhost:3456';

const authUrl =
  `https://accounts.google.com/o/oauth2/auth` +
  `?client_id=${client_id}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent(SCOPES)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log('\nAbriendo Chrome para autorizar...');
console.log('Si no abre, copiá esta URL en Chrome manualmente:\n');
console.log(authUrl + '\n');
exec(`start chrome "${authUrl}"`);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');
  if (!code) { res.end('Sin código'); return; }

  res.end('<h2>Autorizado! Podés cerrar esta pestaña.</h2>');
  server.close();

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();
  if (tokens.error) { console.error('Error:', tokens.error_description); process.exit(1); }

  console.log('\n✅ Refresh token obtenido:\n');
  console.log(`YOUTUBE_CLIENT_ID=${client_id}`);
  console.log(`YOUTUBE_CLIENT_SECRET=${client_secret}`);
  console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log('\nGuardá estos valores en los .bat\n');
  process.exit(0);
});

server.listen(3456, () => console.log('Esperando autorización en http://localhost:3456 ...'));
