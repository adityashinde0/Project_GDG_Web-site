const express = require('express');
const cors = require('cors');
const { Readable } = require('node:stream');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5500';

app.use(
  cors({
    origin: [FRONTEND_ORIGIN],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.options('*', cors());

function ensureOAuthConfig(requiredKeys, res, providerName) {
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    res.status(500).json({
      message: `${providerName} OAuth config missing`,
      missing: missingKeys
    });
    return false;
  }

  return true;
}

function isAllowedMediaRequest(req) {
  const allowedOrigin = FRONTEND_ORIGIN;
  const origin = req.get('origin');
  const referer = req.get('referer');

  if (origin && origin === allowedOrigin) return true;
  if (referer && referer.startsWith(`${allowedOrigin}/`)) return true;
  return false;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/media/hero-video', async (req, res) => {
  if (!isAllowedMediaRequest(req)) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const sourceUrl = process.env.VIDEO_SOURCE_URL;

  if (!sourceUrl) {
    res.status(503).json({ message: 'Video source not configured' });
    return;
  }

  try {
    const headers = {};
    if (req.headers.range) headers.Range = req.headers.range;

    const upstream = await fetch(sourceUrl, {
      headers,
      redirect: 'follow'
    });

    if (!upstream.ok && upstream.status !== 206) {
      res.status(502).json({
        message: 'Unable to fetch upstream video',
        status: upstream.status
      });
      return;
    }

    const passHeaders = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control',
      'etag',
      'last-modified'
    ];

    passHeaders.forEach((name) => {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    });

    res.status(upstream.status);

    if (!upstream.body) {
      res.end();
      return;
    }

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Video proxy failed' });
  }
});

app.get('/auth/google/start', (req, res) => {
  const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_REDIRECT_URI'];
  if (!ensureOAuthConfig(required, res, 'Google')) return;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: process.env.GOOGLE_SCOPES || 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

app.get('/auth/microsoft/start', (req, res) => {
  const required = ['MICROSOFT_CLIENT_ID', 'MICROSOFT_REDIRECT_URI'];
  if (!ensureOAuthConfig(required, res, 'Microsoft')) return;

  const tenantId = process.env.MICROSOFT_TENANT_ID || 'common';
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID,
    redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
    response_type: 'code',
    response_mode: 'query',
    scope: process.env.MICROSOFT_SCOPES || 'openid profile email User.Read',
    prompt: 'select_account'
  });

  res.redirect(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`);
});

app.get('/auth/google/callback', (req, res) => {
  if (!req.query.code) {
    res.status(400).send('Google login failed: missing authorization code');
    return;
  }

  res.send('Google login successful. Authorization code received.');
});

app.get('/auth/microsoft/callback', (req, res) => {
  if (!req.query.code) {
    res.status(400).send('Microsoft login failed: missing authorization code');
    return;
  }

  res.send('Microsoft login successful. Authorization code received.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
