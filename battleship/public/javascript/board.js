
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
    

    this.idParserInWard = function(id){
        var x = parseInt(id.substr(0,1));
        var y = parseInt(id.substr(1,1));
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

    this.getElement= function(array){
        return this.coordinatsMatrix[array[0]][array[1]];
    }

    this.setElement = function(matrixId, value){
        this.coordinatsMatrix[matrixId[0]][matrixId[1]] = value;
    }

    //has this grid been occupied
    this.isValidClick = function(id){
        return this.coordinatsMatrix[id[0]][id[1]] === 0 || this.coordinatsMatrix[id[0]][id[1]] === 42;
    }

    this.highlight = function(gridId, color){
        document.getElementById(gridId).style.backgroundColor = color;
    }

    this.deHighLight = function(matrixId){
        document.getElementById(this.idParserOutWard(matrixId)).style.background = "none";
    }
}