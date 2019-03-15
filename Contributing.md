# A simple Canvas
```javascript
var canvas = document.getElementById('myCanvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width,
    height = canvas.height,
    plot = function plot(fn, range) {
        var widthScale = width / (range.X[1] - range.X[0]),
            heightScale = height / (range.Y[1] - range.Y[0]),
            first = true,
            xFnVal, // X in function space.
            ySSVal; // Y in screen space.
        
        ctx.beginPath();        
        for (var x = 0; x < width + 2; x += 2) {
            xFnVal = (x / widthScale) - range.X[0];
            ySSVal = height - (fn(xFnVal) - range.Y[0]) * heightScale; 
            
            if (first) {
                ctx.moveTo(x, ySSVal);
                first = false;
            }
            else {
                ctx.lineTo(x, ySSVal);
            }
        }        
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke(); 
    };
plot(
    function (x) { return Math.sin(x) + Math.sin(x * 8) / 4; },
    { X: [0, Math.PI * 4], Y: [-2, 2] }
);
```
*It's output is a wavy pattern*
