import './styles/style.css';

import {
    FriendList
} from './scripts/Friend.js';

const buttonFriands = document.querySelector('.button_type_friends');
const buttonAuthorisation = document.querySelector('.button_type_authorisation');
const buttonExit = document.querySelector('.button_type_exit');
const searchButton = document.querySelector('.search__button');
const searchInput = document.querySelector('.search__input');
const friendContainer = document.querySelector('.friendlist');
const searchContainer = document.querySelector('.searchlist');
const friendsCounter = document.querySelector('.friends__title');
const vkRequest = 'https://oauth.vk.com/authorize?client_id=7306827&display=popup&redirect_uri=https://ponikarovav.github.io/vk-authorisation/&scope=friends,status&response_type=token&v=5.103&state=123456';

let token;
let userID;

const friendList = new FriendList({
    container: friendContainer,
    blockName: 'friendlist'
});

const searchList = new FriendList({
    container: searchContainer,
    blockName: 'searchlist'
});

function checkUrl() {
    let regexpToken = /(#access_token=)([a-z0-9]+)\&/g;

    if (window.location.hash.match(regexpToken)) {
        getToken();
        sendRequest(`https://api.vk.com/method/users.get?fields=photo_200&user_id=${userID}&access_token=${token}&v=5.103`, function(data) {
            let container = document.querySelector('.profile__name');
            let userPhoto = document.querySelector('.profile__image');
            container.textContent = `${data.response[0].first_name} ${data.response[0].last_name}`;
            userPhoto.style.backgroundImage = `url('${data.response[0].photo_200}')`;
        });
    }
}

checkUrl();

function sendRequest(url, foo) {
    return $.ajax({
        url: url,
        method: 'GET',
        dataType: 'JSONP',
        success: foo
    })
}

function getToken() {
    let regexpToken = /(#access_token=)([a-z0-9]+)\&/g;
    let regexpUserID = /(user_id=)([0-9]+)\&/g;
    let hashToken = window.location.hash.match(regexpToken);
    let hashUserID = window.location.hash.match(regexpUserID);
    token = hashToken.join('').slice(14, -1);
    userID = hashUserID.join('').slice(8, -1);

    return token, userID;
}

function vkLogout() {
    VK.Auth.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            VK.Auth.logout(function() {
                window.location.replace('https://ponikarovav.github.io/vk-authorisation/');
            });
        }
    });
}


function declination(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2:cases[(number%10<5)?number%10:5] ];
};

function showFriends(token) {
    sendRequest(`https://api.vk.com/method/friends.search?count=100&fields=photo_100&access_token=${token}&v=5.103`, function(data) {
        console.log(data);
        friendsCounter.textContent = `${data.response.count} ${declination(data.response.count, [' друг', ' друга', ' друзей'] )}`;
        friendList.render(data.response.items);
    });
};

buttonFriands.addEventListener('click', () => {
    showFriends(token);
});

buttonAuthorisation.addEventListener('click', (event) => {
    event.preventDefault();
    window.location = vkRequest;
});

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    sendRequest(`https://api.vk.com/method/friends.search?count=1000&fields=photo_100&access_token=${token}&v=5.103`, function(data) {

        let name = searchInput.value;
        let friends = data.response.items;
        let friendsList = friends.filter(el => {
            return el.first_name.toLowerCase().includes(name.toLowerCase());
        });
        searchList.render(friendsList);
    });
});

buttonExit.addEventListener('click', () => {
    vkLogout();
});

