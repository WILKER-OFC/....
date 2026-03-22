# Api Gohan 馃惒

Una API robusta con sistema de registro, verificaci贸n de correo electr贸nico v铆a Gmail en tiempo real, gesti贸n de API Keys y endpoints tem谩ticos de Gohan.

## Caracter铆sticas

- **Registro de Usuarios:** Con verificaci贸n de correo electr贸nico obligatoria.
- **Seguridad:** Autenticaci贸n JWT y protecci贸n de endpoints con API Key.
- **Recuperaci贸n de Contrase帽a:** Sistema de olvido de contrase帽a con env铆o de token a Gmail.
- **Gesti贸n de API Key:** Cada usuario puede regenerar su propia API Key.
- **Leaderboard:** Top de usuarios que m谩s utilizan la API.
- **Uptime:** Monitoreo del tiempo de actividad del servidor.
- **Endpoints Tem谩ticos:** Frases y datos curiosos sobre Gohan.
- **Idioma:** Totalmente en Espa帽ol.

## Endpoints

### Autenticaci贸n (`/auth`)
- `POST /auth/register` - Registrar nuevo usuario.
- `GET /auth/verify/:token` - Verificar cuenta por correo.
- `POST /auth/login` - Iniciar sesi贸n y obtener JWT.
- `POST /auth/forgot-password` - Solicitar recuperaci贸n de contrase帽a.
- `POST /auth/reset-password/:token` - Cambiar contrase帽a con token.

### API (`/api`)
- `GET /api/uptime` - Ver tiempo de actividad.
- `GET /api/leaderboard` - Ver top usuarios (uso de API).
- `GET /api/quote?apikey=TU_KEY` - Obtener frase aleatoria.
- `GET /api/gohan-fact?apikey=TU_KEY` - Obtener dato curioso.
- `PATCH /api/update-key` - Regenerar API Key (Requiere Bearer Token).

## Instalaci贸n y Configuraci贸n

1. Clona el repositorio.
2. Instala las dependencias: `npm install`.
3. Configura el archivo `.env` bas谩ndote en `.env.example`.
4. Inicia el servidor: `npm start`.

## Despliegue en Render

Esta API est谩 lista para ser desplegada en [Render](https://render.com/). Solo necesitas conectar tu repositorio y configurar las variables de entorno.
