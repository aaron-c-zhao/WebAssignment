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
        console.log(type);
    })
});

var usedCoordinates = [];



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

        var x_occupied = false;
        var y_occupied = false;
        var z_occupied = false;
        var w_occupied = false;

        var operator = [
            function(){
                for(var i=1; i<length; i++){
                    if(usedCoordinates.indexOf(numGrid+i)>=0 || ((numGrid+i)%10)<((numGrid+i-1)%10))
                        x_occupied = true;
                }
            },
            function(){
                for(var i=1; i<length; i++){
                    if(usedCoordinates.indexOf(numGrid+i*10)>=0 || (numGrid+i*10)>100)
                        y_occupied = true;
                }
            },
            function(){
                for(var i=1; i<length; i++){
                    if(usedCoordinates.indexOf(numGrid-i)>=0 || ((numGrid-i)%10)>((numGrid-i+1)%10) || (numGrid-i)===-1)
                        z_occupied = true;
                }
            },
            function(){
                for(var i=1; i<length; i++){
                    if(usedCoordinates.indexOf(numGrid-i*10)>=0 || (numGrid-i*10)<0)
                        w_occupied = true;
                }
            }

        ]

        for(var i =0; i<4; i++){
            operator[i]();
        }

        if(!x_occupied || !y_occupied || !z_occupied || !w_occupied){
            usedCoordinates.push(numGrid);
            ship.location.push(grid);
        }
        highlight(x_occupied, numGrid+1);
        highlight(y_occupied, numGrid+10);
        highlight(z_occupied, numGrid-1);
        highlight(w_occupied, numGrid-10);
        
        document.getElementById(grid).style.backgroundColor = "blue";
        //while(!ship.isPlaced){}

});
}

function highlight(bool, id){
    console.log(id);
    if(!bool)
       document.getElementById(id.toString()).style.backgroundColor = "rgb(255,255,255,0.5)" ;
}












}
$(document).ready(main);
