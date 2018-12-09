function GameState(sb, socket){
    this.playerType = null;
    this.statusBar = sb;
    var ship = new Ship();
    let remainShips = []; // the array contains ships

    this.setPlayerType = function(p){
        this.playerType = p;
    }


    this.placeship = function(){
        //place ship
        $("#placeShip").click(function(){
                
            document.getElementById("gameboard_1").style.backgroundColor = "rgb(255,255,255,0.8)";
             //$(".shipTypes").show();
            $(".shipTypes").click(function(){
                var thisShip = this.value;
                //TODO:use disable to disable buttons
                if(remainShips.indexOf(thisShip) < 0 ){
                    remainShips.push(thisShip);
                        ship.placeship(thisShip);
                }
            })
        });

        $("#ready").click(function(){
            if(remainShips.length < 5){
                var numNotPlaced = 5 - remainShips.length;
                alert("%d more ships need to be placed.", numNotPlaced);
            }else{
                //tell the server who is ready
                socket.send(JSON.stringify({type:"READY", data:this.playerType}));
                $("#reset").off("click");
                $("#placeShip").off("click");
                $(".shipTypes").off("click");
            }
        })        

    }

    this.fire= function(){
        var gridId;
        $("#gameboard_player2 td").click(function(){
            gridId = this.id;        
        })
        $("#gameboard_player2 td").off("click");
        return gridId;
    }

    this.hit = function(id){
        var playerBoard = this.ship.getBoard();
        var matrixId = playerBoard.idParserInWard(id);
        if(playerBoard.coordinatsMatrix[matrixId[0]][matrixId[1]] !== 0){
            playerBoard.highlight(id, "red");
            return true;
        }
        else{
            playerBoard.highlight(id, "green");
            return false;
        }
            
    }

    this.getRemainShips = function(){
        return remainShips;
    }

    
}


function StatusBar(){
    this.setStatus = function(status){
        document.getElementById("statusbar").innerHTML = status;
    }
}


function setUp(){

    var socket =new WebSocket("ws://localhost:3000");
    var sb = new StatusBar();
    var gs = new GameState(sb, socket);

    socket.onmessage = function(event){
        let inComMes = JSON.parse(event.data);
        console.log(inComMes);
        if(inComMes.type == "2 JOINT") {
            console.log("game state 2 joint");
            sb.setStatus(Status["prompt"]);
            gs.placeship();
        }

        else if(inComMes.type == "1 JOINT"){
            console.log("game state 1 joint");
            sb.setStatus(Status["player1Intro"]);
        }

        else if(inComMes.type == "READY CONFIRM"){
            $("#ready").off("click");
            sb.setStatus(Status["readyConfirm"]);
        }
        //start the game
        else if(inComMes.type == "2 READY"){
            sb.setStatus(Status["bothReady"])
            if(gs.playerType == "A"){
                let gridId = gs.fire();
                socket.send(JSON.stringify({type:"FIRE", data:gridId}));
            }
        }

        //need to determine whether hit or miss, and send it back to server
        else if(inComMes.type == "FIRE"){
            let ifHit = gs.hit(inComMes.data);
            if(ifHit)
                socket.send(JSON.stringify({type:"HIT", data:inComMes.data}));
            else socket.send(JSON.stringify({type:"MISS", data:inComMes.data}));
        }
        



        else if(inComMes.type == "SUNK"){
            sb.setStatus(Status["sunk"] + inComMes.data);    
        }
        
        else if(inComMes.tyep == "WON"){
            sb.setStatus(Status["gameLost"]);
        }
        
        else if(inComMes.type == "PLAYER TYPE"){
           gs.setPlayerType(inComMes.data);
        }

        
    }


    socket.onopen = function(){
        socket.send("{}");
    }




    
  

};
$(document).ready(setUp);