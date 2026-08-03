/*
 * ZhiBo8RemoveAds response rewriter for Loon.
 * Uses the classic Loon script API and targets Loon 3.4.0 or later.
 */

var url = $request.url;
var body = $response.body;

try {
  var data = JSON.parse(body);

  if (url.indexOf("/ios/config/") !== -1) {
    disableMainConfig(data);
  } else if (url.indexOf("/activities/config.php") !== -1) {
    disableActivityConfig(data);
  } else if (url.indexOf("/found/") !== -1 && Array.isArray(data)) {
    data = data.filter(function (section) {
      return section && section.is_game !== true;
    });
  }

  $done({ body: JSON.stringify(data) });
} catch (error) {
  // Keep the original response if the server changes to a non-JSON format.
  $done({});
}

function disableMainConfig(data) {
  if (data.advert) {
    data.advert.enable = "false";
  }

  var config = data.advert_config;
  if (!config) {
    return;
  }

  config.splash_bk = "disable";
  config.inter_bk = "disable";
  config.pop_bk = "disable";
  config.other_bk = "disable";
  config.is_pre_request = 0;

  if (config.wifi_preloading) {
    config.wifi_preloading.enable = "disable";
  }

  if (Array.isArray(config.activities_config)) {
    config.activities_config.forEach(function (item) {
      item.enable = false;
      if (item.advert_report) {
        item.advert_report.enable = false;
      }
    });
  }
}

function disableActivityConfig(data) {
  if (data.advert_config) {
    data.advert_config.splash_bk = "disable";
    data.advert_config.inter_bk = "disable";
    data.advert_config.cache_pool_config = {};
  }

  if (Array.isArray(data.advert_list)) {
    data.advert_list.forEach(function (item) {
      item.enable = false;
      item.api_pre_enable = false;
      item.content = [];
    });
  }
}
