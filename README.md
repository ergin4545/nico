# NICO — Dijital Asistan

NICO, Türkçe odaklı, tarayıcıda çalışan bir yapay zekâ asistanıdır. Arayüz GitHub Pages üzerinde statik olarak yayımlanır; yapay zekâ istekleri anahtarları tarayıcıya açmadan bir Worker katmanı üzerinden iletilir. Sohbet ve kısa kullanım tercihleri cihazın yerel depolama alanında tutulur.

## Öne çıkanlar

| Alan | Özellik |
|---|---|
| Sohbet deneyimi | Duyarlı masaüstü/mobil arayüz, hızlı başlangıç önerileri, durum göstergesi ve bekleme geri bildirimi |
| Yapay zekâ | Worker üzerinden Türkçe sohbet, iki farklı yanıt tonu ve Markdown yanıt görünümü |
| Görsel | Görsel ekleme, tarayıcı içinde boyutlandırma ve gönderim öncesi önizleme |
| Ses | Tarayıcı desteklediğinde sesle yazma ve yanıtları seslendirme |
| Yerel araçlar | Hava durumu, kısa bilgi araması, not alma, bütçe özeti ve oturum içi hatırlatıcı |
| Gizlilik | Sohbet geçmişi yerel depolamada tutulur ve tek tıklamayla temizlenebilir |

## Kullanım

NICO’ya doğrudan bir soru yazabilir veya başlangıç ekranındaki önerilerden birini seçebilirsin. `Enter` tuşu mesajı gönderir. Görsel eklemek için ataş düğmesini, sesle yazmak için mikrofon düğmesini kullanabilirsin. Başlıktaki **Dost modu** düğmesi daha samimi, **Asistan modu** düğmesi ise daha düzenli ve görev odaklı yanıtlar için tasarlanmıştır.

| Komut | Örnek |
|---|---|
| Hava durumu | `hava İstanbul` |
| Kısa bilgi araması | `ara yapay zekâ` |
| Not alma | `not al sunumda sade renkler kullan` |
| Bütçe kaydı | `gelir 1200` veya `gider 450` |
| Bütçe özeti | `bütçe` |
| Hatırlatıcı | `hatırlat 18:30 toplantı` |
| Yardım | `yardım` |

## Teknik yapı

| Dosya | Sorumluluk |
|---|---|
| `index.html` | Sayfa yapısı, erişilebilir işaretleme ve görsel tasarım |
| `nico.js` | Sohbet durumu, yerel araçlar, geçmiş, görsel ve ses etkileşimleri |
| `brain.js` | Worker tabanlı yapay zekâ servisi, hata yönetimi ve kısa bilgi komutları |
| `manifest.json` | Yüklenebilir web uygulaması tanımları |

Uygulama saf HTML, CSS ve JavaScript ile çalışır; derleme adımı gerektirmez. Yerelde önizlemek için proje klasörünü herhangi bir statik dosya sunucusuyla açman yeterlidir.

## Güvenlik notu

API anahtarları veya oturum parolaları istemci koduna konulmamalıdır. NICO’nun yapay zekâ anahtarları Worker tarafında yönetilir. Geliştirme sırasında yeni hassas bilgi eklemek yerine sunucu tarafı sır yönetimi kullanılmalıdır.

## Lisans

Bu proje kişisel kullanım ve geliştirme amacıyla hazırlanmıştır.
