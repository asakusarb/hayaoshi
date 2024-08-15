class Player {
    constructor(index, game) {
        const no = index + 1;

        this.index = index;
        this.game = game;
        this.dom = document.getElementById('p' + no);
        this.name = `Player ${no}`;

        if (!this.gamepad) {
            this.updateThumbnailColor("gray");
        }

        this.icon.onerror = function(e) {
            const name = e.target.currentSrc.split("/").pop();
            e.srcElement.src = `https://avatars.githubusercontent.com/${name}`;
        };

        this.icon.src="img/admin";
    }

    get gamepad() {
        return navigator.getGamepads()[this.index];
    }

    get icon() {
        return this.dom.getElementsByClassName("icon")[0];
    }

    get jail() {
        return this.dom.getElementsByClassName("jail")[0];
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

    updateThumbnailColor(color) {
        if (color) {
            this.thumbnail.style.cssText = `background-color: ${color}`;
        } else {
            this.thumbnail.style.cssText = "";
        }
    }

    updateName(name) {
        this.name = name;
        this.icon.src = `img/${name||'admin'}`;
    }

    takeAnswerable() {
        this.game.enableScoring(this);
        this.updateThumbnailColor("GreenYellow");
    }

    succScore() {
        const score = this.score;
        const currentScore = parseInt(score.innerHTML.split(" ").pop());
        score.innerHTML = `score: ${currentScore + 1}`;
    }

    rest() {
        this.penalty = true;
        this.jail.style="";
    }

    fulfillRest() {
        this.penalty = false;
        this.jail.style="display: none;";
    }

    wait() {
        const player = this;

        (function waitLoop() {
            if (!player.gamepad || !player.dom) {
                // Do nothing
            } else if (player.buttonPressed && player.game.waiting && !player.penalty) {
                player.takeAnswerable();
            } else {
                player.updateThumbnailColor(null);
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
                player.updateThumbnailColor("Cyan");
            } else {
                player.updateThumbnailColor(null);
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
        this.setMessage("<marquee scrollamount='20' scrolldelay='60'>エントリー受付中......</marquee>");
        this.players.forEach(p => p.enter());
    }

    wait() {
        this.waiting = true;
        this.entering = false;
        this.setMessage("<marquee scrollamount='20' scrolldelay='60'>考え中......</marquee>");
        this.players.forEach(p => p.wait());
    }

    setMessage(msg) {
        document.getElementById("msgbox").innerHTML = msg;
    }

    enableScoring(player) {
        this.waiting = false;
        this.answering = player;
        document.getElementById("hai").play();
        this.setMessage(`<span>はい ${this.answering.name} さん早かった</span>`);
        document.getElementById("correct-button").disabled = false;
        document.getElementById("incorrect-button").disabled = false;
        document.getElementById("start-button").disabled = true;
    }

    disableScoring() {
        this.answering = null;
        document.getElementById("correct-button").disabled = true;
        document.getElementById("incorrect-button").disabled = true;
        document.getElementById("start-button").disabled = false;
    }

    correct() {
        this.answering.succScore();
        this.setMessage("<span>正解！！</span>");
        this.disableScoring();
        document.getElementById("pingpong2").play();
    }

    incorrect() {
        this.answering.rest();
        this.setMessage("<span>残念！！</span>");
        this.disableScoring();
        document.getElementById("buzzer").play();
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 's' && event.ctrlKey) {
        game.wait();
    } else if (event.key === 'o' && event.ctrlKey) {
        game.answering && game.correct();
    } else if (event.key === 'x' && event.ctrlKey) {
        game.answering && game.incorrect();
    }
});

game = new Game();
