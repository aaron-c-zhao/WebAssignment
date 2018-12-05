//entry of the program
var main = function(){

//user prompt for player name with default name plarer 1

var name = function (){
    var name = prompt("Captin, what's your name?");
    name = name || "Player 1";
    return name;
    }();

//datastructures 

function Ship(length, location){
   return {
       length:length,
       location:location,
       hits:[]
   } 
}

Ship.prototype.isSunk = function(){return this.hits.length === length};

Ship.prototype.isPlaced = function(){location.length === length};



var player = {
    name:name,
    Id:1,
    ships:{
        cruiser: new Ship(3, []),
        destroyer1: new Ship(2, []),
        destroyer2: new Ship(2, []),
        battleship: new Ship(4, []),
        carrier: new Ship(5, [])
    },
    status:[false, false],
}

//place ships
//hide the buttons of particular kind of ships first
$(".shipTypes").hide();


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
                case "cruiser":placeShip(player.ships.cruiser);
                break;
                case "destroyer1":placeShip(player.ships.destroyer1);
                break;
                case "destroyer2":placeShip(player.ships.destroyer2);
                break;
            }
        } 
    })
});

var usedCoordinates = [];
var validCoordinates = [];



function placeShip(ship){

    var length = ship.length;
    var grid;

    $("td").click(function(){
        grid = this.id;
        var numGrid = parseInt(grid,10);

        if(usedCoordinates.indexOf(numGrid) >= 0){
            window.alert("This grid has been seleced already!")
            placeShip(ship);
        }

        //right,down,left,up
        //whether the direction it's occupied 
        var validityOfCoordinates = [false, false, false, false];

        var operator = [
            function(){
                for(var i=1; i<length; i++){
                    if(usedCoordinates.indexOf(numGrid+i)>=0 || ((numGrid+i)%10)<((numGrid+i-1)%10))
                        validityOfCoordinates[0] = true;
                }
            },
            function(){
                for(var i=1; i<length; i++){
                    if(usedCoordinates.indexOf(numGrid+i*10)>=0 || (numGrid+i*10)>100)
                        validityOfCoordinates[1] = true;
                }
            },
            function(){
                for(var i=1; i<length; i++){
                    if(usedCoordinates.indexOf(numGrid-i)>=0 || ((numGrid-i)%10)>((numGrid-i+1)%10) || (numGrid-i)===-1)
                        validityOfCoordinates[2] = true;
                }
            },
            function(){
                for(var i=1; i<length; i++){
                    if(usedCoordinates.indexOf(numGrid-i*10)>=0 || (numGrid-i*10)<0)
                        validityOfCoordinates[3] = true;
                }
            }

        ]

        for(var i =0; i<4; i++){
            operator[i]();
        }
        
        //detetmine whether all directions are full
        if(validityOfCoordinates[0] && validityOfCoordinates[1] && validityOfCoordinates[2] && validityOfCoordinates[3]){
            window.alert("You can not put your boat here! There isn't enough space.")
            placeShip(ship);
        }
        
        // //if 
        // if(!validityOfCoordinates[0] || !validityOfCoordinates[1] || !validityOfCoordinates[2] || !validityOfCoordinates[3]){
        //     usedCoordinates.push(numGrid);
        //     ship.location.push(grid);
        // }

        //if there are avaliable direction higlight the next grid in that direction
        highlight(validityOfCoordinates, numGrid);
        //set the background of the grid that been clicked blue
        document.getElementById(grid).style.backgroundColor = "blue";

        $("td").off("click");

        changeMind(grid);

});
}

function highlight(direction, id){
    for(var i =0; i < direction.length; i++){
        if(!direction[i]){
            validCoordinates.push(id);
            var nextId;
            switch(i){
                case 0: nextId = id + 1;
                    break;
                case 1: nextId = id + 10;
                    break;
                case 2: nextId = id - 1;
                    break;
                case 3: nextId = id -10;
                    break;
            }

            document.getElementById(nextId.toString()).style.backgroundColor = "rgb(255,255,255,0.5)" ;
        }
    }
        
}

function changeMind(){
    $("td").click(function(){
        if(validCoordinates.indexOf(this.id)<0 || this.id === grid){
            for(var i =0; i < validCoordinates.length;i++)
            document.getElementById(validCoordinates[i]).setAttribute("class", "chingeMind")
        }
    })
}



}

$(document).ready(main);
