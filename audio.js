/* =========================================================
   奶蛙爆笑音效
   ---------------------------------------------------------
   - 点击带 data-sound="laugh" 的图片即可播放
   - 音频文件已经按 MP3 帧边界把开头的 2.74 秒静音无损剪掉
     （见 trim_mp3_silence.py），所以播放直接从有声音处开始
   - 原音频峰值接近 0 dBFS，音量压到 0.35，避免突然很大声
   ========================================================= */
(function () {
  var AUDIO_SRC = 'audio/奶蛙-爆笑原声.mp3';
  var VOLUME    = 0.35;   // 音量：0 静音 ~ 1 最大

  var audio = null;

  function getAudio() {
    if (!audio) {
      audio = new Audio(AUDIO_SRC);
      audio.preload = 'auto';
      audio.volume = VOLUME;
    }
    return audio;
  }

  function play() {
    var a = getAudio();
    // 每次都从头播（文件开头就是声音，没有静音段）
    try {
      a.currentTime = 0;
    } catch (e) { /* 忽略 */ }
    var p = a.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* 浏览器拦截自动播放时静默失败 */ });
    }
  }

  function bind() {
    var targets = document.querySelectorAll('[data-sound="laugh"]');
    Array.prototype.forEach.call(targets, function (el) {
      el.addEventListener('click', play);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          play();
        }
      });
    });

    // 提前创建并开始缓冲，让第一次点击就能立刻出声
    getAudio();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
