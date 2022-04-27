<script>
export default {
  onLaunch: function() {
    uni.removeStorageSync('storeShare')
  },
  onShow: function() {
    const updateManager = uni.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function(res) {
      uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function(res) {
      // 新的版本下载失败
    })
  }
}
</script>

<style>
	@import './uni.css';
	.uni-page-wrapper{
		width: 100vw;
		height: 100vh;
		background: red;
	}
	.uni-page-body{
		width: 100%;
		height: 100%;
		font-size: 14px;
	}
</style>
