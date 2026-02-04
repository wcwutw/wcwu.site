// Baseball page renderer
import { getBaseballPosts } from '../posts.js';

interface MLBTeam {
    /** MLB team numeric id (matches your icon filenames like `147.svg`) */
    mlbId: number;
    team: string;
    stadium: string;
    lat: number;
    lon: number;
    /** slug used for `#baseball/<slug>` routes (visited teams only) */
    slug?: string;
    /**
     * For teams sharing the same metro (NY/LA/CHI/Bay Area),
     * use small offsets in %-points to avoid icon overlap.
     */
    offsetXPct?: number;
    offsetYPct?: number;
    /** If visited, link to blog post id (hash route `#blog/<id>`) */
    blogPostId?: string;
}

/**
 * Baseball post routes (pretty URLs).
 * - These slugs power `/#baseball/<slug>`
 * - They can point to *any* baseball post id (filename without `.md`)
 */
export const BASEBALL_POST_BY_SLUG: Record<string, string> = {
    // MLB
    mariners: '17_2025_Mariners',
    'mariners-0': '16_2025_Mariners_0',
    yankees: '19_2018_Yankees',
    mets: '20_2024_Mets',
    nats: '21_2024_Nats',
    orioles: '22_2024_Orioles',
    phillies: '23_2024_Phillies',

    // KBO (still part of your Baseball section)
    // twins: '18_2025_KBOTwins',
};

export const BASEBALL_SLUG_BY_POST_ID: Record<string, string> = Object.fromEntries(
    Object.entries(BASEBALL_POST_BY_SLUG).map(([slug, postId]) => [postId, slug])
) as Record<string, string>;

/**
 * Primary slug used when clicking a team icon on the map.
 * (If a team has multiple posts, pick the “main / latest” one here.)
 */
const BASEBALL_PRIMARY_SLUG_BY_MLB_ID: Record<number, string> = {
    147: 'yankees',
    121: 'mets',
    120: 'nats',
    110: 'orioles',
    136: 'mariners-0',
    143: 'phillies',
};

/**
 * Stadium coordinates are fetched from Wikipedia (MediaWiki API / REST summary)
 * and copied here so the site works offline.
 */
const MLB_TEAMS: MLBTeam[] = [
    { mlbId: 108, team: 'Los Angeles Angels', stadium: 'Angel Stadium', lat: 33.80027778, lon: -117.88277778, offsetXPct: -1.0, offsetYPct: -0.8 },
    { mlbId: 109, team: 'Arizona Diamondbacks', stadium: 'Chase Field', lat: 33.44527778, lon: -112.06694444, offsetXPct: -1.8 },
    { mlbId: 110, team: 'Baltimore Orioles', stadium: 'Oriole Park at Camden Yards', lat: 39.28388889, lon: -76.62166667, offsetYPct: -0.5 },
    { mlbId: 111, team: 'Boston Red Sox', stadium: 'Fenway Park', lat: 42.34638889, lon: -71.09777778, offsetYPct: -0.5 },
    { mlbId: 112, team: 'Chicago Cubs', stadium: 'Wrigley Field', lat: 41.94805556, lon: -87.65555556, offsetXPct: -1.2, offsetYPct: 2.0 },
    { mlbId: 113, team: 'Cincinnati Reds', stadium: 'Great American Ball Park', lat: 39.0975, lon: -84.50666667, offsetYPct: 1.8 },
    { mlbId: 114, team: 'Cleveland Guardians', stadium: 'Progressive Field', lat: 41.49583333, lon: -81.68527778, offsetYPct: 2.0 },
    { mlbId: 115, team: 'Colorado Rockies', stadium: 'Coors Field', lat: 39.75611111, lon: -104.99416667 },
    { mlbId: 116, team: 'Detroit Tigers', stadium: 'Comerica Park', lat: 42.33916667, lon: -83.04861111, offsetYPct: 2.0 },
    { mlbId: 117, team: 'Houston Astros', stadium: 'Daikin Park', lat: 29.75694444, lon: -95.35555556, offsetYPct: 1.0 },
    { mlbId: 118, team: 'Kansas City Royals', stadium: 'Kauffman Stadium', lat: 39.0514, lon: -94.4806, offsetYPct: 1.0 },
    { mlbId: 119, team: 'Los Angeles Dodgers', stadium: 'Dodger Stadium', lat: 34.07361111, lon: -118.24, offsetXPct: -2.5, offsetYPct: -2.0 },
    { mlbId: 120, team: 'Washington Nationals', stadium: 'Nationals Park', lat: 38.87277778, lon: -77.0075, offsetYPct: 1.2 },
    { mlbId: 121, team: 'New York Mets', stadium: 'Citi Field', lat: 40.75694444, lon: -73.84583333, offsetXPct: 1.2 },
    { mlbId: 133, team: 'Oakland Athletics', stadium: 'Sutter Health Park', lat: 38.58037222, lon: -121.5138, offsetXPct: 0.7, offsetYPct: -1.2 },
    { mlbId: 134, team: 'Pittsburgh Pirates', stadium: 'PNC Park', lat: 40.44694444, lon: -80.00583333, offsetYPct: 0.8 },
    { mlbId: 135, team: 'San Diego Padres', stadium: 'Petco Park', lat: 32.7073, lon: -117.1566, offsetXPct: -2.7, offsetYPct: -1.2 },
    { mlbId: 136, team: 'Seattle Mariners', stadium: 'T-Mobile Park', lat: 47.591, lon: -121.333, offsetXPct: 3.5, offsetYPct: -2.7 },
    { mlbId: 137, team: 'San Francisco Giants', stadium: 'Oracle Park', lat: 37.77861111, lon: -122.38916667, offsetXPct: -1.2 },
    { mlbId: 138, team: 'St. Louis Cardinals', stadium: 'Busch Stadium', lat: 38.6225, lon: -90.19305556, offsetYPct: 0.8 },
    { mlbId: 139, team: 'Tampa Bay Rays', stadium: 'Tropicana Field', lat: 27.76833333, lon: -82.65333333, offsetXPct: 4.5, offsetYPct: -0.3 },
    { mlbId: 140, team: 'Texas Rangers', stadium: 'Globe Life Field', lat: 32.7475, lon: -97.08416667, offsetYPct: 1.2 },
    { mlbId: 141, team: 'Toronto Blue Jays', stadium: 'Rogers Centre', lat: 43.64138889, lon: -79.38916667, offsetYPct: 1.5 },
    { mlbId: 142, team: 'Minnesota Twins', stadium: 'Target Field', lat: 44.98166667, lon: -93.27833333, offsetXPct: 1.0, offsetYPct: 5.0 },
    { mlbId: 143, team: 'Philadelphia Phillies', stadium: 'Citizens Bank Park', lat: 39.90583333, lon: -75.16638889 },
    { mlbId: 144, team: 'Atlanta Braves', stadium: 'Truist Park', lat: 33.89, lon: -84.468, offsetXPct: 2.8 },
    { mlbId: 145, team: 'Chicago White Sox', stadium: 'Rate Field', lat: 41.83, lon: -87.63388889, offsetXPct: 0.2, offsetYPct: 5.7 },
    { mlbId: 146, team: 'Miami Marlins', stadium: 'LoanDepot Park', lat: 25.77805556, lon: -80.21972222, offsetXPct: 5.0, offsetYPct: -0.7 },
    { mlbId: 147, team: 'New York Yankees', stadium: 'Yankee Stadium', lat: 40.82916667, lon: -73.92638889, offsetXPct: -1.2, offsetYPct: -0.5 },
    { mlbId: 158, team: 'Milwaukee Brewers', stadium: 'American Family Field', lat: 43.02833333, lon: -87.97111111, offsetYPct: 2.5 },
].map((t) => ({
    ...t,
    blogPostId: BASEBALL_POST_BY_SLUG[BASEBALL_PRIMARY_SLUG_BY_MLB_ID[t.mlbId] ?? ''],
    slug: BASEBALL_PRIMARY_SLUG_BY_MLB_ID[t.mlbId],
}));

const MAP_BOUNDS = {
    // Rough bounding box for the contiguous U.S. (lets the math work across resizes)
    latMin: 24.4,
    latMax: 49.6,
    lonMin: -124.9,
    lonMax: -66.9,
} as const;

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}

function latLonToPercent(lat: number, lon: number): { xPct: number; yPct: number } {
    const x = (lon - MAP_BOUNDS.lonMin) / (MAP_BOUNDS.lonMax - MAP_BOUNDS.lonMin);
    const y = (MAP_BOUNDS.latMax - lat) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin);
    return {
        xPct: clamp(x * 100, 0, 100),
        yPct: clamp(y * 100, 0, 100),
    };
}

function parseTitleVisitDate(title: string): Date | null {
    const m = /^(\d{4})\/(\d{1,2})\/(\d{1,2})/.exec(title.trim());
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
    return new Date(year, month - 1, day);
}

function getTitleDatePrefix(title: string): string | null {
    const m = /^(\d{4}\/\d{1,2}\/\d{1,2})/.exec(title.trim());
    return m ? m[1] : null;
}

export async function renderBaseballPage(): Promise<void> {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const baseballPosts = await getBaseballPosts();
    baseballPosts.sort((a, b) => {
        const da = parseTitleVisitDate(a.metadata.title);
        const db = parseTitleVisitDate(b.metadata.title);
        if (da && db) return da.getTime() - db.getTime(); // oldest -> newest
        if (da) return -1;
        if (db) return 1;
        return a.id.localeCompare(b.id);
    });

    const postsListHtml = baseballPosts
        .map((post) => {
            const slug = BASEBALL_SLUG_BY_POST_ID[post.id] ?? post.id;
            const href = `#baseball/${slug}`;
            const datePrefix = getTitleDatePrefix(post.metadata.title);
            const titleRest = datePrefix ? post.metadata.title.replace(datePrefix, '').trim() : post.metadata.title;
            const description = post.metadata.description ? `<div class="baseball-post-desc">${post.metadata.description}</div>` : '';
            return `
                <li class="baseball-post-item">
                    <a class="baseball-post-link" href="${href}">
                        ${datePrefix ? `<span class="baseball-post-date">${datePrefix}</span>` : ''}
                        <span class="baseball-post-title">${titleRest}</span>
                    </a>
                    ${description}
                </li>
            `;
        })
        .join('');
    
    mainContent.innerHTML = `
        <div class="baseball-content">
            <h1>30 MLB Stadium Tour Maps</h1>
            <div class="baseball-map-container">
                <div class="baseball-map-wrapper">
                    <img id="baseball-map" src="../../assets/images/baseball/Blank_US_Map,_Mainland_with_no_States.svg.png" alt="USA Mainland Map" />
                    <div class="team-icons-container">
                        ${MLB_TEAMS.map((team) => {
                            const { xPct, yPct } = latLonToPercent(team.lat, team.lon);
                            const x = xPct + (team.offsetXPct ?? 0);
                            const y = yPct + (team.offsetYPct ?? 0);
                            const isVisited = !!team.blogPostId;
                            const iconSrc = `../../assets/images/baseball/${team.mlbId}.svg`;
                            return `
                                <button
                                    type="button"
                                    class="team-icon ${isVisited ? 'visited' : 'unvisited'}"
                                    style="left: ${x}%; top: ${y}%;"
                                    data-mlb-id="${team.mlbId}"
                                    data-baseball-slug="${team.slug || ''}"
                                    data-blog-post="${team.blogPostId || ''}"
                                    title="${team.team} — ${team.stadium}${isVisited ? ' (Visited)' : ' (Not visited)'}"
                                    aria-label="${team.team}"
                                >
                                    <img src="${iconSrc}" alt="${team.team} logo" />
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            <div class="baseball-posts-section">
                <h2>Baseball Tour Lists</h2>
                <ul class="baseball-post-list">
                    ${postsListHtml || '<li class="baseball-post-item">No baseball posts yet.</li>'}
                </ul>
            </div>
        </div>
    `;
    
    const container = document.querySelector('.team-icons-container');
    if (!container) return;

    // Event delegation: one click handler for all icons
    container.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.team-icon') as HTMLButtonElement | null;
        if (!btn) return;
        const blogPostId = btn.getAttribute('data-blog-post');
        const slug = btn.getAttribute('data-baseball-slug');
        if (blogPostId && slug) {
            window.location.hash = `#baseball/${slug}`;
        }
    });
}
