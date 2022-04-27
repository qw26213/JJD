<template>
  <div class="main">
    <NavBar title="确认订单" transpent="1" />
    <div class="toper" :style="'padding-top:'+ (paddingTop + 20) + 'px'">
      <image src="../../static/bg.jpg" class="mybg" mode="aspectFill" :style="'height:'+ (paddingTop + 80) + 'px'" />
    </div>
    <div class="content">
      <div v-for="(item, index) in productList" :key="index" class="order">
        <div class="plr10 storeTit">{{ item.sname }}</div>
        <div v-for="product in item.subOrders" :key="product.productId" class="pList p10">
          <div class="uitem ub ub-ac">
            <image class="pImg" :src="product.pic" mode="aspectFill" />
            <div style="margin-left:20rpx">
              <div class="pTit">{{ product.name }}</div>
              <div class="pTxt">{{ product.sku.attrVal }}</div>
              <div class="pTxt" style="margin-top:10rpx">*{{ product.num }}</div>
            </div>
            <div class="total">￥{{ product.total }}</div>
          </div>
        </div>
        <div class="elseDiv">
          <div class="cell ub ub-ac ub-pj">
            <div class="itemTit ub-f1">选择配送方式</div>
            <radio-group style="transform:scale(0.9)" @change="radioChange($event, item)">
              <label v-for="(type, index) in types" :key="index" class="radio" style="margin-left:10rpx;font-size:30rpx">
                <radio :value="type.id" :checked="item.logisticsType == type.id" color="#0099ff" />
                {{ type.name }}
              </label>
            </radio-group>
          </div>
          <div v-if="item.logisticsType == 2" class="cell ub ub-ac">
            <div class="itemTit">收件人姓名</div>
            <input class="ub-f1 tx-r" :value="item.address[0]" type="text" placeholder="收件人姓名" @input="bindInput1($event, item, 0)" />
          </div>
          <div v-if="item.logisticsType == 2" class="cell ub ub-ac">
            <div class="itemTit">手机号</div>
            <input class="ub-f1 tx-r" :value="item.address[1]" type="text" placeholder="手机号" @input="bindInput1($event, item, 1)" />
          </div>
          <div v-if="item.logisticsType == 2" class="cell ub ub-ac">
            <div class="itemTit">收件地址</div>
            <input class="ub-f1 tx-r" :value="item.address[2]" type="text" placeholder="收件地址" @input="bindInput1($event, item, 2)" />
          </div>
          <div v-if="item.logisticsType == 3" class="cell ub ub-ac">
            <div class="itemTit">机位码</div>
            <input class="ub-f1 tx-r" :value="item.address[0]" data-parm="address" type="text" placeholder="机位码" @input="bindInput1($event, item, 0)" />
          </div>
          <div class="cell ub ub-ac">
            <div class="itemTit">备注</div>
            <input class="ub-f1 tx-r" :value="item.remark" data-parm="remark" type="text" placeholder="备注" @input="bindInput($event, item)" />
          </div>
        </div>
      </div>
    </div>

    <div class="ub ub-ac ub-pe bottom">
      <div class="ub-f1 plr15" style="color:#fff">￥{{ totalprice }}</div>
      <button class="btn1 ub ub-ac ub-pc" :disabled="btnLoading" @click="createOrder">一键结算</button>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
export default {
  data() {
    return {
      productList: [],
      id: '',
      skuObj: '',
      skuId: '',
      btnLoading: false,
      count: 0,
      totalprice: '',
      goodType: 5,
      types: [{ name: '自提', id: '1' }, { name: '外送', id: '2' }, { name: '店送', id: '3' }],
      attach: {
        logisticsType: '3',
        address: '',
        remark: ''
      },
      paddingTop: 50,
      detailInfo: {}
    }
  },
  onShow() {
    // #ifdef MP-WEIXIN || APP-PLUS
    const MenuButton = uni.getMenuButtonBoundingClientRect()
    this.paddingTop = MenuButton.top + MenuButton.height
    // #endif
  },
  async onLoad(options) {
    console.log(options.scene)
    if (options.scene) {
      const orderId = options.scene
      const res = await service.get(`/api/pad/order/detail/${orderId}`)
      const ret = res.data
      this.productList = ret.map(it => {
        const subOrders = it.subOrders.map(item => {
          return {
            productId: item.productId,
            storeId: item.storeId,
            id: item.id,
            name: item.name,
            pic: item.proUrl,
            num: item.count,
            price: item.price,
            linePrice: item.linePrice,
            sku: {
              attrVal: item.spDataJson[0].attrVal,
              id: item.spDataJson[0].idSkuKey
            }
          }
        })
        return {
          sname: it.storeName,
          storeId: it.storeId,
          subOrders,
          logisticsType: it.logisticsTypes,
          address: [it.name, it.mobile, it.address],
          remark: it.remark
        }
      })
    } else {
      const payorders = uni.getStorageSync('payorders')
      this.productList = payorders
    }
    let total = 0
    this.productList.forEach(store => {
      store.subOrders.forEach(item => {
        item.total = item.num * item.price
        total += item.total
      })
    })
    this.totalprice = total
  },
  methods: {
    radioChange(e, item) {
      item.logisticsType = e.detail.value
      item.address = ['', '', '']
    },
    bindInput1: function(evt, item, index) {
      item.address[index] = evt.detail.value
    },
    bindInput: function(evt, item) {
      const parm = evt.currentTarget.dataset.parm
      item[parm] = evt.detail.value
    },
    createOrder() {
      const orders = []
      this.productList.forEach(ele => {
        const subOrders = ele.subOrders.map(item => {
          return {
            productId: item.productId,
            productSkuId: item.sku.id,
            count: item.num,
            pic: item.pic,
            name: item.name,
            price: item.price,
            linePrice: item.linePrice
          }
        })
        orders.push({
          subOrders,
          logisticsType: ele.logisticsType,
          address: ele.logisticsType == '1' ? '' : ele.logisticsType == '2' ? ele.address.join(',') : ele.address[0],
          remark: ele.remark,
          type: 5,
          storeId: ele.storeId,
          payType: 2
        })
      })
      this.btnLoading = true
      service.post('/api/sass/createOrderApp', orders).then(resp => {
        const res = resp.data.wx
        uni.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.packageValue,
          signType: res.signType,
          paySign: res.paySign,
          success(res) {
            uni.redirectTo({
              url: '/pages/mine/orders?type=2'
            })
          },
          fail(res) {
            uni.redirectTo({
              url: '/pages/mine/orders?type=1'
            })
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.main{padding-bottom: 100rpx;}
.toper{ width: 100%; height: 170rpx; box-sizing: content-box;}
.mybg { display: block; width: 750rpx; height: 540rpx; position: absolute; left: 0; top: 0; z-index: 0;}
.content {
  margin: -160rpx auto 30rpx; width: 710rpx; box-sizing: border-box;
  position: relative; z-index: 567;
}
.order{
  margin-bottom: 20rpx;
}
.pList{background: #fff;}
.uitem + .uitem{margin-top: 20rpx;}
.itemTxt{
  height: 80rpx;;padding-left: 20rpx;font-size: 26rpx;line-height: 70rpx;
}
.pImg{
  width: 140rpx; height: 140rpx; border-radius: 12rpx; border: 1rpx #e5e5e5 solid;
}
.pTit{
  font-size: 28rpx;color:#333
}
.pTxt{
  font-size: 24rpx;color:#999
}
.total{
  position: absolute;
  bottom: 0rpx;
  right: 20rpx;
  font-size: 24rpx;
  color:#fe5864
}
.btn1 { width: 190rpx; height: 98rpx; font-size: 28rpx;background: #0099ff;color: #fff; border-radius: 0;}
.btn1::after { border: 0;}
.btn1[disabled] { background: #8fc6ea; color: #fff; }
.bottom{
  position: fixed; bottom: 0;left:0;width: 100%;height: 98rpx;background: #666;z-index: 99999;
}
.elseDiv{
  border-radius: 20rpx;
  background: #fff;
  padding: 10rpx 30rpx;
  margin: 30rpx auto 30rpx;
  width: 710rpx;
}
.itemTit{
  font-size: 28rpx;
  width: 200rpx;
}
.cell{
  height: 92rpx;
}
.elseDiv input{
  font-size: 28rpx
}
.topTxt1{
  font-size:32rpx;
  color:#fff
}
.topTxt2{
  font-size:24rpx;
  color:#eee
}
.storeTit{height: 80rpx;border-radius: 12rpx 12rpx 0 0;background: #fff;line-height: 80rpx;width: 710rpx;margin: 0 auto;}
</style>
