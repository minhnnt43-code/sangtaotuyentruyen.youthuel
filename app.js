/* =================================================================== */
/*  APP.JS - BỘ NÃO XỬ LÝ (FULL TÍNH NĂNG + TÊN CUTE)                  */
/* =================================================================== */

// 1. IMPORT FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, deleteDoc, doc, updateDoc, increment, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. CẤU HÌNH FIREBASE (Mã của bạn)
const firebaseConfig = {
  apiKey: "AIzaSyBC4VW7gGSYBzfkjP-MrUv3w0zvQGb_BX4",
  authDomain: "trangwebduthi1.firebaseapp.com",
  databaseURL: "https://trangwebduthi1-default-rtdb.firebaseio.com",
  projectId: "trangwebduthi1",
  storageBucket: "trangwebduthi1.firebasestorage.app",
  messagingSenderId: "86135080286",
  appId: "1:86135080286:web:3bbe4e80edb7a4074b3bcf",
  measurementId: "G-XNXFV62NTS"
};

// Khởi tạo
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Đăng nhập ẩn danh
signInAnonymously(auth).catch((error) => console.error("Lỗi Auth:", error));

// Biến trạng thái Admin (Mặc định false)
let isAdmin = false;

/* =================================================================== */
/*  BẮT ĐẦU LOGIC CHÍNH                                                */
/* =================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    // --- A. LOGIC GIAO DIỆN CŨ (SPLASH, SLIDER...) ---

    const splashScreen = document.getElementById('splash-screen');
    const enterButton = document.getElementById('enter-button');
    const mainHeader = document.getElementById('main-header');
    const mainContent = document.getElementById('main-content');
    const mainFooter = document.getElementById('main-footer');
    const floatingContact = document.getElementById('floating-contact');

    // 1. Đếm số (Animation)
    function animateCountUp(elementId, endValue, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        let start = 0;
        const steps = 50;
        const increment = endValue / steps;
        const timer = setInterval(() => {
            start += increment;
            if (start >= endValue) { start = endValue; clearInterval(timer); }
            element.textContent = Math.floor(start).toLocaleString('vi-VN') + "+";
        }, duration / steps);
    }
    
    animateCountUp('stat-number-1', 8000000, 2000);
    animateCountUp('stat-number-2', 3000000, 2000);
    animateCountUp('stat-number-3', 300000000, 2000);

    // 2. Vào trang chính
    if (enterButton) {
        enterButton.addEventListener('click', () => {
            splashScreen.style.opacity = '0'; // Mờ dần
            setTimeout(() => {
                splashScreen.style.display = 'none'; // Ẩn hẳn
                if(mainHeader) mainHeader.classList.remove('initially-hidden');
                if(mainContent) mainContent.classList.remove('initially-hidden');
                if(mainFooter) mainFooter.classList.remove('initially-hidden');
                if(floatingContact) floatingContact.classList.remove('initially-hidden');
                
                // Kích hoạt bộ đếm truy cập
                initVisitorCounter();
            }, 800);
        });
    }

    // 3. Menu Mobile
    const menuBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('main-nav-links');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => navLinks.classList.toggle('is-open'));
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('is-open')));
    }

    // 4. Lật thẻ (Flip Cards)
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('is-flipped'));
        card.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') card.classList.toggle('is-flipped');
        });
    });

    // 5. Chuyển Tab (Phần Tác hại)
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // 6. Slider Ảnh (SwiperJS)
    if (typeof Swiper !== 'undefined') {
        new Swiper('.my-image-slider', {
            loop: true, 
            grabCursor: true,
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
        });
    }


    // --- B. TÍNH NĂNG MỚI 1: GÓP Ý & TÊN CUTE ---
    const btnSendFeedback = document.getElementById('btn-send-feedback');
    const txtFeedbackName = document.getElementById('feedback-name');
    const txtFeedbackContent = document.getElementById('feedback-text');
    const feedbackListDiv = document.getElementById('feedback-list-container');

    // Danh sách tên cute
    const cuteNames = [
        "Thỏ Con Tò Mò 🐰", "Mèo Béo Ham Học 🐱", "Sóc Nâu Năng Động 🐿️", 
        "Gấu Trúc Hiền Lành 🐼", "Cáo Nhỏ Lanh Lợi 🦊", "Chim Sẻ Đi Nắng 🐦", 
        "Người Hùng Ẩn Danh 🦸", "Thám Tử Lừng Danh 🕵️", "Bạn Học Dễ Thương 😊",
        "Chiến Binh Diệt Ma Túy 🛡️"
    ];

    if (btnSendFeedback) {
        btnSendFeedback.addEventListener('click', async () => {
            const content = txtFeedbackContent.value.trim();
            let name = txtFeedbackName.value.trim();

            if (content.length < 5) { alert("Bạn hãy viết dài hơn một chút nhé!"); return; }

            // Nếu không nhập tên -> Chọn random tên cute
            if (!name) {
                const randomIndex = Math.floor(Math.random() * cuteNames.length);
                name = cuteNames[randomIndex];
            }

            try {
                await addDoc(collection(db, "feedback"), {
                    name: name,
                    content: content,
                    timestamp: Date.now()
                });
                txtFeedbackContent.value = "";
                txtFeedbackName.value = "";
                alert(`Cảm ơn "${name}" đã đóng góp ý kiến!`);
            } catch(e) {
                console.error(e);
                alert("Lỗi kết nối, vui lòng thử lại.");
            }
        });

        // Hiển thị danh sách góp ý (Realtime)
        loadFeedbacks();
    }

    function loadFeedbacks() {
        if(!feedbackListDiv) return;
        const q = query(collection(db, "feedback"), orderBy("timestamp", "desc"), limit(20));
        
        onSnapshot(q, (snapshot) => {
            feedbackListDiv.innerHTML = "";
            if (snapshot.empty) { feedbackListDiv.innerHTML = "<div class='feedback-item'>Chưa có góp ý nào. Hãy là người đầu tiên!</div>"; return; }

            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                const div = document.createElement('div');
                div.className = 'feedback-item';
                
                // Nút xóa cho Admin
                let delBtn = isAdmin ? `<button class="btn-del-fb" data-id="${docSnap.id}" style="color:red;float:right;border:none;cursor:pointer;">[Xóa]</button>` : "";

                div.innerHTML = `
                    ${delBtn}
                    <span class="fb-name">${data.name}</span>
                    <div class="fb-content">${data.content}</div>
                    <span class="fb-time">${new Date(data.timestamp).toLocaleDateString('vi-VN')}</span>
                `;
                feedbackListDiv.appendChild(div);
            });

            // Gắn sự kiện xóa
            if(isAdmin) {
                document.querySelectorAll('.btn-del-fb').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        if(confirm("Xóa góp ý này?")) await deleteDoc(doc(db, "feedback", e.target.dataset.id));
                    });
                });
            }
        });
    }


    // --- C. TÍNH NĂNG MỚI 2: BỘ ĐẾM TRUY CẬP ---
    async function initVisitorCounter() {
        const countEl = document.getElementById('visitor-count');
        if (!countEl) return;

        const docRef = doc(db, "site_stats", "visitors");
        try {
            await updateDoc(docRef, { count: increment(1) });
        } catch (e) {
            await setDoc(docRef, { count: 1 });
        }

        onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                countEl.innerHTML = `Lượt truy cập: <strong>${docSnap.data().count.toLocaleString('vi-VN')}</strong>`;
            }
        });
    }


    // --- D. TÍNH NĂNG MỚI 3: MÁY TÍNH TIỀN ---
    const btnCalc = document.getElementById('btn-calculate');
    if (btnCalc) {
        btnCalc.addEventListener('click', () => {
            const price = parseInt(document.getElementById('calc-type').value);
            const freq = parseInt(document.getElementById('calc-freq').value) || 0;
            
            if (freq <= 0) { alert("Vui lòng nhập số lượng hợp lệ!"); return; }

            const yearCost = price * freq * 52;
            const tenYearCost = yearCost * 10;

            document.getElementById('res-1year').textContent = yearCost.toLocaleString('vi-VN') + " đ";
            document.getElementById('res-10year').textContent = tenYearCost.toLocaleString('vi-VN') + " đ";
            document.getElementById('calc-result-box').classList.remove('hidden');
        });
    }


    // --- E. TÍNH NĂNG MỚI 4: TƯỜNG THÚ TỘI ---
    const btnPostConfess = document.getElementById('btn-post-confess');
    const txtConfess = document.getElementById('confess-content');
    const wallDiv = document.getElementById('confession-wall');

    if (btnPostConfess) {
        btnPostConfess.addEventListener('click', async () => {
            const content = txtConfess.value.trim();
            if (content.length < 10) { alert("Hãy chia sẻ cụ thể hơn nhé!"); return; }
            
            try {
                await addDoc(collection(db, "confessions"), {
                    content: content,
                    timestamp: Date.now()
                });
                txtConfess.value = "";
                alert("Đã gửi tâm sự (Ẩn danh)!");
            } catch(e) { console.error(e); }
        });
        loadConfessions();
    }

    function loadConfessions() {
        if(!wallDiv) return;
        const q = query(collection(db, "confessions"), orderBy("timestamp", "desc"), limit(8));
        onSnapshot(q, (snapshot) => {
            wallDiv.innerHTML = "";
            if (snapshot.empty) { wallDiv.innerHTML = "<div class='note-card'>Chưa có tâm sự nào...</div>"; return; }

            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                const div = document.createElement('div');
                div.className = 'note-card';
                let delBtn = isAdmin ? `<button class="btn-del-confess" data-id="${docSnap.id}" style="color:red;float:right;border:none;cursor:pointer;">[X]</button>` : "";
                
                div.innerHTML = `
                    ${delBtn}
                    <p>"${data.content}"</p>
                    <small style="display:block;margin-top:10px;color:#888;font-size:0.7rem">
                        ${new Date(data.timestamp).toLocaleDateString('vi-VN')}
                    </small>
                `;
                wallDiv.appendChild(div);
            });

            if(isAdmin) {
                document.querySelectorAll('.btn-del-confess').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        if(confirm("Xóa bài này?")) await deleteDoc(doc(db, "confessions", e.target.dataset.id));
                    });
                });
            }
        });
    }


    // --- F. TÍNH NĂNG MỚI 5: QUIZ GAME ---
    const btnStartQuiz = document.getElementById('btn-start-quiz');
    const btnRestartQuiz = document.getElementById('btn-restart');
    const quizPlayScreen = document.getElementById('quiz-play-screen');
    
    if (btnStartQuiz) {
        const questions = [
            { q: "Ma túy đá gây ra ảo giác gì?", a: ["Buồn ngủ", "Hoang tưởng (Ngáo)", "Đói bụng", "Sốt"], c: 1 },
            { q: "Tàng trữ 0.1g ma túy bị phạt tù bao lâu?", a: ["Cảnh cáo", "1-5 năm", "10 năm", "Không sao"], c: 1 },
            { q: "Khí N2O trong bóng cười gây hại gì?", a: ["Liệt tủy sống", "Trắng da", "Cười đẹp", "Tốt cho phổi"], c: 0 },
            { q: "Tổng đài hỗ trợ khẩn cấp trẻ em là?", a: ["113", "114", "115", "111"], c: 3 },
            { q: "Cỏ Mỹ thực chất là gì?", a: ["Thảo mộc tẩm độc", "Rau sạch", "Thuốc bổ", "Cỏ tự nhiên"], c: 0 }
        ];
        let currentQ = 0, score = 0, timer;

        btnStartQuiz.addEventListener('click', () => {
            const name = document.getElementById('player-name').value.trim();
            if(!name) { alert("Vui lòng nhập tên!"); return; }
            score = 0; currentQ = 0;
            document.getElementById('quiz-start-screen').classList.add('hidden');
            quizPlayScreen.classList.remove('hidden');
            loadQuestion();
        });

        if(btnRestartQuiz) {
            btnRestartQuiz.addEventListener('click', () => {
                document.getElementById('quiz-result-screen').classList.add('hidden');
                document.getElementById('quiz-start-screen').classList.remove('hidden');
            });
        }

        function loadQuestion() {
            if (currentQ >= questions.length) { endGame(); return; }
            const q = questions[currentQ];
            document.getElementById('question-text').textContent = `Câu ${currentQ+1}: ${q.q}`;
            const grid = document.getElementById('answers-grid');
            grid.innerHTML = '';

            let t = 100;
            const bar = document.getElementById('time-left');
            clearInterval(timer);
            timer = setInterval(() => {
                t -= 2; bar.style.width = t + '%';
                if (t <= 0) { clearInterval(timer); handleAns(-1); }
            }, 200);

            q.a.forEach((ans, i) => {
                const btn = document.createElement('button');
                btn.className = 'answer-btn';
                btn.textContent = ans;
                btn.onclick = () => handleAns(i);
                grid.appendChild(btn);
            });
        }

        function handleAns(idx) {
            clearInterval(timer);
            const correct = questions[currentQ].c;
            const btns = document.querySelectorAll('.answer-btn');
            if (idx === correct) { score += 20; if(btns[idx]) btns[idx].classList.add('correct'); } 
            else { if(btns[idx]) btns[idx].classList.add('wrong'); if(btns[correct]) btns[correct].classList.add('correct'); }
            setTimeout(() => { currentQ++; loadQuestion(); }, 1000);
        }

        async function endGame() {
            quizPlayScreen.classList.add('hidden');
            document.getElementById('quiz-result-screen').classList.remove('hidden');
            document.getElementById('final-score').textContent = score + "/100";
            const name = document.getElementById('player-name').value || "Ẩn danh";
            try { await addDoc(collection(db, "leaderboard"), { name: name, score: score, timestamp: Date.now() }); } catch(e) {}
        }
    }

    function loadLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        if(!list) return;
        onSnapshot(query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(5)), (snap) => {
            list.innerHTML = "";
            snap.forEach(docSnap => {
                const d = docSnap.data();
                let delBtn = isAdmin ? `<span class="del-score" data-id="${docSnap.id}" style="color:red;cursor:pointer;margin-left:5px;">[X]</span>` : "";
                const li = document.createElement('li');
                li.innerHTML = `<span>${d.name}</span> <span>${d.score}đ ${delBtn}</span>`;
                list.appendChild(li);
            });
            if(isAdmin) {
                document.querySelectorAll('.del-score').forEach(b => {
                    b.addEventListener('click', async (e) => { if(confirm("Xóa điểm này?")) await deleteDoc(doc(db, "leaderboard", e.target.dataset.id)); });
                });
            }
        });
    }
    loadLeaderboard();


    // --- G. CHATBOT & ADMIN ---
    const chatWindow = document.getElementById('chat-window');
    const chatToggle = document.getElementById('chat-toggle');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    const chatSend = document.getElementById('chat-send');

    if (chatToggle) {
        chatToggle.addEventListener('click', () => chatWindow.classList.remove('hidden'));
        chatClose.addEventListener('click', () => chatWindow.classList.add('hidden'));

        const botReply = (txt) => {
            let r = "Hiện tại trang web đang trong quá trình phát triển, mình chưa thể trả lời bạn được. Vui lòng thử lại sau nhé!";
            const lower = txt.toLowerCase();
            
            // --- ADMIN BACKDOOR ---
            if (txt === 'lamquocminh') {
                isAdmin = true;
                loadConfessions(); loadLeaderboard(); loadFeedbacks(); // Reload để hiện nút Xóa
                r = "🔓 <b>Đã bật Admin!</b> Bạn có thể xóa nội dung rác.";
            } else if (txt === 'logout') {
                isAdmin = false;
                loadConfessions(); loadLeaderboard(); loadFeedbacks();
                r = "🔒 Đã thoát Admin.";
            }
            else if (lower.includes('ma túy')) r = "Ma túy hủy hoại não bộ và tương lai. Đừng thử!";
            else if (lower.includes('buồn')) r = "Đừng buồn, hãy gọi 111 để được lắng nghe nhé.";
            
            const div = document.createElement('div');
            div.className = 'msg bot'; div.innerHTML = r;
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
        };

        const sendMsg = () => {
            const val = chatInput.value.trim();
            if(!val) return;
            const div = document.createElement('div');
            div.className = 'msg user'; div.textContent = val;
            chatBody.appendChild(div);
            chatInput.value = '';
            setTimeout(() => botReply(val), 500);
        };

        chatSend.addEventListener('click', sendMsg);
        chatInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMsg(); });
    }
});
