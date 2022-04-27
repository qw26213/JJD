<template>
  <view class="main container">
    <NavBar title="活动详情" />
    <div class="toper">
      <div style="font-size:32rpx; font-weight:bold">{{ article.title }}</div>
      <div class="ub ub-ac" style="font-size:24rpx;margin-top:10rpx">
        <img src="../../static/icon_time.png" class="udb" style="width:32rpx;height:32rpx;margin-right:16rpx" />
        {{ article.createTime }}
      </div>
      <button v-if="article.isMatch" class="btn-report" @click="reportTask()">{{ applyStatus ===0 ? '立即报名' : '取消报名' }}</button>
    </div>
    <div class="content">
      <rich-text :nodes="textCon" />
    </div>
    <div class="tit bgb plr10" style="margin-top:20rpx">全部评论</div>
    <div v-for="(item,index) in commentList" :key="index" class="citem plr10 ub ub-ac">
      <img :src="item.avatar" style="width:80rpx;height:80rpx;border-radius:100rpx" />
      <span style="margin-left:20rpx">{{ item.nike }}</span>
      <span style="margin-left:20rpx">{{ item.content }}</span>
    </div>
    <div class="bottom ub ub-ac plr15" :style="'bottom:' + keyboardHeight + 'px'">
      <input type="text" class="ub-f1 udb inputTxt" placeholder="说两句..." :value="content" adjust-position always-embed confirm-type="send" @confirm="commentAct" @focus="bindFocus" @input="bindInput" @blur="bindBlur" />
      <image v-if="operInfo.isLike" src="../../static/icon_ctrl11.png" class="icon_ctrl" @click.stop="likeAct" />
      <image v-else src="../../static/icon_ctrl1.png" class="icon_ctrl" @click.stop="likeAct" />
      <span class="num_ctrl">{{ article.likes }}</span>
      <image v-if="operInfo.isCollect" src="../../static/icon_ctrl31.png" class="icon_ctrl1" @click.stop="collectAct" />
      <image v-else src="../../static/icon_ctrl3.png" class="icon_ctrl1" @click.stop="collectAct" />
      <span class="num_ctrl" style="margin-right:0">{{ article.collects }}</span>
    </div>
  </view>
</template>
<script>
import service from '@/utils/http'
import { formatRichText } from '@/utils/util'

export default {
  data() {
    return {
      curTab: 0,
      article: {},
      commentList: [],
      textCon: '',
      content: '',
      operInfo: {},
      commentcontent: '', // 内容（comment）
      windowHeight: 0, // 记录界面高度（comment）
      containerHeight: 0, // 记录未固定整体滚动界面的高度（comment）
      containerBottomHeight: 0, // 记录未固定整体滚动界面距离底部高度（comment）
      keyboardHeight: 0, // 键盘高度（comment）
      isIphone: false, // 是否为苹果手机，因苹果手机效果与Android有冲突，所以需要特殊处理（comment）
      applyStatus: -1
    }
  },
  onShareAppMessage() {
    const store = getStorageStore()
    return {
      title: store.name,
      path: `/pages/shopset/index?share=1&storeId=` + store.id + '&storeName=' + store.name
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
    this.id = options.id
    this.getArticle()
    this.getOperInfo()
    this.getComments()
    uni.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight
        this.isIphone = res.model.indexOf('iphone') >= 0 || res.model.indexOf('iPhone') >= 0
      }
    })
    setTimeout(() => {
      this.refreshContainerHeight()
    }, 300)
  },
  methods: {
    reportTask() {
      const id = this.id
      service.post(`/api/userPoints/apply/${id}`).then(res => {
        this.applyStatus = !this.applyStatus
        uni.showToast({
          title: this.applyStatus ? '报名成功' : '已取消报名',
          duration: 1500
        })
      })
    },
    refreshContainerHeight: function() { // 刷新整体界面高度、距离等信息，如列表有上划加载数据，需要在数据加载过后调用此方法进行高度以及间距的刷新
      var query = uni.createSelectorQuery()
      query.select('.container').boundingClientRect()
      query.exec((res) => {
        console.log(res[0])
        // container为整体界面的class的样式名称
        this.containerHeight = res[0].height
        this.containerBottomHeight = res[0].bottom
      })
    },
    bindFocus(e) { // comment框焦点获取监听
      if (!this.isIphone) {
        var keyboardHeight = e.detail.height
        var windowHeight = this.windowHeight
        var containerHeight = this.containerHeight
        var containerBottomHeight = this.containerBottomHeight
        // 整体内容高度大于屏幕高度，才动态计算输入框移动的位置；
        if (containerHeight > windowHeight) {
          if ((containerBottomHeight - windowHeight) > keyboardHeight) {
            // 距离底部高度与屏幕高度的差值大于键盘高度，则comment布局上移键盘高度；
            this.keyboardHeight = e.detail.height
          } else {
            // 距离底部高度与屏幕高度的差值小于键盘高度，则comment布局上移距离底部高度与屏幕高度的差值；
            var newHeight = containerBottomHeight - windowHeight
            this.keyboardHeight = newHeight
            console.log(this.keyboardHeight)
          }
        } else {
          this.keyboardHeight = 8
        }
      } else {
        this.keyboardHeight = 8
      }
    },
    bindBlur(e) {
      this.keyboardHeight = 0
    },
    bindInput(e) {
      this.content = e.detail.value
    },
    getArticle() {
      const id = this.id
      service.get(`/api/article/release/${id}`).then(res => {
        this.article = res.data
        this.textCon = formatRichText(this.article.content || '')
      })
      service.post(`/api/userPoints/applyStatus/${id}`).then(res => {
        this.applyStatus = res.data
      })
    },
    getOperInfo() {
      const id = this.id
      service.get('/api/article/userOperation/' + id).then(res => {
        this.operInfo = res.data
      })
    },
    getComments() {
      const id = this.id
      service.get('/api/article-comment?articleId=' + id).then(res => {
        this.commentList = res.data.list || []
      })
    },
    likeAct() {
      const id = this.id
      service.put(`/api/article/like/${id}`).then(res => {
        this.operInfo.isLike = !this.operInfo.isLike
        this.getOperInfo()
        this.getArticle()
      })
    },
    collectAct() {
      const id = this.id
      service.post(`/api/userCollects/collect/${id}`).then(res => {
        this.operInfo.isCollect = !this.operInfo.isCollect
        this.getOperInfo()
        this.getArticle()
      })
    },
    commentAct() {
      const obj = {
        articleId: this.id,
        content: this.content
      }
      service.post(`/api/article-comment`, obj).then(res => {
        this.content = ''
        uni.showToast({
          title: '评论成功',
          duration: 1000
        })
      })
    }
  }
}
</script>
<style scoped>
.main { position: relative; width: 100%; height: 100%; background: #f7f7f7; padding-bottom: 100rpx;}
.toper {width: 100%; padding: 20rpx; background: #ffffff; position: relative;}
.tit{height: 80rpx;border-bottom: 1rpx #eee solid;font-size: 26rpx;line-height: 80rpx;background-color: #fff;}
.citem{height: 180rpx;background-color: #fff;}
.content {
  border-radius: 16rpx 16rpx 0 0; background: #ffffff; overflow: hidden; margin-top: 20rpx;
  position: relative; z-index: 1; padding: 30rpx 30rpx 100rpx; box-sizing: border-box;
}
.btn-report {
  width: 160rpx; height: 52rpx; font-size: 26rpx;background: #0099ff;color: #fff;
  padding: 0;line-height: 52rpx;position: absolute;top: 20rpx;right: 20rpx;
}
.pImg{height: 200rpx;width: 100%;border-radius: 10rpx;}
.icon_ctrl{width: 46rpx; height: 46rpx;margin-right:6rpx;}
.icon_ctrl1{width: 40rpx; height: 40rpx;margin-right:6rpx;}
.num_ctrl{font-size:28rpx;color: #666;margin-right:20rpx;}
.bottom{position: fixed; bottom: 0;left:0;width: 100%;height: 100rpx;background: #fff;z-index: 11; border-top: 1rpx #e5e5e5 solid;}
.inputTxt{height: 68rpx;border-radius: 12rpx; background: #f5f5f5;margin-right: 15rpx;font-size: 24rpx;padding-left: 16rpx;}
</style>
