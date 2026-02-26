#!/usr/bin/env python3
import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MAP_PATH = ROOT / "assets" / "cities" / "city-hero-map.json"
ASSETS_DIR = ROOT / "assets" / "cities"
ATTR_PATH = ROOT / "assets" / "cities" / "ATTRIBUTIONS.md"

SERVICE_PREFIXES = (
    "deratisation-",
    "rats-",
    "cafards-",
    "punaises-de-lit-",
    "souris-",
    "guepes-",
    "frelons-",
)


def strip_html(value: str) -> str:
    value = re.sub(r"<[^>]+>", "", value or "")
    return html.unescape(value).strip()


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "allo-nuisible-express-bot/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def resolve_wiki_image(wiki_title: str):
    fr_api = (
        "https://fr.wikipedia.org/w/api.php?action=query&format=json&redirects=1"
        f"&titles={urllib.parse.quote(wiki_title)}&prop=pageimages&piprop=original"
    )
    data = fetch_json(fr_api)
    pages = data.get("query", {}).get("pages", {})
    page = next(iter(pages.values())) if pages else {}
    original = (page.get("original") or {}).get("source")
    if not original:
        raise RuntimeError(f"No image found for {wiki_title}")

    filename = urllib.parse.unquote(urllib.parse.urlparse(original).path.split("/")[-1])
    file_title = f"File:{filename}"

    commons_api = (
        "https://commons.wikimedia.org/w/api.php?action=query&format=json"
        f"&titles={urllib.parse.quote(file_title)}"
        "&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=2000"
    )
    commons_data = fetch_json(commons_api)
    cpages = commons_data.get("query", {}).get("pages", {})
    cpage = next(iter(cpages.values())) if cpages else {}
    info = (cpage.get("imageinfo") or [{}])[0]
    meta = info.get("extmetadata") or {}

    return {
        "file_title": file_title,
        "download_url": info.get("thumburl") or info.get("url") or original,
        "descriptionurl": info.get("descriptionurl", ""),
        "artist": strip_html((meta.get("Artist") or {}).get("value", "")),
        "license_short": strip_html((meta.get("LicenseShortName") or {}).get("value", "")),
    }


def download_and_convert(city_slug: str, source_url: str):
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    src_path = ASSETS_DIR / f"{city_slug}-source"
    jpg_path = ASSETS_DIR / f"{city_slug}-hero.jpg"
    webp_path = ASSETS_DIR / f"{city_slug}-hero.webp"

    if jpg_path.exists() and webp_path.exists():
        return

    req = urllib.request.Request(
        source_url,
        headers={"User-Agent": "allo-nuisible-express-bot/1.0 (+https://allonuisibleexpress.fr)"},
    )
    last_error = None
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=45) as r:
                src_path.write_bytes(r.read())
            last_error = None
            break
        except Exception as e:
            last_error = e
            time.sleep(1.8 * (attempt + 1))
    if last_error is not None:
        raise last_error

    with Image.open(src_path) as img:
        img = img.convert("RGB")
        w, h = img.size
        if w > 1600:
            nh = int((1600 / w) * h)
            img = img.resize((1600, nh), Image.Resampling.LANCZOS)
        img.save(jpg_path, format="JPEG", quality=84, optimize=True, progressive=True)
        img.save(webp_path, format="WEBP", quality=82, method=6)

    src_path.unlink(missing_ok=True)


def build_hero_block(city: str, landmark: str, slug: str):
    alt = f"Vue de {city} – {landmark}"
    caption = f"{city} – {landmark}"
    return (
        "\n<!-- CITY-HERO-START -->\n"
        '<section class="city-hero-visual" style="background:#fff;border:1px solid #ececec;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.08);margin:0 0 16px;">\n'
        "  <picture>\n"
        f'    <source type="image/webp" srcset="../assets/cities/{slug}-hero.webp 1600w" sizes="(max-width: 1200px) 100vw, 1120px">\n'
        f'    <img src="../assets/cities/{slug}-hero.jpg" srcset="../assets/cities/{slug}-hero.jpg 1600w" sizes="(max-width: 1200px) 100vw, 1120px" alt="{html.escape(alt)}" loading="eager" fetchpriority="high" decoding="async" style="display:block;width:100%;height:auto;max-height:460px;object-fit:cover;">\n'
        "  </picture>\n"
        f'  <figcaption style="padding:10px 14px;font-size:14px;color:#3f3f3f;">{html.escape(caption)}</figcaption>\n'
        "</section>\n"
        "<!-- CITY-HERO-END -->\n"
    )


def replace_hotlinks(content: str, slug: str):
    return re.sub(
        r"https://upload\.wikimedia\.org/wikipedia/commons/[^'\")\s>]+",
        f"../assets/cities/{slug}-hero.jpg",
        content,
    )


def inject_hero(content: str, block: str):
    if "<!-- CITY-HERO-START -->" in content and "<!-- CITY-HERO-END -->" in content:
        return re.sub(
            r"<!-- CITY-HERO-START -->.*?<!-- CITY-HERO-END -->",
            block.strip(),
            content,
            flags=re.S,
        )

    main_article_pattern = r"(<main[^>]*>\s*<article[^>]*>)"
    if re.search(main_article_pattern, content, flags=re.I | re.S):
        return re.sub(main_article_pattern, r"\1\n" + block, content, count=1, flags=re.I | re.S)

    main_pattern = r"(<main[^>]*>)"
    if re.search(main_pattern, content, flags=re.I | re.S):
        return re.sub(main_pattern, r"\1\n" + block, content, count=1, flags=re.I | re.S)

    return content


def find_local_pages():
    pages = []
    for prefix in SERVICE_PREFIXES:
        pages.extend(sorted(Path(ROOT).glob(f"{prefix}*/index.html")))
    return pages


def city_slug_from_dir(dirname: str):
    for prefix in SERVICE_PREFIXES:
        if dirname.startswith(prefix):
            return dirname[len(prefix):]
    return None


def write_attributions(rows):
    lines = [
        "# Attributions images villes",
        "",
        "Sources : Wikimedia Commons (licences ouvertes selon chaque fichier).",
        "",
        "| Ville | Fichier local | Source | Auteur | Licence |",
        "|---|---|---|---|---|",
    ]
    for row in rows:
        src = row.get("descriptionurl") or row.get("download_url")
        src_md = f"[source]({src})"
        author = row.get("artist") or "N/A"
        license_short = row.get("license_short") or "Voir la page source"
        lines.append(
            f"| {row['city']} | `/assets/cities/{row['slug']}-hero.webp` | {src_md} | {author} | {license_short} |"
        )
    ATTR_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    mapping = json.loads(MAP_PATH.read_text(encoding="utf-8"))

    attr_rows = []
    for slug, cfg in mapping.items():
        resolved = resolve_wiki_image(cfg["wiki_title"])
        download_and_convert(slug, resolved["download_url"])
        attr_rows.append(
            {
                "slug": slug,
                "city": cfg["city"],
                "download_url": resolved["download_url"],
                "descriptionurl": resolved["descriptionurl"],
                "artist": resolved["artist"],
                "license_short": resolved["license_short"],
            }
        )

    pages = find_local_pages()
    changed = 0
    skipped = []

    for page in pages:
        city_slug = city_slug_from_dir(page.parent.name)
        if not city_slug or city_slug not in mapping:
            skipped.append(str(page))
            continue

        cfg = mapping[city_slug]
        hero_block = build_hero_block(cfg["city"], cfg["landmark"], city_slug)
        original = page.read_text(encoding="utf-8")
        updated = replace_hotlinks(original, city_slug)
        updated = inject_hero(updated, hero_block)

        if updated != original:
            page.write_text(updated, encoding="utf-8")
            changed += 1

    write_attributions(attr_rows)

    print(f"Updated pages: {changed}")
    print(f"Total local pages: {len(pages)}")
    if skipped:
        print("Skipped pages (no mapping):")
        for s in skipped:
            print(f" - {s}")


if __name__ == "__main__":
    main()
