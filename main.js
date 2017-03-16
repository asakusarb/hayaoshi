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

    wait() {
        const player = this;

        (function waitLoop() {
            if (!player.gamepad || !player.dom) {
                // Do nothing
            } else if (player.buttonPressed && player.game.waiting) {
                player.game.waiting = false;
                player.updateThumnailColor("GreenYellow");
                document.getElementById("msgbox").innerHTML =
                    `<span>はい ${player.name} さん早かった</span>`;
            } else {
                player.updateThumnailColor(null);
            }

            if (player.game.waiting) {
                requestAnimationFrame(waitLoop);
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
        this.players = [];
        for (var i = 0; i < navigator.getGamepads().length; i++) {
            if (navigator.getGamepads()[i]) {
                this.addPlayer(i);
            }
        }
        this.enter();
    }

    addPlayer(index) {
        $('#players').append(`
            <div class="col-xs-3 col-sm-3 col-md-3" id="p${index + 1}">
                <div class="thumbnail">
                    <img alt="Icon of Player ${index + 1}">
                    <div class="caption">
                        <h3>Player ${index + 1}</h3>
                        <div class="input-group">
                            <span class="input-group-addon" id="basic-addon1">@</span>
                            <input type="text"
                                   class="form-control"
                                   placeholder="GitHub ID"
                                   aria-describedby="basic-addon1"
                                   onchange="game.players[${index}].updateName(this.value)">
                        </div>
                    </div>
                </div>
            </div>
        `);
        this.players.push(new Player(index, this));
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
}

game = new Game();
