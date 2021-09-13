import * as Sentry from '@sentry/browser'

const Err = {
  warn: msg => Sentry.captureMessage(msg),
  error: err => Sentry.captureException(err),
}

export default Err
