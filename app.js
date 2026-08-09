import { StorageManager } from './storage.js';

/* =========================================================
   NICO AI ASSISTANT
   Kurucu: Sidar Aydın
   ========================================================= */

const FOUNDER = 'Sidar Aydın';

/* -----------------------------
   AYARLAR
----------------------------- */

let orKey = localStorage.getItem('nico_orkey') || '';
let apiKey = localStorage.getItem('nico_key') || '';

let pass = localStorage.getItem('nico_pass') || 'Şule45580';

let founder =
    localStorage.getItem('nico_founder') === '1';

let lastError = '';

/*
   OpenRouter modelleri.
   İlk model çalışmazsa ikinci denenir.
*/
const OR_MODELS = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-3-27b-it:free'
];

/* -----------------------------
   HTML ELEMANLARI
----------------------------- */

const chat = document.getElementById('chat-messages');
const inp = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const clearBtn = document.getElementById('clear-chat');
const uploadBtn = document.getElementById('upload-btn');

/* -----------------------------
   SOHBET GEÇMİŞİ
----------------------------- */

let hist = [];

try {
    hist = StorageManager.getHistory() || [];
} catch (e) {
    console.error('Geçmiş yüklenemedi:', e);
    hist = [];
}

/* =========================================================
   MESAJ EKLEME
========================================================= */

function add(text, role = 'ai') {

    if (!chat) return;

    const d = document.createElement('div');

    d.className = 'message ' + role;

    d.textContent = String(text);

    chat.appendChild(d);

    chat.scrollTop = chat.scrollHeight;
}


/* =========================================================
   YAZIYOR ANİMASYONU
========================================================= */

function addTyping() {

    if (!chat) return null;

    const d = document.createElement('div');

    d.className = 'message ai';

    d.id = 'nico-typing';

    d.textContent = 'NICO düşünüyor... 🧠';

    chat.appendChild(d);

    chat.scrollTop = chat.scrollHeight;

    return d;
}


function removeTyping() {

    const el = document.getElementById('nico-typing');

    if (el) {
        el.remove();
    }
}


/* =========================================================
   NICO SİSTEM TALİMATI
========================================================= */

function sys() {

    return `
Sen NICO adında gelişmiş bir yapay zeka asistanısın.

Kurucun:
${FOUNDER}

Kullanıcıya:
"Reis" diye hitap edebilirsin.

Kim olduğunu sorarlarsa:
"Ben Sidar Aydın'ın eseriyim." de.

Görevin:
- Türkçe konuşmak.
- Soruları mümkün olduğunca doğru cevaplamak.
- Bilmediğin bilgiyi uydurmamak.
- Emin olmadığın konularda bunu açıkça belirtmek.
- Samimi ama anlaşılır olmak.
- Gereksiz uzun cevaplar vermemek.
- Kod sorularında çalışan ve eksiksiz kod vermek.
- Kullanıcının önceki mesajlarındaki bağlamı dikkate almak.
- Kullanıcı bir şey sorduğunda doğrudan cevap vermek.
- Hata olduğunda hatanın gerçek sebebini açıklamak.
- Kendini insan gibi göstermemek.
- Kendi yeteneklerini olduğundan fazla göstermemek.

Önemli:
Senin adın NICO.
`;
}


/* =========================================================
   YEREL / API YOKKEN ÇALIŞAN BEYİN
========================================================= */

function localBrain(text) {

    const q = text.toLowerCase().trim();

    if (/^(selam|merhaba|sa|selamlar)/i.test(q)) {
        return 'Selam Reis! 👋 NICO burada. Nasıl yardımcı olayım?';
    }

    if (
        q.includes('kimsin') ||
        q.includes('adın ne') ||
        q.includes('sen nesin')
    ) {
        return 'Ben NICO, Sidar Aydın tarafından geliştirilen yapay zeka asistanıyım. 🤖';
    }

    if (
        q.includes('kim yaptı') ||
        q.includes('kurucun kim') ||
        q.includes('seni kim yaptı') ||
        q.includes('sahibin kim')
    ) {
        return `Ben ${FOUNDER}'ın eseriyim Reis. 🫡`;
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
   OPENROUTER BEYNİ
========================================================= */

async function askOR(messages) {

    if (!orKey) {
        return null;
    }

    lastError = '';

    const formattedMessages = [
        {
            role: 'system',
            content: sys()
        }
    ];

    for (const item of messages.slice(-12)) {

        if (!item || !item.parts || !item.parts[0]) {
            continue;
        }

        const text = item.parts[0].text;

        if (!text) continue;

        formattedMessages.push({
            role:
                item.role === 'user'
                    ? 'user'
                    : 'assistant',
            content: text
        });
    }


    for (const model of OR_MODELS) {

        try {

            const response = await fetch(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + orKey,

                        /*
                           OpenRouter için ek bilgiler.
                        */
                        'HTTP-Referer':
                            window.location.origin,

                        'X-Title':
                            'NICO AI Assistant'
                    },

                    body: JSON.stringify({

                        model: model,

                        messages: formattedMessages,

                        temperature: 0.7,

                        max_tokens: 1500

                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                lastError =
                    'OpenRouter ' +
                    response.status +
                    ': ' +
                    (
                        data?.error?.message ||
                        'Bilinmeyen hata'
                    );

                continue;
            }


            const answer =
                data?.choices?.[0]?.message?.content;


            if (
                answer &&
                typeof answer === 'string'
            ) {

                return answer.trim();
            }


            lastError =
                'OpenRouter cevap üretmedi.';

        } catch (error) {

            lastError =
                'OpenRouter bağlantı hatası: ' +
                (
                    error?.message ||
                    error
                );
        }
    }

    return null;
}


/* =========================================================
   GEMINI BEYNİ
========================================================= */

async function askG(messages) {

    if (!apiKey) {
        return null;
    }

    lastError = '';

    try {

        const contents = messages
            .slice(-12)
            .map(item => ({

                role:
                    item.role === 'user'
                        ? 'user'
                        : 'model',

                parts: [
                    {
                        text:
                            item.parts?.[0]?.text || ''
                    }
                ]

            }))
            .filter(item =>
                item.parts[0].text
            );


        const response = await fetch(

            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='
            + encodeURIComponent(apiKey),

            {
                method: 'POST',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    system_instruction: {

                        parts: [
                            {
                                text: sys()
                            }
                        ]

                    },

                    contents: contents,

                    generationConfig: {

                        temperature: 0.7,

                        maxOutputTokens: 1500

                    }

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            lastError =
                'Gemini ' +
                response.status +
                ': ' +
                (
                    data?.error?.message ||
                    'Bilinmeyen hata'
                );

            return null;
        }


        const answer =
            data?.candidates?.[0]?.content?.parts
                ?.map(part => part.text || '')
                .join('')
                .trim();


        if (answer) {
            return answer;
        }


        lastError =
            'Gemini cevap üretmedi.';

        return null;

    } catch (error) {

        lastError =
            'Gemini bağlantı hatası: ' +
            (
                error?.message ||
                error
            );

        return null;
    }
}


/* =========================================================
   ANA NICO BEYNİ
========================================================= */

/*
   BU FONKSİYON ÖNEMLİ.
   Ekrandaki:
   "askBrain is not defined"
   HATASINI ÇÖZEN KISIM BURASI.
*/

async function askBrain(messages) {

    /*
       1. OpenRouter varsa önce dene.
    */

    if (orKey) {

        const answer =
            await askOR(messages);

        if (answer) {
            return answer;
        }
    }


    /*
       2. OpenRouter çalışmazsa Gemini.
    */

    if (apiKey) {

        const answer =
            await askG(messages);

        if (answer) {
            return answer;
        }
    }


    /*
       3. Hiç API yoksa yerel cevap.
       Son kullanıcı mesajını bul.
    */

    const lastUserMessage =
        [...messages]
            .reverse()
            .find(x => x.role === 'user');


    if (lastUserMessage) {

        const text =
            lastUserMessage.parts?.[0]?.text || '';

        const local =
            localBrain(text);

        if (local) {
            return local;
        }
    }


    /*
       4. Hiçbir beyin cevap veremediyse.
    */

    if (lastError) {

        return '⚠️ NICO beyin bağlantısında sorun oluştu:\n\n'
            + lastError;
    }


    return '🧠 Reis, şu anda bağlı bir yapay zeka modeli yok. OR-KEY veya NICO-KEY eklemelisin.';
}


/* =========================================================
   GLOBAL ASK BRAIN
========================================================= */

/*
   HTML içinde veya başka JS dosyasında:
   askBrain(...)
   çağrılırsa artık hata vermesin.
*/

window.askBrain = askBrain;


/* =========================================================
   MESAJ GÖNDERME
========================================================= */

async function send() {

    if (!inp) return;

    const text =
        inp.value.trim();

    if (!text) return;


    inp.value = '';


    /* -------------------------
       KURUCU ŞİFRESİ
    ------------------------- */

    if (text === pass) {

        founder = true;

        localStorage.setItem(
            'nico_founder',
            '1'
        );

        add('••••••', 'user');

        setTimeout(() => {

            add(
                'Hoş geldin Sidar Reis! 🎉 Seni tanıdım. Kurucu modu aktif.',
                'ai'
            );

        }, 400);

        return;
    }


    /* -------------------------
       YENİ ŞİFRE
    ------------------------- */

    if (
        founder &&
        text.startsWith('yeni şifre ')
    ) {

        const newPass =
            text.slice('yeni şifre '.length)
                .trim();

        if (!newPass) {

            add(
                'Yeni şifre boş olamaz Reis.',
                'ai'
            );

            return;
        }


        pass = newPass;

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


    /* -------------------------
       OPENROUTER KEY
    ------------------------- */

    if (
        text.startsWith('OR-KEY:')
    ) {

        const key =
            text.slice(7).trim();

        if (!key) {

            add(
                'OpenRouter anahtarı boş görünüyor.',
                'ai'
            );

            return;
        }


        orKey = key;

        localStorage.setItem(
            'nico_orkey',
            orKey
        );

        add(
            'OpenRouter beyni bağlandı Reis! 🧠',
            'ai'
        );

        return;
    }


    /* -------------------------
       GEMINI KEY
    ------------------------- */

    if (
        text.startsWith('NICO-KEY:')
    ) {

        const key =
            text.slice(9).trim();

        if (!key) {

            add(
                'Gemini anahtarı boş görünüyor.',
                'ai'
            );

            return;
        }


        apiKey = key;

        localStorage.setItem(
            'nico_key',
            apiKey
        );

        add(
            'Gemini beyni kaydedildi Reis! 🧠',
            'ai'
        );

        return;
    }


    /* -------------------------
       KULLANICI MESAJI
    ------------------------- */

    add(text, 'user');


    hist.push({

        role: 'user',

        text: text

    });


    /*
       API formatına çevir.
    */

    const messages =
        hist
            .slice(-12)
            .map(item => ({

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

            }))
            .filter(item =>
                item.parts[0].text
            );


    /* -------------------------
       YAZIYOR...
    ------------------------- */

    addTyping();


    try {

        /*
           NICO'NUN GERÇEK BEYNİ
        */

        const reply =
            await askBrain(messages);


        removeTyping();


        add(
            reply,
            'ai'
        );


        /*
           Geçmişe kaydet.
        */

        hist.push({

            role: 'model',

            text: reply

        });


        /*
           LocalStorage'a kaydet.
        */

        try {

            StorageManager.saveHistory(hist);

        } catch (storageError) {

            console.error(
                'Geçmiş kaydedilemedi:',
                storageError
            );
        }


    } catch (error) {

        removeTyping();


        console.error(
            'NICO ana hata:',
            error
        );


        add(
            '⚠️ NICO beklenmeyen bir hatayla karşılaştı:\n' +
            (error?.message || error),
            'ai'
        );
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
   SOHBET TEMİZLE
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
   FOTOĞRAF
========================================================= */

if (uploadBtn) {

    uploadBtn.addEventListener(
        'click',
        () => {

            add(
                '📷 Görsel sistemi henüz bağlanmadı Reis. Önce NICO\'nun metin beynini sağlamlaştırıyoruz.',
                'ai'
            );

        }
    );
}


/* =========================================================
   GEÇMİŞİ EKRANA YÜKLE
========================================================= */

if (chat) {

    chat.innerHTML = '';

    hist.forEach(item => {

        add(
            item.text,
            item.role === 'user'
                ? 'user'
                : 'ai'
        );

    });

}


/* =========================================================
   BAŞLANGIÇ
========================================================= */

console.log(
    'NICO AI başlatıldı.'
);

console.log(
    'OpenRouter:',
    orKey ? 'BAĞLI' : 'YOK'
);

console.log(
    'Gemini:',
    apiKey ? 'BAĞLI' : 'YOK'
);
