<template>
  <div class="main">
    <NavBar title="0" transpent="1" :homebutton="showhome" />
    <div class="swiper-wrap">
      <swiper class="img-wrap" autoplay="true" interval="3000">
        <swiper-item v-for="(it,index) in pic" :key="index">
          <image class="slide-image" lazy-load="true" :src="it" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </div>
    <div class="prodrctInfo">
      <div class="productname ub ub-ac">
        <div class="ub-f1" style="font-weight:bold">{{ shopdetail && shopdetail.name }}</div>
      </div>
      <div class="productCount ub ub-ac">
        <div class="price ub-f1">
          ￥{{ shopdetail.price || 0 }}
          <span class="line">{{ shopdetail.linePrice || 0 }}</span>
          <span class="point">积分:{{ shopdetail.skuPoints || 0 }}</span>
        </div>
        <div class="count">销量 {{ oksku && oksku[0].actualSales }}</div>
      </div>
    </div>

    <div v-if="goodType==5" class="sItem ub ub-ac">
      <image class="sImg" src="../../static/bbb.png" mode="aspectFill" />
      <div class="sTit ub-f1">{{ storeInfo.name }}</div>
      <div class="entry" @click="toPage('/pages/shop/store?id='+storeInfo.id)">进店逛逛</div>
    </div>

    <div class="proInduction">
      <image v-for="(item, index) in detail" :key="index" class="productImg" :src="item" mode="widthFix" />
    </div>

    <div v-show="detail === []" class="nullInduction ub ub-ac ub-pc" style="font-size:26rpx;height:300rpx">暂无数据</div>

    <div class="footer ub ub-ac plr10">
      <div v-if="goodType==5" class="smallBtn ub-f1 ub ub-ver ub-ac" @click="toPage('/pages/shop/store?id='+storeInfo.id)">
        <image class="small_icon" src="../../static/icon_store.png" />
        <div class="tx-c small_txt">店铺</div>
      </div>
      <div class="smallBtn ub-f1 ub ub-ver ub-ac">
        <image v-if="isCollect" class="small_icon" src="../../static/icon_ctrl31.png" @click.stop="collectGood" />
        <image v-else class="small_icon" src="../../static/icon_collect.png" @click.stop="collectGood" />
        <div class="tx-c small_txt">收藏</div>
      </div>
      <div class="smallBtn ub-f1 ub ub-ver ub-ac" style="margin-right:30rpx" @click="toPage('/pages/mine/cart')">
        <image class="small_icon" src="../../static/icon_cart.png" />
        <div class="tx-c small_txt">购物车</div>
      </div>
      <div class="joinBtn" @click.stop="opengwc">加入购物车</div>
      <div class="buyBtn" @click.stop="opens">立即购买</div>
    </div>

    <div v-show="open" class="selectWrap" @click.stop="closeSpec" />

    <div v-show="open" class="ub ub-ver selectModal">
      <div :animation="animationData">
        <div class="mtit tx-c">{{ type == 1 ? '加入购物车' : '立即购买' }}</div>
        <div class="closeSelect ub ub-ac ub-pc" @click.stop="closeSpec">
          <image src="../../static/icon_del.png" />
        </div>
        <div class="ub ub-ac ub-pj goodCount">
          <div class="tit ub ub-ac">数量:</div>
          <div class="numberCtrl ub ub-ac">
            <image class="ctlbtn" src="../../static/ion-del.png" data-arrow="left" @click.stop="subNum" />
            <div class="goodNum">{{ num }}</div>
            <image class="ctlbtn" src="../../static/ion-add.png" data-arrow="right" @click.stop="addNum" />
          </div>
        </div>
        <div v-for="(sku, skuTypeId) in skuListData" :key="skuTypeId" class="goodCount">
          <div class="tit ub ub-ac" style="margin-right:15rpx">{{ sku.skuTypename }}:</div>
          <div class="selectType" style="margin-top:16rpx">
            <div v-for="(item, name) in sku.values" :key="name" :class="{'on':defaultSkus[skuTypeId]==name}" :data-value="name" :data-skuType="sku.typeId" @click.stop="skuChange">{{ name }}</div>
          </div>
        </div>
        <div v-for="(attr, attrId) in attrListData" :key="attrId">
          <div>{{ attr.name }}</div>
          <div class="selectType">
            <div v-for="(item, index) in attr.values" :key="index" :class="{'on':item.id==selectedId}" :data-typeId="attrId" :data-value="item.value" :data-id="item.valueId" @click.stop="selectAttr">{{ item.value }}</div>
          </div>
        </div>
        <div style="height:120rpx" />
        <button v-if="type == 1" class="selectBtn bbtn" @click.stop="addToShopCar">确定</button>
        <button v-else class="selectBtn bbtn" @click.stop="overfun">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, toPage } from '@/utils/util'
export default {
  data() {
    return {
      showhome: 0,
      toPage,
      goodType: 1, // 1 商品订单 5 竞果订单

      selectedId: '',
      productList: [],
      count: 1,
      buyType: 1,
      productPics: [],
      listKey: [],
      skuList: [],

      storeInfo: {},

      shopcarMap: {},
      open: false,
      goodsId: '',
      pic: [],
      kpic: '',
      idx1: '',
      idx2: '',
      skuid: '',
      skuid1: '',
      type: 0,
      carCount: 0,
      num: 1,
      pushcar: [],
      isswip: false,
      skulist: [],
      oksku: [],
      detail: [],
      height: 100,
      shopdetail: {},
      someshop: null,
      animationData: {},
      defaultSkus: {}, // 选中sku
      strSkus: '',
      attrListData: {},
      defaultAttrs: {}, // 选中属性
      strAttrs: '',
      skuListMap: {},
      priceMap: {},
      skuListData: {},
      currentPrice: {},
      totalPrice: {},
      isCollect: false
    }
  },
  onLoad: function(options) {
    console.log(options)
    this.goodType = options.type
    this.goodsId = options.id
    if (options.share) {
      uni.setStorageSync('storeShare', 1)
      this.showhome = 1
    }
    this.getcar()
    this.getdata(this.goodsId)
    this.getsku(this.goodsId)
  },
  onShareTimeline: function() {
    const store = this.storeInfo
    return {
      title: this.shopdetail.name,
      path: `/pages/shop/detail?share=1&storeId=${store.id}&id=${this.goodsId}&name=${store.name}`,
      imageUrl: this.pic[0]
    }
  },
  onShareAppMessage: function() {
    const store = this.storeInfo
    return {
      title: this.shopdetail.name,
      path: `/pages/shop/detail?share=1&storeId=${store.id}&id=${this.goodsId}&name=${store.name}`,
      imageUrl: this.pic[0]
    }
  },
  methods: {
    getcar() {
      const _cacheCar = uni.getStorageSync('car')
      if (_cacheCar) {
        let carCount = 0
        for (const c in _cacheCar) {
          const product = _cacheCar[c]
          const skuList = product._itemList || []
          carCount += skuList.length
        }
        this.shopcarMap = _cacheCar
        this.carCount = carCount
      }
    },

    getdata(id) {
      service.get(`/api/goods/detail/${id}`).then(res => {
        this.shopdetail = res.data
        this.pic = res.data.pic.split(',')
        this.kpic = res.data.pic
        this.isswip = res.data.pic.includes('https')
        this.detail = res.data.detail ? res.data.detail.split(',') : []
        this.getStore(this.shopdetail.storeId)
        this.generateAttrList(res.data)
      })
      service.get(`/api/userGoods/isCollect/${id}`).then(res => {
        this.isCollect = res.data
      })
    },

    getStore(id) {
      service.get('/api/public/getStoreInfo?storeId=' + id).then(res => {
        this.storeInfo = res.data || {}
        if (this.storeInfo && this.showhome === 1) {
          uni.setStorageSync('storeId', res.data.id)
          uni.setStorageSync('storeName', res.data.name)
        }
      })
    },

    getsku: async function(id) {
      const ret = await service.get(`/api/sku/listKey/${id}`)// sku类别
      const res = await service.get(`/api/sku/listSku/${id}`)// sku值
      this.skulist = ret.data
      this.oksku = res.data
      this.init1(ret.data)
      this.generateSkuList(res.data)
    },
    /**
       * 根据所选sku设置当前价格
       */
    setCurrentPrice() {
      const { strSkus, priceMap } = this
      const key = strSkus.split('，').join('-')
      const skuInfo = priceMap[key]
      let currentPrice = {
        price: '',
        linePrice: ''
      }
      if (skuInfo) {
        currentPrice = {
          price: skuInfo.price,
          linePrice: skuInfo.linePrice
        }
      }
      this.currentPrice = currentPrice
    },
    /**
       * 计算价格总价
       */
    computeTotalPrice() {
      let { totalPrice, priceMap, strSkus, num } = this
      const key = strSkus.split('，').join('-')
      const skuInfo = priceMap[key]
      if (skuInfo) {
        const { price, linePrice } = skuInfo
        totalPrice = {
          price: price * num,
          linePrice: linePrice * num
        }
        this.totalPrice = totalPrice
      }
    },
    /**
       * 选择sku
       * @param {} typeId
       * @param {*} value
       */
    selectSku(typeId, value) {
      const defaultSkus = this.defaultSkus
      if (defaultSkus[typeId] == value) return
      defaultSkus[typeId] = value
      let selectStr = ''
      for (const k in defaultSkus) {
        const item = defaultSkus[k]
        selectStr += (item + '，')
      }
      selectStr = selectStr && selectStr.substr(0, selectStr.length - 1)
      this.defaultSkus = defaultSkus
      this.num = 1
      this.strSkus = selectStr
      this.computeTotalPrice()
      this.setCurrentPrice()
    },
    /**
       * 选择属性
       * @param {} typeId
       * @param {*} value
       */
    selectAttr(e) {
      const { id, value, typeid } = e.currentTarget.dataset
      const defaultAttrs = this.defaultAttrs
      defaultAttrs[typeid] = { value: value, valueId: id }
      let strAttrs = ''
      for (const k in defaultAttrs) {
        const attr = defaultAttrs[k]
        const { value, valueId } = attr
        strAttrs += (value + '，')
      }
      strAttrs = strAttrs && strAttrs.substr(0, strAttrs.length - 1)
      this.defaultAttrs = defaultAttrs
      this.strAttrs = strAttrs
    },
    generateAttrList(data) {
      const { attrKeyList } = data || {}
      if (!attrKeyList) return
      const attrListData = {}
      let strAttrs = ''
      const defaultAttrs = {}
      for (const attr of attrKeyList) {
        const { id, attrName, attrValList } = attr
        attrListData[id] = { name: attrName, values: [] }
        for (const value of attrValList) {
          const { attrVal, id: valueId } = value
          attrListData[id].values.push({ value: attrVal, valueId })
          if (!defaultAttrs[id]) {
            defaultAttrs[id] = { value: attrVal, valueId: valueId, typeName: attrName }
            strAttrs += (attrVal + '，')
          }
        }
      }
      strAttrs = strAttrs && strAttrs.substr(0, strAttrs.length - 1)
      this.attrListData = attrListData
      this.defaultAttrs = defaultAttrs
      this.strAttrs = strAttrs
    },
    generateSkuList(data) {
      const skuListData = {}
      const defaultSkus = {}
      let strSkus = ''
      const priceMap = {}
      for (const sku of data) {
        const { id, isSales, price, linePrice, stock, skuValList } = sku
        let groupKey = ''
        for (var val of skuValList) {
          const { attrName, attrVal, idSkuKey } = val
          if (!skuListData[idSkuKey]) {
            skuListData[idSkuKey] = {
              values: {},
              skuTypename: attrName,
              typeId: idSkuKey
            }
          }
          const types = skuListData[idSkuKey]
          const values = types['values']
          values[attrVal] = { skudId: id, name: attrVal }
          if (!defaultSkus[idSkuKey]) {
            defaultSkus[idSkuKey] = attrVal
            strSkus += (attrVal + '，')
          }
          groupKey += (attrVal + '-')
        }
        groupKey = groupKey && groupKey.substr(0, groupKey.length - 1)
        priceMap[groupKey] = {
          id, isSales, price, linePrice, stock
        }
      }

      strSkus = strSkus.length > 0 ? strSkus.substr(0, strSkus.length - 1) : ''
      this.skuListData = skuListData
      this.defaultSkus = defaultSkus
      this.strSkus = strSkus
      this.priceMap = priceMap
      this.setCurrentPrice()
      this.computeTotalPrice()
    },

    init1: function(data1) {
      let idd
      let ddi
      if (data1?.length == 1) {
        idd = data1[0].id
      } else if (data1?.length == 2) {
        idd = data1[0].id
        ddi = data1[1].id
      } else { }

      this.skuid = idd
      this.skuid1 = ddi
    },

    skuChange: function(e) {
      const { skutype, value } = e.currentTarget.dataset
      this.selectSku(skutype, value)
    },

    addNum() {
      this.num = this.num + 1
      this.computeTotalPrice()
    },
    subNum() {
      let num = this.num
      num -= 1
      if (num < 1) num = 1
      this.num = num
      this.computeTotalPrice()
    },
    overfun() {
      const { num, shopdetail, strSkus, priceMap } = this
      if (num == 0) {
        uni.showToast({
          title: '请添加数量',
          icon: 'none',
          duration: 1000
        })
        return
      }
      const subOrders = []
      const sku = priceMap[strSkus.split('，').join('-')]
      const skuId = sku.id
      const skuObj = {
        productId: shopdetail.id,
        productSkuId: skuId,
        count: num,
        pic: shopdetail?.pic,
        name: shopdetail?.name,
        price: sku.price,
        linePrice: sku.linePrice,
        strSkus: strSkus
      }
      subOrders.push(skuObj)
      this.open = false
      wx.navigateTo({
        url: `/pages/mine/orderconfirm?id=${this.goodsId}&skuId=${sku.id}&count=${num}&gType=${this.goodType}`
      })
    },

    opengwc() {
      this.type = 1
      this.open = !this.open
    },

    closeSpec() {
      this.open = false
    },

    showSpec() {
      this.open = true
    },

    /**
      * 加入购物车
      */
    async addToShopCar() {
      if (this.goodType == 1) {
        let { shopdetail, num, shopcarMap, carCount, priceMap, strSkus, defaultAttrs } = this
        if (num == 0) return uni.showToast({ title: '请添加数量', duration: 1000, icon: 'none' })
        const product = shopcarMap[shopdetail?.id] || { ...shopdetail }
        const skuList = product._itemList || []
        const csku = priceMap[strSkus.split('，').join('-')]
        let sku = skuList.find(o => o?.id == csku.id)
        if (sku) {
          sku.num += num
          sku._attrList = defaultAttrs
        } else {
          sku = shopdetail.skuList.find(o => o.id == csku.id)
          sku._attrList = defaultAttrs
          sku = { ...sku, num: num }
          skuList.push(sku)
          product._itemList = skuList
          shopcarMap[shopdetail?.id] = product
          carCount += 1
        }
        uni.setStorageSync('car', shopcarMap)
        this.shopcarMap = shopcarMap
        this.carCount = carCount
        uni.showToast({
          title: '已加入购物车',
          duration: 1000
        })
        this.open = false
      } else {
        // 竞果商品
        console.log('竞果商品')
        this.addCart()
        this.open = false
      }
    },

    addCart() {
      const store = this.storeInfo
      const { num, shopdetail, strSkus, priceMap } = this
      const sku = priceMap[strSkus.split('，').join('-')]
      const skuId = sku.id
      const obj = {
        'storeId': store.id,
        'storeName': store.name,
        'goodsId': shopdetail.id,
        'goodsSkuId': skuId,
        'num': num,
        'goodsName': shopdetail.name,
        'pic': shopdetail.pic,
        'price': shopdetail.price,
        'linePrice': shopdetail.linePrice,
        'strSkus': strSkus,
        'unitName': shopdetail.unitName
      }
      service.post('/api/sass/addCart', obj).then(res => {
        uni.showToast({
          title: '已加入购物车',
          duration: 1000
        })
      })
    },
    opens: function() {
      this.type = 0
      this.showSpec()
      return
    },
    collectGood() {
      const goodId = this.goodsId
      service.post('/api/userGoods/collect/' + goodId).then(res => {
        this.isCollect = !this.isCollect
      })
    }
  }
}
</script>
<style scoped>
page{height:100%;}
.main{width:100%;height:auto;background:#f8f9fa;padding:0;overflow:hidden;padding-bottom:106rpx;}
.swiper-wrap{position:relative;width:100%;height:600rpx;}
.typePop{width:140rpx;height:60rpx;background:#ffdb00;display:flex;align-items:center;justify-content:center;font-size:26rpx;color:#333;border-radius:0 30rpx 30rpx 0;position:absolute;top:0;left:0;}
.img-wrap{width:100%;height:600rpx;}
.img-wrap image{width:100%;height:100%;}
.moreJuzi{display:flex;align-items:center;font-size:24rpx;color:#666;margin-top:4rpx;}
.businessInfo-wrap{width:100%;box-sizing:border-box;}
.businessInfo{background-color:#fff;width:100%;box-sizing:border-box;padding:32rpx 28rpx;}
.businessInfo .title{width:100%;font-size:28rpx;color:#333;}

.line{width:100%;height:1rpx;background-color:#eee;}

.prodrctInfo{width:100%;box-sizing:border-box;padding: 20rpx;background-color: #ffffff}
.productname{font-size:28rpx;color:#333;text-align: justify;}
.shareIcon{display: block;width: 40rpx;height: 40rpx;padding: 0;border:none;background: #ffffff;}
button.shareIcon:after{border:none;}
.productCount{margin-top: 20rpx;}
.productCount .price{font-size: 32rpx;color: #f5a654;font-weight: bold;}
.price span.line{font-size: 24rpx;color: #ccc;margin-left:10rpx; text-decoration: line-through;}
.price span.point{font-size: 24rpx;color: #f5a654;margin-left:10rpx;}

.productCount .count{font-size: 26rpx;color: #6666;}
.proInduction{width: 100%;margin-top: 20rpx}
.nullInduction{width: 100%;margin-top: 20rpx}
.productImg{width: 100%;display: block;}
.xuzhi{font-size:12px;color:#999;}
.nickname{font-size:15px;color:#333;margin-left:20rpx;}

.footer{position:fixed;bottom:0;left:0;width:100%;height:96rpx;background:#fff;}
.smallBtn{height: 96rpx;background-color: #fff;border:none;padding: 10rpx 0 0;}
.small_icon{width: 42rpx;height: 42rpx; display: block;}
.small_txt{font-size: 20rpx;line-height:36rpx}
.joinBtn{width:200rpx;height: 66rpx;text-align: center;line-height: 66rpx;background-color: #ffa217;color: #fff;font-size: 26rpx; border:none;border-radius: 50rpx 0 0 50rpx;font-weight: bold}
.buyBtn{width:200rpx;height: 66rpx;background-color: #fe5864;text-align: center;line-height: 66rpx;color: #fff;font-size: 26rpx; border:none;border-radius: 0 50rpx 50rpx 0;font-weight: bold}

.selectWrap{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:999;}
.selectModal{position: fixed;bottom: 0;left: 0;width: 100%;padding: 24rpx 24rpx 130rpx;box-sizing:border-box;z-index:9999;background-color: #fff;border-radius: 16rpx 16rpx 0 0;}
.closeSelect{position: absolute;width: 80rpx;height: 80rpx;top: 0;right: 0;z-index:99999}
.closeSelect image{display: block;width: 40rpx;height: 40rpx;}
.selectTit{font-size: 24rpx;color: #333;}

.sItem{padding: 20rpx;background: #fff;margin-top: 20rpx;}
.sImg{width: 80rpx; height:80rpx;border-radius:12rpx;border:1rpx #eee solid;box-sizing: border-box;}
.sTit{font-size: 26rpx;color: #333;padding-left:10rpx;}
.entry{width: 140rpx;height: 56rpx;border:1rpx #e5e5e5 solid;border-radius: 8rpx;font-size: 24rpx;line-height: 56rpx;text-align: center;}

.selectType div{
  height: 56rpx;background-color: #f6f6f6;font-size: 24rpx;color: #333;margin-right: 24rpx;border-radius: 100rpx;
  padding:0 30rpx;text-align: center;line-height: 56rpx;box-sizing:border-box;display: inline-block;margin-bottom: 16rpx;
  border: 1rpx #fff solid
}

.selectType div:last-child{margin-right: 0;}
.selectType div.on{border: #fe5864 1rpx solid; color: #fff; color:#fe5864;}
.selectType div.null{border: 1rpx dashed #CFCFCF;color: #CFCFCF;background-color: #fff;}

.mtit{border-bottom: 1rpx #e5e5e5 solid;font-size:28rpx;padding-bottom: 10rpx;}
.goodCount{ margin-top:30rpx; }
.goodCount .tit { font-size: 26rpx; color: #333333; }
.numberCtrl .ctlbtn { color: #999; width: 50rpx; height: 40rpx; display: block; background-color: #f5f5f5; }
.numberCtrl .goodNum { width: 70rpx; height: 40rpx; text-align: center; font-size: 24rpx; color: #333; background-color: #f5f5f5; line-height: 40rpx; margin: 0 10rpx; font-weight: bold; }

.selectDiv{background: #FFFCEF;border: 1rpx solid #ffa217;border-radius: 4rpx;height: 60rpx;width: 100%;padding-left: 20rpx;box-sizing:border-box;margin-top: 20rpx;font-size: 24rpx;color: #999999;}
.selectBtn{width: 670rpx;height: 80rpx; border-radius: 99rpx; line-height: 80rpx;text-align: center;background-color: #fe5864;font-size: 32rpx;color: #fff;font-weight: bold;}
.bbtn{position: absolute;bottom: 20rpx;left: 40rpx;}
</style>
