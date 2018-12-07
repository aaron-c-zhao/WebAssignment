//entry of the program
var placeShip = function(){

    //datastructures 

    function Ship(length, location, color){
    return {
        length:length,
        location:location,
        hits:[],
        isPlaced: false,
        isSunk: false,
        color:color
    } 
    }


    var player = {
        name:name,
        Id:1,
        ships:{
            cruiser: new Ship(3, [], "#000099"),
            destroyer1: new Ship(2, [], "#6600cc"),
            destroyer2: new Ship(2, [], "#6600cc"),
            battleship: new Ship(4, [], "#99003d"),
            carrier: new Ship(5, [], "#cc3300")
        },
        status:[false, false],
    }

    //hide the buttons of particular kind of ships first
    $(".shipTypes").hide();

    //jquery event
    $("#placeShip").click(function(){
        
        document.getElementById("gameboard_1").style.backgroundColor = "rgb(255,255,255,0.8)";
        
    
        $(".shipTypes").show();
        var type = [];
        $(".shipTypes").click(function(){
            var thisShip = this.value;
            if(type.indexOf(thisShip) < 0){
                type.push(thisShip);
                switch(this.value){
                    case "Carrier":placeShip(player.ships.carrier);
                    break;
                    case "Battleship":placeShip(player.ships.battleship);
                    break;
                    case "Cruiser":placeShip(player.ships.cruiser);
                    break;
                    case "Destroyer1":placeShip(player.ships.destroyer1);
                    break;
                    case "Destroyer2":placeShip(player.ships.destroyer2);
                    break;
                }
            } 
        })
    });

    //tracking all the grids used
    var allUsedCoordinates = [];

    //tracking all the grids used for a particular ship
    var usedCoordinates = [];

    //tracking the next vaild step 
    var validCoordinates = [];

    //tracking the id of the element who had been clicked
    var grid;



    function placeShip(ship){

        var firstClick = true;
        var length = ship.length;

        $("td").click(function(){
            grid = this.id;
            var numGrid = parseInt(grid,10);

            //sequence:right,down,left,up
            //tracking whether the direction it's occupied 
            //known bug:if user change mind and place the new ship beside the old place, it won't be hightlighted
            var validityOfCoordinates = [false, false, false, false];
            var operator = [
                function(){
                    for(var i=1; i<length; i++){
                        if(allUsedCoordinates.indexOf(numGrid+i)>=0 || ((numGrid+i)%10)<((numGrid+i-1)%10))
                            validityOfCoordinates[0] = true;
                    }
                },
                function(){
                    for(var i=1; i<length; i++){
                        if(allUsedCoordinates.indexOf(numGrid+i*10)>=0 || (numGrid+i*10)>100)
                            validityOfCoordinates[1] = true;
                    }
                },
                function(){
                    for(var i=1; i<length; i++){
                        if(allUsedCoordinates.indexOf(numGrid-i)>=0 || ((numGrid-i)%10)>((numGrid-i+1)%10) || (numGrid-i)===-1)
                            validityOfCoordinates[2] = true;
                    }
                },
                function(){
                    for(var i=1; i<length; i++){
                        if(allUsedCoordinates.indexOf(numGrid-i*10)>=0 || (numGrid-i*10)<0)
                            validityOfCoordinates[3] = true;
                    }
                }

            ]
            for(var i =0; i<4; i++){
                operator[i]();
            }
            
            //detetmine whether all directions are full, if so alert pump out 
            if(validityOfCoordinates[0] && validityOfCoordinates[1] && validityOfCoordinates[2] && validityOfCoordinates[3]){
                window.alert("You can not put your boat here! There isn't enough space.")
                placeShip(ship);
            }

            //check if user changed his mind, and click outside the valid zone
            if(!firstClick && validCoordinates.indexOf(numGrid)<0){
                var usedNumber = usedCoordinates.length;
                for(var i = 0; i<usedNumber; i++){
                    var n = usedCoordinates.pop();
                    if(n<10)
                        n = "0" + n;
                    document.getElementById(n).style.background="none";
                    allUsedCoordinates.pop();
                }
                deHightLight();
                firstClick = true;
                allUsedCoordinates.pop();
            }
            
            //situations after user clicked in the valid zone
            if(!firstClick){
                //click on an grid that has already been selected
                if(usedCoordinates.indexOf(numGrid)>=0)
                    window.alert("This grid has already been seleceted!");
                //good choice
                else if(usedCoordinates.indexOf(numGrid)<0 && validCoordinates.indexOf(numGrid)>=0){
                    var direction = function(){
                        switch(numGrid-usedCoordinates[usedCoordinates.length-1]){
                            case 1: return 0;
                            case 10 : return 1;
                            case -1 : return 2;
                            case -10: return 3;
                        }
                    }();
                    deHightLight();
                    document.getElementById(numGrid).style.backgroundColor = ship.color;

                    //check whether the ship has been completely placed
                    if(usedCoordinates.length < length-1){
                        var nextId = directionCalculate(direction, numGrid);
                        document.getElementById(nextId.toString()).style.backgroundColor = "rgb(255,255,255,0.5)" ;
                        validCoordinates.push(nextId);
                    
                    //if a ship is finished placing then change the status of it and turn off the listener
                    }else if(usedCoordinates.length = length-1){
                        ship.isPlaced = true;
                        validCoordinates = [];
                        $("td").off("click");
                    }
                        
                }
            }

            //check if it's the first click of a ship
            if(firstClick)
                highlight(validityOfCoordinates, numGrid, ship);

            //update the tracking arraies
            usedCoordinates.push(numGrid);
            allUsedCoordinates.push(numGrid);

            //no more first click
            firstClick = false;

            //if a ship is placed then clear out the arry and set the location
            if(ship.isPlaced){
                var arrayLength = usedCoordinates.length;
                for(var i = 0; i < arrayLength; i++)
                    ship.location.push(usedCoordinates.pop());
            }
                
    });
    }

    //highlight the valid zone
    function highlight(direction, id, ship){
        for(var i =0; i < direction.length; i++){
            if(!direction[i]){
                var nextId = directionCalculate(i, id);
                validCoordinates.push(nextId);
                if(nextId < 10)
                    nextId = "0" + nextId;
                document.getElementById(nextId).style.backgroundColor = "rgb(255,255,255,0.5)" ;
                }
            }
        if(id<10)
            id = "0" + id;
        document.getElementById(id).style.backgroundColor = ship.color;

    }

    //check which direction is valid 
    function directionCalculate(num, id){
        var nextId;
        switch(num){
            case 0: nextId = id + 1;
                break;
            case 1: nextId = id + 10;
                break;
            case 2: nextId = id - 1;
                break;
            case 3: nextId = id -10;
                break;
        }
        return nextId;
    }

    //cancle the highlight for valid zone
    function deHightLight(){
        var length = validCoordinates.length;
        for(var i =0; i < length;i++){
            var coordinate = validCoordinates.pop();
            if(coordinate<10)
                coordinate = "0"+coordinate;
            document.getElementById(coordinate).style.background="none"; 
        }
    }

    
}

$(document).ready(placeShip);
