function loadLoginForm(){
    var loginHtml=`
      <h3>if not registered <a href="/sign-up">Sign Up</a></h3>
      <h2>Login to continue</h2>
      <input type="text" id="username" placeholder="username"/>
      <input type="password" id="password"/>
      <input type="submit" value="Login" id="submit_btn"/>
      `;
    document.getElementById('login_area').innerHTML=loginHtml;
      
    var submit = document.getElementById('submit_btn');
    submit.onclick = function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
       if(request.readyState === XMLHttpRequest.DONE){
            if(request.status===200){
                submit.value='Success!';
            } else if(request.status===403){
                alert('username/password incorrect');
                submit.value='Login';
            } else if(request.status===500){
                alert('something went wrong on the server');
                submit.value='Login';
            }else{
                submit.value='Login';
            }
            loadLogin();
        }
    };
    var username=document.getElementById('username').value;
    var password=document.getElementById('password').value;
    request.open('POST','http://shubhamsoni136.imad.hasura-app.io/login', true );
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({"username":username , "password":password }));
    submit.value='Logging In';
};

}
function loadLoggedInUser (user){
    var loginArea = document.getElementById('login_area');
    var name = user.username;
    var pic = user.profile_pic;
    loginArea.innerHTML=`
        <h3> Hi <i>${name}</i></h3>
        <img src=${pic} height="100px" width="100px">
        <a href="/logout">Logout</a>
        `;
        
}

function loadLogin(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                var response = JSON.parse(this.responseText);
                loadLoggedInUser(response);
                
            }else{
                loadLoginForm();
            }
        }
    };
    
    request.open('GET','/check-login',true);
    request.send(null);
}

function loadArticles(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState===XMLHttpRequest.DONE){
            var articles = document.getElementById('articles');
            if(request.status===200){
                var content='<ul>';
                var articleData = JSON.parse(this.responseText);
                for(var i=0 ; i < articleData.length ; i++){
                    content+= `<li> <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a></li>`;
                }
                content+='</ul>';
                articles.innerHTML=content;
            }else{
                articles.innerHTML('Oops! could not load all articles');
            }
        }
    };
    request.open('GET','/get-articles',true);
    request.send(null);
}
loadLogin();
loadArticles();