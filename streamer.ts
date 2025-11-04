import type { NextApiRequest, NextApiResponse } from 'next';
import { twitchAuthUrl } from '../../../lib/twitch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = twitchAuthUrl('STREAMER_AUTH');
  res.redirect(302, url);
}
