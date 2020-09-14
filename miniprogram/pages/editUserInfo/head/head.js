// miniprogram/pages/editUserInfo/head/head.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto : ''
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
    this.setData({
      userPhoto : app.userInfo.userPhoto
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
// 选择本地文件
  handleUploadImage(){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success : (res)=>{
        //console.log(res);
        // 要上传的图片的地址
        const tempFilePaths = res.tempFilePaths[0];
        this.setData({
          userPhoto: tempFilePaths
        });
      }
    })
  },
  // 本地文件上传到数据库
  handleBtn(){

    wx.showLoading({
      title: '上传中'
    })
    // 自定义上传路径 userPhoto为自定义的云数据库中的一个目录
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + ".jpg";
    // 上传到云数据库
    wx.cloud.uploadFile({
// 云存储路径
      cloudPath,
      // 要上传的文件的路径
      filePath: this.data.userPhoto
    }).then((res)=>{
      //console.log(res);
      // 云存储图片地址
      let fileID = res.fileID;
      if(fileID){
        db.collection('users').doc(app.userInfo._id).update({
          data : {
            userPhoto : fileID
          }
        }).then((res)=>{
          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功'
          });
          app.userInfo.userPhoto = fileID;
        });
      }
    });
  },
  // 获取用户信息
  bindGetUserInfo(ev){
    let userInfo = ev.detail.userInfo;
    if (userInfo) {
      this.setData({
        userPhoto: userInfo.avatarUrl
      }, () => {
        wx.showLoading({
          title: '上传中'
        })
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userPhoto: userInfo.avatarUrl
          }
        }).then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功'
          });
          app.userInfo.userPhoto = userInfo.avatarUrl;
        });
        
      });
    }
  }
})