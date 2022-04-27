<template>
  <div class="main ub ub-ver">
    <NavBar title="搜索商品" />
    <view class="view_head" bindtap="togoserch">
      <view class="view_head_search plr20">
        <input style="color:#333;font-size:28rpx" class="ub-f1" placeholder="搜索您想要的商品" :value="content" adjust-position always-embed confirm-type="search" @confirm="getData" @input="bindInput" />
        <image src="../../static/search.png" @click="getData" />
      </view>
    </view>
    <div v-if="isHistory" class="history ub-f1">
      <div class="plr20" style="font-size:26rpx">历史搜索</div>
      <div class="tags ub ub-ac plr20">
        <span class="tag" @click.stop="getResult('方便面')">方便面</span>
        <span class="tag" @click.stop="getResult('冰红茶')">冰红茶</span>
        <span class="tag" @click.stop="getResult('牛奶')">牛奶</span>
      </div>
    </div>
    <div v-else class="utabs ub ub-ac">
      <div v-for="(item,index) in ['门店专属', '竞+Max']" :key="index" class="item ub-f1 ub ub-ver ub-ac" :class="{'on': curTab===index}" @click="curTab=index">
        <div class="txt tx-c">{{ item }}</div>
        <div class="line" />
      </div>
    </div>
    <div v-if="curTab == 0 && dataList1.length > 0" class="ub-f1 content plr20">
      <div v-for="(item, index) in dataList1" :key="index" class="pItem ub ub-ac" @click.stop="toDetail(item.id, 1)">
        <image class="pImg" :src="item.pic" mode="aspectFill" />
        <div class="ub-f1">
          <div class="pTit">{{ item.name }}</div>
          <div class="count">销量：{{ item.sold }}</div>
          <div class="price">
            ￥{{ item.price }}
            <span>￥{{ item.linePrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="curTab == 1 && dataList2.length > 0" class="ub-f1 content plr20">
      <div v-for="(item, index) in dataList2" :key="index" class="pItem ub ub-ac" @click.stop="toDetail(item.id, 5)">
        <image class="pImg" :src="item.pic" mode="aspectFill" />
        <div class="ub-f1">
          <div class="pTit">{{ item.name }}</div>
          <div class="count">销量：{{ item.sold }}</div>
          <div class="price">
            ￥{{ item.price }}
            <span>￥{{ item.linePrice }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="(dataList1.length === 0 && getedData1 && curTab === 0) || (dataList2.length === 0 && getedData2 && curTab === 1)" class="content ub-f1 ub ub-ver ub-ac ub-pc">
      <image class="nodataImg" src="../../static/null/null3.png" mode="widthFix" />
      <div class="nodataTxt">暂无搜索结果</div>
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
      curTab: 0,
      isHistory: true,
      content: '',
      userIcon: '',
      dataList1: [],
      dataList2: [],
      getedData1: false,
      getedData2: false
    }
  },
  methods: {
    getData(parentId) {
      service.get('/api/category/listAll?parentId=' + parentId).then(res => {
        this.categorys = res.data
        if (this.categorys.length > 0) {
          this.getDataById(this.categorys[0].id)
        }
      })
    },
    getDataById(id) {
      service.get('/api/goods/list?idCategory=' + id).then(res => {
        this.dataList = res.data.list || []
      })
    },
    bindInput(e) {
      this.content = e.detail.value
    },
    toDetail(id, type) {
      toPage('/pages/shop/detail?id=' + id + '&type=' + type)
    },
    getResult(str) {
      this.content = str
      this.getData()
    },
    getData() {
      this.isHistory = false
      const value = this.content
      service.get('/api/goods/list?searchValue=' + value).then(res => {
        this.dataList1 = res.data.list || []
        this.getedData1 = true
      })
      service.get('/api/sass/goods/list?searchValue=' + value).then(res => {
        this.dataList2 = res.data.list || []
        this.getedData2 = true
      })
    },
    swtichTab(index) {
      this.curTab = index
    }
  }
}
</script>
<style scoped>
.main {position: relative; width: 100%; height: 100%; }
.view_head {background-color: white;padding: 20rpx 24rpx;}
.view_head .view_head_search { height: 80rpx; background-color: #F8F8F8; border-radius: 40rpx; display: flex; align-items: center;}
.view_head .view_head_search image {width: 36rpx;height: 36rpx;}
.history{background-color: #fff;margin-top:20rpx;padding-top:20rpx;}
.tags{display: flex;flex-wrap: wrap;}
.tag{font-size: 24rpx;padding: 5rpx 15rpx;background-color: #f1f1f1;margin-top:20rpx;margin-right:20rpx;border-radius: 20rpx;}
.icon_menu{width: 80rpx;height: 80rpx;}
.menuTit{ margin-top: 16rpx; font-size: 26rpx;}
.content {padding: 10rpx 20rpx 20rpx; background: #f7f7f7;}
.pItem{width: 710rpx;padding-bottom:10rpx; margin-bottom: 24rpx;background: #fff;border-radius: 12rpx;}
.pImg{width: 155rpx; height:155rpx;border-radius: 0 0 8rpx 8rpx;}
.pTit{font-size: 28rpx;color: #333;padding-left:10rpx;font-weight: bold;}
.price{font-size: 28rpx;color: #ff7744;font-weight: bold;padding-left:10rpx}
.count{font-size: 28rpx;color: #ccc;margin-bottom: 16rpx;padding-left:10rpx}
.price span{font-size: 24rpx;color: #ccc;margin-left:10rpx;text-decoration: line-through;}
</style>
