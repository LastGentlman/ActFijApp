# Integración de Activos Fijos con Firefly III

Esta documentación describe la implementación de un servidor proxy seguro para conectar la aplicación de gestión de activos fijos con la API de Firefly III, permitiendo el registro de activos como transacciones de retiro.

## 1. Arquitectura de la Solución

Para garantizar la seguridad y evitar problemas de CORS (Cross-Origin Resource Sharing), se ha implementado un **servidor proxy en Node.js/Express** que actúa como intermediario entre el frontend (React) y la API de Firefly III.

| Componente | Descripción | Propósito de Seguridad |
| :--- | :--- | :--- |
| **Frontend (React)** | Componente `ActivosFijos.js` modificado. | Envía peticiones al servidor proxy local (`/api/firefly/transactions`). |
| **Servidor Proxy (Node.js)** | Archivo `server.js` y dependencias. | **Almacena de forma segura el Token de Acceso Personal (PAT)** de Firefly III como variable de entorno y añade el encabezado de autenticación a la petición. |
| **Firefly III API** | Endpoint `POST /api/v1/transactions`. | Recibe la petición autenticada del servidor proxy. |

## 2. Archivos Modificados y Creados

| Archivo | Descripción |
| :--- | :--- |
| `package.json` | Se añadieron dependencias (`express`, `body-parser`, `dotenv`, `node-fetch`, `http-proxy-middleware`) y un script `server` para iniciar el backend. |
| `server.js` | **NUEVO.** Servidor proxy que maneja la lógica de autenticación y reenvío de peticiones a Firefly III. |
| `src/setupProxy.js` | **NUEVO.** Configuración para el servidor de desarrollo de React para redirigir las peticiones `/api/firefly` al servidor proxy. |
| `src/components/ActivosFijos.js` | Se añadió la función `enviarAFirefly` y un botón **"Enviar a Firefly"** para iniciar la sincronización. |
| `.env` | **NUEVO.** Archivo para almacenar la URL de Firefly III y el PAT. **Añadido a `.gitignore` para seguridad.** |
| `.gitignore` | Se añadió la línea `.env` para evitar que el archivo de secretos se suba al repositorio. |

## 3. Configuración y Uso (Local)

Para que la integración funcione, debes configurar tus credenciales de Firefly III.

### Paso 3.1: Configurar Credenciales

1.  **Obtén tu Token de Acceso Personal (PAT)**: En tu instancia de Firefly III, ve a **Opciones** > **Perfil** > **OAuth** y genera un nuevo token.
2.  **Edita el archivo `.env`**: Abre el archivo `.env` en la raíz del proyecto y rellena los campos:

    ```
    # URL base de tu instancia de Firefly III (sin /api/v1)
    FIREFLY_III_URL=https://tu.dominio.firefly-iii.org

    # Token de Acceso Personal (PAT) generado en Firefly III
    FIREFLY_III_PAT=tu_token_personal_aqui
    ```

### Paso 3.2: Instalar Dependencias

Asegúrate de estar en el directorio `ActFijApp` y ejecuta:

```bash
npm install
```

### Paso 3.3: Iniciar la Aplicación

El script `start` ahora inicia tanto el frontend de React como el servidor proxy de Node.js simultáneamente:

```bash
npm start
```

### Paso 3.4: Sincronizar Activos

1.  Abre la aplicación en tu navegador.
2.  Haz clic en el botón **"Enviar a Firefly"** (icono de avión de papel) en la esquina superior derecha.
3.  Cada activo se enviará como una transacción de retiro (`withdrawal`) a Firefly III.

## 4. Mapeo de Datos

La aplicación mapea los datos de activos a una transacción de Firefly III de la siguiente manera:

| Campo de Activo | Campo de Firefly III | Tipo de Transacción | Notas |
| :--- | :--- | :--- | :--- |
| `valor` | `amount` | `withdrawal` (Retiro) | El valor del activo. |
| `item` | `description` | `withdrawal` (Retiro) | Se usa para la descripción de la transacción. |
| `fuente` | `source_name` | `withdrawal` (Retiro) | Se asume que es la **Cuenta de Origen** (ej. "Cuenta Bancaria"). |
| `categoria` | `destination_name` | `withdrawal` (Retiro) | Se asume que es la **Cuenta de Destino** (ej. "Gastos de Activos Fijos" o una cuenta de gasto). |
| `fecha actual` | `date` | `withdrawal` (Retiro) | Se usa la fecha actual del envío. |

**Nota Importante:** Firefly III requiere que `source_name` y `destination_name` correspondan a **cuentas existentes** en tu instancia. Asegúrate de que los valores en los campos `fuente` y `categoria` de tus activos coincidan con los nombres de tus cuentas en Firefly III.
