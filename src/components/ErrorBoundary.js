import React from 'react'
import Err from 'lib/err'
import { RefreshIcon } from '@heroicons/react/outline'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    error.errorInfo = errorInfo
    if (error.message !== 'Network Error') {
      Err.error(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='relative w-screen h-screen space-y-4 flex flex-col items-center justify-center'>
          <img
            className='w-24 h-24 animate-wobble-slow opacity-10'
            src='/icons/tama_def_sleepy.png'
            alt=''
          />
          <h1 className='font-semibold text-2xl text-red-600'>
            エラーが発生しました！
          </h1>
          <h2 className='font-medium text-lg'>
            {this.state.error && this.state.error.message}
          </h2>
          <button
            onClick={() => (window.location.href = '/')}
            className='flex items-center gap-2 bg-giv-blue font-medium text-white px-8 py-4 rounded'
          >
            <RefreshIcon className='h-6 w-6' />
            アップリを再起動する？
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
