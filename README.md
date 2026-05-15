# ColorVibe | Dijital Renk Paleti ve Stil Kartları

ColorVibe, kullanıcıların kendi tarzlarına uygun renk paletleri keşfetmesini, tasarlamasını ve yönetmesini sağlayan web tabanlı dinamik bir platformdur. Proje, modern web standartları ve kullanıcı dostu estetik bir arayüz (Polaroid Grid Tasarımı) gözetilerek geliştirilmiştir.

## Özellikler

- ✨ **Trend Renk Paletleri:** Sistemde hazır bulunan paletleri inceleme ve kategorilere (Pastel, Koyu, Canlı, Soft) göre dinamik filtreleme.
- 🎨 **Kendi Stilini Yarat (Atölyem):** Kullanıcıların dinamik olarak yeni renk girdileri ekleyebildiği, istedikleri renkleri sağ üstteki silme (çarpı) butonuyla kaldırabildiği kişiselleştirilmiş palet oluşturma alanı.
- 🌐 **ColorMagic API Entegrasyonu:** "API Ara" sekmesi üzerinden girilen temaya (örn: autumn, neon, pastel) göre harici sunucudan anlık dinamik veri çekme.
- ❤️ **Favoriler Sistemi:** Beğenilen paletleri `localStorage` kullanarak tarayıcı hafızasına kaydetme ve listeleme.
- 🔒 **Yönetici (Admin) Paneli:** Şifreli giriş paneli aracılığıyla yeni trend paketleri ekleme, silme ve mevcut paketleri düzenleme işlevleri.

## Kullanılan Teknolojiler

- **HTML5:** Yapısal kurgu ve semantik etiket yönetimi.
- **CSS3:** Özelleştirilmiş font entegrasyonları (Poppins, Plus Jakarta Sans, Indie Flower el yazısı teması) ve Polaroid animasyon efektleri.
- **JavaScript (ES6+):** Asenkron API istekleri (`fetch`), DOM manipülasyonu ve `localStorage` veri yönetimi.

## Kurulum ve Çalıştırma

Proje herhangi bir harici kütüphane veya derleyiciye (build tool) ihtiyaç duymadan doğrudan çalıştırılabilir:

1. Bu depoyu klonlayın veya zip olarak indirin.
2. Proje klasörünün içindeki `index.html` dosyasını herhangi bir modern tarayıcıda çift tıklayarak açın.
