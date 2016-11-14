var crypt =  require("./utils/crypt.js");
var util = require("./utils/util.js");
var api = require("./utils/api.js")
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    this.getTypes();
    this.login();
    this.cry();
  },
  cry: function() {
    var encryptedData="o08s4F6vTrWJwm8a1ew/xztqDXLoUM2sA1sY1J34jeCLAn0BXAgNpTp/+tWm6iQb00AqxeJygp35YT55ylzd0Myk/DcgJMEk1wxPW2ggjGz3h6cuNLG+A+23821pJI7ANDsDgEM9ZBUruyfFIRT6DrhDBdeCqTA9hz/QRLjL2clZWWnhaO9CicIDddR+vOSZNKN7tTeIPRN0cj5FVzK+bD08VN7pf40+e6uwlrO7XgjsYFLySA6275i6FzDXsjufwsfyR+NzJWUTavPgDIIknfOZz/wxpJgHFX+VQkZt6Bb+rLwAOvrQlhR/CgtAzm26pXFC027MZpgqJ2ZJXiSaty4gN65f7edRlkfow1fnqHah5yzWj9I35y1j7w3mQiDtDWJ9lj/pkjuMthDpJstaQHfHO4iISOmmq/CRi/7V4C8gdY9b5SKnTsZ4WjKGO5cAkc8+yl44KUpVB3lhztYiljbO0TABlSclv4mpEOsyL7UgOcxJHxh+9UpXyg9+HdyJF7mh3FIJuxdZxDxYfa3nkA=="
    var iv = "jyRsYcuwW8rnMAvsykzEqQ==";
    var sessionKey = "7zLyHTjsApZJhyYMoXcynw==";
    var re = crypt.decryptUserInfo(encryptedData, sessionKey, iv);
    console.log(re);
  },


  login:function() {
    var that = this;
    wx.login({
      success: function(res){
        console.log(res);
        // 通过code获取用户session_key和open_id
        var code = res.code;
        //获取sessionKey
        wx.request({
          url: 'https://URL',
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
              var sessionKey = res.sessionKey;
              var openid = res.openid;
              that.globalData.sessionKey = sessionKey;
              that.globalData.openId = openid;

              // 获取用户信息
              wx.getUserInfo({
                success: function(res){
                    that.globalData.userInfo = res.userInfo;
                    // 解密用户信息
                    var encryptedData = res.encryptedData;
                    var iv = res.iv;

                    var str = crypt.decryptUserInfo(encryptedData, sessionKey, iv);
                    var decryStr = JSON.parse(str);
                    var openId = decryStr.openId;
                    var unionId = decryStr.unionId;
                    var watermark = decryStr.watermark;
                    that.globalData.unionId = unionId;
                    that.globalData.openId = openId;
                    that.globalData.watermark = watermark;
                    // 更新数据
                    that.update();
                    // 登陆服务器
                    var data = {};
                    data.verifyModel = util.primaryLoginArgs();
                    
                    var wechatInfo = {};
                    wechatInfo.openid = openId;
                    wechatInfo.nickname = res.userInfo.nickName;
                    wechatInfo.sex = res.userInfo.gender;
                    wechatInfo.province = res.userInfo.province;
                    wechatInfo.city = res.userInfo.city;
                    wechatInfo.country = res.userInfo.country;
                    wechatInfo.headimgurl = res.avatarUrl;
                    wechatInfo.unionid = unionId;

                    data.wechatInfo = wechatInfo;
                    util.login(data);
                }
              })
          }
        })
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              that.globalData.userInfo = res.userInfo

              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getTypes: function() {
      var that = this;
      var types =  [{
          ArticleTypeID : 0,
          ArticleTypeName : "全部"
        },{
          ArticleTypeID : 3132,
          ArticleTypeName : "运营日报"
        },{
          ArticleTypeID : 875,
          ArticleTypeName : "操作指南"
        },{
          ArticleTypeID : 2038,
          ArticleTypeName : "常见问题"
        },{
          ArticleTypeID : 2033,
          ArticleTypeName : "微赞故事"
        },{
          ArticleTypeID : 1,
          ArticleTypeName : "更新进度"
        }];
      that.globalData.types = types;
  },
  getMoreArticle: function(pn, typeId, h, hongbao, rspan, cb) {
    wx.request({
      url: 'http://vzan.com/f/getarticlebottom-1?pageIndex=1&typeId=2038&h=0&hongbao=&from=qq&rspan=1',
      data: {
        pageIndex:pn,
        typeId:typeId,
        h:h,
        hongbao:"",
        from:"qq",
        rspan:rspan
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type":"application/json;charset=utf-8"
      }, // 设置请求的 header
      success: function(res){
        console.log("request success");
        if (typeof cb == "function") {
          cb(res);
        }
      }
    })
  },
  globalData:{
    userInfo:null,
    openId:null,
    watermark:null,
    unionId:null,
    sessionKey:null,
    types:[],
    voice:{}
  },
  setGlobalData: function(data) {
    this.globalData = data;
  }
})