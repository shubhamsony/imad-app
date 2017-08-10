var button= document.getElementById('mybtn');
var countt = document.getElementById('count');
button.onclick = function(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if(request.readyastate=== XMLHttpRequest.DONE){
          if(request.status===200){
              var counter= request.responseText;
              countt.innerHTML="counter";
          }
      }
    };
    
    request.open('GET', 'http://shubhamsoni136.imad.hasura-app.io/counter',true);
    request.send('null');
};
