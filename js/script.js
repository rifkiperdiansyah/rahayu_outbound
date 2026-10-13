/**
 * Rahayu Outbound - Interactive Script
 * - Hero Background Slider (Autoplay, Manual controls, Touch support)
 * - Scroll Reveal Animations (IntersectionObserver)
 * - Mobile Navigation Toggle
 * - Package Detail & WhatsApp Booking Modal
 * - Gallery Filter & Lightbox Preview
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initMobileMenu();
  initScrollReveal();
  initScrollSpy();
  initPackageModal();
  initGalleryFilter();
});

/* -------------------------------------------------------------
 * 1. HERO SLIDER
 * ------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  
  if (!slides.length) return;

  let currentIndex = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('bg-emerald-500', 'w-8');
        dot.classList.remove('bg-white/50', 'w-3');
      } else {
        dot.classList.remove('bg-emerald-500', 'w-8');
        dot.classList.add('bg-white/50', 'w-3');
      }
    });
    currentIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  // Event Listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoplay();
    });
  });

  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }

  showSlide(0);
  startAutoplay();
}

/* -------------------------------------------------------------
 * 2. MOBILE MENU TOGGLE
 * ------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* -------------------------------------------------------------
 * 3. SCROLL REVEAL ANIMATION
 * ------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(element => observer.observe(element));
}

/* -------------------------------------------------------------
 * 4. SCROLL SPY ACTIVE NAV LINK
 * ------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-emerald-400', 'border-b-2', 'border-emerald-400');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-emerald-400', 'border-b-2', 'border-emerald-400');
      }
    });
  });
}

/* -------------------------------------------------------------
 * ONEDAY TAB FILTER SWITCHER (GLASSMORPHISM STYLE)
 * ------------------------------------------------------------- */
function initOnedayFilter() {
  const tabBtns = document.querySelectorAll('.oneday-tab-btn');
  const packageCards = document.querySelectorAll('.oneday-card');

  if (!tabBtns.length || !packageCards.length) return;

  function filterOnedayCards(tabValue) {
    packageCards.forEach(card => {
      const cardCat = card.dataset.category;
      if (tabValue === 'all' || cardCat === tabValue) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Style Non-aktif Glass
      tabBtns.forEach(b => {
        b.classList.remove('active', 'bg-emerald-500/70', 'border-emerald-400/60', 'text-emerald-700', 'shadow-emerald-500/10');
        b.classList.add('bg-slate-400/40', 'text-slate-100', 'hover:bg-slate-800/60', 'border-slate/10');
      });

      // Style Aktif Glass
      btn.classList.add('active', 'bg-emerald-500/70', 'border-emerald-400/60', 'text-emerald-700', 'shadow-emerald-500/10');
      btn.classList.remove('bg-slate-400/40', 'text-slate-300', 'hover:bg-emerald-800/60', 'border-slate/10');

      const targetTab = btn.dataset.onedayTab;
      filterOnedayCards(targetTab);
    });
  });

  filterOnedayCards('satuan');
}

/* -------------------------------------------------------------
 * CUSTOM PACKAGE CALCULATOR LOGIC (GLASSMORPHISM STYLE)
 * ------------------------------------------------------------- */
function initCustomPackageCalculator() {
  const inputParticipants = document.getElementById('custom-participants');
  const btnInc = document.getElementById('btn-inc-participants');
  const btnDec = document.getElementById('btn-dec-participants');
  const itemCheckboxes = document.querySelectorAll('.custom-item-cb');
  const totalPriceEl = document.getElementById('custom-total-price');
  const summaryTextEl = document.getElementById('custom-summary-text');
  const btnWa = document.getElementById('btn-custom-order-wa');

  if (!inputParticipants || !itemCheckboxes.length) return;

  function calculateCustomTotal() {
    let numParticipants = parseInt(inputParticipants.value) || 5;

    if (numParticipants < 5) {
      numParticipants = 5;
      inputParticipants.value = 5;
    }

    let grandTotal = 0;
    let selectedItems = [];

    itemCheckboxes.forEach(cb => {
      if (cb.checked) {
        const itemPrice = parseInt(cb.value);
        const itemName = cb.dataset.name;
        const itemType = cb.dataset.type;

        if (itemType === 'pax') {
          const subtotal = itemPrice * numParticipants;
          grandTotal += subtotal;
          selectedItems.push(`${itemName} (${numParticipants} pax)`);
        } else {
          grandTotal += itemPrice;
          selectedItems.push(`${itemName} (1 unit)`);
        }
      }
    });

    totalPriceEl.textContent = 'Rp ' + grandTotal.toLocaleString('id-ID');

    if (selectedItems.length > 0) {
      summaryTextEl.textContent = `${numParticipants} Peserta • ${selectedItems.length} Wahana Terpilih`;
    } else {
      summaryTextEl.textContent = 'Pilih minimal 1 wahana di atas';
    }

    return { numParticipants, grandTotal, selectedItems };
  }

  btnInc.addEventListener('click', () => {
    inputParticipants.value = parseInt(inputParticipants.value || 5) + 1;
    calculateCustomTotal();
  });

  btnDec.addEventListener('click', () => {
    let current = parseInt(inputParticipants.value || 5);
    if (current > 5) {
      inputParticipants.value = current - 1;
      calculateCustomTotal();
    }
  });

  inputParticipants.addEventListener('input', calculateCustomTotal);

  itemCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const parentLabel = e.target.closest('.custom-wahana-item');
      if (e.target.checked) {
        parentLabel.classList.add('border-emerald-400/90', 'bg-emerald-500/80');
        parentLabel.classList.remove('border-slate/10', 'bg-white/5');
      } else {
        parentLabel.classList.remove('border-emerald-400/60', 'bg-emerald-500/90');
        parentLabel.classList.add('border-emerald/10', 'bg-emerald/5');
      }
      calculateCustomTotal();
    });
  });

  btnWa.addEventListener('click', () => {
    const { numParticipants, grandTotal, selectedItems } = calculateCustomTotal();

    if (selectedItems.length === 0) {
      alert('Silakan pilih minimal 1 wahana terlebih dahulu!');
      return;
    }

    const phone = '6283820430062';
    let message = `Halo Rahayu Outbound, saya ingin memesan *Paket Custom Outbound*:\n\n`;
    message += `👥 *Jumlah Peserta*: ${numParticipants} Orang\n`;
    message += `🎯 *Aktivitas Terpilih*:\n`;
    selectedItems.forEach(item => {
      message += ` - ${item}\n`;
    });
    message += `\n💰 *Estimasi Total*: Rp ${grandTotal.toLocaleString('id-ID')}\n\n`;
    message += `Mohon info ketersediaan tanggal dan konfirmasi pesanannya ya. Terima kasih!`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  });

  calculateCustomTotal();
}

document.addEventListener('DOMContentLoaded', () => {
  initOnedayFilter();
  initCustomPackageCalculator();
});
/* -------------------------------------------------------------
 * 5. PACKAGE MODAL & WHATSAPP INTEGRATION
 * ------------------------------------------------------------- */
function initPackageModal() {
  const modal = document.getElementById('packageModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalPrice = document.getElementById('modalPrice');
  const modalBadge = document.getElementById('modalBadge');
  const modalDesc = document.getElementById('modalDesc');
  const modalList = document.getElementById('modalList');
  const modalWaBtn = document.getElementById('modalWaBtn');

  if (!modal) return;

  // Open modal on click of detail buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-detail');
    if (!btn) return;

    const data = {
      title: btn.dataset.title || 'Paket Outbound Rahayu',
      image: btn.dataset.image || 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=800&q=80',
      price: btn.dataset.price || 'Hubungi Admin',
      badge: btn.dataset.badge || 'Paket Favorit',
      desc: btn.dataset.desc || 'Fasilitas lengkap outbound seru dengan perlengkapan standar keamanan internasional dan instruktur profesional.',
      items: btn.dataset.items ? btn.dataset.items.split('|') : ['Welcome Drink', 'Fun Games & Team Building', 'Makan Siang Buffer', 'Spanduk Kegiatan', 'Instruktur & Master Game', 'Peralatan Safety Lengkap', 'Dokumentasi Foto/Video', 'P3K & Asuransi']
    };

    modalTitle.textContent = data.title;
    modalImage.src = data.image;
    modalImage.alt = data.title;
    modalPrice.textContent = data.price;
    modalBadge.textContent = data.badge;
    modalDesc.textContent = data.desc;

    // Render feature list
    modalList.innerHTML = data.items.map(item => `
      <li class="flex items-center space-x-2 text-slate-700">
        <svg class="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        <span>${item.trim()}</span>
      </li>
    `).join('');

    // Dynamic WhatsApp Link
    const waText = encodeURIComponent(`Halo Admin Rahayu Outbound! Saya tertarik untuk konsultasi dan melakukan pemesanan *${data.title}* (${data.price}). Mohon info ketersediaan tanggal dan penawarannya.`);
    modalWaBtn.href = `https://wa.me/6281234567890?text=${waText}`;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  // Close modal events
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------
 * 6. GALLERY FILTER & LIGHTBOX PREVIEW
 * ------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('closeLightbox');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-200', 'border', 'border-slate-200');
      });

      btn.classList.add('bg-emerald-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-200', 'border', 'border-slate-200');

      const filterValue = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox Preview
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || img.alt;
      
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}
