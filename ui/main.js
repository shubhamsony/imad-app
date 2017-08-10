var button= document.getElementById('mybtn');
button.onclick = function(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if(request.readyState=== XMLHttpRequest.DONE){
          if(request.status===200){
              var counter= request.responseText;
              var countt = document.getElementById('count');
              countt.innerHTML=counter;
          }
      }
    };
    
    request.open('GET', 'http://shubhamsoni136.imad.hasura-app.io/counter',true);
    request.send('null');
};
