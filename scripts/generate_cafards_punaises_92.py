#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

CITY_CONFIG = {
    "antony": {
        "name": "Antony",
        "cp": "92160",
        "around": "autour d'Antony",
        "zones": ["Centre-ville", "La Croix-de-Berny", "Fontaine-Michalon", "Les Rabats"],
        "local_text": "autour de la gare d'Antony, de la gare Croix-de-Berny, du parc Heller, des écoles du centre et des axes commerçants",
        "local_text_2": "les secteurs proches de la gare d'Antony, du parc Heller, des groupes scolaires et des pôles commerciaux de l'avenue Aristide-Briand",
    },
    "clamart": {
        "name": "Clamart",
        "cp": "92140",
        "around": "autour de Clamart",
        "zones": ["Centre", "Petit-Clamart", "Jardin Parisien", "Percy-Schneider"],
        "local_text": "autour de la gare de Clamart, du bois de Clamart, des écoles de quartier et des zones commerçantes du centre",
        "local_text_2": "les secteurs de la gare de Clamart, du parc Maison Blanche, des zones pavillonnaires du Petit-Clamart et des commerces de proximité",
    },
    "chatenay-malabry": {
        "name": "Châtenay-Malabry",
        "cp": "92290",
        "around": "autour de Châtenay-Malabry",
        "zones": ["La Vallée", "Butte Rouge", "Robinson", "Croix Blanche"],
        "local_text": "autour de la gare Robinson, de l'Arboretum de la Vallée-aux-Loups, des établissements scolaires et des rues commerçantes du centre",
        "local_text_2": "les secteurs proches de Robinson, du parc de la Vallée-aux-Loups, des résidences de la Butte Rouge et des pôles de commerces de quartier",
    },
}

SERVICE_CONFIG = {
    "cafards": {
        "src": ROOT / "cafards-arcueil" / "index.html",
        "h1": "Cafards à {city} ({cp}) : Désinsectisation rapide",
        "title": "Cafards à {city} ({cp}) | Désinsectisation Rapide 7j/7",
        "meta_desc": "Désinsectisation des cafards à {city} ({cp}) : désinsectisation ciblée, devis gratuit et protocole adapté aux immeubles, restaurants et commerces.",
        "service_name": "Désinsectisation cafards",
        "service_type": "Traitement anti-cafards par gel et protocoles ciblés",
        "offer_name": "Désinsectisation cafards à {city}",
        "why": "Pourquoi les cafards apparaissent à {city}",
        "risk": "Dangers des cafards à {city}",
        "treat": "Traitement anti cafards à {city}",
    },
    "punaises-de-lit": {
        "src": ROOT / "punaises-de-lit-arcueil" / "index.html",
        "h1": "Punaises de lit à {city} ({cp}) : Éradication complète",
        "title": "Punaises de lit à {city} ({cp}) | Traitement Professionnel",
        "meta_desc": "Traitement des punaises de lit à {city} ({cp}) : intervention rapide, devis gratuit et protocole complet avec traitement thermique selon le cas.",
        "service_name": "Traitement punaises de lit",
        "service_type": "Traitement thermique, cryogénie et contrôle post-intervention",
        "offer_name": "Traitement punaises de lit à {city}",
        "why": "Pourquoi les punaises de lit apparaissent à {city}",
        "risk": "Risques sanitaires liés aux punaises de lit à {city}",
        "treat": "Traitement professionnel contre les punaises de lit à {city}",
    }
}


def replace_grammar(text: str, city_name: str):
    if city_name[0].lower() in "aeiouyàâéèêëîïôöùûüœ":
        text = re.sub(rf"\bde {re.escape(city_name)}\b", f"d'{city_name}", text)
    return text


def generate_page(service_slug: str, city_slug: str, cfg: dict, scfg: dict):
    dest_dir = ROOT / f"{service_slug}-{city_slug}"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_file = dest_dir / "index.html"

    t = scfg["src"].read_text(encoding="utf-8")

    city = cfg["name"]
    cp = cfg["cp"]

    # generic city/slug replacements from Arcueil template
    t = t.replace("arcueil", city_slug)
    t = t.replace("Arcueil", city)
    t = t.replace("94110", cp)

    # head tags
    t = re.sub(r"<title>.*?</title>", f"<title>{scfg['title'].format(city=city, cp=cp)}</title>", t, count=1, flags=re.S)
    t = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{scfg["meta_desc"].format(city=city, cp=cp)}">', t, count=1)
    t = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{scfg["title"].format(city=city, cp=cp)}">', t, count=1)
    t = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{scfg["meta_desc"].format(city=city, cp=cp)}">', t, count=1)
    t = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{scfg["title"].format(city=city, cp=cp)}">', t, count=1)
    t = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{scfg["meta_desc"].format(city=city, cp=cp)}">', t, count=1)

    # schema service strings
    t = re.sub(r'"name": "(Désinsectisation cafards|Traitement punaises de lit)"', f'"name": "{scfg["service_name"]}"', t, count=1)
    t = re.sub(r'"serviceType": "[^"]+"', f'"serviceType": "{scfg["service_type"]}"', t, count=1)
    t = re.sub(r'"name": "(Désinsectisation cafards à [^"]+|Traitement punaises de lit à [^"]+)"', f'"name": "{scfg["offer_name"].format(city=city)}"', t, count=1)

    # H1
    t = re.sub(r'<h1>.*?</h1>', f'<h1>{scfg["h1"].format(city=city, cp=cp)}</h1>', t, count=1, flags=re.S)

    # intro local paragraph upgrades
    t = t.replace(
        f"les abords de gare, les rues commerçantes, les écoles, les parcs et les marchés concentrent des conditions favorables",
        f"{cfg['local_text']} concentrent des conditions favorables",
    )
    t = t.replace(
        f"les abords de gare, les rues commerçantes, les écoles, les parcs et les marchés constituent des points de vigilance permanents.",
        f"{cfg['local_text_2']} constituent des points de vigilance permanents.",
    )

    # neighborhood swaps
    olds = ["Laplace", "Jules Ferry", "Le Plateau", "Le Coteau"]
    for o, n in zip(olds, cfg["zones"]):
        t = t.replace(o, n)

    # h2 labels by service
    t = re.sub(r"Pourquoi les [^<]+ à " + re.escape(city), scfg["why"].format(city=city), t, count=1)
    t = re.sub(r"(Dangers des cafards|Risques sanitaires liés aux punaises de lit) à " + re.escape(city), scfg["risk"].format(city=city), t, count=1)
    t = re.sub(r"(Traitement anti cafards|Traitement professionnel contre les punaises de lit) à " + re.escape(city), scfg["treat"].format(city=city), t, count=1)

    # internal links block
    links = []
    if (ROOT / f"deratisation-{city_slug}" / "index.html").exists():
        links.append(f'<a href="/deratisation-{city_slug}">Dératisation {city} ({cp})</a>')
    if (ROOT / f"guepes-{city_slug}" / "index.html").exists():
        links.append(f'<a href="/guepes-{city_slug}">Guêpes {city}</a>')
    if (ROOT / f"frelons-{city_slug}" / "index.html").exists():
        links.append(f'<a href="/frelons-{city_slug}">Frelons {city}</a>')
    links.append(f'<a href="/{service_slug}-{city_slug}">{"Cafards" if service_slug=="cafards" else "Punaises de lit"} {city}</a>')
    links_line = "<p>" + " | ".join(links) + "</p>"

    t = re.sub(r"<h2>Interventions et villes proches</h2>\s*<p>.*?</p>", f"<h2>Interventions et villes proches</h2>\n{links_line}", t, count=1, flags=re.S)
    t = re.sub(r"Intervention locale autour de [^:]+:", f"Intervention locale {cfg['around']}:", t)

    # grammar fixes
    t = replace_grammar(t, city)

    # ensure canonical self and no noindex
    if 'noindex' in t.lower():
        t = t.replace('noindex', 'index')

    dest_file.write_text(t, encoding="utf-8")


def main():
    for city_slug, cfg in CITY_CONFIG.items():
        for service_slug, scfg in SERVICE_CONFIG.items():
            generate_page(service_slug, city_slug, cfg, scfg)


if __name__ == "__main__":
    main()
