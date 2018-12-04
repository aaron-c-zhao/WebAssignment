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
        cruiser: new Ship(3, [0,0,0]),
        destroyer1: new Ship(2, [0,0]),
        destroyer2: new Ship(2, [0,0]),
        battleship: new Ship(4, [0,0,0,0]),
        carrier: new Ship(5, [0,0,0,0,0])
    },
    status:[false, false],
}

//place ships
$("#placeShip").click(function(){
    var type = [];
    $(".shipTypes").click(function(){
        var thisShip = this.value;
        if(type.indexOf(thisShip) < 0){
            type.push(thisShip);
            var button = document.getElementById(this.Id);
            button.disabled = true;
            switch(this.value){
                case "Carrier":placeShip(player.carrier);
                break;
                case "Battleship":placeShip(player.battleship);
                break;
                case "cruiser":placeShip(player.cruiser);
                break;
                case "destroyer1":placeShip(player.destroyer1);
                break;
                case "destroyer2":placeShip(player.destroyer2);
                break;
            }
        }
        
        console.log(type);
        
    })




});


function placeShip(Ship){

}



$("td").click(function(){
    var grids = this;
    console.log(grids.id);
});









}
$(document).ready(main);
