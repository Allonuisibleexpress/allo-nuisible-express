<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

$baseUrl = 'https://allonuisibleexpress.fr';
$root = __DIR__;

/**
 * Read file safely.
 */
function readFileSafe(string $path): string
{
    $content = @file_get_contents($path);
    return $content === false ? '' : $content;
}

/**
 * Normalize accents and separators for slug extraction.
 */
function normalizeCity(string $raw): string
{
    $city = trim($raw);
    $city = str_replace('-', ' ', $city);
    $city = preg_replace('/\s+/', ' ', $city) ?? $city;
    return mb_convert_case($city, MB_CASE_TITLE, 'UTF-8');
}

/**
 * Extract first regex match.
 */
function firstMatch(string $pattern, string $subject): string
{
    if (preg_match($pattern, $subject, $m) === 1) {
        return trim(html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    }
    return '';
}

/**
 * Count words from html content.
 */
function countWordsFromHtml(string $html): int
{
    $text = strip_tags($html);
    $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/[^\p{L}\p{N}\s-]+/u', ' ', $text) ?? $text;
    $words = preg_split('/\s+/u', trim($text)) ?: [];
    return count(array_filter($words, static fn(string $w): bool => $w !== ''));
}

/**
 * Build absolute URL.
 */
function toAbsolute(string $path, string $baseUrl): string
{
    if ($path === '' || $path[0] !== '/') {
        $path = '/' . ltrim($path, '/');
    }
    return rtrim($baseUrl, '/') . $path;
}

$localPages = [];
$localDirs = glob($root . '/deratisation-*/index.html') ?: [];
sort($localDirs);

$knownNuisibles = [
    'rats',
    'souris',
    'cafards',
    'punaises',
    'guepes',
    'frelons',
    'acariens',
    'mouches',
    'fourmis',
    'xylophage',
    'chenilles',
    'depigeonnage',
    'diogene',
];

foreach ($localDirs as $filePath) {
    $dirName = basename((string)dirname($filePath)); // deratisation-ville
    $slug = str_replace('deratisation-', '', $dirName);
    $city = normalizeCity($slug);
    $html = readFileSafe($filePath);

    $title = firstMatch('/<title>(.*?)<\/title>/is', $html);
    $h1 = firstMatch('/<h1[^>]*>(.*?)<\/h1>/is', $html);
    $metaDescription = firstMatch('/<meta\s+name="description"\s+content="(.*?)"/is', $html);
    $postalCode = firstMatch('/\b\((\d{5})\)\b/u', $html);
    $wordCount = countWordsFromHtml($html);
    $lastMod = gmdate('Y-m-d\TH:i:s\Z', (int)@filemtime($filePath));

    preg_match_all('/href="(\/deratisation-[^"]+\/?)"/i', $html, $links);
    $linksTo = array_values(array_unique(array_map(static function (string $l): string {
        $clean = rtrim($l, '/');
        return ltrim($clean, '/');
    }, $links[1] ?? [])));
    sort($linksTo);

    $keywordsDetected = [];
    $lower = mb_strtolower($html, 'UTF-8');
    foreach ($knownNuisibles as $k) {
        if (str_contains($lower, $k)) {
            $keywordsDetected[] = $k;
        }
    }

    $localPages[] = [
        'slug' => $slug,
        'city' => $city,
        'url' => toAbsolute('/' . $dirName . '/', $baseUrl),
        'file' => $dirName . '/index.html',
        'postal_code' => $postalCode,
        'title' => $title,
        'meta_description' => $metaDescription,
        'h1' => trim(strip_tags($h1)),
        'word_count' => $wordCount,
        'keywords_detected' => $keywordsDetected,
        'links_to_local_pages' => $linksTo,
        'lastmod' => $lastMod,
    ];
}

// Build derived maillage map.
$maillage = [];
foreach ($localPages as $p) {
    $from = (string)$p['slug'];
    $targets = [];
    foreach ((array)$p['links_to_local_pages'] as $targetPath) {
        if (str_starts_with($targetPath, 'deratisation-')) {
            $targets[] = str_replace('deratisation-', '', $targetPath);
        }
    }
    $targets = array_values(array_unique($targets));
    sort($targets);
    $maillage[$from] = ['links_to' => $targets];
}
ksort($maillage);

// Service pages available at root.
$servicePages = [
    '/deratisation.html',
    '/desinsectisation.html',
    '/desinfection.html',
    '/punaises.html',
    '/cafards.html',
    '/guepes.html',
    '/frelons.html',
    '/acariens.html',
    '/mouches.html',
    '/fourmis.html',
    '/xylophage.html',
    '/depigeonnage.html',
    '/chenilles.html',
    '/diogene.html',
    '/tarifs.html',
    '/contact.html',
    '/devis.html',
    '/blog.html',
];
$services = [];
foreach ($servicePages as $sp) {
    $exists = is_file($root . $sp);
    $services[] = [
        'url' => toAbsolute($sp, $baseUrl),
        'exists' => $exists,
    ];
}

// Hierarchy for quick restore.
$cities = array_map(static fn(array $p): string => (string)$p['slug'], $localPages);
sort($cities);

$output = [
    'version' => '2.0.0',
    'generated_at' => gmdate('Y-m-d\TH:i:s\Z'),
    'source' => 'seo-local-deratisation-94.php',
    'base_url' => $baseUrl,
    'rules' => [
        'no_noindex_on_production' => true,
        'dynamic_generation' => true,
        'scope' => 'seo local deratisation 94',
    ],
    'pages_locales_deratisation' => array_map(static fn(array $p): string => parse_url((string)$p['url'], PHP_URL_PATH) ?: '', $localPages),
    'local_pages_details' => $localPages,
    'maillage_interne' => $maillage,
    'seo_hierarchy' => [
        'deratisation' => [
            'val-de-marne' => $cities,
        ],
    ],
    'service_pages' => $services,
    'getLocalSEOStructure' => [
        'description' => 'Affiche les pages locales, le maillage interne, les services présents et la hiérarchie SEO locale.',
        'fields' => [
            'pages_locales_deratisation',
            'local_pages_details',
            'maillage_interne',
            'seo_hierarchy',
            'service_pages',
        ],
    ],
];

echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL;

