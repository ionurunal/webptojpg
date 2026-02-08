/**
 * HAREM GECE KULÜBÜ - Merkezi İçerik Yönetimi
 * =============================================
 * Tüm site içeriğini bu dosyadan yönetebilirsiniz.
 * Metin, telefon, adres, sosyal medya, yorumlar, SSS
 * ve galeri bilgilerini buradan güncelleyin.
 */

const SITE_CONTENT = {

  // ─── GENEL BİLGİLER ───────────────────────────────
  siteName: "Harem Gece Kulübü",
  domain: "haremgecekulubu.com",
  phone: "+90 548 123 45 67",
  phoneRaw: "+905481234567",
  whatsappNumber: "905481234567",
  whatsappMessage: "Merhaba, Harem Gece Kulübü hakkında bilgi almak istiyorum.",
  email: "info@haremgecekulubu.com",
  address: "Salamis Yolu, No: 5",
  city: "Gazimağusa",
  country: "Kuzey Kıbrıs",
  fullAddress: "Salamis Yolu, No: 5, Gazimağusa, Kuzey Kıbrıs",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3259.123456789!2d33.94!3d35.12!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDA3JzEyLjAiTiAzM8KwNTYnMjQuMCJF!5e0!3m2!1str!2s!4v1700000000000",

  hours: {
    label: "Çalışma Saatleri",
    weekdays: "Çarşamba – Cumartesi: 22:00 – 04:00",
    weekend: "Pazar – Salı: Kapalı",
    note: "Özel etkinliklerde saatler değişebilir."
  },

  // ─── SOSYAL MEDYA ──────────────────────────────────
  social: {
    instagram: "https://www.instagram.com/haremgecekulubu",
    tiktok: "https://www.tiktok.com/@haremgecekulubu",
    youtube: "https://www.youtube.com/@haremgecekulubu"
  },

  // ─── NAVİGASYON ────────────────────────────────────
  navigation: [
    { label: "Ana Sayfa", url: "index.html" },
    { label: "Rehber", url: "kibris-gece-kulupleri-rehberi.html" },
    { label: "Gece Hayatı", url: "kibris-gece-hayati.html" },
    { label: "S.S.S.", url: "sss.html" },
    { label: "İletişim", url: "iletisim.html" }
  ],

  // ─── HERO BÖLÜMÜ ──────────────────────────────────
  hero: {
    title: "Kıbrıs'ın En Prestijli Gece Kulübü",
    subtitle: "Harem Gece Kulübü'nde unutulmaz bir gece deneyimi sizi bekliyor. Kıbrıs gece hayatının kalbinde, birinci sınıf eğlence ve konfor.",
    cta1: { text: "WhatsApp'tan Bilgi Al", type: "whatsapp" },
    cta2: { text: "Hemen Ara", type: "phone" },
    image: {
      src: "assets/img/male-hero-01.webp",
      alt: "Harem Gece Kulübü Kıbrıs - Premium gece kulübü deneyimi",
      width: 1200,
      height: 675
    }
  },

  // ─── NEDEN BİZ? ────────────────────────────────────
  whyUs: {
    sectionTitle: "Neden Harem Gece Kulübü?",
    items: [
      {
        icon: "star",
        title: "Premium Deneyim",
        description: "Kıbrıs gece kulüpleri arasında öne çıkan lüks atmosfer ve üst düzey hizmet anlayışı."
      },
      {
        icon: "music",
        title: "Canlı Performanslar",
        description: "Her hafta yerli ve uluslararası DJ'ler ile sahne performansları."
      },
      {
        icon: "shield",
        title: "Güvenli Ortam",
        description: "Profesyonel güvenlik ekibi ile güvenli ve konforlu bir gece deneyimi."
      },
      {
        icon: "glass",
        title: "Özel VIP Alanlar",
        description: "Özel misafirlerimiz için ayrıcalıklı VIP bölümleri ve kişiye özel hizmet."
      },
      {
        icon: "location",
        title: "Merkezi Konum",
        description: "Gazimağusa'nın en prestijli bölgesinde kolay ulaşılabilir konum."
      },
      {
        icon: "calendar",
        title: "Özel Etkinlikler",
        description: "Tema geceleri, özel partiler ve kurumsal etkinlikler için uygun organizasyon imkanı."
      }
    ]
  },

  // ─── GALERİ ────────────────────────────────────────
  gallery: {
    sectionTitle: "Galeri",
    images: [
      { src: "assets/img/club-01.webp", alt: "Harem Gece Kulübü iç mekan ve dans pisti görünümü", width: 800, height: 600 },
      { src: "assets/img/club-02.webp", alt: "Kıbrıs gece kulübü VIP bölümü ve oturma alanı", width: 800, height: 600 },
      { src: "assets/img/club-03.webp", alt: "Harem Gece Kulübü DJ kabini ve sahne alanı", width: 800, height: 600 },
      { src: "assets/img/male-model-01.webp", alt: "Harem Gece Kulübü premium erkek eğlence deneyimi", width: 800, height: 600 },
      { src: "assets/img/club-04.webp", alt: "Kıbrıs gece hayatı - bar ve lounge alanı", width: 800, height: 600 },
      { src: "assets/img/male-model-02.webp", alt: "Gece kulübü atmosferi ve özel gece etkinliği", width: 800, height: 600 },
      { src: "assets/img/club-05.webp", alt: "Harem Gece Kulübü dış mekan ve giriş alanı", width: 800, height: 600 },
      { src: "assets/img/club-06.webp", alt: "Kıbrıs Night Club - ışık ve ses sistemi", width: 800, height: 600 },
      { src: "assets/img/male-model-03.webp", alt: "Harem Gece Kulübü VIP misafir deneyimi", width: 800, height: 600 }
    ]
  },

  // ─── MÜŞTERİ YORUMLARI ────────────────────────────
  testimonials: {
    sectionTitle: "Misafir Yorumları",
    items: [
      {
        name: "M.A.",
        location: "İstanbul, Türkiye",
        rating: 5,
        date: "Aralık 2024",
        text: "Kıbrıs gece hayatında deneyimlediğim en kaliteli mekan. Hizmet ve atmosfer mükemmeldi, kesinlikle tekrar geleceğim."
      },
      {
        name: "E.K.",
        location: "Ankara, Türkiye",
        rating: 5,
        date: "Kasım 2024",
        text: "Arkadaşlarımla harika bir gece geçirdik. VIP bölümü çok konforluydu, personel son derece ilgiliydi."
      },
      {
        name: "R.S.",
        location: "Londra, İngiltere",
        rating: 4,
        date: "Ekim 2024",
        text: "Kıbrıs'taki en iyi gece kulüplerinden biri. Müzik seçimi ve ses sistemi çok iyiydi."
      },
      {
        name: "D.Y.",
        location: "İzmir, Türkiye",
        rating: 5,
        date: "Eylül 2024",
        text: "Güvenlik, temizlik ve hizmet kalitesi olarak çok başarılı buldum. Kıbrıs gece kulüpleri arasında kesinlikle öne çıkıyor."
      },
      {
        name: "A.B.",
        location: "Berlin, Almanya",
        rating: 5,
        date: "Ağustos 2024",
        text: "Avrupa'daki birçok gece kulübüne gittim, Harem kesinlikle rekabet edebilecek seviyede. Atmosfer olağanüstüydü."
      },
      {
        name: "T.Ö.",
        location: "Lefkoşa, Kıbrıs",
        rating: 4,
        date: "Temmuz 2024",
        text: "Yerel olarak en çok tercih ettiğimiz mekan. Her gittiğimizde kalite standardını koruyor, etkinlikleri harika."
      }
    ]
  },

  // ─── SIK SORULAN SORULAR ───────────────────────────
  faq: [
    {
      question: "Harem Gece Kulübü nerede bulunuyor?",
      answer: "Harem Gece Kulübü, Kuzey Kıbrıs'ın Gazimağusa ilçesinde, Salamis Yolu üzerinde yer almaktadır. Merkezi konumuyla kolay ulaşılabilir bir noktadadır."
    },
    {
      question: "Çalışma saatleri nedir?",
      answer: "Çarşamba'dan Cumartesi'ye kadar 22:00 - 04:00 saatleri arasında hizmet vermekteyiz. Özel etkinliklerde saatler değişiklik gösterebilir."
    },
    {
      question: "Rezervasyon nasıl yapılır?",
      answer: "Rezervasyon için WhatsApp hattımızdan veya telefon numaramızdan bize ulaşabilirsiniz. VIP alan ve özel etkinlik rezervasyonları için önceden iletişime geçmenizi öneririz."
    },
    {
      question: "VIP bölümü mevcut mu?",
      answer: "Evet, Harem Gece Kulübü'nde özel VIP bölümleri bulunmaktadır. VIP misafirlerimize ayrıcalıklı hizmet sunulmaktadır. Detaylı bilgi için bizimle iletişime geçebilirsiniz."
    },
    {
      question: "Kıbrıs gece kulüplerine giriş için yaş sınırı var mı?",
      answer: "Evet, gece kulübümüze giriş için 18 yaş ve üzeri olma şartı bulunmaktadır. Girişte kimlik kontrolü yapılmaktadır."
    },
    {
      question: "Özel etkinlik veya parti organizasyonu yapılıyor mu?",
      answer: "Evet, doğum günü partileri, bekarlığa veda geceleri, kurumsal etkinlikler ve özel tema geceleri için organizasyon hizmeti sunuyoruz. Detaylar için iletişime geçebilirsiniz."
    },
    {
      question: "Ulaşım ve park imkanı var mı?",
      answer: "Mekanımıza yakın ücretsiz otopark mevcuttur. Ayrıca Gazimağusa merkez ve çevre otellerden kolay ulaşım sağlanabilir."
    },
    {
      question: "Kıyafet kuralı var mı?",
      answer: "Misafirlerimizden şık-günlük (smart casual) tarza uygun kıyafetlerle gelmeleri beklenmektedir. Spor ayakkabı, şort ve terlik ile giriş uygun görülmemektedir."
    }
  ],

  // ─── KUZEY KIBRIS GECE HAYATI REHBERİ ─────────────
  guide: {
    title: "Kıbrıs Gece Kulüpleri Rehberi",
    intro: "Kuzey Kıbrıs, Akdeniz'in en heyecan verici gece hayatı destinasyonlarından biri olarak öne çıkmaktadır. Gazimağusa, Girne ve Lefkoşa gibi şehirlerde düzinelerce gece kulübü, bar ve eğlence mekanı bulunur.",
    sections: [
      {
        title: "Gazimağusa Gece Hayatı",
        content: "Gazimağusa, tarihi surları ve modern eğlence mekanlarıyla Kıbrıs gece hayatının en dinamik noktalarından biridir. Salamis Yolu ve çevresinde birçok gece kulübü, lounge bar ve canlı müzik mekanı yer almaktadır. Harem Gece Kulübü, bu bölgenin en prestijli mekanları arasındadır."
      },
      {
        title: "Girne Gece Hayatı",
        content: "Girne limanı çevresi, butik barları ve deniz manzaralı mekanlarıyla ünlüdür. Yaz aylarında açık hava etkinlikleri ve plaj partileriyle Kıbrıs gece kulüpleri sahnesinde önemli bir yere sahiptir."
      },
      {
        title: "Kıbrıs Gece Kulübü Seçerken Nelere Dikkat Etmeli?",
        content: "Bir Night Club Kıbrıs deneyimi planlarken güvenlik, hijyen standartları, müzik kalitesi ve personel profesyonelliği gibi kriterlere dikkat edilmelidir. Önceden rezervasyon yaptırmak ve mekanın çalışma saatlerini kontrol etmek sağlıklı bir gece deneyimi için önemlidir."
      }
    ]
  },

  // ─── GECE HAYATI SAYFASI ───────────────────────────
  nightlife: {
    title: "Kıbrıs Gece Hayatı",
    intro: "Kuzey Kıbrıs, Akdeniz ikliminin sıcaklığı, misafirperver kültürü ve canlı eğlence sahnesiyle her yıl binlerce yerli ve yabancı misafiri ağırlamaktadır. Kıbrıs gece hayatı; gece kulüpleri, barlar, canlı müzik mekanları ve özel etkinliklerle zengin bir deneyim sunar.",
    sections: [
      {
        title: "Kıbrıs Gece Kulüpleri ve Eğlence Kültürü",
        content: "Kıbrıs gece kulüpleri, uluslararası DJ performansları, tema geceleri ve VIP hizmetleriyle Avrupa standartlarında eğlence sunmaktadır. Özellikle yaz sezonunda yerli ve uluslararası sanatçıların sahne aldığı etkinlikler büyük ilgi görmektedir."
      },
      {
        title: "Harem Gece Kulübü Deneyimi",
        content: "Harem Gece Kulübü, Kıbrıs gece hayatının en seçkin adreslerinden biri olarak öne çıkar. Modern iç tasarımı, profesyonel ses ve ışık sistemi, özel VIP alanları ve deneyimli personeli ile misafirlerine unutulmaz geceler yaşatmaktadır."
      },
      {
        title: "Kıbrıs'ta Güvenli Gece Hayatı İçin İpuçları",
        content: "Kıbrıs gece hayatının tadını güvenle çıkarmak için güvenilir mekanları tercih edin, arkadaş grubuyla hareket edin ve ulaşım planınızı önceden yapın. Harem Gece Kulübü gibi profesyonel güvenlik ekibine sahip mekanlar her zaman daha güvenli bir deneyim sunar."
      }
    ]
  },

  // ─── İLETİŞİM SAYFASI ─────────────────────────────
  contact: {
    title: "İletişim",
    subtitle: "Bize ulaşmak için aşağıdaki kanalları kullanabilirsiniz. Rezervasyon, bilgi alma veya özel etkinlik talepleriniz için WhatsApp veya telefon ile iletişime geçmeniz yeterlidir.",
    formNote: "En hızlı dönüş için WhatsApp tercih edebilirsiniz."
  },

  // ─── SEO VERİLERİ (her sayfa için) ─────────────────
  seo: {
    "index.html": {
      title: "Harem Gece Kulübü | Kıbrıs Night Club - Premium Gece Deneyimi",
      description: "Harem Gece Kulübü, Kuzey Kıbrıs Gazimağusa'da premium gece kulübü deneyimi sunar. VIP hizmet, canlı performanslar ve unutulmaz Kıbrıs gece hayatı.",
      canonical: "https://haremgecekulubu.com/"
    },
    "kibris-gece-kulupleri-rehberi.html": {
      title: "Kıbrıs Gece Kulüpleri Rehberi 2025 | En İyi Night Club Kıbrıs",
      description: "Kıbrıs gece kulüpleri rehberi: Gazimağusa, Girne ve Lefkoşa'daki en iyi gece kulüpleri, barlar ve eğlence mekanları hakkında kapsamlı rehber.",
      canonical: "https://haremgecekulubu.com/kibris-gece-kulupleri-rehberi.html"
    },
    "kibris-gece-hayati.html": {
      title: "Kıbrıs Gece Hayatı | Kıbrıs Gece Kulüpleri ve Eğlence Rehberi",
      description: "Kıbrıs gece hayatı rehberi: Kuzey Kıbrıs'ta gece kulüpleri, barlar, canlı müzik ve eğlence mekanları. Güvenli ve keyifli gece deneyimi için ipuçları.",
      canonical: "https://haremgecekulubu.com/kibris-gece-hayati.html"
    },
    "sss.html": {
      title: "Sık Sorulan Sorular | Harem Gece Kulübü Kıbrıs",
      description: "Harem Gece Kulübü hakkında sık sorulan sorular: çalışma saatleri, rezervasyon, VIP hizmetler, konum bilgisi ve Kıbrıs gece hayatı detayları.",
      canonical: "https://haremgecekulubu.com/sss.html"
    },
    "iletisim.html": {
      title: "İletişim | Harem Gece Kulübü - Rezervasyon ve Bilgi",
      description: "Harem Gece Kulübü iletişim bilgileri: telefon, WhatsApp, adres ve konum. Rezervasyon ve bilgi almak için hemen ulaşın.",
      canonical: "https://haremgecekulubu.com/iletisim.html"
    }
  },

  // ─── JSON-LD SCHEMA ────────────────────────────────
  schema: {
    type: "NightClub",
    priceRange: "$$",
    aggregateRating: {
      ratingValue: "4.7",
      reviewCount: "238",
      bestRating: "5",
      worstRating: "1"
    }
  },

  // ─── FOOTER ────────────────────────────────────────
  footer: {
    description: "Harem Gece Kulübü, Kuzey Kıbrıs'ın Gazimağusa şehrinde premium gece kulübü hizmeti sunan köklü bir eğlence mekanıdır. Kaliteli hizmet, güvenli ortam ve unutulmaz gece deneyimi için doğru adres.",
    copyright: "Harem Gece Kulübü. Tüm hakları saklıdır."
  }
};
