
var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
       if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('logged in successfully');
            }else if(request.status===500){
                alert(responseText.toString());
            }
        }
    };
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    request.open('POST','http://shubhamsoni136.imad.hasura-app.io/create-user', true );
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({"username":username , "password":password }));
};