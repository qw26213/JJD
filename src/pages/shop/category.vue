<template>
  <div class="main">
    <NavBar :title="title" />
    <view class="view_head">
      <view class="view_head_search plr20">
        <input style="color:#333;font-size:28rpx" class="ub-f1" placeholder="搜索您想要的商品" :value="content" adjust-position always-embed confirm-type="search" @confirm="searchData" @input="bindInput" />
        <image src="../../static/search.png" @click="searchData" />
      </view>
    </view>
    <div v-if="categorys.length > 0" class="utabs ub ub-ac plr20">
      <div v-for="(item, index) in categorys" :key="index" class="item ub ub-ver ub-ac" :class="{'on': curTab===index}" @click="swtichTab(index)">
        <div class="txt tx-c">{{ item.name }}</div>
        <div class="line" />
      </div>
    </div>
    <div class="content plr20">
      <div class="conTxt">
        <div v-for="item in dataList" :key="item.pic" class="pItem" @click.stop="toDetail(item.id)">
          <image class="pImg" :src="item.pImg" mode="aspectFill" />
          <div class="pTit ovex">{{ item.name }}</div>
          <div class="price">
            ￥{{ item.price }}
            <span>{{ item.linePrice }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service from '@/utils/http'
import constant from '@/utils/constant'
import { errDialog, loading, toPage } from '@/utils/util'
export default {
  filters: {
    nameFormat(str) {
      return str && str.length > 4 ? str.substr(0, 4) : str
    }
  },
  data() {
    return {
      type: 1,
      title: '',
      categorys: [],
      curTab: 0,
      content: '',
      idCategory: '',
      userIcon: '',
      isBottom: false,
      dataList: [],
      pageNum: 1
    }
  },
  onLoad(options) {
    this.idCategory = options.id
    this.title = options.name
    this.type = options.type
    this.getData(options.id)
  },
  onReachBottom() {
    if (!this.isBottom) {
      this.pageNum++
      this.getDataById()
    }
  },
  methods: {
    toDetail(id) {
      toPage('/pages/shop/detail?id=' + id + '&type=' + this.type)
    },
    bindInput(e) {
      this.content = e.detail.value
    },
    getData(parentId) {
      service.get('/api/category/listAll?parentId=' + parentId).then(res => {
        this.categorys = res.data
        if (this.categorys.length > 0) {
          this.idCategory = this.categorys[0].id
          this.getDataById()
        } else {
          this.idCategory = parentId
          this.getDataById()
        }
      })
    },
    getDataById() {
      service.get('/api/goods/list?params[pageSize]=12&params[pageNum]=' + this.pageNum + '&idCategory=' + this.idCategory).then(res => {
        const result = res.data.list || []
        result.forEach(it => {
          it.pImg = it.pic.split(',')[0]
        })
        this.dataList = this.dataList.concat(result)
        this.isBottom = result.length < 9
      })
    },
    searchData() {
      const value = this.content
      if (value === '') {
        return errDialog('请输入搜索词')
      }
      if (this.type == 1) {
        service.get('/api/goods/list?searchValue=' + value + '&idCategory=' + this.idCategory).then(res => {
          this.dataList = res.data.list || []
          this.dataList.forEach(it => {
            it.pImg = it.pic.split(',')[0]
          })
        })
      } else {
        service.get('/api/sass/goods/list?searchValue=' + value + '&idCategory=' + this.idCategory).then(res => {
          this.dataList2 = res.data.list || []
          this.dataList2.forEach(it => {
            it.pImg = it.pic.split(',')[0]
          })
        })
      }
    },
    swtichTab(index) {
      if (this.curTab == index) return
      this.curTab = index
      this.pageNum = 1
      this.dataList = []
      this.idCategory = this.categorys[index].id
      this.getDataById()
    }
  }
}
</script>
<style scoped>
.main { position: relative; width: 100%; height: 100%; background: #fff;}
.view_head {background-color: white; padding: 20rpx 24rpx;}
.view_head .view_head_search { height: 80rpx; background-color: #F8F8F8; border-radius: 40rpx; display: flex; align-items: center; }
.view_head .view_head_search image { width: 36rpx; height: 36rpx;}
.icon_menu{width: 80rpx;height: 80rpx;}
.menuTit{margin-top: 16rpx; font-size: 26rpx;}
.content {padding: 0 20rpx 20rpx; background: #fff;}
.tit{font-size: 28rpx; font-weight: bold; margin-bottom:12rpx}
.conTxt{ display: flex; flex-wrap: wrap;}
.pItem{width: 223rpx;padding-bottom:2rpx; margin-bottom: 24rpx;border-radius: 12rpx;margin-right:20rpx}
.pItem:nth-child(3n+0) { margin-right: 0;}
.utabs .item{padding: 0 20rpx;}
.pImg{width: 223rpx; height:223rpx;border-radius:16rpx;border:1rpx #eee solid;box-sizing: border-box;}
.pTit{font-size: 24rpx;color: #333;padding-left:10rpx;font-weight: bold;text-align: left;}
.ovex{word-wrap: break-word;overflow: hidden;text-overflow: ellipsis;}
.price{font-size: 28rpx;color: #ff7744;font-weight: bold;padding-left:10rpx}
.count{font-size: 28rpx;color: #ccc;margin-bottom: 16rpx;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
</style>
