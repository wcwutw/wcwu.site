// Simple client-side router
import { renderHomePage } from './pages/home.js';
import { renderBlogPage, renderBlogPost } from './pages/blog.js';
import { renderAboutPage } from './pages/about.js';
import { renderArchivePage } from './pages/archive.js';
import { BASEBALL_POST_BY_SLUG, renderBaseballPage } from './pages/baseball.js';
import { isBaseballPostId } from './posts.js';

export interface Route {
    path: string;
    render: () => Promise<void> | void;
}

class Router {
    private routes: Map<string, Route>;
    private mainContent: HTMLElement | null;
    
    constructor() {
        this.routes = new Map();
        this.mainContent = document.getElementById('main-content');
        this.setupRoutes();
    }
    
    private setupRoutes() {
        this.routes.set('home', {
            path: 'home',
            render: renderHomePage
        });
        
        this.routes.set('blog', {
            path: 'blog',
            render: renderBlogPage
        });
        
        this.routes.set('about', {
            path: 'about',
            render: renderAboutPage
        });
        
        this.routes.set('archive', {
            path: 'archive',
            render: renderArchivePage
        });
        
        this.routes.set('baseball', {
            path: 'baseball',
            render: renderBaseballPage
        });
    }
    
    async navigate(path: string, updateHistory: boolean = true) {
        const [routePath, queryString] = path.split('?');
        const params = new URLSearchParams(queryString ?? '');
        const anchorId = params.get('h');

        const scrollToHeading = (id: string, behavior: ScrollBehavior) => {
            const element = document.getElementById(id);
            if (!element) return;
            // Keep headings visible below the fixed navbar
            const navbarHeight = 80;
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            const targetTop = Math.max(0, elementTop - navbarHeight);
            window.scrollTo({ top: targetTop, behavior });
        };

        // Check if it's a blog post
        if (routePath.startsWith('blog/')) {
            const postId = routePath.split('blog/')[1];
            await renderBlogPost(postId);
            if (updateHistory) {
                window.history.pushState({}, '', `#${routePath}${anchorId ? `?h=${encodeURIComponent(anchorId)}` : ''}`);
            }
            this.updateActiveNav('blog');
            if (anchorId) {
                // Do an immediate scroll, then retry after images/videos load (layout shift).
                setTimeout(() => scrollToHeading(anchorId, 'smooth'), 0);
                setTimeout(() => scrollToHeading(anchorId, 'auto'), 400);
            } else {
                window.scrollTo(0, 0);
            }
            return;
        }

        // Check if it's a baseball post (pretty URL): #baseball/<slug>
        if (routePath.startsWith('baseball/')) {
            const slug = routePath.split('baseball/')[1];
            const postId = BASEBALL_POST_BY_SLUG[slug] ?? (isBaseballPostId(slug) ? slug : null);

            if (postId) {
                await renderBlogPost(postId);
                if (updateHistory) {
                    window.history.pushState({}, '', `#baseball/${slug}${anchorId ? `?h=${encodeURIComponent(anchorId)}` : ''}`);
                }
                this.updateActiveNav('baseball');
                if (anchorId) {
                    setTimeout(() => scrollToHeading(anchorId, 'smooth'), 0);
                    setTimeout(() => scrollToHeading(anchorId, 'auto'), 400);
                } else {
                    window.scrollTo(0, 0);
                }
                return;
            }
        }
        
        const route = this.routes.get(routePath);
        
        if (route) {
            if (this.mainContent) {
                this.mainContent.innerHTML = '<div class="loading">Loading...</div>';
            }
            
            try {
                await route.render();
                if (updateHistory) {
                    window.history.pushState({}, '', `#${routePath}`);
                }
                this.updateActiveNav(routePath);
                window.scrollTo(0, 0);
            } catch (error) {
                console.error('Error rendering page:', error);
                if (this.mainContent) {
                    this.mainContent.innerHTML = '<div class="error">Failed to load page</div>';
                }
            }
        } else {
            // 404
            if (this.mainContent) {
                this.mainContent.innerHTML = '<div class="error"><h1>404</h1><p>Page not found</p></div>';
            }
        }
    }
    
    private updateActiveNav(path: string) {
        document.querySelectorAll('[data-page]').forEach(link => {
            if (link.getAttribute('data-page') === path) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

export const router = new Router();
