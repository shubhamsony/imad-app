var currentArticleTitle = window.location.pathname.split('/')[2];

function loadCommentForm () {
    var commentFormHtml = `
        <h5>Submit a comment</h5>
        <textarea id="comment_text" rows="5" cols="100" placeholder="Enter your comment here..."></textarea>
        <br/>
        <input type="submit" id="submit" value="Submit" />
        <br/>
        `;
    document.getElementById('comment_form').innerHTML = commentFormHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('submit');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    // clear the form & reload all the comments
                    document.getElementById('comment_text').value = '';
                    loadComments();    
                } else {
                    alert('Error! Could not submit comment');
                }
                submit.value = 'Submit';
          }
        };
        
        // Make the request
        var comment = document.getElementById('comment_text').value;
        request.open('POST', '/submit-comment/' + currentArticleTitle, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({comment: comment}));  
        submit.value = 'Submitting...';
        
    };
}

function loadLogin(){
     var request = new XMLHttpRequest();
     request.onreadystatechange = function(){
         if(request.readyState===XMLHttpRequest.DONE){
             if(request.status===200){
                 loadCommentForm(this.responseText);
             }
         }
     };
     request.open('GET','/check-login',true);
     request.send(null);
}

function escapeHtml(text){
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
     return $div.innerHTML;
}

function loadComments(){
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        
      if(request.readyState===XMLHttpRequest.DONE){
          var comments = document.getElementById('comments'); 
          if(request.status===200){
              var content= '';
              var commentsData = JSON.parse(this.responseText);
              var z =commentsData[0].username;
               alert(z);
        
              for(var i=0; i<commentsData.length;i++){
                  content+=`<div class="comment">
                   <p>${escapeHtml(commentsData[i].comment)}</p>
                    <div class="commenter">
                        ${commentsData[i].username}  
                    </div>
                </div>`;
                alert(content);
              }
             
              comments.innerHTML=content;
          }else{
              comments.innerHTML('Oops could not load comments');
          }
      }  
    };
    request.open('GET','/get-comments/'+currentArticleTitle,true);
    request.send(null);
}


loadLogin();
loadComments();