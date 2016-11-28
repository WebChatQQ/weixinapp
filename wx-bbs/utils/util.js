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





// 登陆必要参数
function primaryLoginArgs(unionid) {
    // unionid = "oW2wBwUJF_7pvDFSPwKfSWzFbc5o";
    var sysInfo = wx.getSystemInfoSync();
    var versionCode = "1.0";
    var deviceType = sysInfo.model;
    var timestamp = ( new Date() ).getTime();    
    // var timestamp = Math.round(timestamp);
    var sign = crypt.getVerifyModel(unionid, versionCode, deviceType, timestamp);
    var verifyModel = {};
    verifyModel.deviceType = "ios9.0";//deviceType;
    verifyModel.deviceType = deviceType;
    verifyModel.timestamp = 1479174892808;//timestamp;
    verifyModel.timestamp = timestamp;
    verifyModel.uid = "oW2wBwUJF_7pvDFSPwKfSWzFbc5o"//unionid;
    verifyModel.uid = unionid;
    verifyModel.versionCode= "1.0"//versionCode;
    verifyModel.versionCode= versionCode;
    verifyModel.sign= "817AF07823E5CF86031A8A34FB593D1EC12A5499D66EBA10E7C4B6D034EF1C67A9C8FE9FF2A33F82"//sign;
    verifyModel.sign= sign;
    return verifyModel;
}


module.exports = {
  formatTime: formatTime,
  primaryLoginArgs:primaryLoginArgs,

}

