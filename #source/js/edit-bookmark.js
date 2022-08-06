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