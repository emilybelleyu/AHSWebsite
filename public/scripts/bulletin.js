 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyDEUekXeyIKJUreRaX78lsEYBt8JGHYmHE",
    authDomain: "arcadia-high-mobile.firebaseapp.com",
    databaseURL: "https://arcadia-high-mobile.firebaseio.com",
    projectId: "arcadia-high-mobile",
    storageBucket: "arcadia-high-mobile.appspot.com",
    messagingSenderId: "654225823864",
    appId: "1:654225823864:web:944772a5cadae0c8b7758d"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();

//   function signUp(){

//     var email = document.getElementById("email");
//     var password = document.getElementById("password"); 

//     const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
//     promise.catch(e => alert(e.message));

//     alert("Signed up.");
// }

 
function login(){
    var email = document.getElementById("email");
    var password = document.getElementById("password"); 

    const promise = auth.signInWithEmailAndPassword(email.value, password.value);
    promise.catch(e => alert(e.message));
    alert("Signed in with " + email.value + ".");
    //Take user to a different location or homepage
    location.replace("toc.html");
}

function signOut(){
    auth.signOut();
    alert("Signed out.");
}

auth.onAuthStateChanged(function(user){
    if(user){
        var email = user.email;
        alert("Active user: " + email);
        //is signed in
    }else{
        //alert("No active user.")
        //no user is signed in
    }
});

//move web location
function homepage(){
    location.replace("homepage.html");
}

function bulletin(){
    location.replace("bulletin.html");
}

function back1(){
    location.replace("index.html");
}

function back2(){
    location.replace("toc.html");
}

//textarea autoexpand
document.addEventListener('input', function (event) {
    if (event.target.tagName.toLowerCase() !== 'textarea') return;
    autoExpand(event.target);
}, false);

var autoExpand = function (field) {
	// Reset field height
	field.style.height = 'inherit';

	// Get the computed styles for the element
	var computed = window.getComputedStyle(field);

	// Calculate the height
	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
	             + parseInt(computed.getPropertyValue('padding-top'), 10)
	             + field.scrollHeight
	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

	field.style.height = height + 'px';
};

//id generator ---NOT USING---
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

//bulletin constants
const category = document.getElementById('category');
//const number = document.getElementById('number');
const id = document.getElementById('id');
const title = document.getElementById('title');
const author = document.getElementById('author');
const image = document.getElementById('image');
const timestamp = document.getElementById('timestamp');
const body = document.getElementById('textarea1');
//const imgNum = document.getElementById('imgNum');

const addBtn1 = document.getElementById('addBtn1');
const updateBtn1 = document.getElementById('updateBtn1');
const removeBtn1 = document.getElementById('removeBtn1');

const database = firebase.database();

//to add, update, remove, and read data from firebase
addBtn1.addEventListener('click', (e) => {
    e.preventDefault();

    var htmlValue = body.value.includes("</"); 
     //convert date to unix timestamp
    var unixTimestamp = parseInt((new Date(timestamp.value).getTime() / 1000).toFixed(0));  

    var newPostRef = database.ref('/bulletin/' + category.value).push();
    var postId = newPostRef.key;

    newPostRef.set({
        articleAuthor: author.value,
        articleBody: body.value,
        articleTitle: title.value,
        articleUnixEpoch: unixTimestamp,
        hasHTML: htmlValue,
    });

    database.ref('/bulletin/' + category.value + '/' + postId + '/articleImages/').set({
        0: image.value,
    });
});

var counter = 0; 
updateBtn1.addEventListener('click', (e) => {
    e.preventDefault();
    counter = counter + 1;
    
    var htmlValue = body.value.includes("</"); 
    var unixTimestamp = parseInt((new Date(timestamp.value).getTime() / 1000).toFixed(0));  

    const newData = {
        articleAuthor: author.value,
        articleBody: body.value,
        articleTitle: title.value,
        articleUnixEpoch: unixTimestamp,
        hasHTML: htmlValue,
    };

    const newImg1 = {
        1: image.value,
    };

    const newImg2 = {
        2: image.value,
    };
    if(counter == 1){
        database.ref('/bulletin/' + category.value + '/' + id.value + '/articleImages/').update(newImg1);
    }else{
    database.ref('/bulletin/' + category.value + '/' + id.value + '/articleImages/').update(newImg2);
    }
    database.ref('/bulletin/' + category.value + '/' + id.value).update(newData);
});

removeBtn1.addEventListener('click', (e) => {
    e.preventDefault();

    database.ref('/bulletin/' + category.value + '/' + id.value).remove()
    .then(() => {
        window.alert('Article ' + id.value + ' removed from database.');
    })
    .catch(error => {
        console.error(error);
    });
});

//id listener
var postId; 

if(category.value = "athletics"){
    database.ref('bulletin').child('athletics').once('child_changed', snapshot => {
        postId = snapshot.key;
    });
}else if(category.value = "colleges"){
    database.ref('bulletin').child('colleges').once('child_changed', snapshot => {
        postId = snapshot.key; 
    });
}else if(category.value = "events"){
    database.ref('bulletin').child('events').once('child_changed', snapshot => {
        postId = snapshot.key; 
    });
}else if(category.value = "others"){
    database.ref('bulletin').child('others').once('child_changed', snapshot => {
        postId = snapshot.key; 
    });
}else if(category.value = "reference"){
    database.ref('bulletin').child('reference').once('child_changed', snapshot => {
        postId = snapshot.key; 
    });
}else{
    database.ref('bulletin').child('seniors').once('child_changed', snapshot => {
        postId = snapshot.key; 
    });
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + ' ' + date + ', ' + year;
    return time;
  }

//getting data from the server
database.ref('bulletin').child('athletics').on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot){

        var data = childSnapshot.val();
        var key = childSnapshot.key;
        var time = timeConverter(data.articleUnixEpoch); 
        var li = document.createElement("li");

        var a = document.createTextNode("ID: " + key);
        var b = document.createTextNode("Images: " + data.articleImages);
        var c = document.createTextNode("Date: " + time);
        var d = document.createTextNode("Title: " + data.articleTitle);
        var e = document.createTextNode("Author: " + data.articleAuthor);
        var f = document.createTextNode("Body: " + data.articleBody);
        var g = document.createTextNode("hasHTML: " + data.hasHTML);

        li.appendChild(a);
        var br1 = document.createElement("br");
        li.appendChild(br1);
        li.appendChild(b);
        var br2 = document.createElement("br");
        li.appendChild(br2);
        li.appendChild(c);
        var br3 = document.createElement("br");
        li.appendChild(br3);
        li.appendChild(d);
        var br4 = document.createElement("br");
        li.appendChild(br4);
        li.appendChild(e);
        var br5 = document.createElement("br");
        li.appendChild(br5);
        li.appendChild(f);
        var br6 = document.createElement("br");
        li.appendChild(br6);
        li.appendChild(g);


        var list = document.getElementById("myUL1");
        list.insertBefore(li, list.childNodes[0]);
    });
});

database.ref('bulletin').child('colleges').on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot){
        var data = childSnapshot.val();
        var key = childSnapshot.key;
        var time = timeConverter(data.articleUnixEpoch); 
        var li = document.createElement("li");

        var a = document.createTextNode("ID: " + key);
        var b = document.createTextNode("Images: " + data.articleImages);
        var c = document.createTextNode("Date: " + time);
        var d = document.createTextNode("Title: " + data.articleTitle);
        var e = document.createTextNode("Author: " + data.articleAuthor);
        var f = document.createTextNode("Body: " + data.articleBody);
        var g = document.createTextNode("hasHTML: " + data.hasHTML);


        li.appendChild(a);
        var br1 = document.createElement("br");
        li.appendChild(br1);
        li.appendChild(b);
        var br2 = document.createElement("br");
        li.appendChild(br2);
        li.appendChild(c);
        var br3 = document.createElement("br");
        li.appendChild(br3);
        li.appendChild(d);
        var br4 = document.createElement("br");
        li.appendChild(br4);
        li.appendChild(e);
        var br5 = document.createElement("br");
        li.appendChild(br5);
        li.appendChild(f);
        var br6 = document.createElement("br");
        li.appendChild(br6);
        li.appendChild(g);


        var list = document.getElementById("myUL2");
        list.insertBefore(li, list.childNodes[0]);
       });
});

database.ref('bulletin').child('events').on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot){
        var data = childSnapshot.val();
        var key = childSnapshot.key;
        var time = timeConverter(data.articleUnixEpoch); 
        var li = document.createElement("li");

        var a = document.createTextNode("ID: " + key);
        var b = document.createTextNode("Images: " + data.articleImages);
        var c = document.createTextNode("Date: " + time);
        var d = document.createTextNode("Title: " + data.articleTitle);
        var e = document.createTextNode("Author: " + data.articleAuthor);
        var f = document.createTextNode("Body: " + data.articleBody);
        var g = document.createTextNode("hasHTML: " + data.hasHTML);


        li.appendChild(a);
        var br1 = document.createElement("br");
        li.appendChild(br1);
        li.appendChild(b);
        var br2 = document.createElement("br");
        li.appendChild(br2);
        li.appendChild(c);
        var br3 = document.createElement("br");
        li.appendChild(br3);
        li.appendChild(d);
        var br4 = document.createElement("br");
        li.appendChild(br4);
        li.appendChild(e);
        var br5 = document.createElement("br");
        li.appendChild(br5);
        li.appendChild(f);
        var br6 = document.createElement("br");
        li.appendChild(br6);
        li.appendChild(g);

        var list = document.getElementById("myUL3");
        list.insertBefore(li, list.childNodes[0]);
       });
});

database.ref('bulletin').child('others').on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot){
        var data = childSnapshot.val();
        var key = childSnapshot.key;
        var time = timeConverter(data.articleUnixEpoch); 
        var li = document.createElement("li");

        var a = document.createTextNode("ID: " + key);
        var b = document.createTextNode("Images: " + data.articleImages);
        var c = document.createTextNode("Date: " + time);
        var d = document.createTextNode("Title: " + data.articleTitle);
        var e = document.createTextNode("Author: " + data.articleAuthor);
        var f = document.createTextNode("Body: " + data.articleBody);
        var g = document.createTextNode("hasHTML: " + data.hasHTML);


        li.appendChild(a);
        var br1 = document.createElement("br");
        li.appendChild(br1);
        li.appendChild(b);
        var br2 = document.createElement("br");
        li.appendChild(br2);
        li.appendChild(c);
        var br3 = document.createElement("br");
        li.appendChild(br3);
        li.appendChild(d);
        var br4 = document.createElement("br");
        li.appendChild(br4);
        li.appendChild(e);
        var br5 = document.createElement("br");
        li.appendChild(br5);
        li.appendChild(f);
        var br6 = document.createElement("br");
        li.appendChild(br6);
        li.appendChild(g);


        var list = document.getElementById("myUL4");
        list.insertBefore(li, list.childNodes[0]);
       });
});

database.ref('bulletin').child('reference').on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot){
        var data = childSnapshot.val();
        var key = childSnapshot.key;
        var time = timeConverter(data.articleUnixEpoch); 
        var li = document.createElement("li");

        var a = document.createTextNode("ID: " + key);
        var b = document.createTextNode("Images: " + data.articleImages);
        var c = document.createTextNode("Date: " + time);
        var d = document.createTextNode("Title: " + data.articleTitle);
        var e = document.createTextNode("Author: " + data.articleAuthor);
        var f = document.createTextNode("Body: " + data.articleBody);
        var g = document.createTextNode("hasHTML: " + data.hasHTML);


        li.appendChild(a);
        var br1 = document.createElement("br");
        li.appendChild(br1);
        li.appendChild(b);
        var br2 = document.createElement("br");
        li.appendChild(br2);
        li.appendChild(c);
        var br3 = document.createElement("br");
        li.appendChild(br3);
        li.appendChild(d);
        var br4 = document.createElement("br");
        li.appendChild(br4);
        li.appendChild(e);
        var br5 = document.createElement("br");
        li.appendChild(br5);
        li.appendChild(f);
        var br6 = document.createElement("br");
        li.appendChild(br6);
        li.appendChild(g);


        var list = document.getElementById("myUL5");
        list.insertBefore(li, list.childNodes[0]);
       });
});

database.ref('bulletin').child('seniors').on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot){
        var data = childSnapshot.val();
        var key = childSnapshot.key;
        var time = timeConverter(data.articleUnixEpoch); 
        var li = document.createElement("li");

        var a = document.createTextNode("ID: " + key);
        var b = document.createTextNode("Images: " + data.articleImages);
        var c = document.createTextNode("Date: " + time);
        var d = document.createTextNode("Title: " + data.articleTitle);
        var e = document.createTextNode("Author: " + data.articleAuthor);
        var f = document.createTextNode("Body: " + data.articleBody);
        var g = document.createTextNode("hasHTML: " + data.hasHTML);


        li.appendChild(a);
        var br1 = document.createElement("br");
        li.appendChild(br1);
        li.appendChild(b);
        var br2 = document.createElement("br");
        li.appendChild(br2);
        li.appendChild(c);
        var br3 = document.createElement("br");
        li.appendChild(br3);
        li.appendChild(d);
        var br4 = document.createElement("br");
        li.appendChild(br4);
        li.appendChild(e);
        var br5 = document.createElement("br");
        li.appendChild(br5);
        li.appendChild(f);
        var br6 = document.createElement("br");
        li.appendChild(br6);
        li.appendChild(g);


        var list = document.getElementById("myUL6");
        list.insertBefore(li, list.childNodes[0]);
       });
});