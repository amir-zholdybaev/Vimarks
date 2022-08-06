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