# WordPress Altın Rengi Görsel Filtreleme - Kurulum Talimatları

Bu fonksiyon, WooCommerce ürün sayfalarında radio button'dan seçilen altın rengine göre ürün görsellerini filtreler.

## 🎯 İşlev

**Radio Button Seçimleri → Görsel Filtreleme:**
- **Sarı Altın** → URL'de "**sari**" geçen görseller gösterilir
- **Beyaz Altın** → URL'de "**beyaz**" geçen görseller gösterilir
- **Roze Altın** → URL'de "**kirmizi**" geçen görseller gösterilir

## 📋 Gereksinimler

- WordPress 5.0+
- WooCommerce 3.0+
- Flickity slider (temanızda zaten kullanılıyor)
- jQuery (WordPress ile birlikte gelir)

## 🚀 Kurulum Yöntemi 1: Inline Script (Önerilen - Daha Kolay)

### Adım 1: PHP Kodunu functions.php'ye Ekleyin

1. WordPress yönetim paneline giriş yapın
2. **Görünüm (Appearance) → Tema Düzenleyici (Theme Editor)** menüsüne gidin
3. Sağ taraftaki dosya listesinden **functions.php** dosyasını seçin
4. `wordpress-gold-color-filter.php` dosyasındaki **INLINE SCRIPT** bölümünü kopyalayın:
   - `star_inline_gold_color_filter_script()` fonksiyonunu
   - En alttaki `add_action` satırının başındaki `//` işaretlerini kaldırın:
   ```php
   add_action( 'wp_footer', 'star_inline_gold_color_filter_script', 999 );
   ```
5. **Dosyayı Güncelleyin** butonuna tıklayın

### ✅ Tamamlandı!

Ürün sayfanıza gidin ve radio button'ları değiştirerek test edin.

---

## 🚀 Kurulum Yöntemi 2: Ayrı JavaScript Dosyası (Daha Profesyonel)

### Adım 1: JavaScript Dosyasını Yükleyin

1. FTP/cPanel ile WordPress sitenize bağlanın
2. Tema klasörünüze gidin: `/wp-content/themes/TEMA_ADINIZ/`
3. Eğer yoksa `js` klasörü oluşturun
4. `gold-color-filter.js` dosyasını `js` klasörüne yükleyin
   - Tam yol: `/wp-content/themes/TEMA_ADINIZ/js/gold-color-filter.js`

### Adım 2: PHP Kodunu functions.php'ye Ekleyin

1. WordPress yönetim paneline giriş yapın
2. **Görünüm → Tema Düzenleyici** menüsüne gidin
3. **functions.php** dosyasını açın
4. `wordpress-gold-color-filter.php` dosyasındaki **ENQUEUE SCRIPT** bölümünü kopyalayın:
   - `star_enqueue_gold_color_filter_script()` fonksiyonunu
   - `add_action( 'wp_enqueue_scripts', 'star_enqueue_gold_color_filter_script' );` satırını
5. **Dosyayı Güncelleyin** butonuna tıklayın

### ✅ Tamamlandı!

Ürün sayfanıza gidin ve radio button'ları değiştirerek test edin.

---

## 🧪 Test Etme

1. Ürün sayfanıza gidin
2. Tarayıcı geliştirici araçlarını açın (F12)
3. Console sekmesine bakın - şu mesajları görmelisiniz:
   ```
   Varsayılan renk: Sarı Altın
   Görünür ana görseller: 3
   Görünür thumbnail'ler: 3
   ```
4. Radio button'ları değiştirin:
   - **Sarı Altın** → Sadece "sari" içeren görseller görünür
   - **Beyaz Altın** → Sadece "beyaz" içeren görseller görünür
   - **Roze Altın** → Sadece "kirmizi" içeren görseller görünür

## 🖼️ Görsel URL Formatı

Kodun düzgün çalışması için görsel URL'leriniz şu formatta olmalı:

```
✅ Doğru örnekler:
- tektas-sari-1-0.50-karat.jpg
- tektas-beyaz-2-0.50-karat.jpg
- tektas-kirmizi-3-0.50-karat.jpg
- yuzuk-SARI-model1.jpg (büyük/küçük harf fark etmez)

❌ Yanlış örnekler:
- tektas-yellow-1.jpg (İngilizce - "sari" yerine "yellow")
- tektas-1.jpg (renk bilgisi yok)
```

## 🔧 Özelleştirme

### Farklı Renk Mapping Kullanmak

JavaScript dosyasındaki `colorMapping` objesini düzenleyin:

```javascript
const colorMapping = {
    'Sarı Altın': 'sari',      // 'yellow' yapabilirsiniz
    'Beyaz Altın': 'beyaz',    // 'white' yapabilirsiniz
    'Roze Altın': 'kirmizi'    // 'rose' yapabilirsiniz
};
```

### Farklı Radio Button Name Kullanıyorsanız

Eğer radio button'ınızın name attribute'u farklıysa:

```javascript
// Örnek: name="altin_tonu" ise
$('input[name="altin_tonu"]').on('change', function() {
    // ...
});
```

## ❗ Sorun Giderme

### Görseller Değişmiyor

1. **Console'da hata var mı kontrol edin** (F12 → Console)
2. **jQuery yüklü mü kontrol edin:**
   - Console'a yazın: `jQuery.fn.jquery`
   - Versiyon numarası görmelisiniz (örn: "3.6.0")

3. **Flickity yüklü mü kontrol edin:**
   - Console'a yazın: `jQuery('.woocommerce-product-gallery__wrapper').data('flickity')`
   - `undefined` değilse yüklüdür

4. **Görsel URL'lerini kontrol edin:**
   - Console'a yazın: `jQuery('.woocommerce-product-gallery__image img').each(function(){ console.log(jQuery(this).attr('src')) })`
   - URL'lerde "sari", "beyaz" veya "kirmizi" geçiyor mu?

### Cache Sorunu

1. **WordPress cache'ini temizleyin** (cache plugini kullanıyorsanız)
2. **Tarayıcı cache'ini temizleyin** (Ctrl + Shift + Delete)
3. **Hard refresh yapın** (Ctrl + F5)

### Child Theme Kullanıyorsanız

Child theme kullanıyorsanız, `get_stylesheet_directory_uri()` fonksiyonu zaten child theme'i işaret eder. JavaScript dosyasını child theme'in `js` klasörüne yükleyin.

## 📞 Destek

Sorun yaşarsanız:
1. Tarayıcı console'undaki hataları kontrol edin
2. WordPress debug modunu aktif edin
3. functions.php'de syntax hatası olup olmadığını kontrol edin

## 📝 Notlar

- Kod tüm modern tarayıcılarda çalışır
- Mobil cihazlarda da sorunsuz çalışır
- Tema güncellemelerinde kod kaybolmaz (functions.php'de olduğu için)
- Child theme kullanmanız önerilir
