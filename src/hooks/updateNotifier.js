import React from 'react'

/*
How it works
=============
The hook periodically checks for /asset-manifest.json file
and then compares the content with an earlier snapshot stored in localStorage, 
if the content has changed meaning there is a new bundle update available 
and you can either notify user or reload page etc. 

/asset-manifest.json file is a common file available if you are using create-react-app 
or have configured webpack.


Why not use other PWA solutions based on service workers?
============================================================
Because they require SW setup which is clunky and doesn't work
everywhere (like WkWebview in iOS, hopefully in ios14 it will) so its not a cross platform
compatible solution. 

Our way is more "hacky" but simple. And you can always change the check logic.
Like instead of checking for asset-manifest.json you can check for any arbitrary
endpoint and compare results


Usage:
========

import useUpdateNotifier from './updateNotifier'

const YourAppRootComponent = props=>{
  useUpdateNotifier()

  return (
  ....Your Stuff
  )
}

 */

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
    return () => clearInterval(t)
  }, [config])

  return null
}
