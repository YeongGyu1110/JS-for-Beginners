document.addEventListener("DOMContentLoaded", async () => {
    
    const contentArea = document.getElementById('post-content');

    try {
        // 1. 같은 폴더에 있는 README.md 파일을 불러옵니다. (fetch)
        // 만약 다른 글을 띄우고 싶다면 파일 이름만 바꾸면 됩니다.
        const response = await fetch('./README.md');
        
        // 파일을 찾지 못했을 때의 에러 처리
        if (!response.ok) {
            throw new Error('마크다운 파일을 불러오는데 실패했습니다.');
        }

        // 2. 텍스트 데이터로 변환
        const mdSource = await response.text();

        // 3. 마크다운을 HTML로 변환하여 삽입
        contentArea.innerHTML = marked.parse(mdSource);

        // 4. 코드 하이라이팅 적용
        Prism.highlightAll();

        // ----------------------------------------------------
        // 5. 목차(ToC) 생성 및 스크롤 스파이 적용
        // (DOM이 업데이트된 후 실행되어야 하므로 불러온 직후에 실행합니다)
        // ----------------------------------------------------
        
        const headings = contentArea.querySelectorAll('h1, h2, h3');
        const tocContainer = document.getElementById('toc');

        headings.forEach((heading, index) => {
            if (heading.tagName === 'H1') return;

            if (!heading.id) {
                heading.id = `heading-${index}`;
            }

            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.className = `toc-link toc-${heading.tagName.toLowerCase()}`;
            tocContainer.appendChild(link);
        });

        // 스크롤 스파이 로직
        const tocLinks = document.querySelectorAll('.toc-link');
        const observerOptions = {
            root: null,
            rootMargin: "0px 0px -80% 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tocLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, observerOptions);

        headings.forEach(heading => {
            if (heading.tagName !== 'H1') observer.observe(heading);
        });

    } catch (error) {
        // 에러 발생 시 화면에 표시
        console.error(error);
        contentArea.innerHTML = `<p style="color: #ff5252;">에러가 발생했습니다: ${error.message}</p>`;
    }

    // 6. 상단 진행률 바
    window.onscroll = function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("myBar").style.width = scrolled + "%";
    };
});