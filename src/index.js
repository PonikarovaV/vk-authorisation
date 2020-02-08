console.log('v0.0.2');

import './styles/style.css';

import {
    FriendList
} from './scripts/Friend.js';

import {
    Validation
} from './scripts/Validation';

const $ = require("jquery");
const buttonFriands = document.querySelector('.button_type_friends');
const buttonAuthorisation = document.querySelector('.button_type_authorisation');
const buttonExit = document.querySelector('.button_type_exit');
const searchButton = document.querySelector('.search__button');
const searchInput = document.querySelector('.search__input');
const errorMessage = document.querySelector('.search__error');
const friendContainer = document.querySelector('.friendlist');
const searchContainer = document.querySelector('.searchlist');
const friendsCounter = document.querySelector('.friends__title');
const formSearch = document.querySelector('.search');
const vkRequest = 'https://oauth.vk.com/authorize?client_id=7312315&display=popup&redirect_uri=https://ponikarovav.github.io/vk-authorisation/&scope=friends,status&response_type=token&v=5.103&state=123456';


// новые токен и id при авторизации
let token;
let userID;

// список карточек с друзьями
const friendList = new FriendList({
    container: friendContainer,
    blockName: 'friendlist'
});

// список карточек найденных друзей
const searchList = new FriendList({
    container: searchContainer,
    blockName: 'searchlist'
});

// создание экземпляра класса для валидации формы search
const searchValidity = new Validation({
    form: formSearch,
    input: searchInput,
    button: searchButton,
    errorField: errorMessage
});

// проверка авторизации при загрузке страницы
function checkHash() {
    let regexpToken = /(#access_token=)([a-z0-9]+)\&/g;

    if (window.location.hash.match(regexpToken)) {
        getToken();
        sendRequest(`https://api.vk.com/method/users.get?fields=photo_200&user_id=${userID}&access_token=${token}&v=5.103`, function(data) {
            let container = document.querySelector('.profile__name');
            let userPhoto = document.querySelector('.profile__image');
            buttonAuthorisation.classList.add('button_inactive');
            container.textContent = `${data.response[0].first_name} ${data.response[0].last_name}`;
            userPhoto.style.backgroundImage = `url('${data.response[0].photo_200}')`;
        });
    }

    if (!(window.location.hash.match(regexpToken))) {
        buttonExit.classList.add('button_inactive');
        buttonFriands.classList.add('button_inactive');
        formSearch.classList.add('search_hidden');
    }
}

checkHash();

// получение токена и id пользователя при авторизации
function getToken() {
    let regexpToken = /(#access_token=)([a-z0-9]+)\&/g;
    let regexpUserID = /(user_id=)([0-9]+)\&/g;
    let hashToken = window.location.hash.match(regexpToken);
    let hashUserID = window.location.hash.match(regexpUserID);
    token = hashToken.join('').slice(14, -1);
    userID = hashUserID.join('').slice(8, -1);

    return token, userID;
}

// запрос данных с сервера
function sendRequest(url, foo) {
    return $.ajax({
        url: url,
        method: 'GET',
        dataType: 'JSONP',
        success: foo
    })
}

// склонение "друг" в зависимости от количества друзей
function declination(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2:cases[(number%10<5)?number%10:5] ];
}

// показать список друзей
function showFriends(token) {
    sendRequest(`https://api.vk.com/method/friends.search?count=100&fields=photo_100&access_token=${token}&v=5.103`, function(data) {
        friendsCounter.textContent = `${data.response.count} ${declination(data.response.count, [' друг', ' друга', ' друзей'] )}`;
        friendList.render(data.response.items);
    });
}

// слушатель на кнопку авторизации
buttonAuthorisation.addEventListener('click', (event) => {
    event.preventDefault();
    window.location = vkRequest;
});

// слушатель на кнопку Показать друзей
buttonFriands.addEventListener('click', () => {
    showFriends(token);
});

// слушатель на форму поиска друзей
formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    if (searchInput.validity.valid) {
        sendRequest(`https://api.vk.com/method/friends.search?count=1000&fields=photo_100&access_token=${token}&v=5.103`, function(data) {
            let name = searchInput.value;
            let friends = data.response.items;
            let friendsList = friends.filter(el => {
                return el.first_name.toLowerCase().includes(name.toLowerCase());
            });
            searchList.render(friendsList);

            formSearch.reset();
        });
    }
});

// слушатель на кнопку выхода
buttonExit.addEventListener('click', () => {
    VK.Auth.getLoginStatus((res) => {
        if (res.status === 'connected') {
            VK.Auth.logout(function() {
                window.location.replace('https://ponikarovav.github.io/vk-authorisation/');
            });
        }
    });
});

// вызов метода класса валидации
searchValidity.setEventListeners();