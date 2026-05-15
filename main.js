let favoriler =
    JSON.parse(localStorage.getItem('renk_favs')) || [];

let tasarimlar =
    JSON.parse(localStorage.getItem('renk_tasarimlar')) || [];

let guncellenenId = null;
let adminAktif = false;

if (!localStorage.getItem('admin_hazir_veriler')) {
    localStorage.setItem(
        'admin_hazir_veriler',
        JSON.stringify(hazirVeriler)
    );
}

let aktifKesfetVerileri =
    JSON.parse(localStorage.getItem('admin_hazir_veriler'));

function sayfaAc(id) {
    document.querySelectorAll('.sayfa')
    .forEach(s => s.style.display = 'none');

    if (id === 'bolum-admin') {
        document.getElementById('bolum-admin').style.display = 'block';
        if (!adminAktif) return;
        adminPaneliniYukle();
        return;
    }

    const hedef = document.getElementById(id);
    if (hedef) {
        hedef.style.display = 'block';
    }

    if (id === 'bolum-kesfet') {
        filtreliKesfetYukle();
    }


    if (id === 'bolum-api') {
        document.getElementById('api-liste').innerHTML = `
            <p style="text-align:center; width:100%; color:#888;">Henüz arama yapılmadı. Yukarıya bir tema yazıp arayın!</p>
        `;
    }


    if (id === 'bolum-fav') {
        kartlariCiz(
            favoriler,
            document.getElementById('fav-liste'),
            "favori"
        );
    }


    if (id === 'bolum-palet') {
        kartlariCiz(
            tasarimlar,
            document.getElementById('kendi-liste'),
            "tasarim"
        );
    }
}
function yeniRenkInputEkle() {
    const inputAlani = document.getElementById('renk-input-alani');
    if (!inputAlani) return;


    const kapsayici = document.createElement('div');
    kapsayici.className = 'renk-kapsayici';
    kapsayici.style.position = 'relative';
    kapsayici.style.display = 'inline-block';


    const yeniInput = document.createElement('input');
    yeniInput.type = 'color';
    yeniInput.className = 'renk-girdisi';
    yeniInput.value = '#a29bfe';

    const silBtn = document.createElement('span');
    silBtn.innerHTML = '×';
    silBtn.className = 'renk-sil-btn';
    silBtn.style.position = 'absolute';
    silBtn.style.top = '0';
    silBtn.style.right = '0';
    silBtn.style.background = '#ff7675';
    silBtn.style.color = 'white';
    silBtn.style.width = '18px';
    silBtn.style.height = '18px';
    silBtn.style.borderRadius = '50%';
    silBtn.style.fontSize = '12px';
    silBtn.style.display = 'flex';
    silBtn.style.alignItems = 'center';
    silBtn.style.justifyContent = 'center';
    silBtn.style.cursor = 'pointer';
    silBtn.style.fontWeight = 'bold';
    silBtn.style.fontFamily = "'Poppins', sans-serif";

    silBtn.onclick = function() {
        kapsayici.remove();
    };

    kapsayici.appendChild(yeniInput);
    kapsayici.appendChild(silBtn);
    inputAlani.appendChild(kapsayici);
}
function adminGiris() {
    const sifre = document.getElementById('admin-sifre').value;
    if (sifre === "1234") {
        adminAktif = true;
        sayfaAc('bolum-admin');
    } else {
        alert("Hatalı şifre!");
    }
}

function adminCikis() {
    adminAktif = false;
    alert("Çıkış yapıldı");
    sayfaAc('bolum-kesfet');
}
function adminPaneliniYukle() {
    const adminKutu = document.querySelector('#bolum-admin');
    if (!adminKutu) return;

    adminKutu.innerHTML = `
        <div style="max-width:550px; margin:auto; padding:15px; background:#fff; border-radius:12px; border:1px solid #eee;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h3 id="adm-baslik">Keşfet Paketini Yönet</h3>
                <button onclick="adminCikis()" style="background:#111; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">Çıkış</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px; background:#f8f9fa; padding:12px; border-radius:8px; margin-bottom:15px;">
                <input type="text" id="adm-ad" placeholder="Paket Adı" style="padding:8px; border-radius:5px; border:1px solid #ddd;">
                
                <select id="adm-kategori" style="padding:8px; border-radius:5px; border:1px solid #ddd; background: white; cursor: pointer;">
                    <option value="Genel">Kategori Seçin (İsteğe Başlı)</option>
                    <option value="Pastel">Pastel</option>
                    <option value="Dark">Koyu (Dark)</option>
                    <option value="Cyber">Canlı (Cyber)</option>
                    <option value="Soft">Soft</option>
                </select>

                <div id="adm-renkler" style="display:flex; gap:5px; flex-wrap:wrap;">
                    <input type="color" class="adm-renk" value="#6200ea" style="width:30px; height:30px; border:none;">
                </div>

                <div style="display:flex; gap:5px;">
                    <button onclick="admRenkEkle()" style="flex:1;">+ Renk</button>
                    <button onclick="admKaydet()" id="adm-kaydet-btn" style="flex:2; background:#28a745; color:white; border:none; border-radius:5px; cursor:pointer;">Paketi Yayınla</button>
                    <button onclick="adminPaneliniYukle()" id="adm-vazgec" style="display:none; flex:1; background:#666; color:white; border:none; border-radius:5px;">Vazgeç</button>
                </div>
            </div>

            <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                    <tr style="background:#f1f1f1;">
                        <th style="padding:8px; text-align:left;">Ad</th>
                        <th style="padding:8px; text-align:center;">İşlem</th>
                    </tr>
                </thead>
                <tbody id="admin-liste-tablo"></tbody>
            </table>
        </div>
    `;
    adminTabloCiz();
}

function adminTabloCiz() {
    const tablo = document.getElementById('admin-liste-tablo');
    if (!tablo) return;
    tablo.innerHTML = "";

    aktifKesfetVerileri.forEach(p => {
        const satir = document.createElement('tr');
        satir.innerHTML = `
            <td style="padding:8px;"><b>${p.ad}</b></td>
            <td style="padding:8px; text-align:center;">
                <span onclick="admDuzenle(${p.id})" style="color:blue; cursor:pointer; margin-right:10px;">Düzenleniyor</span>
                <span onclick="admSil(${p.id})" style="color:red; cursor:pointer;">Sil</span>
            </td>
        `;
        tablo.appendChild(satir);
    });
}
function admRenkEkle() {
    const kapsayici = document.createElement('div');
    kapsayici.style = "position:relative; display:inline-block;";

    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'adm-renk';
    input.value = '#000000';
    input.style = "width:30px; height:30px; border:none; cursor:pointer;";

    const silBtn = document.createElement('span');
    silBtn.innerHTML = '×';
    silBtn.style = "position:absolute; top:-8px; right:-8px; background:red; color:white; width:16px; height:16px; border-radius:50%; font-size:11px; display:flex; align-items:center; justify-content:center; cursor:pointer;";
    silBtn.onclick = () => kapsayici.remove();

    kapsayici.appendChild(input);
    kapsayici.appendChild(silBtn);
    document.getElementById('adm-renkler').appendChild(kapsayici);
}

function admDuzenle(id) {
    const p = aktifKesfetVerileri.find(x => x.id === id);
    if (!p) return;

    guncellenenId = id;
    document.getElementById('adm-baslik').innerText = "Düzenleniyor: " + p.ad;
    document.getElementById('adm-ad').value = p.ad;

    const kategoriSelect = document.getElementById('adm-kategori');
    if (kategoriSelect) {
        const isim = p.ad.toLowerCase();
        if (isim.includes("pastel")) kategoriSelect.value = "Pastel";
        else if (isim.includes("dark") || isim.includes("coffee")) kategoriSelect.value = "Dark";
        else if (isim.includes("cyber") || isim.includes("neon")) kategoriSelect.value = "Cyber";
        else if (isim.includes("soft") || isim.includes("dream")) kategoriSelect.value = "Soft";
        else kategoriSelect.value = "Genel";
    }

    document.getElementById('adm-kaydet-btn').innerText = "Kaydet";
    document.getElementById('adm-vazgec').style.display = "block";

    const renkKutusu = document.getElementById('adm-renkler');
    renkKutusu.innerHTML = "";

    p.renkler.forEach(r => {
        const kapsayici = document.createElement('div');
        kapsayici.style = "position:relative; display:inline-block;";

        const input = document.createElement('input');
        input.type = 'color';
        input.className = 'adm-renk';
        input.value = r;
        input.style = "width:30px; height:30px; border:none; cursor:pointer;";

        const silBtn = document.createElement('span');
        silBtn.innerHTML = '×';
        silBtn.style = "position:absolute; top:-8px; right:-8px; background:red; color:white; width:16px; height:16px; border-radius:50%; font-size:11px; display:flex; align-items:center; justify-content:center; cursor:pointer;";
        silBtn.onclick = () => kapsayici.remove();

        kapsayici.appendChild(input);
        kapsayici.appendChild(silBtn);
        renkKutusu.appendChild(kapsayici);
    });
}

function admKaydet() {
    let ad = document.getElementById('adm-ad').value;
    const kat = document.getElementById('adm-kategori').value;
    const renkler = Array.from(document.querySelectorAll('.adm-renk')).map(i => i.value);

    if (!ad) {
        alert("İsim gir!");
        return;
    }

    if (kat !== "Genel" && !ad.toLowerCase().includes(kat.toLowerCase())) {
        ad = ad + " " + kat;
    }

    if (guncellenenId) {
        const idx = aktifKesfetVerileri.findIndex(x => x.id === guncellenenId);
        aktifKesfetVerileri[idx] = { ...aktifKesfetVerileri[idx], ad, renkler };
        guncellenenId = null;
    } else {
        aktifKesfetVerileri.push({ id: Date.now(), ad, renkler });
    }

    localStorage.setItem('admin_hazir_veriler', JSON.stringify(aktifKesfetVerileri));
    adminPaneliniYukle();
}

function admSil(id) {
    if (confirm("Silinsin mi?")) {
        aktifKesfetVerileri = aktifKesfetVerileri.filter(x => x.id !== id);
        localStorage.setItem('admin_hazir_veriler', JSON.stringify(aktifKesfetVerileri));
        adminTabloCiz();
    }
}
function kartlariCiz(dizi, hedef, mod) {
    if (!hedef) return;
    hedef.innerHTML = "";

    dizi.forEach(p => {
        const kart = document.createElement('div');
        kart.className = 'polaroid';

        const bg = p.renkler.length > 1
            ? `linear-gradient(135deg, ${p.renkler.join(',')})`
            : p.renkler[0];

        let btn = "";
        if (mod === "kesfet") {
            btn = `<button onclick="favoriyeEkle('${p.ad}', '${p.renkler}')" class="btn-fav">❤️ Favori</button>`;
        } else if (mod === "favori") {
            btn = `<button onclick="favoriSil(${p.id})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:10px; cursor:pointer;">Sil</button>`;
        } else if (mod === "tasarim") {
            btn = `<button onclick="tasarimSil(${p.id})" style="background:red; color:white; border:none; padding:5px 10px; border-radius:10px; cursor:pointer;">Sil</button>`;
        }

        kart.innerHTML = `
            <div class="renk-kutusu" style="background:${bg}"></div>
            <p><b>${p.ad}</b></p>
            <div class="renk-kod-alani">${p.renkler.join(' | ')}</div>
            ${btn}
        `;
        hedef.appendChild(kart);
    });
}
function favoriyeEkle(ad, renkStr) {
    if (!favoriler.some(f => f.ad === ad)) {
        favoriler.push({
            id: Date.now(),
            ad,
            renkler: renkStr.split(',')
        });
        localStorage.setItem('renk_favs', JSON.stringify(favoriler));
        alert("Favorilere eklendi!");
    }
}

function favoriSil(id) {
    favoriler = favoriler.filter(f => f.id !== id);
    localStorage.setItem('renk_favs', JSON.stringify(favoriler));
    sayfaAc('bolum-fav');
}

function tasarimSil(id) {
    tasarimlar = tasarimlar.filter(t => t.id !== id);
    localStorage.setItem('renk_tasarimlar', JSON.stringify(tasarimlar));
    sayfaAc('bolum-palet');
}

function kullaniciPaletiniKaydet() {
    const renkler = Array.from(document.querySelectorAll('.renk-girdisi')).map(i => i.value);
    if (renkler.length === 0) {
        alert("Renk seç!");
        return;
    }

    const ad = prompt("Palet ismi gir");
    if (!ad) return;

    tasarimlar.push({ id: Date.now(), ad, renkler });
    localStorage.setItem('renk_tasarimlar', JSON.stringify(tasarimlar));
    sayfaAc('bolum-palet');
    alert("Atölyene kaydedildi!");
}
let seciliKategori = "Hepsi";

function kategoriSec(kategori) {
    seciliKategori = kategori;
    filtreliKesfetYukle();
}

function filtreliKesfetYukle() {
    const galeri = document.getElementById('ana-liste');
    if (!galeri) return;
    galeri.innerHTML = "";

    const filtrelenmisVeriler = aktifKesfetVerileri.filter(p => {
        if (seciliKategori === "Hepsi") return true;

        const paletAdi = p.ad.toLowerCase();
        const arananKategori = seciliKategori.toLowerCase();

        if (arananKategori === "koyu") {
            return paletAdi.includes("koyu") || paletAdi.includes("dark") || paletAdi.includes("coffee");
        }
        if (arananKategori === "canlı") {
            return paletAdi.includes("canlı") || paletAdi.includes("canli") || paletAdi.includes("cyber") || paletAdi.includes("neon");
        }
        if (arananKategori === "soft") {
            return paletAdi.includes("soft") || paletAdi.includes("dream");
        }
        if (arananKategori === "pastel") {
            return paletAdi.includes("pastel");
        }
        return paletAdi.includes(arananKategori);
    });

    kartlariCiz(filtrelenmisVeriler, galeri, "kesfet");
}
function apiPaletAra() {
    const kelimeInput = document.getElementById('api-arama-input');
    const apiGaleri = document.getElementById('api-liste');
    
    if (!kelimeInput || !apiGaleri) return;
    
    const sorgu = kelimeInput.value.trim();
    if (!sorgu) {
        alert("Lütfen bir tema girin! (Örn: autumn, neon, pastel)");
        return;
    }

    apiGaleri.innerHTML = `<p style="text-align:center; width:100%; color:#666;">ColorMagic API'den paletler getiriliyor...</p>`;

    const apiURL = `https://colormagic.app/api/palette/search?q=${encodeURIComponent(sorgu)}`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) throw new Error("API bağlantı hatası oluştu.");
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0 || (data.palettes && data.palettes.length === 0)) {
                apiGaleri.innerHTML = `<p style="text-align:center; width:100%; color:red;">"${sorgu}" temasına uygun bir ColorMagic paleti bulunamadı.</p>`;
                return;
            }

            const gelenPaletler = Array.isArray(data) ? data : (data.palettes || []);

            const donusturulmusPaletler = gelenPaletler.map(item => {
                return {
                    id: item.id || Date.now() + Math.random(),
                    ad: (item.title || item.name || sorgu) + " (ColorMagic)",
                    renkler: item.colors.map(c => c.startsWith('#') ? c : `#${c}`)
                };
            });

            kartlariCiz(donusturulmusPaletler, apiGaleri, "kesfet");
        })
        .catch(error => {
            console.error("ColorMagic API Hatası:", error);
            apiGaleri.innerHTML = `<p style="text-align:center; width:100%; color:red;">ColorMagic API sunucusuna bağlanırken bir sorun oluştu.</p>`;
        });
}

window.onload = () => {
    seciliKategori = "Hepsi";
    sayfaAc('bolum-kesfet');
};