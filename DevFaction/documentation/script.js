window.onload = () => {
var loader = document.querySelector('.loader');
var topLeft = document.querySelector('.top-left');
var topRight = document.querySelector('.top-right');
var bottomLeft = document.querySelector('.bottom-left');
var bottomRight = document.querySelector('.bottom-right');
var content = document.querySelector('.content');
var helper = document.querySelector('.helper');
var menu = document.querySelector('.menu');
var searchHide = document.querySelector('.searchHide');
var plus = document.querySelector('.plus');
var logout = document.querySelector('.logout');
var add = document.querySelector('.add');
var searchBar = document.querySelector('.search input');
var searchList = document.querySelector('.searchList');
var addNewTopic = document.querySelector('.addNewTopic');
var actionBtn = document.querySelector('.btn');
var cancel = actionBtn.querySelector('#cancel');
var create = actionBtn.querySelector('#create');
var mainImg = document.querySelector('.img');
var menuClick = false;
var allLi;
var sendTopic = document.querySelector('#sendTopic');
var sendImage = document.querySelector('#sendImage');
var sendWrite = document.querySelector('#sendWrite');
var sendFile = document.querySelector('#sendFile');
var ImgData;
var codeData;
var goToDownload= document.querySelector('.Download');

menu.addEventListener('click',() => {
    menuClick = !menuClick;
    if(menuClick){
        topLeft.style.width = 50*Math.sqrt(2) + '%';
        topRight.style.width = 50*Math.sqrt(2) + '%';
        bottomLeft.style.width = 50*Math.sqrt(2) + '%';
        bottomRight.style.width = 50*Math.sqrt(2) + '%';
        helper.style.left = 0;
        // plus.style.right = 20+'px';
        // logout.style.right = 75+'px';
        searchHide.style.transform = `translateY(0)`;
    }
    else{
        topLeft.style.width = '2.5px';
        topRight.style.width = '2.5px';
        bottomLeft.style.width = '2.5px';
        bottomRight.style.width = '2.5px';
        helper.style.left = '100%';
        // plus.style.right = -100+'px';
        // logout.style.right = -100+'px';
        actionBtn.style.bottom = '-300px';
        addNewTopic.style.top = '120%';
        searchHide.style.transform = `translateY(100px)`;
    }
    searchList.style.left = `100%`;
})


plus.addEventListener('click',() => {
    actionBtn.style.bottom = '20px';
    addNewTopic.style.top = '50px';
})
add.addEventListener('click',() => {
    actionBtn.style.bottom = '20px';
    addNewTopic.style.top = '50px';
})

cancel.addEventListener('click',() => {
    actionBtn.style.bottom = '-300px';
    addNewTopic.style.top = '120%';
    sendTopic.value = '';
    sendImage.value = '';
    sendWrite.value = '';
})


searchBar.addEventListener('click', (e) => {
    searchList.style.left = `0%`;
    cancel.click();
})
searchBar.addEventListener('keyup', searchLiMob);

searchHide.addEventListener('click', (e) => {
    searchList.style.left = `0%`;
    cancel.click();
})
searchHide.addEventListener('keyup', searchLiMob);


content.addEventListener('click', (e) => {
    searchList.style.left = `100%`;
})



function searchLiMob(){
    let LIes = document.querySelectorAll('.searchList li');
    let findMob = searchHide.value.toLowerCase();
    let find = searchBar.value.toLowerCase();

    for (let i = 0; i < LIes.length; i++) {
        if (LIes[i].innerHTML.toLowerCase().indexOf(findMob) > -1) {
            LIes[i].style.display = 'block';
        } else {
            LIes[i].style.display = 'none';
        }

        if (LIes[i].innerHTML.toLowerCase().indexOf(find) > -1) {
            LIes[i].style.display = 'block';
        } else {
            LIes[i].style.display = 'none';
        }
    }
}






// firebase server
var firebaseConfig = {
    apiKey: "AIzaSyA6xK1Co-Ycykt3hCgot9GoOwf3SGAuGN4",
    authDomain: "blogst-ecce4.firebaseapp.com",
    databaseURL: "https://blogst-ecce4-default-rtdb.firebaseio.com",
    projectId: "blogst-ecce4",
    storageBucket: "blogst-ecce4.appspot.com",
    messagingSenderId: "435731974520",
    appId: "1:435731974520:web:08f5f7302969302aba608d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);




var page = 0;
var topic = document.querySelector('.topic');
var listLength;
var imgLength;
var code;
var Download;
// retrieving firebase data
function retrieve(){
    firebase.database().ref('documentation/').once('value').then(function (snap){
        listLength = snap.val().lists.length;
        topic.innerHTML = snap.val().lists[page].write;
        code = snap.val().codes[page].code;
        // console.log(code);
    
        for (let i = 0; i < listLength; i++) {
            var li = document.createElement('li');
            li.innerHTML = snap.val().lists[i].topic;
            searchList.appendChild(li);
            allLi = document.querySelectorAll('.searchList li');
            clickLi();
        }
    })

    firebase.database().ref('documentation/codes/'+page).once('value').then(snap =>{
        Download = snap.val().code;
    })

    firebase.database().ref('documentation/').once('value').then(function (snap){
        console.log(snap.val().images[page].img );
        mainImg.style.background = 'url(' + snap.val().images[page].img + ')';
        mainImg.style.background = `url(${snap.val().images[page].img})`
        console.log( mainImg.style.background);
        mainImg.style.backgroundPosition = `center`;
        mainImg.style.backgroundRepeat = `no-repeat`;
        mainImg.style.backgroundSize = `cover`;
    })
}



function unRetrieve() {
    searchList.innerHTML = ''
    topic.innerHTML = ''
    mainImg.style.background = '#fff'
}






// sending data to firebase

create.addEventListener('click',() => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if (sendTopic.value == 0 || sendImage.value == 0 || sendWrite.value == 0) return

            // sending Image data
            var imgFile = sendImage.files[0];
            var metadataImg = {
                contentType: imgFile.type
            }
            console.log(imgFile.type);
            pseudoLen = listLength;
            firebase.storage().ref('images/').child(imgFile.name).put(imgFile,metadataImg)
            .then(snap => snap.ref.getDownloadURL())
            .then(url => {
                ImgData = url;
                firebase.database().ref('documentation/images/'+pseudoLen).set({
                    img: ImgData
                });
            })

            // sending Script/markup data
            var codeFile = sendFile.files[0];
            var metadataCode = {
                contentType: codeFile.type
            }
            firebase.storage().ref('code/').child(codeFile.name).put(codeFile,metadataCode)
            .then(snap => snap.ref.getDownloadURL())
            .then(url => {
                codeData = url;
                firebase.database().ref('documentation/codes/'+pseudoLen).set({
                    code: codeData
                })
            })

            // sending text data
            firebase.database().ref('documentation/lists/'+listLength).set({
                topic: sendTopic.value,
                write: sendWrite.value
            });

            setTimeout(() => {
                sendTopic.value = '';
                sendImage.value = '';
                sendWrite.value = '';
                actionBtn.style.bottom = '-300px';
                addNewTopic.style.top = '120%';
            },100)
            searchList.innerHTML = '';
            retrieve();
        }
    })
})







function clickLi(){
    allLi.forEach(li => {
        li.onclick = () => {
            for (let i = 0; i < allLi.length; i++) {
                if (allLi[i] === li) {
                    page = i;

                    firebase.database().ref('documentation/').once('value').then(function (snap){
                       
                        listLength = snap.val().lists.length;
                        topic.innerHTML = snap.val().lists[page].write;   
                        
                        mainImg.style.background = 'url(' + snap.val().images[page].img + ')';
                        mainImg.style.backgroundPosition = `center`;
                        mainImg.style.backgroundRepeat = `no-repeat`;
                        mainImg.style.backgroundSize = `cover`;

                        code = snap.val().codes[page].code;
                    })
                    

                    firebase.database().ref('documentation/codes/'+page).once('value').then(snap =>{
                        Download = snap.val().code;
                    })


                    topLeft.style.width = '2.5px';
                    topRight.style.width = '2.5px';
                    bottomLeft.style.width = '2.5px';
                    bottomRight.style.width = '2.5px';
                    menuClick = !menuClick;
                    searchHide.style.transform = `translateY(100px)`;
                    // searchList.style.left = `100%`;
                    // plus.style.right = -100+'px';
                    // logout.style.right = -100+'px';
                    if (window.innerWidth <= 850) {
                        helper.style.left = `100%`;
                    }
                }
            }
        }
    })
}

function download(file, text) {
              
    //creating an invisible element
    var element = document.createElement('a');
    element.setAttribute('href',text);
    element.setAttribute('download', file);
    console.log('biaa');
  element.click();
    // Above code is equivalent to
    // <a href="path of file" download="file name">
}
goToDownload.addEventListener('click', (e) => {
    // let a = document.createElement('a');
    // a.setAttribute('download',"download");
    // a.href = Download;
    // document.body.appendChild(a);
    // // e.preventDefault();
    // a.click();
    download('file1.txt',Download)
})









// login
var login = document.querySelector('.login');
var afterLogin = document.querySelector('.afterLogin');

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        afterLogin.style.display = `block`;
        login.style.display = `none`;
        var uid = user.uid;
        retrieve()
    } else {
        afterLogin.style.display = `none`;
        login.style.display = `flex`;
        unRetrieve()
    }
  });

var loginBtn = document.querySelector('.loginbutton');

loginBtn.addEventListener('click', () => {
    let username = document.querySelector('#username').value;
    let userpass = document.querySelector('#userpassword').value;

    firebase.auth().signInWithEmailAndPassword(username, userpass)
    .then((userCredential) => {
        var user = userCredential.user;
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
})






logout.addEventListener('click',() => {
    firebase.auth().signOut();
})


this.setTimeout(()=> {
    loader.style.opacity = 0;
    // loader.style.display = 'none';
    loader.style.zIndex = -10;
    loader.querySelector('svg path').style.animation = 'none';
},2000)

}