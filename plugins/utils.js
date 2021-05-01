import moment from "moment";

function isTimestamp(str) {
  return /^\d+$/.test(str);
}

function isIsoDate(str) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
  var d = new Date(str);
  return d.toISOString() === str;
}

//Vuex can't store firebase doc snapshot
//which is needed for calling posts api with offset
//so we store in a global var instead
let globalOffset = null;

const utils = {
  getGlobalOffset: () => globalOffset,
  setGlobalOffset: val => (globalOffset = val),
  parseUrl: path => {
    if (path && path.startsWith("http")) {
      return path;
    } else {
      return `${process.env.cdn}/${path}`;
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

  //@Todo better date parse. This func is finicky.
  //find a better universal date timestamp parser
  parseDate: date => {
    let d;
    if (typeof date.toDate !== "undefined") {
      date.toDate();
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
      str = moment(d)
        .utc()
        .format("YYYY.MM.DD");
    }
    return str;
  }
};

export default ({ app }, inject) => {
  inject("utils", utils);
};
