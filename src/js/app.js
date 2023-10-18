import Trello from './components/trello/trello';

document.addEventListener('DOMContentLoaded', () => {
  const trello = new Trello(document.querySelector('.container'));
  trello.showTrello();
});
