// ==========================================================================
// 1. INISIALISASI DASAR (ICONS, NAVBAR, THEME)
// Keterangan: Fungsi ini berjalan otomatis saat halaman pertama kali dimuat.
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Render icon Lucide
    lucide.createIcons();

    // Jalankan fungsi Dark/Light Mode
    initTheme();

    // Logika Mobile Menu (Hamburger Icon)
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Tutup menu mobile jika salah satu link diklik
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Inisialisasi logika Modal untuk halaman Projects
    initModals();
});

// ==========================================================================
// 2. FUNGSI THEME TOGGLE (DARK/LIGHT MODE)
// Keterangan: Menyimpan preferensi tema pengguna ke Local Storage browser.
// ==========================================================================
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (!themeBtn) return; // Mencegah error jika tombol tidak ada

    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        body.classList.add('light');
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light');
        
        if (body.classList.contains('light')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ==========================================================================
// 3. FUNGSI MODAL POP-UP (VERSI RINGAN)
// Keterangan: Array data telah dihapus. JS sekarang membaca atribut "data-*"
// langsung dari card HTML yang diklik, lalu menyisipkannya ke dalam Modal.
// Ini sangat meringankan kinerja browser.
// ==========================================================================
function initModals() {
    const modal = document.getElementById('project-modal');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!modal || projectCards.length === 0) return; // Berhenti jika bukan di halaman project

    const modalBody = modal.querySelector('.modal-body');
    const closeBtn = modal.querySelector('.close-modal');

    // Tambahkan event click ke setiap card project
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Ambil data langsung dari atribut HTML card yang diklik
            const title = this.getAttribute('data-title');
            const img = this.getAttribute('data-img');
            const desc = this.getAttribute('data-desc');
            const problem = this.getAttribute('data-problem');
            const solution = this.getAttribute('data-solution');
            const tools = this.getAttribute('data-tools');
            const impact = this.getAttribute('data-impact');
            const kpi = this.getAttribute('data-kpi');

            // Format badge untuk tools/teknologi (pisahkan koma menjadi span)
            const toolsArr = tools.split(', ');
            const toolsHTML = toolsArr.map(tool => `<span class="tag" style="margin-right:5px; margin-bottom:5px; display:inline-block; font-size:0.8rem;"><i data-lucide="cpu" style="width:12px; height:12px;"></i> ${tool}</span>`).join('');

            // Fallback gambar jika img kosong
            const imgSrc = img ? img : `https://via.placeholder.com/800x450/111827/00F0FF?text=${title.replace(/ /g, '+')}`;

            // Sisipkan struktur HTML ke dalam Modal
            modalBody.innerHTML = `
                <div class="modal-grid">
                    <div class="modal-img-container">
                        <img src="${imgSrc}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'">
                    </div>
                    <div class="modal-details">
                        <h2 class="modal-title">${title}</h2>
                        <p class="modal-short-desc">${desc}</p>
                        
                        <div class="modal-info-grid">
                            <div class="info-box">
                                <h4><i data-lucide="alert-circle"></i> Problem</h4>
                                <p>${problem}</p>
                            </div>
                            <div class="info-box">
                                <h4><i data-lucide="lightbulb"></i> Solution</h4>
                                <p>${solution}</p>
                            </div>
                            <div class="info-box">
                                <h4><i data-lucide="trending-up"></i> Impact</h4>
                                <p>${impact}</p>
                            </div>
                            <div class="info-box">
                                <h4><i data-lucide="wrench"></i> Tech Stack</h4>
                                <div style="margin-top: 10px;">${toolsHTML}</div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <span class="text-muted" style="color: var(--text-muted);">Key Performance Indicator:</span>
                            <div class="modal-kpi-highlight">
                                <i data-lucide="target"></i> ${kpi}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Render ulang icon Lucide khusus di dalam modal
            lucide.createIcons();

            // Tampilkan modal dan kunci scroll latar belakang
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });

    // Fungsi untuk menutup modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Kembalikan scroll latar belakang
    }

    // Trigger tutup modal jika tombol X diklik
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Trigger tutup modal jika area luar (background hitam) diklik
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Trigger tutup modal jika tombol Escape di keyboard ditekan
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

// ==========================================================================
// 4. FUNGSI FORM KONTAK (GOOGLE APPS SCRIPT)
// Keterangan: Menangani pengiriman pesan tanpa reload halaman.
// ==========================================================================
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const formStatus = document.getElementById('form-status');

// URL Web App dari Google Apps Script
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3TsbwKdzqG9V_yeoXIDVjtsigSotFAkeb1R8oJM93Er_xeKnUoD-eufRqZOf7_zw/exec';

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Tampilan tombol saat loading
        submitBtn.disabled = true;
        btnText.textContent = 'Mengirim...';
        formStatus.style.display = 'none';

        // Ambil isi input
        const formData = {
            user_name: document.getElementById('name').value,
            user_email: document.getElementById('email').value,
            user_message: document.getElementById('message').value
        };

        try {
            // Eksekusi pengiriman data ke Apps Script
            const response = await fetch(GAS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', 
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // Evaluasi respon dari Apps Script
            if (result.result === 'success') {
                formStatus.style.display = 'block';
                formStatus.style.color = '#10b981'; // Hijau
                formStatus.textContent = '✅ Pesan berhasil terkirim! Terima kasih telah menghubungi.';
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Gagal mengirim pesan');
            }
        } catch (error) {
            console.error('Error:', error);
            formStatus.style.display = 'block';
            formStatus.style.color = '#ef4444'; // Merah
            formStatus.textContent = '❌ Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
        } finally {
            // Kembalikan tombol ke keadaan semula
            submitBtn.disabled = false;
            btnText.textContent = 'Kirim Pesan';
        }
    });
}