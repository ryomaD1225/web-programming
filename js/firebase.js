//============
var config = {
    apiKey: "AIzaS**************baEWPRgSBcv_re6o",
    authDomain: "web-meeting-f22dc.firebaseapp.com",
    databaseURL: "https://web-meeting-f22dc.firebaseio.com",
    projectId: "web-meeting-f22dc",
    storageBucket: "web-meeting-f22dc.appspot.com",
    messagingSenderId: "53227319048"
  };
  firebase.initializeApp(config);
  
  // Msg送信準備
  const newPostRef = firebase.database();
  
  //---------- google 翻訳APIを叩くためのインスタンス生成処理----
  const glot = new Glottologist();
  let room = "room1";
  var textMessage;
  
  
  //---------------Google翻訳を使って変換---------------//
   function setTranslation(lang) {
   
    glot.t(v.text.textContent, lang).then( result => {
    //   h1.textContent = result;
    textMessage = result;

    return textMessage;
    })
  }
  
  
  
  //Msg受信処理
  //--------------- 変更 Msg受信処理を関数化---------------//
  function text(){


    newPostRef.ref(room).on("child_added", function (data) {
    //   const v = data.val();
      v = data.val();
      const k = data.key;
      
      

      let str = "";
    
      str += '<div id="' + k + '" class="msg_main">'
      str += '<div class="msg_left">';
      str += '<div class=""><img src="../img/icon_person.png" alt="" class="icon ' + v.username +
        '" width="30"></div>';
      str += '<div class="msg">';
      str += '<div class="name">' + v.username + '</div>';
      str += '<div class="text">' + v.text + '</div>';
      //---------------- 大量に翻訳リクエストをapiに投げると一定時間使用不可になることを確認----------
      // str += '<div class="text">' + setTranslation('en') + '</div>';
      str += '</div>';
      str += '</div>';
      str += '<div class="msg_right">';
      str += '<div class="time">' + v.time + '</div>';
      str += '</div>';
      str += '</div>';
    
      output.innerHTML += str;
  
      //--------------- 追加 自動スクロール機能を追加 ---------------//
    //   var screenHeight = screenHeight
    //   console.log(screenHeight)
      $("#output").scrollTop( $("#output")[0].scrollHeight );
    
    });
  
  }
  
  //時間を取得する関数
  function getTime() {
    var date = new Date();
    var hh = ("0" + date.getHours()).slice(-2);
    var min = ("0" + date.getMinutes()).slice(-2);
    var sec = ("0" + date.getSeconds()).slice(-2);
  
    var time = hh + ":" + min + ":" + sec;

    return time;
  }
  
  //音声認識処理
  const speech = new webkitSpeechRecognition();
  speech.lang = 'ja-JP';
  
  
  //--------------- 変更 join. ---------------//
  window.onload = function(){

    speech.start();
    text();

  }
  
  //--------------- 追加 endcall ---------------//
  const endcall = document.getElementById('js-close-trigger')
  endcall.addEventListener('click', function(){
    location.reload();
  })
  
  speech.onresult = function (e) {
      speech.stop();
      if (e.results[0].isFinal) {
        var autotext = e.results[0][0].transcript
        console.log(e);
        console.log(autotext);
  
        newPostRef.ref(room).push({
          username: username.value,
          text: autotext,
          time: getTime()
        });
        
      }
  }
  
  speech.onend = () => {
      speech.start()
  };


 
