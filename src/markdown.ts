// Markdown loading and parsing
declare const marked: any;
declare const hljs: any;

export interface PostMetadata {
    title: string;
    date: string;
    category?: string;
    tags?: string[];
    description?: string;
    cover?: string;
}

export interface Post {
    id: string;
    metadata: PostMetadata;
    content: string;
    htmlContent?: string;
}

// Configure marked
if (typeof marked !== 'undefined') {
    marked.setOptions({
        highlight: function(code: string, lang: string) {
            if (lang && typeof hljs !== 'undefined' && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {
                    console.error('Highlight error:', err);
                }
            }
            return code;
        },
        breaks: true,
        gfm: true,
        headerIds: true,
        headerPrefix: 'heading-'
    });
}

export async function loadMarkdown(path: string): Promise<string> {
    try {
        const response = await fetch(path, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Failed to load ${path}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error loading markdown:', error);
        throw error;
    }
}

export function parseMarkdown(markdown: string): { metadata: PostMetadata; content: string } {
    // Parse frontmatter (YAML-style)
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    let metadata: PostMetadata = {
        title: 'Untitled',
        date: new Date().toISOString().split('T')[0]
    };
    
    let content = markdown;
    
    if (match) {
        const frontmatter = match[1];
        content = match[2];
        
        // Parse frontmatter fields
        frontmatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.slice(0, colonIndex).trim();
                const value = line.slice(colonIndex + 1).trim();
                
                if (key === 'title') {
                    metadata.title = value.replace(/^["']|["']$/g, '');
                } else if (key === 'date') {
                    metadata.date = value.replace(/^["']|["']$/g, '');
                } else if (key === 'category') {
                    metadata.category = value.replace(/^["']|["']$/g, '');
                } else if (key === 'description') {
                    metadata.description = value.replace(/^["']|["']$/g, '');
                } else if (key === 'cover') {
                    metadata.cover = value.replace(/^["']|["']$/g, '');
                } else if (key === 'tags') {
                    // Parse tags as array
                    const tagString = value.replace(/^\[|\]$/g, '');
                    metadata.tags = tagString.split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
                }
            }
        });
    }
    
    return { metadata, content };
}

export function markdownToHtml(markdown: string): string {
    if (typeof marked === 'undefined') {
        console.error('marked library not loaded');
        return markdown;
    }
    let html = marked.parse(markdown);
    // Add cache-busting to image/video src so edits show immediately
    const bust = `?t=${Date.now()}`;
    const bustSrc = (_m: string, pre: string, src: string, post: string) =>
        src.includes('?') ? `${pre}${src}&t=${Date.now()}${post}` : `${pre}${src}${bust}${post}`;
    html = html.replace(/(<img[^>]+src=["'])([^"']+)(["'][^>]*>)/gi, bustSrc);
    html = html.replace(/(<source[^>]+src=["'])([^"']+)(["'][^>]*>)/gi, bustSrc);
    html = html.replace(/(<video[^>]+src=["'])([^"']+)(["'][^>]*>)/gi, bustSrc);
    return html;
}

export async function loadPost(filename: string): Promise<Post> {
    const markdown = await loadMarkdown(`content/posts/${filename}`);
    const { metadata, content } = parseMarkdown(markdown);
    const htmlContent = markdownToHtml(content);
    
    return {
        id: filename.replace('.md', ''),
        metadata,
        content,
        htmlContent
    };
}

export function getPostExcerpt(content: string, maxLength: number = 200): string {
    const plainText = content.replace(/[#*`[\]()]/g, '').trim();
    if (plainText.length <= maxLength) {
        return plainText;
    }
    return plainText.slice(0, maxLength) + '...';
}

export interface Heading {
    level: number;
    text: string;
    id: string;
}

export function extractHeadings(markdown: string): Heading[] {
    const headings: Heading[] = [];
    const lines = markdown.split('\n');
    
    for (const line of lines) {
        // Match markdown headings (## Heading or # Heading)
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            // Only include level 2 (##) headings in TOC
            if (level === 2) {
                const text = match[2].trim();
                // Generate ID from text (similar to how marked does it)
                const id = generateHeadingId(text);
                headings.push({ level, text, id });
            }
        }
    }
    
    return headings;
}

export function generateHeadingId(text: string): string {
    // Remove markdown formatting (bold, italic, links, etc.)
    let cleanText = text
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
        .replace(/`([^`]+)`/g, '$1') // Remove code spans
        .trim();
    
    // Convert to lowercase, replace spaces with hyphens
    // Keep all characters except specific punctuation marks
    // This preserves Unicode characters (Chinese, Japanese, etc.)
    let id = cleanText
        .toLowerCase()
        .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '') // Remove only ASCII punctuation
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    // If empty after cleaning, use a hash of the original text
    if (!id) {
        // Simple hash function for fallback
        let hash = 0;
        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        id = 'heading-' + Math.abs(hash).toString(36);
    } else {
        id = 'heading-' + id;
    }
    
    return id;
}

export function generateTOC(headings: Heading[], baseHash?: string): string {
    if (headings.length === 0) {
        return '';
    }
    
    // Since we only include level 2 headings, we can simplify the TOC structure
    let tocHtml = '<nav class="table-of-contents"><h3>Table of Contents</h3><ul>';
    
    for (const heading of headings) {
        // All headings are level 2, so just add them as list items
        const href = baseHash ? `${baseHash}?h=${encodeURIComponent(heading.id)}` : `#${heading.id}`;
        tocHtml += `<li><a href="${href}">${escapeHtml(heading.text)}</a></li>`;
    }
    
    tocHtml += '</ul></nav>';
    return tocHtml;
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
