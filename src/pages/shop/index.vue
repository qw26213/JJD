<template>
  <div class="main">
    <NavBar title="商品" />
    <view class="view_head" @click="toSearch">
      <view class="view_head_search plr20">
        <div style="color:#aaa;font-size:28rpx" class="ub-f1">搜索您想要的商品</div>
        <image src="../../static/search.png" />
      </view>
    </view>
    <div class="utabs ub ub-ac">
      <div v-for="(item,index) in ['门店专属', '竞+Max']" :key="index" class="item ub-f1 ub ub-ver ub-ac" :class="{'on': curTab==index}" @click="switchTab(index)">
        <div class="txt tx-c">{{ item }}</div>
        <div class="line" />
      </div>
    </div>
    <!-- <div class="banner">
      <swiper indicator-dots="true" style="height:200rpx" autoplay="true" interval="2000" duration="500">
        <swiper-item v-for="(item, index) in (curTab == 0 ? goodsMarketing1 : goodsMarketing2)" :key="index">
          <image :src="item.pic" class="bImg" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </div>-->
    <div v-show="curTab == 0" class="menus ub-f1 ub ub-ac ub-pj">
      <div v-for="(item, index) in categoryList1" :key="index" class="ub-f1 ub-ver ub ub-ac ub-pc" @click="toCategery(item.id, item.name, 1)">
        <image :src="item.pic" class="icon_menu" mode="aspectFit" />
        <div class="menuTit">{{ item.name }}</div>
      </div>
    </div>
    <div v-show="curTab == 1" class="menus ub ub-ac ub-pj">
      <div v-for="(item, index) in categoryList2" :key="index" class="ub-f1 ub-ver ub ub-ac ub-pc" @click="toCategery(item.id, item.name, 5)">
        <image :src="item.pic" class="icon_menu" mode="aspectFit" />
        <div class="menuTit">{{ item.name }}</div>
      </div>
    </div>
    <div v-if="curTab == 0" class="content1 plr20">
      <div v-for="(item, index) in goodsList1" :key="index" class="pItem" @click="toDetail(item.id, 1)">
        <image class="pImg" :src="item.pImg" mode="aspectFill" />
        <div class="pTit" style="padding-left:16rpx">{{ item.name }}</div>
        <div class="price">
          ￥{{ item.price }}
          <span>￥{{ item.linePrice }}</span>
        </div>
      </div>
    </div>
    <div v-show="curTab == 1" class="content2">
      <div class="groupItem ub ub-ac plr10 bbc">
        <image class="titImg" src="../../static/icon_tit.png" mode="widthFix" />
        <div class="ub-f1 titTxt">最新上架</div>
      </div>
      <div class="ub pm1">
        <div v-for="(item,index) in leftGoods" :key="index" class="p10" style="border-right:1rpx #eee solid;width:470rpx" @click="toDetail(item.id, 5)">
          <div class="pTit">{{ item.name }}</div>
          <div class="price" style="margin-top:8rpx">
            ￥{{ item.price }}
            <span>￥{{ item.linePrice }}</span>
          </div>
          <image :src="item.pImg" class="pnImg1" mode="aspectFit" />
        </div>
        <div class="ub-f1" style="padding:15rpx">
          <div v-for="(item,index) in rightGoods" :key="index" :style="index? 'margin-top:20rpx' :'margin-top:0rpx'" @click="toDetail(item.id, 5)">
            <div class="pTit">{{ item.name }}</div>
            <div class="price" style="margin-top:0rpx">￥{{ item.price }}</div>
            <image :src="item.pImg" class="pnImg2" style="margin-top:4rpx" mode="aspectFit" />
          </div>
        </div>
      </div>
      <div class="ub ub-ac plr15 mt10 bgb" style="height:80rpx">
        <div class="ub-f1 titTxt">爆款商品</div>
        <div class="ub-f1 titTxt" style="margin-left:20rpx;padding-left:10rpx">明星店铺</div>
      </div>
      <div class="ub bgb plr10" style="padding-bottom:16rpx">
        <div class="ub-f1" style="border-right:1rpx #eee solid;padding-left:20rpx">
          <div v-for="(item, index) in goodsList2" :key="index" class="ub ub-ac ppItem" @click="toDetail(item.id, 5)">
            <image class="idxImg" :src="'../../static/icon_index' +index + '.png'" mode="scaleToFill" />
            <image class="pImg2" :src="item.pImg" mode="aspectFit" />
            <div class="pTit ub-f1">{{ item.name }}</div>
          </div>
        </div>
        <div class="ub-f1" style="padding-left:20rpx">
          <div v-for="(item, index) in hotShops" :key="index" class="ub ub-ac ppItem" @click="toStore(item.id)">
            <image class="idxImg" :src="'../../static/icon_index' +index + '.png'" mode="scaleToFill" />
            <image class="pImg2" :src="item.logo" mode="aspectFill" />
            <div class="pTit ub-f1">{{ item.name }}</div>
          </div>
        </div>
      </div>
      <div class="groupItem ub ub-ac plr10">
        <image class="titImg" src="../../static/icon_tit.png" mode="widthFix" />
        <div class="ub-f1 titTxt">活动推荐</div>
      </div>
      <div class="plr10">
        <div v-for="(item, index) in activityList" :key="index" class="activityItem" @click="toActivity(item.id)">
          <image class="activityImg" :src="item.actPic" mode="aspectFill" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, toPage, getStorageStore } from '@/utils/util'
export default {
  data() {
    return {
      curTab: 0,
      userInfo: {},
      userIcon: '',
      categoryList1: [],
      goodsMarketing1: [],
      goodsList1: [],
      categoryList2: [],
      goodsMarketing2: [],
      goodsList2: [],
      leftGoods: [],
      rightGoods: [],
      shopGoodsLabel: [],
      hotShops: [],
      activityList: [],
      pageNum: 1,
      isBottom: false
    }
  },
  onShow() {
    const shopTab = uni.getStorageSync('shopTab')
    this.curTab = shopTab || 0
  },
  onShareAppMessage: function() {
    const store = getStorageStore()
    return {
      title: store.name,
      path: `/pages/shop/index?share=1&storeId=` + store.id + '&storeName=' + store.name
    }
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
    this.getData1()
    this.getData2()
  },
  onReachBottom() {
    if (!this.isBottom) {
      this.pageNum++
      service.get('/api/goods/list?params[pageSize]=9&params[pageNum]=' + this.pageNum).then(res => {
        const result = res.data.list || []
        this.goodsList1 = this.goodsList1.concat(result)
        this.goodsList1.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
        this.isBottom = result.length < 9
      })
    }
  },
  methods: {
    switchTab(index) {
      uni.setStorageSync('shopTab', index)
      this.curTab = index
    },
    toDetail(id, type) {
      toPage('/pages/shop/detail?id=' + id + '&type=' + type)
    },
    toCategery(id, name, type) {
      toPage('/pages/shop/category?id=' + id + '&name=' + name + '&type=' + type)
    },
    toStore(id) {
      toPage('/pages/shop/store?id=' + id)
    },
    toSearch() {
      toPage('/pages/shop/search')
    },
    toActivity(id) {
      toPage('/pages/shop/actDetail?id=' + id)
    },
    getData1() {
      service.get('/api/category/listAll').then(res => {
        const categoryList = res.data || []
        this.categoryList1 = categoryList.filter(it => it.parentId === '0')
      })
      service.get('/api/app/goodsMarketing/list').then(res => {
        this.goodsMarketing1 = res.data || []
      })
      service.get('/api/goods/list?params[pageSize]=9&params[pageNum]=1').then(res => {
        const result = res.data.list || []
        result.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
        this.goodsList1 = result
        this.isBottom = result.length < 9
      })
      service.get('/api/shopGoodsLabel/listAll').then(res => {
        this.shopGoodsLabel = res.data || []
      })
    },
    getData2() {
      service.get('/api/sass/category/listAll').then(res => {
        const categoryList = res.data || []
        this.categoryList2 = categoryList.filter(it => it.parentId === '0')
      })
      service.get('/api/sass/goodsMarketing/list').then(res => {
        this.goodsMarketing2 = res.data || []
      })
      service.get('/api/sass/goods/list?params[pageSize]=3').then(res => {
        this.leftGoods = []
        this.rightGoods = []
        const list = res.data.list || []
        list.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
        list.forEach((item, index) => {
          if (index === 0) {
            this.leftGoods.push(item)
          } else if (index < 3) {
            this.rightGoods.push(item)
          }
        })
      })
      service.get('/api/sass/goods/list?params[pageSize]=3&params[orderByColumn]=actualSales').then(res => {
        this.goodsList2 = res.data.list || []
        this.goodsList2.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
      })
      service.get('/api/sass/hotShop/list?params[pageSize]=3').then(res => {
        this.hotShops = res.data || []
      })
      service.get('/api/sass/activity/list?params[pageSize]=3').then(res => {
        this.activityList = res.data || []
      })
    }
  }
}
</script>
<style scoped>
.main { position: relative;  width: 100%;  height: 100%;}
.view_head { background-color: white; padding: 20rpx 24rpx;}
.view_head .view_head_search {height: 80rpx; background-color: #F8F8F8; border-radius: 40rpx; display: flex; align-items: center;}
.view_head .view_head_search image {width: 36rpx; height: 36rpx;}
.banner{width: 710rpx;margin: 20rpx auto;}
.bImg{width:710rpx;height:200rpx;min-height:200rpx;border-radius: 12rpx;}
.menus{width: 710rpx;height: 180rpx;background: #fff;margin: 20rpx auto 0;}
.icon_menu{width: 80rpx;height: 80rpx;}
.menuTit{margin-top: 16rpx; font-size: 26rpx;}
.content1 {padding: 20rpx 20rpx 20rpx; background: #f7f7f7; display: flex; flex-wrap: wrap;}
.pItem{width: 223rpx;padding-bottom:10rpx; margin-bottom: 20rpx;background: #fff;border-radius: 12rpx;margin-right:20rpx}
.pItem:nth-child(3n+0){margin-right: 0;}
.pImg{width: 223rpx;height:200rpx;border-radius:12rpx;}
.pTit{font-size: 26rpx;color: #333;}
.price{font-size: 26rpx;color: #ff7744;font-weight: bold;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
.groupItem{height: 88rpx;background: #fff;margin-top:16rpx}
.titImg{width: 41rpx;height: 41rpx;margin-right: 16rpx;}
.titTxt{font-size: 28rpx;color: #333; font-weight: bold;}
.arrow-right{width: 24rpx;height: 48rpx;}
.activityImg{width:710rpx;height:180rpx;border-radius: 8rpx; margin-top:12rpx}
.pm1{background: #fff;}
.pnImg1{width: 320rpx;height: 300rpx;margin:16rpx auto 0;display: block;border-radius: 10rpx;background: #fff}
.pnImg2{width: 220rpx;height: 110rpx;margin:16rpx auto 0;display: block;border-radius: 10rpx;background: #fff}
.ppItem{height: 104rpx;}
.idxImg{width: 40rpx;height: 56rpx;}
.pImg2{width: 82rpx;height: 82rpx;border-radius: 8rpx;margin-left:10rpx;margin-right:12rpx}
.activityItem{width:710rpx;height:180rpx;margin:16rpx auto; background-color: #fff;}
.activityImg{width:710rpx;height:180rpx;border-radius: 8rpx; }
.time{font-size: 24rpx; color: #999;}
.icon_ctrl{width: 36rpx; height: 36rpx;margin-right:6rpx;}
.num_ctrl{font-size:28rpx;color: #333;margin-right:20rpx;}
</style>
