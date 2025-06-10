export function References() {
  let references = [
    {
      title: 'What was Coding like 40 years ago?',
      authors: ['Daniel Shiffman'],
      year: '2022',
      publisher: 'The Coding Train - YouTube',
      url: 'https://www.youtube.com/watch?v=7r83N3c2kPw',
    },
    {
      title: '250425a',
      authors: ['Okazz'],
      year: '2025',
      publisher: 'OpenProcessing',
      url: 'https://openprocessing.org/sketch/2625827',
    },
    {
      title:
        'Nature of Code 자연계 법칙을 디지털 세계로 옮기는 컴퓨터 프로그래밍 전략',
      authors: ['다니엘 쉬프만'],
      translator: ['윤인성'],
      year: '2015',
      publisher: '한빛미디어',
    },
  ];

  function setReferences(_references) {
    const functionName = 'setReferences';
    if (!Array.isArray(_references)) {
      console.error(
        `@${functionName}(): 매개변수 _references는 배열이어야 합니다.`
      );
      return;
    }
    references = _references;
  }

  function setHtmlBody(olSelector = '.information__reference ol') {
    const ol = document.querySelector(olSelector);
    function formatAPA(item) {
      const italic = (text) => `<i>${text}</i>`;
      const authorStr = item.authors.join(', ');
      const yearStr = `(${item.year})`;
      const title = item.url
        ? `<i><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></i>`
        : italic(item.title);
      const titleStr = item.translator
        ? `${title} (${item.translator.join(', ')}, 역)`
        : title;

      return `${authorStr}. ${yearStr}. ${titleStr}. ${item.publisher}.`;
    }
    template_references.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = formatAPA(item);
      ol.appendChild(li);
    });
  }
  return {
    setReferences,
    setHtmlBody,
  };
}
