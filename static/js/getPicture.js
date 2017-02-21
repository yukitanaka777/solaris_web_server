var clm = new clm.tracker({useWebGL:true});
var fb = new faceDeformer();
var backView = new faceDeformer();
var masking_switch = false;
var dataCtn = 1;
var maskAnimDate
var canvas;
var FaceImgArr = {};
var mtx;
var Button;
var BV;
var btx;
var ImgURL;

var start_generate = function(base64img,random_id,name){
  ImgURL = base64img;
  canvas = document.getElementById('canvas');
  BV = document.getElementById('backView');
  clm.init(pModel);
  $.getJSON('./static/vector_good.json',function(data){
    maskAnimDate = data;
    var create_image = new Image();
    create_image.onload = function(){
      drawImage(create_image);
      $("#loadingLine").css('width','0%').animate({width:'20%'},500);
    }
    create_image.src = base64img;
  });
  Button = $('#startButton');
  Button.css('display','none');

  Button.click(function(){
    $('canvas#model').css('opacity','0');
    Button.text('Scanning');
    Button = null;
    var SendInfo = {
      "img":FaceImgArr,
      "name":name,
      "id":random_id
    }
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: "http://192.168.1.6:9000/save_and_learn",
      crossDomain: true,
      dataType : 'json',
      data : JSON.stringify(SendInfo),
      success : function(result) {
        $.cookie('Solaris_model_id',result,{expires:7,path:'/'});
        TestLogin(result);
      },error : function(result){
        console.log(result);
      }
    });
    rendering();
  });
  fb.init(canvas);
  backView.init(BV);
};

function rendering(){
  if(masking_switch && dataCtn < Object.keys(maskAnimDate).length){
    masking(maskAnimDate[dataCtn]);
    dataCtn++;
    requestAnimationFrame(rendering);
  }else if(dataCtn == Object.keys(maskAnimDate).length){
    //console.log('finish');
    cancelAnimationFrame(rendering);
  }
}

function masking_init(maskingPos){
  var MaskImg = document.createElement("img");
  var resizeView = document.getElementById("resizeView");
  var rtx = resizeView.getContext('2d');
  MaskImg.onload = function(){
    fb.load(MaskImg,maskingPos,pModel);
    backView.load(MaskImg,maskingPos,pModel);
    drawRectMaskingPos(maskingPos);
    masking_switch = true;
    $("#loadingLine").css('width','40%').animate({width:'75%'},500);

    for(var i = 1; i < Object.keys(maskAnimDate).length; i++){
      var marksArr = new Array(71);
      for(var j = 0; j < maskingPos.length; j++){
        var x = maskingPos[j][0] + maskAnimDate[i][j][0];
        var y = maskingPos[j][1] + maskAnimDate[i][j][1];
        var marksPos = [x,y];
        marksArr[j] = marksPos
      }
      if((i % 5) == 0){
        backView.clear();
        backView.draw(marksArr);
        var clipX = marksArr[1][0]
        var clipY = marksArr[20][1]
        var Width = marksArr[13][0] - clipX
        var Height = marksArr[7][1] - clipY
        resizeView.width = Width;
        resizeView.height = Height;
        rtx.fillRect(0,0,Width,Height);
        rtx.drawImage(BV,clipX,clipY,Width,Height,0,0,Width,Height);
        var createImg = resizeView.toDataURL('image/jpg');
        //$('body').append("<img src="+createImg+">");
        FaceImgArr[i] = createImg;
      }
      maskAnimDate[i] = marksArr;
    }

    $("#loadingLine").css('width','75%').animate({width:'100%'},500,function(){
      $("#loading").css('display','none');
      Button.fadeIn("slow");
    }

  );
  }
  MaskImg.src = ImgURL;
}

function masking(masPos){
  if(masPos){
    fb.draw(masPos);
  }else{
    console.log(masPos);
  }
}

function drawImage(img) {
  var model = document.getElementById('model');
  var imgW = img.width;
  var imgH = img.height;

  mtx = model.getContext('2d');
  model.width = imgW;
  model.height = imgH;

  mtx.drawImage(img, 0, 0, imgW,imgH);
  clm.init(pModel);
  clm.start(model);
  certain_clm_pos();
}

function certain_clm_pos(){
  if(clm.getCurrentPosition()){
    maskingPos = clm.getCurrentPosition();
    masking_init(maskingPos);
    //console.log(mask_position);
    //console.log(maskingPos);
    $("#loadingLine").css('width','20%').animate({width:'40%'},500);
  }else{
    console.log("not get pos");
    setTimeout(function(){
    certain_clm_pos();
  },1000);
 }
}

function drawRectMaskingPos(pos){
  for(var i = 0; i < pos.length; i++){
    mtx.beginPath();
    mtx.arc(pos[i][0],pos[i][1],2,Math.PI*2,false);
    mtx.stroke();
    mtx.fill();
    mtx.closePath();
	}
}
