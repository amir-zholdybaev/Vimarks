function createTitleText(url, title) {
    //! Разобраться с обрезанием последнего символа у обычных слов
    const link = document.createElement('a');
    link.setAttribute('href', url);

    if (title !== '') return title;

    if (link.host !== '') {
        let str = url.replace('https://', '').replace('www.', '');
        return str.split(/\/+/)[0];
    }
    // if (link.host !== '') {
    //     return link.host.replace('www.', '');
    // }

    if (!url.includes("/")) return url;
    else {
        let str = url.slice(0, url.lastIndexOf('/'));
        return str.slice(str.lastIndexOf('/') + 1).replace('%20',' ');
    }
    //.replace(/^(?:https?:\/\/)?(?:[^\/]+\.)?([^.\/]+\.[^.\/]+).*$/, "$1")
}

function createMiniatureName(url) {
    let count = localStorage.getItem('count');
    count++;
    localStorage.setItem('count', count);

    const title = createTitleText(url, '');
    const blobName = `${title}_${count}`;

    return blobName;
}

function saveMiniature(url, blob) {
    //! Сделать экономичное выделение памяти под миниатюру
    const promise = new Promise((resolve, reject) => {

        window.webkitRequestFileSystem(window.TEMPORARY, 2*1024*1024, file => {

            file.root.getFile(createMiniatureName(url), {create: true}, fileEntry => {

                fileEntry.createWriter(fileWriter => {
                    fileWriter.write(blob);
                    resolve(fileEntry.toURL());
                }, saveError);

            },saveError);

        }, saveError);

    });

    return promise;
}
function saveError(error) {
    console.log(error);
}

function createColorMiniature(url) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    let fillText = createTitleText(url, '');
    let fontSize = '60px';
    let bgColor = '#EBBA3D';

    let colorsOfPopularSites = {
        "habr.com":"#629FBC","e.mail.ru":"#005CF8","developer.mozilla.org": '#000',"yandex.ru":"#FC4120","youtube.com":"#FF0000",
        "vk.com":"#0077FF","mail.ru":"#005FF9","ok.ru":"#F58220","avito.ru":"#97CF26","instagram.com":"#D23363","turbopages.org":"#F9CB00",
        "gismeteo.ru":"#009FFF","wildberries.ru":"#C911AA","facebook.com":"#1877F2","wikipedia.org":"#3366CC","google.ru":"#34A853",
        "market.yandex.ru":"#FFCC00","kinopoisk.ru":"#FF6A00","lenta.ru":"#222222","ria.ru":"#1345AE","gosuslugi.ru":"#548CF6",
        "ozon.ru":"#F11055","rambler.ru":"#315EFB","rbc.ru":"#6F4513","news.mail.ru":"#005FF9","aliexpress.ru":"#E62E04","drom.ru":"#DB001B",
        "sberbank.ru":"#0DDA00","twitter.com":"#1D9BF0","ficbook.net":"#4E0F00","championat.com":"#022236","mk.ru":"#2F6AA8","pikabu.ru":"#8AC858",
        "whatsapp.com":"#4BC959","novostinedeli24.com":"#008BD2","hh.ru":"#D6001C","dns-shop.ru":"#FC8507","hitmo.me":"#9F4F68",
        "auto.ru":"#DE3322","livejournal.com":"#15374C","kp.ru":"#B81D00","music.yandex.ru":"#944ACB","drive2.ru":"#CC0033",
        "lentainform.com":"#7B458E","glavnoe.net":"#E72328","2gis.ru":"#299402","sports.ru":"#000000","aliexpress.com":"#E62E04",
        "fandom.com":"#FD005B","onelink.me":"#4BDC96","litnet.com":"#67223C","roblox.com":"#232527","rt.com":"#6F4513","sportbox.ru":"#449DDD",
        "tass.ru":"#222071","gazeta.ru":"#B11116","vz.ru":"#262626","news.sportbox.ru":"#449DDD","sportmail.ru":"#005FF9","primpress.ru":"#236CB2",
        "rp5.ru":"#1463A2","mos.ru":"#CC2222","ivi.ru":"#EA0042","cian.ru":"#0468FF","tinkoff.ru":"#FFDD2D","yaplakal.com":"#85C5A8","t.me":"#28A7E8",
        "rg.ru":"#5B707C","mts.ru":"#6F4513","mirconnect.ru":"#189365","sport-express.ru":"#E83C36","citilink.ru":"#FF5200","pochta.ru":"#1937FF",
        "kommersant.ru":"#004465","tutu.ru":"#D94CAB","leroymerlin.ru":"#66C05D","jut.su":"#BEDD63","hotmo.org":"#003B95","tsargrad.tv":"#6F4513",
        "yandex.net":"#944ACB","otzovik.com":"#94302F","echo.msk.ru":"#6F4513","pinterest.ru":"#E60023","beeline.ru":"#FFC900","mvideo.ru":"#E31235",
        "youla.ru":"#9E74FD","consultant.ru":"#B0A5D0","fontanka.ru":"#F48120","auto.drom.ru":"#DB1D1D","vseinstrumenti.ru":"#D60101","nalog.ru":"#0066B3",
        "smi2.ru":"#3FAE48","irecommend.ru":"#FF6543","mangalib.me":"#E48F13","cloud.mail.ru":"#005FF9","google.com":"#34A853","amazon.com":"#131921",
        "imdb.com":"#F5C518","merriam-webster.com":"#305F7A","apple.com":"#888888","pinterest.com":"#D92136","dictionary.com":"#00248A",
        "yahoo.com":"#6001D2","yelp.com":"#FF1A1A","tripadvisor.com":"#34E0A1","britannica.com":"#326599","linkedin.com":"#0A66C2","weather.com":"#003399",
        "microsoft.com":"#05A6F0","espn.com":"107","homedepot.com":"#CC0000","healthline.com":"#010101","walmart.com":"#0071DC","webmd.com":"#0080C5",
        "cambridge.org":"#CD2813","cricbuzz.com":"#07B48C","bbc.com":"#6F4513","thefreedictionary.com":"#086B9C","gsmarena.com":"#818285",
        "craigslist.org":"#5D008F","mayoclinic.org":"#1F54A1","netflix.com":"#E60914","rottentomatoes.com":"#F93109","livescore.com":"#FF9200",
        "thesaurus.com":"#F44725","timeanddate.com":"#193D61","espncricinfo.com":"#038DCC","investopedia.com":"#323A56","wiktionary.org":"#0645B5",
        "bestbuy.com":"#0046BE","indeed.com":"#003A9B","indiatimes.com":"#3256A6","ytmp3.cc":"#0086CE","ndtv.com":"#3E3E3E","steampowered.com":"#19347B",
        "ebay.com":"#85B716","unsplash.com":"#000000","samsung.com":"#028AFF","spotify.com":"#19E68C","cdc.gov":"#105EAB","nih.gov":"#616265","deepl.com":"#0F2B46",
        "flashscore.com":"#1B7700","speedtest.net":"#141526","nordstrom.com":"#000000","businessinsider.com":"#0270FA","spanishdict.com":"#348DE1",
        "playstation.com":"#0070D1","theguardian.com":"#052962","cnbc.com":"#005594","vocabulary.com":"#0039A4","adobe.com":"#FA0F00",
        "bloomberg.com":"#000000","forbes.com":"#171615","xe.com":"#0A146E","blog.google":"#34A853","usnews.com":"#005EA6","lowes.com":"#012169",
        "twitch.tv":"#9147FF","tpbproxypirate.com":"#9E6940","dominos.com":"#10789F","hindustantimes.com":"#00B1CD","github.com":"#24292F",
        "caranddriver.com":"#23292E","coinmarketcap.com":"#0C3BFF","booking.com":"#003580","tiktok.com":"#FE2C55","softonic.com":"#0277BD",
        "globo.com":"#0A6AFF","mcdonalds.com":"#FCB910","wayfair.com":"#FFC600","friv.com":"#660093","nba.com":"#051C2D","goodhousekeeping.com":"#F50182",
        "stackoverflow.com":"#F48024","nintendo.com":"#E60012","epicgames.com":"#343434","techradar.com":"#2F6E91","hotels.com":"#D32F2F",
        "expedia.com":"#202843","akc.org":"#223F8D","calculator.net":"#003366","t-mobile.com":"#E20074","goodreads.com":"#E6B769","allrecipes.com":"#F15025",
        "onlinesbi.com":"#00B5EF","xfinity.com":"#000000"
    };

    for (domain in colorsOfPopularSites) {
        if (fillText == domain) {
            bgColor = colorsOfPopularSites[domain];
            break;
        }
    }

    canvas.width = 300;
    canvas.height = 200;
    ctx.beginPath();
    ctx.rect(0, 0, 300, 200);
    ctx.fillStyle = bgColor;
    ctx.fill();

    if (fillText.length > 6)
        fillText = fillText.slice(0, fillText.lastIndexOf('.'));
    
    if (fillText.length > 12) {
        fillText = fillText.slice(0, 12);
        fillText = `${fillText}...`;
    }

    let fonSizePoints = {
        240: '54px', 270: '50px', 290: '48px',
        300: '44px', 350: '40px', 360: '37px', 430: '34px'
    };

    ctx.font = `${fontSize} Arial`;
    let textMetrics = ctx.measureText(fillText);

    for (key in fonSizePoints) 
        if (textMetrics.width > key) 
            fontSize = fonSizePoints[key];

    ctx.font = `${fontSize} Arial`;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(fillText, canvas.width/2, canvas.height/1.8);

    const promise = new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            resolve(blob);
        });
    });

    return promise;
}

async function getFavicon(url) {
    const domain = createTitleText(url, '');
    const response = await fetch(`---https://api.faviconkit.com/${domain}/64`);

    if (!response.ok) {
        throw new Error(`Error status: ${response.status} from ${response.url}`);
    }

    return response.blob();
}

async function getScreenShot(url) {
    const service = 'https://api.apiflash.com/v1/urltoimage';
    const key = 'f9fabcf6b42c494b99a84acf99365ae8';
    const quality = '100';
    const thumbnailWidth = '300';
    const width = '1326';
    const height = '880';
    const delay = '1';
    const format = 'jpeg';
    const fresh = 'true';
    const noAds = 'true';
    const noCookieBanners = 'true';

    const response = await fetch(`${service}?access_key=${key}&quality=${quality}
    &thumbnail_width=${thumbnailWidth}&width=${width}&height=${height}&delay=${delay}
    &format=${format}&fresh=${fresh}&no_ads=${noAds}&no_cookie_banners=${noCookieBanners}&url=${url}`);

    if (!response.ok) {
        throw new Error(`Error status: ${response.status} from ${response.url}`);
    }

    return response.blob();
}

function createMiniature(url) {
    const promise = new Promise((resolve, reject) => {
        getScreenShot(url)
            .then(myBlob => {
                saveMiniature(url, myBlob)
                    .then(blobLink => resolve(blobLink));
            })
            .catch(() => {
                getFavicon(url)
                    .then(myBlob => {
                        saveMiniature(url, myBlob)
                            .then(blobLink => resolve(blobLink));
                    })
                    .catch(() => {
                        createColorMiniature(url)
                            .then(myBlob => {
                                saveMiniature(url, myBlob)
                                    .then(blobLink => resolve(blobLink));
                            })
                    });
            });
    });

    return promise;
    //! Сделать экономичное выделение памяти под миниатюру
}

function createBookmarksLink(url) {
    const link = createLink('bookmarks__link', url);
    link.classList.add('loading');
    link.setAttribute('onclick', 'event.preventDefault()');

    return link;
}

function makeLinkClickable(link) {
    link.classList.remove('loading');
    link.removeAttribute('onclick');
}
function makeLinkUnClickable(link) {
    link.classList.add('loading');
    link.setAttribute('onclick', 'event.preventDefault()');
}

function saveBookmark(url, title, src, folderId) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    let folder = findFolder(bookmarks, +folderId);
    let folderLength;

    if ('folderId' in folder) folderLength = Object.keys(folder).length - 3;
    else folderLength = Object.keys(folder).length;

    folder[folderLength] = {
        link: url,
        title: title,
        img: src
    };
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}
// ==============================================================================================

function addLink(bookmarksRow) {
    const addLinkPopup = document.querySelector('#add-link-popup');
    const urlInput = document.querySelector('#add-link-url');
    const titleInput = document.querySelector('#add-link-title');
    const saveButton = document.querySelector('#add-link-save');
    const closeButton = document.querySelector('#add-link-close');
    const folderId = bookmarksRow.dataset.folderId;
    
    bookmarksRow.addEventListener('click', (event) => {
        let bookmark = event.target.closest('.bookmarks__item');
        let folderLink = event.target.closest('.folder') || event.target.closest('.passive');

        if (bookmark && !folderLink) {
            let bookmarkTitle = bookmark.nextElementSibling;

            addLinkPopup.classList.add('show');
            urlInput.focus();
            
            closeButton.onclick = () => {
                addLinkPopup.classList.remove('show');
                clearInputs(urlInput, titleInput);
            };

            saveButton.onclick = () => {
                if (urlInput.value !== '') {
                    const urlInputValue = urlInput.value;
                    const titleInputValue = titleInput.value;
                    const link = createBookmarksLink(urlInputValue);
                    const title = createTitleText(urlInputValue, titleInputValue);

                    bookmark.append(link);
                    bookmark.closest('.bookmarks__column').setAttribute('draggable', true);
                    bookmarkTitle.textContent = title;
                    addLinkPopup.classList.remove('show');
                    bookmarksRow.append(createBookmark());
                    clearInputs(urlInput, titleInput);

                    createMiniature(urlInputValue)
                        .then(miniature => {
                            const img = createImg('bookmarks__img', miniature);
                            link.append(img);
                            makeLinkClickable(link);
                            saveBookmark(urlInputValue, title, miniature, folderId);

                            const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
                            const folder = findFolder(bookmarks, +folderId);
                            folderRendering(folder);
                        });
                } 
            };
        }
    });
}