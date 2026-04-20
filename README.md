# Livo

E-commerce en React + Vite con CRM protegido por login de administrador y persistencia en Supabase.

## Requisitos

- Node.js 18+
- Cuenta en Supabase
- (Opcional) Vercel para deploy

## Configuración local

1. Instala dependencias:
   - `npm install`
2. Crea `.env` tomando como base `.env.example`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_EMAIL` (fallback local)
   - `VITE_ADMIN_PASSWORD` (fallback local)
3. Ejecuta el esquema SQL en Supabase:
   - abre SQL Editor
   - pega y ejecuta `supabase/schema.sql`
4. Crea tu usuario admin en Supabase Auth (Email/Password).
5. (Recomendado) Inserta tu usuario en `crm_users`:
   - `insert into public.crm_users (id, email) values ('<auth_user_id>', '<tu_email>');`

## Desarrollo

- `npm run dev`
- atajo para abrir login CRM: `Ctrl + Shift + A`

## Build

- `npm run build`

## Variables en Vercel

Configura en Project Settings -> Environment Variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAIL` (opcional fallback)
- `VITE_ADMIN_PASSWORD` (opcional fallback)

Después de guardar variables, ejecuta un redeploy.

## Seguridad CRM

- El botón público del CRM se removió del header.
- El acceso al CRM requiere login.
- Las tablas CRM usan RLS en Supabase con políticas `auth.uid() = user_id`.
