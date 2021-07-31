import moment from "moment";
const CDN_URL = "https://storage.googleapis.com/givlink.appspot.com";

function isTimestamp(str) {
  return /^\d+$/.test(str);
}

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str);
  return d.toISOString() === str;
}

const utils = {
  //@Todo better date parse. This func is finicky.
  //find a better universal date timestamp parser
  hideImageOnError: (e) => {
    console.log("got err:", e);
    e.target.src = "/icons/tama_def_sleepy.png";
    e.target.style.width = "120px";
  },
  //@Todo util for parsing duration ago.
  parseDate: (date) => {
    let d;
    if (typeof date.toDate !== "undefined") {
      d = date.toDate();
    } else if (isIsoDate(date)) {
      d = new Date(date);
    } else if (isTimestamp(date)) {
      d = new Date(parseFloat(date));
    }
    let str;
    try {
      str = moment(d).format("YYYY.MM.DD");
    } catch (err) {
      try {
        str = moment.unix(parseFloat(date) / 1000).format("YYYY.MM.DD");
      } catch (err) {
        str = moment(new Date(date)).format("YYYY.MM.DD");
      }
    }
    if (str === "Invalid date") {
      str = moment(d).utc().format("YYYY.MM.DD");
    }

    // console.log("input:", date, "output", str);
    return str;
  },
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  parseUrl: (path) => {
    if (path && path.startsWith("http")) {
      return path + `?height=500`; //for fb higher quality image
    } else {
      return `${CDN_URL}/${path}`;
    }
  },
  snipText: (text, maxLength = 130) => {
    let subText = text;
    if (text.length > maxLength) {
      subText = text.substring(0, maxLength);
      subText += "...";
    }
    return subText;
  },
};

export default utils;