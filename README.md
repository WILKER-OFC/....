# Bardot Bot 馃惒

隆Hola! Bienvenido a **Bardot Bot**, un bot de WhatsApp f谩cil de usar, basado en la librer铆a `@whiskeysockets/baileys`.

## Caracter铆sticas

- **F谩cil de instalar:** Configura y arranca en minutos.
- **Sistema de Plugins:** A帽ade comandos f谩cilmente en la carpeta `plugins/`.
- **C贸digo de Emparejamiento:** Con茅ctate sin necesidad de escanear el c贸digo QR.
- **Auto-reinicio:** Si el bot falla, se reinicia autom谩ticamente.

## Instalaci贸n

1. Clona el repositorio (o descarga el zip).
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el bot en `config.js`:
   - Cambia el n煤mero del owner.
   - Ajusta el prefijo si lo deseas.
4. Inicia el bot:
   ```bash
   npm start
   ```

## Comandos Disponibles

- `.menu` - Muestra el men煤 principal.
- `.ping` - Verifica la latencia del bot.

## Estructura del Proyecto

- `index.js`: Proceso maestro que monitorea el bot.
- `main.js`: L贸gica de conexi贸n a WhatsApp.
- `handler.js`: Manejador de mensajes y cargador de plugins.
- `config.js`: Configuraciones generales.
- `plugins/`: Carpeta donde se guardan los comandos.

## Cr茅ditos

Creado por Bardot.
