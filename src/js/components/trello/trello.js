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

  static PanelCardDeleteEvent(e) {
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

      const PanelCardText = panelCard.querySelector('.panel-card-text');
      PanelCardText.textContent = addText;

      const PanelCardDelete = panelCard.querySelector('.panel-card-delete');
      PanelCardDelete.textContent = 'X';
      PanelCardDelete.addEventListener('click', Trello.PanelCardDeleteEvent);

      column.appendChild(panelCard);
      PanelCardText.addEventListener('mousedown', this.panelCardMouseDownEvent);
    }
  }

  panelCardMouseDownEvent(e) {
    e.preventDefault();

    this.actualElement = e.target.parentElement;

    this.actualElement.classList.add('active-drag');

    document.documentElement.addEventListener('mouseup', this.panelCardMouseUpEvent);
    document.documentElement.addEventListener('mouseover', this.panelCardMouseOverEvent);
  }

  panelCardMouseUpEvent(e) {
    e.preventDefault();

    const mouseUpItem = e.target;
    mouseUpItem.appendChild(this.actualElement);

    this.actualElement.classList.remove('active-drag');

    document.documentElement.removeEventListener('mouseup', this.panelCardMouseUpEvent);
    document.documentElement.removeEventListener('mouseover', this.panelCardMouseOverEvent);

    this.actualElement = undefined;
  }

  panelCardMouseOverEvent(e) {
    this.actualElement.style.top = `${e.clientY}px`;
    this.actualElement.style.left = `${e.clientX}px`;
  }

  addCardDoneEvent(e) {
    e.preventDefault();
    this.addCardIntoPanel(e.target.querySelector('.add-card-input').value);
    this.newCard.remove();
    this.newCard = undefined;
  }
}
