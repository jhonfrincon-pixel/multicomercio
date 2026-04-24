# 📋 Guía de Configuración de Livo

## 🚀 Configuración Rápida

### 1. Crear Archivo .env
Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

### 2. Configurar Credenciales Esenciales

#### 🔐 Base de Datos Supabase
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

#### 🤖 API de Gemini (Chatbot)
```env
VITE_GEMINI_API_KEY=AIzaSyD-tu-api-key-de-gemini-aqui
```

#### 👤 Administrador CRM
```env
CRM_ADMIN_EMAIL=tu-email-admin@livo.com
CRM_ADMIN_PASSWORD=tu-contraseña-segura
```

### 3. Configurar Marketing (Opcional)

#### 📊 Meta Pixel y Google Tag Manager
```env
VITE_META_PIXEL_ID=tu-pixel-id-facebook
VITE_GTM_ID=GTM-TU-ID
```

#### 📱 WhatsApp
```env
VITE_WHATSAPP_NUMBER=573001234567
```

## 🔧 Verificación de Conexiones

### ✅ Verificar Supabase
El sistema mostrará en consola:
- ✅ "Supabase configurado correctamente" si las credenciales son válidas
- ❌ "VITE_SUPABASE_URL no está configurada" si falta la URL

### ✅ Verificar Chatbot Gemini
El chatbot mostrará:
- ✅ "Conectado a Gemini" si la API key es válida
- ❌ "Configuración faltante: No se encontró la VITE_GEMINI_API_KEY" si falta

### ✅ Verificar CRM
Accede a `/crm` y usa:
- Email: `CRM_ADMIN_EMAIL`
- Password: `CRM_ADMIN_PASSWORD`

## 🛠️ Componentes Configurados

### 📦 Base de Datos
- **Archivo**: `src/lib/supabase.ts`
- **Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Función**: Conexión a base de datos en tiempo real

### 🤖 Chatbot IA
- **Archivo**: `src/components/AIChatbot.tsx`
- **Variable**: `VITE_GEMINI_API_KEY`
- **Función**: Asistente de ventas 24/7 con Gemini

### 👨‍💼 Administrador CRM
- **Archivo**: `src/store/crmAuthStore.ts`
- **Variables**: `CRM_ADMIN_EMAIL`, `CRM_ADMIN_PASSWORD`
- **Función**: Panel de administración completo

### 📊 Marketing Analytics
- **Archivo**: `src/components/MarketingTags.tsx`
- **Variables**: `VITE_META_PIXEL_ID`, `VITE_GTM_ID`
- **Función**: Tracking de conversiones y analytics

### 📱 Contacto Flotante
- **Archivo**: `src/components/FloatingContactGroup.tsx`
- **Variable**: `VITE_WHATSAPP_NUMBER`
- **Función**: WhatsApp + Agente IA sin solapamientos

## 🚀 Puesta en Producción

### 1. Variables de Entorno en Netlify
En Netlify Dashboard > Site settings > Build & deploy > Environment:
- Agrega todas las variables `VITE_*`
- Las variables `VITE_` están disponibles en el navegador

### 2. Variables Privadas
Nunca exponer en el código:
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY`
- `CRM_ADMIN_PASSWORD`

### 3. Seguridad
- Cambiar `CRM_ADMIN_PASSWORD` por una contraseña segura
- Rotar las API keys periódicamente
- Usar variables de entorno específicas por producción

## 🔍 Testing de Conexiones

### Test Local
```bash
npm run dev
```
Revisa la consola para mensajes de configuración.

### Test Chatbot
1. Abre la web
2. Click en el botón flotante de chat
3. Envía un mensaje como "¿Qué productos tienen?"
4. Deberías recibir respuesta inteligente

### Test CRM
1. Ve a `https://localhost:5173/crm`
2. Usa las credenciales configuradas
3. Deberías acceder al panel administrativo

### Test Supabase
1. Intenta agregar productos al carrito
2. Los datos deberían persistir en la base de datos

## 🆘️ Solución de Problemas

### Chatbot no responde
- ✅ Verificar `VITE_GEMINI_API_KEY` en `.env`
- ✅ Revisar consola para errores de API
- ✅ Confirmar que la key tenga permisos de Gemini API

### CRM no accede
- ✅ Verificar `CRM_ADMIN_EMAIL` y `CRM_ADMIN_PASSWORD`
- ✅ Limpiar caché del navegador
- ✅ Revisar que no haya espacios en las credenciales

### Supabase no conecta
- ✅ Verificar URL y key de Supabase
- ✅ Confirmar que el proyecto esté activo
- ✅ Revisar permisos RLS en tablas

## 📞 Soporte

Para ayuda adicional:
1. Revisa los logs en la consola del navegador
2. Verifica las variables de entorno con `console.log(import.meta.env)`
3. Contacta al desarrollador con los mensajes de error específicos

---

**🎯 Livo está listo para funcionar con todas las integraciones configuradas correctamente.**
