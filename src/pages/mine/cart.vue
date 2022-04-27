<template>
  <view class="main ub ub-ver">
    <NavBar title="购物车" />
    <div class="utabs ub ub-ac plr10" style="margin-top: 0">
      <div v-for="(item,index) in ['门店专属', '竞+Max']" :key="index" class="item ub ub-ver ub-ac" style="width:160rpx" :class="{'on': curTab===index}" @click="curTab=index">
        <div class="txt tx-c">{{ item }}</div>
        <div class="line" style="background: #FE5C62;" />
      </div>
      <div class="ub-f1" />
      <div class="delDiv ub ub-ac" @click="clearCart">
        <image class="clearIcon" src="../../static/clear.png" />清空当前所选
      </div>
    </div>
    <div v-if="curTab==0 && productList1.length > 0" class="ub-f1">
      <div v-for="(product, index) in productList1" :key="index" class="ub ub-ac wrap">
        <div class="ub orderItem ub-ac">
          <checkbox-group @change="selectChange1(product)">
            <checkbox value="cb" :checked="product.checked" color="#fe5864" />
          </checkbox-group>
          <image class="goodImg udb" :src="product.pic" lazy-load="true" mode="aspectFill" />
          <div class="ub ub-ver goodMsg">
            <div class="goodTit">{{ product.name }}</div>
            <div class="skuName">{{ product.sku.attrVal }}</div>
            <div class="goodPrice">单价: {{ product.price }}元/{{ product.skuPoints }}积分</div>
            <div class="numberCtrl ub ub-ac">
              <image class="ctlbtn" src="../../static/ion-del.png" :data-index="index" @click="subNum1" />
              <div class="goodNum">{{ product.num }}</div>
              <image class="ctlbtn" src="../../static/ion-add.png" :data-index="index" @click="addNum1" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="curTab==1 && productList2.length > 0" class="ub-f1">
      <div v-for="(item, index) in productList2" :key="index" class="wrap warp1">
        <div class="plr20 storeTit">{{ item.sname }}</div>
        <div v-for="(product, iii) in item.cartItems" :key="iii" class="ub orderItem ub-ac">
          <checkbox-group @change="selectChange2(product)">
            <checkbox value="cb" :checked="product.checked" color="#fe5864" />
          </checkbox-group>
          <image class="goodImg udb" :src="product.pic" lazy-load="true" mode="aspectFill" />
          <div class="ub ub-ver ub-pj goodMsg">
            <div class="goodTit">{{ product.name }}</div>
            <div class="skuName">{{ product.sku.attrVal }}</div>
            <div class="goodPrice">单价: {{ product.price }}元</div>
            <div class="numberCtrl ub ub-ac">
              <image class="ctlbtn" src="../../static/ion-del.png" :data-sindex="index" :data-index="iii" @click="subNum2" />
              <div class="goodNum">{{ product.num }}</div>
              <image class="ctlbtn" src="../../static/ion-add.png" :data-sindex="index" :data-index="iii" @click="addNum2" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="curTab===0 && productList1.length > 0" class="btn_bottom ub ub-ac plr15">
      <checkbox-group @change="selectAll1()">
        <checkbox :checked="allChecked1" color="#fe5864" style="margin-right:12rpx;" />
        <div style="display:inline-block;line-height:60rpx;font-size:28rpx">全选</div>
      </checkbox-group>
      <div class="ub-f1 plr15" style="margin-left:14rpx;font-size:26rpx">
        金额：
        <span class="totalCost">{{ total1.cost || 0 }}元</span>
        <span class="totalLine">{{ total1.line || 0 }}元</span>
      </div>
      <button form-type="submit" class="btn_common ub-f1 ub ub-ac ub-pc" @click="toPay">立即结算</button>
    </div>
    <div v-if="curTab===1 && productList2.length > 0" class="btn_bottom ub ub-ac plr15">
      <checkbox-group @change="selectAll2()">
        <checkbox :checked="allChecked2" color="#fe5864" style="margin-right:12rpx;" />
        <div style="display:inline-block;line-height:60rpx;font-size:28rpx">全选</div>
      </checkbox-group>
      <div class="ub-f1 plr15" style="margin-left:14rpx;font-size:26rpx">
        金额：
        <span class="totalCost">{{ total2.cost || 0 }}元</span>
        <span class="totalLine">{{ total2.line || 0 }}元</span>
      </div>
      <button form-type="submit" class="btn_common ub-f1 ub ub-ac ub-pc" @click="toPay">立即结算</button>
    </div>
    <div v-if="(curTab == 0 && productList1.length === 0) || (curTab == 1 && productList2.length === 0)" class="ub-f1 ub ub-ac ub-pc ub-ver">
      <image class="nodataImg" src="../../static/null/null4.png" mode="widthFix" />
      <div class="nodataTxt">暂无商品</div>
    </div>
  </view>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, getStorageStore } from '@/utils/util'
export default {
  data() {
    const store = getStorageStore()
    return {
      store,
      curTab: 0,
      allChecked1: false,
      allChecked2: false,
      amount: 0,
      productList1: [],
      productList2: [],
      isShowNodata: false,
      total1: {},
      total2: {}
    }
  },
  onLoad() {
    this.getData1() // 普通商品
    this.getData2() // 竞+Max
  },
  methods: {
    // 普通商品
    getData1() {
      const _cacheCar = uni.getStorageSync('car')
      console.log(_cacheCar)
      if (!_cacheCar) return
      const list = []
      for (const k in _cacheCar) {
        const product = _cacheCar[k]
        product._itemList.forEach(it => {
          const obj = {
            productId: it.idGoods,
            storeId: this.store.id,
            id: it.id,
            name: product.name,
            pic: product.pic,
            num: it.num,
            checked: false,
            price: product.price,
            skuPoints: product.skuPoints,
            linePrice: product.linePrice,
            sku: {
              id: it.id,
              attrVal: it.skuValList[0].attrVal
            }
          }
          list.push(obj)
        })
      }
      this.productList1 = list
      this.computePrice1()
    },

    selectAll1() {
      this.allChecked1 = !this.allChecked1
      this.productList1.forEach(it => {
        it.checked = this.allChecked1
      })
      this.computePrice1()
    },
    selectChange1(item) {
      item.checked = !item.checked
      this.computePrice1()
      this.allChecked1 = this.productList1.every(it => it.checked === true)
    },
    computePrice1() {
      let cost = 0
      let line = 0
      const selectedList = this.productList1.filter(it => it.checked === true)
      selectedList.forEach(it => {
        const { num, price, linePrice } = it
        cost += num * price * 100
        line += num * linePrice * 100
      })
      this.total1 = {
        cost: cost / 100,
        line: line / 100
      }
    },
    addNum1: function(e) {
      const { index } = e.currentTarget.dataset
      this.productList1[index].num++
      this.computePrice1()
    },
    subNum1: function(e) {
      const { index } = e.currentTarget.dataset
      const num = this.productList1[index].num
      if (num > 1) {
        this.productList1[index].num--
      }
      this.computePrice1()
    },

    // 竞果商品
    getData2: function() {
      service.get('/api/sass/getCartList').then(res => {
        const list = res.data || []
        list.forEach(store => {
          store.cartItems = store.cartItems.map(item => {
            return {
              productId: item.goodsId,
              storeId: item.storeId,
              id: item.id,
              name: item.goodsName,
              pic: item.pic,
              num: item.num,
              checked: false,
              price: item.price,
              linePrice: item.linePrice,
              sku: {
                attrVal: item.strSkus,
                id: item.goodsSkuId
              }
            }
          })
        })
        this.productList2 = list
      })
    },
    selectAll2() {
      this.allChecked2 = !this.allChecked2
      this.productList2.forEach(it => {
        it.cartItems.forEach(ele => {
          ele.checked = this.allChecked2
        })
      })
      this.computePrice2()
    },
    selectChange2(item) {
      item.checked = !item.checked
      this.computePrice2()
      const list = this.getSelected2()
      this.allChecked2 = list.every(it => it.checked === true)
    },
    computePrice2() {
      let cost = 0
      let line = 0
      const list = this.getSelected2()
      const selectedList = list.filter(it => it.checked === true)
      selectedList.forEach(it => {
        const { num, price, linePrice } = it
        cost += num * price * 100
        line += num * linePrice * 100
      })
      this.total2 = {
        cost: cost / 100,
        line: line / 100
      }
    },
    getSelected2() {
      const list = []
      this.productList2.forEach(store => {
        store.cartItems.forEach(item => {
          list.push(item)
        })
      })
      return list
    },
    addNum2(e) {
      const { index, sindex } = e.currentTarget.dataset
      this.productList2[sindex].cartItems[index].num++
      this.computePrice2()
    },
    subNum2(e) {
      const { index, sindex } = e.currentTarget.dataset
      const num = this.productList2[sindex].cartItems[index].num
      if (num > 1) {
        this.productList2[sindex].cartItems[index].num--
      }
      this.computePrice2()
    },
    clearCart() {
      const selectedList = this.curTab == 0 ? this.productList1.filter(it => it.checked === true) : this.getProductCart2()
      if (selectedList.length === 0) {
        return errDialog('请选择购物车商品')
      }
      uni.showModal({
        title: '温馨提示',
        content: '确定要清空所选商品吗？',
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            if (this.curTab === 1) {
              this.deleteCar()
            } else {
              uni.showToast({
                title: '已清空所选商品'
              })
              this.updateCar()
              this.getData1()
            }
          }
          if (res.cancel) {
            console.log('点击取消')
          }
        }
      })
    },
    deleteCar() {
      const list = this.getSelected2()
      const selectedList = list.filter(it => it.checked === true)
      const arr = selectedList.map(it => it.id)
      service.post('/api/sass/clearCart', arr).then(() => {
        this.getData2()
        uni.showToast({
          title: '已清空所选商品'
        })
      })
    },
    updateCar() {
      const selectList = this.productList1.filter(it => it.checked === true)
      const ids = selectList.map(it => it.id)
      console.log(ids)
      const car = uni.getStorageSync('car')
      for (const p in car) {
        const arr = car[p]._itemList
        console.log(arr)
        for (let i = arr.length - 1; i >= 0; i--) {
          if (ids.includes(arr[i].id)) {
            arr.splice(i, 1)
          }
        }

        if (car[p]._itemList.length === 0) {
          delete car[p]
        }
      }
      uni.setStorageSync('car', car)
    },
    getProductCart2() {
      const arr = []
      this.productList2.forEach(it => {
        const flag = it.cartItems.some(ele => ele.checked === true)
        if (flag) {
          const items = it.cartItems.filter(item => item.checked === true)
          arr.push({
            sname: it.sname,
            storeId: it.sid,
            subOrders: items,
            logisticsType: '3',
            address: ['', '', ''],
            remark: ''
          })
        }
      })
      return arr
    },
    toPay() {
      const selectedList = this.curTab == 0 ? this.productList1.filter(it => it.checked === true) : this.getProductCart2()
      if (selectedList.length === 0) {
        return errDialog('请选择购物车商品')
      }
      uni.setStorageSync('payorders', selectedList)
      const gType = this.curTab == 0 ? 1 : 5
      if (gType === 1) {
        wx.navigateTo({
          url: '/pages/mine/cartconfirm1' // 门店商品
        })
      } else {
        wx.navigateTo({
          url: '/pages/mine/cartconfirm2' // 竞果商品
        })
      }
    }
  }
}
</script>
<style scoped>
.main{padding-bottom: 110rpx;height: 100%;}
.btn{margin:60rpx auto 30rpx;border-radius: 50rpx;width: 650rpx;}
.utabs .item.on .txt{font-size:28rpx;color: #FE5C62;}
.clearIcon{display: block;width: 36rpx;height: 36rpx;margin-right: 3rpx;}
.content{ margin-top: 20rpx; }
checkbox .wx-checkbox-input { width: 36rpx; height: 36rpx; border-radius: 36rpx; border: 4rpx solid #fe5864; }
.orderItem { background-color: #fbfbfb; background-color: #fff; padding: 20rpx;width: 710rpx;margin: 10rpx auto;}
.goodImg { width: 180rpx; height: 180rpx; border-radius: 8rpx; border: 1rpx #eee solid;margin-left: 16rpx; }
.goodMsg { width: 420rpx; height: 180rpx; margin-left: 20rpx; }
.goodTit { font-size: 28rpx; display: -webkit-box; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.skuName { color: #666; font-size: 24rpx; margin-top: 10rpx }
.goodPrice { font-size: 24rpx; color: #fe5864; margin-top: 10rpx }
.goodCount .tit { font-size: 26rpx; color: #333333; }
.numberCtrl{position: absolute;bottom: 0;right: 0;width: 200rpx;}
.numberCtrl .ctlbtn { color: #999; width: 50rpx; height: 40rpx; display: block; background-color: #f5f5f5; }
.numberCtrl .goodNum { width: 70rpx; height: 44rpx; text-align: center; font-size: 24rpx; color: #333; background-color: #f5f5f5; line-height: 40rpx; margin: 0 10rpx; font-weight: bold; }
.btn_bottom { height: 96rpx; position: fixed; bottom: 0; left: 0; width: 100%; box-sizing: border-box; background: #ffffff; }
.totalCost { font-size: 30rpx; color: #fe5864; font-weight: bold }
.totalLine { font-size: 26rpx; color: #888; text-decoration: line-through;margin-left: 10rpx;}
.btn_bottom div { font-size: 30rpx; }
.btn_common { background: #fe5864; height: 68rpx; color: #333; font-size: 26rpx; width: 190rpx; font-weight: bolder; border-radius: 60rpx; color: #fff }
.content{
  box-sizing: border-box;width: 100%;display: flex;flex-direction: row;padding-right:10px;
  transition: all 0.4s;transform: translateX(80px);margin-left: -70px;
}
.delDiv{font-size: 24rpx; color: #666;}
.touch-move-active .content,.touch-move-active .del { -webkit-transform: translateX(0); transform: translateX(0); }
.nodataDiv{padding-top: 260rpx;}
.storeTit{height: 80rpx;border-radius: 12rpx;background: #fff;line-height: 80rpx;width: 710rpx;margin: 0 auto;}
.warp1 .orderItem{margin:0 auto;}
.warp1 + .warp1{margin-top: 20rpx;}
</style>
