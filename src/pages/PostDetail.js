import HeaderBack from 'components/HeaderBack'
import ComplaintModal from 'components/ComplaintModal'
import EditPost from 'components/EditPost'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from '@reach/router'
import { Carousel } from 'react-responsive-carousel'
import Spinner from 'components/Spinner'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import utils from 'lib/utils'
import SafeImage from 'components/SafeImage'
import RequestSuggestion from 'components/RequestSuggestion'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import Linkify from 'react-linkify'
import {
  ExclamationIcon,
  CalendarIcon,
  ChevronRightIcon,
  ArrowCircleRightIcon,
  HeartIcon as HeartIconOutline,
  XIcon,
  BanIcon,
} from '@heroicons/react/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid'
import { Link } from '@reach/router'
import api from 'lib/api'
import usePreserveScroll from 'hooks/scroll'
import actions from 'state/actions'

const DeleteCommentModal = ({ comment, postId, open, setOpen, onDelete }) => {
  const { t } = useTranslation()
  const cancelButtonRef = React.useRef(null)
  const closeModal = () => {
    setOpen(false)
  }
  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        as='div'
        static
        className='fixed z-10 inset-0 overflow-y-auto'
        initialFocus={cancelButtonRef}
        open={open}
        onClose={closeModal}
      >
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-150'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 opacity-75 transition-opacity' />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-150'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-100'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
              <div className='sm:flex sm:items-start'>
                <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                  <ExclamationIcon
                    className='h-6 w-6 text-red-600'
                    aria-hidden='true'
                  />
                </div>
                <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg leading-6 font-medium text-gray-900'
                  >
                    {t('Delete Comment')}
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      {t('Are you sure?')}
                    </p>
                  </div>
                </div>
              </div>
              <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                <button
                  type='button'
                  className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                  onClick={onDelete}
                >
                  {t('Delete')}
                </button>
                <button
                  type='button'
                  className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
                  ref={cancelButtonRef}
                  onClick={() => setOpen(false)}
                >
                  {t('Cancel')}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const CommentCard = ({ comment, user, onDelete }) => {
  const loc = useLocation()
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [complaintOpen, setComplaintOpen] = React.useState(false)

  const handleDelete = () => {
    //@Todo err handling
    api.deleteComment(comment.id)
    setDeleteOpen(false)
    onDelete(comment.id)
    //@Todo dispatch toast
  }

  const { highlightComment } = loc?.state || {}

  return (
    <div
      className={`flex mx-3 py-3 ${
        parseInt(highlightComment) === comment.id
          ? 'border-2 px-2 rounded-sm border-blue-500 shadow-xl'
          : 'border-b border-gray-200'
      }`}
    >
      <DeleteCommentModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onDelete={handleDelete}
      />
      <ComplaintModal
        open={complaintOpen}
        setOpen={setComplaintOpen}
        contentPathOverride={`/comments/${comment.id}`}
      />
      <div className='w-16 mr-2'>
        <img
          src={utils.parseUrl(comment.author.photoURL)}
          alt={comment.author.name}
          className='h-14 w-14 object-cover border-2 border-gray-500 mr-2 rounded-full'
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <span className='font-medium text-base sm:text-lg'>
            {comment.author.name}
          </span>
          {user && user.id === comment.author.id ? (
            <button
              onClick={() => setDeleteOpen(true)}
              className='p-2 rounded hover:bg-gray-100'
            >
              <XIcon className='h-4 w-4' />
            </button>
          ) : (
            <button
              onClick={() => setComplaintOpen(true)}
              className='p-2 rounded text-red-500 hover:bg-red-500 hover:text-white'
            >
              <BanIcon className='h-4 w-4' />
            </button>
          )}
        </div>
        <p
          className='pr-2 text-sm sm:text-base font-light'
          id={`comment-${comment.id}`}
        >
          {comment.message}
        </p>
        <span className='block text-gray-500 text-sm text-right'>
          {utils.parseDate(comment.createdAt)}
        </span>
      </div>
    </div>
  )
}

const UserSearchItem = ({ onSelect = () => {}, user }) => {
  return (
    <button
      onClick={() => onSelect(user)}
      className='focus:bg-gray-100 rounded w-full hover:bg-gray-100 text-sm px-2 py-1 flex items-center gap-2'
    >
      <SafeImage src={user.photoURL} className='w-8 h-8 rounded-full' />
      <span>{user.name}</span>
    </button>
  )
}

const CreateComment = ({ postId, onAddComment, postMembers }) => {
  const currUser = useSelector(s => s.user)
  const ref = React.createRef()
  const [userFilterActive, setUserFilterActive] = React.useState(false)
  const [userFilter, setUserFilter] = React.useState('')
  const [user, setUser] = React.useState(null)
  const [message, setMessage] = React.useState('')
  const [sending, setSending] = React.useState(false)

  const { t } = useTranslation()
  //@Todo this should be done in store
  React.useEffect(() => {
    if (!currUser) return
    api.getUserProfile(currUser.id).then(u => setUser(u))
  }, [currUser])

  const handleChange = e => {
    resizeTextarea(e)
    const newVal = e.target.value
    const currVal = message

    if (userFilterActive) {
      const items = newVal.split('@')
      if (items.length > 1) {
        //update filter
        setUserFilter(items.pop())
      }
    }

    if (newVal[newVal.length - 1] === '@') {
      setUserFilterActive(true)
    }
    //if currVal had @ but new one didn't that means we want to stop
    if (
      newVal[newVal.length - 1] !== '@' &&
      currVal[currVal.length - 1] === '@' &&
      newVal.length < currVal.length
    ) {
      setUserFilterActive(false)
    }

    setMessage(newVal)
  }

  const resizeTextarea = e => {
    let area = e.target
    area.style.height = 'auto'
    area.style.height = area.scrollHeight + 'px'
  }

  const messageValid = message && message !== ''
  const submitComment = async () => {
    setSending(true)
    const comment = await api.postComment({ postId, message, author: user })
    if (comment) {
      onAddComment(comment)
    }
    //@Todo err handle
    setSending(false)
    setMessage('')
  }

  if (!user) return null
  const filteredMembers = !!userFilter
    ? postMembers.filter(p =>
        p.name.toLowerCase().includes(userFilter.toLowerCase()),
      )
    : postMembers

  return (
    <div className='px-3 py-3 flex border-b border-gray-200'>
      <img
        src={utils.parseUrl(user.photoURL)}
        alt={user.displayName}
        className='h-14 w-14 object-cover border-2 border-gray-500 mr-2 rounded-full'
      />
      <div className='flex-1 relative'>
        {userFilterActive && (
          <div className='absolute left-2 bottom-full'>
            <div
              style={{ minWidth: '250px' }}
              className='mb-2 p-2 rounded text-sm bg-white shadow-xl border border-gray-200'
            >
              <span className='text-xs font-semibold'>Tag User</span>
              <ul className='space-y-2'>
                {filteredMembers.map(p => (
                  <UserSearchItem
                    onSelect={u => {
                      const newMsg = message.split('@')
                      newMsg.pop()
                      newMsg.push(u.name)
                      setMessage(newMsg.join('@'))
                      setUserFilter('')
                      setUserFilterActive(false)
                      ref.current.focus()
                    }}
                    key={p.id}
                    user={p}
                  />
                ))}
                {filteredMembers.length <= 0 && (
                  <span className='block text-xs py-3 px-2'>
                    No member found
                  </span>
                )}
              </ul>
            </div>
          </div>
        )}
        <textarea
          ref={ref}
          value={message}
          onChange={handleChange}
          placeholder={t('Your Comment')}
          style={{ maxHeight: '200px' }}
          className='resize-none w-full border border-gray-300 rounded'
        />
        <div className='flex justify-end'>
          {messageValid && (
            <button
              onClick={submitComment}
              disabled={!messageValid && !sending}
              className={`transition duration-150 flex items-center justify-center rounded-full h-12 w-12 ${
                messageValid
                  ? 'bg-giv-blue text-white'
                  : 'bg-gray-100 text-gray-300'
              }`}
            >
              {sending ? (
                <Spinner color='text-gray-100' />
              ) : (
                <ArrowCircleRightIcon className='h-8 w-8' />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const CommentList = ({ postId, postMembers }) => {
  const { t } = useTranslation()
  //@Todo move fetching to store
  const [comments, setComments] = React.useState([])
  const state = useSelector(s => ({
    user: s.user,
  }))

  React.useEffect(() => {
    if (!postId) return
    //@todo err handling
    api.listComments(postId).then(setComments)
  }, [postId])

  const onAddComment = comment => {
    setComments([comment, ...comments])
  }
  const onDeleteComment = id => {
    const newComments = comments.filter(c => c.id !== id)
    setComments(newComments)
  }

  let members = {}
  postMembers.forEach(p => {
    members[p.id] = p
  })
  comments.forEach(c => {
    members[c.author.id] = c.author
  })
  //Ignore your own tag
  members = Object.values(members).filter(m => m.id !== state.user?.id)

  return (
    <div>
      <h4 className='border-b border-gray-300 font-medium text-xl py-2 px-4'>
        {t('Comments')}
      </h4>
      <CreateComment
        postMembers={members}
        postId={postId}
        onAddComment={onAddComment}
      />
      <ul>
        {comments.map(c => (
          <li key={c.id}>
            <CommentCard
              comment={c}
              user={state.user}
              onDelete={onDeleteComment}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

//@Todo carousel Thumbs have some warning

const EmptyPost = () => {
  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <img
        className='w-24 h-24 animate-wobble-slow opacity-50'
        src='/icons/tama_def_sleepy.png'
        alt=''
      />
      <span className='text-sm text-gray-500 pt-2'>Post Not Found</span>
    </div>
  )
}

export default function PostDetail(props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const state = useSelector(s => ({
    post: s.postById[props.id],
    currUser: s.user,
    user: s.user,
    postSingleLoading: s.postSingleLoading,
    isLiked: s.postLikeById[props.id],
  }))
  const { post } = state

  usePreserveScroll('postDetail', true)
  React.useEffect(() => {
    if (state.isLiked === undefined) {
      //Else call api and update user list
      const run = async () => {
        //@Todo err handling
        const liked = await api.checkLiked(props.id, state.currUser?.id)
        dispatch({ type: 'postLike/data', postId: props.id, liked })
      }
      run()
    }
  }, [dispatch, state.user, state.isLiked, props.id, state.currUser])

  React.useEffect(() => {
    if (post) return

    //Else call api and update user list
    const run = async () => {
      //@Todo err handling
      dispatch({ type: 'posts/data_single_loading' })
      const post = await api.getPostById(props.id)
      dispatch({ type: 'posts/data_single', post })
    }
    run()
  }, [dispatch, post, props.id])

  const toggleLike = () => {
    dispatch(actions.setLiked(props.id, !state.isLiked))
  }

  const isMyPost = post?.author?.id === state.user?.id

  return (
    <div>
      <HeaderBack showComplaintButton={true} />
      <div className='pb-20 bg-white max-w-2xl mx-auto'>
        {!post && state.postSingleLoading ? (
          <div className='pt-24'>
            <Spinner />
          </div>
        ) : post ? (
          <>
            <Link to={`/users/${post.author.id}`}>
              <div className='flex items-center ml-4 py-5'>
                <img
                  src={utils.parseUrl(post.author.photoURL)}
                  alt={post.author.name}
                  className='h-20 w-20 object-cover border-2 border-gray-500 mr-2 rounded-full'
                />
                <h4 className='font-medium text-lg'>{post.author.name}</h4>
              </div>
            </Link>
            {post.images && (
              <Carousel
                showStatus={false}
                showThumbs={false}
                autoPlay={false}
                swipeScrollTolerance={20}
              >
                {post.images.map(i => (
                  <SafeImage
                    key={i}
                    src={utils.parseUrl(i)}
                    alt={post.title}
                    className='w-full object-cover md:rounded'
                    fallbackSrc={null}
                  />
                ))}
              </Carousel>
            )}
            <div className='px-4 pt-6 pb-4'>
              {isMyPost && <EditPost post={post} id={post.id} />}
              <h3 className='font-medium text-xl sm:text-xl mb-2'>
                {post.title}
              </h3>
              <p className='px-1 font-light text-sm sm:text-base whitespace-pre-wrap'>
                <Linkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      href={decoratedHref}
                      key={key}
                      className='underline text-giv-blue-dark'
                    >
                      {decoratedText}
                    </a>
                  )}
                >
                  {post.message}
                </Linkify>
              </p>
            </div>
            <div className='px-4 py-2 pb-8 flex items-center justify-between'>
              <button
                onClick={toggleLike}
                className={`${
                  state.isLiked
                    ? 'px-2 py-0.5 bg-red-600 text-white shadow-lg'
                    : 'text-red-500 pl-3 pr-4 py-1 border-red-400'
                } flex items-center rounded-md border`}
              >
                <Transition
                  appear={true}
                  show={state.isLiked || false}
                  enter='ease-out duration-300 transform transition-all'
                  enterFrom='opacity-0 -translate-y-2 rotate-45'
                  enterTo='opacity-100 translate-y-0 rotate-0'
                  leave=''
                  leaveFrom=''
                  leaveTo=''
                >
                  <HeartIconSolid className='h-7 w-7' />
                </Transition>
                {!state.isLiked && (
                  <>
                    <HeartIconOutline className='h-7 w-7 mr-2 text-red-400' />
                    Like
                  </>
                )}
              </button>
              <span className='flex items-center rounded-md pl-3 pr-4 py-1'>
                <CalendarIcon className='h-6 w-6 mr-1.5 text-gray-400' />
                {utils.parseDate(post.createdAt)}
              </span>
            </div>
            <Link to={`/users/${post.giver.id}`}>
              <div className='flex items-center mx-3 mb-3 px-3 py-3 border border-gray-200 rounded-xl hover:shadow-xl'>
                <img
                  src={utils.parseUrl(post.giver.photoURL)}
                  alt={post.giver.name}
                  className='h-24 w-24 object-cover shadow mr-4 rounded-full'
                />
                <div className='w-full flex flex-col'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <span className='text-sm font-medium text-giv-blue'>
                        {t('Giv sender')}
                      </span>
                      <h4 className='font-medium text-lg'>{post.giver.name}</h4>
                    </div>
                    <ChevronRightIcon className='h-6 w-6 text-gray-500' />
                  </div>
                </div>
              </div>
            </Link>

            <div className='px-3 py-4'>
              <h4 className='font-semibold text-sm text-giv-blue-dark'>
                {t('Giv Suggestion')}
              </h4>

              <div className=' grid grid-cols-2 gap-4'>
                <RequestSuggestion fromUser={state.user} toUser={post.giver} />
                <RequestSuggestion fromUser={post.giver} toUser={state.user} />
                <RequestSuggestion fromUser={state.user} toUser={post.author} />
                <RequestSuggestion fromUser={post.author} toUser={state.user} />
              </div>
            </div>
            <CommentList
              postId={props.id}
              postMembers={[post.giver, post.author]}
            />
          </>
        ) : (
          !state.postSingleLoading && <EmptyPost />
        )}
      </div>
    </div>
  )
}
