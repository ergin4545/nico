import { StorageManager } from './storage.js';

/* =========================================================
   NICO AI ASSISTANT
   Kurucu: Sidar Aydın
   ========================================================= */

const FOUNDER = 'Sidar Aydın';

/* =========================================================
   WORKER
========================================================= */

const WORKER_URL =
    'https://bitter-haze-2503.usermame5252.workers.dev';

/* =========================================================
   AYARLAR
========================================================= */

let pass =
    localStorage.getItem('nico_pass') ||
    'Şule45580';

let founder =
    localStorage.getItem('nico_founder') === '1';

let lastError = '';

/* =========================================================
   HTML
========================================================= */

const chat =
    document.getElementById('chat-messages');

const inp =
    document.getElementById('user-input');

const sendBtn =
    document.getElementById('send-btn');

const clearBtn =
    document.getElementById('clear-chat');

const uploadBtn =
    document.getElementById('upload-btn');

/* =========================================================
   GÖRSEL SİSTEMİ
========================================================= */

let pendingImage = null;

/*
   HTML'de file input yoksa kendimiz oluşturuyoruz.
*/

const imageInput =
    document.createElement('input');

imageInput.type = 'file';
imageInput.accept = 'image/*';
imageInput.style.display = 'none';

document.body.appendChild(imageInput);

/* =========================================================
   GEÇMİŞ
========================================================= */

let hist = [];

try {

    hist =
        StorageManager.getHistory() || [];

} catch (e) {

    console.error(
        'Geçmiş yüklenemedi:',
        e
    );

    hist = [];
}

/* =========================================================
   MESAJ EKLE
========================================================= */

function add(
    text,
    role = 'ai'
) {

    if (!chat) return;

    const d =
        document.createElement('div');

    d.className =
        'message ' + role;

    d.textContent =
        String(text);

    chat.appendChild(d);

    chat.scrollTop =
        chat.scrollHeight;
}

/* =========================================================
   GÖRSEL MESAJ
========================================================= */

function addImageMessage(
    image,
    text = '',
    role = 'user'
) {

    if (!chat) return;

    const box =
        document.createElement('div');

    box.className =
        'message ' + role;

    const img =
        document.createElement('img');

    img.src = image;

    img.style.maxWidth = '100%';
    img.style.borderRadius = '15px';
    img.style.display = 'block';
    img.style.marginBottom = '8px';

    box.appendChild(img);

    if (text) {

        const p =
            document.createElement('div');

        p.textContent = text;

        box.appendChild(p);
    }

    chat.appendChild(box);

    chat.scrollTop =
        chat.scrollHeight;
}

/* =========================================================
   TYPING
========================================================= */

function addTyping() {

    if (!chat) return null;

    const d =
        document.createElement('div');

    d.className =
        'message ai';

    d.id =
        'nico-typing';

    d.textContent =
        'NICO fotoğrafı inceliyor... 👁️🧠';

    chat.appendChild(d);

    chat.scrollTop =
        chat.scrollHeight;

    return d;
}

function removeTyping() {

    const el =
        document.getElementById(
            'nico-typing'
        );

    if (el) {
        el.remove();
    }
}

/* =========================================================
   SİSTEM
========================================================= */

function sys() {

    return `
Sen NICO adında gelişmiş bir yapay zeka asistanısın.

Kurucun Sidar Aydın'dır.

Türkçe konuş.

Kullanıcıya gerektiğinde Reis diye hitap edebilirsin.

Sen samimi, doğal, zeki ve yardımcı bir asistansın.

ÖNEMLİ GÖRSEL KURALLARI:

Kullanıcı sana bir fotoğraf gönderirse
ve ayrıca soru yazmamışsa SORU BEKLEME.

Fotoğrafı kendin incele.

Fotoğrafta gördüğün önemli nesneleri,
kişileri, ortamı, yazıları, renkleri,
ekranları ve dikkat çeken ayrıntıları
doğal şekilde açıkla.

Örneğin:
"Reis, fotoğrafta bir telefon ekranı görüyorum..."
gibi doğrudan analiz yap.

Kullanıcı fotoğraf + yazı gönderirse,
fotoğrafı ve yazıyı birlikte değerlendir.

Kullanıcı fotoğrafın belirli bir bölümünü
işaret ettiğini söylerse özellikle o bölgeye odaklan.

Görmediğin bir şeyi kesinmiş gibi söyleme.

Bir görüntüde yazı varsa okuyabildiğin kadarını aktar.

Normal sorularda doğrudan cevap ver.

Kod sorularında çalışan ve eksiksiz kod ver.

Bilmediğin şeyi uydurma.

Sen NICO'sun.
`;
}

/* =========================================================
   YEREL CEVAP
========================================================= */

function localBrain(text) {

    const q =
        String(text || '')
            .toLowerCase()
            .trim();

    if (
        /^(selam|merhaba|sa|selamlar)/i
            .test(q)
    ) {

        return (
            'Selam Reis! 👋 ' +
            'NICO burada. Nasıl yardımcı olayım?'
        );
    }

    if (
        q.includes('kimsin') ||
        q.includes('adın ne')
    ) {

        return (
            'Ben NICO, Sidar Aydın tarafından ' +
            'geliştirilen yapay zeka asistanıyım. 🤖'
        );
    }

    if (
        q.includes('kim yaptı') ||
        q.includes('kurucun kim')
    ) {

        return (
            `Ben ${FOUNDER}'ın eseriyim Reis. 🫡`
        );
    }

    if (
        q.includes('çalışıyor musun') ||
        q.includes('aktif misin')
    ) {

        return 'Aktifim Reis. 🟢';
    }

    if (
        q.includes('teşekkür') ||
        q.includes('sağ ol')
    ) {

        return 'Rica ederim Reis. 😎';
    }

    return null;
}

/* =========================================================
   WORKER'A GÖNDER
========================================================= */

async function askWorker(messages) {

    lastError = '';

    try {

        const response =
            await fetch(
                WORKER_URL + '/api/chat',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({

                        messages:
                            messages,

                        system:
                            sys()

                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.ok) {

            lastError =
                data?.error ||
                `Worker ${response.status}`;

            return null;
        }

        if (
            data.text &&
            typeof data.text === 'string'
        ) {

            return data.text.trim();
        }

        lastError =
            'Worker boş cevap verdi.';

        return null;

    } catch (error) {

        lastError =
            'Worker bağlantı hatası: ' +
            (
                error?.message ||
                String(error)
            );

        return null;
    }
}

/* =========================================================
   ANA BEYİN
========================================================= */

async function askBrain(messages) {

    /*
       Önce Cloudflare Worker.
       API anahtarı tarayıcıya açılmaz.
    */

    const answer =
        await askWorker(messages);

    if (answer) {
        return answer;
    }

    /*
       Worker çalışmazsa yerel cevap.
    */

    const lastUser =
        [...messages]
            .reverse()
            .find(
                x =>
                    x &&
                    x.role === 'user'
            );

    if (lastUser) {

        const parts =
            Array.isArray(lastUser.parts)
                ? lastUser.parts
                : [];

        const textPart =
            parts.find(
                x =>
                    x &&
                    typeof x.text === 'string'
            );

        const local =
            localBrain(
                textPart?.text || ''
            );

        if (local) {
            return local;
        }
    }

    if (lastError) {

        return (
            '⚠️ NICO Worker hatası:\n\n' +
            lastError
        );
    }

    return (
        '🧠 Reis, NICO şu anda cevap veremiyor.'
    );
}

/*
   Diğer JS dosyaları erişebilsin.
*/

window.askBrain =
    askBrain;

/* =========================================================
   DATA URL -> GEMINI PART
========================================================= */

function imageToPart(dataUrl) {

    if (
        !dataUrl ||
        typeof dataUrl !== 'string'
    ) {
        return null;
    }

    const match =
        dataUrl.match(
            /^data:(image\/[^;]+);base64,(.+)$/
        );

    if (!match) {
        return null;
    }

    return {

        inline_data: {

            mime_type:
                match[1],

            data:
                match[2]

        }

    };
}

/* =========================================================
   DOSYA OKUMA
========================================================= */

function readImage(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload =
                () => resolve(
                    reader.result
                );

            reader.onerror =
                reject;

            reader.readAsDataURL(file);
        }
    );
}

/* =========================================================
   FOTOĞRAF SEÇ
========================================================= */

if (uploadBtn) {

    uploadBtn.addEventListener(
        'click',
        () => {

            imageInput.click();

        }
    );
}

/* =========================================================
   FOTOĞRAF GELDİ
========================================================= */

imageInput.addEventListener(
    'change',
    async () => {

        const file =
            imageInput.files?.[0];

        if (!file) {
            return;
        }

        /*
           Boyut kontrolü
        */

        if (
            file.size >
            12 * 1024 * 1024
        ) {

            add(
                '⚠️ Fotoğraf çok büyük Reis. 12 MB altında bir görsel seç.',
                'ai'
            );

            imageInput.value = '';

            return;
        }

        try {

            pendingImage =
                await readImage(file);

            /*
               Fotoğrafı hemen göster.
            */

            addImageMessage(
                pendingImage,
                ''
            );

            /*
               Kullanıcıya yazı yazma
               fırsatı veriyoruz.
            */

            if (inp) {

                inp.placeholder =
                    'Fotoğraf hazır. İstersen ne istediğini yaz...';

                inp.focus();
            }

        } catch (error) {

            add(
                '⚠️ Fotoğraf okunamadı Reis.',
                'ai'
            );

        }

        imageInput.value = '';
    }
);

/* =========================================================
   GÖNDER
========================================================= */

async function send() {

    if (!inp) return;

    const text =
        inp.value.trim();

    /*
       Hem yazı hem fotoğraf yoksa gönderme.
    */

    if (
        !text &&
        !pendingImage
    ) {
        return;
    }

    inp.value = '';

    /*
       FOTOĞRAF VARSA
    */

    const currentImage =
        pendingImage;

    pendingImage = null;

    /*
       Kurucu şifresi
    */

    if (
        !currentImage &&
        text === pass
    ) {

        founder = true;

        localStorage.setItem(
            'nico_founder',
            '1'
        );

        add(
            '••••••',
            'user'
        );

        setTimeout(
            () => {

                add(
                    'Hoş geldin Sidar Reis! 🎉 Kurucu modu aktif.',
                    'ai'
                );

            },
            300
        );

        return;
    }

    /*
       Yeni şifre
    */

    if (
        !currentImage &&
        founder &&
        text.startsWith('yeni şifre ')
    ) {

        const newPass =
            text
                .slice(
                    'yeni şifre '.length
                )
                .trim();

        if (!newPass) {

            add(
                'Yeni şifre boş olamaz Reis.',
                'ai'
            );

            return;
        }

        pass =
            newPass;

        localStorage.setItem(
            'nico_pass',
            pass
        );

        add(
            'Şifre güncellendi Reis. 🔐',
            'ai'
        );

        return;
    }

    /*
       Kullanıcı mesajını ekrana koy.
       Fotoğraf zaten önizleme olarak gösterilmişti.
    */

    if (
        !currentImage &&
        text
    ) {

        add(
            text,
            'user'
        );

    } else if (
        currentImage &&
        text
    ) {

        /*
           Fotoğrafın altına yazıyı ekle.
        */

        const boxes =
            chat?.querySelectorAll(
                '.message.user'
            );

        const last =
            boxes?.[boxes.length - 1];

        if (last) {

            const p =
                document.createElement(
                    'div'
                );

            p.textContent =
                text;

            last.appendChild(p);
        }
    }

    /*
       Worker mesaj formatı
    */

    const parts = [];

    /*
       FOTOĞRAF
    */

    if (currentImage) {

        const imagePart =
            imageToPart(
                currentImage
            );

        if (imagePart) {

            parts.push(
                imagePart
            );
        }
    }

    /*
       YAZI
    */

    if (text) {

        parts.push({

            text: text

        });

    }

    /*
       Fotoğraf var ama yazı yoksa
       otomatik analiz komutu.
    */

    if (
        currentImage &&
        !text
    ) {

        parts.unshift({

            text:
                `
Bu fotoğrafı kendin analiz et Reis.
Bana soru sormadan fotoğrafta ne gördüğünü,
önemli ayrıntıları, varsa yazıları,
nesneleri ve dikkat çeken noktaları açıkla.
`
        });
    }

    /*
       Geçmiş mesajları hazırla.
    */

    const previous =
        hist
            .slice(-10)
            .map(item => {

                return {

                    role:
                        item.role === 'user'
                            ? 'user'
                            : 'model',

                    parts: [
                        {
                            text:
                                item.text || ''
                        }
                    ]

                };

            })
            .filter(
                item =>
                    item.parts[0].text
            );

    /*
       Yeni mesaj.
    */

    previous.push({

        role: 'user',

        parts: parts

    });

    /*
       Geçmişe sadece yazıyı kaydet.
       Base64 fotoğrafı localStorage'a
       koymuyoruz; yoksa hafıza şişer.
    */

    if (text) {

        hist.push({

            role: 'user',

            text: text

        });

    } else if (currentImage) {

        hist.push({

            role: 'user',

            text:
                '📷 Fotoğraf gönderildi.'

        });

    }

    /*
       NICO düşünüyor
    */

    addTyping();

    try {

        const reply =
            await askBrain(
                previous
            );

        removeTyping();

        /*
           Cevabı göster
        */

        add(
            reply,
            'ai'
        );

        /*
           Geçmiş
        */

        hist.push({

            role: 'model',

            text: reply

        });

        /*
           Kaydet
        */

        try {

            StorageManager.saveHistory(
                hist
            );

        } catch (e) {

            console.error(
                'Geçmiş kaydedilemedi:',
                e
            );
        }

    } catch (error) {

        removeTyping();

        console.error(
            'NICO hata:',
            error
        );

        add(
            '⚠️ NICO beklenmeyen hata:\n' +
            (
                error?.message ||
                String(error)
            ),
            'ai'
        );
    }

    /*
       Placeholder geri dönsün
    */

    if (inp) {

        inp.placeholder =
            "NICO'ya yaz...";

    }
}

/* =========================================================
   EVENTLER
========================================================= */

if (sendBtn) {

    sendBtn.addEventListener(
        'click',
        send
    );
}

if (inp) {

    inp.addEventListener(
        'keypress',
        event => {

            if (
                event.key === 'Enter' &&
                !event.shiftKey
            ) {

                event.preventDefault();

                send();

            }

        }
    );
}

/* =========================================================
   TEMİZLE
========================================================= */

if (clearBtn) {

    clearBtn.addEventListener(
        'click',
        () => {

            try {

                StorageManager.clearHistory();

            } catch (e) {

                console.error(e);

            }

            hist = [];

            if (chat) {

                chat.innerHTML = '';

                add(
                    'Sohbet sıfırlandı Reis! 🔄',
                    'ai'
                );
            }

        }
    );
}

/* =========================================================
   GEÇMİŞİ YÜKLE
========================================================= */

if (chat) {

    chat.innerHTML = '';

    hist.forEach(
        item => {

            add(
                item.text,
                item.role === 'user'
                    ? 'user'
                    : 'ai'
            );

        }
    );

}

/* =========================================================
   BAŞLANGIÇ
========================================================= */

console.log(
    'NICO AI başlatıldı.'
);

console.log(
    'Worker:',
    WORKER_URL
);

console.log(
    'Founder:',
    founder
);
