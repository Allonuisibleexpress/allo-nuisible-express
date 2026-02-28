#!/usr/bin/env python3
import json
import re
import html
from datetime import date
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from PIL import Image, ImageOps

UA = "AlloNuisibleExpressBot/1.0 (contact: allonuisibleexpress@gmail.com)"
ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "cities"
ASSETS.mkdir(parents=True, exist_ok=True)

CITY_CONFIG = {
    "antony": {"title": "Antony (Hauts-de-Seine)", "query": "Antony mairie", "city": "Antony", "landmark": "Hôtel de ville"},
    "arcueil": {"title": "Arcueil", "query": "Arcueil mairie", "city": "Arcueil", "landmark": "Panorama urbain"},
    "cachan": {"title": "Cachan", "query": "Cachan mairie", "city": "Cachan", "landmark": "Mairie"},
    "chatenay-malabry": {"title": "Châtenay-Malabry", "query": "Châtenay-Malabry mairie", "city": "Châtenay-Malabry", "landmark": "Centre-ville"},
    "chevilly-larue": {"title": "Chevilly-Larue", "query": "Chevilly-Larue mairie", "city": "Chevilly-Larue", "landmark": "Mairie"},
    "choisy-le-roi": {"title": "Choisy-le-Roi", "query": "Choisy-le-Roi mairie", "city": "Choisy-le-Roi", "landmark": "Centre-ville"},
    "clamart": {"title": "Clamart", "query": "Clamart mairie", "city": "Clamart", "landmark": "Mairie"},
    "fresnes": {"title": "Fresnes (Val-de-Marne)", "query": "Fresnes Val-de-Marne mairie", "city": "Fresnes", "landmark": "Panorama local"},
    "gentilly": {"title": "Gentilly (Val-de-Marne)", "query": "Gentilly Val-de-Marne mairie", "city": "Gentilly", "landmark": "Centre-ville"},
    "le-kremlin-bicetre": {"title": "Le Kremlin-Bicêtre", "query": "Le Kremlin-Bicêtre mairie", "city": "Le Kremlin-Bicêtre", "landmark": "Mairie"},
    "lhay-les-roses": {"title": "L'Haÿ-les-Roses", "query": "L'Haÿ-les-Roses mairie", "city": "L'Haÿ-les-Roses", "landmark": "Parc de la Roseraie"},
    "orly": {"title": "Orly", "query": "Orly mairie", "city": "Orly", "landmark": "Centre-ville"},
    "rungis": {"title": "Rungis", "query": "Rungis marché international", "city": "Rungis", "landmark": "Marché international"},
    "thiais": {"title": "Thiais", "query": "Thiais mairie", "city": "Thiais", "landmark": "Centre-ville"},
    "versailles": {"title": "Versailles", "query": "Versailles château", "city": "Versailles", "landmark": "Château de Versailles"},
    "villejuif": {"title": "Villejuif", "query": "Villejuif mairie", "city": "Villejuif", "landmark": "Centre-ville"},
    "vitry-sur-seine": {"title": "Vitry-sur-Seine", "query": "Vitry-sur-Seine mairie", "city": "Vitry-sur-Seine", "landmark": "Panorama urbain"},
}

SERVICES = r"(?:deratisation|rats|cafards|punaises-de-lit|souris|guepes|frelons|frelon-asiatique|depigeonnage|chenille-processionnaire|acariens|xylophages|mouches|fourmis)"
PAT_DIR = re.compile(rf"^({SERVICES})-(.+)$")
PAT_FILE = re.compile(rf"^({SERVICES})-(.+)\\.html$")


def fetch_json(base, params):
    url = base + "?" + urlencode(params)
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def strip_tags(text):
    text = html.unescape(text or "")
    text = re.sub(r"<[^>]+>", "", text)
    return re.sub(r"\s+", " ", text).strip()


def frwiki_page_image(title):
    data = fetch_json(
        "https://fr.wikipedia.org/w/api.php",
        {
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "pageimages",
            "piprop": "name|original",
        },
    )
    pages = data.get("query", {}).get("pages", {})
    if not pages:
        return None
    page = next(iter(pages.values()))
    filename = page.get("pageimage")
    if not filename:
        return None
    return filename if filename.lower().startswith("file:") else f"File:{filename}"


def commons_search_file(query):
    data = fetch_json(
        "https://commons.wikimedia.org/w/api.php",
        {
            "action": "query",
            "format": "json",
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": "6",
            "gsrlimit": "20",
            "prop": "imageinfo",
            "iiprop": "url|size|mime|user|timestamp|extmetadata",
        },
    )
    pages = list((data.get("query", {}).get("pages", {}) or {}).values())
    if not pages:
        return None

    def score(p):
        ii = (p.get("imageinfo") or [{}])[0]
        w = int(ii.get("width") or 0)
        h = int(ii.get("height") or 1)
        mime = (ii.get("mime") or "").lower()
        if mime not in {"image/jpeg", "image/png"}:
            return -1
        ratio = w / max(h, 1)
        landscape_bonus = 500 if ratio >= 1.2 else 0
        return w + landscape_bonus

    pages.sort(key=score, reverse=True)
    best = pages[0]
    if score(best) < 0:
        return None
    return best.get("title")


def commons_file_info(file_title):
    title = file_title if file_title.lower().startswith("file:") else f"File:{file_title}"
    data = fetch_json(
        "https://commons.wikimedia.org/w/api.php",
        {
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "imageinfo",
            "iiprop": "url|size|mime|user|timestamp|extmetadata",
        },
    )
    pages = data.get("query", {}).get("pages", {})
    if not pages:
        return None
    page = next(iter(pages.values()))
    ii = (page.get("imageinfo") or [None])[0]
    if not ii:
        return None
    return page.get("title"), ii


def download(url, out_path):
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=60) as r:
        out_path.write_bytes(r.read())


def render_variants(src_path, slug):
    img = Image.open(src_path).convert("RGB")
    # 16:9 crop for consistent hero rendering
    base = ImageOps.fit(img, (1600, 900), method=Image.LANCZOS, centering=(0.5, 0.5))
    sizes = [(640, 360), (1024, 576), (1600, 900)]
    for w, h in sizes:
        v = base.resize((w, h), Image.LANCZOS)
        v.save(ASSETS / f"{slug}-hero-{w}.jpg", format="JPEG", quality=82, optimize=True, progressive=True)
        v.save(ASSETS / f"{slug}-hero-{w}.webp", format="WEBP", quality=80, method=6)
    base.save(ASSETS / f"{slug}-hero.jpg", format="JPEG", quality=84, optimize=True, progressive=True)
    base.save(ASSETS / f"{slug}-hero.webp", format="WEBP", quality=82, method=6)


def collect_city_slugs():
    slugs = set()
    for p in ROOT.glob("**/index.html"):
        m = PAT_DIR.match(p.parent.name)
        if m:
            slugs.add(m.group(2))
    for p in ROOT.glob("*.html"):
        m = PAT_FILE.match(p.name)
        if m:
            slugs.add(m.group(2))
    return sorted(slugs)


def main():
    credits = {}
    audit = {"generated": [], "missing": []}
    today = date.today().isoformat()

    for slug in collect_city_slugs():
        cfg = CITY_CONFIG.get(slug)
        if not cfg:
            audit["missing"].append({"slug": slug, "reason": "missing city config"})
            continue

        file_title = frwiki_page_image(cfg["title"]) or commons_search_file(cfg["query"])
        if not file_title:
            audit["missing"].append({"slug": slug, "reason": "no open-licence image found"})
            continue

        info = commons_file_info(file_title)
        if not info:
            audit["missing"].append({"slug": slug, "reason": "commons metadata unavailable", "file": file_title})
            continue

        real_title, ii = info
        url = ii.get("url")
        if not url:
            audit["missing"].append({"slug": slug, "reason": "image url missing", "file": real_title})
            continue

        tmp = ASSETS / f".{slug}-src"
        download(url, tmp)
        render_variants(tmp, slug)
        tmp.unlink(missing_ok=True)

        ext = ii.get("extmetadata") or {}
        credits[slug] = {
            "city": cfg["city"],
            "landmark": cfg["landmark"],
            "alt": f"Vue de {cfg['city']} – {cfg['landmark']}",
            "source_url": url,
            "source_title": real_title,
            "author": strip_tags(((ext.get("Artist") or {}).get("value") or "") or ii.get("user") or "Unknown"),
            "licence": strip_tags(((ext.get("LicenseShortName") or {}).get("value") or "") or "Voir page Wikimedia"),
            "licence_url": strip_tags(((ext.get("LicenseUrl") or {}).get("value") or "")),
            "page_wikimedia": strip_tags(((ext.get("ImageDescription") or {}).get("value") or "")) or f"https://commons.wikimedia.org/wiki/{real_title.replace(' ', '_')}",
            "date_download": today,
            "files": {
                "webp": [f"/assets/cities/{slug}-hero-640.webp", f"/assets/cities/{slug}-hero-1024.webp", f"/assets/cities/{slug}-hero-1600.webp"],
                "jpg": [f"/assets/cities/{slug}-hero-640.jpg", f"/assets/cities/{slug}-hero-1024.jpg", f"/assets/cities/{slug}-hero-1600.jpg"],
                "default_webp": f"/assets/cities/{slug}-hero.webp",
                "default_jpg": f"/assets/cities/{slug}-hero.jpg",
            },
        }
        audit["generated"].append(slug)

    (ASSETS / "credits.json").write_text(json.dumps(credits, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (ASSETS / "hero-audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
