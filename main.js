const imgData = localStorage.getItem("imgData");
const userLang = navigator.language || navigator.userLanguage;
const zhText = {
  'enter': '点击或按下回车键进入全屏',
  'exit': '点击或按下回车键退出全屏'
};
const enText = {
  'enter': 'Click or press \'ENTER\' to enter Fullscreen',
  'exit': 'Click or press \'ENTER\' to exit Fullscreen'
};

function isFullScreen() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}

function freshLanguage() {
  const status = isFullScreen() ? 'exit' : 'enter';
  const text = (userLang === 'zh-CN') ? zhText[status] : enText[status];
  document.getElementById('tip').innerHTML = text;
}

function textDisplay(cursor, opacity) {
  document.documentElement.style.cursor = cursor;
  document.body.style.opacity = opacity;
}

function enterFullscreen() {
  textDisplay('none', '0');
  freshLanguage();
}

function exitFullscreen() {
  textDisplay('auto', '100');
  freshLanguage();
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
    const isHover = e => e.parentElement.querySelector(':hover') === e;
    const hovered = isHover(document.getElementsByClassName('control')[0]);
    if (!hovered) {
      textDisplay('none', '0');
    }
  }, 600);
};

function saveImage(file) {
  const FR = new FileReader();
  FR.addEventListener("load", function (evt) {
    localStorage.setItem("imgData", evt.target.result);
  });
  FR.readAsDataURL(file);
}

function setBackground(url) {
  document.body.style.background = `url("${url}") no-repeat`;
  document.body.style.backgroundSize = 'cover';
  document.getElementsByClassName('control')[0].style.backgroundColor = 'black';
}

const input = document.querySelector('input');
input.addEventListener('change', function () {
  const curFiles = input.files;
  if (curFiles.length !== 1) return;
  const url = URL.createObjectURL(curFiles[0]);
  setBackground(url);
  saveImage(curFiles[0]);
});

const turnBlack = document.querySelector('button');
turnBlack.addEventListener('click', function () {
  document.body.style.background = ``;
  localStorage.setItem("imgData", "");
});

exitFullscreen();
if (imgData && imgData !== '') {
  setBackground(imgData);
}
document.addEventListener('click', toggleFullScreen);
document.addEventListener('keydown', event => (event.key === 'Enter') && toggleFullScreen());
document.onmousemove = function () {
  mousemove();
};