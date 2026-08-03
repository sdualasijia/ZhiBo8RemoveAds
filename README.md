# ZhiBo8RemoveAds

直播吧 iOS 去广告 Loon 插件。当前规则根据直播吧 6.9.1（2026-08-03）网络请求制作，兼容 App Store 版 Loon 3.3.x。

## 去除内容

- 开屏广告（`main_splash_ios`）
- 首页信息流广告
- 首页赛程卡片间广告
- 插屏、新闻/视频列表、内页、评论、视频贴片等统一配置下发的广告位
- “我的”页面中的“游戏中心”区块

插件不会修改直播、赛程、比分、新闻、账号登录或会员状态。

## 安装

需要已安装、信任 Loon 的 MitM 证书。本插件使用经典 `[URL Rewrite]` 和 `[Script]` 语法，不依赖 Loon 3.5.1 的新版 Rewrite。

[点击导入 Loon 插件](https://www.nsloon.com/openloon/import?plugin=https%3A%2F%2Fraw.githubusercontent.com%2Fsdualasijia%2FZhiBo8RemoveAds%2Fmain%2FZhiBo8RemoveAds.plugin)

也可以在 Loon 的“插件”页面手动添加：

```text
https://raw.githubusercontent.com/sdualasijia/ZhiBo8RemoveAds/main/ZhiBo8RemoveAds.plugin
```

安装后：

1. 启用插件和 MitM；
2. 强制结束直播吧并重新打开；
3. 首次打开后再结束并打开一次，让改写后的配置覆盖旧广告缓存。

## 广告 SDK 兜底

插件会阻止旧缓存配置在新配置下发前请求开屏广告。该规则涉及穿山甲、优量汇和 Tanx 的广告接口，也会同时拦截其他 App 使用这些相同接口请求的广告。若不希望影响其他 App，可在插件中删除 `[URL Rewrite]` 下对应的三条 SDK 规则，但第一次启动时可能仍显示缓存广告。

## 工作方式

插件通过 `ZhiBo8RemoveAds.js` 重写以下直播吧接口：

- `a.qiumibao.com/ios/config/`：关闭广告总开关、开屏、插屏、弹窗及预加载；
- `a.qiumibao.com/activities/config.php`：关闭服务端下发的全部广告位；
- `a.qiumibao.com/found/`：移除 `is_game=true` 的游戏中心区块。

同时对开屏阶段可能提前发起的广告竞价请求提供可关闭的兜底拦截。

## 验证情况

已使用原始 HAR 响应进行离线回放，确认：

- `advert.enable` 改为字符串 `false`；
- `splash_bk`、`inter_bk` 改为 `disable`；
- 29 个 `advert_list` 广告位全部改为 `enable=false`；
- 游戏中心区块被移除，其他“我的”页面功能区块保留。

尚未覆盖的新版接口或广告样式，请提交 Issue，并附上脱敏后的请求 URL、响应结构和应用版本。不要上传 Cookie、Token、设备标识或完整未脱敏 HAR。

## 恢复

在 Loon 中停用或删除插件，然后强制结束并重新打开直播吧。
