
var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
       if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                alert('logged in successfully');
            } else if(request.status===403){
                alert('username/password incorrect');
            } else if(request.status===500){
                alert('something went wrong on the server');
            }
        }
    };
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    request.open('POST','http://shubhamsoni136.imad.hasura-app.io/login', true );
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({"username":username , "password":password }));
};

function LoadLoginForm(){
    var loginHtml=`
      <h3>if not registered <a href="/sign-up">Sign Up</a></h3>
      <h2>Login to continue</h2>
      <input type="text" id="username" placeholder="username"/>
      <input type="password" id="password"/>
      <input type="submit" value="Submit" id="submit_btn"/>
      `;
      document.getElementById('login_area').innerHTML=LoginHtml;
}
