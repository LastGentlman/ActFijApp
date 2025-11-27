# Ativo Fijo App

Aplicación SPA para registrar activos fijos, visualizar métricas básicas y disparar sincronizaciones hacia Firefly III a través de un proxy Node/Express. Todo el código está pensado para ejecutarse en local y servir como base para futuras integraciones contables.

## Tecnologías principales
- **Frontend:** React 18 (create-react-app) + Tailwind CSS (generado con `tailwindcss` CLI)
- **UI:** Íconos de `lucide-react`, diseño responsivo (tarjetas móviles + tabla desktop)
- **Backend ligero:** `server.js` en Express 5 actúa como proxy seguro hacia la API de Firefly III
- **Proxy dev:** `src/setupProxy.js` redirige `/api/firefly` del dev server de CRA al proxy local (`http://localhost:3001`)

## Arquitectura resumida
```
React (ActivosFijos.js)
   │ fetch -> /api/firefly/transactions
   ▼
Proxy Express (server.js)
   │ añade Authorization: Bearer <FIREFLY_III_PAT>
   ▼
Firefly III /api/v1/transactions
```
- El frontend genera transacciones tipo `withdrawal` por cada activo.
- El proxy usa `node-fetch` para reenviar la petición y mantiene el PAT fuera del navegador.

Para más contexto funcional consulta `INTEGRACION_FIREFLY_III.md`.

## Estructura relevante
```
├── server.js              # Proxy HTTP -> Firefly III (Express + dotenv)
├── src/
│   ├── App.js             # Carga el componente principal
│   ├── components/
│   │   └── ActivosFijos.js# UI, CRUD básico y envío a Firefly
│   ├── index.js           # Entrypoint CRA
│   ├── index.css          # Fuente de estilos Tailwind
│   └── setupProxy.js      # Redirección en desarrollo
├── public/index.html      # Shell HTML con metadatos en ES
├── tailwind.config.js     # Escaneo de clases utility
└── INTEGRACION_FIREFLY_III.md
```

## Requisitos previos
- Node.js >= 18
- Cuenta operativa de Firefly III y un *Personal Access Token* (PAT)
- NPM (incluye `npx` para la CLI de Tailwind)

## Configuración rápida
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` en la raíz con:
   ```bash
   FIREFLY_III_URL=https://tu.firefly.tld
   FIREFLY_III_PAT=token_personal
   PORT=3001                # opcional, default 3001
   ```
3. Ejecuta todo el stack de desarrollo:
   ```bash
   npm start
   ```
   Esto lanza Tailwind en modo watch, CRA (`react-scripts start`) y el proxy Express (script `server`). Si tu entorno no tiene `concurrently` instalado de forma global, añádelo con `npm install -D concurrently`.

## Scripts disponibles
| Script | Descripción |
| --- | --- |
| `npm start` | Ejecuta `watch-css`, `react-start` y `server` en paralelo. |
| `npm run watch-css` | Compila `src/index.css` -> `src/tailwind.css` en modo watch. |
| `npm run react-start` | Inicia el dev server de CRA en `http://localhost:3000`. |
| `npm run server` | Levanta el proxy Express en `http://localhost:3001`. |
| `npm run build` | Genera `src/tailwind.css` y compila el bundle de producción. |
| `npm test` | Ejecuta pruebas de `react-scripts` (no hay tests personalizados aún). |

## Flujo de sincronización con Firefly III
1. Carga/edita el inventario en `ActivosFijos.js` (se incluye una lista inicial a modo de ejemplo).
2. Pulsa **Enviar a Firefly**: la UI recorre todos los activos y llama al proxy.
3. El proxy construye la petición `POST /api/v1/transactions` con el PAT y devuelve el resultado al frontend.
4. Los mensajes de éxito/error se muestran en un banner temporal.

## Variables clave del JSON enviado
- `transactions[0].type`: `withdrawal` (compra de activo)
- `amount`: `activo.valor`
- `description`: `Compra de Activo Fijo: <item>`
- `source_name`: `activo.fuente` (debe existir como cuenta en Firefly)
- `destination_name`: `activo.categoria`
- `date`: fecha actual ISO (YYYY-MM-DD)

## Limitaciones y próximos pasos
- Las funciones `guardarActivo`, `eliminarActivo` y `exportToCSV` están marcadas con comentarios; requieren completar la lógica de persistencia/exportación.
- `server.js` sólo implementa el endpoint de creación; si necesitas actualizar/eliminar transacciones en Firefly deberás extenderlo.
- Aún no hay autenticación ni almacenamiento persistente (todo vive en memoria del cliente).
- No se incluye `concurrently` en `package.json`; añade la dependencia si ejecutas `npm start` en un entorno limpio.

Con estas notas deberías poder levantar la app, entender su flujo actual y continuar la evolución del proyecto.
