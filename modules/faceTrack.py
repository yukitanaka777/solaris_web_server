# -*- encoding:utf-8 -*-

import cv2
import os

cascade_path = "/usr/loal/opt/opencv/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml"

def track(user):

  folder = './static/'+str(user['id'])+'/image'
  images = os.listdir(folder)

  if os.path.exists('./static/'+str(user['id'])+'/tracked'):
    print "tracked file exists"

  else:
    os.mkdir('./static/'+str(user['id'])+'/tracked')

  for img in images:
  
    folder_path = folder + '/' + img;
    tracked_path = './static/'+str(user['id'])+'/tracked/'+img

    if os.path.exists(tracked_path):

      print "this image is tracked"

    else:

      img = cv2.imread(folder_path)
      img_gray = cv2.cvtColor(img,cv2.cv.CV_BGR2GRAY)
      cascade = cv2.CascadeClassifier(cascade_path)
      facerect = cascade.detectMultiScale(img_gray,scaleFactor=1.1,minNeighbors=1,minSize=(1,1))

      if len(facerect) > 0:

        dst = img[facerect[0][1]:facerect[0][1]+facerect[0][3],facerect[0][0]:facerect[0][0]+facerect[0][2]]
        cv2.imwrite(tracked_path,dst)

