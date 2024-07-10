
const width = 500;
const height = 500;

setDocDimensions(width, height);

const rr = bt.randInRange;

function createCircle(center, radius, points = 20) {
  const circle = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    circle.push([
      center[0] + radius * Math.cos(angle),
      center[1] + radius * Math.sin(angle),
    ]);
  }
  return [bt.catmullRom(circle, points)];
}

const sunRadius = rr(0.1, 0.15) * width;
const sun = createCircle([width * 0.8, height * 0.2], sunRadius);

const mountain1 = bt.resample([[
  [0, height * 0.8],
  [width * 0.25, height * 0.4],
  [width * 0.5, height * 0.8]
]], 10);

const mountain2 = bt.resample([[
  [width * 0.3, [height * 0.8]],
  [width * 0.6, height * 0.5],
  [width * 0.9, height * 0.8]
]], 10);

const path = bt.resample

const ground = bt.resample([[
  [0, height],
  [width, height],
  [width, height * 0.8],
  [0, height * 0.8]
]], 10);

const scenery = [sun, mountain1, mountain2, ground];

const flattenedScenery = scenery.flat();

bt.iteratePoints(flattenedScenery, ([x, y]) => [x, height - y]);

function shadeMountain(mountain, lightDirection) {
  const shadedMountain = [];
  for (let i = 0; i < mountain.length - 1; i++) {
    const [x1, y1] = mountain[i];
    const [x2, y2] = mountain[i + 1];
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const shade = Math.max(0, Math.cos(angle - lightDirection));
    shadedMountain.push([x1, y1, shade]);
    shadedMountain.push([x2, y2, shade]);
  }
  return shadedMountain;
}

const lightDirection = Math.PI / 4; 
const shadedMountain1 = shadeMountain(mountain1, lightDirection);
const shadedMountain2 = shadeMountain(mountain2, lightDirection);

function drawShadedLines(lines) {
  for (const line of lines) {
    const [x1, y1, shade1] = line[0];
    const [x2, y2, shade2] = line[1];
    const gradient = bt.createLinearGradient(x1, y1, x2, y2, [
      { offset: 0, color: `rgba(0, 0, 0, ${shade1})` },
      { offset: 1, color: `rgba(0, 0, 0, ${shade2})` }
    ]);
    bt.stroke(gradient);
    bt.line(x1, y1, x2, y2);
  }
}

drawLines(flattenedScenery);

drawShadedLines(shadedMountain1);
drawShadedLines(shadedMountain2);
