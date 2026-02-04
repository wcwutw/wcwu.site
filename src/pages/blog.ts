// Blog page renderer
import { getBaseballPosts, getBlogIndexPosts, getPostById, isBaseballPostId } from '../posts.js';
import { markdownToHtml, getPostExcerpt, extractHeadings, generateTOC, generateHeadingId } from '../markdown.js';
import { BASEBALL_SLUG_BY_POST_ID } from './baseball.js';

function parseTitleVisitDate(title: string): Date | null {
    const m = /^(\d{4})\/(\d{1,2})\/(\d{1,2})/.exec(title.trim());
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
    return new Date(year, month - 1, day);
}

export async function renderBlogPage(): Promise<void> {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    try {
        const posts = await getBlogIndexPosts();
        
        // Sort by date descending
        posts.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
        
        const postsHtml = posts.map(post => {
            const excerpt = getPostExcerpt(post.content);
            const tags = post.metadata.tags ? post.metadata.tags.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('') : '';
            const coverImage = post.metadata.cover ? `
                <div class="blog-item-cover">
                    <a href="#blog/${post.id}">
                        <img src="${post.metadata.cover}" alt="${post.metadata.title}">
                    </a>
                </div>
            ` : '';
            
            return `
                <article class="blog-item">
                    <div class="blog-item-content">
                        <h3 class="blog-item-title">
                            <a href="#blog/${post.id}">${post.metadata.title}</a>
                        </h3>
                        <div class="blog-item-meta">
                            <span class="date">${formatDate(post.metadata.date)}</span>
                            ${post.metadata.category ? `<span class="category">${post.metadata.category}</span>` : ''}
                        </div>
                        ${post.metadata.description ? `<p class="blog-item-excerpt">${post.metadata.description}</p>` : `<p class="blog-item-excerpt">${excerpt}</p>`}
                        ${tags ? `<div class="tags">${tags}</div>` : ''}
                    </div>
                    ${coverImage}
                </article>
            `;
        }).join('');
        
        mainContent.innerHTML = `
            <div class="blog-page">
                <h1>Blog</h1>
                <div class="blog-list">
                    ${postsHtml || '<p>No posts yet.</p>'}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        mainContent.innerHTML = '<div class="error">Failed to load blog posts</div>';
    }
}

export async function renderBlogPost(postId: string): Promise<void> {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    try {
        const post = await getPostById(postId);
        
        if (!post) {
            mainContent.innerHTML = '<div class="error"><h1>404</h1><p>Post not found</p></div>';
            return;
        }

        const isBaseballPost = isBaseballPostId(postId);
        const posts = isBaseballPost ? await getBaseballPosts() : await getBlogIndexPosts();
        
        if (isBaseballPost) {
            // Baseball ordering: use the same order as the Baseball page list
            // (date prefix in the post title, e.g. `2025/7/18 ...`)
            posts.sort((a, b) => {
                const da = parseTitleVisitDate(a.metadata.title);
                const db = parseTitleVisitDate(b.metadata.title);
                if (da && db) return da.getTime() - db.getTime(); // oldest -> newest
                if (da) return -1;
                if (db) return 1;
                return a.id.localeCompare(b.id);
            });
        } else {
            // Blog ordering: by front-matter date, descending
            posts.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
        }
        
        // Find current post index and get prev/next posts
        const currentIndex = posts.findIndex(p => p.id === postId);
        const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
        
        // Extract headings and generate TOC
        const headings = extractHeadings(post.content);
        const selfHref = isBaseballPost
            ? `#baseball/${BASEBALL_SLUG_BY_POST_ID[postId] ?? postId}`
            : `#blog/${postId}`;
        const tocHtml = generateTOC(headings, selfHref);
        
        // Convert markdown to HTML
        let htmlContent = markdownToHtml(post.content);
        
        // Update heading IDs in HTML to match TOC
        // Since we only extract h2 headings for TOC, we only need to set IDs on h2 headings
        // Create a temporary container to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Get only h2 headings (since TOC only includes h2)
        const h2Headings = Array.from(tempDiv.querySelectorAll('h2')) as HTMLElement[];
        
        // Match h2 headings with extracted headings (all are level 2)
        let headingIndex = 0;
        for (let i = 0; i < h2Headings.length && headingIndex < headings.length; i++) {
            const htmlHeading = h2Headings[i];
            const htmlText = htmlHeading.textContent?.trim() || '';
            const extractedHeading = headings[headingIndex];
            const extractedText = extractedHeading.text.trim();
            
            // Match by text (allowing for some differences due to markdown formatting)
            if (htmlText === extractedText || 
                htmlText.replace(/\s+/g, ' ') === extractedText.replace(/\s+/g, ' ') ||
                htmlText.includes(extractedText) || 
                extractedText.includes(htmlText)) {
                // Perfect match - assign the ID from TOC
                htmlHeading.id = extractedHeading.id;
                headingIndex++;
            } else {
                // No match, generate ID from text (shouldn't happen if extraction is correct)
                htmlHeading.id = generateHeadingId(htmlText);
            }
        }
        
        // Ensure all remaining h2 headings have IDs (fallback)
        for (let i = 0; i < h2Headings.length; i++) {
            if (!h2Headings[i].id) {
                const text = h2Headings[i].textContent?.trim() || '';
                h2Headings[i].id = generateHeadingId(text);
            }
        }
        
        htmlContent = tempDiv.innerHTML;
        
        const tags = post.metadata.tags ? post.metadata.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('') : '';
        const coverImage = post.metadata.cover ? `
            <div class="post-cover">
                <img src="${post.metadata.cover}" alt="${post.metadata.title}">
            </div>
        ` : '';
        
        // Build navigation buttons
        const baseballHref = (id: string): string => {
            const slug = BASEBALL_SLUG_BY_POST_ID[id];
            // If there isn't an explicit slug mapping, fall back to using the post id as slug.
            return slug ? `#baseball/${slug}` : `#baseball/${id}`;
        };

        const prevButton = prevPost ? `
            <a href="${isBaseballPost ? baseballHref(prevPost.id) : `#blog/${prevPost.id}`}" class="post-nav-link post-nav-prev">
                <span class="post-nav-label">← Previous Post</span>
                <span class="post-nav-title">${prevPost.metadata.title}</span>
            </a>
        ` : '<div></div>';
        
        const nextButton = nextPost ? `
            <a href="${isBaseballPost ? baseballHref(nextPost.id) : `#blog/${nextPost.id}`}" class="post-nav-link post-nav-next">
                <span class="post-nav-label">Next Post →</span>
                <span class="post-nav-title">${nextPost.metadata.title}</span>
            </a>
        ` : '<div></div>';

        const backLink = isBaseballPost
            ? `<a href="#baseball" style="color: var(--link-color);">← Back to Baseball</a>`
            : `<a href="#blog" style="color: var(--link-color);">← Back to Blog</a>`;
        
        mainContent.innerHTML = `
            <div class="blog-post-container">
                ${tocHtml ? `
                    <aside class="post-sidebar">
                        ${tocHtml}
                    </aside>
                ` : ''}
                <article class="blog-post">
                    <header class="post-header">
                        <h1 class="post-title">${post.metadata.title}</h1>
                        <div class="post-meta">
                            <span class="date">${formatDate(post.metadata.date)}</span>
                            ${post.metadata.category ? ` · <span class="category">${post.metadata.category}</span>` : ''}
                        </div>
                        ${tags ? `<div class="tags">${tags}</div>` : ''}
                    </header>
                    <nav class="post-navigation post-navigation-top">
                        ${prevButton}
                        ${nextButton}
                    </nav>
                    ${coverImage}
                    <div class="post-content">
                        ${htmlContent}
                    </div>
                    <nav class="post-navigation">
                        ${prevButton}
                        ${nextButton}
                    </nav>
                    <div style="margin-top: 2rem; text-align: center;">
                        ${backLink}
                    </div>
                </article>
            </div>
        `;
        
        // Highlight code blocks
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
        }
        
        // Handle in-page anchor links (e.g. "#heading-...") without breaking hash routing.
        // (TOC links use "#blog/<id>?h=..." or "#baseball/<slug>?h=...", so we must NOT intercept those.)
        const sidebar = mainContent.querySelector('.post-sidebar');
        if (sidebar) {
            sidebar.addEventListener('click', (e) => {
                const target = (e.target as HTMLElement).closest('a');
                const href = target?.getAttribute('href') ?? '';
                if (href.startsWith('#heading-')) {
                    e.preventDefault();
                    const elementId = href.substring(1); // Remove the #
                        const element = document.getElementById(elementId);
                        if (element) {
                            // Calculate offset for fixed navbar
                            const navbarHeight = 80;
                            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - navbarHeight;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                            
                            // Update URL while preserving the current route
                            const routePath = (window.location.hash.slice(1) || 'home').split('?')[0];
                            window.history.pushState({}, '', `#${routePath}?h=${encodeURIComponent(elementId)}`);
                        }
                }
            });
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
        mainContent.innerHTML = '<div class="error">Failed to load post</div>';
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

declare const hljs: any;
