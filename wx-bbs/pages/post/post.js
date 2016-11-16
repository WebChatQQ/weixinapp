

var util = require("../../utils/util.js")

var app = getApp()
var that;
var recordTimeInterval;
Page({
  data:{
    emoij:0,
    title:"",
    artContent:"",
    location:{
      "hidlat":"",
      "hidlng":"",
      "hidspeed":"",
      "hidaddress":"",
    },
    locationMsg:"点击确定位置",
    selectedImgs:[{
      "src":"http://oss.vzan.cc/image/jpg/2016/6/29/104132817bf9689a7340798e7927d447ef56d7.jpg",
      "id":0
    },{
      "src":"http://oss.vzan.cc/image/jpg/2016/6/29/104132817bf9689a7340798e7927d447ef56d7.jpg",
      "id":1
    },{
      "src":"http://oss.vzan.cc/image/jpg/2016/6/29/104132817bf9689a7340798e7927d447ef56d7.jpg",
      "id":2
    },{
      "src":"http://oss.vzan.cc/image/jpg/2016/6/29/104132817bf9689a7340798e7927d447ef56d7.jpg",
      "id":3
    }],
    voice:null,
    audioIcon:"http://i.pengxun.cn/content/images/voice/voiceplaying.png",
    recording : 0,
    playing : 0,
    hasRecorded : 0,
    recordTime : 0,
    formatedRecordTime:"00:00:00",
    voiceSelected:0,
    tempRecordFile:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
     that = this;
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
    that.init();
  },
  onUnload:function(){
    // 页面关闭
    that.init();
  },

  init: function() {
    that.stopRecord()
    that.setData({
      voice:null,
      audioIcon:"http://i.pengxun.cn/content/images/voice/voiceplaying.png",
      recording : 0,
      playing : 0,
      hasRecorded : 0,
      recordTime : 0,
      formatedRecordTime:"00:00:00",
      voiceSelected:0,
      tempRecordFile:"",
      locationMsg:"点击确定位置",

    })
  },

  // 提交 TODO
  submit: function(event) {
    var detail = event.detail;
    console.info(detail);
    var content = detail.value.artContent;
    var title = detail.value.title;
    if (content == "" || typeof content=="undefined") {
      // 弹出提示窗
      wx.showToast({
        title: "内容不能为空",
        icon:"success",
      })
      return false;
    }
    that.setData({
      artContent:content
    })

    console.info("提交");
  },
  // 获取Content值
  getContent: function(){

  },
  // 定位
  getLocate: function() {
    console.info("定位")
    var that = this;
    wx.chooseLocation({
      success: function(res){
        var latitude = res.latitude;
        var longitude = res.longitude; 
        var address = res.address;
        that.data.location.hidlat = latitude;
        that.data.location.hidlng = longitude;
        that.data.location.hidaddress = address;
      }
    })
    // wx.getLocation({
    //   type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
    //   success: function(res){
    //     console.info(res)
    //     var latitude = res.latitude;
    //     var longitude = res.longitude;
    //     var speed = res.speed;
    //     that.data.location.hidlat = latitude;
    //     that.data.location.hidlng = longitude;
    //     that.data.location.hidspeed = res.speed;
    //   }
    // })
  },
  // 实现表情
  changeEmoij: function() {
    var emoij = that.data.emoij;
    if (emoij != 0) {
      emoij = 0;
    } else {
      emoij = 1
    }
    that.setData({
      emoij:emoij
    })
  },
  // 选择表情
  emoijSelected: function(event) {
      var title = event.currentTarget.dataset.title;
      var code = event.currentTarget.dataset.code;
      console.log("emoijSelected")
      console.log(title);
      console.log(code);
      var content = that.data.artContent + code;
      that.setData({
        artContent:content
      })
  },
  // 获取图片
  selectImg: function(event) {
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
          var imgs = res.tempFilePaths;
          var exisImgs = that.data.selectedImgs;

          for(var i = 0; i<imgs.length; i++) {
            // 上传图片
            // wx.uploadFile({
            //   url: 'https://String',
            //   filePath:imgs[i],
            //   name:'name',
            //   // header: {}, // 设置请求的 header
            //   // formData: {}, // HTTP 请求中其他额外的 form data
            //   success: function(res){
            //     // success
            //   }
            // })

            var img = {
              "src":imgs[i],
              "id": exisImgs.length
            }
            exisImgs.push(img);
          }
          that.setData({
            selectedImgs:exisImgs
          })
      }
    })
  },
  // 删除图片
  removeImg: function(event){
    var id = event.currentTarget.dataset.id;
    var imgs = that.data.selectedImgs;
    for (var i=0; i<imgs.length; i++) {
      if(imgs[i].id == id) {
        imgs.splice(i,1)
        break;
      }
    }
    that.setData({
      selectedImgs:imgs
    })
    console.info(that.data);
  },
  // 语音
  selectVoice: function() {
    console.log("语音")
    that.setData( {voiceSelected:1} )
  },

  /**
   * 开始录音
   */
  startRecord: function(){
    console.info("开始录音")
    that.setData({recording:1})
    recordTimeInterval = setInterval(function(){
        var recordTime = that.data.recordTime + 1;
        that.setData({
          recordTime : recordTime,
          formatedRecordTime: util.formatTime(recordTime)
        })
    }, 1000)
    wx.startRecord({
      success: function(res){
        that.setData({
            hasRecorded:1,
            recording:0,
            tempRecordFile:res.tempFilePath,
            recordTime:0
        })
      },
      complete: function() {
          that.setData({ recording:0, voiceSelected:0, formatedRecordTime:"00:00:00" })
          clearInterval(recordTimeInterval);
          console.info("StartRecord: 录音完成");
      }
    })
  },
  /**
   * 结束录音
   */
  stopRecord: function() {
    console.info("结束录音")
    wx.stopRecord({
      success: function(res){
          var recordTime = that.data.recordTime + 1;
          that.setData( {
            recording:0,
            hasRecorded:1,
            tempRecordFile:res.tempFilePath,
            formatedRecordTime: util.formatTime(recordTime)
          } )
          console.info("录音完成")
      },
      complete: function() {
         console.info("停止录音，Complete");
      }
    })
    that.setData({voiceSelected:0, recording:0,hasRecorded:1,recordTime:0,formatedRecordTime:"00:00:00"})  
    clearInterval(recordTimeInterval);
  }


})