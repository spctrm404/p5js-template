export function Scroll() {
  let sectionCanvas = document.getElementById('section-canvas');
  let sectionControl = document.getElementById('section-control');
  let btnScroll = document.getElementById('button-scroll');

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
    sectionCanvas.scrollIntoView({ behavior: 'smooth' });
    gate = false;
    setTimeout(() => {
      gate = true;
    }, timeoutDuration);
  }

  function scrollToBottom(timeoutDuration = 1000) {
    sectionControl.scrollIntoView({ behavior: 'smooth' });
    gate = false;
    setTimeout(() => {
      gate = true;
    }, timeoutDuration);
  }

  function b() {
    btnScroll.addEventListener('click', () => {
      const towardDown = btnScroll.dataset.toward === 'down';
      if (towardDown) {
        scrollToBottom();
      } else {
        scrollToTop();
      }
    });
  }

  function a() {
    const intersectionObserverA = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!prevIntersectionStateA && gate) scrollToTop();
          gateInitCnt++;
          if (gateInitCnt === 2) gate = true;
        } else {
          if (prevIntersectionStateB) btnScroll.dataset.scroll = 'up';
        }
        prevIntersectionStateA = entry.isIntersecting;
      },
      { threshold: [0, 1], rootMargin: '-2px 0px 0px 0px' }
    );
    intersectionObserverA.observe(sectionCanvas);

    const intersectionObserverB = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (prevIntersectionStateA) {
            if (gate) scrollToBottom();
            btnScroll.dataset.scroll = 'down';
          }
          gateInitCnt++;
          if (gateInitCnt === 2) gate = true;
        }
        prevIntersectionStateB = entry.isIntersecting;
      },
      { threshold: [0, 1], rootMargin: '0px 0px -2px 0px' }
    );
    intersectionObserverB.observe(sectionCanvas);
  }
}
