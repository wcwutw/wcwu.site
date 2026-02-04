// Home page renderer
export function renderHomePage(): void {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        <div class="hero">
            <h1>wcwu</h1>
            <p class="subtitle">Junior @ NTU CSIE</p>
            <div class="bio">
                <p>I am Wei-Chi "Alex" Wu ("wcwu"), a junior from National Taiwan University, majoring in Computer Science.</p>
            </div>
        </div>
        
        <div class="section">
            <h2>About Me</h2>
            <div class="about-me-container">
                <div class="about-me-left">
                    <div class="section-content">
                        <p>I'm a student from National Taiwan University, majoring in Computer Science and Information Engineering.</p>
                        <p><strong>Research Interests:</strong> Natural Language Processing, Machine Learning, and Deep Learning.</p>
                        <p><strong>Affiliate Lab:</strong> Machine Discovery and Social Network Mining Lab, National Taiwan University; Natural Language Processing Lab, National Taiwan University.</p>
                    </div>
                    <div class="social-links">
                <a href="https://github.com/wcwutw" target="_blank" rel="noopener" aria-label="GitHub" class="social-link">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                </a>
                <a href="https://linkedin.com/in/alex-wu-4a02a3339/" target="_blank" rel="noopener" aria-label="LinkedIn" class="social-link">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span>LinkedIn</span>
                </a>
                <a href="mailto:b12902080@csie.ntu.edu.tw" aria-label="Email" class="social-link">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>Email</span>
                </a>
                <a href="../../assets/documents/MyCV_20260108.pdf" target="_blank" rel="noopener" aria-label="Resume" class="social-link">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    <span>Resume</span>
                </a>
                    </div>
                </div>
                <div class="about-me-image">
                    <img src="../../assets/images/_MG_9793.JPG" alt="About Me" />
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>Status</h2>
            <div class="section-content">
                <p>Preparing for the exchange program at UIUC. Also looking forward to finding mentors at UIUC.</p>
            </div>
        </div>

        <div class="section">
            <h2>Recent Updates</h2>
            <div class="section-content">
                <p>I have rebuilt my blog and reorganized all the posts. The website was built using vibe coding. I have also removed posts about high school programming contests.</p>
            </div>
        </div>
    `;
}
