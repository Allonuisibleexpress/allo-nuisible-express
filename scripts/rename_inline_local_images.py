#!/usr/bin/env python3
import re
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / 'assets' / 'interventions' / 'local'
OUT_DIR.mkdir(parents=True, exist_ok=True)

services = ['deratisation','rats','cafards','punaises-de-lit','souris','guepes','frelons','frelon-asiatique','depigeonnage','chenille-processionnaire','acariens','xylophages','mouches','fourmis']
SERVICE_RE = '(?:' + '|'.join(map(re.escape, services)) + ')'
PAT_DIR = re.compile(rf'^({SERVICE_RE})-(.+)$')
PAT_FILE = re.compile(rf'^({SERVICE_RE})-(.+)\\.html$')

CITY_CP = {'antony':'92160','arcueil':'94110','cachan':'94230','chatenay-malabry':'92290','chevilly-larue':'94550','choisy-le-roi':'94600','clamart':'92140','fresnes':'94260','gentilly':'94250','le-kremlin-bicetre':'94270','lhay-les-roses':'94240','orly':'94310','rungis':'94150','thiais':'94320','versailles':'78000','villejuif':'94800','vitry-sur-seine':'94400'}
CITY_NAME = {'antony':'Antony','arcueil':'Arcueil','cachan':'Cachan','chatenay-malabry':'Châtenay-Malabry','chevilly-larue':'Chevilly-Larue','choisy-le-roi':'Choisy-le-Roi','clamart':'Clamart','fresnes':'Fresnes','gentilly':'Gentilly','le-kremlin-bicetre':'Le Kremlin-Bicêtre','lhay-les-roses':"L'Haÿ-les-Roses",'orly':'Orly','rungis':'Rungis','thiais':'Thiais','versailles':'Versailles','villejuif':'Villejuif','vitry-sur-seine':'Vitry-sur-Seine'}
SERVICE_LABEL = {'deratisation':'rongeurs','rats':'rats','cafards':'cafards','punaises-de-lit':'punaises de lit','souris':'souris','guepes':'guêpes','frelons':'frelons','frelon-asiatique':'frelon asiatique','depigeonnage':'pigeons','chenille-processionnaire':'chenilles processionnaires','acariens':'acariens','xylophages':'xylophages','mouches':'mouches','fourmis':'fourmis'}
SERVICE_CONTEXT = {'deratisation':'cave','rats':'cave','cafards':'cuisine','punaises-de-lit':'chambre','souris':'vide-sanitaire','guepes':'toiture','frelons':'jardin','frelon-asiatique':'jardin','depigeonnage':'toiture','chenille-processionnaire':'jardin','acariens':'chambre','xylophages':'charpente','mouches':'cuisine','fourmis':'terrasse'}

IMG_TAG_RE = re.compile(r'<img\b[^>]*>', re.I)
SRC_RE = re.compile(r'src=["\']([^"\']+)["\']', re.I)

def detect(path: Path):
    m = PAT_DIR.match(path.parent.name)
    if m:
        return m.group(1), m.group(2)
    m = PAT_FILE.match(path.name)
    if m:
        return m.group(1), m.group(2)
    return None, None

def pages():
    out=[]
    for p in ROOT.glob('**/index.html'):
        s,c=detect(p)
        if s and c: out.append((p,s,c))
    for p in ROOT.glob('*.html'):
        s,c=detect(p)
        if s and c: out.append((p,s,c))
    return out

def set_attr(tag, name, value):
    pat = re.compile(rf'\s{name}=["\'][^"\']*["\']', re.I)
    if pat.search(tag):
        return pat.sub(f' {name}="{value}"', tag)
    return tag[:-1] + f' {name}="{value}">' if tag.endswith('>') else tag

def src_to_abs(page, src):
    if src.startswith('http://') or src.startswith('https://'):
        return None
    pure = src.split('?',1)[0].split('#',1)[0]
    return (page.parent / pure).resolve()

def rel_from(page, target):
    rel = target.relative_to(ROOT)
    depth = len(page.relative_to(ROOT).parents)-1
    return ('../' * depth) + str(rel).replace('\\','/')

report=[]
for p,s,c in pages():
    txt = p.read_text(encoding='utf-8', errors='ignore')
    changed=[False]

    def repl(m):
        tag=m.group(0)
        sm=SRC_RE.search(tag)
        if not sm:
            return tag
        src=sm.group(1)
        if 'logo.png' in src.lower():
            return tag
        abs_path=src_to_abs(p,src)
        if not abs_path or not abs_path.exists() or not abs_path.is_file():
            return tag

        context=SERVICE_CONTEXT.get(s,'intervention')
        dst=OUT_DIR / f'{s}-{c}-{context}.webp'
        if not dst.exists():
            im=Image.open(abs_path)
            im=ImageOps.exif_transpose(im).convert('RGB')
            if im.width>1400:
                nh=int(im.height*(1400/im.width))
                im=im.resize((1400,nh), Image.LANCZOS)
            im.save(dst,'WEBP',quality=80,method=6)

        city=CITY_NAME.get(c,c.replace('-',' ').title())
        cp=CITY_CP.get(c,'')
        label=SERVICE_LABEL.get(s,s)
        alt=f'Infestation de {label} dans une {context} à {city}' + (f' ({cp})' if cp else '')
        new_src=rel_from(p,dst)

        new=tag
        new=set_attr(new,'src',new_src)
        new=set_attr(new,'alt',alt)
        new=set_attr(new,'loading','lazy')
        new=set_attr(new,'decoding','async')
        if new!=tag:
            changed[0]=True
            report.append({'page':str(p.relative_to(ROOT)),'old':src,'new':new_src,'alt':alt})
        return new

    new_txt=IMG_TAG_RE.sub(repl,txt)
    if changed[0]:
        p.write_text(new_txt,encoding='utf-8')

(ROOT/'assets'/'cities'/'inline-image-rename-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('updated',len(report),'img refs')
