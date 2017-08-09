var button= document.getElementById('mybtn');
var count = document.getElementById('count');
var counter=0;
button.onclick = function(){
    counter++;
    count.innerhtml=counter;
};
