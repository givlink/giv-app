import utils from 'lib/utils'

export default function MessageRowItem({ message, group, authUser }) {
  //@Todo show name instead of id

  const isSenderCurrent = message?.senderId === authUser.uid

  const showName =
    group && Object.keys(group?.members).length > 2 && !isSenderCurrent
  return (
    <div
      className={`w-2/3 mb-2 rounded-lg ${
        isSenderCurrent
          ? 'chat-mine relative ml-auto bg-giv-blue-dark text-white'
          : 'mr-auto bg-gray-100 text-gray-800'
      }`}
    >
      {showName && (
        <span className='block pt-2 -mb-2 font-bold text-xs pl-2.5 underline'>
          {utils.snipText(message?.senderName, 20)}
        </span>
      )}
      <div className='pt-3 pb-2 px-2.5 mx-1'>
        <p className='whitespace-pre text-sm font-medium'>{message?.content}</p>
        <span
          className={`-mt-1 block text-right text-xs ${
            isSenderCurrent ? 'text-gray-200' : 'text-gray-400'
          } leading-none'`}
        >
          12:13
        </span>
      </div>
    </div>
  )
}
