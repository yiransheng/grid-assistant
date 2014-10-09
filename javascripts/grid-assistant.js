/**
    ## Contribution

    If you do have a contribution for the package feel free to put up a Pull Request or open an Issue.

    ## License (MIT)

    The MIT License (MIT)

    Copyright (c) 2014 Giulio Canti

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
**/
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory());
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.gridAssistant = factory();
  }
})(this, function() {
  CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
      if (dashLen == undefined) dashLen = 2;
      this.moveTo(x1, y1);

      var dX = x2 - x1;
      var dY = y2 - y1;
      var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
      var dashX = dX / dashes;
      var dashY = dY / dashes;

      var q = 0;
      while (q++ < dashes) {
          x1 += dashX;
          y1 += dashY;
          this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
      }
      this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
  };

  return function overlayGrid(el, ncol, gutter) {
    ncol = ncol || 16;  // 16 columns
    gutter = gutter || 16; // 16px gutter
    
    if (el._gridMetaData && 
       (el._gridMetaData.ncol === ncol || el._gridMetaData.gutter === gutter)) {
      return;
    } else {
      el._gridMetaData = {
        ncol : ncol, 
        gutter : gutter
      } 
    }

    var bb = el.getBoundingClientRect();
    var c = createCanvas(bb.width, bb.height);
    drawVerticalGrid(c, ncol, gutter);
    var img = c.toDataURL();
    el.style.background = 'url(' + img + ') 0 0 no-repeat';
    document.body.removeChild(c);
    window.addEventListener('resize', function() {
      el._gridMetaData = null;
      overlayGrid(el, ncol, gutter);
    });    
  };

  // funcs
  function createCanvas(width, height) {
    var c = document.createElement('CANVAS');
    c.width = width;
    c.height = height;
    c.style.position = 'fixed';
    c.style.left = '-9999px';
    c.style.top = '-9999px';
    document.body.appendChild(c);
    return c;
  }
  function drawVerticalGrid(canvas, ncol, gutter) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var w = (W-gutter*ncol)/ncol;
    canvas.width = W;
    ctx.fillStyle= '#ffff66';
    ctx.lineWidth = '1';
    ctx.strokeStyle = '#888888';
    ctx.font="20px Georgia";
    var x1,x2,x;
    for(var i=0; i<=ncol; i++) {
      x1 = i*(w+gutter)-gutter/2;
      x2 = i*(w+gutter)+gutter/2;
      x = (x1+x2)/2;
      line(x1);
      line(x2);
      dashed(x);
      box(x1,x2);
    }
    function line(x) {
      if(x>0 && x<W) {
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,H);
        ctx.stroke();
      }
    }
    function dashed(x) {
      if(x>0 && x<W) {
        ctx.beginPath();
        ctx.dashedLine(x,0,x,H, 3);
        ctx.stroke();
      }
    }
    function box(x1,x2) {
      x1 = Math.max(1,x1);
      x2 = Math.min(W-1,x2);
      ctx.fillStyle = 'rgba(255,255,96,.3)';
      ctx.fillRect(x1,0,x2-x1,H);
      if(i>0) {
        ctx.fillStyle="#222222";
        ctx.fillText(i, x1-w/2, Math.min(H/3, 60));
      }
    }
  }

});

