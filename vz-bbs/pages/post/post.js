// pages/post/post.js
var api = require("../../utils/api.js")
var util = require("../../utils/util.js");
var constdata = require("../../utils/constdata.js");

var that
var app = getApp()
Page({
  data: {
    "location": "点击发送地理位置",
    "selectedImgs": null, //[{"id":id,"url":url}]
    "redioVoice": null,//{"id":id, "url":url}
    "showVedio": false,
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

  init: function () {
    app.getInitData(function (initData) {
      that.setData({ "user": initData.obj._LookUser, "minisns": initData.obj._Minisns });
      that.setData({ "categories": wx.getStorageSync('categories') });
    })
  },
  /**
   * 展示表情框
   */
  showEmoijBox: function (e) {
    console.log("展示表情框", e)
    wx.showModal({ "title": "提示", "content": "暂不支持", "showCancel": false })
  },
  /**
   * 选择图片
   */
  selectImg: function (e) {
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log("选择图片成功", res)
        let imgFiles = res.tempFilePaths || []
        let selectedImgs = that.data.selectedImgs || []
        let uploading = false;
        for (let i = 0; i < imgFiles.length && !uploading; i++) {
          uploading = true
          let verifyModel = util.primaryLoginArgs()
          wx.uploadFile({
            url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
            filePath: imgFiles[i],
            name: 'file',
            // header: {}, // 设置请求的 header
            formData: {
              "deviceType": verifyModel.deviceType, "timestamp": verifyModel.timestamp, "uid": verifyModel.uid,
              "versionCode": verifyModel.versionCode, "sign": verifyModel.sign,
              "fid": constdata.minisnsId, "uploadType": "img"
            }, // HTTP 请求中其他额外的 form data
            success: function (res) {
              console.log(res)
              let result = JSON.parse(res.data)
              if (result.result) {
                console.log("上传图片成功", imgFiles[i], result)
                selectedImgs.push({ "id": result.obj.id, "url": result.obj.url })
                that.setData({ "selectedImgs": selectedImgs })
              } else {
                console.log("上传图片失败", imgFiles[i], res)
              }
              uploading = false
            },
            fail: function (res) {
              console.log("上传图片失败", imgFiles[i], res)
              uploading = false
            }
          })
        }
      }
    })
  },
  /**
   * 删除图片
   */
  removeImg: function (e) {
    let id = e.currentTarget.dataset.id
    let imgs = this.data.selectedImgs || []
    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i].id == id) {
        imgs.splice(i, 1)
        break
      }
    }
    that.setData({ "selectedImgs": imgs })
  },
  /**
   * 选择位置
   */
  selectLocation: function (e) {
    console.info("定位")
    wx.chooseLocation({
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var address = res.address;
        that.setData({
          "address": { "hidlat": latitude, "hidlng": longitude, "hidaddress": address },
          "location": address
        });
        console.log(that.data.address);
      }
    })
  },
  /**
   * 打开视频选择框
   */
  selectVdeio: function () {
    this.setData({ "showVedio": !this.data.showVedio })
  }


})