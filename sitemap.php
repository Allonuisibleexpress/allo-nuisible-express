<?php
declare(strict_types=1);

header('Content-Type: application/xml; charset=UTF-8');

$baseUrl = 'https://allonuisibleexpress.fr';
$root = __DIR__;

/**
 * Returns true if an HTML file is indexable.
 */
function isIndexableHtml(string $filePath): bool
{
    $content = @file_get_contents($filePath);
    if ($content === false) {
        return false;
    }
    return stripos($content, 'noindex') === false;
}

/**
 * Build URL from file path.
 */
function toPublicUrl(string $filePath, string $root, string $baseUrl): ?string
{
    $relative = ltrim(str_replace($root, '', $filePath), '/');
    if ($relative === 'index.html') {
        return $baseUrl . '/';
    }
    if (substr($relative, -11) === '/index.html') {
        $dir = rtrim(dirname($relative), '/');
        return $baseUrl . '/' . $dir . '/';
    }
    if (substr($relative, -5) === '.html') {
        return $baseUrl . '/' . $relative;
    }
    return null;
}

$candidates = [];

// Root HTML pages
foreach (glob($root . '/*.html') ?: [] as $file) {
    $name = basename($file);
    if ($name === 'sitemap.xml') {
        continue;
    }
    $candidates[] = $file;
}

// First-level directory index pages (ex: /deratisation-thiais/index.html)
foreach (glob($root . '/*/index.html') ?: [] as $file) {
    $candidates[] = $file;
}

$entries = [];
$seen = [];

foreach ($candidates as $filePath) {
    if (!is_file($filePath)) {
        continue;
    }
    if (!isIndexableHtml($filePath)) {
        continue;
    }
    $url = toPublicUrl($filePath, $root, $baseUrl);
    if ($url === null || isset($seen[$url])) {
        continue;
    }
    $seen[$url] = true;
    $entries[] = [
        'loc' => $url,
        'lastmod' => gmdate('Y-m-d\TH:i:s\Z', (int)filemtime($filePath)),
    ];
}

usort($entries, static function (array $a, array $b): int {
    return strcmp($a['loc'], $b['loc']);
});

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
foreach ($entries as $entry) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($entry['loc'], ENT_XML1, 'UTF-8') . "</loc>\n";
    echo "    <lastmod>{$entry['lastmod']}</lastmod>\n";
    echo "  </url>\n";
}
echo "</urlset>\n";

