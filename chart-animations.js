// =============================================================
// AIDEOM-VN · Chart.js Animation Enhancer (v3)
// =============================================================
// Adds an animated glowing "comet tracer" running along every
// line chart on the page. The tracer is drawn directly on the
// chart's own canvas via a Chart.js plugin + forced redraw loop.
//
// Usage: include AFTER chart.umd.min.js
//   <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
//   <script src="chart-animations.js"></script>
// =============================================================

(function () {
  'use strict';

  if (typeof Chart === 'undefined') {
    console.warn('[AIDEOM] Chart.js not loaded - animations skipped');
    return;
  }

  // -----------------------------------------------------------
  // COMET TRACER PLUGIN
  // -----------------------------------------------------------
  var cometPlugin = {
    id: 'aideomComet',

    afterDatasetsDraw: function (chart) {
      if (chart.config.type !== 'line') return;
      if (chart._aideomReady === false) return;

      var ctx = chart.ctx;
      var now = performance.now();
      var CYCLE_MS = 3800;
      var TRAIL_LENGTH = 14;
      var SEGMENT_GAP = 0.011;

      chart.data.datasets.forEach(function (dataset, i) {
        if (!chart.isDatasetVisible(i)) return;
        var meta = chart.getDatasetMeta(i);
        if (!meta || meta.hidden) return;

        var pts = (meta.data || []).filter(function (p) {
          return p && isFinite(p.x) && isFinite(p.y);
        });
        if (pts.length < 2) return;

        var color = typeof dataset.borderColor === 'string' ? dataset.borderColor : '#a855f7';

        var offset = i * (CYCLE_MS / 6);
        var progress = ((now + offset) % CYCLE_MS) / CYCLE_MS;

        function getPos(prog) {
          if (prog < 0) prog = 0;
          if (prog > 1) prog = 1;
          var idx = prog * (pts.length - 1);
          var lo = Math.floor(idx);
          var hi = Math.min(lo + 1, pts.length - 1);
          var frac = idx - lo;
          return {
            x: pts[lo].x + (pts[hi].x - pts[lo].x) * frac,
            y: pts[lo].y + (pts[hi].y - pts[lo].y) * frac
          };
        }

        ctx.save();

        for (var k = TRAIL_LENGTH; k >= 1; k--) {
          var tp = progress - k * SEGMENT_GAP;
          if (tp < 0) continue;
          var pos = getPos(tp);
          var fade = 1 - k / TRAIL_LENGTH;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 1.5 + fade * 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = fade * fade * 0.85;
          ctx.shadowColor = color;
          ctx.shadowBlur = 4 + fade * 10;
          ctx.fill();
        }

        ctx.globalAlpha = 1;

        var head = getPos(progress);
        var grad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 26);
        grad.addColorStop(0, color);
        grad.addColorStop(0.35, hexA(color, 0.55));
        grad.addColorStop(1, hexA(color, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(head.x, head.y, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    }
  };

  Chart.register(cometPlugin);

  // -----------------------------------------------------------
  // PROGRESSIVE LINE DRAW
  // -----------------------------------------------------------
  if (Chart.overrides && Chart.overrides.line) {
    Chart.overrides.line.animations = {
      x: {
        type: 'number',
        easing: 'easeOutQuart',
        duration: 2200,
        from: NaN,
        delay: function (ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) return 0;
          ctx.xStarted = true;
          var n = (ctx.chart.data.labels && ctx.chart.data.labels.length) || 10;
          return ctx.index * (2200 / n / 1.8);
        }
      },
      y: {
        type: 'number',
        easing: 'easeOutQuart',
        duration: 2200,
        from: function (ctx) {
          return (ctx.chart.scales && ctx.chart.scales.y && ctx.chart.scales.y.getPixelForValue(0)) || ctx.chart.height;
        },
        delay: function (ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) return 0;
          ctx.yStarted = true;
          var n = (ctx.chart.data.labels && ctx.chart.data.labels.length) || 10;
          return ctx.index * (2200 / n / 1.8);
        }
      }
    };
  }

  // -----------------------------------------------------------
  // BAR BOUNCE
  // -----------------------------------------------------------
  if (Chart.overrides && Chart.overrides.bar) {
    Chart.overrides.bar.animations = Chart.overrides.bar.animations || {};
    Chart.overrides.bar.animations.y = {
      duration: 1400,
      easing: 'easeOutBounce',
      from: function (ctx) {
        return (ctx.chart.scales && ctx.chart.scales.y && ctx.chart.scales.y.getPixelForValue(0)) || 0;
      },
      delay: function (ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) return 0;
        ctx.yStarted = true;
        var di = ctx.datasetIndex || 0;
        return ctx.index * 60 + di * 25;
      }
    };
  }

  // -----------------------------------------------------------
  // FORCED REDRAW LOOP
  // -----------------------------------------------------------
  var lastFrame = 0;
  function loop(now) {
    if (now - lastFrame > 18) {
      lastFrame = now;
      var instances = Chart.instances || {};
      Object.keys(instances).forEach(function (id) {
        var chart = instances[id];
        if (!chart || !chart.canvas || !chart.ctx) return;
        if (chart.config.type !== 'line') return;
        if (chart._aideomReady === false) return;
        try {
          chart.draw();
        } catch (e) {}
      });
    }
    requestAnimationFrame(loop);
  }

  var readyPlugin = {
    id: 'aideomReady',
    afterInit: function (chart) {
      if (chart.config.type !== 'line') return;
      chart._aideomReady = false;
      setTimeout(function () {
        chart._aideomReady = true;
      }, 2400);
    }
  };
  Chart.register(readyPlugin);

  requestAnimationFrame(loop);

  // -----------------------------------------------------------
  // HELPERS
  // -----------------------------------------------------------
  function hexA(color, alpha) {
    if (typeof color !== 'string') return 'rgba(168,85,247,' + alpha + ')';
    if (color.indexOf('rgba') === 0 || color.indexOf('rgb') === 0) {
      var m = color.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
      if (!m) return color;
      return 'rgba(' + m[1] + ', ' + m[2] + ', ' + m[3] + ', ' + alpha + ')';
    }
    if (color.charAt(0) === '#') {
      var hex = color.slice(1);
      if (hex.length === 3) {
        hex = hex.split('').map(function (c) { return c + c; }).join('');
      }
      var r = parseInt(hex.slice(0, 2), 16);
      var g = parseInt(hex.slice(2, 4), 16);
      var b = parseInt(hex.slice(4, 6), 16);
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }
    return color;
  }

  console.log('[AIDEOM] Chart animations v3 ready');
})();
