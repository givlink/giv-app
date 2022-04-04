import moment from 'moment'
import { format, formatDistance } from 'date-fns'

const CDN_URL = 'https://media2.giv.link'

const utils = {
  checkModerators: (id, allModerators = {}) => {
    let result = false
    Object.keys(allModerators).forEach(m => {
      if (id === m) result = true
    })
    return result
  },

  //@Todo better date parse. This func is finicky.
  //find a better universal date timestamp parser
  hideImageOnError: e => {
    console.log('got err:', e)
    e.target.src = '/icons/tama_def_sleepy.png'
    e.target.style.width = '120px'
  },
  parseAgo: date => {
    if (!date) return ''
    try {
      return formatDistance(new Date(date), new Date(), { addSuffix: true })
    } catch (err) {
      //@Todo sentry err
      console.log('err:', err)
      return 'N/A'
    }
  },
  //Gives duration if date too old else
  //gives just time
  parseSmartDate: date => {
    if (!date) return ''
    let d = date
    try {
      if (typeof d === 'string') {
        d = new Date(d)
      }

      const now = new Date()
      const diffDays = Math.ceil(Math.abs(now - d) / (1000 * 60 * 60 * 24))
      if (diffDays > 365) {
        return format(d, 'yy/MM')
      }
      if (diffDays > 30) {
        return format(d, 'MM/dd')
      }
      if (diffDays > 1) {
        // return formatDistance(d, new Date(), { addSuffix: true })
        return format(d, 'MMM dd haaa')
      } else {
        return format(d, 'HH:mm')
      }
    } catch (err) {
      //@Todo sentry err
      console.log('err:', err)
      return 'N/A'
    }
  },
  parseDate: date => {
    let d = new Date(date)
    let str
    try {
      str = moment(d).format('YYYY.MM.DD')
    } catch (err) {
      try {
        str = moment.unix(parseFloat(date) / 1000).format('YYYY.MM.DD')
      } catch (err) {
        str = moment(new Date(date)).format('YYYY.MM.DD')
      }
    }
    if (str === 'Invalid date') {
      str = moment(d).utc().format('YYYY.MM.DD')
    }

    return str
  },
  sleep: ms => new Promise(r => setTimeout(r, ms)),
  parseUrl: path => {
    if (!path) return path

    if (path && path.includes('facebook')) {
      return path + `?height=500` //for fb higher quality image
    } else {
      if (path.startsWith('http')) {
        return path
      }
      return `${CDN_URL}/${path}`
    }
  },
  snipText: (text = '', maxLength = 130) => {
    if (!text) return text
    let subText = text
    if (text.length > maxLength) {
      subText = text.substring(0, maxLength)
      subText += '...'
    }
    return subText
  },
}

export default utils
