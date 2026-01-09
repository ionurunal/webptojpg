/**
 * WooCommerce Ürün Sayfası - Altın Rengi Görsel Filtreleme
 *
 * Bu dosyayı temanızın /js/ klasörüne yükleyin
 * Örnek: wp-content/themes/TEMA_ADINIZ/js/gold-color-filter.js
 */

jQuery(document).ready(function($) {
    'use strict';

    // Altın rengi ve anahtar kelime eşleştirmesi
    const colorMapping = {
        'Sarı Altın': 'sari',
        'Beyaz Altın': 'beyaz',
        'Roze Altın': 'kirmizi'
    };

    // Radio button değişikliklerini dinle
    $('input[name="altinrengi[]"]').on('change', function() {
        const selectedColor = $(this).val();
        const keyword = colorMapping[selectedColor];

        if (!keyword) {
            console.warn('Bilinmeyen altın rengi:', selectedColor);
            return;
        }

        console.log('Seçilen renk:', selectedColor, '- Filtre:', keyword);
        filterGalleryImages(keyword);
    });

    // Sayfa yüklendiğinde varsayılan seçili olan için filtreleme yap
    const defaultSelected = $('input[name="altinrengi[]"]:checked').val();
    if (defaultSelected && colorMapping[defaultSelected]) {
        console.log('Varsayılan renk:', defaultSelected);
        // Küçük bir gecikme ile uygula (slider'ın tam yüklenmesini bekle)
        setTimeout(function() {
            filterGalleryImages(colorMapping[defaultSelected]);
        }, 300);
    }

    /**
     * Galeri görsellerini filtrele
     * @param {string} keyword - Aranacak anahtar kelime (sari, beyaz, kirmizi)
     */
    function filterGalleryImages(keyword) {
        let visibleMainCount = 0;
        let visibleThumbCount = 0;

        // Ana galeri slide'larını filtrele
        const $gallerySlides = $('.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image');

        $gallerySlides.each(function(index) {
            const $slide = $(this);
            const $img = $slide.find('img');
            const imgSrc = $img.attr('src') || $img.attr('data-src') || '';
            const imgDataSrc = $img.attr('data-large_image') || '';

            // URL'de anahtar kelime var mı kontrol et (hem src hem de data-src)
            const hasKeyword = imgSrc.toLowerCase().includes(keyword.toLowerCase()) ||
                              imgDataSrc.toLowerCase().includes(keyword.toLowerCase());

            if (hasKeyword) {
                $slide.show().removeClass('hide-slide').attr('aria-hidden', 'false');
                visibleMainCount++;
            } else {
                $slide.hide().addClass('hide-slide').attr('aria-hidden', 'true');
            }
        });

        // Thumbnail'leri filtrele
        const $thumbnails = $('.product-thumbnails .col');

        $thumbnails.each(function(index) {
            const $thumb = $(this);
            const $img = $thumb.find('img');
            const imgSrc = $img.attr('src') || '';

            if (imgSrc.toLowerCase().includes(keyword.toLowerCase())) {
                $thumb.show().removeClass('hide-thumb').attr('aria-hidden', 'false');
                visibleThumbCount++;
            } else {
                $thumb.hide().addClass('hide-thumb').attr('aria-hidden', 'true');
            }
        });

        console.log('Görünür ana görseller:', visibleMainCount);
        console.log('Görünür thumbnail\'ler:', visibleThumbCount);

        // Flickity slider'ı yeniden başlat
        refreshFlickitySlider();
    }

    /**
     * Flickity slider'ı yenile ve ilk görünür slide'a git
     */
    function refreshFlickitySlider() {
        const $mainSlider = $('.woocommerce-product-gallery__wrapper');
        const $thumbSlider = $('.product-thumbnails');

        // Ana galeri slider'ı yenile
        if ($mainSlider.length && typeof $mainSlider.flickity === 'function') {
            try {
                // Flickity'nin aktif olup olmadığını kontrol et
                const flickityData = $mainSlider.data('flickity');

                if (flickityData) {
                    // Görselleri yeniden yükle
                    $mainSlider.flickity('reloadCells');

                    // İlk görünür slide'ı bul ve ona git
                    const $visibleSlides = $('.woocommerce-product-gallery__image:visible');
                    if ($visibleSlides.length > 0) {
                        const firstVisibleIndex = $visibleSlides.first().index('.woocommerce-product-gallery__image');
                        $mainSlider.flickity('select', firstVisibleIndex, false, true);
                    }

                    console.log('Ana galeri slider güncellendi');
                }
            } catch (e) {
                console.warn('Ana galeri slider güncellenemedi:', e);
            }
        }

        // Thumbnail slider'ı yenile
        if ($thumbSlider.length && typeof $thumbSlider.flickity === 'function') {
            try {
                const flickityData = $thumbSlider.data('flickity');

                if (flickityData) {
                    $thumbSlider.flickity('reloadCells');

                    const $visibleThumbs = $('.product-thumbnails .col:visible');
                    if ($visibleThumbs.length > 0) {
                        const firstVisibleThumb = $visibleThumbs.first().index('.product-thumbnails .col');
                        $thumbSlider.flickity('select', firstVisibleThumb, false, true);
                    }

                    console.log('Thumbnail slider güncellendi');
                }
            } catch (e) {
                console.warn('Thumbnail slider güncellenemedi:', e);
            }
        }

        // Slider'ı yeniden boyutlandır (gerekirse)
        setTimeout(function() {
            if ($mainSlider.data('flickity')) {
                $mainSlider.flickity('resize');
            }
            if ($thumbSlider.data('flickity')) {
                $thumbSlider.flickity('resize');
            }
        }, 100);
    }
});
