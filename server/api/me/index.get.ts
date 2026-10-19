export default defineEventHandler(async event => publicUser(await requireUser(event)))
