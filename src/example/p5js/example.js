const tileSize = 20;
let tileCol, tileRow;
let tileXZero, tileYZero;

/**
 * 지정된 맞춤 모드에 따라 캔버스를 컨테이너에 최적으로 맞추기 위한 크기를 계산합니다.
 *
 * @param {{ width: number, height: number }} canvasSize - 캔버스의 원래 크기입니다.
 * @param {{ width: number, height: number }} containerSize - 캔버스를 맞출 컨테이너의 크기입니다.
 * @param {'contain' | 'cover' | 'none' | 'scale-down'} [canvasFit='contain'] - 사용할 맞춤 모드입니다:
 *   - 'contain': 캔버스의 비율을 유지하면서 컨테이너 안에 완전히 들어가도록 크기를 조정합니다.
 *   - 'cover': 캔버스의 비율을 유지하면서 컨테이너를 완전히 덮도록 크기를 조정합니다.
 *   - 'none': 크기 조정을 하지 않습니다.
 *   - 'scale-down': 캔버스가 컨테이너보다 클 때만 크기를 줄입니다.
 * @returns {{ width: number, height: number }} 계산된 캔버스의 너비와 높이입니다.
 */
function getFitSize(canvasSize, containerSize, canvasFit = 'contain') {
  const { width: canvasWidth, height: canvasHeight } = canvasSize;
  const { width: containerWidth, height: containerHeight } = containerSize;
  const canvasAspectRatio = canvasWidth / canvasHeight;
  const containerAspectRatio = containerWidth / containerHeight;
  const size = { width: 0, height: 0 };
  switch (canvasFit) {
    case 'contain':
      if (containerAspectRatio > canvasAspectRatio) {
        size.height = containerHeight;
        size.width = Math.floor(size.height * canvasAspectRatio);
      } else {
        size.width = containerWidth;
        size.height = Math.floor(size.width / canvasAspectRatio);
      }
      break;
    case 'cover':
      if (containerAspectRatio > canvasAspectRatio) {
        size.width = containerWidth;
        size.height = Math.ceil(size.width / canvasAspectRatio);
      } else {
        size.height = containerHeight;
        size.width = Math.ceil(size.height * canvasAspectRatio);
      }
      break;
    case 'none':
      break;
    case 'scale-down':
      break;
  }
  return size;
}

function createResponsiveCanvas(
  width,
  height,
  containerSelector,
  canvasFit = 'none',
  fixedCoordinate = true
) {
  const functionName = 'createResponsiveCanvas';
  let container;
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    console.error(
      `${functionName}()의 1, 2번째 매개변수 width, height는 양의 정수여야합니다.`
    );
    return;
  }
  if (typeof containerSelector !== 'string') {
    console.error(
      `${functionName}()의 3번째 매개변수 containerSelector는 캔버스의 부모 요소를 지목하는 CSS 선택자여야합니다.`
    );
    return;
  } else {
    container = document.body.querySelector(containerSelector);
    if (!container) {
      console.error(
        `"${containerSelector}"와 일치하는 HTML 요소가 없습니다. ${functionName}()의 3번째 매개변수 containerSelector를 확인하세요.`
      );
      return;
    }
  }
  if (!['contain', 'cover', 'none', 'scale-down'].includes(canvasFit)) {
    console.error(
      `${functionName}()의 4번째 매개변수 canvasFit은 "contain", "cover", "none", "scale-down" 중 하나여야 합니다.`
    );
    return;
  }
  if (typeof fixedCoordinate !== 'boolean') {
    console.error(
      `${functionName}()의 5번째 매개변수 fixedCoordinate은 true 또는 false여야 합니다.`
    );
    return;
  }

  const { width: fitWidth, height: fitHeight } = getFitSize(
    { width, height },
    container.getBoundingClientRect(),
    canvasFit
  );

  const renderer = createCanvas(
    fixedCoordinate ? width : fitWidth,
    fixedCoordinate ? height : fitHeight
  );
  const canvas = renderer.elt;
  renderer.parent(container);

  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.overflow = 'clip';
  canvas.style.width = `${fitWidth}px`;
  canvas.style.height = `${fitHeight}px`;

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === container) {
        const { width: canvasWidth, height: canvasHeight } = getFitSize(
          { width, height },
          container.getBoundingClientRect(),
          canvasFit
        );
        if (!fixedCoordinate) resizeCanvas(canvasWidth, canvasHeight);
        renderer.elt.style.width = `${canvasWidth}px`;
        renderer.elt.style.height = `${canvasHeight}px`;
      }
    }
  });
  resizeObserver.observe(container);

  // console.log(`@${functionName}(): 캔버스가 ${}`);
}

function setup() {
  createResponsiveCanvas(800, 600, '#canvas-container', 'contain');
  tileCol = ceil(width / tileSize);
  tileRow = ceil(height / tileSize);
  let totalWidth = tileCol * tileSize;
  let totalHeight = tileRow * tileSize;
  tileXZero = (width - totalWidth) * 0.5;
  tileYZero = (height - totalHeight) * 0.5;
}

function draw() {
  background('blue');
  for (let row = 0; row < tileRow; row++) {
    const y = tileYZero + tileSize * row;
    for (let col = 0; col < tileCol; col++) {
      if ((col + row) % 2 === 1) fill('black');
      else fill('red');
      const x = tileXZero + tileSize * col;
      rect(x, y, tileSize, tileSize);
    }
  }
  fill('white');
  circle(width / 2, height / 2, 100);
  circle(mouseX, mouseY, 100);
}

function windowResized() {
  tileCol = ceil(width / tileSize);
  tileRow = ceil(height / tileSize);
  let totalWidth = tileCol * tileSize;
  let totalHeight = tileRow * tileSize;
  tileXZero = (width - totalWidth) * 0.5;
  tileYZero = (height - totalHeight) * 0.5;
}
