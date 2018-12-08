var game = function(gameID){
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT";
}

game.prototype.transitionStates = {};
game.prototype.transitionStates["0 JOINT"] = 0;
game.prototype.transitionStates["1 JOINT"] = 1;
game.prototype.transitionStates["2 JOINT"] = 2;
game.prototype.transitionStates["1 READY"] = 3;
game.prototype.transitionStates["2 READY"] = 4;
game.prototype.transitionStates["A WON"] = 5;
game.prototype.transitionStates["B WON"] = 6;
game.prototype.transitionStates["ABORTED"] = 7;

game.prototype.trasitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

game.prototype.isValidTransition = function(from, to){
    if(!(from in game.prototype.transitionStates) || !(to in game.prototype.transitionStates))
        return false;
    else{
        let i = game.prototype.transitionStates[from];
        let j = game.prototype.transitionStates[to];
        return game.prototype.trasitionMatrix[i][j] > 0;
    }
};

game.prototype.isValidState =function(s){
    return (s in game.prototype.transitionStates);
};

game.prototype.setStatus = function(w){
    if(game.prototype.isValidState(w) && game.prototype.isValidTransition(this.gameState, w)){
        this.gameState = w;
        console.log("game status %s", this.gameState);
    }
};

game.prototype.hasTwoConnectedPlayers = function(){
    return (this.gameState == "2 JOINT");
};

game.prototype.bothPlayersReady = function(){
    return (this.gameState == "2 READY");
};

game.prototype.addPlayer = function(p){
    if(this.gameState != "0 JOINT" && this.gameState != "1 JOINT")
        return new Error("Invaild call to addPlayer, current state is %s", this.gameState);
    
    if(this.playerA == null){
        this.playerA = p
        return "A"
    }
    else{
        this.playerB = p;
        return "B";
    }
};

module.exports = game;