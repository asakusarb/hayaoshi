function gameLoop() {
    let gamepads = navigator.getGamepads();
    let players = [1, 2, 3, 4].map(n => document.getElementById("p" + n));

    Array.from(gamepads).forEach((gamepad, i) => {
        let player = players[i];

        if (!gamepad) {
            // Do nothing
        } else if (gamepad.buttons.map(b => b.pressed).indexOf(true) > -1) {
            player.style.cssText = "background-color: red";
        } else {
            if (player) {
                player.style.cssText = "";
            }
        }
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
