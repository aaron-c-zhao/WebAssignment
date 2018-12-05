var model={
  numShips:3,
  shipLength:3,
  shipSunk:0,
  boardSize:10,

  ships:[
    {locations:[A1,A2,A3],hits:["","",""]},
    {locations:[B1,B2,B3],hits:["","",""]},
    {locations:[C1,C2,C3],hits:["","",""]},
  ],

  fire:function(location){
      for(var i=0;i<this.numShips;i++){
          var ship=ships[i];
           var index=locations.indexOf(location);
           if(index>=0){
              if(this.ship.hits[index]==="hit"){
              displayMessage("You already hit this location!");
                  return true;
              }
              else{
              this.ship.hits[index]="hit";
              displayMessage("You hit!");
              var count=0;
                 for(var j=0;j<2;j++){
                    if(this.ship.hits[j]==="hit"){
                         count++;
                     }
                 }
                 if(count===3){
                     displayMessage("You sank this ship!");
                 }
                 return true;
              }
              }
          else{
             displayMessage("You missed!");
             return false;
              }
      }
  },

  isSunk:function(ship){
     for(var i=0;i<this.shipLength;i++){
         if(this.ship.hits[i]==="hit"){
             displayMessage("this ship is sunk!");
             return true;
         }
     }
     return false;
  },
}

var view={
displayMessage:function(msg){
    var messagearea=document.getElementById("messageArea");
    messagearea.innerHTML=msg; 
},

}
var controller={
    processGuess:function(){
    for(var i=0;i<numShips;i++){
         if(isSunk(ships[i])){
            displayMessage("You sank all my ships!You win!")
            return true;
         }
    }
    return false;
    }
}

function parseGuess(guess){
    var alphabet=['A','B','C','D','E','F','G','H','I','J'];
    if(guess==null||guess.length>2){
        alert("Please make a valid guess!");
        return null;
    }
    else{
    var first=guess.Charat(0);
    var second=guess.Charat(1);
    if(first.indexOf(alphabet)<0||first.indexOf(alphabet)>9||second<0||second>boardSize){
        alert("Please make a valid guess!!!");
        return null;
    }
    return first+second;
    }
}