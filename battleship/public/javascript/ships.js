function Ship(){

   this.Carrier = {
        id: 1,
        length: 5,
        color:"#cc3300"
    };

    this.Battleship = {
        id:2,
        length:4,
        color:"#99003d"
    };

    this.Cruiser = {
        id:3,
        length:3,
        color:"#000099"
    };

    this.Destroyer1 = {
        id:4,
        length:2,
        color:"#6600cc"
    };

    this.Destroyer2 = {
        id:5,
        length:2,
        color:"#6600cc"
    };
      
    //TODO:temp the id of player's websocket id
    var board = new Board("temp");

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

                        console.log(validDirection);
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
                                console.log(validDirectionForFirstClick);
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
        
    //TODO:random ships
    this.randomShips=function(){
                    function randomNum(){
                       return Math.floor(Math.random()*10);
                    }
                    
        
        
    }
        
    this.getBoard= function(){
        return board;
    }

    }


