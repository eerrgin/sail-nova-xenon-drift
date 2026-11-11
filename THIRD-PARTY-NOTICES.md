# Medya ve üçüncü taraf bildirimleri

Çalışan DJ Studio sürümünde harici ses kaydı, sample, müzik dosyası, fotoğraf, marka görseli, ikon paketi, uzaktaki font veya çalışma zamanı CDN'i çağrılmaz.

- Güverte sesleri (kick, snare, clap, hi-hat, perküsyon, bas, akor, melodi ve atmosfer) Web Audio API ile çalışma anında matematiksel olarak sentezlenir.
- Sekiz performans pad'i de osilatör ve üretilmiş gürültü katmanlarından anlık oluşturulur.
- Yankı kuyruğu ve reverb impulse buffer uygulama tarafından çalışma anında üretilir; hazır kayıt içermez.
- Arayüz, SVG işareti, CSS ve uygulama JavaScript'i bu proje için hazırlanmıştır.
- Uygulamada kullanıcıdan müzik veya ses dosyası seçmesini isteyen bir alan yoktur; dışarıdan ses yüklenemez.
- Web Audio API ve MediaRecorder, tarayıcının standart platform özellikleridir. Kayıt düğmesi yalnızca uygulamanın kendi sentezlenmiş miks çıkışını kaydeder.

Bu yaklaşım harici sample lisansına bağımlılığı ortadan kaldırır. Telif hukukuna ilişkin mutlak bir garanti vermez; müziğin sonradan kaydı, kullanımı ve yayımlanması ülke ve kullanım koşullarına göre ayrıca değerlendirilebilir.
