# EquilibraMente

Webapp de autorregulacion para universitarios basada en Zimmerman y Goleman.

## Stack

- **Frontend:** Next.js App Router + PWA + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Hosting:** Vercel

## Estructura

```
src/
  modules/           # Feature-based modules (9 modulos)
  lib/               # Supabase client, errors
  types/             # TypeScript shared types
  config/            # Constants, emotions, achievements
  app/               # Next.js App Router pages
```

## Modulos

1. Estado Emocional — Check-in rapido con emojis/colores
2. Organizacion de Tareas — Registro de actividades academicas
3. Analisis de Carga — Detector de estres basado en carga
4. Recomendaciones Inmediatas — Acciones claras y rapidas
5. Regulacion Emocional — Respiracion guiada, audios relajantes
6. Monitoreo Diario — Seguimiento visual de progreso
7. Reflexion Breve — Preguntas de autorreflexion diaria
8. Logros y Motivacion — Rachas, logros, estadisticas
9. Perfil y Configuracion — Preferencias, notificaciones

## Code Rules

- Components max 200 lines | Hooks max 100 lines | Services max 300 lines
- Layer direction: app/ → modules/ → lib/ → types/
- No circular dependencies
- Tests: 85%+ component coverage, 90%+ service coverage

## Docs

Full architecture at ../docs/reference/technical-decisions.md
Module specs at ../docs/reference/modules/
Implementation plan at ../docs/reference/implementation-plan.md
