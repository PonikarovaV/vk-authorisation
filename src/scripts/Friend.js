class FriendList {
    constructor(params) {
        this.blockName = params.blockName;
        this.container = params.container;
    }

    // применение метода к элементу массива
    render(friendsList) {
        friendsList.forEach( el => this.addToList(el) );
    }

    // получение карточки друга и вставка в разметку
    addToList(friend) {
        let card = this.create(friend.id, friend.photo_100, friend.first_name, friend.last_name);
    
        this.container.insertAdjacentHTML(
            'beforeend',
            card
        ); 
    }

    // карточка друга
    create(id, photo, name, lastname) {
        return `<li class="${this.blockName}__item">
                    <a class="${this.blockName}__link" href="https://vk.com/id${id}"><img class="${this.blockName}__photo" src="${photo}">${name} ${lastname}</a>
                </li>`
    }
}

export {FriendList};