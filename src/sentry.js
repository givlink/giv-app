import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

const disableInDev = true
const DSN =
  'https://f9986109c421440d877bec0ed85a899d@o516148.ingest.sentry.io/5622239'

Sentry.init({
  dsn: disableInDev && process.env.NODE_ENV === 'development' ? '' : DSN,
  integrations: [new Integrations.BrowserTracing()],
  normalizeDepth: 10,
  tracesSampleRate: 1.0,
})
