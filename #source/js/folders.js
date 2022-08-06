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