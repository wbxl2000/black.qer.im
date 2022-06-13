
const userLang = navigator.language || navigator.userLanguage;
const zhText = {
  'enter': '点击或按下回车键进入全屏',
  'exit': '点击或按下回车键退出全屏'
};
const enText = {
  'enter': 'Click or press \'ENTER\' to enter Fullscreen',
  'exit': 'Click or press \'ENTER\' to exit Fullscreen'
};

function freshLanguage() {
  const status = isFullScreen() ? 'exit' : 'enter';
  const text = (userLang === 'zh-CN') ? zhText[status] : enText[status];
  document.getElementById('tip').innerHTML = text;
}

function textDisplay(cursor, opacity) {
  document.documentElement.style.cursor = cursor;
  document.getElementById('tip').style.opacity = opacity;
  document.getElementById('github').style.opacity = opacity;
}

function enterFullscreen() {
  textDisplay('none', '0');
  freshLanguage();
}

function exitFullscreen() {
  textDisplay('auto', '100');
  freshLanguage();
}

function isFullScreen() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}

async function toggleFullScreen() {
  if (!isFullScreen()) {
    await document.documentElement.requestFullscreen();
    enterFullscreen();
  } else {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
      exitFullscreen();
    }
  }
}

let timer;
function mousemove() {
  if (timer) {
    clearTimeout(timer);
    textDisplay('auto', '100');
  }
  timer = setTimeout(function () {
    textDisplay('none', '0');
  }, 600);
};

exitFullscreen();
document.addEventListener('click', toggleFullScreen);
document.addEventListener('keydown', event => (event.key === 'Enter') && toggleFullScreen());
document.onmousemove = function () {
  mousemove();
};