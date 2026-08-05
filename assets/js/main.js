(function () {
  "use strict";

  var script = document.currentScript;
  var configPath = script && script.dataset.colors;

  if (!configPath) return;

  fetch(configPath)
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (config) {
      var colors = Array.isArray(config.colors) ? config.colors : [];
      var validColors = colors.filter(function (color) {
        return typeof color === "string" && CSS.supports("color", color);
      });

      if (validColors.length >= 2) {
        document.documentElement.style.setProperty(
          "--gradient-colors",
          validColors.join(", ")
        );
      }

      if (
        typeof config.speed === "string" &&
        /^\d+(\.\d+)?(ms|s)$/.test(config.speed)
      ) {
        document.documentElement.style.setProperty("--gradient-speed", config.speed);
      }
    })
    .catch(function (error) {
      console.warn("无法加载渐变配置，已使用默认配色。", error);
    });
})();
