const template_main = document.getElementById('main');
const template_sectionCanvas = document.getElementById('section-canvas');
const template_sectionControl = document.getElementById('section-control');
const template_sectionInformation = document.getElementById(
  'section-information'
);

const template_btnScroll = document.getElementById('button-scroll');

let gate = false;
let gateInitCnt = 0;
let prevIntersectionStateA = false;
let prevIntersectionStateB = false;

function disableScroll(elem) {
  elem.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );
  elem.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );
}
function scrollToTop(timeoutDuration = 1000) {
  template_sectionCanvas.scrollIntoView({ behavior: 'smooth' });
  gate = false;
  setTimeout(() => {
    gate = true;
  }, timeoutDuration);
}
function scrollToBottom(timeoutDuration = 1000) {
  template_sectionControl.scrollIntoView({ behavior: 'smooth' });
  gate = false;
  setTimeout(() => {
    gate = true;
  }, timeoutDuration);
}

disableScroll(template_sectionCanvas);
disableScroll(template_sectionControl);

const intersectionObserverA = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      if (!prevIntersectionStateA && gate) scrollToTop();
      gateInitCnt++;
      if (gateInitCnt === 2) gate = true;
    } else {
      if (prevIntersectionStateB) template_btnScroll.dataset.scroll = 'up';
    }
    prevIntersectionStateA = entry.isIntersecting;
  },
  { threshold: [0, 1], rootMargin: '-2px 0px 0px 0px' }
);
intersectionObserverA.observe(template_sectionCanvas);

const intersectionObserverB = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      if (prevIntersectionStateA) {
        if (gate) scrollToBottom();
        template_btnScroll.dataset.scroll = 'down';
      }
      gateInitCnt++;
      if (gateInitCnt === 2) gate = true;
    }
    prevIntersectionStateB = entry.isIntersecting;
  },
  { threshold: [0, 1], rootMargin: '0px 0px -2px 0px' }
);
intersectionObserverB.observe(template_sectionCanvas);

template_btnScroll.addEventListener('click', () => {
  const towardDown = template_btnScroll.dataset.scroll === 'down';
  if (towardDown) {
    scrollToBottom();
  } else {
    scrollToTop();
  }
});

// let canvasInPrevState = 'in';
// const canvasInObserver = new IntersectionObserver(
//   ([entry]) => {
//     if (entry.isIntersecting) {
//       // console.log('Intersecting:', entry.target.id, entry.intersectionRatio);
//       if (canvasInPrevState === 'out') {
//         setTimeout(() => {
//           sectionCanvas.scrollIntoView({ behavior: 'auto' });
//           sectionControl.dataset.atBottom = 'true';
//         }, 100);
//       }
//       canvasInPrevState = 'in';
//     } else {
//       // console.log('NotIntersecting:', entry.target.id, entry.intersectionRatio);
//       canvasInPrevState = 'out';
//     }
//   },
//   {
//     threshold: [0, 1],
//     rootMargin: '-4px 0px 0px 0px',
//   }
// );
// canvasInObserver.observe(sectionCanvas);

// let canvasOutPrevState = 'in';
// const canvasOutObserver = new IntersectionObserver(
//   ([entry]) => {
//     if (entry.isIntersecting) {
//       if (entry.intersectionRatio === 1) {
//         canvasOutPrevState = 'in';
//       } else {
//         if (canvasOutPrevState === 'in') {
//           setTimeout(() => {
//             sectionControl.scrollIntoView({ behavior: 'auto' });
//             sectionControl.dataset.atBottom = 'false';
//           }, 100);
//         }
//         canvasOutPrevState = 'out';
//       }
//     }
//   },
//   {
//     threshold: [0, 1],
//     rootMargin: '0px 0px 0px 0px',
//   }
// );
// canvasOutObserver.observe(sectionCanvas);

/**
 * 지정된 맞춤 방식에 따라 캔버스를 컨테이너에 최적으로 맞추기 위한 크기를 반환.
 *
 * @param {{ width: number, height: number }} canvasSize - 캔버스의 원래 크기.
 * @param {{ width: number, height: number }} containerSize - 캔버스를 맞출 컨테이너의 크기.
 * @param {'contain' | 'fill' | 'cover' | 'none' | 'scale-down'} [canvasFit='contain'] - 캔버스가 컨테이너에 맞춰지는 방식:
 * - 'contain': 캔버스의 비율을 유지하면서 컨테이너 안에 완전히 들어가도록 크기를 조정.
 * - 'fill': 캔버스의 비율을 무시하고 컨테이너의 크기에 맞춤.
 * - 'cover': 캔버스의 비율을 유지하면서 컨테이너를 완전히 덮도록 크기를 조정.
 * - 'none': 크기 조정을 하지 않음.
 * - 'scale-down': 캔버스가 컨테이너보다 클 때만 'contain'과 같은 방식으로 크기를 줄임.
 * @returns {{ width: number, height: number }} 계산된 캔버스의 너비와 높이.
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
    case 'fill':
      size.width = containerWidth;
      size.height = containerHeight;
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
      size.width = canvasWidth;
      size.height = canvasHeight;
      break;
    case 'scale-down':
      if (containerWidth < canvasWidth || containerHeight < canvasHeight) {
        if (containerAspectRatio > canvasAspectRatio) {
          size.height = containerHeight;
          size.width = Math.floor(size.height * canvasAspectRatio);
        } else {
          size.width = containerWidth;
          size.height = Math.floor(size.width / canvasAspectRatio);
        }
      } else {
        size.width = canvasWidth;
        size.height = canvasHeight;
      }
      break;
  }
  return size;
}

/**
 * 지정한 컨테이너 요소 내에 지정된 맞춤 방식에 따라 조정되는 반응형 p5.js 캔버스를 생성.
 *
 * @param {number} width - 캔버스의 기준 너비(픽셀, 양의 정수).
 * @param {number} height - 캔버스의 기준 높이(픽셀, 양의 정수).
 * @param {string} containerId - 캔버스를 넣을 컨테이너 요소의 id 문자열.
 * @param {'contain' | 'fill' | 'cover' | 'none' | 'scale-down'} [canvasFit='none'] - 캔버스가 컨테이너에 맞춰지는 방식:
 * - 'contain': 캔버스의 비율을 유지하면서 컨테이너 안에 완전히 들어가도록 크기를 조정.
 * - 'fill': 캔버스의 비율을 무시하고 컨테이너의 크기에 맞춤(staticCoordinate가 true일 경우 이미지가 왜곡됨).
 * - 'cover': 캔버스의 비율을 유지하면서 컨테이너를 완전히 덮도록 크기를 조정.
 * - 'none': 크기 조정을 하지 않음.
 * - 'scale-down': 캔버스가 컨테이너보다 클 때만 'contain'과 같은 방식으로 크기를 줄임.
 * @param {boolean} [staticCoordinate=true] - true면 캔버스 좌표계가 확장, 수축되지 않고, 렌더링된 이미지 크기가 확대, 축소됨(확대시 이미지 열화), false면 캔버스 좌표계가 확장, 수축(좌표계 변경에 대응되는 코딩 요구).
 * @returns {p5.Renderer | undefined} 생성된 p5.Renderer 객체 또는 오류 시 undefined 반환.
 */
function createResponsiveCanvas(
  width,
  height,
  containerId,
  canvasFit = 'none',
  staticCoordinate = true
) {
  const functionName = 'createResponsiveCanvas';
  let container;
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    console.error(
      `@${functionName}(): 1, 2번째 매개변수 width, height는 양의 정수여야합니다.`
    );
    return;
  }
  if (typeof containerId !== 'string') {
    console.error(
      `@${functionName}(): 3번째 매개변수 containerId는 캔버스의 부모 요소를 지목하는 id여야합니다.`
    );
    return;
  } else {
    container = document.getElementById(containerId);
    if (!container) {
      console.error(
        `@${functionName}(): "${containerId}"와 일치하는 HTML 요소가 없습니다. 3번째 매개변수 containerId를 확인하세요.`
      );
      return;
    }
  }
  if (!['contain', 'fill', 'cover', 'none', 'scale-down'].includes(canvasFit)) {
    console.error(
      `@${functionName}(): 4번째 매개변수 canvasFit은 "contain", "cover", "none", "scale-down" 중 하나여야 합니다.`
    );
    return;
  }
  if (typeof staticCoordinate !== 'boolean') {
    console.error(
      `@${functionName}(): 5번째 매개변수 staticCoordinate는 true 또는 false여야 합니다.`
    );
    return;
  }

  const { width: fitWidth, height: fitHeight } = getFitSize(
    { width, height },
    container.getBoundingClientRect(),
    canvasFit
  );
  const finalSize = {
    width: staticCoordinate ? width : fitWidth,
    height: staticCoordinate ? height : fitHeight,
  };
  const renderer = createCanvas(finalSize.width, finalSize.height);
  const canvas = renderer.elt;
  renderer.parent(container);

  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
  container.style.overflow = 'clip';
  canvas.style.width = `${fitWidth}px`;
  canvas.style.height = `${fitHeight}px`;

  if (canvasFit === 'none') return renderer;

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (entry.target === container) {
      const { width: canvasWidth, height: canvasHeight } = getFitSize(
        { width, height },
        entry.target.getBoundingClientRect(),
        canvasFit
      );
      if (!staticCoordinate) resizeCanvas(canvasWidth, canvasHeight);
      renderer.elt.style.width = `${canvasWidth}px`;
      renderer.elt.style.height = `${canvasHeight}px`;
    }
  });
  resizeObserver.observe(container);

  console.log(
    `@${functionName}(): 캔버스가 생성되었습니다.
- 캔버스 크기: ${finalSize.width}x${finalSize.height}px
- 컨테이너: ${containerId}
- 캔버스 맞춤 방식: ${canvasFit}
- 고정 좌표계: ${staticCoordinate}`
  );

  return renderer;
}

/**
 * 주어진 값이 색상으로 간주될 수 있는지 확인.
 *
 * 숫자, 문자열, 숫자 배열을 유효한 색상 표현으로 허용.
 *
 * @param {*} value - 확인할 값.
 * @returns {boolean} 값이 숫자, 문자열, 또는 숫자 배열이면 true, 그렇지 않으면 false.
 */
function isColor(value) {
  return (
    typeof value === 'number' ||
    typeof value === 'string' ||
    (Array.isArray(value) &&
      value.length > 0 &&
      value.every((e) => typeof e === 'number'))
  );
}

/**
 * 캔버스에 기준선, 중앙선, 경계선을 포함한 참조 그리드를 그립니다.
 *
 * @param {(number|string|Array)} [boundaryColour='#000000'] - 경계선의 색상. 숫자, 색상 문자열, 숫자 배열을 허용.
 * @param {(number|string|Array)} [gridColour='#888888'] - 격자선의 색상. 숫자, 색상 문자열, 숫자 배열을 허용.
 * @param {(number|string|Array)} [centerColour='red'] - 중심선의 색상. 숫자, 색상 문자열, 숫자 배열을 허용.
 * @param {number} [gridSize=20] - 그리드 간격(픽셀).
 */
function drawReferenceGrid(
  boundaryColour = '#000000',
  gridColour = '#888888',
  centerColour = 'red',
  gridSize = 20
) {
  const functionName = 'drawReferenceGrid';
  if (
    !isColor(boundaryColour) ||
    !isColor(gridColour) ||
    !isColor(centerColour)
  ) {
    console.error(
      `@${functionName}(): 모든 매개변수는 색상을 나타내는 숫자, 숫자 배열 혹은 문자열이어야 합니다. 예: 51, [255, 204, 0, 127], '#A251FA', 'red', 'rgba(100%, 0%, 100%, 0.5)'`
    );
    return;
  }
  noFill();
  stroke(gridColour);
  strokeWeight(1);
  for (let x = gridSize; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = gridSize; y < height; y += gridSize) {
    line(0, y, width, y);
  }
  stroke(centerColour);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);
  stroke(boundaryColour);
  strokeWeight(gridSize);
  rect(0, 0, width, height);
}
