# Cómo contribuir

1. Abre un issue antes de un cambio grande para acordar el enfoque.
2. Crea una rama desde `main` y sigue [Conventional Commits](https://www.conventionalcommits.org/es/) en los mensajes (`feat(plan): …`, `fix(api): …`).
3. Antes de abrir el PR, ejecuta `npm run typecheck`, `npm test` y `npm run build`.
4. Si cambias `server/database/schema.ts`, incluye la migración generada con `npm run db:generate`.
5. Si cambias el contenido del plan, no renombres las claves de tareas existentes (`w1.d0.listen`): están guardadas en el progreso de los usuarios.

## Estilo

- TypeScript estricto, dos espacios, comillas simples y sin punto y coma.
- Documenta funciones con JSDoc solo cuando aporte algo que el nombre no dice; sin comentarios dentro de la lógica.
- Textos de la interfaz en español, en segunda persona y en voz activa.
