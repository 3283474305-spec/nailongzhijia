fetch('nav.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('site-header').innerHTML = html;

    // ---- 原有逻辑：高亮当前页 ----
    const links = document.querySelectorAll("nav a");
    // 访问根路径 "/" 时 pop() 会返回空字符串，兜底成首页
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    links.forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });

    // ---- 夜间模式：滑动开关 ----
    // 注意：这段必须放在上面 innerHTML 赋值之后，
    // 因为按钮是刚刚才被插入 DOM 的，放前面会拿到 null
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const isDark = () => document.documentElement.dataset.theme === 'dark';

    // 把当前状态同步到开关的样式与无障碍属性。
    // 圆钮的滑动位移和图标都由这两个 CSS 变量驱动，
    // 所以不必依赖 :has() 选择器，兼容性更好
    function syncButton() {
      const dark = isDark();
      btn.style.setProperty('--knob-x', dark ? '1.5rem' : '0rem');
      btn.style.setProperty('--knob-icon', dark ? "'☀️'" : "'🌙'");
      btn.setAttribute('aria-label', dark ? '切换到日间模式' : '切换到夜间模式');
      // role="switch" 用 aria-checked，语义上表示「夜间模式是否开启」
      btn.setAttribute('aria-checked', String(dark));
      btn.title = dark ? '切换到日间模式' : '切换到夜间模式';
    }

    // 先把状态摆正，再启用过渡动画：
    // 否则夜间用户一进页面就会看到圆钮从左边「飞」到右边
    syncButton();
    setTimeout(() => document.documentElement.setAttribute('data-ready', 'true'), 60);

    btn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      // 只改 <html data-theme>，CSS 里的变量会整体换一套值
      document.documentElement.dataset.theme = next;

      // 记忆用户选择，跳转到其它页面时保持
      // 用 try/catch 包住：Safari 无痕模式下 localStorage 会抛异常
      try {
        localStorage.setItem('theme', next);
      } catch (e) {
        // 存不了就算了，不影响本次切换
      }

      syncButton();
    });
  });
