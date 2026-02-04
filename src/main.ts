// Main entry point for the personal website
import { initTheme, toggleTheme } from './theme.js';
import { router } from './router.js';
import { loadMarkdown } from './markdown.js';

// Initialize theme
initTheme();

// Theme toggle button
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Router setup
function initRouter() {
    // Handle navigation clicks
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = (e.currentTarget as HTMLElement).getAttribute('data-page');
            if (page) {
                router.navigate(page);
            }
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1) || 'home';
        router.navigate(hash, false);
    });

    // Handle hash navigation (e.g. clicking a `href="#blog/..."` link)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1) || 'home';
        router.navigate(hash, false);
    });

    // Load initial page
    const initialPage = window.location.hash.slice(1) || 'home';
    router.navigate(initialPage, false);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRouter);
} else {
    initRouter();
}
