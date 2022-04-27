<template>
  <view class="main">
    <NavBar title="订机位" />
    <div class="toper">
      <swiper indicator-dots="true" style="height:200rpx" autoplay="true" interval="2000" duration="500">
        <swiper-item v-for="(item, index) in banners" :key="index">
          <image :src="item.pic + '?imageMogr2/thumbnail/710x'" style="width:710rpx;height:200rpx;min-height:200rpx;border-radius: 8rpx;" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </div>
    <div class="ub ub-ac ub-pc" style="margin: 20rpx 10rpx 12rpx" catchtap="toHome">
      <span class="spnTxt">可预订</span>
      <image class="item2" src="../../static/con1.png" />
      <span class="spnTxt" style="margin-left:20rpx">不可售</span>
      <image class="item2" src="../../static/con2.png" />
      <span class="spnTxt" style="margin-left:20rpx">已上机</span>
      <image class="item2" src="../../static/con3.png" />
    </div>
    <div class="content1">
      <div v-for="(item, index) in dataList" :key="index" class="item" :class="{'on': activeTab==index}">
        <img v-for="(it, idx) in item.shopSeatList" :key="idx" :data-id="it.id" :data-tab="index" :data-index="idx" :data-status="it.cstatus" class="item1" :class="{'on': it.selected}" :src="'../../static/con' +it.cstatus + '.png'" @click.stop="selectSeat" />
        <div class="subtxt">{{ item.name }}</div>
      </div>
    </div>
    <div v-if="activeTab>=0" class="order_list">
      <div style="font-size:24rpx;color:#666">已选机号</div>
      <div style="font-size:26rpx">
        {{ dataList[activeTab].name }}:
        <span v-for="(item, index) in selectedNos" :key="index">{{ item }}号机{{ index===selectedNos.length-1 ? '' : '、' }}</span>
      </div>
    </div>
    <button class="saveBtn ub ub-ac ub-pc" @click.stop="saveOrder">选择机位</button>
  </view>
</template>
<script>
import service from '@/utils/http'
import { errDialog, getStorageStore } from '@/utils/util'
export default {
  data() {
    return {
      istop: true,
      dataList: [],
      banners: [],
      dataInfo: {},
      activeTab: -1,
      curLists: {},
      selectedArea: [],
      selectedItems: [],
      selectedIds: [],
      order_list: [],
      selectedNos: []
    }
  },
  onShareAppMessage: function() {
    const store = getStorageStore()
    return {
      title: store.name,
      path: `/pages/shopset/index?share=1&storeId=` + store.id + '&storeName=' + store.name
    }
  },
  onHide() {
    this.activeTab = -1
    this.selectedItems = []
    this.selectedNos = []
    this.curLists = []
  },
  onShow() {
    this.getData()
  },
  onLoad(options) {
    if (options.share) {
      uni.setStorageSync('storeShare', 1)
    }
    if (options.storeId) {
      uni.setStorageSync('storeId', options.storeId)
    }
    if (options.storeName) {
      uni.setStorageSync('storeName', options.storeName)
    }
    service.get(`/api/app/seatMarketing/list`).then(ret => {
      this.banners = ret.data
    })
  },
  methods: {
    saveOrder() {
      console.log(this.activeTab)
      if (this.activeTab === -1) {
        errDialog('请选择机区!')
        return
      }
      const orders = this.selectedItems.map(it => {
        return {
          count: 1,
          seatId: it.id,
          price: it.price,
          status: it.status
        }
      })
      console.log(orders)
      if (orders.length === 0) {
        errDialog('请选择机位')
        return
      }
      const obj = {
        type: 4,
        subOrders: orders,
        logisticsType: 3,
        payType: 2
      }
      service.post('/api/order/createSeatOrder', obj).then(res => {
        uni.showToast({ title: '预订成功', icon: 'success', duration: 1000 })
        uni.requestPayment({
          timeStamp: res.data.wx.timeStamp,
          nonceStr: res.data.wx.nonceStr,
          package: res.data.wx.packageValue,
          signType: res.data.wx.signType,
          paySign: res.data.wx.paySign,
          success(res) {
            uni.navigateTo({
              url: '/pages/mine/orders?type=2'
            })
          },
          fail(res) {
            uni.navigateTo({
              url: '/pages/mine/orders?type=1'
            })
          }
        })
      })
    },
    selectSeat(e) {
      const { status, tab, index } = e.currentTarget.dataset
      if (status != 1) {
        return
      }
      if (this.activeTab !== tab) {
        this.initSelects(tab)
      }
      const dataList = this.dataList
      dataList[this.activeTab].shopSeatList[index].selected = !dataList[this.activeTab].shopSeatList[index].selected
      const selects = this.curLists.filter(it => it.selected === true)
      this.selectedItems = selects
      this.selectedNos = selects.map(it => it.seatNo)
    },
    initSelects(tab) {
      if (this.activeTab !== -1) {
        this.dataList[this.activeTab].shopSeatList.forEach(it => { it.selected = false })
      }
      this.activeTab = tab
      this.selectedItems = []
      this.selectedNos = []
      this.curLists = this.dataList[tab].shopSeatList
    },
    async getData() {
      const ret = await service.get(`/api/seates/list`)
      if (ret && ret.code == '00000') {
        const retdata = ret.data
        retdata.forEach(item => {
          item.shopSeatList.forEach(it => {
            it.cstatus = it.status === 1 ? 3 : it.status === 2 ? 2 : 1 // 格式化为：1可预订、2不可售、3已上机
          })
        })
        this.dataList = ret.data
      }
    },
    async getInfo(id) {
      const ret = await service.get(`/api/seates/detail?id=${id}`)
      if (ret && ret.code == '00000') {
        this.dataInfo = ret.data
      }
    }
  }
}
</script>
<style scoped>
.main {
  position: relative;
  width: 100%;
  background: #fff;
}
.banner{
  display:block;
  width:100%;
  height: 200rpx;
  border-radius:16rpx
}
.toper{
  padding: 0 20rpx 20rpx;
  background-color: #fff;
}
.content1 {
  column-count:2;
  padding: 10rpx 20rpx 20rpx;
  column-gap:20rpx;
  margin-bottom: 160rpx;
}
.spnTxt{
  font-size: 24rpx;
  margin-right:10rpx;
}
.item {
  padding: 18rpx 18rpx 48rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  border: 1rpx solid #e5e5e5;
  background: #fff;
  position: relative;
  height: 100%;
  overflow: auto;
  display: flex;
  box-sizing: border-box;
  flex-wrap: wrap;
}
.item.on{
  box-sizing: border-box;
  border: #708DF4 1rpx solid;
}
.subtxt{
  font-size: 28rpx;
  color: #333;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50rpx;
  z-index: 1;
  text-align: center;
}
.item1{
  display: block;
  width: 56rpx;
  height: 56rpx;
  border: 1rpx #fff solid;
  margin-right: 21rpx;
  margin-bottom: 18rpx;
}
.item1:nth-child(4n+0) {
  margin-right: 0;
}
.item1.on{
  border: 1rpx #f00 solid;
  box-shadow: 0 0 8rpx #f00;
}
.item2{
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
}
.saveBtn {
  border-radius:88rpx;
  width: 670rpx;
  height: 88rpx;
  background: #0469F7;
  color: #ffffff;
  font-size: 28rpx;
  position: fixed;
  bottom: 20rpx;
  left: 40rpx;
  z-index: 9;
}
.order_list{
  width: 670rpx;
  height: auto;
  background: #ffffff;
  border-radius: 12rpx;
  position: fixed;
  bottom: 160rpx;
  left: 40rpx;
  border: 1rpx #e5e5e5 solid;
  box-sizing:border-box;
  padding: 12rpx 20rpx;
  z-index: 8;
}
</style>
