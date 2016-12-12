// pages/usermodify/usermodify.js
var app = getApp()
var that
var api = require("../../utils/api.js")
var util = require("../../utils/util.js");
var constdata = require("../../utils/constdata.js");
Page({
  data: {
    "uploadImg": null
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this
    that.init()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  /**
   * 获取用户关注论坛列表
   */
  init: function () {
    let that = this;
    app.getInitData(function (result) {
      var tmpFile = result.obj.tmpFile;
      var minisns = result.obj._Minisns;
      var user = result.obj._LookUser;
      var verifyModel = util.primaryLoginArgs(user.unionid);
      that.setData({
        user: user,
        minisns: minisns,
        info: { articleCount: user.ArticleCount }
      })
    })
  },
  /**
   * 上传图片
   */
  uploadImg: function () {
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log("选择图片成功", res)
        let imgFiles = res.tempFilePaths || []
        util.showLoading("正在上传图片")
        let uploading = false
        for (let i = 0; i < imgFiles.length && !uploading; i++) {
          uploading = true
          let verifyModel = util.primaryLoginArgs()
          let data = {
            "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp, "uid": verifyModel.uid,
            "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
            "fid": constdata.minisnsId, "uploadType": "img"
          }
          console.log("上传图片参数", data, imgFiles[i])
          wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
            filePath: imgFiles[i],
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: data, // HTTP 请求中其他额外的 form data
            success: function (res) {
              console.log(res)
              let result = JSON.parse(res.data)
              if (result.result) {
                console.log("上传图片成功", imgFiles[i], result)
                that.setData({ "uploadImg": { "id": result.obj.id, "url": result.obj.url } })
              } else {
                console.log("上传图片失败", imgFiles[i], res)
              }
              util.endLoading()
              uploading = false
            },
            fail: function (res) {
              console.log("上传图片失败", imgFiles[i], res)
              util.endLoading()
              uploading = false
            }
          })
        }
      }
    })
  },
  /**
   * 确认修改
   */
  submit: function (e) {
    let nickName = e.detail.value.nickName
    let data = {}
    if (nickName) {
      data.nickName = nickName
    }
    if (uploadImg && uploadImg.id) {

    }
  }


})