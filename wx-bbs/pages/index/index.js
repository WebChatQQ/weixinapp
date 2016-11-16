var index = require("../../data/index-list.js")
var util = require("../../utils/util.js")
var comobj = require("../../obj/comobj.js")
var crypt = require("../../utils/crypt.js")
var api = require("../../utils/api.js")


//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    articles: [],
    pageIndex:1,
    pageSize:2,
    audioIcon:"http://i.pengxun.cn/content/images/voice/voiceplaying.png",
    typeList:[],
    currentTypeId:0,
    hot:0,
    scrollLeft:0,
    headInfo:{
      "backMap":"http://i.pengxun.cn/images/bms1/050_app[1].jpg",
      "logoUrl":"http://i.pengxun.cn/upload/thumbnail/20150923/130874432266460890.jpg",
      "articleCount":23131,
      "clickCount":1231,
      "isSign":"true",
      "isConcern":"false"
    },
    categories:[{
        "id" : 0,
        "title" : "全部"
      },{
        "if" : 3132,
        "title" : "运营日报"
      },{
        "id" : 875,
        "title" : "操作指南"
      },{
        "id" : 2038,
        "title" : "常见问题"
      },{
        "id" : 2033,
        "title" : "微赞故事"
      },{
        "id" : 1,
        "title" : "更新进度"
      }]
    },

  onLoad: function () {
    console.log('onLoad')
    var that = this

    var sysInfo = wx.getSystemInfoSync();

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    this.ready();
  },
  more_bankuai: function () {
    console.log ("获取更多版块");
  },
  // 加载数据
  ready: function () {
    this.setData({
      articles:index.articles.slice(0,10),
      typeList:index.typeList
    })
  },
  moreArticle: function (event) {
    console.log ("moreArticle: 加载更多");
    console.log("moreArticle: pageIndex: " + event.currentTarget.dataset.pageIndex);
    wx.showNavigationBarLoading();
    var first = (this.data.pageIndex) * this.data.pageSize;
    this.getArticle(first);
  },
  getArticle:function(first) {
    console.info(first);
    if ( (first == "undefined") || (first == null) ) {
      first = 1;
    }
    if (first > index.articles.length) {
      wx.hideNavigationBarLoading();
      return
    }
    var end = first + this.data.pageSize;
    if (end > index.articles.length) {
        end = index.articles.length;
    }
    var newArticle = index.articles.slice(first, end);
    this.setData({
      articles:this.data.articles.concat(newArticle),
      pageIndex:parseInt(this.data.pageIndex)+1
    });
    wx.hideNavigationBarLoading();
  },
  // 点击版块跳转
  toBankuai: function (event) {
    console.log("点击版块跳转");
    console.log(event);
    var typeId = event.currentTarget.dataset.typeid;
    var hot = event.currentTarget.dataset.hot;
    if (hot) {
      typeId = 0;
      hot = 1;
    } else {
      typeId= typeId;
      hot = 0;
    }
    console.log(this.data.currentTypeId);
    console.log(this.data.hot);
    this.setData({
      articles:this.data.articles,
      currentTypeId:typeId,
      hot:hot
    });
  },
  // 展开箭头 举报
  openArrow: function(event) {
    console.info("openArrow: ");
    var user = event.currentTarget.dataset.userId;
    console.log(user)
    wx.showActionSheet({
        itemList:["举报", "取消"],
        success: function(res) {
          if (res.tapIndex==0) {
            // 举报
            console.info("举报");
            util.tipOff(user);
          }
        }
    });
  },
  // 播放声音
  playAudio: function(event) {
    console.info ("播放声音");
    var voiceId = event.currentTarget.dataset.vId;
    console.info (voiceId);
    var storageVoice =  app.globalData.voice;
    var audioContext = wx.createAudioContext(voiceId+"");
    // 获取正在播放的内容
    if (typeof storageVoice == "undefined" || storageVoice == "" || storageVoice == null) {
        // 当前未播放
        audioContext.play();
        storageVoice = new Object();
        storageVoice.id=voiceId;
        storageVoice.status=2;
      } else if(storageVoice.id == voiceId) {
        // 暂定状态
        if (storageVoice.status == 1) {
          audioContext.play();
          storageVoice.status=2;
        } else
        // 播放状态 - 转为暂停
        if (storageVoice.status == 2) {
            audioContext.pause();
            storageVoice.status=1;
        }
      } else {
        // 停止当前的，播放另一个
        var usingAudioContext = wx.createAudioContext(storageVoice.id+"")
        usingAudioContext.seek(0);
        usingAudioContext.pause();
        storageVoice = new Object();
        storageVoice.id = voiceId;
        storageVoice.status = 2;
        audioContext.play();
      }
      app.setGlobalData({
          voice:storageVoice
      })

  },
  // 更多版块
  moreType: function(event) {
    var that = this;
    var types = app.globalData.types;
    console.log(event);
    if (typeof types == "undefined") {
      return ;
    }
    var typeIds = [];
    var typeNames = [];
    for (var i = 0; i < types.length; i++) {
      typeIds[i] = types[i].ArticleTypeID;
      typeNames[i] = types[i].ArticleTypeName;
    }
    wx.showActionSheet({
        itemList:typeNames,
        success:function(res){
          if (res.cancel) {
            console.log("取消");
          } else {
            // 获取新的内容
            var idx = res.tapIndex;
            var typeId = typeIds[idx];
            that.typeChange(typeId);
          }
        }
    })
  },
  // 切换版块
  typeChange: function(typeId) {
      var that = this;
      var pn = 1;
      var h = 0;
      var hongbao = "";
      var rspan = 1;      
      app.getMoreArticle(pn, typeId, h, hongbao, rspan, function(res){
          var articleList = res.ArtList;
          that.data.articles = that.data.articles(articleList);
      })
      var tmp = this.data.typeList;
      var typeList = tmp;
      for (var i=0 ; i<typeList.length ; i++) {
          if (typeList[i].ArticleTypeID == typeId) {
            var tmpType={
                ArticleTypeID:typeId,
                ArticleTypeName:typeList[i].ArticleTypeName
            }
            typeList.splice(i,1);
            typeList.splice(1, 0, tmpType);
          }
      }
      that.setData({
        currentTypeId : typeId,
        typeList:typeList,
        scrollLeft:-900
      })
      console.log(this.data.currentTypeId);
  },

  showIndexPage: function() {

  },
  // 展示首页Head信息
  showHeadInfo: function() {
    var that = this;
    var verifyModel = util.primaryLoginArgs();
    var data = {
      "deviceType": verifyModel.deviceType,
      "uid": verifyModel.uid,
      "versionCode":verifyModel.versionCode,
      "timestamp": verifyModel.timestamp,
      "sign":verifyModel.sign,
      "id":"3"
    }; 
    api.headInfo(data, function(res) {
      if (res.result == "false") {
        // TODO 异常处理
        return 
      } 
      headInfo = {
        "backMap":res.obj.BackMap,
        "logoUrl":res.obj.LogoUrl,
        "articleCount":res.obj.ArticleCount,
        "clickCount":res.obj.ClickCount,
        "isSign":res.obj.IsSign,
        "isConcern":res.obj.IsConcern
      }
      var categories = [];
      for (var i = 0; i < res.Categories.length; i++) {
          categories.push({
            "id":res.Categories[i].Id,
            "title":res.Categories[i].Title
          })
      }
      app.globalData.headInfo = headInfo;
      app.globalData.categories = categories;
      app.globalData.update();
    });
  },
  /**
   * 展示首页帖子
   */
  getIndexArticles: function() {
      var that = this;
      data = {
          "deviceType": verifyModel.deviceType,
          "uid": verifyModel.uid,
          "versionCode":verifyModel.versionCode,
          "timestamp": verifyModel.timestamp,
          "sign":verifyModel.sign,
          "id":"3",
          "keyWord":null,
          pageIndex:that.pageIndex
      }
      api.articles(data, function(res){
          var that = this;
          var articles = [];
          for (var i = 0; i < res.objArray.length; i++) {
            var article = res.objArray[i]
            var rewardUsers = []; // 打赏用户列表
            var praiseUsers = []; // 点赞用户列表

            var comments = []; // 评论列表
            var images = [];

            // 打赏
            for (var r = 0; r < res.objArray[i].RewardUsers.length; r++) {
              var rewardUser = res.objArray[i].RewardUsers[r]
              rewardUsers.push({
                  "Id":rewardUser.Id,
                  "Headimgurl":rewardUser.Headimgurl,
                  "NickName":rewardUser.NickName
              });
            }

            // 点赞
            for (var p = 0; p < res.objArray[i].PraiseUsers.length; p++) {
              var praiseUser = res.objArray[i].PraiseUsers[p]
              praiseUsers.push({
                  "Id":praiseUser.Id,
                  "Headimgurl":praiseUser.Headimgurl,
                  "NickName":praiseUser.NickName
              });
            }

            // 评论
            for(var c = 0; c < res.objArray[i].articleComments.length; c++) {
                var commentImgs = []; // 评论图片列表
                var comment = res.objArray[i].articleComments[i];
                for (var ci = 0; c < res.objArray[i].articleComments[c].Images.length; ci++) {
                  var img = res.objArray[i].articleComments[c].Images[ci];
                  commentImgs.push({
                      "Thumbnail":img.Thumbnail,
                      "filepath":img.filepath
                  })
                }
                comments.push({
                  "Id": comment.Id,
                  "IsShowBest":comment.IsShowBest,
                  "CreateDate":comment.CreateDate,
                  "Content":comment.Content,
                  "ContentHtml":comment.ContentHtml,
                  "ComUser":{
                    "Id":comment.ComUser.Id,
                    "Headimgurl":comment.ComUser.Headimgurl,
                    "NickName":comment.ComUser.NickName,
                    "Level":comment.ComUser.Level
                  },
                  "DUser":{
                    "Id":comment.DUser.Id,
                    "Headimgurl":comment.DUser.Headimgurl,
                    "NickName":comment.DUser.NickName,
                    "Level":comment.DUser.Level
                  },
                  "Voice":{
                    "Id":comment.Voice.Id,
                    "DownLoadFile":comment.Voice.DownLoadFile,
                    "VoiceTime":comment.Voice.VoiceTime,
                    "TransFilePath":comment.Voice.TransFilePath,
                  },
                  "Images":commentImgs
                })
            }
            
            // 图片
            for (var im = 0; im < res.objArray[im].Images; im++) {
              var image = res.objArray[im].images[im];
              images.push({
                  "thumbnail":image.thumbnail,
                  "filepath":image.filepath
              })
            }

              articles.push({
                  "Id":article.Id,
                  "Title":article.Title,
                  "CreateDate":article.CreateDate,
                  "Click":article.Click,
                  "ContentDesc":article.ContentDesc,
                  "Content":article.Content,
                  "ContentDescAll":article.ContentDescAll,
                  "Address":article.Address,
                  "IsPraise":article.IsPraise,
                  "Praise":article.Praise,
                  "Reward":article.Reward,
                  "CommentCount":article.CommentCount,
                  "ShareCount":article.ShareCount,
                  "IsNew":article.IsNew,
                  "ArticleTypeID":article.ArticleTypeID,
                  "ArticleTypeName":article.ArticleTypeName,
                  "VideoList":article.VideoList,
                  "IsAdv":article.IsAdv,
                  "IsTop":article.IsTop,
                  "IsSubTop":article.IsSubTop,
                  "IsHot":article.IsHot,
                  "IsGuerdon":article.IsGuerdon,
                  "GuerdonMoney":article.GuerdonMoney,
                  "User":{
                      "Id":article.User.Id,
                      "Headimgurl":article.User.Headimgurl,
                      "NickName":article.User.NickName,
                      "Level":article.User.Level
                  },
                  "RewardUsers":rewardUsers,
                  "PraiseUsers":praiseUsers,
                  "ArticleComments":comments,
                  "Voice":{
                    "Id":article.Voice.Id,
                    "DownLoadFile":article.Voice.DownLoadFile,
                    "VoiceTime":article.Voice.VoiceTime,
                    "TransFilePath":article.Voice.TransFilePath
                  },
                  "Images":images,
                  "Video":null
              })
          }

          // 设置Articles
          that.setData({
            articles:articles,
            pageIndex:that.pageIndex+1
          })
          
      });
  },

  toArticleDetail: function(event) {
    var articleId = event.currentTarget.dataset.articleId;
    wx.navigateTo({
      url: '/pages/articledetail/articledetail?id=' + articleId,
    })
  }
  , 
  showBigImg: function(e) { // 展示大图
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
       current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
       urls: [src],
    })
    return false;
  },
  // 签到
  sign: function() {

  },
  // 关注
  concern: function() {
    
  }
  
})




