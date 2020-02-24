<template>
  <div>
    <h2>Paper</h2>
    <canvas id="myCanvas" resize></canvas>
    <!-- Define inlined PaperScript associate it with myCanvas -->
    <script type="text/paperscript" canvas="myCanvas">
      var text = 'EGSTAD is a designer and developer'
      var textSize = window.innerWidth/12;
      // number of points
      var points = 100;
      // distance between the points:
      var length = textSize/4;
      // text style
      var style = {
        fontSize: textSize,
        fontFamily: 'Helvetica',
        fontWeight: '500',
        fillColor: '#ff0000'
      }

      // create a PointText object for a string and a style
      var createPointText = function(str) {
          var text = new PointText();
          text.content = str;
          if (style) {
              if (style.font) text.font = style.font;
              if (style.fontFamily) text.fontFamily = style.fontFamily;
              if (style.fontSize) text.fontSize = textSize;
              if (style.fontWeight) text.fontWeight = style.fontWeight;
              if (style.fillColor) text.fillColor = style.fillColor;
          }
          return text;
      }
      var createAlignedText = function(path) {
        // create PointText object for each glyph
        var glyphTexts = [];
        for (var i = 0; i < text.length; i++) {
          glyphTexts[i] = createPointText(text.substring(i, i+1), style);
          glyphTexts[i].justification = "center";
        }

        // find center xOffset for each glyph
        var xOffsets = [0];
        var leading = textSize/18;
        for (var i = 1; i < text.length; i++) {
          var pairText = createPointText(text.substring(i - 1, i + 1), style);
          pairText.remove();
          xOffsets[i] = xOffsets[i - 1] + pairText.bounds.width -
          glyphTexts[i - 1].bounds.width / 2 - glyphTexts[i].bounds.width / 2 - leading;
        }

        // set point for each glyph and rotate glyph aorund the point
        for (var i = 0; i < text.length; i++) {
          var centerOffs = xOffsets[i];
          if (path.length < centerOffs) {
            if (path.closed) {
              centerOffs = centerOffs % path.length;
            } else {
              centerOffs = undefined;
            }
          }
          if (centerOffs === undefined) {
            glyphTexts[i].remove();
          } else {
            var pathPoint = path.getPointAt(centerOffs);
            glyphTexts[i].point = pathPoint;
            var tan = path.getTangentAt(centerOffs);
            glyphTexts[i].rotate(tan.angle, pathPoint);
          }
        }
      }




      // create and activate a new layer
      var layer = new Layer();
      var path = new Path();
      var start = view.center / [100, 1];
      function drawPath() {
        // plot out points
        for (var i = 0; i < points; i++) {
          path.add(start + new Point(i * length, 0));
        }
      }
      function onMouseMove(event) {
        // delete old paths
        project.activeLayer.removeChildren()

        // start path at cursor
        path.firstSegment.point = event.point;
      	for (var i = 0; i < points - 1; i++) {
      		var segment = path.segments[i];
      		var nextSegment = segment.next;
      		var vector = segment.point - nextSegment.point;
      		vector.length = length;
      		nextSegment.point = segment.point - vector;
      	}
        path.smooth({ type: 'continuous' });
        createAlignedText(path);
      }
      function onResize(event) {
        textSize = window.innerWidth/12;
        length = textSize/4;
        project.activeLayer.removeChildren()
        createAlignedText(path);
      }

      drawPath();
      createAlignedText(path);
    </script>
  </div>
</template>

<script>
/* eslint-disable */
import paper from 'paper'
export default {
  data() {
    return {
      script: null,
    }
  },
  created() {
    this.$app.$store.commit('setTheme', {
      background: '#ffffff',
      foreground: '#ff0000',
      accent: '#0000ff',
    })
  },
  mounted() {
    paper.install(window);
    console.log(window)
  },
}
/* eslint-enable */
</script>

<style lang="scss" scoped>
canvas {
  width: 100vw;
  height: 100vh;
}
</style>
