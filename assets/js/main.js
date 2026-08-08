(function () {
  "use strict";

  var script = document.currentScript;
  var configPath = script && script.dataset.colors;

  function loadGradientConfig() {
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
          document.documentElement.style.setProperty("--gradient-colors", validColors.join(", "));
        }

        if (typeof config.speed === "string" && /^\d+(\.\d+)?(ms|s)$/.test(config.speed)) {
          document.documentElement.style.setProperty("--gradient-speed", config.speed);
        }
      })
      .catch(function (error) {
        console.warn("无法加载渐变配置，已使用默认配色。", error);
      });
  }

  function createStarfield() {
    var canvas = document.getElementById("starfield");
    if (!canvas || !canvas.getContext) return;

    var context = canvas.getContext("2d");
    var darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var stars = [];
    var width = 0;
    var height = 0;
    var frame = 0;
    var resizeTimer = 0;

    function makeStar() {
      var bright = Math.random() > 0.91;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: bright ? 1.15 + Math.random() * 1.25 : 0.35 + Math.random() * 1.05,
        alpha: bright ? 0.62 + Math.random() * 0.3 : 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.00045 + Math.random() * 0.00125,
        cool: Math.random() > 0.7,
        bright: bright
      };
    }

    function resize() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      var count = Math.max(55, Math.min(230, Math.round((width * height) / 10500)));
      stars = [];
      for (var i = 0; i < count; i += 1) stars.push(makeStar());
      draw(performance.now());
    }

    function starColor(star, alpha) {
      if (darkMode.matches) {
        return star.cool
          ? "rgba(157, 196, 255, " + alpha + ")"
          : "rgba(244, 248, 255, " + alpha + ")";
      }
      return star.cool
        ? "rgba(20, 73, 132, " + alpha * 0.72 + ")"
        : "rgba(255, 255, 255, " + alpha * 0.86 + ")";
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      for (var i = 0; i < stars.length; i += 1) {
        var star = stars[i];
        var pulse = reducedMotion.matches ? 1 : 0.58 + Math.sin(time * star.speed + star.phase) * 0.42;
        var alpha = Math.max(0.08, star.alpha * pulse);

        context.beginPath();
        context.fillStyle = starColor(star, alpha);
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();

        if (star.bright && alpha > 0.52) {
          context.beginPath();
          context.strokeStyle = starColor(star, alpha * 0.34);
          context.lineWidth = 0.55;
          context.moveTo(star.x - star.radius * 3.2, star.y);
          context.lineTo(star.x + star.radius * 3.2, star.y);
          context.moveTo(star.x, star.y - star.radius * 3.2);
          context.lineTo(star.x, star.y + star.radius * 3.2);
          context.stroke();
        }
      }
    }

    function animate(time) {
      draw(time);
      frame = reducedMotion.matches || document.hidden ? 0 : window.requestAnimationFrame(animate);
    }

    function restartAnimation() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      draw(performance.now());
      if (!reducedMotion.matches && !document.hidden) frame = window.requestAnimationFrame(animate);
    }

    function handleResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resize();
        restartAnimation();
      }, 120);
    }

    function listen(media, handler) {
      if (media.addEventListener) media.addEventListener("change", handler);
      else if (media.addListener) media.addListener(handler);
    }

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", restartAnimation);
    listen(darkMode, function () { draw(performance.now()); });
    listen(reducedMotion, restartAnimation);
    resize();
    restartAnimation();
  }

  loadGradientConfig();
  createStarfield();
})();
