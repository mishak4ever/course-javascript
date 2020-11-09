/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';

const homeworkContainer = document.querySelector('#app');

document.addEventListener('mousemove', (e) => {
});

export function createDiv() {
    const newDiv = document.createElement('div');
    var docHeight = window.innerHeight,
        docWidth = window.innerWidth;
    var width = Math.floor(Math.random() * docHeight),
        height = Math.floor(Math.random() * docWidth);
    newDiv.style.left = Math.floor(Math.random() * docWidth - newDiv.style.width) + 'px';
    newDiv.style.top = Math.floor(Math.random() * docHeight - newDiv.style.height) + 'px';
    newDiv.style.width = width + 'px';
    newDiv.style.height = height + 'px';
    newDiv.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    newDiv.textContent = 'Новый Div: ' + newDiv.style.width + '*' + newDiv.style.height;
    newDiv.classList.add('draggable-div');
    homeworkContainer.appendChild(newDiv);
    return newDiv;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', () => createDiv());
