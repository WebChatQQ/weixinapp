


/**
 * 登陆服务器
 */
function login(data) {
    // 登陆服务器
    wx.request({
      url: 'https://URL/minisnsapp/loginByWeiXin',
      data: data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {}, // 设置请求的 header
      success: function(res){
        // success
      }
    })
}

/**
 * 获取论坛顶部内容
 * 
 */
function headInfo(data, cb) {
    wx.request({
      url: 'https://URL/minisnsapp/getMinisnsHeadInfo',
      data: data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
          if (typeof cb == "function") {
              cb(res);
          }
      },
      fail: function() {
         cb("error");
      }
    })
}

/**
 * 获取论坛首页帖子
 */
function indexMinisnsMsg(data, cb) {
    wx.request({
      url: 'https://URL/minisnsapp/getArtListByMinisnsId',
      data: data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
          if (typeof cb == "function") {
              cb(res);
          }
      }
    })
}

/**
 * 
 */
function getRequest(data, cbObj) {
    wx.request({
      url: cbObj.url,
      data: cbObj.data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
          if (typeof cbObj.success == "function") {
            cbObj.success(res);
          }
      },
      fail: function() {
          if (typeof cbObj.fail == "function") {
            cbObj.fail();
          }
      },
      complete: function() {
          if (typeof cbObj.complete == "function") {
            cbObj.complete();
          }
      }
    })
}





module.exports = {
  login:login,
  headInfo:headInfo,
  indexMinisnsMsg:indexMinisnsMsg,
  getRequest:getRequest
}