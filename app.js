document.addEventListener('DOMContentLoaded', () => {

    /* =================================================================== */
    /* PHẦN 1: LOGIC MÀN HÌNH CHỜ & HIỂN THỊ NỘI DUNG                      */
    /* =================================================================== */
    const splashScreen = document.getElementById('splash-screen');
    const enterButton = document.getElementById('enter-button');
    const mainHeader = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');
    const mainFooter = document.getElementById('main-footer');
    const floatingContact = document.getElementById('floating-contact');

    // Hàm đếm số mượt mà
    function animateCountUp(elementId, endValue, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        let startValue = 0; const stepTime = 1;
        const totalSteps = duration / stepTime; const increment = endValue / totalSteps;
        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++; startValue += increment;
            if (currentStep >= totalSteps) { startValue = endValue; clearInterval(timer); }
            element.textContent = Math.floor(startValue).toLocaleString('vi-VN') + "+";
        }, stepTime);
    }

    // Kích hoạt đếm số
    animateCountUp('stat-number-1', 8000000, 3000);
    animateCountUp('stat-number-2', 3000000, 2800);
    animateCountUp('stat-number-3', 300000000, 2600);

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
                if (floatingContact) floatingContact.classList.remove('initially-hidden');
            }, 800);
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

    // ----- KHỞI TẠO THƯ VIỆN ẢNH SWIPERJS (THAY THẾ CODE CŨ) -----
    const swiper = new Swiper('.my-image-slider', {
        // Các thông số tùy chọn
        loop: true, // Cho phép lặp lại vô tận
        grabCursor: true, // Biến con trỏ thành hình bàn tay khi hover

        // Thanh cuộn (Scrollbar)
        scrollbar: {
          el: '.swiper-scrollbar',
          draggable: true, // Cho phép kéo thanh cuộn
        },

        // Nút điều hướng (Navigation arrows)
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
    });


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
        const msg = userText.toLowerCase().trim();
        
        if (msg === 'tác hại của ma túy') { return 'Ma túy hủy hoại não bộ, tim mạch, gia đình và dập tắt tương lai của bạn. Tuyệt đối đừng thử dù chỉ một lần!'; }
        if (msg === 'làm sao để từ chối?') { return 'Để từ chối, hãy dứt khoát: <b>"Không, cảm ơn. Tớ không dùng thứ này."</b> và bình tĩnh rời đi nếu cần thiết.'; }
        if (msg === 'tôi đang cảm thấy stress') { return 'Khi cảm thấy stress, hãy tìm đến thể thao, âm nhạc hoặc chia sẻ với người bạn tin tưởng. Đừng dùng chất kích thích, nó chỉ làm mọi thứ tồi tệ hơn. Bạn có thể gọi đến tổng đài 111 để được tư vấn miễn phí.'; }
        if (msg === 'tác hại của rượu bia') { return 'Rượu bia tuy hợp pháp nhưng lạm dụng sẽ gây hại gan, thận, và làm mất kiểm soát hành vi. Hãy uống có chừng mực để bảo vệ sức khỏe và an toàn cho bản thân cũng như những người xung quanh.'; }
        
        if (msg.includes('ma túy') || msg.includes('tác hại')) { return 'Ma túy hủy hoại não bộ, tim mạch, gia đình và dập tắt tương lai của bạn. Tuyệt đối đừng thử dù chỉ một lần!'; } 
        else if (msg.includes('từ chối')) { return 'Để từ chối, hãy dứt khoát: <b>"Không, cảm ơn. Tớ không dùng thứ này."</b> và bình tĩnh rời đi nếu cần thiết.'; } 
        else if (msg.includes('stress') || msg.includes('bế tắc') || msg.includes('buồn')) { return 'Khi cảm thấy stress, hãy tìm đến thể thao, âm nhạc hoặc chia sẻ với người bạn tin tưởng. Đừng dùng chất kích thích, nó chỉ làm mọi thứ tồi tệ hơn. Bạn có thể gọi đến tổng đài 111 để được tư vấn miễn phí.'; } 
        else if (msg.includes('rượu') || msg.includes('bia')) { return 'Rượu bia tuy hợp pháp nhưng lạm dụng sẽ gây hại gan, thận, và làm mất kiểm soát hành vi. Hãy uống có chừng mực để bảo vệ sức khỏe và an toàn cho bản thân cũng như những người xung quanh.'; } 
        else { return 'Cảm ơn bạn đã quan tâm. Hiện tại, các câu trả lời tự động đang được cập nhật thêm. Nếu bạn cần hỗ trợ khẩn cấp, hãy gọi tổng đài 111 nhé.'; }
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

