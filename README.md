# Carga de documentación – Vacunación Ganadera

Sitio web responsive (web + mobile) con formulario para cargar documentación y **enviar por mail** el archivo adjunto.

## Estructura
- `index.html`, `style.css`, `script.js`: Frontend responsive accesible.
- `server.js`: Backend Node.js con Express, Multer (subida de archivos en memoria) y Nodemailer (envío de email con adjunto).
- `package.json`: dependencias.
- `.env.example`: plantilla de variables de entorno para tu SMTP.
  
## Requisitos
- Node.js 18+
- Una cuenta SMTP (recomendado: Gmail con **App Password**, o un proveedor como SendGrid, Mailgun, Outlook, etc.).

> ⚠️ Gmail con contraseña normal suele bloquear el acceso SMTP. Creá un **App Password** si tenés 2FA: Google Account → Security → App passwords.

## Pasos para ejecutar

1. **Descargar** o clonar este proyecto.
2. Copiar `.env.example` a `.env` y completar con tus credenciales SMTP.
3. Instalar dependencias:
   ```bash
   npm install
   ```
4. Ejecutar:
   ```bash
   npm run dev
   ```
5. Abrir `http://localhost:3000` en el navegador.

## Cómo funciona el envío
Al enviar el formulario:
- POST a `/api/enviar` con `FormData`.
- El backend valida `nombre`, `telefono` y el archivo `documento` (máx. 10 MB).
- Se envía un email a `TO_EMAIL` con:
  - **Asunto**: `Acta de vacunacion de (nombre)`
  - **Cuerpo**: nombre, teléfono y correo (si se indicó)
  - **Adjunto**: el archivo subido.

## Despliegue
- Podés subirlo a un VPS o a servicios como Render, Railway, Fly.io, etc.
- Recordá configurar las variables de entorno en el panel del proveedor.

## Seguridad
- Multer mantiene el archivo en memoria y no lo escribe a disco.
- Validá límites de tamaño y tipos según necesidad.
- Si el sitio será público, agregá:
  - CAPTCHA (hCaptcha/Cloudflare Turnstile) para evitar spam.
  - Lista de tipos MIME permitidos adicional en el backend.
