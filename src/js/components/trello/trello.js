export default class Trello {
  constructor(element) {
    this._element = element;
    this.newCard = undefined;
    this.columnNubmer = 0;
    this.actualElement = undefined;

    this.addCardHrefClick = this.addCardHrefClick.bind(this);
    this.addCard = this.addCard.bind(this);
    this.addCardDoneEvent = this.addCardDoneEvent.bind(this);
    this.panelCardMouseDownEvent = this.panelCardMouseDownEvent.bind(this);
    this.panelCardMouseUpEvent = this.panelCardMouseUpEvent.bind(this);
    this.panelCardMouseOverEvent = this.panelCardMouseOverEvent.bind(this);
    this.panelCardMouseMoveEvent = this.panelCardMouseMoveEvent.bind(this);
    // this.panelCardMouseOutEvent = this.panelCardMouseOutEvent.bind(this);
  }

  static get getHTML() {
    return `<div class='column' data-number='1'>
              <div class='add-card'>
                <a class='add-card-href' data-number='1' href=#>+ добавить карту</a>
              </div>
            </div>
            <div class='column' data-number='2'>
              <div class='add-card'>
                <a class='add-card-href' data-number='2' href=#>+ добавить карту</a>
              </div>
            </div>
            <div class='column' data-number='3'>
              <div class='add-card'>
                <a class='add-card-href' data-number='3' href=#>+ добавить карту</a>
              </div>
            </div>`;
  }

  showTrello() {
    this._element.innerHTML = Trello.getHTML;
    const addCardHrefs = this._element.querySelectorAll('.add-card-href');
    for (const addCardHref of addCardHrefs) {
      addCardHref.addEventListener('click', this.addCardHrefClick);
    }
  }

  addCardHrefClick(e) {
    this.columnNubmer = e.target.dataset.number;
    this.addCard(e.target.offsetLeft, e.target.offsetTop);
  }

  static get getHTMLAddCard() {
    return `<h3>Добавить карту</h3>
            <input class='add-card-input' type='text'></inbut>
            <button>Добавить</button>`;
  }

  addCard(xPosition, yPosition) {
    if (this.newCard === undefined) {
      this.newCard = document.createElement('form');
      this.newCard.classList.add('card-add');
      this.newCard.innerHTML = Trello.getHTMLAddCard;
      this.newCard.style.left = `${xPosition}px`;
      this.newCard.style.top = `${yPosition + 30}px`;
      document.body.appendChild(this.newCard);
      this.newCard.addEventListener('submit', this.addCardDoneEvent);
    }
  }

  static panelCardDeleteEvent(e) {
    e.target.parentElement.remove();
  }

  addCardIntoPanel(addText) {
    if (addText.length > 0) {
      const column = this._element.querySelector(`.column[data-number='${this.columnNubmer}']`);
      const panelCard = document.createElement('div');
      panelCard.classList.add('panel-card');
      panelCard.innerHTML = `<div class='panel-card-text'>
                             </div>
                             <div class='panel-card-delete'>
                             </div>`;

      const panelCardText = panelCard.querySelector('.panel-card-text');
      panelCardText.textContent = addText;

      const panelCardDelete = panelCard.querySelector('.panel-card-delete');
      panelCardDelete.textContent = 'X';

      column.appendChild(panelCard);
      panelCard.addEventListener('mousedown', this.panelCardMouseDownEvent);
      panelCard.addEventListener('mouseover', this.panelCardMouseOverEvent);
    }
  }

  panelCardMouseDownEvent(e) {
    e.preventDefault();

    if (e.target.classList.contains('panel-card')) {
      this.actualElement = e.target;
    } else if (e.target.classList.contains('panel-card-delete')) {
      Trello.panelCardDeleteEvent(e);
      return;
    } else {
      this.actualElement = e.target.parentElement;
    }

    const currentWidth = this.actualElement.offsetWidth;

    this.actualElement.classList.add('active-drag');

    this.actualElement.style.width = `${currentWidth}px`;

    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX}px`;

    document.documentElement.addEventListener('mouseup', this.panelCardMouseUpEvent);
    document.documentElement.addEventListener('mousemove', this.panelCardMouseMoveEvent);
  }

  panelCardMouseUpEvent(e) {
    e.preventDefault();

    const mouseUpItem = e.target;

    if (mouseUpItem.classList.contains('column')) {
      mouseUpItem.appendChild(this.actualElement);
    } else {
      mouseUpItem.after(this.actualElement);
    }

    this.actualElement.classList.remove('active-drag');

    document.documentElement.removeEventListener('mouseup', this.panelCardMouseUpEvent);
    document.documentElement.removeEventListener('mousemove', this.panelCardMouseMoveEvent);

    this.actualElement = undefined;

    const emptyElements = document.querySelectorAll('.empty-block');
    for (const emptyElement of emptyElements) {
      emptyElement.remove();
    }
  }

  panelCardMouseMoveEvent(e) {
    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX}px`;
  }

  panelCardMouseOverEvent(e) {
    if (this.actualElement !== undefined) {
      const emptyBlock = document.createElement('div');
      emptyBlock.classList.add('empty-block');
      emptyBlock.style.height = `${this.actualElement.offsetHeight}px`;
      e.target.before(emptyBlock);
    }
  }

  addCardDoneEvent(e) {
    e.preventDefault();
    this.addCardIntoPanel(e.target.querySelector('.add-card-input').value);
    this.newCard.remove();
    this.newCard = undefined;
  }
}
