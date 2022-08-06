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