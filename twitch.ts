export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID as string;
export const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET as string;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

export function twitchAuthUrl(state: string) {
  const url = new URL('https://id.twitch.tv/oauth2/authorize');
  url.searchParams.set('client_id', TWITCH_CLIENT_ID);
  url.searchParams.set('redirect_uri', `${BASE_URL}/api/auth/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', '');
  url.searchParams.set('state', state);
  return url.toString();
}

export async function exchangeCodeForToken(code: string) {
  const body = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    client_secret: TWITCH_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${BASE_URL}/api/auth/callback`,
  });
  const r = await fetch('https://id.twitch.tv/oauth2/token', { method: 'POST', body });
  const j = await r.json();
  if (!j.access_token) throw new Error('No access_token: ' + JSON.stringify(j));
  return j;
}

export async function getTwitchUser(accessToken: string) {
  const r = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': TWITCH_CLIENT_ID,
    },
  });
  const j = await r.json();
  const u = j?.data?.[0];
  if (!u) throw new Error('Sin usuario: ' + JSON.stringify(j));
  return u;
}
