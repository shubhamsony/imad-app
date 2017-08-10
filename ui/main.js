var button= document.getElementById('mybtn');
button.onclick = function(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState=== XMLHttpRequest.DONE){
            if(request.status===200){
                var counter= request.responseText;
                var countt = document.getElementById('count');
                countt.innerHTML=counter.toString();
            }
         }
    };
    
    request.open('GET', 'http://shubhamsoni136.imad.hasura-app.io/counter',true);
    request.send(null);
};
var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
       if(request.readystate===XMLHttpRequest.DONE){
            if(request.status===200){
                var names1 = request.responseText;
                names1 = JSON.parse(names1);
                var list ='';
                for(var i=0; i<names1.length;i++){
                    list+='<li>'+names1[i]+'</li>';
                }
                var ul = document.getElementById('newlist');
                ul.innerHTML=list;
            }        
        }
    };
    var nameinput=document.getElementById('name');
    var name = nameinput.value;
    request.open('GET','http://shubhamsoni136.imad.hasura-app.io/submit-name?name='+name , true );
    request.send(null);
};
