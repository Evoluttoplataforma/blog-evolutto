import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = './src/content/blog';
const OUTPUT_FILE = './src/data/articles.json';

const generateExcerpt = (content, length = 160) => {
    if (!content) return '';

    // Remove markdown links, images, bold, audio tags, and other syntax
    const cleanContent = content
        .replace(/Mini ?Podcast/gi, '') // Remove MiniPodcast or Mini Podcast
        .replace(/\\?\[audio.*?\\?\]/gi, '') // Remove audio tags (handling possible escapes)
        .replace(/\\?\[\/audio\\?\]/gi, '')
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
        .replace(/[#*`_~]/g, '') // Remove simple formatting
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    if (cleanContent.length <= length) return cleanContent;
    return cleanContent.substring(0, length).trim() + '...';
};

function getArticles() {
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`Directory ${CONTENT_DIR} not found`);
        return [];
    }

    const articles = [];
    const items = fs.readdirSync(CONTENT_DIR);

    for (const item of items) {
        const itemPath = path.join(CONTENT_DIR, item);

        if (fs.statSync(itemPath).isDirectory()) {
            const indexPath = path.join(itemPath, 'index.md');
            if (fs.existsSync(indexPath)) {
                const fileContent = fs.readFileSync(indexPath, 'utf-8');
                const { data, content } = matter(fileContent);

                // Skip test articles or articles with very little content
                if (data.title?.toLowerCase().includes('teste') || content.trim().length < 50) {
                    continue;
                }

                articles.push({
                    id: item,
                    slug: item,
                    title: data.title || item,
                    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
                    categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : ['geral']),
                    coverImage: data.coverImage || '',
                    excerpt: data.excerpt || generateExcerpt(content),
                    content: content
                });
            }
        }
    }

    // Sort by date descending
    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

try {
    const articles = getArticles();
    if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
        fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
    console.log(`Successfully generated ${articles.length} articles at ${OUTPUT_FILE}`);
} catch (error) {
    console.error('Error generating articles JSON:', error);
}
