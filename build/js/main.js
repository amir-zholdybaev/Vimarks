function objectMove(object, element, position) {
    let index, temporary, objectLength = Object.keys(object).length;
    // локальные переменные

    element = parseInt(element, 10);
    position = parseInt(position, 10);
    // приведение входных параметров к целым числам

    if (element !== position && 0 <= element && element <= objectLength && 0 <= position && position <= objectLength) {
        // если позиции различны и находятся внутри массива

        temporary = object[element];
        // сохранить элемент с позиции 1

        if (element < position) {
            for (index = element; index < position; index++) {
                object[index] = object[index + 1];
            }
            // перемещение элемента вниз и смещение других элементов вверх
        }
        else {
            for (index = element; index > position; index--) {
                object[index] = object[index - 1];
            }
            // перемещение элемента вверх и смещение других элементов вниз
        }

        object[position] = temporary;
        // поместить элемент из позиции 1 в место назначения
    }

    return object;
}

function getElementNum(element) {
    let index = 0;
    while (element = element.previousSibling) {
        element.nodeType == 1 && index++;
    }
    return index;
    //* Эта функция работает если считать дочерние блоки с указаным селектором(без обертки)
    //* обернутые в один общий родительский блок

    //* Array.prototype.indexOf.call(bookmarksLinks, bookmarksLink);
    //* Эту функцию можно применять если считать блоки с указанным селектором в обертках
}

function createElementWithClass(teg, selector) {
    const element = document.createElement(teg);
    element.classList.add(selector);
    
    return element;
}

function createBookmark() {
    const bookmarksColumn = createElementWithClass('div', 'bookmarks__column');
    bookmarksColumn.append(createElementWithClass('div', 'bookmarks__item'));
    bookmarksColumn.append(createTitle('bookmarks__title', 'Добавить сайт'));

    return bookmarksColumn;
}

function createLink(selector, url) {
    const link = createElementWithClass('a', selector);
    link.setAttribute('href', url);
    link.setAttribute('draggable', 'false');

    return link;
}

function createImg(selector, link) {
    const img = createElementWithClass('img', selector);
    img.src = link;
    img.setAttribute('alt', ' ');
    img.setAttribute('draggable', 'false');

    return img;
}

function createTitle(selector, titleText) {
    const title = createElementWithClass('h2', selector);
    title.textContent = titleText;

    return title;
}

function clearInputs(...inputs) {
    inputs.forEach(item => item.value = '');
}

function popupsClose(eventTarget) {
  const openFolderPopup = document.querySelector('.open-folder-popup');

  const addLinkPopup = document.querySelector('#add-link-popup');
  const urlInput = document.querySelector('#add-link-url');
  const titleInput = document.querySelector('#add-link-title');
  const editMenu = document.querySelector('.edit-menu');
  const editButton = document.querySelector('#edit');
  const editPopup = document.querySelector('#edit-popup');
  const editTitleInput = document.querySelector('#edit-title');
  const openFolder = document.querySelector('.open-folder');

  let bookmarksItem = eventTarget.closest('.bookmarks__item');
  let folder = eventTarget.closest('.folder') || eventTarget.closest('.passive');
  let navItems = openFolder.querySelectorAll('.tabs-nav__item');
  let tabs = document.querySelectorAll('.tabs__tab');

  if (!bookmarksItem && !addLinkPopup.contains(eventTarget) || folder) {
    addLinkPopup.classList.remove('show');
    clearInputs(urlInput, titleInput);
  }

  if (!editMenu.contains(eventTarget)) 
      editMenu.classList.remove('show');

  if (!editButton.contains(eventTarget) && !editPopup.contains(eventTarget)) {
      editPopup.classList.remove('show');
      clearInputs(editTitleInput);
  }

  if (!folder && !openFolder.contains(eventTarget) && !editMenu.contains(eventTarget)
  && !addLinkPopup.contains(eventTarget) && !editPopup.contains(eventTarget)) {

    openFolderPopup.classList.remove('show');
    
    navItems.forEach(item => {
      item.remove();
    });
    tabs.forEach(item => {
      item.remove();
    })
  }
}

function renumObjKeys(object) {
    let i = 0;

    for (key in object) {
        let isObject = typeof object[key] === 'object' && object[key] !== null;

        if (isObject) {
            let value = object[key];
            delete object[key];
            object[i] = value;
            i++;
        }
    }

    return object;
}

function findFolder(object, folderId) {
    let array = [object];
    let folder;

    function recurs(array, folderId) {
        
        for (let i = 0; i < array.length; i++) {
            let object = array[i];
            let arr = [];
            let count = 0;
    
            for (key in object) {
                let isFolder = typeof object[key] === 'object' 
                && object[key] !== null 
                && 'folderId' in object[key];
    
                if (isFolder) {
                    if (object[key].folderId === folderId) {
                        folder = object[key];
                        return;
                    }
    
                    arr[count] = object[key];
                    count++;
                }
            }
    
            recurs(arr, folderId);
        }
    }
    
    recurs(array, folderId);

    if (folder === undefined) return object;
    else return folder;
}

function moveFromObjectToObject(firstFolder, secondFolder, firstKey, dropedPosition) {
    let object = {};
    let i = dropedPosition;

    for (key in secondFolder) {
        let isObject = typeof secondFolder[key] === 'object' && secondFolder[key] !== null;

        if (key >= dropedPosition && isObject) {
            object[i + 1] = secondFolder[key];
            delete secondFolder[key];
            i++;
        }
    }

    secondFolder[dropedPosition] = firstFolder[firstKey];
    delete firstFolder[firstKey];
    renumObjKeys(firstFolder);

    for (key in object) {
        secondFolder[key] = object[key];
    }
}

function generateId(idNumbers) {
    let id;

    for (let i = 0; i <= idNumbers.length; i++) {
        if (!idNumbers.includes(i)) {
            id = i;
            break;
        }
    }
    
    return id;
}

function folderRendering(folder) {
  if (folder !== undefined) {
    let folderLinks = document.querySelectorAll('.passive');
    
    folderLinks.forEach(link => {
      let folderColumn = link.closest('.bookmarks__column');
  
      if (+folderColumn.dataset.folderId === +folder.folderId) {
        folderImages = link.querySelectorAll('.bookmarks__img');
        folderImages.forEach(image => {image.remove();});
        
        let count = 0;
  
        for (key in folder) {
          if (typeof folder[key] === 'object' && folder[key] !== null && count < 4) {
            if ("folderName" in folder[key]) {
              if (folder[key].folderImg !== null)
                link.append(createImg('bookmarks__img', folder[key].folderImg));
              else
                link.append(createImg('bookmarks__img', 'build/img/passive.png'));
            }
            else
              link.append(createImg('bookmarks__img', folder[key].img));
              
            count++;
          }
        }
      }
    });
  }
}

// function findFolder(object, array) {
//     let folder;
//     let index = 0;

//     function recurs(object) {
//         folder = object[array[index]];
//         index++;
//         if (index >= array.length) return;
//         recurs(folder);
//     }
    
//     recurs(object);

//     return folder;
// }


// function trimTheString(string) {
//     let charCount = 0;
//     let trimmedString = '';

//     for (let char of string) {
//         if (charCount !== string.lastIndexOf('/')) trimmedString += char;
//         else break;

//         charCount++;
//     }

//     return trimmedString;
// }

// function convertStringToMassive(string) {
//     if (string !== undefined) {
//         let massive = string.split(',');

//         for (let i = 0; i < massive.length; i++)
//             massive[i] = +massive[i];
    
//         return massive;
//     }
// }
function initialData() {
    if (localStorage.getItem('count') == null) {
        localStorage.setItem('count', 1);
    }

    if (localStorage.getItem('bookmarks') == null) {

        localStorage.setItem('bookmarks', JSON.stringify(
            {
                0: {
                    0: {
                        link: 'https://www.youtube.com/',
                        title: 'youtube.com',
                        img: 'build/img/youtube.jpg'
                    },
                    1: {
                        link: 'https://www.instagram.com/',
                        title: 'instagram.com',
                        img: 'build/img/instagram.jpg'
                    },
                    2: {
                        link: 'https://twitter.com/',
                        title: 'twitter.com',
                        img: 'build/img/twitter.jpg'
                    },
                    3: {
                        link: 'https://www.facebook.com/',
                        title: 'facebook.com',
                        img: 'build/img/facebook.jpg'
                    },
                    4: {
                        link: 'https://vk.com/',
                        title: 'vk.com',
                        img: 'build/img/vk.jpg'
                    },
                    5: {
                        link: 'https://mail.ru/',
                        title: 'mail.com',
                        img: 'build/img/mail.jpg'
                    },
                    6: {
                        0: {
                            link: 'https://backgroundchecks.org/justdeleteme/#',
                            title: 'Удаление аккаунтов быстро',
                            img: 'build/img/delete.jpg'
                        },
                        1: {
                            link: 'https://liveuamap.com/',
                            title: 'Map UA',
                            img: 'build/img/map.jpg'
                        },
                        2: {
                            link: 'https://colorsinspo.com/',
                            title: 'colorsinspo.com',
                            img: 'build/img/colors.jpg'
                        },
                        3: {
                            link: 'https://www.colorion.co/',
                            title: 'colorion.co',
                            img: 'build/img/colorion.jpg'
                        },
                        folderName: 'Полезные',
                        folderImg: null,
                        folderId: 2
                    },
                    folderName: 'NetWorks',
                    folderImg: null,
                    folderId: 0
                },
                1: {
                    0: {
                        link: 'https://www.youtube.com/watch?v=JlMfyDlV_7A&list=PLA0M1Bcd0w8zPwP7t-FgwONhZOHt9rz9E&index=37',
                        title: 'OOP',
                        img: 'build/img/oop.jpg'
                    },
                    1: {
                        link: 'https://www.youtube.com/watch?v=EQ9BKzznpP8',
                        title: 'Понятие класса',
                        img: 'build/img/class.jpg'
                    },
                    2: {
                        link: 'https://www.youtube.com/watch?v=H_6-QCpl4DU',
                        title: '__init__ и __new__',
                        img: 'build/img/init-new.jpg'
                    },
                    3: {
                        0: {
                          link: 'https://www.youtube.com/watch?v=4XTy6ucbLNg&list=PLvTBThJr861yMBhpKafII3HZLAYujuNWw',
                          title: 'Курас по Vue',
                          img: 'build/img/vue-course.jpg'
                        },
                        1: {
                            link: 'https://www.youtube.com/watch?v=shueDQqCkzw&list=PLkCrmfIT6LBSn5sSboXnU8hDLeqYnUcVy&index=2',
                            title: 'Приложение на Vue',
                            img: 'build/img/vue-app.jpg'
                        },
                        2: {
                            link: 'https://www.youtube.com/watch?v=np08WdS9OXg',
                            title: 'Proxy js',
                            img: 'build/img/proxy.jpg'
                        },
                        folderName: 'Vue',
                        folderImg: null,
                        folderId: 3
                    },
                    folderName: 'Programming',
                    folderImg: 'build/img/programming.jpg',
                    folderId: 1
                },
                2: {
                    link: 'https://www.youtube.com/watch?v=P4pPdNj-mm0',
                    title: 'Куриный кёфта-кебаб',
                    img: 'build/img/kebab.jpg'
                }
            }
        ));

        localStorage.setItem('folderIDs', JSON.stringify([0, 1, 2, 3]));
    }
}
async function showBookmarks(bookmarksRow, bookmarks) {
    for (key in bookmarks) {
        if (typeof bookmarks[key] === 'object' && bookmarks[key] !== null) {
            const bookmarksColumn = createElementWithClass('div', 'bookmarks__column');
            const bookmarksItem = createElementWithClass('div', 'bookmarks__item');
            let bookmarksTitle;
            let bookmarksLink;

            if ("folderName" in bookmarks[key]) {
                bookmarksTitle = createTitle('bookmarks__title', bookmarks[key].folderName);
                bookmarksLink = createLink('bookmarks__link', '#');
                bookmarksLink.setAttribute('onclick', 'event.preventDefault()');
                let bookmarksQuantity = Object.keys(bookmarks[key]).length - 3;
    
                if (bookmarks[key].folderImg !== null) {
                    bookmarksLink.append(createImg('bookmarks__img', bookmarks[key].folderImg));
                    bookmarksLink.classList.add('folder');
                }
                else {
                    bookmarksLink.classList.add('passive');
    
                    let count = 0;
                    
                    while (count < bookmarksQuantity && count < 4) {
                        if ("folderName" in bookmarks[key][count]) {
                            if (bookmarks[key][count].folderImg !== null) {
                                bookmarksLink.append(createImg('bookmarks__img', bookmarks[key][count].folderImg));
                            }
                            else {
                                bookmarksLink.append(createImg('bookmarks__img', 'build/img/passive.png'));
                            }
                        }
                        else {
                            bookmarksLink.append(createImg('bookmarks__img', bookmarks[key][count].img));
                        }
                        
                        count++;
                    }
                }
            }
            else {
                bookmarksTitle = createTitle('bookmarks__title', bookmarks[key].title);
                bookmarksLink = createLink('bookmarks__link', bookmarks[key].link);
                bookmarksLink.append(createImg('bookmarks__img', bookmarks[key].img));
                bookmarksLink.addEventListener('click', (event) => {event.stopPropagation();});
            }

            bookmarksColumn.setAttribute('draggable', true);
            bookmarksColumn.append(bookmarksItem);
            bookmarksColumn.append(bookmarksTitle);
            bookmarksItem.append(bookmarksLink);
    
            bookmarksRow.append(bookmarksColumn);
        }
    }

    bookmarksRow.append(createBookmark());
    
    let columns = bookmarksRow.querySelectorAll('.bookmarks__column');

    for (let key in bookmarks) {
        let isObject = typeof bookmarks[key] === 'object' && bookmarks[key] !== null;

        if (isObject && bookmarks[key].folderId !== undefined) 
            columns[key].setAttribute('data-folder-id', bookmarks[key].folderId);
    }
}
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
function editPupup(bookmarks, bookmarksLink, bookmarksNum, folder) {
    const editPopup = document.querySelector('#edit-popup');
    const editUrl = document.querySelector('#edit-url');
    const urlInput = document.querySelector('#edit-url-input');
    const titleInput = document.querySelector('#edit-title-input');
    const closeButton = document.querySelector('#edit-close');
    const saveButton = document.querySelector('#edit-save');
    let bookmarksTitle = bookmarksLink.closest('.bookmarks__item').nextElementSibling;

    urlInput.value = bookmarksLink.href;
    titleInput.value = bookmarksTitle.textContent;
    editPopup.classList.add('show');

    (bookmarksLink.classList.contains('folder') || bookmarksLink.classList.contains('passive')) 
    ? editUrl.style.display = 'none' 
    : editUrl.style.display = 'block';

    closeButton.onclick = () => {
        editPopup.classList.remove('show');
    };

    saveButton.onclick = () => {
        if (urlInput.value !== '') {
            let urlInputValue = urlInput.value;
            let titleInputValue = titleInput.value;
            const bookmarkTitle = bookmarksLink.closest('.bookmarks__item').nextElementSibling;
            const title = createTitleText(urlInputValue, titleInputValue);

            bookmarksLink.href = urlInputValue;
            bookmarkTitle.textContent = title;

            if ("folderName" in folder[bookmarksNum]) {
                folder[bookmarksNum].folderName = title;
            }
            else {
                folder[bookmarksNum].link = urlInputValue;
                folder[bookmarksNum].title = title;
            }

            editPopup.classList.remove('show');
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
    };
}

function updateMiniature(bookmarks, bookmarksLink, bookmarksNum, folder) {
    const img = bookmarksLink.querySelector('.bookmarks__img');

    img.style.display = 'none';
    makeLinkUnClickable(bookmarksLink);

    createMiniature(bookmarksLink.href)
            .then(miniature => {
                img.src = miniature;
                img.style.display = 'block';
                makeLinkClickable(bookmarksLink);

                folder[bookmarksNum].img = miniature;
                folderRendering(folder);
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            });
}

function removeBookmark(bookmarks, bookmarksLink, bookmarksNum, folder) {
    let folderId = folder[bookmarksNum].folderId;

    if (folderId) {
      let folderIDs = JSON.parse(localStorage.getItem('folderIDs'));
      let index = folderIDs.indexOf(folderId);
      folderIDs.splice(index, 1);
      localStorage.setItem('folderIDs', JSON.stringify(folderIDs));
    }
    
    bookmarksLink.closest('.bookmarks__column').remove();

    delete folder[bookmarksNum];

    renumObjKeys(folder);

    folderRendering(folder);

    localStorage.setItem('bookmarks', JSON.stringify(renumObjKeys(bookmarks)));
}

function reduceImageSize(image, canvasWidth, canvasHeight) {
    //! Реализовать простое пропорциональное уменьшение фотографии
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvasRatio = canvasWidth / canvasHeight;

    if (image.width > image.height && !(image.width / image.height < canvasRatio)) {
        let ratio = image.width / image.height;
        let imageWidth = canvasHeight * ratio;
        let bias = ((imageWidth - canvasWidth) / 2) - ((imageWidth - canvasWidth) / 2) * 2;
        ctx.drawImage(image, bias, 0, imageWidth, canvasHeight);
    }
    else {
        let ratio = image.height / image.width;
        let imageHeight = canvasWidth * ratio;
        let bias = ((imageHeight - canvasHeight) / 2) - ((imageHeight - canvasHeight) / 2) * 2;
        ctx.drawImage(image, 0, bias, canvasWidth, imageHeight);
    }

    return canvas;
}

function downloadFromPC(bookmarks, bookmarksLink, bookmarksNum, folder) {
    //! Исправить баг - одна и таже картинка не загружается повторно подряд
    const fileInput = document.querySelector('#file');
    const bookmarksImg = bookmarksLink.querySelector('.bookmarks__img');

    fileInput.click();

    fileInput.onchange = () => {
        let file = fileInput.files[0];
        let reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function () {
            let image = new Image();
            image.src = reader.result;

            image.onload = function() {
                let canvas = reduceImageSize(image, 300, 200);

                canvas.toBlob(blob => {
                        saveMiniature(bookmarksLink.href, blob)
                            .then(blobLink => {
                                if ("folderImg" in folder[bookmarksNum]) {
                                    bookmarksLink.classList.remove('passive');
                                    bookmarksLink.classList.add('folder');
                                    folder[bookmarksNum].folderImg = blobLink;
                                }
                                else folder[bookmarksNum].img = blobLink;

                                bookmarksImg.src = blobLink;
                                folderRendering(folder);
                                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
                            });
                    });
            };
        }
    };
}

// ==================================================================================================

function editBookmark() {
    const editMenu = document.querySelector('.edit-menu');
    const editButton = document.querySelector('#edit');
    const updateButton = document.querySelector('#update');
    const downloadButton = document.querySelector('#download');
    const deleteButton = document.querySelector('#delete');

    document.addEventListener('contextmenu', event => {
        let bookmarksLink = event.target.closest('.bookmarks__link');

        if (bookmarksLink && !bookmarksLink.classList.contains('loading')) {
            let bookmarksRow = bookmarksLink.closest('.bookmarks__row');
            let bookmarksNum = getElementNum(bookmarksLink.closest('.bookmarks__column'));
            let folderId = bookmarksRow.dataset.folderId;
            let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
            let folder = findFolder(bookmarks, +folderId);

            event.preventDefault();
            editMenu.style.top = `${event.pageY}px`;
            editMenu.style.left = `${event.pageX}px`;

            (bookmarksLink.classList.contains('folder') || bookmarksLink.classList.contains('passive'))
            ? updateButton.style.display = 'none'
            : updateButton.style.display = 'block';
            
            editMenu.classList.add('show');
            
            editButton.onclick = () => {
                editMenu.classList.remove('show');
                editPupup(bookmarks, bookmarksLink, bookmarksNum, folder);
            };
            updateButton.onclick = () => {
                editMenu.classList.remove('show');
                updateMiniature(bookmarks, bookmarksLink, bookmarksNum, folder);
            }
            downloadButton.onclick = () => {
                editMenu.classList.remove('show');
                downloadFromPC(bookmarks, bookmarksLink, bookmarksNum, folder);
            };
            deleteButton.onclick = () => {
                editMenu.classList.remove('show');
                removeBookmark(bookmarks, bookmarksLink, bookmarksNum, folder);
            };
        }
        else editMenu.classList.remove('show');
    });
}
function createNavItem(folderId, folderName) {
  let navItem = document.createElement('div');

  navItem.classList.add('tabs-nav__item');
  navItem.classList.add('active');

  navItem.setAttribute('data-tab-name', folderId);
  navItem.textContent = folderName;

  return navItem;
}

function createTab() {
  let tab = document.createElement('div');

  tab.classList.add('tabs__tab');
  tab.classList.add('active');

  return tab;
}

function createFolderRow(folderId) {
  let folderRow = document.createElement('div');
  folderRow.classList.add('bookmarks__row');

  folderRow.setAttribute('data-folder-id', `${folderId}`);

  return folderRow;
}

function folderIsOpen(folderId, navItems) {
  let folderIsOpen = false;

  navItems.forEach((item) => {
      if (item.dataset.tabName === folderId) folderIsOpen = true;
  });

  return folderIsOpen;
}

function selectTab(folderId, navItems, tabs) {
  navItems.forEach((item) => {
      if (item.dataset.tabName === folderId) item.classList.add('active');
      else item.classList.remove('active');
  });

  tabs.forEach((item) => {
      let row = item.querySelector('.bookmarks__row');

      if (row.dataset.folderId === folderId) item.classList.add('active');
      else item.classList.remove('active');
  });
}

function foldersOpening(eventTarget) {
  const openFolder = document.querySelector('.open-folder');
  const openFolderPopup = document.querySelector('.open-folder-popup');
  const tabsNav = document.querySelector('.tabs-nav');
  const tabsContent = document.querySelector('.tabs__content');

  let folderLink = eventTarget.closest('.folder') || eventTarget.closest('.passive') 

  if (folderLink) {
    let folderColumn = folderLink.closest('.bookmarks__column');
    let folderId = folderColumn.dataset.folderId;
    let folderName = folderColumn.querySelector('.bookmarks__title').textContent;
    let navItems = openFolder.querySelectorAll('.tabs-nav__item');
    let tabs = openFolder.querySelectorAll('.tabs__tab');
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    if (navItems === undefined || !folderIsOpen(folderId, navItems)) {
        let navItem = createNavItem(folderId, folderName);
        let tab = createTab();
        let folderRow = createFolderRow(folderId);

        tabsNav.append(navItem);
        tab.append(folderRow);
        tabsContent.append(tab);

        openFolderPopup.classList.add('show');

        showBookmarks(folderRow, findFolder(bookmarks, +folderId));
        selectTab(folderId, navItems, tabs);
        addLink(folderRow);
    }
    else selectTab(folderId, navItems, tabs);
  }
}

function foldersSwitching() {
  const openFolder = document.querySelector('.open-folder');
  const tabsNav = document.querySelector('.tabs__nav');

  function switchingFolders(eventTarget) {
    let navItem = eventTarget.closest('.tabs-nav__item');

    if (navItem) {
        let navItems = openFolder.querySelectorAll('.tabs-nav__item');
        let tabs = openFolder.querySelectorAll('.tabs__tab');
        let tabName = navItem.dataset.tabName;

        selectTab(tabName, navItems, tabs);
    }
  }

  tabsNav.onclick = (event) => {
    switchingFolders(event.target);
  }

  let timerId;

  tabsNav.ondragenter = (event) => {
    let folderBookmark = event.target.closest('.tabs-nav__item');

    if (folderBookmark) {
      timerId = setTimeout(() => {
        switchingFolders(event.target);
      }, 300);
    }
  }

  tabsNav.ondragleave = (event) => {
    let folderBookmark = event.target.closest('.tabs-nav__item');

    if (folderBookmark) {
      clearTimeout(timerId);
    }
  }
}
function attachBookmark(firstColumn, secondColumn, secondBookmarkNum, dropedPosition, bookmarks) {
    let firstLink = firstColumn.querySelector('.bookmarks__link');
    let secondlink = secondColumn.querySelector('.bookmarks__link');
    let imageQuantity = secondlink.querySelectorAll('.bookmarks__img').length;
    let firstIsFolder = firstLink.classList.contains('passive') || firstLink.classList.contains('folder');
    let secondIsFolder = secondlink.classList.contains('passive') || secondlink.classList.contains('folder');
    let src = firstColumn.querySelector('.bookmarks__img').src;
    let img = createImg('bookmarks__img', src);
    let onHerself = firstLink === secondlink;
    let folderIDs = JSON.parse(localStorage.getItem('folderIDs'));
    let id = generateId(folderIDs);
    let folderId = firstColumn.closest('.bookmarks__row').dataset.folderId;

    if (!firstIsFolder && !onHerself) {
        if (!(imageQuantity > 3) && !secondlink.classList.contains('folder')) {
            secondlink.classList.add('passive');
            secondlink.href = '#';
            secondlink.append(img);
            secondlink.setAttribute('onclick', 'event.preventDefault()');
            secondColumn.setAttribute('data-folder-id', `${id}`);
            secondlink.closest('.bookmarks__item').nextElementSibling.textContent = 'Папка';
        }
        
        firstColumn.remove();
    }
    else if (firstIsFolder && secondIsFolder && !onHerself) {
        if (!(imageQuantity > 3) && !firstLink.classList.contains('passive') && !secondlink.classList.contains('folder')) {
            secondlink.append(img);
        }
        else if (!(imageQuantity > 3) && firstLink.classList.contains('passive') && secondlink.classList.contains('passive')) {
            img = createImg('bookmarks__img', 'build/img/passive.png');
            secondlink.append(img);
        }
        
        firstColumn.remove();
    }
    else if (firstIsFolder && !secondIsFolder) {
        console.log('Папку в не папку');
    }

    if (!(firstIsFolder && !secondIsFolder) && !onHerself) {
        if (bookmarks[secondBookmarkNum].folderName !== undefined) {
            let first = bookmarks[dropedPosition];
            delete bookmarks[dropedPosition];
            bookmarks[secondBookmarkNum][Object.keys(bookmarks[secondBookmarkNum]).length - 3] = first;

            console.log('В папку');
        }
        else {
            let first = bookmarks[dropedPosition];
            let second = bookmarks[secondBookmarkNum];

            delete bookmarks[dropedPosition];
            delete bookmarks[secondBookmarkNum];

            let object = {
                folderName: 'Папка',
                folderImg: null,
                folderId: id,
                0: second,
                1: first
            }
            bookmarks[secondBookmarkNum] = object;

            folderIDs[folderIDs.length] = id;
            localStorage.setItem('folderIDs', JSON.stringify(folderIDs));

            console.log('Не в папку');
        }

        renumObjKeys(bookmarks);
        let folder = findFolder(bookmarks, +folderId);
        folderRendering(folder);
    }
}

const dragAndDrop = () => {
    let firstColumn;
    let secondColumn;
    let secondItem;
    let firstBookmarkNum;
    let secondBookmarkNum;
    let dropedPosition;
    let bookmarks;
    let nested;
    let firstRow;
    let secondRow;
    let firstFolderId;
    let secondFolderId;
    let firstFolder;
    let secondFolder;
    let folderIsOpen = false;

    document.ondragstart = (event) => {
        firstColumn = event.target.closest('.bookmarks__column');

        if (firstColumn) {
            nested = false;
            firstColumn.classList.add('hide');
            dropedPosition = getElementNum(firstColumn);
            firstBookmarkNum = getElementNum(firstColumn);
            firstRow = firstColumn.closest('.bookmarks__row');
            bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
            firstFolderId = firstRow.dataset.folderId;
            firstFolder = findFolder(bookmarks, +firstFolderId);
        }
    }

    document.ondragenter = (event) => {
        secondItem = event.target.closest('.bookmarks__item');
        secondColumn = event.target.closest('.bookmarks__column');

        if (secondItem && secondColumn !== firstColumn) {
            secondBookmarkNum = getElementNum(secondColumn);
            secondRow = secondColumn.closest('.bookmarks__row');
            secondFolderId = secondRow.dataset.folderId;
            secondFolder = findFolder(bookmarks, +secondFolderId);
        }
        
        if (!folderIsOpen) {
          popupsClose(event.target);
        }
    }

    let item;
    let itemCords;
    let column;
    let isSecondHalf;
    let oppa = 0;
    let oppa2 = null;
    let timerId;

    document.ondragover = (event) => {
        item = event.target.closest('.bookmarks__item');

        if (item && item.querySelector('.bookmarks__link')) {
            itemCords = item.getBoundingClientRect();
            column = item.closest('.bookmarks__column');
            isSecondHalf = event.clientX > (itemCords.left + itemCords.width / 2);

            if (column.nextSibling !== firstColumn && isSecondHalf) {
                column.after(firstColumn);
            }
            else if (column.nextSibling === firstColumn && !isSecondHalf) {
                column.before(firstColumn);
            }
            else if (column.nextSibling !== firstColumn && !isSecondHalf) {
                column.before(firstColumn);
                column.classList.add('hovered');
            }
            else column.classList.add('hovered');

            //! column поменять на secondColumn
            if (firstRow !== secondRow && column !== firstColumn) {
                firstBookmarkNum = dropedPosition;
                dropedPosition = getElementNum(firstColumn);
                moveFromObjectToObject(firstFolder, secondFolder, firstBookmarkNum, dropedPosition);
                folderRendering(firstFolder);
                folderRendering(secondFolder);
                column.classList.remove('hovered');
                firstRow = firstColumn.closest('.bookmarks__row');
                firstFolderId = firstRow.dataset.folderId;
                firstFolder = findFolder(bookmarks, +firstFolderId);
                localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            }
            else if (dropedPosition !== getElementNum(firstColumn) && !nested && firstRow === secondRow) {
                firstBookmarkNum = dropedPosition;
                dropedPosition = getElementNum(firstColumn);
                objectMove(firstFolder, firstBookmarkNum, dropedPosition);
                folderRendering(firstFolder);
            }

            if (oppa2 !== secondColumn && event.target.closest('.bookmarks__column') !== firstColumn && oppa < 1 && column.classList.contains('hovered')) {
              folderIsOpen = true;
              console.log('hello');
              oppa++;
              oppa2 = secondColumn;

              timerId = setTimeout(() => {
                console.log('timer');
                foldersOpening(event.target);
              }, 300);
            }
        }
    }

    document.ondragleave = (event) => {
        let item = event.target.closest('.bookmarks__item');

        if (item) {
            let column = item.closest('.bookmarks__column');
            column.classList.remove('hovered');
            folderIsOpen = false;
            
            oppa = 0;

            if (event.target.closest('.bookmarks__column') !== firstColumn) {
              oppa2 = null;
              clearTimeout(timerId);
            }
        }
    }

    document.ondragend = (event) => {
        let column = event.target.closest('.bookmarks__column');
        column.classList.remove('hide');

        if (secondItem !== null) {
            attachBookmark(firstColumn, secondColumn, secondBookmarkNum, dropedPosition, firstFolder);
            nested = true;
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
}

function main() {
    initialData();

    const bookmarksRow = document.querySelector('.bookmarks__row');
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    showBookmarks(bookmarksRow, bookmarks);
    addLink(bookmarksRow);

    editBookmark();
    dragAndDrop();
    document.addEventListener('click', (event) => {foldersOpening(event.target);});
    foldersSwitching();
    document.addEventListener('click', function(event) {popupsClose(event.target);});
}

main();