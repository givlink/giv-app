import React from 'react'
import Steps from 'components/InviteSteps'
import Page1 from 'components/InvitePage1'
import Page2 from 'components/InvitePage2'
import Page3 from 'components/InvitePage3'
import Page4 from 'components/InvitePage4'
import Page5 from 'components/InvitePage5'
import Page6 from 'components/InvitePage6'
import { useLocation } from '@reach/router'
import { parse } from 'query-string'
import { ChevronLeftIcon } from '@heroicons/react/outline'

const steps = [
  { id: 'step1' },
  { id: 'step2' },
  { id: 'step3' },
  { id: 'step4' },
  { id: 'step5' },
]

export default function Invite() {
  const loc = useLocation()
  const searchParams = parse(loc.search)
  const [activeStepIndex, setActiveStepIndex] = React.useState(0)
  const [data, setData] = React.useState({})
  const [code, setCode] = React.useState('')

  React.useEffect(() => {
    if (loc.hash !== '') {
      let c = loc.hash.slice(1)
      c = c.split('?')[0] //remove params
      setCode(c)
      if (searchParams.step) {
        setActiveStepIndex(parseInt(searchParams.step))
      }
    }
  }, [loc, setCode, searchParams, setActiveStepIndex])
  React.useEffect(() => {
    setData(d => ({ ...d, code }))
  }, [code])

  const setInviteCode = code => {
    setCode(code)
    setData({ ...data, code })
  }
  const handleNext = newData => {
    if (newData) {
      setData({ ...data, ...newData })
    }

    let nextIndex = activeStepIndex + 1
    if (nextIndex > steps.length) nextIndex = steps.length
    setActiveStepIndex(nextIndex)
  }

  return (
    <div className='h-full flex flex-col items-center justify-center mx-auto max-w-2xl'>
        {activeStepIndex !== steps.length && (
          <div className='my-6'>
            <Steps steps={steps} activeStepIndex={activeStepIndex} />
          </div>
        )}
      {activeStepIndex === 0 && (
        <Page1
          code={code}
          setInviteCode={setInviteCode}
          activeStepIndex={activeStepIndex}
          handleNext={handleNext}
        />
      )}

      {activeStepIndex === 1 && (
        <Page2
          code={code}
          activeStepIndex={activeStepIndex}
          handleNext={handleNext}
        />
      )}

      {activeStepIndex === 2 && (
        <Page3 activeStepIndex={activeStepIndex} handleNext={handleNext} />
      )}
      {activeStepIndex === 3 && (
        <Page4 activeStepIndex={activeStepIndex} handleNext={handleNext} />
      )}
      {activeStepIndex === 4 && (
        <Page5 activeStepIndex={activeStepIndex} handleNext={handleNext} />
      )}
      {activeStepIndex === 5 && <Page6 data={data} />}
    </div>
  )
}
