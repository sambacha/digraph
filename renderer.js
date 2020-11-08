// Load in our dependencies
const assert = require('assert');
const fs = require('fs');

// Define our constants
const SQUARE_SIZE = 3; // px
const CONTENT_FILEPATH = __dirname + '/README.md';

// Define and run our main function
function main(contentBuff) {
  // Based on https://plot.ly/javascript/heatmaps/#basic-heatmap
  // Define our data (256x256 (0-255 x 0-255) map that counts number of each occurrence)
  // This is a digraph so [0xDE, 0xAD, 0xBE, 0xEF] breaks into coordinates [DE, AD], [AD, BE], [BE, EF]
  let digraphArr = new Uint32Array(0x100 * 0x100);
  if (contentBuff.length >= 2) {
    let lastVal = -1;
    let currentVal = contentBuff[0];
    for (let i = 1; i < contentBuff.length; i += 1) {
      // Look up our new value
      lastVal = currentVal;
      currentVal = contentBuff[i];

      // Generate our row/column index in our flat array
      // [00, 01] -> row 00, col 01 -> 0x00 + 0x01 -> 0x01
      // [01, 00] -> row 01, col 00 -> 0x100 + 0x00 -> 0x100 (256)
      let index = (lastVal * 0x100) + currentVal;

      // Increment our value
      digraphArr[index] += 1;
    }
  }

  // Size out our canvas
  let canvasEl = document.getElementById('canvas');
  assert(canvasEl);
  canvasEl.width = 0x100 * SQUARE_SIZE;
  canvasEl.height = 0x100 * SQUARE_SIZE;
  let context = canvasEl.getContext('2d');

  // Backfill our canvas as white
  context.fillStyle = '#FFF';
  context.fillRect(0, 0, 0x100 * SQUARE_SIZE, 0x100 * SQUARE_SIZE);

  // Render our graph
  // DEV: We use a `maxValue` of at least 1 so we don't divide by 0 while filling
  let maxValue = Math.max(1, Math.max.apply(Math, digraphArr));
  for (let i = 0; i < 0x100; i += 1) {
    for (let j = 0; j < 0x100; j += 1) {
      let index = i * 0x100 + j;
      let value = digraphArr[index];
      if (value > 0) {
        // Update our darkness for our pixel and draw it
        context.fillStyle = `rgba(0, 0, 0, ${value / maxValue})`;
        context.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
      }
    }
  }
}
main(fs.readFileSync(CONTENT_FILEPATH));
