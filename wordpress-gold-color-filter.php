<?php
/**
 * WooCommerce Ürün Sayfası - Altın Rengi Görsel Filtreleme
 *
 * Bu kodu WordPress temanızın functions.php dosyasına ekleyin.
 * Radio button seçimine göre ürün görsellerini filtreler.
 */

function star_enqueue_gold_color_filter_script() {
    // Sadece ürün sayfalarında çalışsın
    if ( is_product() ) {
        // JavaScript dosyasını enqueue et
        wp_enqueue_script(
            'star-gold-color-filter',
            get_stylesheet_directory_uri() . '/js/gold-color-filter.js', // JS dosyanızın yolu
            array('jquery'), // jQuery bağımlılığı
            '1.0.0',
            true // Footer'da yükle
        );
    }
}
add_action( 'wp_enqueue_scripts', 'star_enqueue_gold_color_filter_script' );

/**
 * Alternatif olarak: Inline script eklemek isterseniz
 * (Ayrı JS dosyası oluşturmadan direkt kodu ekler)
 */
function star_inline_gold_color_filter_script() {
    if ( is_product() ) {
        ?>
        <script type="text/javascript">
        jQuery(document).ready(function($) {
            'use strict';

            // Altın rengi mapping
            const colorMapping = {
                'Sarı Altın': 'sari',
                'Beyaz Altın': 'beyaz',
                'Roze Altın': 'kirmizi'
            };

            // Radio button değişikliklerini dinle
            $('input[name="altinrengi[]"]').on('change', function() {
                const selectedColor = $(this).val();
                const keyword = colorMapping[selectedColor];

                if (!keyword) return;

                // Ana galeri ve thumbnail'leri filtrele
                filterGalleryImages(keyword);
            });

            // Sayfa yüklendiğinde varsayılan seçili olan için filtreleme yap
            const defaultSelected = $('input[name="altinrengi[]"]:checked').val();
            if (defaultSelected && colorMapping[defaultSelected]) {
                filterGalleryImages(colorMapping[defaultSelected]);
            }

            function filterGalleryImages(keyword) {
                // Ana galeri slide'larını filtrele
                const $gallerySlides = $('.woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image');

                $gallerySlides.each(function() {
                    const $slide = $(this);
                    const $img = $slide.find('img');
                    const imgSrc = $img.attr('src') || $img.attr('data-src') || '';

                    // URL'de anahtar kelime var mı kontrol et
                    if (imgSrc.toLowerCase().includes(keyword.toLowerCase())) {
                        $slide.show().removeClass('hide-slide');
                    } else {
                        $slide.hide().addClass('hide-slide');
                    }
                });

                // Thumbnail'leri filtrele
                const $thumbnails = $('.product-thumbnails .col');

                $thumbnails.each(function() {
                    const $thumb = $(this);
                    const $img = $thumb.find('img');
                    const imgSrc = $img.attr('src') || '';

                    if (imgSrc.toLowerCase().includes(keyword.toLowerCase())) {
                        $thumb.show().removeClass('hide-thumb');
                    } else {
                        $thumb.hide().addClass('hide-thumb');
                    }
                });

                // Flickity slider'ı yeniden başlat (varsa)
                refreshFlickitySlider();
            }

            function refreshFlickitySlider() {
                // Flickity slider'ı kontrol et ve yenile
                const $mainSlider = $('.woocommerce-product-gallery__wrapper');
                const $thumbSlider = $('.product-thumbnails');

                if ($mainSlider.data('flickity')) {
                    // Görselleri gizle/göster
                    $mainSlider.flickity('reloadCells');
                    // İlk görünür slide'a git
                    const firstVisibleIndex = $('.woocommerce-product-gallery__image:visible').first().index();
                    if (firstVisibleIndex >= 0) {
                        $mainSlider.flickity('select', firstVisibleIndex, false, true);
                    }
                }

                if ($thumbSlider.data('flickity')) {
                    $thumbSlider.flickity('reloadCells');
                    const firstVisibleThumb = $('.product-thumbnails .col:visible').first().index();
                    if (firstVisibleThumb >= 0) {
                        $thumbSlider.flickity('select', firstVisibleThumb, false, true);
                    }
                }
            }
        });
        </script>
        <?php
    }
}
// Inline script kullanmak için bu satırı aktif edin (yukarıdaki star_enqueue_gold_color_filter_script fonksiyonunu devre dışı bırakın)
// add_action( 'wp_footer', 'star_inline_gold_color_filter_script', 999 );
