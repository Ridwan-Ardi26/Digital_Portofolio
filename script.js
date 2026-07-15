// Smooth scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Interaksi sederhana untuk tombol tema (bisa dikembangkan nanti)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    // Saat ini sekadar mengganti ikon sebagai indikator interaktif
    const icon = themeToggle.querySelector('i');
    if (icon.classList.contains('fa-moon')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        icon.style.color = '#F59E0B'; // Warna kuning saat menjadi matahari
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        icon.style.color = ''; // Kembali ke warna semula
    }
});