// Posts management
import { Post, loadMarkdown, parseMarkdown } from './markdown.js';

// Post list configuration
// Add your posts here
const BLOG_INDEX_FILES = [
    '0_FirstbutnottheREALfirstpost.md',
    '12_2023_FallSemester.md',
    '13_2024_SpringSemester.md',
    '14_2024_FallSemester.md',
    '15_2025_SpringSemester.md',
];

// Baseball travel posts (clickable from Baseball page, but NOT listed in Blog/Archive)
const BASEBALL_POST_FILES = [
    '16_2025_Mariners_0.md',
    '17_2025_Mariners.md',
    '18_2025_KBOTwins.md',
    '19_2018_Yankees.md',
    '20_2024_Mets.md',
    '21_2024_Nats.md',
    '22_2024_Orioles.md',
    '23_2024_Phillies.md',
];

const ALL_POST_FILES = [...BLOG_INDEX_FILES, ...BASEBALL_POST_FILES];
const BASEBALL_POST_IDS = new Set(BASEBALL_POST_FILES.map((f) => f.replace('.md', '')));

let allPostsCache: Post[] | null = null;
let blogIndexCache: Post[] | null = null;
let baseballPostsCache: Post[] | null = null;

export async function getAllPosts(): Promise<Post[]> {
    if (allPostsCache) {
        return allPostsCache;
    }
    
    const posts: Post[] = [];
    
    for (const filename of ALL_POST_FILES) {
        try {
            const markdown = await loadMarkdown(`content/posts/${filename}`);
            const { metadata, content } = parseMarkdown(markdown);
            
            posts.push({
                id: filename.replace('.md', ''),
                metadata,
                content
            });
        } catch (error) {
            // Silently skip posts that don't exist or fail to load
            // This allows removing posts by just deleting the file
            console.warn(`Skipping post ${filename}:`, error instanceof Error ? error.message : 'File not found');
        }
    }
    
    allPostsCache = posts;
    return posts;
}

export async function getBlogIndexPosts(): Promise<Post[]> {
    if (blogIndexCache) return blogIndexCache;

    const posts: Post[] = [];
    for (const filename of BLOG_INDEX_FILES) {
        try {
            const markdown = await loadMarkdown(`content/posts/${filename}`);
            const { metadata, content } = parseMarkdown(markdown);
            posts.push({
                id: filename.replace('.md', ''),
                metadata,
                content
            });
        } catch (error) {
            console.warn(`Skipping post ${filename}:`, error instanceof Error ? error.message : 'File not found');
        }
    }

    blogIndexCache = posts;
    return posts;
}

export async function getBaseballPosts(): Promise<Post[]> {
    if (baseballPostsCache) return baseballPostsCache;

    const posts: Post[] = [];
    for (const filename of BASEBALL_POST_FILES) {
        try {
            const markdown = await loadMarkdown(`content/posts/${filename}`);
            const { metadata, content } = parseMarkdown(markdown);
            posts.push({
                id: filename.replace('.md', ''),
                metadata,
                content
            });
        } catch (error) {
            console.warn(`Skipping post ${filename}:`, error instanceof Error ? error.message : 'File not found');
        }
    }

    baseballPostsCache = posts;
    return posts;
}

export function isBaseballPostId(id: string): boolean {
    return BASEBALL_POST_IDS.has(id);
}

export async function getPostById(id: string): Promise<Post | null> {
    const posts = await getAllPosts();
    return posts.find(post => post.id === id) || null;
}

export function clearCache(): void {
    allPostsCache = null;
    blogIndexCache = null;
    baseballPostsCache = null;
}
