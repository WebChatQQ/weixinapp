var crypt = require("./crypt.js")
var app = getApp();

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}



function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2FormData(json) {
  let result = []
  for(let prop in json) {
    result.push(prop + "=" +json[prop])
  }
  return result.join("&")
}

// 举报
function tipOff(user) {
  console.info("举报");
}

// 登陆必要参数
function primaryLoginArgs(unionid) {
  var sysInfo = wx.getSystemInfoSync();
  var versionCode = 1;
  var deviceType = sysInfo.model;
  var timestamp = (new Date()).getTime();
  // var timestamp = Math.round(timestamp);
  var sign = crypt.getVerifyModel(unionid, versionCode, deviceType, timestamp);
  var verifyModel = {};
  verifyModel.deviceType = "ios9.0";//deviceType;
  verifyModel.timestamp = 1479174892808;//timestamp;
  verifyModel.uid = "oW2wBwUJF_7pvDFSPwKfSWzFbc5o"//unionid;
  verifyModel.versionCode = "1.0"//versionCode;
  verifyModel.sign = "817AF07823E5CF86031A8A34FB593D1EC12A5499D66EBA10E7C4B6D034EF1C67A9C8FE9FF2A33F82"//sign;
  return verifyModel;
}


/**
 * 播放声音
 */
function playVoice(vId, vSrc) {
  console.info("播放声音", vId, vSrc);
  var storageVoice = wx.getStorageSync('playingVoice');
  var audioContext = wx.createAudioContext(vId + "");
  // 获取正在播放的内容
  if (typeof storageVoice == "undefined" || storageVoice == "" || storageVoice == null) {
    // 当前未播放
    audioContext.play();
    storageVoice = new Object();
    storageVoice.id = vId;
    storageVoice.status = 2;
    storageVoice.src = vSrc;
  } else if (storageVoice.id == vId) {
    // 暂定状态
    if (storageVoice.status == 1) {
      audioContext.play();
      storageVoice.status = 2;
    } else
      // 播放状态 - 转为暂停
      if (storageVoice.status == 2) {
        audioContext.pause();
        storageVoice.status = 1;
      }
  } else {
    // 停止当前的，播放另一个
    var usingAudioContext = wx.createAudioContext(storageVoice.id + "")
    usingAudioContext.seek(0)
    usingAudioContext.pause()
    storageVoice = new Object()
    storageVoice.id = vId
    storageVoice.status = 2
    storageVoice.src = vSrc
    audioContext.play()
  }
  wx.setStorageSync('playingVoice', storageVoice)
}

/**
 * 过滤HTML标签
 */
function htmlFilter(content) {
  if (content) {
    let regExp = new RegExp("</?[^>]*>", "g");
    let regExp2 = new RegExp("</[^>]*>", "g");
    content = content.replace(regExp2, "")
    return content.replace(regExp, "")
  }
  return content
}

/**
 * 过滤Articles中的标签
 */
function articleFilter(articles) {
  let that = this
  articles.forEach(function (article) {
    article.ContentDesc = that.htmlFilter(article.ContentDesc)
    if (article.articleComments) {
      article.articleComments.forEach(function (comment) {
        if (comment) {
          comment.Content = that.htmlFilter(comment.Content)
        }
      })
      article.articleComments = article.articleComments.reverse()
    }
  })
  return articles;
}

/**
 * 开启加载框
 */
function showLoading(title = "加载中", duration = 10000) {
  wx.showToast({
    title: title,
    icon: 'loading',
    duration: duration
  })
}

/**
 * 关闭加载框
 */
function endLoading() {
  wx.hideToast()
}


module.exports = {
  "formatTime": formatTime,
  "primaryLoginArgs": primaryLoginArgs,
  "playVoice": playVoice,
  "htmlFilter": htmlFilter,
  "articleFilter": articleFilter,
  "showLoading": showLoading,
  "endLoading": endLoading,
  json2FormData,
}

