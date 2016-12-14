var crypt = require("./crypt.js")
import Promise from './es6-promise.min.js';

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

/**
 * 解析时间
 */
function dataStrFormater(data) {
  let nowIndex = data.indexOf("刚刚")
  let mIndex = data.indexOf("分钟")
  let hIndex = data.indexOf("小时")
  let sIndex = data.indexOf("秒")
  let dIndex = data.indexOf("天")
  let tIndex = data.indexOf("-")
  let result = 0;
  let numStr = ""
  if (nowIndex > -1) {
    result = 0;
  }
  if (sIndex > -1) { // Second
    numStr = data.substring(0, sIndex)
    result = parseInt(numStr)
  }
  if (mIndex > -1) { // Minute
    numStr = data.substring(0, mIndex)
    result = parseInt(numStr) * 60
  }
  if (hIndex > -1) { // Hour
    numStr = data.substring(0, hIndex)
    result = parseInt(numStr) * 3600
  }
  if (dIndex > -1) { // Day
    numStr = data.substring(0, dIndex)
    result = parseInt(numStr) * 3600 * 24
  }
  if (tIndex > -1 && tIndex < 3) {
    data = new Date().getFullYear() + "-" + data
    result = Date.parse(data) / 1000
  }
  if (tIndex > 3) {
    result = Date.parse(data) / 1000
  }
  return result
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * json 2 string
 */
function json2String(json) {
  let reply = []
  for (let prop in json) {
    reply.push(prop + "=" + json[prop])
  }
  return reply.join("&")
}


// 举报
function tipOff(user) {
  console.info("举报");
}

// 登陆必要参数
function primaryLoginArgs() {
  let unionid = wx.getStorageSync('unionId')
  let sysInfo = wx.getSystemInfoSync()
  let versionCode = "1.0"
  let deviceType = sysInfo.model
  deviceType = deviceType.toLowerCase().indexOf("iphone") > -1 ? "iPhone" : deviceType
  console.log("设备", deviceType, deviceType.toLowerCase(), deviceType.toLowerCase().indexOf("iphone"))
  let timestamp = (new Date()).getTime()
  // let timestamp = Math.round(timestamp);
  let sign = crypt.getVerifyModel(unionid, versionCode, deviceType, timestamp);
  let verifyModel = {};
  verifyModel.deviceType = deviceType //"ios9.0"
  verifyModel.timestamp = timestamp + ""// 1479174892808
  verifyModel.uid = unionid//"oW2wBwUJF_7pvDFSPwKfSWzFbc5o"
  verifyModel.versionCode = versionCode + ""//"1.0"
  verifyModel.sign = sign//"817AF07823E5CF86031A8A34FB593D1EC12A5499D66EBA10E7C4B6D034EF1C67A9C8FE9FF2A33F82"
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
    // if (article.Address) {
    //   let address = JSON.parse(article.Address);
    //   article.Address = address;
    // }
    article.ContentDesc = that.htmlFilter(article.ContentDesc)
    // if (article.ContentDesc) {
    // article.ContentDesc = article.ContentDesc.replace(/<\s*span/g,"<text")
    // article.ContentDesc = article.ContentDesc.replace(/<\s*\/\s*span\s*>/g,"</text>")
    // }
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

/**
 * 模态框
 */
function modelBox(title = "提示", content = "暂不支持", showCancel = false) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      "title": title,
      "content": content,
      "showCancel": showCancel,
      "success": function (res) {
        if (res.confirm) {
          resolve(res)
        } else {
          reject(res)
        }
      },
      "fail": function (res) {
        reject(res)
      }
    })
  })
}

/**
 * 帖子评论过滤
 */
function commentFilter(commentList) {
  let array = commentList
  if (commentList) {
    commentList.forEach(function (item) {
      if (item.Content) {
        item.Content = htmlFilter(item.Content)
      }
      if (item.SubArticleComments) {
        for (let idx in item.SubArticleComments) {
          if (item.SubArticleComments[idx] && item.SubArticleComments[idx].Content) {
            item.SubArticleComments[idx].Content = htmlFilter(item.SubArticleComments[idx].Content)
            array.push(item.SubArticleComments[idx])
          } else {
            array.push(item.SubArticleComments[idx])
          }
        }
      }
    })
    // 按时间排序
    array.sort(function (a, b) {
      let aTime = dataStrFormater(a.CreateDate)
      let bTime = dataStrFormater(b.CreateDate)
      if (aTime > bTime) {
        return 1
      }
      if (aTime = bTime) {
        return 0
      }
      if (aTime < bTime) {
        return -1
      }
    })
  }
  return array
}


function imgArrayToString(imgsArray) {
  var imgs = "";
  if (imgsArray) {
    for (var i = 0; i < imgsArray.length; i++) {
      if (i == 0) {
        imgs = imgsArray[i].id;
      } else {
        imgs = imgs + "," + imgsArray[i].id;
      }
    }
  }
  return imgs
}


module.exports = {
  dataStrFormater,
  "formatTime": formatTime,
  "primaryLoginArgs": primaryLoginArgs,
  "playVoice": playVoice,
  "htmlFilter": htmlFilter,
  "articleFilter": articleFilter,
  "showLoading": showLoading,
  "endLoading": endLoading,
  imgArrayToString,
  json2String,
  modelBox,
  commentFilter,
}

