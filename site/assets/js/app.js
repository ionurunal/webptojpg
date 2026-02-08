/**
 * HAREM GECE KULÜBÜ - Uygulama JS
 * Bağımlılık: content.js (SITE_CONTENT global)
 * İşlevler: Header/Footer enjeksiyon, menü, accordion, galeri,
 *           yorumlar, SSS, harita lazy-load, floating butonlar
 */

(function () {
  "use strict";

  // ─── SVG İKONLARI ────────────────────────────────────
  const ICONS = {
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    starEmpty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2h8l-2 9H10L8 2z"/><path d="M12 11v9"/><path d="M8 22h8"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.81.13v-3.5a6.37 6.37 0 00-.81-.05A6.34 6.34 0 003.15 15.4a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.25a8.27 8.27 0 004.76 1.5V7.3a4.83 4.83 0 01-1-.61z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>'
  };

  const C = SITE_CONTENT;

  // ─── YARDIMCI FONKSİYONLAR ───────────────────────────
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  function whatsappUrl() {
    return "https://wa.me/" + C.whatsappNumber + "?text=" + encodeURIComponent(C.whatsappMessage);
  }

  function phoneUrl() {
    return "tel:" + C.phoneRaw;
  }

  function getIcon(name) {
    return ICONS[name] || "";
  }

  function starsHtml(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += i <= rating ? getIcon("star") : getIcon("starEmpty");
    }
    return html;
  }

  // ─── HEADER OLUŞTUR ──────────────────────────────────
  function buildHeader(activePage) {
    const navItems = C.navigation.map(function (item) {
      var cls = "nav__link";
      if (item.url === activePage) cls += " nav__link--active";
      return '<li><a href="' + item.url + '" class="' + cls + '">' + item.label + "</a></li>";
    }).join("");

    return '<header class="header" role="banner">' +
      '<div class="container header__inner">' +
        '<a href="index.html" class="header__logo" aria-label="' + C.siteName + ' Ana Sayfa">' +
          C.siteName.split(" ").map(function(w,i){ return i===0 ? '<span>'+w+'</span>' : w; }).join(" ") +
        '</a>' +
        '<button class="hamburger" aria-label="Menüyü aç/kapat" aria-expanded="false" aria-controls="main-nav">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
        '<nav class="nav" id="main-nav" role="navigation" aria-label="Ana menü">' +
          '<ul class="nav__list">' + navItems + '</ul>' +
          '<div class="nav__cta">' +
            '<a href="' + whatsappUrl() + '" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--sm">' +
              getIcon("whatsapp") + ' WhatsApp</a>' +
            '<a href="' + phoneUrl() + '" class="btn btn--primary btn--sm">' +
              getIcon("phone") + ' Ara</a>' +
          '</div>' +
        '</nav>' +
        '<div class="nav-overlay" aria-hidden="true"></div>' +
      '</div>' +
    '</header>';
  }

  // ─── FOOTER OLUŞTUR ──────────────────────────────────
  function buildFooter() {
    var navLinks = C.navigation.map(function (item) {
      return '<a href="' + item.url + '">' + item.label + "</a>";
    }).join("");

    var socialLinks = "";
    if (C.social.instagram) socialLinks += '<a href="' + C.social.instagram + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' + getIcon("instagram") + '</a>';
    if (C.social.tiktok) socialLinks += '<a href="' + C.social.tiktok + '" target="_blank" rel="noopener noreferrer" aria-label="TikTok">' + getIcon("tiktok") + '</a>';
    if (C.social.youtube) socialLinks += '<a href="' + C.social.youtube + '" target="_blank" rel="noopener noreferrer" aria-label="YouTube">' + getIcon("youtube") + '</a>';

    var year = new Date().getFullYear();

    return '<footer class="footer" role="contentinfo">' +
      '<div class="container">' +
        '<div class="footer__grid">' +
          '<div>' +
            '<a href="index.html" class="header__logo">' + C.siteName + '</a>' +
            '<p class="footer__brand-desc">' + C.footer.description + '</p>' +
            '<div class="footer__social">' + socialLinks + '</div>' +
          '</div>' +
          '<div>' +
            '<h3 class="footer__heading">Sayfalar</h3>' +
            '<div class="footer__links">' + navLinks + '</div>' +
          '</div>' +
          '<div>' +
            '<h3 class="footer__heading">İletişim</h3>' +
            '<div class="footer__links">' +
              '<a href="' + phoneUrl() + '">' + C.phone + '</a>' +
              '<a href="' + whatsappUrl() + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
              '<a href="mailto:' + C.email + '">' + C.email + '</a>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<h3 class="footer__heading">Çalışma Saatleri</h3>' +
            '<div class="footer__links">' +
              '<span>' + C.hours.weekdays + '</span>' +
              '<span>' + C.hours.weekend + '</span>' +
              '<span style="font-size:.8125rem;margin-top:.25rem">' + C.hours.note + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<p>&copy; ' + year + ' ' + C.footer.copyright + '</p>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  // ─── FLOATING BUTONLAR ───────────────────────────────
  function buildFloating() {
    return '<div class="floating" aria-label="Hızlı iletişim butonları">' +
      '<a href="' + phoneUrl() + '" class="floating__btn floating__btn--phone" aria-label="Hemen Ara">' + getIcon("phone") + '</a>' +
      '<a href="' + whatsappUrl() + '" target="_blank" rel="noopener noreferrer" class="floating__btn floating__btn--whatsapp" aria-label="WhatsApp ile iletişime geç">' + getIcon("whatsapp") + '</a>' +
    '</div>';
  }

  // ─── HERO BÖLÜMÜ ─────────────────────────────────────
  function renderHero() {
    var el = qs("#hero-section");
    if (!el) return;

    var h = C.hero;
    el.innerHTML =
      '<div class="hero__bg">' +
        '<img src="' + h.image.src + '" alt="' + h.image.alt + '" width="' + h.image.width + '" height="' + h.image.height + '" loading="eager" fetchpriority="high">' +
      '</div>' +
      '<div class="hero__overlay"></div>' +
      '<div class="container hero__content">' +
        '<h1 class="hero__title">' + h.title.replace("Kıbrıs'ın", '<span>Kıbrıs\'ın</span>') + '</h1>' +
        '<p class="hero__subtitle">' + h.subtitle + '</p>' +
        '<div class="hero__cta">' +
          '<a href="' + whatsappUrl() + '" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp">' + getIcon("whatsapp") + " " + h.cta1.text + '</a>' +
          '<a href="' + phoneUrl() + '" class="btn btn--primary">' + getIcon("phone") + " " + h.cta2.text + '</a>' +
        '</div>' +
      '</div>';
  }

  // ─── NEDEN BİZ ───────────────────────────────────────
  function renderWhyUs() {
    var el = qs("#why-section");
    if (!el) return;

    var cards = C.whyUs.items.map(function (item) {
      return '<div class="why-card">' +
        '<div class="why-card__icon">' + getIcon(item.icon) + '</div>' +
        '<h3 class="why-card__title">' + item.title + '</h3>' +
        '<p class="why-card__desc">' + item.description + '</p>' +
      '</div>';
    }).join("");

    el.innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + C.whyUs.sectionTitle + '</h2>' +
        '<div class="why-grid">' + cards + '</div>' +
      '</div>';
  }

  // ─── REHBER TEASER ───────────────────────────────────
  function renderTeaser() {
    var el = qs("#teaser-section");
    if (!el) return;

    el.innerHTML =
      '<div class="container">' +
        '<div class="teaser">' +
          '<h2 class="teaser__title">Kıbrıs Gece Kulüpleri Rehberi</h2>' +
          '<p class="teaser__text">Kuzey Kıbrıs\'taki en iyi gece kulüpleri, barlar ve eğlence mekanları hakkında detaylı bilgi edinin. Gazimağusa, Girne ve Lefkoşa gece hayatı rehberimize göz atın.</p>' +
          '<a href="kibris-gece-kulupleri-rehberi.html" class="btn btn--outline">Rehberi İncele ' + getIcon("chevronRight") + '</a>' +
        '</div>' +
      '</div>';
  }

  // ─── GALERİ ──────────────────────────────────────────
  function renderGallery() {
    var el = qs("#gallery-section");
    if (!el) return;

    var cards = C.gallery.images.map(function (img) {
      return '<div class="gallery-card">' +
        '<div class="gallery-card__placeholder">' +
          '<span>' + img.alt + '<br><small>(' + img.src + ')</small></span>' +
        '</div>' +
        '<!--<img src="' + img.src + '" alt="' + img.alt + '" width="' + img.width + '" height="' + img.height + '" loading="lazy">-->' +
      '</div>';
    }).join("");

    el.innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + C.gallery.sectionTitle + '</h2>' +
        '<div class="gallery-grid">' + cards + '</div>' +
      '</div>';
  }

  // ─── YORUMLAR ────────────────────────────────────────
  function renderTestimonials() {
    var el = qs("#testimonials-section");
    if (!el) return;

    var cards = C.testimonials.items.map(function (t) {
      return '<div class="testimonial-card">' +
        '<div class="testimonial-card__stars" aria-label="' + t.rating + ' yıldız">' + starsHtml(t.rating) + '</div>' +
        '<p class="testimonial-card__text">"' + t.text + '"</p>' +
        '<div class="testimonial-card__author">' +
          '<div class="testimonial-card__avatar">' + t.name + '</div>' +
          '<div>' +
            '<div class="testimonial-card__name">' + t.name + '</div>' +
            '<div class="testimonial-card__info">' + t.location + ' · ' + t.date + '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join("");

    el.innerHTML =
      '<div class="container">' +
        '<h2 class="section-title">' + C.testimonials.sectionTitle + '</h2>' +
        '<div class="testimonials-grid">' + cards + '</div>' +
      '</div>';
  }

  // ─── SSS ACCORDION ──────────────────────────────────
  function renderFaq(targetSelector) {
    var el = qs(targetSelector || "#faq-section");
    if (!el) return;

    var items = C.faq.map(function (f, i) {
      return '<div class="faq-item">' +
        '<button class="faq-item__btn" aria-expanded="false" aria-controls="faq-answer-' + i + '">' +
          '<span>' + f.question + '</span>' +
          '<span class="faq-item__icon">' + getIcon("plus") + '</span>' +
        '</button>' +
        '<div class="faq-item__answer" id="faq-answer-' + i + '" role="region">' +
          '<div class="faq-item__answer-inner">' + f.answer + '</div>' +
        '</div>' +
      '</div>';
    }).join("");

    var titleHtml = el.dataset.noTitle ? "" : '<h2 class="section-title">Sık Sorulan Sorular</h2>';

    el.innerHTML =
      '<div class="container">' +
        titleHtml +
        '<div class="faq-list">' + items + '</div>' +
      '</div>';

    // Accordion logic
    qsa(".faq-item__btn", el).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.parentElement;
        var answer = qs(".faq-item__answer", item);
        var isOpen = item.classList.contains("faq-item--open");

        // Close all
        qsa(".faq-item", el).forEach(function (fi) {
          fi.classList.remove("faq-item--open");
          var a = qs(".faq-item__answer", fi);
          a.style.maxHeight = null;
          qs(".faq-item__btn", fi).setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("faq-item--open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  // ─── İLETİŞİM KARTLARI ──────────────────────────────
  function renderContact() {
    var el = qs("#contact-cards");
    if (!el) return;

    el.innerHTML =
      '<div class="contact-card">' +
        '<div class="contact-card__icon">' + getIcon("phone") + '</div>' +
        '<h3 class="contact-card__title">Telefon</h3>' +
        '<p class="contact-card__text"><a href="' + phoneUrl() + '">' + C.phone + '</a></p>' +
        '<a href="' + phoneUrl() + '" class="btn btn--primary btn--sm">' + getIcon("phone") + ' Hemen Ara</a>' +
      '</div>' +
      '<div class="contact-card">' +
        '<div class="contact-card__icon">' + getIcon("whatsapp") + '</div>' +
        '<h3 class="contact-card__title">WhatsApp</h3>' +
        '<p class="contact-card__text">En hızlı dönüş için WhatsApp tercih edebilirsiniz.</p>' +
        '<a href="' + whatsappUrl() + '" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--sm">' + getIcon("whatsapp") + ' WhatsApp\'tan Yaz</a>' +
      '</div>' +
      '<div class="contact-card">' +
        '<div class="contact-card__icon">' + getIcon("mail") + '</div>' +
        '<h3 class="contact-card__title">E-posta</h3>' +
        '<p class="contact-card__text"><a href="mailto:' + C.email + '">' + C.email + '</a></p>' +
      '</div>' +
      '<div class="contact-card">' +
        '<div class="contact-card__icon">' + getIcon("location") + '</div>' +
        '<h3 class="contact-card__title">Adres</h3>' +
        '<p class="contact-card__text">' + C.fullAddress + '</p>' +
      '</div>' +
      '<div class="contact-card">' +
        '<div class="contact-card__icon">' + getIcon("clock") + '</div>' +
        '<h3 class="contact-card__title">Çalışma Saatleri</h3>' +
        '<p class="contact-card__text">' + C.hours.weekdays + '<br>' + C.hours.weekend + '</p>' +
      '</div>';
  }

  // ─── HARİTA (TIKLAYINCA YÜKLE) ──────────────────────
  function initMap() {
    var el = qs("#map-container");
    if (!el) return;

    el.innerHTML =
      '<div class="map-container__placeholder">' +
        getIcon("mapPin") +
        '<span>Haritayı görüntülemek için tıklayın</span>' +
      '</div>';

    el.addEventListener("click", function loadMap() {
      el.innerHTML = '<iframe src="' + C.mapEmbedUrl + '" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="' + C.siteName + ' Konum Haritası"></iframe>';
      el.removeEventListener("click", loadMap);
      el.style.cursor = "default";
    }, { once: true });
  }

  // ─── CTA BANNER ──────────────────────────────────────
  function renderCtaBanner() {
    var el = qs("#cta-banner");
    if (!el) return;

    el.innerHTML =
      '<div class="container">' +
        '<div class="cta-banner">' +
          '<h2 class="cta-banner__title">Unutulmaz Bir Gece İçin Hemen İletişime Geçin</h2>' +
          '<p class="cta-banner__text">Rezervasyon, VIP hizmetler ve özel etkinlikler hakkında bilgi almak için bize ulaşın.</p>' +
          '<a href="' + whatsappUrl() + '" target="_blank" rel="noopener noreferrer" class="btn">' + getIcon("whatsapp") + ' Rezervasyon İçin İletişime Geç</a>' +
        '</div>' +
      '</div>';
  }

  // ─── REHBER İÇERİĞİ ─────────────────────────────────
  function renderGuide() {
    var el = qs("#guide-content");
    if (!el) return;

    var sections = C.guide.sections.map(function (s) {
      return '<h2>' + s.title + '</h2><p>' + s.content + '</p>';
    }).join("");

    el.innerHTML = '<p>' + C.guide.intro + '</p>' + sections +
      '<h2>Harem Gece Kulübü ile Farkı Yaşayın</h2>' +
      '<p>Kıbrıs gece kulüpleri arasında fark yaratan Harem Gece Kulübü, premium hizmeti ve güvenli ortamıyla öne çıkmaktadır. Detaylı bilgi ve rezervasyon için <a href="iletisim.html">iletişim sayfamızı</a> ziyaret edebilir veya doğrudan <a href="' + whatsappUrl() + '" target="_blank" rel="noopener noreferrer">WhatsApp\'tan bize ulaşabilirsiniz</a>.</p>';
  }

  // ─── GECE HAYATI İÇERİĞİ ────────────────────────────
  function renderNightlife() {
    var el = qs("#nightlife-content");
    if (!el) return;

    var sections = C.nightlife.sections.map(function (s) {
      return '<h2>' + s.title + '</h2><p>' + s.content + '</p>';
    }).join("");

    el.innerHTML = '<p>' + C.nightlife.intro + '</p>' + sections +
      '<h2>Kıbrıs Gece Kulüpleri Rehberimizi İnceleyin</h2>' +
      '<p>Kuzey Kıbrıs\'taki en iyi gece mekanları hakkında daha fazla bilgi için <a href="kibris-gece-kulupleri-rehberi.html">Kıbrıs Gece Kulüpleri Rehberi</a> sayfamıza göz atabilirsiniz. Sorularınız için <a href="sss.html">Sık Sorulan Sorular</a> bölümümüz de faydalı olacaktır.</p>';
  }

  // ─── MENÜ / HAMBURGERToggle ──────────────────────────
  function initMenu() {
    var hamburger = qs(".hamburger");
    var nav = qs(".nav");
    var overlay = qs(".nav-overlay");
    if (!hamburger || !nav) return;

    function toggleMenu() {
      var isOpen = nav.classList.toggle("nav--open");
      hamburger.setAttribute("aria-expanded", isOpen);
      if (overlay) overlay.classList.toggle("nav-overlay--visible", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    function closeMenu() {
      nav.classList.remove("nav--open");
      hamburger.setAttribute("aria-expanded", "false");
      if (overlay) overlay.classList.remove("nav-overlay--visible");
      document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", toggleMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    // Close on nav link click
    qsa(".nav__link", nav).forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // ─── JSON-LD SCHEMA ──────────────────────────────────
  function injectSchema(pageFile) {
    var s = C.schema;
    var seo = C.seo[pageFile] || C.seo["index.html"];

    var schema = {
      "@context": "https://schema.org",
      "@type": s.type,
      "name": C.siteName,
      "description": seo.description,
      "url": "https://" + C.domain + "/" + (pageFile === "index.html" ? "" : pageFile),
      "telephone": C.phoneRaw,
      "email": C.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": C.address,
        "addressLocality": C.city,
        "addressCountry": C.country
      },
      "priceRange": s.priceRange,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": s.aggregateRating.ratingValue,
        "reviewCount": s.aggregateRating.reviewCount,
        "bestRating": s.aggregateRating.bestRating,
        "worstRating": s.aggregateRating.worstRating
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": C.phoneRaw,
        "contactType": "reservations",
        "availableLanguage": ["Turkish", "English"]
      },
      "sameAs": [
        C.social.instagram,
        C.social.tiktok,
        C.social.youtube
      ].filter(Boolean),
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "22:00",
          "closes": "04:00"
        }
      ]
    };

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // ─── SAYFA BAŞLATICI ─────────────────────────────────
  function init() {
    var pageFile = location.pathname.split("/").pop() || "index.html";
    if (pageFile === "" || pageFile === "/") pageFile = "index.html";

    // Header & Footer
    var headerSlot = qs("#header-slot");
    var footerSlot = qs("#footer-slot");
    var floatingSlot = qs("#floating-slot");

    if (headerSlot) headerSlot.innerHTML = buildHeader(pageFile);
    if (footerSlot) footerSlot.innerHTML = buildFooter();
    if (floatingSlot) floatingSlot.innerHTML = buildFloating();

    // Sayfa bazlı render
    renderHero();
    renderWhyUs();
    renderTeaser();
    renderGallery();
    renderTestimonials();
    renderFaq("#faq-section");
    renderCtaBanner();
    renderContact();
    initMap();
    renderGuide();
    renderNightlife();

    // Menu
    initMenu();

    // Schema
    injectSchema(pageFile);
  }

  // DOM hazır olduğunda başlat
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
