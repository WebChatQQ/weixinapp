

var util = require("../../utils/util.js")

var app = getApp()
var that;
var recordTimeInterval;
Page({
  data:{
    emoij:0,
    title:"",
    artContent:"",
    selectedCateogry:null,
    address:{
      "hidlat":"",
      "hidlng":"",
      "hidspeed":"",
      "hidaddress":"",
    },
    locationMsg:"点击确定位置",
    selectedImgs:[],
    voice:null,
    audioIcon:"http://i.pengxun.cn/content/images/voice/voiceplaying.png",
    recording : 0,
    playing : 0,
    hasRecorded : 0,
    recordTime : 0,
    formatedRecordTime:"00:00:00",
    voiceSelected:0,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
     that = this;
     that.init();
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
    that.setData({ voice:null, audioIcon:"http://i.pengxun.cn/content/images/voice/voiceplaying.png", recording : 0, playing : 0, 
      hasRecorded : 0, recordTime : 0, formatedRecordTime:"00:00:00", voiceSelected:0, tempRecordFile:"", locationMsg:"点击确定位置",
    })

    app.getInit(function(result){
        that.setData({"user":result.obj._LookUser, "minisns":result.obj._Minisns});
        that.setData({"categories":wx.getStorageSync('categories')});
    });

  },

  // 提交 TODO
  submit: function(event) {
    var that = this;
    console.log()
    var detail = event.detail;
    console.info(detail);
    var content = detail.value.artContent;
    var title = detail.value.title;
    if (content == "" || typeof content=="undefined") {
      // 弹出提示窗
      wx.showToast({ title: "内容不能为空", icon:"success", })
      return false;
    }
    if (that.data.selectedCateogry == null) {
      wx.showToast({ title: "请选择一个分类", icon:"success", })
      return false;
    }
    that.setData({ artContent:content, title:title })
    // 发帖
    app.getInit(function(result){
        let minisId = result.obj._Minisns.Id;
        let unionid = result.obj._LookUser.unionid;
        let tmpFile = result.obj.tmpFile;
        let verifyModel = util.primaryLoginArgs(unionid);
        let imgs = "";
        for (let i=0; i<that.data.selectedImgs; i++) {
            if (i=0){
              imgs = imgs + that.data.selectedImgs[i];
            } else {
              imgs = imgs + "," + that.data.selectedImgs[i]
            }
        }

        let data = {"deviceType":verifyModel.deviceType, 
                    "timestamp":verifyModel.timestamp,
                    "uid": unionid, 
                    "versionCode":verifyModel.versionCode, 
                    "sign":verifyModel.sign,
                    "id":minisId, "txtContentAdd": content}
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
        wx.uploadFile({
          url: 'http://apptest.vzan.com/minisnsapp/addart',
          filePath: tmpFile,
          name:'file',
          // header: {}, // 设置请求的 header
          formData: data, // HTTP 请求中其他额外的 form data
          success: function(res){
              console.log("发帖成功", res);
              wx.redirectTo({"url":"/pages/index/index"});
          }
        })
    })
    console.info("提交");
  },
  // 获取Content值
  saveContent: function(e){
      this.setData({"artContent":e.detail.value});
  },

  /**
   * 保存Title
   */
  saveTitle: function(e){
      this.setData({"title":e.detail.value});
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
        that.setData( {
          address: {"hidlat":latitude,"hidlng":longitude,"hidaddress":address},
          locationMsg:address
        });
        console.log(that.address);
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
      var code = event.currentTarget.dataset.code;
      var content = that.data.artContent + code;
      that.setData({ artContent:content })
  },
  // 获取图片
  selectImg: function(event) {
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
          var imgs = res.tempFilePaths;
          app.getInit(function(result){
              var minisId = result.obj._Minisns.Id;
              var unionid = result.obj._LookUser.unionid;
              var verifyModel = util.primaryLoginArgs(unionid);
              for (let i=0; i<imgs.length; i++){
                  wx.uploadFile({
                    url: 'http://apptest.vzan.com/minisnsapp/uploadfilebytype',
                    filePath:imgs[i],
                    name:'file',
                    // header: {}, // 设置请求的 header
                    formData: {"fid":minisId, "uploadType":"img", "deviceType":verifyModel.deviceType, "timestamp":verifyModel.timestamp, 
                              "uid": unionid, "versionCode":verifyModel.versionCode, "sign":verifyModel.sign}, // HTTP 请求中其他额外的 form data
                    success: function(res){
                        var result = JSON.parse(res.data);
                        // 刷新页面
                        var rtmp = that.data.selectedImgs;
                        rtmp = rtmp.concat({id:result.obj.id,src:result.obj.url});
                        that.setData({selectedImgs:rtmp});
                    }
                  })
              }
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
        var user = wx.getStorageSync('user');
        // 上传到服务器
        wx.uploadFile({
          url: 'https://String',
          filePath: res.tempFilePath,
          name:'file',
          // header: {}, // 设置请求的 header
          formData: {"minisnsId":that.data.minisnsId,"userid":user.id}, // HTTP 请求中其他额外的 form data
          success: function(res){
             that.setData({voice:{id:res.id,src:res.url}})
          },
        })
        that.setData({
            hasRecorded:1,
            recording:0,
            recordTime:0,
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
          // 上传录音
          var user = wx.getStorageSync('user');
          wx.uploadFile({
            url: 'https://String',
            filePath:res.tempFilePath,
            name:"file",
            // header: {}, // 设置请求的 header
            formData: {"minisnsId":that.data.minisnsId, "userid":user.id}, // HTTP 请求中其他额外的 form data
            success: function(res){
               that.setData({voice:{id:res.id, src:res.url}})
            }
          })
          that.setData( {
            recording:0,
            hasRecorded:1,
            formatedRecordTime: util.formatTime(that.data.recordTime)
          } )
          console.info("录音完成")
      },
      complete: function() {
         console.info("停止录音，Complete");
      }
    })
    that.setData({voiceSelected:0, recording:0,hasRecorded:1,recordTime:0,formatedRecordTime:"00:00:00"})  
    clearInterval(recordTimeInterval);
  },
  /**
   * 上传视频
   */
  selectVdeio: function(event) {
     var that = this;
      wx.chooseVideo({
        sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
        // maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
        camera: ['front', 'back'],
        success: function(res){
            var user = wx.getStorageSync('user') 
            // 上传到服务器
            wx.uploadFile({
              url: 'https://String',
              filePath:res.tempFilePath,
              name:'file',
              // header: {}, // 设置请求的 header
              formData: {"minisnsId":that.data.minisnsId, "userid":user.id}, // HTTP 请求中其他额外的 form data
              success: function(r){
                that.setData({voice:{id:r.id, src:r.url, duration:res.duration }})
              }
            })
        }
      })
  },
  // 悬赏
  selectReward:function(event) {
    var that = this;
    wx.showModal({
      title:"提示",
      content:"敬请期待"
    });
  },
  // 选择板块
  selectCategory: function(event) {
    var id = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.name;
    this.setData({selectedCateogry:{"Id":id, "Title":title}});
  },
  /**
   * 删除选择的版块
   */
  deleteCategory: function(event) {
      this.setData({selectedCateogry:null})
  }


})