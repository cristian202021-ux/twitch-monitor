import Link from 'next/link';
export default function Home() {
  return (
    <main style={{fontFamily:'system-ui',maxWidth:720,margin:'40px auto',lineHeight:1.5}}>
      <h1>Twitch Monitor</h1>
      <p>Endpoints útiles:</p>
      <ul>
        <li><Link href="/api/auth/streamer">/api/auth/streamer</Link></li>
        <li><Link href="/api/join?slot=2025-11-04_21_crisdezplays">/api/join?slot=2025-11-04_21_crisdezplays</Link></li>
      </ul>
    </main>
  );
}
