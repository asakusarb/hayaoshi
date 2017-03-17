class Player {
    constructor(index, game) {
        const no = index + 1;

        this.index = index;
        this.game = game;
        this.dom = document.getElementById('p' + no);
        this.name = `Player ${no}`;

        if (!this.gamepad) {
            this.updateThumnailColor("gray");
        }

        this.img.onerror = function(e) {
            const name = e.target.currentSrc.split("/").pop();
            e.srcElement.src = `https://avatars.githubusercontent.com/${name}`;
        };

        this.img.src="img/admin";
    }

    get gamepad() {
        return navigator.getGamepads()[this.index];
    }

    get img() {
        return this.dom.getElementsByTagName("img")[0];
    }

    get buttonPressed() {
        return this.gamepad.buttons.map(b => b.pressed).indexOf(true) > -1;
    }

    get thumbnail() {
        return this.dom.getElementsByTagName("div")[0];
    }

    get score() {
        return this.thumbnail.getElementsByClassName("score")[0];
    }

    get status() {
        return this.thumbnail.getElementsByClassName("status")[0];
    }

    updateThumnailColor(color) {
        if (color) {
            this.thumbnail.style.cssText = `background-color: ${color}`;
        } else {
            this.thumbnail.style.cssText = "";
        }
    }

    updateName(name) {
        this.name = name;
        this.img.src = `img/${name||'admin'}`;
    }

    takeAnswerable() {
        this.game.enableScoring(this);
        this.updateThumnailColor("GreenYellow");
    }

    succScore() {
        const score = this.score;
        const currentScore = parseInt(score.innerHTML.split(" ").pop());
        score.innerHTML = `score: ${currentScore + 1}`;
    }

    rest() {
        this.penalty = true;
        this.status.innerHTML = "<p>お手つき</p>";
    }

    fulfillRest() {
        this.penalty = false;
        this.status.innerHTML = "　";
    }

    wait() {
        const player = this;

        (function waitLoop() {
            if (!player.gamepad || !player.dom) {
                // Do nothing
            } else if (player.buttonPressed && player.game.waiting && !player.penalty) {
                player.takeAnswerable();
            } else {
                player.updateThumnailColor(null);
            }

            if (player.game.waiting) {
                requestAnimationFrame(waitLoop);
            } else {
                player.fulfillRest();
            }
        })();
    }

    enter() {
        const player = this;

        (function entryLoop() {
            if (!player.gamepad || !player.dom) {
                // Do nothing
            } else if (player.buttonPressed) {
                player.updateThumnailColor("Cyan");
            } else {
                player.updateThumnailColor(null);
            }

            if (player.game.entering) {
                requestAnimationFrame(entryLoop);
            }
        })();
     }
}

class Game {
    constructor() {
        this.players = [0, 1, 2, 3].map(i => new Player(i, this));
        this.enter();
    }

    enter() {
        this.waiting = false;
        this.entering = true;
        document.getElementById("msgbox").innerHTML =
            "<marquee scrollamount='20' scrolldelay='60'>エントリー受付中......</marquee>";
        this.players.forEach(p => p.enter());
    }

    wait() {
        this.waiting = true;
        this.entering = false;
        document.getElementById("msgbox").innerHTML =
            "<marquee scrollamount='20' scrolldelay='60'>考え中......</marquee>";
        this.players.forEach(p => p.wait());
    }

    enableScoring(player) {
        this.waiting = false;
        this.answering = player;
        document.getElementById("msgbox").innerHTML =
            `<span>はい ${this.answering.name} さん早かった</span>`;
        document.getElementById("exactry-button").disabled = false;
        document.getElementById("inexactry-button").disabled = false;
        document.getElementById("start-button").disabled = true;
    }

    disableScoring() {
        this.answering = null;
        document.getElementById("exactry-button").disabled = true;
        document.getElementById("inexactry-button").disabled = true;
        document.getElementById("start-button").disabled = false;
    }

    exactry() {
        this.answering.succScore();
        this.disableScoring();
    }

    inexactry() {
        this.answering.rest();
        this.disableScoring();
    }
}

game = new Game();
