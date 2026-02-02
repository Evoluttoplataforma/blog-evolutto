import fs from 'fs';
import path from 'path';

const ARTICLES_FILE = './src/data/articles.json';
const OUTPUT_FILE = './public/sitemap.xml';
const BASE_URL = 'https://blog.evolutto.com.br'; // Altere para o domínio final

function generateSitemap() {
    try {
        if (!fs.existsSync(ARTICLES_FILE)) {
            console.error(`File ${ARTICLES_FILE} not found`);
            return;
        }

        const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
        const date = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

        articles.forEach(article => {
            const lastMod = article.date ? article.date.split('T')[0] : date;
            xml += `
  <url>
    <loc>${BASE_URL}/article/${article.slug || article.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        xml += '\n</urlset>';

        if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
            fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, xml);
        console.log(`Successfully generated sitemap.xml with ${articles.length + 1} URLs at ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
}

generateSitemap();
