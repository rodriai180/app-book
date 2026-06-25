import { createServer } from 'http';

const CLIENT_ID     = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI  = 'http://localhost:3999/callback';
const SCOPES        = 'https://www.googleapis.com/auth/youtube';

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    response_type: 'code',
    scope:         SCOPES,
    access_type:   'offline',
    prompt:        'consent',
  });

console.log('\n🔐 Abrí esta URL en el browser:\n');
console.log(authUrl);
console.log('\nEsperando callback en http://localhost:3999/callback ...\n');

const server = createServer(async (req, res) => {
  const url  = new URL(req.url, 'http://localhost:3999');
  const code = url.searchParams.get('code');

  if (!code) {
    res.end('No se recibió código.');
    return;
  }

  res.end('<h2>¡Autorizado! Podés cerrar esta pestaña.</h2>');
  server.close();

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri:  REDIRECT_URI,
      grant_type:    'authorization_code',
    }),
  });

  const tokens = await tokenRes.json();
  if (tokens.error) {
    console.error('❌ Error:', tokens.error_description);
    process.exit(1);
  }

  console.log('\n✅ Tokens obtenidos:\n');
  console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log(`\nAccess token (temporal): ${tokens.access_token}`);
  console.log('\n⚠️  Actualizá YOUTUBE_REFRESH_TOKEN en generate-batch.bat, generate-reel.bat y scheduler.bat');
  process.exit(0);
});

server.listen(3999);
