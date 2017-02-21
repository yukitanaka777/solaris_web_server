var clm_trackr = new clm.tracker({useWebGL:true});
var face_defomer = new faceDeformer();
var login_img_canvas;
var once_face_canvas;
var octx;

var TestLogin = function(result){
  console.log(result);
  login_img_canvas = document.getElementById('login_post_img_canvas');
  once_face_canvas = document.getElementById('once_face_canvas');
  octx = once_face_canvas.getContext('2d');
  //face_defomer.init(login_img_canvas);
  $("#getPicture").fadeOut('slow');
  $('#testLogin').fadeIn('slow');
  var LoginBtn = $("#Login");
  var LoginForm = document.getElementById("LoginPost");
  document.querySelector("input[name='Solaris_model_id']").value = result;
  document.getElementById("step3").style.opacity = "1";
  document.getElementById("login_file").addEventListener("change",function(eve){
    var login_file = eve.target.files;
    var login_fileReader = new FileReader() ;

    login_fileReader.onload = function() {
      var dataUrl = this.result ;
      document.getElementById("login_img").innerHTML = "<img src='" + dataUrl + "'>";
      var PostData = {
        "img":dataUrl,
        "imgName":document.querySelector('input[name="login_file"]').files[0].name,
        "text":"decoy"
      };
      $.ajax({
        url:'http://192.168.1.6:8000/for_login_img_Post',
        contentType:'application/json',
        type : "POST",
        dataType : "json",
        data : JSON.stringify(PostData),
        crossDomain:true,
        success:function(data){
          if(!data.img){
            return
          }else{
            document.getElementById('login_img').innerHTML = "<img src='data:image/png;base64,"+data.img+"'>";
            masking_process("data:image/png;base64,"+data.img+"");
          }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
          console.log("XMLHttpRequest : " + XMLHttpRequest.responseText);
          console.log("textStatus : " + textStatus);
          console.log("errorThrown : " + errorThrown.message);
          return
        }
      });
    };

    login_fileReader.readAsDataURL(login_file[0]);
  });

  LoginBtn.click(function(ele){
    if ($(".login_img").val() == "") {
      console.log("empty");
      return
    }
    console.log(ele);
    LoginBtn.css("opacity","0.5");
    LoginBtn = null;
    LoginForm.submit();
  });
}

var masking_process = function(bImg){
  var create_image = new Image();
  create_image.onload = function(){
    var mask_canvas = document.getElementById('login_img_mask');
    var imgW = create_image.width;
    var imgH = create_image.height;
    mctx = mask_canvas.getContext('2d');
    mask_canvas.width = imgW;
    mask_canvas.height = imgH;
    login_img_canvas.width = imgW;
    login_img_canvas.height = imgH;

    mctx.drawImage(create_image, 0, 0, imgW,imgH);
    clm_trackr.init(pModel);
    face_defomer.init(login_img_canvas);
    clm_trackr.start(mask_canvas);
    loop_clm_pos(bImg);
  }
  create_image.src = bImg
}

function loop_clm_pos(bImg){
  if(clm_trackr.getCurrentPosition()){
    maskingPos = clm_trackr.getCurrentPosition();
    var MaskImg = new Image();
    var clipX = maskingPos[1][0]
    var clipY = maskingPos[20][1]
    var Width = maskingPos[13][0] - clipX
    var Height = maskingPos[7][1] - clipY
    once_face_canvas.width = Width;
    once_face_canvas.height = Height;
    MaskImg.onload = function(){
      face_defomer.load(MaskImg,maskingPos,pModel);
      face_defomer.draw(maskingPos);
      octx.drawImage(login_img_canvas,clipX,clipY,Width,Height,0,0,Width,Height);
      var material_base64_data = once_face_canvas.toDataURL();
      //var output = material_base64_data.replace(/^data:image\/(png|jpg);base64,/, "");
      document.getElementsByName("login_base64_file")[0].setAttribute("value", material_base64_data);
    }
    MaskImg.src = bImg;
  }else{
    console.log("not get pos");
    setTimeout(function(){
    loop_clm_pos(bImg);
  },1000);
 }
}
