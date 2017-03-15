class Player {
    constructor(index, game) {
        const no = index + 1;

        this.index = index;
        this.game = game;
        this.dom = document.getElementById('p' + no);
        this.name = `Player ${no}`;

        if (!this.gamepad) {
            this.dom.style.cssText = "background-color: gray;";
        }
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

    updateName(name) {
        this.name = name;
        this.img.src = `https://avatars.githubusercontent.com/${name||'admin'}`;
    }

    wait() {
        const player = this;

        (function waitLoop() {
            if (!player.gamepad || !player.dom) {
                // Do nothing
            } else if (player.buttonPressed && player.game.waiting) {
                player.game.waiting = false;
                player.dom.style.cssText = "background-color: red";
                document.getElementById("msgbox").innerHTML = `はい ${player.name} さん早かった`;
            } else {
                player.dom.style.cssText = "";
            }

            if (player.game.waiting) {
                requestAnimationFrame(waitLoop);
            }
        })();
    }

    entry() {
        const player = this;

        (function entryLoop() {
            if (!player.gamepad || !player.dom) {
                // Do nothing
            } else if (player.buttonPressed) {
                player.dom.style.cssText = "background-color: yellow";
            } else {
                player.dom.style.cssText = "";
            }

            if (player.game.entrying) {
                requestAnimationFrame(entryLoop);
            }
        })();
     }
}

class Game {
    constructor() {
        this.players = [0, 1, 2, 3].map(i => new Player(i, this));
        this.entry();
    }

    entry() {
        this.waiting = false;
        this.entrying = true;
        document.getElementById("msgbox").innerHTML =
            "<marquee scrollamount='20' scrolldeley='60'>エントリー中</marquee>";
        this.players.forEach(p => p.entry());
    }

    wait() {
        this.waiting = true;
        this.entrying = false;
        document.getElementById("msgbox").innerHTML =
            "<marquee scrollamount='20' scrolldeley='60'>考え中</marquee>";
        this.players.forEach(p => p.wait());
    }

    changeName(i, input) {
        this.players[i].updateName(input.value);
    }
}

game = new Game();
