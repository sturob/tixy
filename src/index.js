const count = 16;
const size = 16;
const spacing = 1;
const width = count * (size + spacing);

const runner = document.getElementById("code-runner").contentWindow;
const input = document.getElementById("input");
const output = document.getElementById("output");
const context = output.getContext("2d");

output.width = output.height = width;

const cells = [];
let index = 0;

for (let y = 0; y < count; y++) {
  for (let x = 0; x < count; x++) {
    index++;

    cells.push({
      index,
      x,
      y,
    });
  }
}

let callback;
let startTime;

function updateCallback() {
  const code = input.value;
  startTime = new Date();

  try {
    callback = runner.eval(`
      (function f(t,i,x,y) {
        try {
          return ${code.replace(/\\/g, ';')};
        } catch (error) {
          return error;
        }
      })
    `);
  } catch (error) {
    callback = null;
  }
}

updateCallback();
input.addEventListener("input", updateCallback);



function render() {
  const time = (new Date() - startTime) / 1000;

  if (!callback) {
    window.requestAnimationFrame(render);
    return;
  }

  output.width = output.height = width;
  let index = 0;
  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      index++;

      let value = callback(time, index, x, y);
      if (value < 0) {
        value = 0;
      }

      if (value > 1) {
        value = 1;
      }
      const offset = size / 2;
      const radius = (value * size) / 2;


      context.beginPath();
      context.fillStyle =  "#FFF";
      context.arc(
        x * (size + spacing) + offset,
        y * (size + spacing) + offset,
        radius,
        0,
        2 * Math.PI
      );
      context.fill();
    }
  }

  window.requestAnimationFrame(render);
}

render();
