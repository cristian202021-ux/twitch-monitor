# Twitch Monitor (Vercel + Supabase)

## Variables de entorno
- TWITCH_CLIENT_ID
- TWITCH_CLIENT_SECRET
- NEXT_PUBLIC_BASE_URL (ej. https://tu-proyecto.vercel.app)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE

## Rutas
- /api/auth/streamer → autoriza streamer
- /api/join?slot=<slot_id> → check-in espectadores
- /api/ping?id=<attend_id> → contador de minutos
