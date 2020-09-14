// components/callPhone/callPhone.js
Component({
  /**
   * 组件的属性列表
   */
// 可使用全局样式
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    phoneNumber : String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCallPhone(){
      // 打电话api
      wx.makePhoneCall({
        // 获取props
        phoneNumber: this.data.phoneNumber
      })
    }
  }
})
