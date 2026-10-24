/* theme-init.js
 * <head> ထဲတွင် CSS မတိုင်မီ inline ထည့်ရန် (defer မလုပ်ရ)။
 * ရည်ရွယ်ချက် — စာမျက်နှာ ပြသစဉ် theme အရောင် လက်ခနဲ ပြောင်းသွားခြင်း (flash) မဖြစ်စေရန်။
 * ဦးစားပေးအစီအစဉ်: သိမ်းထားသော ရွေးချယ်မှု > E-Ink ဖြစ်နိုင်ခြေ စစ်ဆေးမှု > စနစ်၏ light/dark
 */
(function () {
  var root = document.documentElement;

  // localStorage သည် ပိတ်ထားနိုင်သဖြင့် အမြဲ try/catch ထဲတွင် ဖတ်သည်
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  var theme = read('site-theme');      // paper | dark | eink | (မရှိ = အလိုအလျောက်)
  var fx = read('site-fx');            // glass | (မရှိ)
  var scale = read('site-fontsize');   // 0.9 မှ 1.5 အတွင်း
  var bi = read('site-bilingual');     // my | en | both

  if (!theme && window.matchMedia) {
    // E-Ink သို့မဟုတ် အဖြူအမည်း မျက်နှာပြင်ဟု ခန့်မှန်းနိုင်လျှင် e-ink ပုံစံကို သုံးမည်
    // (browser အားလုံး ပံ့ပိုးခြင်းမရှိသဖြင့် header ရှိ ခလုတ်ဖြင့် ကိုယ်တိုင်ရွေးနိုင်ရမည်)
    if (window.matchMedia('(update: slow)').matches || window.matchMedia('(monochrome)').matches) {
      theme = 'eink';
    }
  }

  if (theme) root.setAttribute('data-theme', theme);
  // glass သည် E-Ink တွင် လုံးဝမသုံးရ
  if (fx === 'glass' && theme !== 'eink') root.setAttribute('data-fx', 'glass');
  if (scale && !isNaN(parseFloat(scale))) root.style.setProperty('--user-font-scale', scale);
  if (bi) root.setAttribute('data-bi', bi);
})();
