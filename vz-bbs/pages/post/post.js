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
    "artContent": "",
    "title": "",
    "voiceSelected": 0,
    "recording": 0,
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
   * 重置数据
   */
  resetData: function () {
    this.setData({
      "emoij": false, "title": "", "artContent": "", "selectedCateogry": null
      , "address": { "hidlat": "", "hidlng": "", "hidspeed": "", "hidaddress": "" }
      , "location": "点击确定位置", "selectedImgs": null, "voice": null
      , "recording": 0, "playing": 0
    })
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
  },

  /**
   * 
   */
  // 选择板块
  selectCategory: function (event) {
    var id = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.name;
    this.setData({ selectedCateogry: { "Id": id, "Title": title } });
  },
  /**
   * 删除选择的版块
   */
  deleteCategory: function (event) {
    this.setData({ selectedCateogry: null })
  },


  /**
   * 播放语音
   */
  playAudio: function (e) {
    let vid = e.currentTarget.dataset.id;
    let vSrc = e.currentTarget.dataset.vSrc;
    util.playVoice(vid, vSrc)
  },


  /**
   * 保存
   */
  submit: function (event) {
    var that = this;
    console.log()
    var detail = event.detail;
    console.info(detail);
    var content = detail.value.artContent;
    var title = detail.value.title;
    if (content == "" || typeof content == "undefined") {
      // 弹出提示窗
      wx.showToast({ title: "内容不能为空", icon: "success", })
      return false;
    }
    if (that.data.selectedCateogry == null) {
      wx.showToast({ title: "请选择一个分类", icon: "success", })
      return false;
    }
    that.setData({ artContent: content, title: title })
    // 发帖
    app.getInitData(function (result) {
      let minisId = result.obj._Minisns.Id;
      let unionid = result.obj._LookUser.unionid;
      let tmpFile = result.obj.tmpFile;
      let verifyModel = util.primaryLoginArgs(unionid);
      let imgs = "";
      if (that.data.selectedImgs) {
        for (let i = 0; i < that.data.selectedImgs.length; i++) {
          if (i == 0) {
            imgs = imgs + that.data.selectedImgs[i].id;
          } else {
            imgs = imgs + "," + that.data.selectedImgs[i].id
          }
        }
      }
      let data = {
        "deviceType": verifyModel.deviceType,
        "timestamp": verifyModel.timestamp,
        "uid": unionid,
        "versionCode": verifyModel.versionCode,
        "sign": verifyModel.sign,
        "id": minisId, "txtContentAdd": content
      }
      if (that.data.voice) {
        data.hidrecordId = that.data.voice.id;
      }
      if (title != "" && title != null && typeof title != "undefined") {
        data.txtTitle = title;
      }
      if (that.data.selectedCateogry) {
        data.choosedType = that.data.selectedCateogry.Id
      }
      if (imgs != "") {
        data.hImgIds = imgs
      }
      if (that.data.address) {
        if (that.data.address.hidlat != "") {
          data.hidlat = that.data.address.hidlat
        }
        if (that.data.address.hidlng != "") {
          data.hidlng = that.data.address.hidlng
        }
        if (that.data.address.hidspeed != "") {
          data.hidspeed = that.data.address.hidspeed
        }
        if (that.data.address.hidaddress != "") {
          data.hidaddress = that.data.address.hidaddress
        }
      }

      api.addArt(data)
        .then(function (success) {
          console.log("发帖成功", success)
          wx.showModal({ "title": "提示", "content": "发帖成功", "showCancel": false })
          that.resetData()
        }, function (fail) {
          console.log("发帖失败", fail)
          wx.showModal({ "title": "提示", "content": "发帖失败", "showCancel": false })
          that.resetData()
        })
    })
  },

  /*************************************录音***************************************************** */
  /**
   * 录音 
   */
  selectVoice: function () {
    console.log("语音")
    that.setData({ "voiceSelected": 1 })
  },


  /**
   * 开始录音
   */
  startRecord: function () {
    let that = this;
    that.setData({ recording: 1 })
    // recordTimeInterval = setInterval(function () {
    //   var recordTime = that.data.recordTime + 1;
    //   that.setData({
    //     recordTime: recordTime,
    //     formatedRecordTime: util.formatTime(recordTime)
    //   })
    // }, 1000)
    wx.startRecord({
      success: function (res) {
        var user = that.data.user;
        console.log("录音结束", res)
        // 上传到服务器
        wx.uploadFile({
          url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
          filePath: res.tempFilePath,
          name: 'file',
          // header: {}, // 设置请求的 header
          formData: { "uploadType": "audio", "fid": that.data.minisns.Id }, // HTTP 请求中其他额外的 form data
          success: function (res) {
            let result = JSON.parse(res.data)
            if (result.result) {
              console.log("上传录音成功", result)
              that.setData({ "voice": { "id": result.obj.id, "url": result.obj.url } })
            } else {
              console.log("上传录音失败", result)
            }
          },
          fail: function (res) {
            console.log("上传录音失败", res)
            that.setData({ hasRecorded: 1, recording: 0, recordTime: 0, })
          }
        })
      },
      fail: function (res) {
        console.info("录音失败", res);
        that.setData({ recording: 0, voiceSelected: 0, formatedRecordTime: "00:00:00" })
        // clearInterval(recordTimeInterval);
      }
    })
  },/**
   * 结束录音
   */
  stopRecord: function () {
    wx.stopRecord({
      success: function (res) {
        console.log("结束录音成功", res)
        // 上传录音
        var user = wx.getStorageSync('user');
        wx.uploadFile({
          url: 'https://snsapi.vzan.com/minisnsapp/uploadfilebytype',
          filePath: res.tempFilePath,
          name: "file",
          // header: {}, // 设置请求的 header
          formData: { "uploadType": "audio", "fid": that.data.minisns.Id }, // HTTP 请求中其他额外的 form data
          success: function (res) {
            let result = JSON.parse(res.data);
            if (result.result) {
              console.log("上传录音成功", result)
              that.setData({ "voice": { "id": result.obj.id, "udl": res.obj.url } })
            } else {
              console.log("上传录音失败", result)
            }
          },
          fail: function (res) {
            console.log("上传录音失败", res)
            that.setData({ "recording": 0, hasRecorded: 1, formatedRecordTime: util.formatTime(that.data.recordTime) })
          }
        })
      },
      fail: function (res) {
        console.info("停止录音失败", res);

        that.setData({ recording: 0, hasRecorded: 1, formatedRecordTime: util.formatTime(that.data.recordTime) })
        that.setData({ voiceSelected: 0, recording: 0, hasRecorded: 1, recordTime: 0, formatedRecordTime: "00:00:00" })
        // clearInterval(recordTimeInterval);
      }
    })
  },
  /**
   *  取消录音 
   */
  cancleRecord: function () {
    wx.stopRecord({
      success: function (res) {
        console.log("取消录音成功", res)
      },
      fail: function (res) {
        console.log("取消录音失败", res)
      }
    })
    this.setData({ "voiceSelected": 0, "recording": 0 })
  },

})