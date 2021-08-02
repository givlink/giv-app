import React from 'react'

const DEFAULT_OPTS = {
  pollInterval: 10000, //ms
  disableInDev: false,
  key: 'assetManifest',
  fetchUrl: '/asset-manifest.json',
  onUpdateAvailable: () => {
    console.log('app update available.')
  },
}

export default function useUpdateNotifier(config = {}) {
  React.useEffect(() => {
    const opts = { ...DEFAULT_OPTS, ...config }

    if (opts.disableInDev && process.env.NODE_ENV === 'development') {
      return
    }

    const refetchAndCompare = async () => {
      try {
        const resp = await fetch(opts.fetchUrl)
        const result = await resp.json()
        const newValue = JSON.stringify(result)

        const value = window.localStorage.getItem(opts.key)
        if (value && newValue !== value) opts.onUpdateAvailable()

        window.localStorage.setItem(opts.key, newValue) //Save last checked value
      } catch (err) {
        console.warn('unable to check for app updates:', err.message)
      }
    }

    const t = setInterval(refetchAndCompare, opts.pollInterval)
    return () => {
      clearInterval(t)
    }
  }, [config])

  return null
}
