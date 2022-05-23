const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1)

const checkForDraw = (state) => {
    if (Object.entries(state).every(x => x[1] !== '')) {
        // emit end game, match draw
        // state.comment = `match draw`;
        // endGame()
    }
}

export const generateUUID = () => {
    let result = S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()
    return result.toLowerCase()
}

export const checkPlayerWin = (x: string, state: any) => {
    if (
        ( state.c1 == x && state.c2 == x && state.c3 == x) ||
        ( state.c4 == x && state.c5 == x && state.c6 == x) ||
        ( state.c7 == x && state.c8 == x && state.c9 == x) ||
        ( state.c1 == x && state.c4 == x && state.c7 == x) ||
        ( state.c2 == x && state.c5 == x && state.c8 == x) ||
        ( state.c3 == x && state.c6 == x && state.c9 == x) ||
        ( state.c1 == x && state.c5 == x && state.c9 == x) ||
        ( state.c3 == x && state.c5 == x && state.c7 == x)
    ) {
        // emit end game, `Player ${x} won`
        // state.comment = `Player ${x} won`;
        // endGame();
    }else{
        checkForDraw(state)
    }
}