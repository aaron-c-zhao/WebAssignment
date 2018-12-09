function Ship(){

   this.Carrier = {
        id: 1,
        length: 5,
        HP:5,
        color:"#cc3300"
    };

    this.Battleship = {
        id:2,
        length:4,
        HP:4,
        color:"#99003d"
    };

    this.Cruiser = {
        id:3,
        length:3,
        HP:3,
        color:"#000099"
    };

    this.Destroyer1 = {
        id:4,
        length:2,
        HP:2,
        color:"#6600cc"
    };

    this.Destroyer2 = {
        id:5,
        length:2,
        HP:2,
        color:"#6600cc"
    };
      
    //TODO:temp the id of player's websocket id
    var board = new Board("yourboard");

    //get shipId through clicking on the button
    this.placeship= function(shipId){
                    var length = this[shipId].length;
                    var color = this[shipId].color;
                    var shipid = this[shipId].id;
                    var isPlaced = length;
                    var firstClick = true;
                    var firstClickCoordinate;
        
                    $("#gameboard_player1 td").click(function(){
                        var gridId = this.id;
                        var matrixId = board.idParserInWard(gridId);

                       // calculate if there is enough space to put the ship
                        function validDirectionCalculator(matrixId){
                            var left = function(){
                                let x = matrixId[0];
                                let y = matrixId[1];
                                let result = true;
                                if(matrixId[1] - length <-1)
                                    result = false;
                                else{
                                    for(var i = 0; i <length; i++ ){
                                        if(board.coordinatsMatrix[x][y--] !== 0){
                                            result = false;
                                        }
                                    }
                                }
                                return result;
                            }
            
                            var right = function(){
                                let x = matrixId[0];
                                let y = matrixId[1];
                                let result = true;
                                if(matrixId[1] + length > 10)
                                    result = false;
                                else{
                                    for(var i = 0; i <length; i++ ){
                                        if(board.coordinatsMatrix[x][y++] !== 0)
                                        result = false;
                                    }
                                }
                                return result;
                            }
                        
                            var up = function(){
                                let x = matrixId[0];
                                let y = matrixId[1];
                                let result = true;
                                if(matrixId[0] - length < -1)
                                    result = false;
                                else{
                                    for(var i = 0; i < length; i++){
                                        if(board.coordinatsMatrix[x--][y] !== 0)
                                            result = false;
                                    }
                                }
                                return result;
                            }
                            
                            var down = function(){
                                let x = matrixId[0];
                                let y = matrixId[1];
                                let result = true;
                                if(matrixId[0] + length > 10)
                                    result = false;
                                else{
                                    for(var i = 0; i < length; i++){
                                        if(board.coordinatsMatrix[x++][y] !== 0)
                                            result = false;
                                    }
                                }
                                return result;
                            }
                        
                            return [left(), right(), up(), down()];
                        }
                        
                        var validDirection = validDirectionCalculator(matrixId);

                        if(!board.isValidClick(matrixId))
                            alert("This grid has been selected!")
                        
                        //if there is no room to put a ship
                        else if(firstClick && validDirection[0] === false 
                            && validDirection[1] === false 
                            && validDirection[2] === false 
                            && validDirection[3] === false){
                            alert("These isn't enough space to pace this ship!")
                        }

                        //if player change his/her mind, then rest matrix and dehiglight all grids
                        else{ 
                            if(!firstClick && board.coordinatsMatrix[matrixId[0]][matrixId[1]] !== 42){
                            isPlaced = length;
                            firstClick = true;
                            for(var i = 0; i < 10; i++){
                                for(var n = 0; n < 10; n ++){
                                    var id = [i, n];
                                    if(board.coordinatsMatrix[id[0]][id[1]] === shipid
                                         || board.coordinatsMatrix[id[0]][id[1]] === 42){
                                    board.coordinatsMatrix[id[0]][id[1]] = 0;
                                    board.deHighLight(id);
                                   }
                                }
                            }
        
                        }
                    
                            //if everything going well
                            if(firstClick){
                                var validDirectionForFirstClick = validDirectionCalculator(matrixId);
                                board.setElement(matrixId, shipid);
                                board.highlight(gridId, color);
                                isPlaced--;

                                var nextStep = [
                                    [matrixId[0],matrixId[1]-1],
                                    [matrixId[0],matrixId[1]+1],
                                    [matrixId[0]-1,matrixId[1]],
                                    [matrixId[0]+1,matrixId[1]]
                                ]

                                for(var i = 0; i < 4; i++){
                                    if(validDirectionForFirstClick[i]){
                                        board.setElement(nextStep[i], 42);
                                        board.highlight(board.idParserOutWard(nextStep[i]), "rgb(255,255,255,0.5)");
                                    }
                                }

                                firstClickCoordinate = matrixId.slice();
                                firstClick = false;
                            }
                            else if(board.coordinatsMatrix[matrixId[0]][matrixId[1]] === 42){
                                //first clear all the highlight of next step grids
                                for(var i = 0; i < 10; i++){
                                    for(var n = 0; n < 10; n ++){
                                        var id = [i, n];
                                        if(board.coordinatsMatrix[id[0]][id[1]] === 42){
                                            board.coordinatsMatrix[id[0]][id[1]] = 0;
                                            board.deHighLight(id);
                                        }
                                    }
                                }

                                //hight light the current grid been slected
                                board.setElement(matrixId, shipid);
                                board.highlight(gridId, color);
                                isPlaced--;
        
                                //if this ship is all placed, turn off the event handler
                                if(isPlaced === 0){
                                    $("#gameboard_player1 td").off("click");
                                }
        
                                //if this ship has not been all placed, highlight the next step
                                else{
                                    var nextStepCoordinate = [];
                                    if(firstClickCoordinate[0] === matrixId[0]){
                                        nextStepCoordinate[0] = matrixId[0];
                                        nextStepCoordinate[1] = (firstClickCoordinate[1] - matrixId[1] > 0)
                                            ? matrixId[1] -1: matrixId[1] +1;
                                    }
                                    else{
                                        nextStepCoordinate[1] = matrixId[1];
                                        nextStepCoordinate[0] = (firstClickCoordinate[0] - matrixId[0] > 0)
                                            ?matrixId[0] - 1: matrixId[0] + 1;
                                    }
                                    board.setElement(nextStepCoordinate, 42);
                                    board.highlight(board.idParserOutWard(nextStepCoordinate), "rgb(255,255,255,0.5)");
                                }
                            }
                        }
                        
                    })
    }
    

    this.resetAllShips= function(){
        for(var i = 0; i < 10; i++){
            for(var n = 0; n < 10; n ++){
                var id = [i, n];
                board.coordinatsMatrix[id[0], id[1]] = 0;
                board.deHighLight(id);
            }
        }
    }
        
    //random ships
    this.randomShips=function(){
        function outter(){
            return Math.floor(Math.random()*10);
        };
        function inner(){
            return Math.floor(Math.random()*10);
        };

        let dir = function(){
            return (Math.random() > 0.5);
        }

        let haveATry = function(id, length, color){
            let tryArray;
            do{
                tryArray = {};
                let origin = [outter(), inner()]
                var loopTerminator = true;
                if(dir()){
                    for(var i = 0; i<length; i++){
                        tryArray[i.toString()]= [origin[0], (origin[1]+i)];
                    }
                }
                else{
                    for(var i = 0; i<length; i++){
                        tryArray[i.toString()] = [(origin[0]+i), origin[1]];
                    }
                }
                //check if the random ship satisfy the rules
                    
                for(var i = 0; i<length; i++){
                    if(tryArray[i.toString()][0]>=10 || tryArray[i.toString()][1]>=10 
                        || board.getElement(tryArray[i.toString()]) !== 0){
                            loopTerminator = false;
                        }
                }
                
            }while(loopTerminator === false);       

            for(var i = 0; i<length; i++){
                board.setElement(tryArray[i.toString()], id);
                board.highlight(board.idParserOutWard(tryArray[i.toString()]), color);
            }
        }
        
        haveATry(1, 5, "#cc3300");
        haveATry(2, 4, "#99003d");
        haveATry(3, 3, "#000099");
        haveATry(4, 2, "#6600cc");
        haveATry(5, 2, "#6600cc");


    }
        
    this.getBoard= function(){
        return board;
    }

    this.isHit = function(shipID){
        switch(shipID){
            case 1: {
                this.Carrier.HP--;
                if(this.Carrier.HP === 0)
                    return {isSunk: true, name:"Carrier"};
                else return {isSunk:false,name:"Carrier"};
            }
            case 2:{
                this.Battleship.HP--;
                if(this.Battleship.HP === 0)
                    return {isSunk: true, name:"Battleship"};
                else return {isSunk:false,name:"Battleship"};
            }    
            case 3:{
                this.Cruiser.HP--;
                if(this.Cruiser.HP === 0)
                    return {isSunk: true, name:"Cruiser"};
                else return {isSunk:false,name:"Cruiser"};
            }
            case 4:{
                this.Destroyer1.HP--;
                if(this.Destroyer1.HP === 0)
                    return {isSunk: true, name:"Destroyer"};
                else return {isSunk:false,name:"Destroyer"};
            }
            case 5:{
                this.Destroyer2.HP--;
                if(this.Destroyer2.HP === 0)
                    return {isSunk: true, name:"Destroyer"};
                else return {isSunk:false,name:"Destroyer"};
            }
            default: return false;
        }
    }

}


