console.log('lesson 2.7 started');

// Напишите функцию, которая принимает ключ и его значение и записывает эту пару в кукис (время жизни - любоые на ваш выбор)
function setCookie(key, value) {
    // 1. Какие типы данных может хранить в себе document.cookie ? - только строки
    // 2. Как записать объект в виде строки? JSON.stringify(obj);
    // 3. Избавиться от пробелов в key и value - encodeURIComponent()

    const valueStr = JSON.stringify(value);
    const encodedValue = encodeURIComponent(valueStr);

    const encodedKey = encodeURIComponent(key);

    document.cookie = encodedKey + '=' + encodedValue;

}

//  Напишите функцию, которая принимает ключ (имя кукис) и ВОЗВРАЩАЕТ значение данной кукис
function getCookie(findedKey) {
    // Как разделить кукис?
    // Как декодировать строку?
    // Как из строки сделать объект?
    // Как прочесть ключи кукис?

    const splittedCookies = document.cookie.split('; ');
    const findedCookie = splittedCookies.find(function (cookiePair) {
        const splittedCookiePair = cookiePair.split('=');
        const key = splittedCookiePair[0];
        const decodedKey = decodeURIComponent(key);
        if (findedKey == decodedKey) {
            return true;
        }
    })
    if (!findedCookie) {
        return undefined;
    }
    const splittedCookie = findedCookie.split('=')
    const value = splittedCookie[1];
    const decodedValue = decodeURIComponent(value);
    const parsedValue = JSON.parse(decodedValue);
    return parsedValue;
}

class ToDo {
    // TODO: сделать рефакторинг (подумать над именами функций и переменных, возможно вынести часть кода в отдельые более мелкие функции). Цель рефакторинга - сделать код более читаемым чтобы обсулживание и расширение кода было более простым.

    constructor(config) {
        // console.log(config);
        this.root = document.querySelector(config.rootSelector);
        this.input = this.root.querySelector('.toDoInput');
        this.appendingBtn = this.root.querySelector('.toDoBtn');
        this.toDoListHtml = this.root.querySelector('.toDo');
        this.name = config.name;
        if (getCookie(this.name)) {
            this.toDoList = getCookie(this.name);
        } else {
            this.toDoList = [];
            setCookie(this.name, this.toDoList);
        }
        this.setEventListeners();
    }

    setEventListeners() {
        this.appendingBtn.addEventListener('click', this.createWork.bind(this));
    }

    // Создать дело
    createWork() {
        const count =  this.toDoList.reduce(function (acc, current) {
            if (current == this.input.value){
                return acc + 1;
            } else{
                return acc;
            }
            
        }.bind(this), 0)
        if (count > 0){
            console.log(this.input.value);
            return;
        } // Если есть уже такое дело, то не зачем добавлять такое же
        this.toDoList.push(this.input.value);
        this.addOneWork(this.input.value)
        this.refreshCookies();
    }

    // Обновить куки
    refreshCookies() {
        setCookie(this.name, this.toDoList);
    }

    fillToDoList() {
        console.log('Fill TODO list');
        this.toDoListHtml.innerHTML = "";
        const toDoList = this.toDoList;

        toDoList.forEach(function (item) {
            this.addOneWork(item)
        }.bind(this))
    }

    addOneWork(workText) {
        const element = this.createNewElement(workText);
        this.deleteWorkBtn(element);
        this.appendWorkItem(element);
    }

    createNewElement(text) {
        console.log(text);

        const listItem = document.createElement('li');

        const content = document.createElement('span')
        content.innerHTML = text;
        listItem.append(content)

        const delBtn = document.createElement('button');
        delBtn.innerHTML = 'Удалить';
        delBtn.classList.add('delBtn')
        listItem.append(delBtn);

        console.log(listItem);
        return listItem;
    }

    deleteWorkBtn(listItem){
        const delBtn = listItem.querySelector('.delBtn')

        delBtn.addEventListener('click', function deleteItem() {
            listItem.remove();
            const content = listItem.querySelector('span').textContent;
            const listItemId = this.toDoList.indexOf(content);
            this.toDoList.splice(listItemId, 1);
            this.refreshCookies();
            delBtn.removeEventListener('click', deleteItem);
        }.bind(this));
        
        
    }

    appendWorkItem(listItem){
        this.toDoListHtml.append(listItem);
    }
};

const conf1 = {
    rootSelector: '.ilyaToDo',
    name: 'Ilya',
};

const todo = new ToDo(conf1);

window.addEventListener('load', function () {
    todo.fillToDoList();
});