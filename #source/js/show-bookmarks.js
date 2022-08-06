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