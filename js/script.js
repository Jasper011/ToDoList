console.log('lesson 2.7 started');

// Напишите функцию, которая принимает ключ и его значение и записывает эту пару в кукис (время жизни - любоые на ваш выбор)
function setCookie(key, value) {
    // 1. Какие типы данных может хранить в себе document.cookie ? - только строки
    // 2. Как записать объект в виде строки? JSON.stringify(obj);
    // 3. Избавиться от пробелов в key и value - encodeURIComponent()

    const valueStr = JSON.stringify(value);
    const encodedValue = encodeURIComponent(valueStr);

    // const valueKey = JSON.stringify(key);
    const encodedKey = encodeURIComponent(key);

    document.cookie = encodedKey + '=' + encodedValue;

}
// setCookie('about Iliya', human);

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
    // console.log(findedCookie);
    if (!findedCookie) {
        return undefined;
    }
    const splittedCookie = findedCookie.split('=')
    const value = splittedCookie[1];
    const decodedValue = decodeURIComponent(value);
    // console.log(decodedValue);
    const parsedValue = JSON.parse(decodedValue);
    // console.log(typeof parsedValue);
    return parsedValue;
}



// По нажатию на кнопку "добавить" создаём ЛИ с текстом из инпута и добавляет в UL

// 1. Найти нужные элементы (инпут, кнопка и ul)

// const input = document.querySelector('.toDoInput');
// const btn = document.querySelector('.toDoBtn');
// const list = document.querySelector('.toDo');

// let state;

// 2. Добавить слушатель события КЛИК на кнопку

// function createListItem(toDoText) {
//     const listItem = document.createElement('li');
//     listItem.innerHTML = toDoText;

//     const delBtn = document.createElement('button');
//     delBtn.innerHTML = 'Удалить';
//     delBtn.classList.add('delBtn')
//     delBtn.addEventListener('click', function () {
//         listItem.remove();
//     });

//     listItem.append(delBtn);
//     list.append(listItem);
// }

// function refreshCookies(toDoText) {
//     // state.toDoList = getCookie('toDo');
//     console.log(state);
//     state.toDoList.push(toDoText)
//     setCookie('stateToDo', state);
//     console.log(state);
// }

// btn.addEventListener('click', function (event) {
//     const toDoText = input.value;
//     createListItem(toDoText);
//     refreshCookies(toDoText);
// });



// 0. Перенести в отдельную функцию или класс
// 1. Сохранять и удалять дела из кукис:
// Создать кукис и занести туда пустой массив
// При нажатии на кнопку создания дела считывать текст из поля и добавлять в массив 
//  При нажатии текст из поля и добавлять в массив 


// - 
// - 
// - 

// Как хранить массив в кукис?
// Как удалять объекты в строке которая кака массив?
// В какой момент создавтаь стейт? В какой момент отрисовывать список? В какой момнент обновляь стейт?

// 5-8
// 6-7
// 2-4
// 1-2


// window.addEventListener('load', function () {
//     console.log(getCookie('toDo'));
//     state = getCookie('stateToDo');
//     if (state && state.toDoList) {
//         state.toDoList.forEach(function (item) {
//             console.log(item);
//             createListItem(item);
//         })
//     } else {
//         state = {
//             toDoList: [],
//             name: "Дела Ильи",
//             lastSaved: new Date()
//         };
//     }

// })

// ДЗ - реализовать удаление дел (из ДОМ и из Кукис)

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
        this.editDate = new Date();
        this.parsedDate = String(this.editDate.getMonth() + 1).padStart(2, '0') + '/' + String(this.editDate.getDate()).padStart(2, '0') + '/' + this.editDate.getFullYear();

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

    // Заполнить список дел (O(n))
    fillToDoList() {
        console.log('Fill TODO list');
        this.toDoListHtml.innerHTML = "";
        const toDoList = this.toDoList;

        toDoList.forEach(function (item) {
            this.createNewElement(item)
        }.bind(this))
    }

    // Добавить одно дело (O(1))
    addOneWork(workText) {
        this.createNewElement(workText);
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
        // TODO: Доделать удаление событий для тех дел, которые мы удаляем из списка (чтобы слушатели не висели просто так)

        delBtn.addEventListener('click', function () {
            listItem.remove();
            const listItemId = this.toDoList.indexOf(listItem.textContent);
            this.toDoList.splice(listItemId, 1);
            this.refreshCookies();
        }.bind(this));

        listItem.append(delBtn);
        this.toDoListHtml.append(listItem);
    }
};

const conf1 = {
    rootSelector: '.ilyaToDo',
    name: 'Ilya',
    editDate: new Date()
};

const todo = new ToDo(conf1);

window.addEventListener('load', function () {
    todo.fillToDoList();
});