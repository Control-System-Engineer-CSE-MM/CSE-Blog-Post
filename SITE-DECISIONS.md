# SITE-DECISIONS.md

<!-- ဤဖိုင်သည် ဆုံးဖြတ်ချက်များကို မှတ်သားရန် ဖြစ်သည်။ AI က Step 0 မေးခွန်းများ၏ အဖြေကို ဤနေရာတွင် ဖြည့်ပြီး နောက်စက်ရှင်များတွင် ပြန်မမေးရန် သုံးသည်။ -->
<!-- ဖုန်းမှ GitHub ဖြင့် တိုက်ရိုက် ပြင်ဆင်နိုင်သည်။ "undecided" ကျန်နေသရွေ့ AI က ထိုအချက်ကို မေးမည်။ -->

## Decisions

```yaml
ssg: hugo                      # hugo | astro | eleventy | jekyll | docusaurus | all
sections: [blog]               # docs, blog, portfolio, links (ရွေးထားသည်များ) — ယခု blog သာ
github_owner: undecided        # GitHub username သို့မဟုတ် organization
repo_name: undecided           # Repository အမည် (base path ကို CI က အလိုအလျောက် ယူသဖြင့် build အတွက် မလို၊ "Edit this page" link အတွက်သာ လို)
custom_domain: undecided       # none သို့မဟုတ် domain အမည်
site_title: undecided          # hugo.toml ရှိ title (မြန်မာ/English နှစ်ခု) တွင် TODO(owner) ဟု ချန်ထားသည်
ascii_wordmark_text: BLOG      # layouts/_partials/wordmark.html တွင် နမူနာ "BLOG" ထည့်ထားသည် — ပြောင်းရန်
default_language: my           # my | en
links_page_as_home: no
content_license: undecided
```

## Versions (2026-10-22 တွင် တရားဝင်စာမျက်နှာများမှ စစ်ဆေးထားသည်)

```yaml
ssg_version: 0.167.0           # Hugo (extended) — 0.168.0 သည် ထုတ်ပြန်ပြီး ၂ ပတ်မပြည့်သေးသဖြင့် မသုံးသေးပါ
runtime_version: none          # Hugo အတွက် Node/Ruby မလို
katex_version: 0.18.4          # static/katex/ ရှိ CSS + ဖောင့်များ (Hugo ၌ ပါသော KaTeX ဖြင့် ညီစေရန်)
actions: "checkout v7 · configure-pages v6 · upload-pages-artifact v5 · deploy-pages v5"
fonts: "Inter · Source Serif 4 · Noto Serif Myanmar · Noto Sans Myanmar · JetBrains Mono (subset) — SIL OFL 1.1"
checked_on: 2026-10-22
```

## Placeholders ကျန်နေသည်များ (TODO(owner))

- `hugo.toml` — `title` (မြန်မာ/English)၊ `languages.*.params.description`၊ `languages.*.params.tagline`၊ `params.author`၊ `params.githubRepo` ("owner/repo")
- `content/my/_index.md` နှင့် `content/en/_index.md` — ပင်မစာမျက်နှာ မိတ်ဆက်စာ
- `layouts/_partials/wordmark.html` — ASCII wordmark ("BLOG" နမူနာ)
- နမူနာပို့စ်များ — `content/my/blog/hello-world.md`၊ `content/en/blog/hello-world.md`၊ `content/my/blog/reading-modes.md` (မလိုလျှင် ဖျက်နိုင်သည်)
- `static/images/` — ပုံများ (လောလောဆယ် ဘာမျှမရှိ)

## မစစ်ဆေးရသေးသည့်အချက်

- Local တွင် Hugo ကို မ run ထားသဖြင့် (အဆိုပါ စည်းမျဉ်း R1) template များကို GitHub Actions ၏ ပထမဆုံး run တွင်သာ အမှန်တကယ် စစ်ဆေးရမည်။ ပျက်ပါက Actions log ကို Claude Code သို့ ပေးပါ။
