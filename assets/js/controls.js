/* controls.js
 * ခလုတ်များ (theme · glass · စာလုံးအရွယ် · ဘာသာပြသမှု) ကို ချိတ်ဆက်ပေးသည့် ကုဒ်။ <script defer> ဖြင့် load လုပ်ပါ။
 *
 * HTML အသုံးပြုပုံ:
 *   <button data-action="theme" data-value="paper">Paper</button>
 *   <button data-action="theme" data-value="eink">E-Ink</button>
 *   <button data-action="theme" data-value="dark">Dark</button>
 *   <button data-action="theme" data-value="auto">Auto</button>
 *   <button data-action="font-size" data-value="+">A+</button>   <button data-action="font-size" data-value="-">A-</button>
 *   <button data-action="bilingual" data-value="my|en|both">…</button>
 *   <button data-action="glass">Glass</button>                  (ရွေးချယ်စရာ — P3)
 *
 * JavaScript မပါလျှင်လည်း စာမျက်နှာကို ဖတ်၍ရရမည် (ဤဖိုင်သည် အပိုဆောင်းသာ)။
 */
(function () {
  var root = document.documentElement;

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* သိမ်းမရလျှင် လျစ်လျူရှုသည် */ }
  }
  function remove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* သိမ်းမရလျှင် လျစ်လျူရှုသည် */ }
  }

  // ခလုတ်များ၏ aria-pressed ကို လက်ရှိအခြေအနေနှင့် ကိုက်ညီစေရန် ပြန်ညှိသည်
  function sync() {
    var theme = root.getAttribute('data-theme') || 'auto';
    var bi = root.getAttribute('data-bi') || 'both';
    var glass = root.getAttribute('data-fx') === 'glass';
    var buttons = document.querySelectorAll('[data-action]');
    for (var i = 0; i < buttons.length; i++) {
      var el = buttons[i];
      var action = el.getAttribute('data-action');
      var value = el.getAttribute('data-value');
      if (action === 'theme') el.setAttribute('aria-pressed', String(value === theme));
      else if (action === 'bilingual') el.setAttribute('aria-pressed', String(value === bi));
      else if (action === 'glass') el.setAttribute('aria-pressed', String(glass));
    }
  }

  document.addEventListener('click', function (ev) {
    var el = ev.target.closest ? ev.target.closest('[data-action]') : null;
    if (!el) return;
    var action = el.getAttribute('data-action');
    var value = el.getAttribute('data-value');

    if (action === 'theme') {
      if (value === 'auto') {
        root.removeAttribute('data-theme');
        remove('site-theme');
      } else {
        root.setAttribute('data-theme', value);
        save('site-theme', value);
      }
      // E-Ink ဖြစ်လျှင် glass ကို ချက်ချင်းပိတ်သည်
      if (value === 'eink') root.removeAttribute('data-fx');
    } else if (action === 'glass') {
      if (root.getAttribute('data-theme') === 'eink') return;   // E-Ink တွင် မရနိုင်
      if (root.getAttribute('data-fx') === 'glass') {
        root.removeAttribute('data-fx');
        remove('site-fx');
      } else {
        root.setAttribute('data-fx', 'glass');
        save('site-fx', 'glass');
      }
    } else if (action === 'font-size') {
      var current = parseFloat(getComputedStyle(root).getPropertyValue('--user-font-scale')) || 1;
      var next = Math.min(1.5, Math.max(0.9, current + (value === '+' ? 0.1 : -0.1)));
      next = Math.round(next * 10) / 10;
      root.style.setProperty('--user-font-scale', String(next));
      save('site-fontsize', String(next));
    } else if (action === 'bilingual') {
      root.setAttribute('data-bi', value);
      save('site-bilingual', value);
    } else {
      return;
    }
    sync();
  });

  sync();
})();
