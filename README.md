# Ergin DJ Studio

Ergin DJ Studio, hiçbir harici müzik dosyası kullanmadan tarayıcı içinde çalışan çift güverteli bir DJ sentez ve miks konsoludur.

## Çalıştırma

`index.html` dosyasına çift tıklayarak doğrudan tarayıcıda açabilirsin. Yerel web sunucusu tercih edersen, Node.js 20 veya üstü ile proje klasöründe:

```bash
npm run dev
```

Ardından tarayıcıda `http://localhost:8080` adresini aç.

Derleme ve önizleme:

```bash
npm run build
npm run preview
```

Önizleme adresi `http://localhost:8081` olur.

## Özgün ses kütüphanesi

Her güvertede 12 sentez stili bulunur: Deep House, Melodic House, Peak-Time Techno, Progressive Trance, Disco Funk, Afro House, Drum & Bass, UK Garage, Breakbeat, Lo-Fi, Ambient ve Electro.

Bunlar harici kayıt veya sample dosyaları değildir. Kick, snare, clap, hi-hat, perküsyon, bas, akor ve melodiler Web Audio API ile kod içinde çalışma anında oluşturulur. Her preset için ayrı ritim yapısı, tempo ve ses tasarımı kullanılır.

## DJ kontrolleri

- İki bağımsız sentez güvertesi ve 12 türden ses seçimi.
- Play, duraklatma, başa sarma ve konum kontrolü.
- BPM, pitch ve elle girilen tempoya göre Sync.
- Üç bant EQ, high-pass / low-pass filtre, Echo ve Reverb.
- 1, 2, 4 veya 8 ölçülük loop.
- Crossfader, master seviyesi ve canlı spektrum.
- Sekiz performans pad'i; ana miksin WebM kaydı.

## Tamamen tarayıcı içinde

Uygulamada parça yükleme, dosya seçici, sürükle-bırak ses alanı, uzak müzik kaynağı, harici sample veya müzik API'si bulunmaz. Ses sentezi ve miks işlemleri tarayıcıda yapılır. Kayıt özelliği yalnızca tarayıcı içindeki sentezlenmiş miks çıkışını kaydeder.

## GitHub Pages

GitHub deposunda **Settings → Pages → Build and deployment → Source** bölümünden **GitHub Actions** seçildiğinde `main` dalındaki güncellemeler yayınlanır.

`https://eerrgin.github.io/sail-nova-xenon-drift/`

## Telif ve üçüncü taraflar

Bu sürümde harici şarkı, sample paketi, fotoğraf, marka logosu, ikon kütüphanesi, uzaktan yazı tipi, müzik servisi veya çalışma zamanı CDN'i kullanılmaz. Arayüz, simgeler, ritimler ve ses tasarımları proje için hazırlanmış kod ve SVG/CSS öğeleridir. Bu özgün sentez yaklaşımı harici sample lisansına bağımlılığı ortadan kaldırır; ancak telif hukukuna ilişkin mutlak bir garanti veya hukuki görüş değildir.
