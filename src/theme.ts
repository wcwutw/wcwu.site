// Theme management
const THEME_KEY = 'theme';

export function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(theme);
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Toggle icons
    const sunIcon = document.querySelector('.sun-icon') as HTMLElement;
    const moonIcon = document.querySelector('.moon-icon') as HTMLElement;
    
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
    
    // Toggle highlight.js theme
    const lightTheme = document.getElementById('highlight-light') as HTMLLinkElement;
    const darkTheme = document.getElementById('highlight-dark') as HTMLLinkElement;
    
    if (lightTheme && darkTheme) {
        if (theme === 'dark') {
            lightTheme.disabled = true;
            darkTheme.disabled = false;
        } else {
            lightTheme.disabled = false;
            darkTheme.disabled = true;
        }
    }
}

export function getCurrentTheme(): string {
    return document.documentElement.getAttribute('data-theme') || 'light';
}
