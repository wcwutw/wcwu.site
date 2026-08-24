export type DevSection = 'blog' | 'archive';

export interface DevSectionVisibility {
    blog: boolean;
    archive: boolean;
}

const STORAGE_KEY = 'dev-section-visibility';
const PANEL_UNLOCK_KEY = 'dev-panel-unlocked';

const DEFAULT_VISIBILITY: DevSectionVisibility = {
    blog: false,
    archive: false,
};

function readVisibility(): DevSectionVisibility {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...DEFAULT_VISIBILITY };

    try {
        const parsed = JSON.parse(saved) as Partial<DevSectionVisibility>;
        return {
            blog: parsed.blog === true,
            archive: parsed.archive === true,
        };
    } catch {
        return { ...DEFAULT_VISIBILITY };
    }
}

export function getDevSectionVisibility(): DevSectionVisibility {
    return readVisibility();
}

export function setDevSectionVisibility(updates: Partial<DevSectionVisibility>): DevSectionVisibility {
    const next: DevSectionVisibility = {
        ...readVisibility(),
        ...updates,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    applyNavVisibility(next);
    syncDevPanel(next);

    const currentRoute = window.location.hash.slice(1).split('?')[0] || 'home';
    if (!isRouteAccessible(currentRoute)) {
        window.location.hash = '#home';
    }

    return next;
}

export function isSectionVisible(section: DevSection): boolean {
    return readVisibility()[section];
}

export function getSectionForRoute(routePath: string): DevSection | null {
    if (routePath === 'blog' || routePath.startsWith('blog/')) return 'blog';
    if (routePath === 'archive') return 'archive';
    return null;
}

export function isRouteAccessible(routePath: string): boolean {
    const section = getSectionForRoute(routePath);
    return section ? isSectionVisible(section) : true;
}

export function applyNavVisibility(visibility: DevSectionVisibility = readVisibility()): void {
    document.querySelectorAll<HTMLElement>('[data-section]').forEach(link => {
        const section = link.getAttribute('data-section') as DevSection | null;
        if (!section) return;
        link.hidden = !visibility[section];
    });
}

function isDevPanelUnlocked(): boolean {
    return localStorage.getItem(PANEL_UNLOCK_KEY) === '1';
}

function unlockDevPanel(): void {
    localStorage.setItem(PANEL_UNLOCK_KEY, '1');
}

function syncDevPanel(visibility: DevSectionVisibility = readVisibility()): void {
    const panel = document.getElementById('dev-section-panel');
    if (!panel) return;

    panel.querySelectorAll<HTMLInputElement>('input[data-section]').forEach(input => {
        const section = input.dataset.section as DevSection | undefined;
        if (!section) return;
        input.checked = visibility[section];
    });
}

function showDevPanel(): void {
    unlockDevPanel();
    const panel = document.getElementById('dev-section-panel');
    if (!panel) return;
    panel.hidden = false;
    syncDevPanel();
}

function hideDevPanel(): void {
    const panel = document.getElementById('dev-section-panel');
    if (!panel) return;
    panel.hidden = true;
}

function toggleDevPanel(): void {
    const panel = document.getElementById('dev-section-panel');
    if (!panel) return;

    if (panel.hidden) {
        showDevPanel();
    } else {
        hideDevPanel();
    }
}

function createDevPanel(): void {
    if (document.getElementById('dev-section-panel')) return;

    const panel = document.createElement('aside');
    panel.id = 'dev-section-panel';
    panel.className = 'dev-section-panel';
    panel.hidden = !isDevPanelUnlocked();
    panel.innerHTML = `
        <div class="dev-section-panel-header">
            <strong>Developer</strong>
            <button type="button" class="dev-section-panel-close" aria-label="Close developer panel">×</button>
        </div>
        <p class="dev-section-panel-note">Page visibility is stored in this browser only.</p>
        <label class="dev-section-panel-option">
            <input type="checkbox" data-section="blog">
            <span>Show Blog</span>
        </label>
        <label class="dev-section-panel-option">
            <input type="checkbox" data-section="archive">
            <span>Show Archive</span>
        </label>
    `;

    panel.querySelector('.dev-section-panel-close')?.addEventListener('click', hideDevPanel);
    panel.querySelectorAll<HTMLInputElement>('input[data-section]').forEach(input => {
        input.addEventListener('change', () => {
            const section = input.dataset.section as DevSection | undefined;
            if (!section) return;
            setDevSectionVisibility({ [section]: input.checked });
        });
    });

    document.body.appendChild(panel);
    syncDevPanel();
}

function exposeDevApi(): void {
    const api = {
        getVisibility: getDevSectionVisibility,
        setVisibility: setDevSectionVisibility,
        openPanel: showDevPanel,
        closePanel: hideDevPanel,
        togglePanel: toggleDevPanel,
    };

    (window as Window & { devPages?: typeof api }).devPages = api;
}

export function initDevSections(): void {
    applyNavVisibility();
    createDevPanel();
    exposeDevApi();

    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            toggleDevPanel();
        }
    });
}
