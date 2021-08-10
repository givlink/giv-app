import React from 'react'

const useScrollToBottom = (ref, items) => {
  React.useEffect(() => {
    console.log('ref is:', ref, ref.current?.scrollHeight)
    ref.current?.scrollIntoView()
    // window.scrollTo(0, ref.current.scrollHeight)
  }, [ref, items])

  return null
}

export default useScrollToBottom
