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
    request.send('null');
};
var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    var rqst = new XMLHttpRequest();
    rqst.onreadystatechange = function(){
       if(rqst.readystate===XMLHttpRequest.DONE){
            if(rqst.status===200){
                var namestring = rqst.responseText;
                var names1=JSON.parse(namestring);
                var newname ="";
                for(var i=0; i<names1.length;i++){
                    newname+='<li>'+names1[i]+'</li>';
                }
                var newlist = document.getElementById('newlist');
                newlist.innerHTML=newname;
            }        
        }
    };
    var nameinput=document.getElementById('name');
    var namelist = nameinput.value;
    rqst.open('GET','http://shubhamsoni136.imad.hasura-app.io/submit-name?name='+namelist , true );
    rqst.send('null');
};
