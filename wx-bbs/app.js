var crypt =  require("./utils/crypt.js");
var util = require("./utils/util.js");
var api = require("./utils/api.js")
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    this.getTypes();
    this.login();
    this.decrypt();
    this.getUserInfo();
  },
  decrypt: function() {
    var encryptedData = 
	'CiyLU1Aw2KjvrjMdj8YKliAjtP4gsMZM'+
	'QmRzooG2xrDcvSnxIMXFufNstNGTyaGS'+
	'9uT5geRa0W4oTOb1WT7fJlAC+oNPdbB+'+
	'3hVbJSRgv+4lGOETKUQz6OYStslQ142d'+
	'NCuabNPGBzlooOmB231qMM85d2/fV6Ch'+
	'evvXvQP8Hkue1poOFtnEtpyxVLW1zAo6'+
	'/1Xx1COxFvrc2d7UL/lmHInNlxuacJXw'+
	'u0fjpXfz/YqYzBIBzD6WUfTIF9GRHpOn'+
	'/Hz7saL8xz+W//FRAUid1OksQaQx4CMs'+
	'8LOddcQhULW4ucetDf96JcR3g0gfRK4P'+
	'C7E/r7Z6xNrXd2UIeorGj5Ef7b1pJAYB'+
	'6Y5anaHqZ9J6nKEBvB4DnNLIVWSgARns'+
	'/8wR2SiRS7MNACwTyrGvt9ts8p12PKFd'+
	'lqYTopNHR1Vf7XjfhQlVsAJdNiKdYmYV'+
	'oKlaRv85IfVunYzO0IKXsyl7JCUjCpoG'+
	'20f0a04COwfneQAGGwd5oa+T8yO5hzuy'+
	'Db/XcxxmK01EpqOyuxINew=='
    var iv = "r7BXXKkLb8qrSNn05n0qiA==";
    var sessionKey = "tiihtNczf5v6AKRyjwEUhQ==";
    var re = crypt.decryptUserInfo(encryptedData, sessionKey, iv);
    console.log("解密用户信息", re);
  },

  login:function() {
    var that = this;
    wx.login({
      success: function(loginRes){
        console.log(loginRes);
        // 通过code获取用户session_key和open_id
        var code = loginRes.code;
        url = "https://api.weixin.qq.com/sns/jscode2session?"+
        "appid=wx61575c2a72a69def&secret=442cc056f5824255611bef6d3afe8d33&"+
        "js_code="+ code +"&grant_type=authorization_code"
        //获取sessionKey
        wx.request({
          url: url,
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(session){
              console.log("从服务器获取的SessionKey", session.data.session_key, "从服务器获取的openid", session.data.openid);
              // 获取用户信息
              wx.getUserInfo({
                success: function(res){
                    console.log("解密用户信息", res.ecryptedData);
                    that.globalData.userInfo = res.userInfo;
                    // 解密用户信息
                    var str = crypt.decryptUserInfo(res.encryptedData, session.data.session_key, res.iv); // 解密用户信息
                    var userInfo = JSON.parse(str);
                    // 登陆服务器
                    var verifyModel = util.primaryLoginArgs(userInfo.unionId);
                    wx.request({
                      url: 'https://apptest.vzan.com/minisnsapp/loginByWeiXin',
                      data: {},
                      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    })
                    var data = {};
                    data.verifyModel = verifyModel; 

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
                    api.login(data);

                    // 获取登陆用户信息
                    var userinfodata = {fid:1, verifyModel: verifyModel}
                    api.userinfo(data, function(res) {
                        var userinfo = res.obj;
                        that.setData({
                            _user: userinfo._LookUser,
                            _minisns : userinfo._Minisns, // 论坛
                            _myArtCount: userinfo._MyArtCount, // 文章数
                            _myMinisnsCount: userinfo._MyMinisnsCount, // 关注论坛数
                            isConcern:userinfo.IsConcern, // 
                            concernCount:userinfo.ConcernCount, // 粉丝人数
                            myConcernCount:userinfo.MyConcernCount,// 关注人数
                        })
                        wx.setStorageSync('user', res.obj._LookUser);// 保存用户信息
                        wx.setStorageSync('minisns', res.obj._Minisns); // 论坛信息
                    })
                }
              })
          }
        })
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    wx.getUserInfo({
      success: function(res){
          console.log("微信返回的加密用户信息，", res)
      }
    })
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      that.login();
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
    voice:{},
    sysInfo:{},
  },
  setGlobalData: function(data) {
    this.globalData = data;
  }
})