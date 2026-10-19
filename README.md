# Consolida

[![CI](https://github.com/daiv05/consolida/actions/workflows/ci.yml/badge.svg)](https://github.com/daiv05/consolida/actions/workflows/ci.yml)
[![Deploy](https://github.com/daiv05/consolida/actions/workflows/deploy.yml/badge.svg)](https://github.com/daiv05/consolida/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-14213D.svg)](LICENSE)

Tracker para seguir un plan de consolidación de inglés de **A2 a B1** en 8 semanas. Cada semana gira en torno a una estructura gramatical que se escucha el lunes, se detecta el miércoles y se escribe el viernes. La app guarda tu progreso, tu diario semanal y tus frases para Anki, y genera prompts de IA adaptados a tus errores.

**Demo:** https://consolida.deras.dev

## Funcionalidades

- **Cuentas**: registro, inicio de sesión, cambio de contraseña, exportación de datos y borrado de cuenta.
- **Hoy**: tareas del día, progreso total, racha, minutos de la semana y tareas atrasadas.
- **Plan**: las 8 semanas con 104 tareas obligatorias más las opcionales, recursos enlazados y checkpoints en las semanas 4 y 8.
- **Diario semanal**: tus 3 errores más repetidos, tu nivel de Write & Improve y notas.
- **Frases**: registro de frases por semana con exportación en el formato de importación de Anki.
- **Prompts IA**: cuatro prompts por semana; el de speaking incluye los errores de tu último diario.
- **Recursos**: más de 30 recursos gratuitos verificados, agrupados por habilidad y nivel.

## Plan semanal

| Día | Tiempo | Actividad |
| --- | --- | --- |
| Lunes | 35 min | Active listening + recreación de segmentos, speaking con retos, 5 frases a Anki |
| Martes | 20 min | Descanso activo: Anki y una serie fácil sin pausar |
| Miércoles | 30 min | Active listening + anotar palabras, correcting and learning |
| Jueves | 20 min | Anki, noticia graduada y pronunciación con YouGlish |
| Viernes | 30 min | MetaWriting y feedback en Write & Improve |
| Sábado | opcional | Serie por gusto o conversación real (desde la semana 5) |
| Domingo | 10 min | Revisión semanal y diario |

| Semana | Estructura |
| --- | --- |
| 1 | Past simple |
| 2 | Past continuous + past simple |
| 3 | Present perfect vs past simple |
| 4 | Futuro: going to, will, present continuous (checkpoint) |
| 5 | Comparatives y superlatives |
| 6 | Obligación y consejo: have to, must, should |
| 7 | First y second conditional |
| 8 | Used to + repaso general (checkpoint) |

## Stack

- [Nuxt 4](https://nuxt.com) (Vue 3 + Nitro) para la interfaz y la API.
- [SQLite](https://sqlite.org) con [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) y [Drizzle ORM](https://orm.drizzle.team); las migraciones se aplican al arrancar.
- [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils): sesiones en cookie cifrada y contraseñas con scrypt.
- [Zod](https://zod.dev) para validar cada petición.
- [Vitest](https://vitest.dev) para la lógica del plan y un smoke test de la API completa.
- Docker, GitHub Actions y GitHub Container Registry para integración y despliegue continuos.

## Desarrollo local

Requisitos: Node 24 (ver `.nvmrc`) y npm.

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

La app queda en http://localhost:3000 y la base de datos en `data/consolida.db`. En desarrollo, `nuxt-auth-utils` genera `NUXT_SESSION_PASSWORD` si falta.

### Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción en `.output/` |
| `npm run preview` | Ejecuta el build de producción |
| `npm run typecheck` | Comprueba tipos de la app, el servidor y el código compartido |
| `npm test` | Tests unitarios con Vitest |
| `npm run db:generate` | Genera una migración tras cambiar `server/database/schema.ts` |
| `sh scripts/smoke.sh [url]` | Recorre la API completa contra un servidor en marcha |

### Estructura

```text
app/                 Interfaz: páginas, layouts, componentes y composables
server/api/          Endpoints REST
server/database/     Esquema de Drizzle y migraciones SQL
server/utils/        Base de datos, sesión, validación y rate limiting
shared/utils/        Plan, fechas, estadísticas, prompts y recursos (cliente y servidor)
tests/               Tests de Vitest
deploy/              nginx, despliegue, copias de seguridad y cron
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `NUXT_SESSION_PASSWORD` | Sí, en producción | Clave de al menos 32 caracteres para cifrar la cookie de sesión |
| `NUXT_REGISTRATION_OPEN` | No | `false` cierra el registro de cuentas nuevas. Por defecto `true` |
| `NUXT_DB_PATH` | No | Ruta del archivo SQLite. En Docker, `/data/consolida.db` |
| `CONSOLIDA_PORT` | No | Puerto local que publica Docker Compose. Por defecto `7150` |
| `CONSOLIDA_TAG` | No | Etiqueta de la imagen a ejecutar. Por defecto `latest` |

## API

Todas las rutas, salvo `health`, `auth/register` y `auth/login`, requieren sesión.

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio y de la base de datos |
| POST | `/api/auth/register` | Crea la cuenta e inicia sesión |
| POST | `/api/auth/login` | Inicia sesión |
| POST | `/api/auth/logout` | Cierra sesión |
| GET, PATCH, DELETE | `/api/me` | Perfil, actualización (nombre, inicio del plan) y borrado de cuenta |
| POST | `/api/me/password` | Cambio de contraseña |
| GET | `/api/me/export` | Exporta todos los datos en JSON |
| GET | `/api/progress` | Tareas completadas |
| PUT | `/api/progress/:taskKey` | Marca o desmarca una tarea |
| GET | `/api/journals` | Diarios semanales |
| PUT | `/api/journals/:week` | Guarda el diario de una semana |
| GET, POST | `/api/phrases` | Lista y crea frases |
| PATCH, DELETE | `/api/phrases/:id` | Edita o borra una frase |
| GET | `/api/phrases/anki` | Exporta las frases para importarlas en Anki |

## Despliegue

Cada push a `main` ejecuta CI, publica la imagen en `ghcr.io/daiv05/consolida` con las etiquetas `latest` y `sha-<commit>`, y la despliega en el servidor por SSH. La clave de despliegue está restringida en el servidor a ejecutar `deploy/deploy.sh`, que descarga la imagen, reinicia el contenedor y espera a que el healthcheck pase.

### Servidor desde cero

```bash
mkdir -p /var/www/consolida && cd /var/www/consolida
```

Copia `docker-compose.yml`, `deploy/deploy.sh` y `deploy/backup.sh` a esa carpeta, crea `.env` a partir de `.env.example` y genera la clave de sesión:

```bash
openssl rand -base64 48
```

Publica el sitio con nginx y certbot:

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/consolida
```

```bash
ln -s /etc/nginx/sites-available/consolida /etc/nginx/sites-enabled/consolida && nginx -t && systemctl reload nginx
```

```bash
certbot --nginx -d consolida.deras.dev
```

Arranca la app:

```bash
docker compose up -d
```

### Secretos y variables de GitHub

| Nombre | Tipo | Valor |
| --- | --- | --- |
| `DEPLOY_HOST` | Secret | IP o dominio del servidor |
| `DEPLOY_SSH_KEY` | Secret | Clave privada ed25519 cuya pública está en `authorized_keys` con `command="/var/www/consolida/deploy.sh"` |
| `DEPLOY_KNOWN_HOSTS` | Secret | Salida de `ssh-keyscan` del servidor |
| `APP_URL` | Variable del entorno `production` | URL pública, usada para el healthcheck tras desplegar |

### Copias de seguridad

`deploy/consolida.cron` ejecuta `backup.sh` cada día a las 03:15: hace una copia en caliente de SQLite, la comprime en `/backups/consolida` y conserva 14 días. Para restaurar, detén el contenedor, descomprime la copia y cópiala al volumen como `/data/consolida.db`.

## Seguridad

- Contraseñas con scrypt; la cookie de sesión va cifrada, es `HttpOnly` y `SameSite=Lax`.
- Rate limiting en registro, inicio de sesión y operaciones sensibles.
- Cada consulta se filtra por el usuario de la sesión; las entradas se validan con Zod.
- El contenedor se ejecuta sin root y solo escucha en `127.0.0.1`; nginx termina TLS.

Para reportar una vulnerabilidad, consulta [SECURITY.md](SECURITY.md).

## Créditos

El plan parte de las estrategias del paquete «Plan: Consolidación» de EnglishPlorers, ampliadas con una estructura gramatical por semana, días de descanso activo definidos, repaso espaciado y checkpoints de progreso.

## Licencia

[MIT](LICENSE)
