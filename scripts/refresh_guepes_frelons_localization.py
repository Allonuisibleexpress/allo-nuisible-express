#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

CITY = {
    "antony": {
        "name": "Antony",
        "loc": "à Antony",
        "cp": "92160",
        "around": "autour d'Antony",
        "q": ["Centre-ville", "La Croix-de-Berny", "Fontaine-Michalon", "Les Rabats"],
        "places": "gares d'Antony et Croix-de-Berny, parc Heller, secteur commerçant Aristide-Briand",
    },
    "arcueil": {
        "name": "Arcueil",
        "loc": "à Arcueil",
        "cp": "94110",
        "around": "autour d'Arcueil",
        "q": ["Laplace", "Jules Ferry", "Le Plateau", "Le Coteau"],
        "places": "RER Laplace, parc du Coteau, rues commerçantes, établissements scolaires",
    },
    "clamart": {
        "name": "Clamart",
        "loc": "à Clamart",
        "cp": "92140",
        "around": "autour de Clamart",
        "q": ["Centre", "Petit-Clamart", "Jardin Parisien", "Percy-Schneider"],
        "places": "gare de Clamart, parc Maison Blanche, zones pavillonnaires du Petit-Clamart",
    },
    "gentilly": {
        "name": "Gentilly",
        "loc": "à Gentilly",
        "cp": "94250",
        "around": "autour de Gentilly",
        "q": ["Plateau Mazagran", "Victor Hugo", "Chaperon Vert", "Centre-ville"],
        "places": "RER Gentilly, parc du Chaperon Vert, écoles et rues à fort passage",
    },
    "le-kremlin-bicetre": {
        "name": "Le Kremlin-Bicêtre",
        "loc": "au Kremlin-Bicêtre",
        "cp": "94270",
        "around": "autour du Kremlin-Bicêtre",
        "q": ["Mairie", "Les Coquettes", "Le Fort", "Centre-ville"],
        "places": "avenue de Fontainebleau, parc Pinel, zones commerçantes et copropriétés anciennes",
    },
    "versailles": {
        "name": "Versailles",
        "loc": "à Versailles",
        "cp": "78000",
        "around": "autour de Versailles",
        "q": ["Notre-Dame", "Saint-Louis", "Montreuil", "Porchefontaine"],
        "places": "gares Versailles-Chantiers et Rive-Gauche, parc du Château, rues commerçantes",
    },
}

SERVICE = {
    "guepes": {
        "label": "guêpes",
        "cap": "Guêpes",
        "action": "destruction de nids de guêpes",
        "risk": "piqûres multiples et réactions allergiques lors des passages près des terrasses, jardins et accès d'immeubles",
        "faq": [
            ("Qui appeler en urgence pour un nid de guêpes ?", "Une équipe locale formée à la destruction sécurisée intervient rapidement après évaluation du risque."),
            ("Faut-il quitter le logement pendant le traitement ?", "Le plus souvent non: un périmètre est mis en place autour du nid et les zones sensibles sont sécurisées."),
            ("Combien de temps dure une intervention guêpes ?", "Selon l'accès et la hauteur, l'opération prend en général de 30 minutes à 1h30 avec contrôle visuel en fin de passage."),
            ("Un second passage est-il nécessaire ?", "Il peut être conseillé si l'activité reste visible ou si la configuration du site nécessite un contrôle complémentaire."),
        ],
    },
    "frelons": {
        "label": "frelons",
        "cap": "Frelons",
        "action": "destruction de nids de frelons",
        "risk": "risque de piqûres plus sévères, notamment près des haies, toitures et zones de circulation familiale",
        "faq": [
            ("Qui contacter pour un nid de frelons près d'une habitation ?", "Un professionnel équipé pour les interventions en hauteur traite le foyer après mise en sécurité du périmètre."),
            ("Les frelons sont-ils plus dangereux que les guêpes ?", "Le comportement défensif est plus marqué près du nid; la gestion doit être rapide et encadrée."),
            ("Peut-on traiter soi-même un nid en façade ou toiture ?", "Ce n'est pas recommandé: le risque de dispersion et de piqûres augmente sans matériel adapté."),
            ("Quel délai d'intervention en cas d'urgence ?", "Selon la disponibilité et le niveau de risque, un passage prioritaire est organisé avec protocole de sécurité."),
        ],
    },
}


def build_faq(city_name: str, service_key: str):
    city_slug = next((k for k, v in CITY.items() if v["name"] == city_name), None)
    city_loc = CITY[city_slug]["loc"] if city_slug else f"à {city_name}"
    s = SERVICE[service_key]
    items = []
    for q, a in s["faq"]:
        q_clean = q.strip()
        if " à " not in q_clean.lower():
            q_clean = q_clean.rstrip(" ?") + f" {city_loc} ?"
        items.append(f'<h3 style="margin:10px 0 6px;font-size:21px;">{q_clean}</h3>\n  <p style="margin:0 0 8px;font-size:17px;line-height:1.6;">{a}</p>\n  <p style="margin:0;font-size:17px;line-height:1.6;">Chaque situation est validée sur place selon l\'accès, la hauteur et l\'exposition des occupants.</p>')
    return (
        f'<section style="background:#fff;border:1px solid #ececec;border-radius:14px;padding:20px;margin:0 0 14px;"><h2 style="margin:0 0 12px;font-size:28px;line-height:1.2;">Mini FAQ locale {city_name}</h2>'
        + "\n\n".join(items)
        + "\n\n</section>"
    )


def build_local_chunk(city_slug: str, service_key: str):
    c = CITY[city_slug]
    s = SERVICE[service_key]
    q1, q2, q3, q4 = c["q"]
    city = c["name"]
    city_loc = c["loc"]
    cp = c["cp"]

    if service_key == "guepes":
        neigh_tpl = [
            f"<h2>Infestation de {s['label']} dans le quartier {q1}</h2><p>Dans {q1}, les appels concernent surtout des nids actifs près des avancées de toit, des terrasses et des coffres de volets. Les zones mixtes (immeubles, pavillons, commerces) demandent une gestion fine des flux piétons. La sécurisation du passage est prioritaire avant toute action, notamment près des écoles et des entrées d'immeuble.</p>",
            f"<h2>Présence de {s['label']} dans le secteur {q2}</h2><p>Le secteur {q2} présente des habitats variés où les guêpes exploitent les haies, annexes et abris légers. Les interventions sont ajustées selon la hauteur, l'accessibilité et l'usage des lieux (restauration, commerces, cours résidentielles). Cette adaptation évite les reprises rapides pendant les périodes chaudes.</p>",
            f"<h2>Traitement local dans le quartier {q3}</h2><p>Dans {q3}, les contraintes d'accès (ruelles, stationnement serré, cours fermées) imposent un balisage rigoureux. Le protocole combine repérage visuel, traitement ciblé et contrôle des points périphériques. L'objectif est de sécuriser durablement l'environnement immédiat des occupants et des riverains.</p>",
            f"<h2>Intervention ciblée autour de {q4}</h2><p>Le quartier {q4} cumule des jardins, dépendances et façades exposées où l'activité peut passer inaperçue au départ. Un diagnostic local complet permet de traiter le foyer principal puis de vérifier les zones satellites. Cette méthode réduit le risque de retour au cours de la même saison.</p>",
        ]
        intro1 = "Les demandes liées aux guêpes concernent surtout les terrasses, jardins, annexes et zones de passage autour des logements et des commerces. Le niveau d'urgence dépend de la proximité immédiate avec les occupants."
        intro2 = f"Le travail terrain tient compte de {c['places']} pour sécuriser les accès avant traitement, puis contrôler les points de reprise sur les structures extérieures."
        why = "Leur présence augmente avec les sources sucrées, les déchets alimentaires, les haies denses, les toitures abritées et les zones de restauration à forte fréquentation."
        risk = "Le risque principal reste la piqûre en zone fréquentée, avec aggravation possible chez les personnes sensibles ou en cas de nid proche d'une entrée."
        treatment = "Le traitement repose sur la neutralisation ciblée du nid, la sécurisation du périmètre, puis un contrôle de stabilité pour éviter la réactivation."
        card1 = "Les cas traités montrent des foyers souvent installés sur des volumes légers (auvents, coffres, annexes). La priorité est d'écarter le risque immédiat sans bloquer l'activité du site."
        card2 = "La priorisation se fait selon l'exposition humaine: écoles, entrées d'immeubles, terrasses, commerces. Les zones secondaires sont traitées dans la continuité du passage."
    else:
        neigh_tpl = [
            f"<h2>Infestation de {s['label']} dans le quartier {q1}</h2><p>Dans {q1}, les interventions concernent régulièrement des nids positionnés en hauteur sur charpentes, arbres, sous-toitures et annexes de jardin. L'évaluation du danger est renforcée près des axes de circulation, des établissements scolaires et des entrées de copropriété.</p>",
            f"<h2>Présence de {s['label']} dans le secteur {q2}</h2><p>Le secteur {q2} combine bâtiments collectifs, maisons et zones commerciales. Les frelons s'installent dans des volumes peu perturbés et exigent une intervention encadrée avec contrôle des accès techniques. La procédure varie selon la hauteur et la possibilité d'approche sécurisée.</p>",
            f"<h2>Traitement local dans le quartier {q3}</h2><p>Dans {q3}, les contraintes d'accès peuvent être fortes: cours fermées, toits difficiles, passages étroits. L'équipe prépare un balisage strict avant traitement et vérifie les points périphériques où des individus restent actifs. Cette rigueur réduit les risques pendant et après l'opération.</p>",
            f"<h2>Intervention ciblée autour de {q4}</h2><p>Le quartier {q4} présente des zones végétalisées et des dépendances qui favorisent des implantations discrètes. Le diagnostic complet permet d'identifier le nid principal, d'évaluer l'exposition des occupants et de mettre en place un passage complémentaire si nécessaire.</p>",
        ]
        intro1 = "Les interventions frelons concernent prioritairement les sites à risque élevé: façades, toitures, haies, arbres et dépendances proches des zones de vie."
        intro2 = f"Le protocole opérationnel s'appuie sur les contraintes locales ({c['places']}) pour sécuriser d'abord les circulations, puis traiter le foyer actif en limitant l'exposition."
        why = "Le développement est favorisé par les volumes en hauteur, les zones végétalisées, les structures abritées et certains contextes de chantier ou d'humidité persistante."
        risk = "L'enjeu majeur est la gravité potentielle des piqûres, surtout en cas d'approche involontaire du nid ou de passage répété dans la zone d'activité."
        treatment = "L'intervention combine diagnostic de danger, sécurisation du site, traitement en hauteur si requis et contrôle final pour vérifier la baisse d'activité."
        card1 = "Les dossiers frelons demandent souvent un matériel d'accès spécifique et une lecture précise du comportement du foyer. Le but est de traiter sans exposition prolongée des occupants."
        card2 = "La priorisation est guidée par la proximité des zones de vie, l'intensité de l'activité observée et la complexité d'accès. Cette méthode évite les actions partielles."

    return f'''<figure class="local-seo-figure"><img src="../assets/cities/{city_slug}-hero.jpg" alt="{s['action']} {city}" loading="lazy"><figcaption>{s['cap']} {city} ({cp}) : intervention en habitat, commerces et espaces extérieurs</figcaption></figure>

<p>{intro1}</p>
<p>{intro2}</p>

{''.join(neigh_tpl)}
<h2>Pourquoi les {s['label']} s'installent {city_loc}</h2>
<p>{why}</p>
<h2>Risques liés aux {s['label']} {city_loc}</h2>
<p>{risk}</p>
<h2>Traitement professionnel contre les {s['label']} {city_loc}</h2>
<p>{treatment}</p>

<section class="card" data-rich-local>
  <h2>{s['action'].capitalize()} {city_loc} : analyse locale avancée</h2><p>{card1}</p><p>Cette méthode améliore la lisibilité pour le client et renforce l\'efficacité opérationnelle, notamment dans les zones où l\'accès est contraint.</p>
</section>

<section class="card" data-rich-local>
  <h2>Quartiers sensibles {city_loc} : priorisation opérationnelle</h2><p>{card2}</p><p>Ce découpage par micro-secteur limite les retours rapides et évite les interventions dispersées sans logique de suivi.</p>
</section>

<section class="card" data-rich-local>
  <h2>Ce que nous contrôlons systématiquement</h2>
  <ul>
    <li>Toitures, avancées, coffres de volets, haies et dépendances.</li>
    <li>Accès techniques: caves, parkings, cours intérieures, faux plafonds.</li>
    <li>Contexte d\'usage: immeubles, pavillons, commerces, restaurants, hôtels.</li>
    <li>Flux autour des gares, écoles, parcs, rues commerçantes et marchés.</li>
    <li>Niveau de risque pour occupants, enfants, animaux et riverains.</li>
  </ul>
  <p>Le contrôle complet permet d\'obtenir un résultat plus stable et de réduire les récidives liées aux points non traités.</p>
</section>

<section class="card" data-rich-local>
  <h2>Plan d'action recommandé pour {s['label']} {city_loc}</h2>
  <ol>
    <li>Diagnostic initial et cartographie des zones actives.</li>
    <li>Sécurisation des accès et des circulations sensibles.</li>
    <li>Traitement ciblé selon hauteur, accessibilité et exposition.</li>
    <li>Contrôle final et consignes de prévention immédiates.</li>
    <li>Passage complémentaire si activité persistante.</li>
  </ol>
  <p>Ce parcours reste cohérent d\'une ville à l\'autre, avec une adaptation locale des accès, des contraintes de terrain et de la saisonnalité.</p>
</section>
'''


def update_schema_faq(text: str, city: str, service_key: str):
    city_slug = next((k for k, v in CITY.items() if v["name"] == city), None)
    city_loc = CITY[city_slug]["loc"] if city_slug else f"à {city}"
    s = SERVICE[service_key]
    qa = []
    for q, a in s['faq']:
        q_clean = q.strip()
        if " à " not in q_clean.lower():
            q_clean = q_clean.rstrip(" ?") + f" {city_loc} ?"
        qa.append('{"@type":"Question","name":"'+q_clean+'","acceptedAnswer":{"@type":"Answer","text":"'+a+'"}}')
    new_main = '"mainEntity": [\n          ' + ',\n          '.join(qa) + '\n        ]'
    text = re.sub(r'"mainEntity": \[.*?\n\s*\]', new_main, text, count=1, flags=re.S)
    return text


def process(file_path: Path, city_slug: str, service_key: str):
    txt = file_path.read_text(encoding='utf-8')
    city = CITY[city_slug]['name']

    # FAQ section replacement
    faq_new = build_faq(city, service_key)
    txt = re.sub(
        r'<section style="background:#fff;border:1px solid #ececec;border-radius:14px;padding:20px;margin:0 0 14px;">\s*<h2 style="margin:0 0 12px;font-size:28px;line-height:1.2;">Mini FAQ locale .*?</section>',
        faq_new,
        txt,
        count=1,
        flags=re.S,
    )

    # Local content replacement between figure and interventions block
    local_new = build_local_chunk(city_slug, service_key)
    txt = re.sub(
        r'<figure class="local-seo-figure">.*?<h2>Interventions et villes proches</h2>',
        local_new + '\n<h2>Interventions et villes proches</h2>',
        txt,
        count=1,
        flags=re.S,
    )

    # Small grammar cleanup
    txt = txt.replace('autour de Arcueil', "autour d'Arcueil")
    txt = txt.replace("à l'échelle de Antony", "à l'échelle d'Antony")

    # schema FAQ
    txt = update_schema_faq(txt, city, service_key)

    file_path.write_text(txt, encoding='utf-8')


def main():
    targets = []
    for service_key in ['guepes', 'frelons']:
        for city_slug in CITY.keys():
            p = ROOT / f'{service_key}-{city_slug}' / 'index.html'
            if p.exists():
                targets.append((p, city_slug, service_key))

    for p, city_slug, service_key in targets:
        process(p, city_slug, service_key)
        print('updated', p)

if __name__ == '__main__':
    main()
