const DocCore = {
    // 1. 마크다운 커스텀 렌더러 (Callouts 지원) 설정
    initMarked: () => {
        const renderer = {
            blockquote(token) {
                const text = token.text || "";
                const reg = /\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;
                const match = text.match(reg);
                if (match) {
                    const type = match[1].toLowerCase();
                    let body = this.parser.parse(token.tokens);
                    const cleanBody = body.replace(match[0], '').replace(/<p>\s*<\/p>/g, '').trim();
                    return `<div class="callout ${type}"><div class="callout-title">${match[1]}</div>${cleanBody}</div>`;
                }
                return `<blockquote>${this.parser.parse(token.tokens)}</blockquote>`;
            }
        };
        marked.use(markedFootnote());
        marked.use({ renderer });
    },

    // 2. 코드 복사 버튼 일괄 생성
    createCopyButtons: (containerArea) => {
        containerArea.querySelectorAll('pre').forEach(pre => {
            // 이미 래퍼로 감싸져 있는지 확인
            if (pre.parentElement.classList.contains('code-wrapper')) return;

            // 1. 코드 블록을 감쌀 부모 래퍼(Wrapper) 생성
            const wrapper = document.createElement('div');
            wrapper.className = 'code-wrapper';
            
            // 2. DOM 구조 재배치 (Wrapper 안에 pre 넣기)
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            // 3. 복사 버튼을 pre 안이 아닌 'Wrapper'에 추가
            const btn = document.createElement('button');
            btn.className = 'copy-button';
            btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="1" ry="1"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>COPY</span>`;
            wrapper.appendChild(btn);
            
            btn.addEventListener('click', async () => {
                if (document.body.classList.contains('lab-state-standby')) return; // 랩 잠금 상태 방지
                const codeEl = pre.querySelector('code');
                if (!codeEl) return;
                try {
                    await navigator.clipboard.writeText(codeEl.innerText);
                    btn.classList.add('copied');
                    btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>DONE</span>`;
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="1" ry="1"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>COPY</span>`;
                    }, 1500);
                } catch (err) { btn.innerText = 'ERR'; }
            });
        });
    },

    // 3. 우측 목차(ToC) 생성 및 스크롤 스파이
    buildToC: (contentArea, tocContainerId) => {
        const headings = contentArea.querySelectorAll('h2, h3');
        const tocContainer = document.getElementById(tocContainerId);
        if(!tocContainer) return;
        
        tocContainer.innerHTML = ''; 
        headings.forEach((heading, index) => {
            if (!heading.id) heading.id = `heading-${index}`;
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.className = `toc-link toc-${heading.tagName.toLowerCase()}`;
            tocContainer.appendChild(link);
        });

        const tocLinks = document.querySelectorAll('.toc-link');
        const activeHeadings = new Set();
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) activeHeadings.add(entry.target);
                else activeHeadings.delete(entry.target);
            });
            if (activeHeadings.size > 0) {
                let topHeading = null; let minTop = Infinity;
                activeHeadings.forEach(heading => {
                    const rect = heading.getBoundingClientRect();
                    if (rect.top < minTop) { minTop = rect.top; topHeading = heading; }
                });
                if (topHeading) {
                    tocLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.toc-link[href="#${topHeading.id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            }
        }, { rootMargin: "-85px 0px -70% 0px" });

        headings.forEach(heading => observer.observe(heading));
    },

    // 4. 이전/다음 포스트 네비게이션 생성
    buildNavigation: (postId, posts, contentArea) => {
        const sortedPosts = [...posts].sort((a, b) => {
            const chA = parseInt(a.chapter); const chB = parseInt(b.chapter);
            if (chA !== chB) return chA - chB;
            return a.order - b.order;
        });
        
        const currentIndex = sortedPosts.findIndex(p => p.id === postId);
        let prevUrl = null; let nextUrl = null;

        if (currentIndex !== -1) {
            const prevPost = sortedPosts[currentIndex - 1];
            const nextPost = sortedPosts[currentIndex + 1];

            if (prevPost || nextPost) {
                const navContainer = document.createElement('div');
                navContainer.className = 'post-navigation';

                if (prevPost) {
                    const prevTarget = prevPost.type === 'lab' ? '../lab/' : '../docs/';
                    prevUrl = `${prevTarget}?id=${prevPost.id}`;
                    navContainer.innerHTML += `<a href="${prevUrl}" class="nav-btn prev"><span class="nav-label">< PREVIOUS</span><span class="nav-title">${prevPost.title}</span></a>`;
                    
                    const sidePrev = document.createElement('a');
                    sidePrev.href = prevUrl; sidePrev.className = 'side-nav-btn prev'; sidePrev.title = `이전 글: ${prevPost.title} (Ctrl + ←)`;
                    sidePrev.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
                    document.body.appendChild(sidePrev);
                }
                if (nextPost) {
                    const nextTarget = nextPost.type === 'lab' ? '../lab/' : '../docs/';
                    nextUrl = `${nextTarget}?id=${nextPost.id}`;
                    navContainer.innerHTML += `<a href="${nextUrl}" class="nav-btn next"><span class="nav-label">NEXT ></span><span class="nav-title">${nextPost.title}</span></a>`;
                    
                    const sideNext = document.createElement('a');
                    sideNext.href = nextUrl; sideNext.className = 'side-nav-btn next'; sideNext.title = `다음 글: ${nextPost.title} (Ctrl + →)`;
                    sideNext.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
                    document.body.appendChild(sideNext);
                }
                contentArea.appendChild(navContainer);
            }
        }
        
        // 단축키 설정
        window.addEventListener('keydown', (e) => {
            // Lab 진행 중일 때는 동작 차단
            if (document.body.classList.contains('lab-state-active')) return;
            if (e.ctrlKey) {
                if (e.key === 'ArrowLeft' && prevUrl) window.location.href = prevUrl;
                else if (e.key === 'ArrowRight' && nextUrl) window.location.href = nextUrl;
            }
        });
    },

    // 5. 공통 시스템/에러 화면 렌더러
    renderSystemMessage: (type, contentArea, tagsContainer, id = null) => {
        let title = "Viewer - JFB", tagMsg = "[WAITING_FOR_INPUT]", icon = "", sub = "", desc = "", btn = "";
        
        if (type === 'empty') {
            icon = `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line>`;
            sub = "NO_FILE_SELECTED"; desc = "읽을 문서를 선택하거나 검색해주세요.";
            btn = `<a href="../search/" class="return-home-btn">> OPEN_SEARCH_</a>`;
        } else if (type === '404') {
            title = "404 Not Found - JFB"; tagMsg = `<span style="color: var(--accent-color)">[SYS_ERR: 404]</span>`;
            icon = `<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>`;
            sub = "FILE_NOT_FOUND"; desc = "요청하신 문서를 찾을 수 없거나 삭제되었습니다.";
            btn = `<h1 class="system-message-title" style="margin-top:-1rem">404</h1><a href="../" class="return-home-btn">> RETURN_TO_HOME_</a>`;
        } else if (type === 'wrong_type') {
            title = "Access Denied - JFB"; tagMsg = `<span style="color: var(--accent-color)">[TYPE_MISMATCH]</span>`;
            icon = `<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>`;
            sub = "INVALID_VIEWER_TYPE"; desc = "이 문서는 해당 뷰어 환경과 맞지 않습니다.";
            const targetPage = window.location.pathname.includes('/lab/') ? '../docs/' : '../lab/'; 
            btn = `<a href="${targetPage}?id=${id}" class="return-home-btn">> OPEN_IN_CORRECT_VIEWER_</a>`;
        }

        document.title = title;
        if(tagsContainer) tagsContainer.innerHTML = `<span style="font-family: 'Fira Code', monospace; font-size: 0.75rem; color: var(--text-secondary);">${tagMsg}</span>`;
        contentArea.innerHTML = `
            <div class="system-message-container">
                <svg class="system-message-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon}</svg>
                <h2 class="system-message-subtitle">${sub}</h2>
                <p class="system-message-desc" style="opacity: 0.7; margin-bottom: 2.5rem;">${desc}</p>
                ${btn}
            </div>
        `;
        contentArea.classList.add('loaded');
    }
};