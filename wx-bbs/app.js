var crypt =  require("./utils/crypt.js");
var util = require("./utils/util.js");
var api = require("./utils/api.js")
//app.js
var that;
var inited = false;// 初始化过程
var fid = 3;
App({
  onLaunch: function () {
    that = this;
    //调用API从本地缓存中获取数据
    // this.getTypes();
    // this.login();
    // this.getUserInfo();
    this.init();
  },

  // getUserInfo:function(cb){
  //   var that = this;
    // var that = this
    // wx.getUserInfo({
    //   success: function(res){
    //   }
    // })
    // if(this.globalData.userInfo){
    //   typeof cb == "function" && cb(this.globalData.userInfo)
    // }else{
    //   //调用登录接口
    //   that.login();
    // }
  // },
  // getTypes: function() {
  //     var that = this;
  //     var types =  [{
  //         ArticleTypeID : 0,
  //         ArticleTypeName : "全部"
  //       },{
  //         ArticleTypeID : 3132,
  //         ArticleTypeName : "运营日报"
  //       },{
  //         ArticleTypeID : 875,
  //         ArticleTypeName : "操作指南"
  //       },{
  //         ArticleTypeID : 2038,
  //         ArticleTypeName : "常见问题"
  //       },{
  //         ArticleTypeID : 2033,
  //         ArticleTypeName : "微赞故事"
  //       },{
  //         ArticleTypeID : 1,
  //         ArticleTypeName : "更新进度"
  //       }];
  //     that.globalData.types = types;
  // },


  /**
   * 获取用户信息
   
  getUserInfo: function(cb) {
      var userInfo = wx.getStorageSync("userInfo");
      if (typeof userInfo == "undefined") {
          wx.login({
            success: function(loginRes){
                 var url = "https://api.weixin.qq.com/sns/jscode2session?"+ "appid=wx61575c2a72a69def&secret=442cc056f5824255611bef6d3afe8d33&"+
                  "js_code="+ loginRes.code +"&grant_type=authorization_code"
                 wx.request({
                   url: url,
                   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                   // header: {}, // 设置请求的 header
                   success: function(sessionRes){
                        wx.getUserInfo({
                          success: function(userInfoRes){
                                var str = crypt.decryptUserInfo(userInfoRes.encryptedData, sessionRes.data.session_key, userInfoRes.iv); // 解密用户信息
                                var userInfo = JSON.parse(str);
                                var verifyModel = util.primaryLoginArgs(userInfo.unionId);
                                wx.request({
                                  url: 'https://apptest.vzan.com/minisnsapp/userinfo',
                                  data: {"fid":1,"deviceType":verifyModel.deviceType, "uid":verifyModel.uid, 
                                  "sign":verifyModel.sign, "timestamp":verifyModel.timestamp, "versionCode":verifyModel.versionCode},
                                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                  // header: {}, // 设置请求的 header
                                  success: function(res){
                                      wx.setStorageSync('userInfo', res.obj._LookUser);
                                      if (typeof cb == "function") { // 执行数据
                                        cb(res.obj._LookUser);
                                      }
                                  }
                                })
                          }
                        })
                   },
                   complete: function() {
                     // 模拟数据
                      cb({"unionid":"oW2wBwaOWQ2A7RLzG3fcpmfTgnPU","Openid":"obiMY0YuQSpXSAY21oWjKw-OJC0E",
                        "IsSign":true,"ArticleCount":20,"CommentCount":12,"PraiseCount":1231,"IsWholeAdmin":false})
                   }
                 })
            }
          })
      } else {
        cb(wx.getStorageSync("userInfo"));
      }
  },
  */
  /**
   * 获取论坛信息
   
  getMinisnsInfo: function() {
      var minisnsInfo = wx.getStorageSync('minisnsInfo');
      if (typeof minisnsInfo == "undefined") {
          wx.login({
            success: function(loginRes){
                  var url = "https://api.weixin.qq.com/sns/jscode2session?"+ "appid=wx61575c2a72a69def&secret=442cc056f5824255611bef6d3afe8d33&"+
                  "js_code="+ loginRes.code +"&grant_type=authorization_code"
                  wx.request({
                    url: url,
                    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    success: function(sessionRes){
                        wx.getUserInfo({
                          success: function(userInfoRes){
                                var str = crypt.decryptUserInfo(userInfoRes.encryptedData, sessionRes.data.session_key, userInfoRes.iv); // 解密用户信息
                                var userInfo = JSON.parse(str);
                                var verifyModel = util.primaryLoginArgs(userInfo.unionId);
                                wx.request({
                                  url: 'https://apptest.vzan.com/minisnsapp/userinfo',
                                  data: {"fid":1,"deviceType":verifyModel.deviceType, "uid":verifyModel.uid, 
                                  "sign":verifyModel.sign, "timestamp":verifyModel.timestamp, "versionCode":verifyModel.versionCode},
                                  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                                  success: function(res){
                                      wx.setStorageSync('minisnsInfo', res.obj._Minisns);
                                      if (typeof cb == "function") { // 执行数据
                                        cb(res.obj._Minisns);
                                      }
                                  }
                                })
                          }
                        })
                    }
                  })
            },
            complete: function() {
              // 模拟数据
              cb({"minisns":{id:3}})
            }
          })
      } else {
        cb(wx.getStorageSync('minisnsInfo'));
      }
  },
  */

  /**
   * 初始化数据
   */
  init:function() {
      wx.login({
        success: function(loginRes){
              var url = "https://api.weixin.qq.com/sns/jscode2session?"+ "appid=wx61575c2a72a69def&secret=442cc056f5824255611bef6d3afe8d33&"+
                  "js_code="+ loginRes.code +"&grant_type=authorization_code";
              wx.request({
                url: url,
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                success: function(sessionRes){
                    wx.getUserInfo({
                      success: function(userInfoRes){
                          var str = crypt.decryptUserInfo(userInfoRes.encryptedData, sessionRes.data.session_key, userInfoRes.iv); // 解密用户信息
                          var userInfo = JSON.parse(str);
                          var verifyModel = util.primaryLoginArgs(userInfo.unionId);
                          wx.request({ // 登陆服务器
                            url: 'https://apptest.vzan.com/minisnsapp/userinfo',
                            data: {"fid":fid,"deviceType":verifyModel.deviceType, "uid":verifyModel.uid, 
                            "sign":verifyModel.sign, "timestamp":verifyModel.timestamp, "versionCode":verifyModel.versionCode},
                            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                            header: {"Content-Type":"form-data;charset=utf-8"}, // 设置请求的 header
                            success: function(loginRes){
                                wx.setStorageSync('user', loginRes.obj._LookUser);
                                wx.setStorageSync('minisns', loginRes.obj._Minisns);
                                wx.setStorageSync('myArtCount', loginRes.obj._MyArtCount);
                                wx.setStorageSync('myMinisnsCount', loginRes.obj._MyMinisnsCount);
                                wx.setStorageSync('concernCount', loginRes.obj.ConcernCount);
                                wx.setStorageSync('myConcernCount', loginRes.obj.MyConcernCount);
                            } 
                          })
                      }
                    })
                }
              })
        },
        complete: function() {
            inited = true;
            // 模拟数据
            wx.setStorageSync('minisnsInfo', {"id":3});
            wx.setStorageSync('userInfo', {"unionid":"oW2wBwaOWQ2A7RLzG3fcpmfTgnPU","Openid":"obiMY0YuQSpXSAY21oWjKw-OJC0E",
                        "IsSign":true,"ArticleCount":20,"CommentCount":12,"PraiseCount":1231,"IsWholeAdmin":false})
        }
      })
  }
})