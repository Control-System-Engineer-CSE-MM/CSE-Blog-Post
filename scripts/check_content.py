#!/usr/bin/env python3
# check_content.py — Markdown content ဖိုင်များကို build မတိုင်မီ စစ်ဆေးသည့် ရိုးရှင်းသော script
#
# - python3 standard library သာ သုံးသည် (ဘာမှ install မလုပ်ရ၊ GitHub Actions runner တွင် ပါပြီးသား)
# - စစ်သည့်အရာများ: front matter ရှိမရှိ၊ မဖြစ်မနေ key များ၊ slug ပုံစံ (ASCII kebab-case)၊ lang တန်ဖိုး၊
#   slug ထပ်နေခြင်း၊ Zawgyi ဖြစ်နိုင်ခြေ (သတိပေးရုံသာ)
# - ထွက်ပုံ: GitHub Actions ၏ ::error / ::warning ပုံစံ — ဖုန်းမှ Actions ကြည့်သည့်အခါ ဖိုင်အမည်ပါ ပေါ်မည်
# - အသုံးပြုပုံ: python3 scripts/check_content.py content [နောက်ထပ် ဖိုလ်ဒါ ...]
# - error တစ်ခုခုရှိလျှင် exit code 1 (workflow တွင် မူလအားဖြင့် continue-on-error ဖြင့် မပိတ်ဆို့ထားပါ)

import re
import sys
from pathlib import Path

REQUIRED = ("title", "slug", "lang")             # မဖြစ်မနေ ပါရမည့် key များ
ALLOWED_LANG = {"my", "en"}
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FRONT_MATTER_RE = re.compile(r"\A\ufeff?---[ \t]*\n(.*?)\n---[ \t]*(?:\n|\Z)", re.S)
# မြန်မာ Unicode တွင် ေ (U+1031) သည် ဗျည်းနောက်မှ လာရသည်။ စာလုံး/အစမတိုင်ခင် မဟုတ်သော နေရာတွင် ဗျည်းရှေ့မှ ေ ပါလျှင် Zawgyi ဖြစ်နိုင်သည်
ZAWGYI_RE = re.compile(r"(?:^|[^\u1000-\u109F])\u1031[\u1000-\u1021]")
SKIP_NAMES = ("README.md",)                      # စစ်ဆေးမှုမှ ကျော်မည့် ဖိုင်များ


def parse_front_matter(text):
    """ ထိပ်ဆုံးအဆင့် `key: value` များကိုသာ ရိုးရိုးဖတ်သည် (YAML library မလိုပါ) """
    match = FRONT_MATTER_RE.match(text)
    if not match:
        return None
    data = {}
    for line in match.group(1).splitlines():
        if not line.strip() or line.startswith((" ", "\t", "#", "-")) or ":" not in line:
            continue
        key, _, value = line.partition(":")
        value = re.split(r"\s+#", value, maxsplit=1)[0].strip().strip("\"'")
        data[key.strip()] = value
    return data


def annotate(level, path, message):
    print(f"::{level} file={path},line=1::{message}")


def main(dirs):
    errors = 0
    warnings = 0
    seen = {}                                    # (ဖိုလ်ဒါ, lang, slug) → ဖိုင်

    files = []
    for d in dirs:
        base = Path(d)
        if not base.exists():
            annotate("warning", d, "ဖိုလ်ဒါ မတွေ့ပါ — content လမ်းကြောင်းကို စစ်ပါ")
            warnings += 1
            continue
        files += sorted(p for p in base.rglob("*") if p.suffix in (".md", ".mdx"))

    for path in files:
        if path.name.startswith("_") or path.name in SKIP_NAMES:
            continue                             # _index.md စသည့် SSG အထူးဖိုင်များ
        text = path.read_text(encoding="utf-8", errors="replace")
        meta = parse_front_matter(text)
        if meta is None:
            annotate("error", path, "front matter (--- … ---) မတွေ့ပါ")
            errors += 1
            continue

        for key in REQUIRED:
            if not meta.get(key):
                annotate("error", path, f"မဖြစ်မနေ ပါရမည့် key '{key}' မရှိပါ")
                errors += 1

        slug, lang = meta.get("slug", ""), meta.get("lang", "")
        if slug and not SLUG_RE.match(slug):
            annotate("error", path, f"slug '{slug}' သည် ASCII စာလုံးသေး၊ ဂဏန်း၊ တုံးတို (-) သာ ဖြစ်ရမည်")
            errors += 1
        if lang and lang not in ALLOWED_LANG:
            annotate("error", path, f"lang '{lang}' သည် my သို့မဟုတ် en ဖြစ်ရမည်")
            errors += 1
        if slug and lang:
            key = (str(path.parent), lang, slug)
            if key in seen:
                annotate("error", path, f"slug '{slug}' သည် {seen[key]} နှင့် ထပ်နေသည်")
                errors += 1
            else:
                seen[key] = str(path)

        if ZAWGYI_RE.search(text):
            annotate("warning", path, "Zawgyi စာလုံးကုဒ် ဖြစ်နိုင်သည် — Unicode (Pyidaungsu/Myanmar3 keyboard) ဖြင့် ပြန်ရိုက်ပါ")
            warnings += 1

    print(f"စစ်ဆေးပြီး: ဖိုင် {len(files)} ခု · error {errors} · warning {warnings}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or ["content"]))
