#!/usr/bin/env python3
import re
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
LOCAL_HERO_DIR = ROOT / 'assets' / 'local-hero'
LOCAL_HERO_DIR.mkdir(parents=True, exist_ok=True)
INTERVENTION_DIR = ROOT / 'assets' / 'interventions' / 'local'
INTERVENTION_DIR.mkdir(parents=True, exist_ok=True)

services = ['deratisation','rats','cafards','punaises-de-lit','souris','guepes','frelons','frelon-asiatique','depigeonnage','chenille-processionnaire','acariens','xylophages','mouches','fourmis']
SERVICE_RE = '(?:' + '|'.join(map(re.escape, services)) + ')'
PAT_DIR = re.compile(rf'^({SERVICE_RE})-(.+)$')
PAT_FILE = re.compile(rf'^({SERVICE_RE})-(.+)\\.html$')

CITY_CP = {
    'antony':'92160','arcueil':'94110','cachan':'94230','chatenay-malabry':'92290','chevilly-larue':'94550','choisy-le-roi':'94600','clamart':'92140','fresnes':'94260','gentilly':'94250','le-kremlin-bicetre':'94270','lhay-les-roses':'94240','orly':'94310','rungis':'94150','thiais':'94320','versailles':'78000','villejuif':'94800','vitry-sur-seine':'94400'
}
CITY_NAME = {
    'antony':'Antony','arcueil':'Arcueil','cachan':'Cachan','chatenay-malabry':'Châtenay-Malabry','chevilly-larue':'Chevilly-Larue','choisy-le-roi':'Choisy-le-Roi','clamart':'Clamart','fresnes':'Fresnes','gentilly':'Gentilly','le-kremlin-bicetre':'Le Kremlin-Bicêtre','lhay-les-roses':"L'Haÿ-les-Roses",'orly':'Orly','rungis':'Rungis','thiais':'Thiais','versailles':'Versailles','villejuif':'Villejuif','vitry-sur-seine':'Vitry-sur-Seine'
}
SERVICE_NAME = {
    'deratisation':'rongeurs','rats':'rats','cafards':'cafards','punaises-de-lit':'punaises de lit','souris':'souris','guepes':'guêpes','frelons':'frelons','frelon-asiatique':'frelon asiatique','depigeonnage':'pigeons','chenille-processionnaire':'chenilles processionnaires','acariens':'acariens','xylophages':'xylophages','mouches':'mouches','fourmis':'fourmis'
}
SERVICE_CONTEXT = {
    'deratisation':'cave','rats':'cave','cafards':'cuisine','punaises-de-lit':'chambre','souris':'vide-sanitaire','guepes':'toiture','frelons':'jardin','frelon-asiatique':'jardin','depigeonnage':'toiture','chenille-processionnaire':'jardin','acariens':'chambre','xylophages':'charpente','mouches':'cuisine','fourmis':'terrasse'
}

IMG_TAG_RE = re.compile(r'<img\\b[^>]*>', re.I)
SRC_RE = re.compile(r'src=["\']([^"\']+)["\']', re.I)
ALT_RE = re.compile(r'alt=["\']([^"\']*)["\']', re.I)


def detect_page_service_city(path: Path):
    m = PAT_DIR.match(path.parent.name)
    if m:
        return m.group(1), m.group(2)
    m = PAT_FILE.match(path.name)
    if m:
        return m.group(1), m.group(2)
    return None, None


def local_pages():
    pages = []
    for p in ROOT.glob('**/index.html'):
        s,c = detect_page_service_city(p)
        if s and c:
            pages.append((p,s,c))
    for p in ROOT.glob('*.html'):
        s,c = detect_page_service_city(p)
        if s and c:
            pages.append((p,s,c))
    return pages


def build_hero_alias(service, city):
    src_jpg = ROOT / 'assets' / 'cities' / f'{city}-hero.jpg'
    src_webp = ROOT / 'assets' / 'cities' / f'{city}-hero.webp'
    if not src_jpg.exists() and not src_webp.exists():
        return None
    context = SERVICE_CONTEXT.get(service,'centre-ville')
    base = f'{service}-{city}-{context}'
    dst_jpg = LOCAL_HERO_DIR / f'{base}.jpg'
    dst_webp = LOCAL_HERO_DIR / f'{base}.webp'

    # Re-encode for consistent quality and no metadata
    if src_jpg.exists():
        im = Image.open(src_jpg).convert('RGB')
    else:
        im = Image.open(src_webp).convert('RGB')
    im = ImageOps.fit(im, (1600, 900), Image.LANCZOS)
    im.save(dst_jpg, 'JPEG', quality=84, optimize=True, progressive=True)
    im.save(dst_webp, 'WEBP', quality=82, method=6)
    return base


def set_attr(tag, name, value):
    pat = re.compile(rf'\\s{name}=["\'][^"\']*["\']', re.I)
    if pat.search(tag):
        return pat.sub(f' {name}="{value}"', tag)
    return tag[:-1] + f' {name}="{value}">' if tag.endswith('>') else tag


def normalize_src(path: Path, src: str):
    # keep absolute URLs untouched
    if src.startswith('http://') or src.startswith('https://'):
        return None
    pure = src.split('?',1)[0].split('#',1)[0]
    return (path.parent / pure).resolve()


def rel_from_page(page: Path, target: Path):
    rel = target.relative_to(ROOT)
    depth = len(page.relative_to(ROOT).parents) - 1
    prefix = '../' * depth
    return prefix + str(rel).replace('\\\\','/')


def build_alt(service, city):
    city_name = CITY_NAME.get(city, city.replace('-', ' ').title())
    cp = CITY_CP.get(city, '')
    nuis = SERVICE_NAME.get(service, service)
    context = SERVICE_CONTEXT.get(service, 'zone traitée')
    if cp:
        return f"Infestation de {nuis} dans une {context} à {city_name} ({cp})"
    return f"Infestation de {nuis} dans une {context} à {city_name}"


def main():
    report = {'heroes': [], 'inline_images': []}
    pages = local_pages()

    # create per-page hero aliases
    for p, service, city in pages:
        base = build_hero_alias(service, city)
        if base:
            report['heroes'].append({'page': str(p.relative_to(ROOT)), 'hero': f'/assets/local-hero/{base}.webp'})

    # update inline img tags (excluding logo)
    for p, service, city in pages:
        txt = p.read_text(encoding='utf-8', errors='ignore')
        changed = False

        def repl(m):
            nonlocal changed
            tag = m.group(0)
            srcm = SRC_RE.search(tag)
            if not srcm:
                return tag
            src = srcm.group(1)
            if 'logo.png' in src.lower():
                return tag

            abspath = normalize_src(p, src)
            if not abspath or not abspath.exists() or not abspath.is_file():
                return tag

            # Skip if already in optimized local naming
            if '/assets/local-hero/' in src or '/assets/interventions/local/' in src:
                # force alt normalization anyway
                new_tag = set_attr(tag, 'alt', build_alt(service, city))
                new_tag = set_attr(new_tag, 'loading', 'lazy')
                new_tag = set_attr(new_tag, 'decoding', 'async')
                if new_tag != tag:
                    changed = True
                return new_tag

            context = SERVICE_CONTEXT.get(service, 'intervention')
            filename = f"{service}-{city}-{context}.webp"
            dst = INTERVENTION_DIR / filename

            # avoid collisions by suffix
            n = 2
            while dst.exists() and dst.stat().st_size > 0:
                # if same source already processed, reuse
                break
            im = Image.open(abspath).convert('RGB')
            im = ImageOps.exif_transpose(im)
            # preserve ratio but cap width to 1400
            maxw = 1400
            if im.width > maxw:
                nh = int(im.height * (maxw / im.width))
                im = im.resize((maxw, nh), Image.LANCZOS)
            im.save(dst, 'WEBP', quality=80, method=6)

            rel = rel_from_page(p, dst)
            new_tag = set_attr(tag, 'src', rel)
            new_tag = set_attr(new_tag, 'alt', build_alt(service, city))
            new_tag = set_attr(new_tag, 'loading', 'lazy')
            new_tag = set_attr(new_tag, 'decoding', 'async')
            changed = True
            report['inline_images'].append({'page': str(p.relative_to(ROOT)), 'old_src': src, 'new_src': rel})
            return new_tag

        new_txt = IMG_TAG_RE.sub(repl, txt)
        if changed and new_txt != txt:
            p.write_text(new_txt, encoding='utf-8')

    # report
    (ROOT / 'assets' / 'cities' / 'seo-image-update-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

if __name__ == '__main__':
    main()
