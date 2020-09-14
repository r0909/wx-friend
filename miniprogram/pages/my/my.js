// miniprogram/pages/my/my.js
// 内置对象getApp获取全局app.js的数据
const app = getApp()
// 初始化数据库
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: "/images/user/user-unlogin.png",
    nickName : "小喵喵",
    logged : false,
    disabled : true,
    id : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    // 调云函数获取登录状态 若已经登录 把用户信息存到全局app.js 再次打开小程序就直接登录状态
    wx.cloud.callFunction({
      name : 'login',
      data : {}
    }).then((res)=>{
      db.collection('users').where({
        _openid : res.result.openid
      }).get().then((res)=>{
        if( res.data.length ){
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            logged: true,
            id : app.userInfo._id
          });
          this.getMessage();
        }
        else{
          this.setData({
            disabled : false
          });
        }
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      userPhoto : app.userInfo.userPhoto,
      nickName : app.userInfo.nickName,
      id: app.userInfo._id,
      id : app.userInfo._id
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindGetUserInfo(ev){
    //console.log(ev);
    // 获取用户信息 写入数据库
    let userInfo = ev.detail.userInfo;
    if( !this.data.logged && userInfo ){
      db.collection('users').add({
        data : {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          signature : '',
          phoneNumber : '',
          weixinNumber : '',
          links : 0,
          time : new Date(),
          isLocation:true,
          friendList : [],
        }
      }).then((res)=>{
        // 从云数据库读取当前用户数据 写入全局app.js
        db.collection('users').doc(res._id).get().then((res)=>{
          console.log(res.data);
          app.userInfo = Object.assign( app.userInfo , res.data );
          this.setData({
            userPhoto : app.userInfo.userPhoto,
            nickName : app.userInfo.nickName,
            logged : true,
            id: app.userInfo._id
          });
        });

      });
    }
 },

 getMessage(){
  db.collection('message').where({
    userId : app.userInfo._id
  }).watch({
    onChange: function (snapshot) {
      if ( snapshot.docChanges.length ){
        let list = snapshot.docChanges[0].doc.list;
        if( list.length ){
          wx.showTabBarRedDot({
            index: 2
          });
          app.userMessage = list;
        }
        else{
          wx.hideTabBarRedDot({
            index: 2
          })
          app.userMessage = [];
        }
      }
    },
    onError: function (err) {
      console.error('the watch closed because of error', err)
    }
  });
},
})