window.onload = function(){
  console.log($.cookie("Solaris_model_id"));
  var sendBtn = $("#send_button");
  document.getElementById("step1").style.opacity = "1";
  document.getElementById("file").addEventListener("change",function(eve){
    var file = eve.target.files;
    var fileReader = new FileReader() ;

    fileReader.onload = function() {
      var dataUrl = this.result ;
      document.getElementById("img").innerHTML = "<img src='" + dataUrl + "'>";
    };

    fileReader.readAsDataURL(file[0]);
  });

  sendBtn.click(function(ele){
    console.log(ele);
    sendBtn.css("opacity","0.5");
    sendBtn = null;
    send_server(function(result,msg){
      if(result){
        console.log("success");
        document.getElementById("step2").style.opacity = "1";
      }else{
        document.getElementById("message").innerHTML = msg;
        sendBtn = $("#send_button");
        sendBtn.css("opacity","1");
      }
    });
  });
}

var send_server = function(callback){
  if ($(".filer").val() == "") {
    console.log("empty");
    callback(false,"not set image");
    return
  }
  var file = document.querySelector("input[name='faceImg']").files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    var PostData = {
      "img":reader.result,
      "imgName":document.querySelector('input[name="faceImg"]').files[0].name,
      "text":$("input[name='user_name']").val()
    };
    $.ajax({
      url:'http://192.168.1.6:8000/testPost',
      contentType:'application/json',
      type : "POST",
      dataType : "json",
      data : JSON.stringify(PostData),
      crossDomain:true,
      success:function(data){
        if(!data.img){
          callback(false,data.result);
          return
        }else{
          $("#formBox").fadeOut('slow');
          $('#getPicture').fadeIn('slow');
          start_generate("data:image/png;base64,"+data.img+"",data.random_id,data.name);
          callback(true,null);
        }
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
        callback(false,"error");
        console.log("XMLHttpRequest : " + XMLHttpRequest.responseText);
        console.log("textStatus : " + textStatus);
        console.log("errorThrown : " + errorThrown.message);
        return
      }
    });
  }

  reader.readAsDataURL(file);
}
