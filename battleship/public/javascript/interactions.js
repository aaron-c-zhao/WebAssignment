
function Board(boardId){
    
    this.boardId = boardId;
    
    this.coordinatsMatrix = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];
    
    //used to find an element in a multi dimansional array
    // var id = function(){

    // }

    this.idParserInWard = function(id){
        var x = id.substr(0,1);
        var y = id.substr(1,1);
        return [x,y];
    }

    this.idParserOutWard = function(id){
        var gridId = id[0].toString() + id[1].toString();
        return gridId;
    }

    //board = "gamebpard_player1 td"or player2
    this.enableBoard = function(boardId){
       var id;
       $(boardId).click(function(){
           id = this.id;
       });
       return idParserInWard(id);
    }

    //TODO:disable click on board
    this.disableBoard = function(){

    }

    this.setElement = function(matrixId, value){
        this.coordinatsMatrix[matrix[0]][matrixId[1]] = value;
    }

    //has this grid been occupied
    this.isValidClick = function(id){
        return this.coordinatsMatrix[id[0]][id[1]] === 0 || this.coordinatsMatrix[id[0]][id[1]] === 42;
    }

    this.highlight = function(gridId, color){
        document.getElementById(gridId).style.backgroundColor = color;
    }

    this.deHighLight = function(matrixId){
        document.getElementById(this.idParserOutWard(matrixId)).style.backgroundColor = "none";
    }
}


var GameState = function(){
    
    
    
    
    
    
    
    
    
    
    
    return{

    }
}();