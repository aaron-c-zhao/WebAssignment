
function setUp(){

    var ship = new Ship();

    //place ship
    $("#placeShip").click(function(){
        
        document.getElementById("gameboard_1").style.backgroundColor = "rgb(255,255,255,0.8)";
        
        //$(".shipTypes").show();
        var type = [];
        $(".shipTypes").click(function(){
            var thisShip = this.value;
            //TODO:use disable to disable buttons
            if(type.indexOf(thisShip) < 0){
                type.push(thisShip);
                    ship.placeship(thisShip);
                }
        })
    });

    





    
  

};
$(document).ready(setUp);