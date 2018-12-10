function GameState(sb, socket){
    this.playerType = null;
    this.statusBar = sb;
    let ship = new Ship();
    let remainShips = []; // the array contains ships
    let firedAt = [];
    let sunkedShip = [];



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
            });

            $("#resetShips").click(function(){
               remainShips = [];
               ship.resetAllShips(); 
            });

            $("#random").click(function(){
                $(".shipTypes").off("click");
                remainShips=["Carrier", "Battleship", "Cruiser", "Destroyer1", "Destroyer2"]
                ship.randomShips(); 
            });

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
            if(firedAt.indexOf(gridId)<0){
                $("#gameboard_player2 td").off("click");
                firedAt.push(gridId); 
                socket.send(JSON.stringify({type:"FIRE", data:gridId}));
            }
            else{
                sb.setStatus(Status["cantFireTwice"]);
            }

        })
    }

    this.isHit = function(id){
        let playerBoard = ship.getBoard();
        let matrixId = playerBoard.idParserInWard(id);
        let shipid = playerBoard.coordinatsMatrix[matrixId[0]][matrixId[1]];
        let result = ship.isHit(shipid);

        if(result){
            playerBoard.highlight(id, "red");
                if(result.isSunk){
                    sunkedShip.push(result.name);
                    if(this.iswon()){
                        socket.send(JSON.stringify({type:"WON", data:null})); 
                    }else socket.send(JSON.stringify({type:"SUNK", data:result.name, grid:id}));     
                }
                else  socket.send(JSON.stringify({type:"HIT", grid:id}));
        }
        else{
            playerBoard.highlight(id, "green");
            socket.send(JSON.stringify({type:"MISS", data:null, grid:id}));
            sb.setStatus(Status["yourturn"]);
            this.fire();
        }
            
    }

    this.isWon = function(){
        return (sunkedShip.length === 5);
    }

    this.hightlight
    
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
            sb.setStatus(Status["bothReady"]);
            let playerType = gs.playerType;
            if(playerType == "A"){
                console.log("A run");
                sb.setStatus(Status["yourturn"]);
                gs.fire();
            }else if(playerType == "B"){
                console.log("B run");
                sb.setStatus(Status["waitting"]);
            }
        }

        //need to determine whether hit or miss, and send it back to server
        else if(inComMes.type == "FIRE"){
            gs.isHit(inComMes.data);
        }

        else if(inComMes.type == "HIT"){
            $("[id="+inComMes.grid+"]:eq(1)").css("background-color","red");
            sb.setStatus(Status["hit"]);
            setTimeout(function(){
                sb.setStatus(Status["shotagain"]);
            }, 800); 
            gs.fire();  
        }

        else if(inComMes.type == "MISS"){
            $("[id="+inComMes.grid+"]:eq(1)").css("background-color","green");
            sb.setStatus(Status["miss"]);
            setTimeout(function(){
                sb.setStatus(Status["waitting"]);
            }, 800);   
        }
        
        else if(inComMes.type == "SUNK"){
            $("[id="+inComMes.grid+"]:eq(1)").css("background-color","red");
            sb.setStatus(Status["sunk"] + inComMes.data);
            setTimeout(function(){
                sb.setStatus(Status["shotagain"]);   
            }, 800);
            gs.fire();       
        }
        
        else if(inComMes.tyep == "WON"){
            sb.setStatus(Status["gameWon"]);
        }
        else if (inComMes.type == "LOSE"){
            sb.setStatus(Status["gameLost"]);
        }
        
        else if(inComMes.type == "PLAYER TYPE"){
           gs.setPlayerType(inComMes.data);
        }

        
    }


    socket.onopen = function(){
        socket.send("{}");
    }

    //TODO: socket.onclose

};
$(document).ready(setUp);
