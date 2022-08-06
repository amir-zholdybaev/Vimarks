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