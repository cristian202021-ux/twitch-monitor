import type { NextApiRequest, NextApiResponse } from 'next';
import { twitchAuthUrl } from '../../lib/twitch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slot = (req.query.slot as string) || '';
  if (!slot) return res.status(400).send('Falta slot (?slot=...)');
  const url = twitchAuthUrl(slot);
  res.redirect(302, url);
}
