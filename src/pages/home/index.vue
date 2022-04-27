<template>
  <div class="main">
    <NavBar :title="storeName" ishome="1" />
    <div class="banner">
      <swiper indicator-dots="true" style="height:200rpx" autoplay="true" interval="2000" duration="500">
        <swiper-item v-for="(item,index) in bannerlist" :key="index">
          <image :src="item.pic" class="bImg" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </div>
    <div class="storeDiv ub ub-ac plr10">
      <div class="addressDiv plr10 ub ub-ac" @click="openLocal">
        <image class="loclImg" src="../../static/icon_locl.png" mode="asceptFill" />
        {{ storeInfo.address || '*******' }}
      </div>
      <div class="ub-f1" />
      <image class="callImg" src="../../static/icon_call.png" mode="asceptFill" @click="openCall" />
    </div>
    <div class="ub ub-ac plr10 center" :class="{'shopset': !!shopsetData[0]}">
      <div class="aitem">
        <div class="groupItem ub ub-ac plr10" @click="toShop('0')">
          <image class="titImg" src="../../static/icon_hot.png" mode="asceptFill" />
          <div class="ub-f1 titTxt">热卖商品</div>
          <image class="arrow-right" src="../../static/arrow-right.png" mode="widthFix" />
        </div>
        <div class="ub ub-ac con" style="padding-left:20rpx">
          <div v-for="(item, index) in goodData" v-show="index < 2 && !!shopsetData" :key="index" class="pItem2" @click.stop="toDetail(item.id, 1)">
            <image class="pImg2" :src="item.pImg" mode="aspectFill" />
            <div class="pTit">{{ item.name | nameFormat }}</div>
            <div class="price">
              ￥{{ item.price | numFormat }}
              <span v-if="item.skuPoints">{{ item.skuPoints }}积分</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!!shopsetData[0]" class="aitem right">
        <div class="groupItem ub ub-ac plr10" @click="toShopset()">
          <image class="titImg" src="../../static/icon_hot.png" mode="asceptFill" />
          <div class="ub-f1 titTxt">热卖机区</div>
          <image class="arrow-right" src="../../static/arrow-right.png" mode="widthFix" />
        </div>
        <div class="ub ub-ac con" style="padding-left:20rpx">
          <div v-for="(item, index) in shopsetData" v-show="index < 2" :key="index" class="pItem2" @click="toShopset()">
            <!-- <image class="pImg2" src="../../static/shopset.png" mode="aspectFill" />-->
            <image class="pImg2" :src="item.pic || defaultImageUrl" mode="aspectFill" />
            <div class="pTit">{{ item.name | nameFormat }}</div>
            <div class="price">￥{{ item.price | numFormat }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="aitem" style="margin-top:16rpx">
      <div class="groupItem ub ub-ac plr10" @click="toShop('1')">
        <image class="titImg" src="../../static/icon_hot.png" mode="asceptFill" />
        <div class="ub-f1 titTxt">竞+Max</div>
        <image class="arrow-right" src="../../static/arrow-right.png" mode="widthFix" />
      </div>
      <div class="ub ub-ac" style="padding-left:20rpx">
        <div v-for="(item, index) in sassGoodList" :key="index" class="pItem2" @click.stop="toDetail(item.id, 5)">
          <image class="pImg2" :src="item.pImg" mode="aspectFill" />
          <div class="pTit">{{ item.name | nameFormat }}</div>
          <div class="price">￥{{ item.price | numFormat }}</div>
        </div>
      </div>
    </div>
    <div v-if="recommendData.length > 0" class="aitem" style="padding-bottom:0;margin-top:16rpx">
      <div class="groupItem ub ub-ac plr10" @click="toPath('/pages/activity/index')">
        <image class="titImg" src="../../static/icon_tit.png" mode="asceptFill" />
        <div class="ub-f1 titTxt">热门活动</div>
        <image class="arrow-right" src="../../static/arrow-right.png" mode="widthFix" />
      </div>
      <div class="plr10">
        <div v-for="(item, index) in recommendData" :key="index" class="activityItem" @click.stop="toActivity(item.id)">
          <div class="aTit">{{ item.title }}</div>
          <image class="activityImg" :src="item.image" mode="aspectFill" />
          <div class="ub ub-ac ub-pj">
            <div class="ub ub-ac">
              <image src="../../static/icon_ctrl1.png" class="icon_ctrl" />
              <span class="num_ctrl">{{ item.likes }}</span>
              <image src="../../static/icon_ctrl2.png" class="icon_ctrl" />
              <span class="num_ctrl">{{ item.comments }}</span>
              <image src="../../static/icon_ctrl3.png" class="icon_ctrl" />
              <span class="num_ctrl">{{ item.collects }}</span>
            </div>
            <div class="time">{{ item.releaseTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, getStorageStore, toPage } from '@/utils/util'
export default {
  filters: {
    numFormat(num) {
      const sts = num || 0
      return Number(sts).toFixed(0)
    },
    nameFormat(name) {
      return name && name.length > 5 ? name.substr(0, 4) + '...' : name
    }
  },
  data() {
    return {
      storeName: uni.getStorageSync('storeName') || '',
      isshare: 0,
      address: '',
      storeInfo: {},
      bannerlist: [],
      userIcon: '',
      shopsetData: [],
      recommendData: [],
      sassGoodList: [],
      roomData: [],
      defaultImageUrl: '../../static/shopset.png',
      goodData: []
    }
  },
  onLoad(options) {
    if (options.share) {
      uni.setStorageSync('storeShare', 1)
    }
    // #ifdef H5 || APP-PLUS
    uni.setStorageSync('storeId', '77661798554304532')
    // #endif
    uni.setStorageSync('shopTab', 0)
    if (options.storeId) {
      uni.setStorageSync('storeId', options.storeId)
    }
    if (options.storeName) {
      uni.setStorageSync('storeName', options.storeName)
      this.storeName = options.storeName
    }
    const storeId = uni.getStorageSync('storeId')
    if (storeId) {
      this.getData()
    } else {
      uni.reLaunch({
        url: '/pages/home/select'
      })
    }
  },
  onShareAppMessage: function() {
    return {
      title: this.storeName,
      path: `/pages/home/index?share=1&storeId=` + this.storeInfo.id + '&storeName=' + this.storeName
    }
  },
  methods: {
    toSearch() {
      toPage('/pages/shop/search')
    },
    toDetail(id, type) {
      toPage('/pages/shop/detail?id=' + id + '&type=' + type)
    },
    openLocal() {
      const { name, latitude, longitude, address } = this.storeInfo
      uni.openLocation({
        address,
        name,
        latitude,
        longitude,
        success: function() {
          console.log('success')
        }
      })
    },
    openCall() {
      uni.makePhoneCall({
        phoneNumber: this.storeInfo.phone
      })
    },
    getCheckinfo() {
      service.get('/api/equipment/getCheckInInfo').then(res => {
        this.checkInInfo = res.data || {}
      })
    },
    toActivity(id) {
      toPage('/pages/activity/detail?id=' + id)
    },
    toPath(url) {
      uni.switchTab({ url })
    },
    toShop(shopTab) {
      uni.setStorageSync('shopTab', shopTab)
      this.toPath('/pages/shop/index')
    },
    toShopset() {
      this.toPath('/pages/shopset/index')
    },
    getData() {
      const store = getStorageStore()
      service.get('/api/public/getStoreInfo?storeId=' + store.id).then(res => {
        this.storeInfo = res.data || {}
        this.storeName = this.storeInfo.name
      })
      service.get('/api/app/homeMarketing/list').then(res => {
        this.bannerlist = res.data || []
      })
      service.get('/api/goods/list?params[pageSize]=4').then(res => {
        this.goodData = res.data.list || []
        this.goodData.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
      })
      service.get('/api/seates/hotAreaList?params[pageSize]=2').then(res => {
        this.shopsetData = res.data || []
      })
      service.get('/api/article/release/recommend?params[pageNum]=1&params[pageSize]=3').then(res => {
        this.recommendData = res.data.list || []
      })
      service.get('/api/sass/goods/list?params[pageSize]=4').then(res => {
        this.sassGoodList = res.data.list || []
        this.sassGoodList.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
      })
    }
  }
}
</script>
<style scoped>
.main { position: relative; width: 100%; height: 100%; background: #f7f7f7;}
.groupItem{height: 78rpx;background: #fff;margin-bottom:10rpx}
.titImg{width: 36rpx;height: 36rpx;margin-right: 10rpx;}
.titTxt{font-size: 28rpx;color: #333; font-weight: bold;}
.arrow-right{width: 20rpx;height: 40rpx;}
.banner{width: 710rpx;margin: 10rpx auto;border-radius: 12rpx;}
.bImg{width:710rpx;height:200rpx;min-height:200rpx;border-radius: 12rpx;}
.aitem{width: 710rpx;background: #fff;margin:0 auto; border-radius: 12rpx;overflow: hidden;padding-bottom: 20rpx;}
.icon_menu{width: 80rpx;height: 80rpx;}
.menuTit{ margin-top: 16rpx; font-size: 26rpx;}
.center .aitem.right{margin-left: 20rpx;}
.storeDiv{
  width: 710rpx;
  height: 82rpx;
  background-color: #fff;
  margin: 16rpx auto;
  border-radius: 16rpx;
  background-image: url(data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABOAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVEMTZCOTJDNTRENjExRUNBMjFDRjMxMDc4NkVBMkJGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVEMTZCOTJENTRENjExRUNBMjFDRjMxMDc4NkVBMkJGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUQxNkI5MkE1NEQ2MTFFQ0EyMUNGMzEwNzg2RUEyQkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUQxNkI5MkI1NEQ2MTFFQ0EyMUNGMzEwNzg2RUEyQkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAADAgICAgIDAgIDBAMCAwQFAwMD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);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.loclImg{width: 32rpx;height: 32rpx;display: block;margin-right: 6rpx;}
.callImg{width: 40rpx;height: 40rpx;display: block;}
.addressDiv{font-size: 24rpx;color: #333;background-color: #fff;height: 56rpx;border-radius: 56rpx;line-height: 56rpx;}
.pItem1{width: 170rpx; margin-right:20rpx}
.pImg1{width: 170rpx;height:120rpx; border-radius: 8rpx;}
.pItem2{width: 153rpx; margin-right:20rpx}
.pImg2{width: 153rpx;height:153rpx; border-radius: 8rpx;background: #fff;}
.shopset .pImg2{width: 144rpx; height: 144rpx;}
.shopset .aitem .con{overflow: hidden!important;}
.pTit{font-size: 25rpx;color: #333;padding-left: 10rpx;}
.price{font-size: 28rpx;color: #ff7744;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;}
.activityImg{width:670rpx;height:180rpx;border-radius: 8rpx; margin:8rpx auto 8rpx}
.activityItem{margin:10rpx 0 20rpx}
.aTit{font-size: 25rpx;color: #333;text-align:left}
.time{font-size: 24rpx; color: #999;}
.icon_ctrl{width: 32rpx; height: 32rpx; margin-right:8rpx;}
.num_ctrl{font-size:24rpx; color: #999; margin-right:20rpx;}
</style>
