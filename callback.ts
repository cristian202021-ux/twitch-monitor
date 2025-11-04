import type { NextApiRequest, NextApiResponse } from 'next';
import { exchangeCodeForToken, getTwitchUser, BASE_URL } from '../../../lib/twitch';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = (req.query.code as string) || '';
    const state = (req.query.state as string) || '';
    if (!code) return res.status(400).send('Falta code');

    const tok = await exchangeCodeForToken(code);
    const user = await getTwitchUser(tok.access_token);

    if (state === 'STREAMER_AUTH') {
      await supabaseAdmin.from('streamers').upsert({
        id: user.id,
        login: user.login,
        display_name: user.display_name,
        access_token: tok.access_token,
        refresh_token: tok.refresh_token || null,
      });
      return res
        .status(200)
        .setHeader('content-type', 'text/html; charset=utf-8')
        .send(`<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;margin:40px">
          <h2>¡Streamer autorizado! ✅</h2>
          <p>${user.display_name} (@${user.login}) quedó registrado.</p>
          <p>Puedes cerrar esta pestaña.</p>
        </body>`);
    }

    const slotId = state;
    const { data: slot } = await supabaseAdmin
      .from('slots')
      .select('channel')
      .eq('slot_id', slotId)
      .maybeSingle();
    const channel = slot?.channel || '';

    const now = new Date().toISOString();
    const { data: att } = await supabaseAdmin
      .from('attendance')
      .insert({
        slot_id: slotId,
        channel,
        user_id: user.id,
        user_login: user.login,
        user_name: user.display_name,
        ts_start: now,
        ts_last: now,
        duration_min: 0,
      })
      .select('attend_id')
      .single();

    const attendId = att?.attend_id as string;
    const target = channel ? `https://twitch.tv/${channel}` : `https://twitch.tv`;

    return res
      .status(200)
      .setHeader('content-type', 'text/html; charset=utf-8')
      .send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
        <style>body{font-family:system-ui;margin:40px;line-height:1.5;max-width:720px}</style>
        <h2>¡Check-in registrado! ✅</h2>
        <p>Hola, <b>${user.display_name}</b> (@${user.login}). Vamos al stream de <b>${channel || 'Twitch'}</b>.</p>
        <script>
          try { window.open(${JSON.stringify(target)}, '_blank'); } catch(e) {}
          const pingUrl = ${JSON.stringify(`${BASE_URL}/api/ping`)} + '?id=' + ${JSON.stringify(attendId || '')};
          function ping(){
            fetch(pingUrl, {cache:'no-store'}).then(r=>r.text()).then(t=>{
              const el = document.getElementById('mins'); if(el) el.textContent = (t||'0') + ' min';
            }).catch(()=>{});
          }
          ping(); setInterval(ping, 30000);
          addEventListener('beforeunload', ()=>{ try{ navigator.sendBeacon(pingUrl); }catch(e){} });
        </script>
        <p>Tiempo contado: <b id="mins">0 min</b></p>
        <p style="color:#666">Si el navegador bloquea la ventana: <a href="${target}" target="_blank" rel="noopener">Abrir stream</a></p>`);
  } catch (e: any) {
    return res.status(500).send('ERROR: ' + e?.message);
  }
}
