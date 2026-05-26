document.addEventListener("DOMContentLoaded", () => {
    
    // 1. 마크다운 원본 가져오기
    const mdSource = document.getElementById('markdown-source').textContent;
    const contentArea = document.getElementById('post-content');

    // 2. 마크다운을 HTML로 변환하여 삽입 (marked.js 사용)
    contentArea.innerHTML = marked.parse(mdSource);

    // 3. 코드 블럭 하이라이팅 적용 (Prism.js 사용)
    Prism.highlightAll();

    // ----------------------------------------------------
    // 아래부터는 기존과 동일하게 변환된 HTML을 바탕으로 목차를 만듭니다.
    // ----------------------------------------------------

    const headings = contentArea.querySelectorAll('h1, h2, h3');
    const tocContainer = document.getElementById('toc');

    headings.forEach((heading, index) => {
        if (heading.tagName === 'H1') return; // H1은 목차에서 제외

        // ID가 없으면 생성 (마크다운 변환기가 자동으로 만들어주기도 하지만 안전을 위해)
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = `toc-link toc-${heading.tagName.toLowerCase()}`;
        tocContainer.appendChild(link);
    });

    // 스크롤 스파이 (목차 하이라이트)
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

    // 상단 진행률 바
    window.onscroll = function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("myBar").style.width = scrolled + "%";
    };
});