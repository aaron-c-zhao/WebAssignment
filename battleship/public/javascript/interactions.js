var GameState = function(){
    
    
    
    
    
    
    
    
    
    
    
    return{

    }
}();

var Ships = function(){
    var amount = 5;

    function Ship(id,length, color, location){
        this.id = id;
        this.length = length;
        this.location = location;
        this.color = color;
    }
    

    function placeShips(){

    }



    var ships =[
        {carrier: new Ship("carrier", 5, "#cc3300", )}
    ] 




}

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

    this.idParserInWard = function(gridId){
        var x = id.substr(0,1);
        var y = id.substr(1,1);
        return id[x,y];
    }

    this.idParserOutWard = function(id){
        var gridId = id[0].toString() + id[1].toString();
        return gridId;
    }

    //TODO:enable click on board
    this.enableBoard = function(){
        
    }

    //TODO:disable click on board
    this.disableBoard = function(){

    }

    //has this grid been occupied
    this.isValidClick = function(id){
        return this.coordinatsMatrix[id[0]][id[1]] === 0;
    }

    this.highlight = function(id, color){
        document.getElementById(idParserOutWard(id)).style.backgroundColor = color;
    }

    this.deHighLight = function(id){
        document.getElementById(idParserOutWard(id)).style.backgroundColor = "none";
    }
}