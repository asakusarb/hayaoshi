// global variables
waiting = false;
entrying = true;

class Player {
    constructor(index, dom) {
        this.index = index;
        this.dom = dom;
        this.name = `Player ${index + 1}`;

        if (!this.gamepad) {
            this.dom.style.cssText = "background-color: gray;";
        }

        let img = this.dom.getElementsByTagName("img")[0];
        img.src = "https://avatars.githubusercontent.com/admin";
    }

    get gamepad() {
        return navigator.getGamepads()[this.index];
    }

    updateName(name) {
        this.name = name;
        let img = this.dom.getElementsByTagName("img")[0];
        img.src = `https://avatars.githubusercontent.com/${name||'admin'}`;
    }

    wait() {
        let that = this;

        function waitLoop() {
            if (!that.gamepad) {
                // Do nothing
            } else if (that.gamepad.buttons.map(b => b.pressed).indexOf(true) > -1) {
                if (waiting) {
                    waiting = false;
                    that.dom.style.cssText = "background-color: red";
                    document.getElementById("msgbox").innerHTML = `はい ${that.name} さん早かった`;
                }
            } else {
                if (that.dom) {
                    that.dom.style.cssText = "";
                }
            }

            if (waiting) {
                return requestAnimationFrame(waitLoop);
            } else {
                return null;
            }
        }

        waitLoop();
    }

    entry() {
        let that = this;

        function entryLoop() {
            if (!that.gamepad) {
                // Do nothing
            } else if (that.gamepad.buttons.map(b => b.pressed).indexOf(true) > -1) {
                that.dom.style.cssText = "background-color: yellow";
            } else {
                if (that.dom) {
                    that.dom.style.cssText = "";
                }
            }

            if (entrying) {
                return requestAnimationFrame(entryLoop);
            } else {
                return null;
            }
        }

        entryLoop();
     }
}

let players = ["p1", "p2", "p3", "p4"].map((p, index) => {
    return new Player(index, document.getElementById(p));
});

function entry() {
    entrying = true;
    waiting = false;
    document.getElementById("msgbox").innerHTML = "エントリー中";
    players.forEach(p => p.entry());
}

function wait() {
    entrying = false;
    waiting = true;
    document.getElementById("msgbox").innerHTML = "ボタンを押してください";
    players.forEach(p => p.wait());
}

function changeName(i, input) {
    players[i].updateName(input.value);
}

entry();
