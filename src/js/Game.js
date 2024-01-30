import goblinImage from "../img/goblin.png";

export default class Game {
  constructor() {
    this.gameElement = document.querySelector(".game");
    this.boardWidth = 4;
    this.boardHeight = 4;
    this.holesCount = this.boardWidth * this.boardHeight;
    this.goblinPositionId = 0;
    this.intervalId = null;
    this.timeOut = 1000;
    this.whackedGoblins = 0;
    this.missedGoblins = 0;
  }

  run() {
    this.renderStatusPanel();
    this.renderBoard();
    this.addHandlers();
    this.missedGoblins--;

    this.intervalId = setInterval(() => {
      this.missedGoblins++;
      this.renderStatusPanel();
      this.showGoblin();

      if (this.missedGoblins === 5) {
        setTimeout(() => {
          const answer = confirm("Вы проиграли! Начать игру заново?");
          answer ? this.restart() : this.stop();
        }, 100);
      }
    }, this.timeOut);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.goblin.remove();
  }

  restart() {
    this.stop();
    this.whackedGoblins = 0;
    this.missedGoblins = 0;
    this.run();
  }

  renderStatusPanel() {
    this.statusPanel = this.gameElement.querySelector(".status-panel");

    if (this.statusPanel) {
      this.statusPanel.remove();
    }

    this.statusPanel = document.createElement("div");
    this.statusPanel.classList.add("status-panel");
    this.statusPanel.textContent = `Побито гоблинов: ${this.whackedGoblins}\nПромахов: ${this.missedGoblins}`;
    this.gameElement.insertAdjacentElement("afterbegin", this.statusPanel);
  }

  renderBoard() {
    this.board = this.gameElement.querySelector(".game-board");

    if (this.board) {
      this.board.remove();
    }

    this.board = document.createElement("div");
    this.board.className = "game-board";
    this.board.style.width = `${this.boardWidth * 180}px`;

    for (let i = 0; i < this.holesCount; i++) {
      const hole = document.createElement("div");
      hole.className = "hole";
      this.board.appendChild(hole);
    }

    this.gameElement.insertAdjacentElement("beforeend", this.board);
  }

  addHandlers() {
    this.board.addEventListener("click", (event) => {
      const target = event.target;

      if (target.closest(".hole")) {
        if (
          target.classList.contains("goblin") ||
          target.children.length !== 0
        ) {
          this.goblin.remove();
          this.whackedGoblins++;
          this.renderStatusPanel();
          this.missedGoblins--;
        }
      }
    });
  }

  showGoblin() {
    this.goblin = this.gameElement.querySelector(".goblin");

    if (!this.goblin) {
      this.goblin = document.createElement("img");
      this.goblin.src = goblinImage;
      this.goblin.classList.add("goblin");
    }

    const oldGoblinPositionId = this.goblinPositionId;

    do {
      this.goblinPositionId = Math.floor(Math.random() * this.holesCount);
    } while (this.goblinPositionId === oldGoblinPositionId);

    const holes = this.gameElement.querySelectorAll(".hole");
    holes[this.goblinPositionId].appendChild(this.goblin);
  }
}
