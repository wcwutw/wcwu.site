// About page renderer
export function renderAboutPage(): void {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        <div class="about-content">
            <h1>About wcwu</h1>
            
            <div style="display: flex; align-items: flex-start; gap: 2rem; margin-bottom: 3rem;">
                <div style="flex: 1;">
                    <h2>Bio</h2>
                    <p>I am a junior student from National Taiwan University, majoring in Computer Science and Information Engineering, expected to graduate on June 2027.</p>
                    <p>I am going to join University of Illinois of Urbana-Champaign as an exchange student in Fall 2026 semester.</p>
                    <p>My research interests focus on natural language processing and large language models, particularly in multilingual LLM reasoning and automatic prompting engineering.</p>
                    <p>I am also a passionate baseball enthusiast who enjoys attending games and following the sport.</p>
                </div>
                <div style="flex-shrink: 0;">
                    <img src="../../assets/images/2-1761922822990.jpg" alt="Profile Picture" style="width: 280px; height: 280px; object-fit: cover; border-radius: 8px;">
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: none; width: 100%;">
                <div>
                    <h2>Awards & Achievements</h2>
                    <ul>
                        <li>NTU Academic Achievement Award, <span class="date">Spring 2025</span></li>
                        <li>ICPC Taoyuan - Bronze (Rk. 34), <span class="date">Oct 2023</span></li>
                        <li>NHSPC - Third Prize (Rk. 19), <span class="date">Dec 2022</span></li>
                        <li>Mock-NHSPC - Second Prize (Rk. 6), <span class="date">Dec 2022</span></li>
                        <li>NCKU Invited Cup - Third Place, <span class="date">Aug 2022</span></li>
                        <li>YTP 2022 - Fourth Place, <span class="date">Aug 2022</span></li>
                        <li>Kaohsiung City Science Fair Computer Science Division - First Place, <span class="date">Apr 2022</span></li>
                        <li>NPSC 2021 - Fourth Place, <span class="date">Nov 2021</span></li>
                        <li>ISSC 2021 - Third Place, <span class="date">Oct 2021</span></li>
                    </ul>
                    <h2>Academic Achievements</h2>
                    <ul>
                        <li>TOEFL 111 (R30 L28 S25 W28), <span class="date">Sep 2025</span></li>
                        <li>GPA: 4.19/4.3 (Freshman year), 4.22/4.3 (Sophomore year)</li>
                        <li>Rank: #15/144 (Freshman year), #15/154 (Sophomore year)</li>
                    </ul>
                </div>
                
                <div>
                    <h2>Research Roles</h2>
                    <ul>
                        <li>Natural Language Processing Lab, Undergraduate Researcher, <span class="date">Jul 2025 - Present</span></li>
                        <li>Machine Discovery and Social Network Mining Lab, Undergraduate Researcher, <span class="date">Dec 2024 - Present</span></li>
                        <li>Institue of Information Science, Academia Sinica, Research Intern, <span class="date">Jul 2024 – Aug 2024</span></li>
                    </ul>
                    <h2>Work Roles</h2>
                    <ul>
                        <li>Network Administration Team, DNS Group Chief, <span class="date">Oct 2024 - Present</span></li>
                        <li>Sprout Project Program C++ Class, Lecturer and Project Manager, <span class="date">Nov 2023 - Present</span></li>
                        <li>Data Structure and Algorithm, Teaching Assistant, <span class="date">Feb 2025 - Jun 2025</span></li>
                        <li>Algorithm Design and Analysis, Teaching Assistant, <span class="date">Nov 2024 - Jan 2025</span></li>
                        <li>IOICamp 2026 Worker</li>
                        <li>IOICamp 2024/2025 Problemsetter</li>
                        <li>YTP 2024 Problemsetter</li>
                        <li>Mock-NHSPC 2023 Tester</li>
                        <li>Balloon Cup 2023 Problemsetter</li>
                        <li>Balloon Cup 2022 Host</li>
                        <li>KSPGC, Lecturer, <span class="date">Aug 2021 - Jul 2022</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}
