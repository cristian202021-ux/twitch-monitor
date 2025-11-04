import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = (req.query.id as string) || '';
  if (!id) return res.status(400).send('bad');

  const { data } = await supabaseAdmin
    .from('attendance')
    .select('ts_start')
    .eq('attend_id', id)
    .maybeSingle();

  if (!data) return res.status(404).send('not-found');

  const start = new Date(data.ts_start).getTime();
  const now = Date.now();
  const minutes = Math.max(0, Math.round((now - start) / 60000));

  await supabaseAdmin
    .from('attendance')
    .update({ ts_last: new Date().toISOString(), duration_min: minutes })
    .eq('attend_id', id);

  res.setHeader('content-type', 'text/plain');
  return res.status(200).send(String(minutes));
}
