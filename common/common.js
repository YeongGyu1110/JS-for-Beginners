// =========================================
// 1. 텍스트 스크램블 애니메이션 (main, chapter)
// =========================================
class TextScrambler {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#@&%0123456789';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span style="color: var(--accent-color)">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// =========================================
// 2. 토스트 알림창 (Toast Notification)
// =========================================
window.showToast = (message) => {
    let existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

// =========================================
// 3. 상단 스크롤 진행률 바 (Progress Bar)
// =========================================
window.initProgressBar = () => {
    window.addEventListener('scroll', () => {
        const bar = document.getElementById("myBar");
        if(!bar) return;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
};

// =========================================
// 4. 커스텀 확인 창 (Confirm Dialog)
// =========================================
window.showConfirm = (message) => {
    return new Promise((resolve) => {
        // 기존 열려 있는 창이 있다면 제거
        const existing = document.querySelector('.confirm-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="confirm-box">
                <p class="confirm-message">${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn no" id="confirm-btn-cancel">CANCEL</button>
                    <button class="confirm-btn yes" id="confirm-btn-ok">CONFIRM_</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 표시 애니메이션 적용을 위한 딜레이
        setTimeout(() => overlay.classList.add('show'), 10);

        const handleResolve = (value) => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                resolve(value);
            }, 200); // CSS transition 시간 매칭
        };

        // 이벤트 리스너 바인딩
        overlay.querySelector('#confirm-btn-ok').addEventListener('click', () => handleResolve(true));
        overlay.querySelector('#confirm-btn-cancel').addEventListener('click', () => handleResolve(false));
        
        // 배경을 클릭해도 취소된 것으로 처리
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) handleResolve(false);
        });
    });
};