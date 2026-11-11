# Ergin DJ Studio

Ergin DJ Studio, tek sayfalı ve tarayıcıda çalışan çift güverteli bir miks konsoludur. Harici bir müzik servisine, API anahtarına, hesap açmaya veya kurulum paketine ihtiyaç duymaz.

## Hemen aç

`index.html` dosyasına çift tıklayarak doğrudan tarayıcıda açabilirsin. Daha kararlı yerel kullanım için Node.js 20 veya üstü yüklüyse proje klasöründe:

```bash
npm run dev
```

Ardından tarayıcı adres çubuğuna şunu yaz:

```text
http://localhost:8080
```

Derleme ve önizleme:

```bash
npm run build
npm run preview
```

Önizleme adresi `http://localhost:8081` olur.

## Kullanım

- **Deck A / Deck B:** Her güverteye PARÇA YÜKLE düğmesiyle veya dosyayı güverte kartına sürükleyerek bir ses dosyası ekle. MP3, WAV, OGG, M4A, FLAC ve tarayıcının tanıdığı diğer ses biçimleri desteklenir.
- **Play / Cue / Stop:** Çalma, duraklatma ve başa sarma kontrolleri.
- **BPM / Pitch / Sync:** BPM değerlerini elle belirle; SYNC karşı güvertenin girilmiş BPM değerini hedef alır. Pitch ayrı ince ayar sağlar.
- **EQ / Filter:** Üç bant ekolayzır, high-pass / low-pass filtre, echo ve reverb gönderimleri.
- **Loop / Crossfader / Master:** 1, 2, 4 veya 8 ölçülük döngüler, eş güçlü çapraz geçiş ve ana seviye.
- **One-shot pads:** Kick, snare, clap, hat, tom, riser ve zap sesleri tarayıcıda anlık sentezlenir.
- **Kayıt:** Ana çıkışı WebM olarak indirir. Kayıt için MediaRecorder destekli güncel bir tarayıcı gerekir.

Ses motoru tarayıcı güvenlik kuralları nedeniyle ilk Play veya pad tıklamasında başlar. Dosyalar yerel olarak okunur; sunucuya yüklenmez. Demo ritimleri JavaScript/Web Audio ile çalışma anında üretilir.

## GitHub Pages

Depo için GitHub Actions tabanlı Pages iş akışı eklenmiştir. GitHub deposunda **Settings → Pages → Build and deployment → Source** bölümünden **GitHub Actions** seçildiğinde her `main` güncellemesi sonrasında site yayınlanır. Proje adresi:

```text
https://eerrgin.github.io/sail-nova-xenon-drift/
```

İş akışının ilk çalıştırmasından sonra bu adres kullanılabilir.

## Lisans ve medya

Bu sürümde harici şarkı, sample paketi, fotoğraf, marka logosu, ikon kütüphanesi veya uzaktan yazı tipi kullanılmaz. Görsel arayüz, SVG işareti ve demo sesleri bu proje için özgün olarak hazırlanmıştır. Yüklediğin müzik dosyalarının kullanım ve miksleme haklarının sende olması gerekir. Bu uygulama herhangi bir parçanın telif durumunu doğrulamaz.
