// =========================================
// 1. 텍스트 스크램블 애니메이션 (60Hz 정밀 보정 버전)
// =========================================
class TextScrambler {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#@&%0123456789';
        this.update = this.update.bind(this);
        
        // --- [60Hz 환경 역산 정밀 상수 설정] ---
        this.FRAME_TIME = 1000 / 60; // 60Hz의 1프레임 = 16.666...ms
        
        // 60Hz에서 Math.random() < 0.28 일 때 문자가 바뀌는 주기 (약 59.5ms)
        this.SCRAMBLE_INTERVAL = this.FRAME_TIME / 0.28; 
        
        // 60Hz에서 최대 40프레임 = 약 666.67ms
        this.MAX_START_DELAY = 40 * this.FRAME_TIME; 
        this.MAX_DURATION = 40 * this.FRAME_TIME; 
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            
            // 60Hz 환경에서의 프레임 기반 무작위성을 시간(ms)으로 정확히 환산
            const start = Math.floor(Math.random() * this.MAX_START_DELAY);
            const end = start + Math.floor(Math.random() * this.MAX_DURATION);

            this.queue.push({ 
                from, 
                to, 
                start, 
                end, 
                lastScrambleTime: 0, 
                char: '' 
            });
        }

        cancelAnimationFrame(this.frameRequest);
        this.startTime = null;
        this.frameRequest = requestAnimationFrame(this.update);

        return promise;
    }

    update(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime; // 애니메이션 시작 후 경과 시간

        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let item = this.queue[i];

            if (elapsed >= item.end) {
                // 목표 시간 도달 시 정답 글자 고정
                complete++;
                output += item.to;
            } else if (elapsed >= item.start) {
                // 60Hz 기준 28% 확률(약 59.5ms 주기)과 동일한 간격으로만 글자 변경
                if (!item.char || (timestamp - item.lastScrambleTime) >= this.SCRAMBLE_INTERVAL) {
                    item.char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    item.lastScrambleTime = timestamp;
                }
                output += `<span style="color: var(--accent-color)">${item.char}</span>`;
            } else {
                // 시작 전에는 기존 글자 유지
                output += item.from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
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
    toast.setAttribute('role', 'status'); // 스크린 리더용 알림 선언
    toast.setAttribute('aria-live', 'polite'); // 안내 음성이 겹치지 않게 대기
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
        overlay.setAttribute('role', 'dialog'); // 이게 팝업 창임을 알려줌
        overlay.setAttribute('aria-modal', 'true'); // 팝업 뒤 배경은 잠겼음을 알려줌
        overlay.setAttribute('aria-label', '확인 메시지');
        overlay.innerHTML = `
            <div class="confirm-box">
                <p class="confirm-message">${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn no" id="confirm-btn-cancel">CANCEL</button>
                    <button class="confirm-btn yes" id="confirm-btn-ok">CONFIRM<span aria-hidden="true">_</span></button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 표시 애니메이션 적용을 위한 딜레이
        setTimeout(() => {
            overlay.classList.add('show');
            // 창이 뜨면 키보드 초점을 '취소' 버튼으로 자동 이동
            const cancelBtn = overlay.querySelector('#confirm-btn-cancel');
            if (cancelBtn) cancelBtn.focus();
        }, 10);

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