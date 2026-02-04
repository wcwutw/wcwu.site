// Archive page renderer
import { getAllPosts } from '../posts.js';

export async function renderArchivePage(): Promise<void> {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    try {
        const posts = await getAllPosts();
        
        // Sort by date descending
        posts.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
        
        // Group by year
        const postsByYear: { [year: string]: typeof posts } = {};
        posts.forEach(post => {
            const year = new Date(post.metadata.date).getFullYear().toString();
            if (!postsByYear[year]) {
                postsByYear[year] = [];
            }
            postsByYear[year].push(post);
        });
        
        // Generate HTML
        const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));
        
        const archiveHtml = years.map(year => {
            const yearPosts = postsByYear[year].map(post => `
                <div class="archive-item">
                    <span class="archive-date">${formatArchiveDate(post.metadata.date)}</span>
                    <div class="archive-title">
                        <a href="#blog/${post.id}">${post.metadata.title}</a>
                    </div>
                </div>
            `).join('');
            
            return `
                <div class="archive-year">
                    <h3>${year}</h3>
                    <div class="archive-list">
                        ${yearPosts}
                    </div>
                </div>
            `;
        }).join('');
        
        mainContent.innerHTML = `
            <div class="archive-page">
                <h1>Archive</h1>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                    ${posts.length} post${posts.length !== 1 ? 's' : ''} in total
                </p>
                ${archiveHtml || '<p>No posts yet.</p>'}
            </div>
        `;
    } catch (error) {
        console.error('Error loading archive:', error);
        mainContent.innerHTML = '<div class="error">Failed to load archive</div>';
    }
}

function formatArchiveDate(dateString: string): string {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
}
