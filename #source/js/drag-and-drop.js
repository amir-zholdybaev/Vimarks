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