# -*- encoding:utf-8 -*- 
from flask import Flask,render_template,request,redirect,url_for
import facebook
import numpy as np
import modules.getParam as getParam 
import modules.file_controll as fileCon
import modules.faceTrack as face

app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/takePicture')
def takePicture():
  if request.args.get('message'):
    message = request.args.get('message')
    return render_template('takePicture.html',msg=message)
  return render_template('takePicture.html')

@app.route('/getCode',methods=['POST','GET'])
def getCode():
  if request.method == 'POST':
    return render_template('index.html')

  else:
    url = getParam.code()
    return redirect(url) 

@app.route('/callback')
def Fbcallback():
  code = request.args.get('code')
  if(code):
    try:
      token = getParam.token(code)
      graph = facebook.GraphAPI(token)
      resp = graph.get_object('me?fields=id,name,email,friends,picture')
      #resp = graph.get_object('me?fields=id,name,albums{name,photos},posts{picture}')
      #user = fileCon.generate_facebook_url(resp)
      #fileCon.download(user)
      #face.track(user)
      #print fileCon.generate_facebook_url(resp)
      print resp
    except:
      print "error: Not get token or graph error"

    return render_template('callback.html')

  else:
    print "failed get code"
    return render_template('callback.html')

if __name__ == '__main__':
  #app.debug = True
  app.run(host='0.0.0.0')
