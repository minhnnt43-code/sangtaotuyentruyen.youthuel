document.addEventListener('DOMContentLoaded', () => {

    /* =================================================================== */
    /* PHẦN 1: LOGIC MÀN HÌNH CHỜ & HIỂN THỊ NỘI DUNG                      */
    /* =================================================================== */
    const splashScreen = document.getElementById('splash-screen');
    const enterButton = document.getElementById('enter-button');
    const mainHeader = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');
    const mainFooter = document.getElementById('main-footer');
    const floatingContact = document.getElementById('floating-contact'); // Lấy nút gọi

    // Hàm đếm số mượt mà
    function animateCountUp(elementId, endValue, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        let startValue = 0; const stepTime = 10;
        const totalSteps = duration / stepTime; const increment = endValue / totalSteps;
        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++; startValue += increment;
            if (currentStep >= totalSteps) { startValue = endValue; clearInterval(timer); }
            element.textContent = Math.floor(startValue).toLocaleString('vi-VN') + "+";
        }, stepTime);
    }

    // Kích hoạt đếm số
    animateCountUp('stat-number-1', 99221200, 2000);
    animateCountUp('stat-number-2', 12500, 2200);
    animateCountUp('stat-number-3', 29000, 2500);

    // Sự kiện click nút "Đối mặt sự thật"
    if (enterButton) {
        enterButton.addEventListener('click', () => {
            splashScreen.style.opacity = '0';
            splashScreen.style.visibility = 'hidden';

            setTimeout(() => {
                splashScreen.style.display = 'none';
                if (mainHeader) mainHeader.classList.remove('initially-hidden');
                if (mainContent) mainContent.classList.remove('initially-hidden');
                if (mainFooter) mainFooter.classList.remove('initially-hidden');
                // Hiển thị nút gọi nổi cùng lúc
                if (floatingContact) floatingContact.classList.remove('initially-hidden');
            }, 800); // Khớp với transition trong CSS
        });
    }

    /* =================================================================== */
    /* PHẦN 2: CÁC TÍNH NĂNG TƯƠNG TÁC                                    */
    /* =================================================================== */

    // Logic Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('main-nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('is-open');
            mobileMenuBtn.classList.toggle('is-open');
        });

        // Tự động đóng menu khi người dùng click vào một link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('is-open')) {
                    navLinks.classList.remove('is-open');
                    mobileMenuBtn.classList.remove('is-open');
                }
            });
        });
    }
    
    // Lật thẻ khi click và nhấn phím
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        const flipAction = () => card.classList.toggle('is-flipped');
        
        card.addEventListener('click', flipAction);
        
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                flipAction();
            }
        });
    });

    // Chuyển Tab
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Thanh trượt so sánh hình ảnh
    const sliderContainer = document.querySelector('.before-after-slider');
    if (sliderContainer) {
        const imageAfter = sliderContainer.querySelector('img:last-of-type');
        const handle = document.createElement('div');
        handle.className = 'slider-handle';
        sliderContainer.appendChild(handle);
        let isDragging = false;
        
        const moveSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            let x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percent = (x / rect.width) * 100;
            handle.style.left = `${percent}%`;
            imageAfter.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
        };
        
        sliderContainer.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
        sliderContainer.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });
        window.addEventListener('touchmove', (e) => { if (isDragging) moveSlider(e.touches[0].clientX); });
    }

    /* =================================================================== */
    /* PHẦN 3: LOGIC CHATBOT                                               */
    /* =================================================================== */
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesContainer = document.getElementById('chat-messages');
    const quickBtns = document.querySelectorAll('.quick-reply-btn');

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.innerHTML = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getBotResponse(userText) {
        const msg = userText.toLowerCase();
        if (msg.includes('tác hại')) {
            return 'Ma túy hủy hoại não bộ, tim mạch, gia đình và dập tắt tương lai của bạn. Tuyệt đối đừng thử dù chỉ một lần!';
        } else if (msg.includes('từ chối')) {
            return 'Để từ chối, hãy dứt khoát: <b>"Không, cảm ơn. Tớ không dùng thứ này."</b> và bình tĩnh rời đi nếu cần thiết.';
        } else if (msg.includes('stress') || msg.includes('bế tắc')) {
            return 'Khi cảm thấy stress, hãy tìm đến thể thao, âm nhạc hoặc chia sẻ với người bạn tin tưởng. Đừng dùng chất kích thích, nó chỉ làm mọi thứ tồi tệ hơn. Bạn có thể gọi đến tổng đài 111 để được tư vấn miễn phí.';
        } else {
            return 'Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về "tác hại", "cách từ chối" hoặc "stress" nhé.';
        }
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';
            setTimeout(() => {
                const botReply = getBotResponse(text);
                addMessage(botReply, 'bot');
            }, 600);
        }
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.innerText;
            addMessage(text, 'user');
            setTimeout(() => {
                const botReply = getBotResponse(text);
                addMessage(botReply, 'bot');
            }, 600);
        });
    });
});