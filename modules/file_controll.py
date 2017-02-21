import urllib
import os

def download(user):

  if(os.path.exists('./static/'+user['id'])):

    print "exits folder"

  else:

    os.mkdir('./static/'+user['id'])
    os.mkdir('./static/'+user['id']+'/image')

  for picture in user['picture_urls']:
    pic_path = "./static/"+user['id']+'/image/'+picture['id']+".jpg"
    if os.path.exists(pic_path):

      print "this image file is exists"

    else:

      img = urllib.urlopen(picture['url'])
      localfile = open("./static/"+user['id']+"/image/"+picture['id']+".jpg","wb")
      localfile.write(img.read())
      img.close()
      localfile.close()

def generate_facebook_url(resp):

  user = {}

  user['id'] = resp['id']
  user['name'] = resp['name']
  
  if(resp['albums']['data']):
    
    albumID = []
    album_photos = []
    imgUrl = "https://graph.facebook.com/{0}/picture"
    
    for item in resp['albums']['data']:

      if(item['id']):
        albumID.append(item['id'])

      for photo_id in item['photos']['data']:

        if(photo_id['id']):
          album_photos.append(photo_id['id'])

    user['albumID'] = albumID
    user['album_photos'] = album_photos


  else:
    print "no album data"

  if(len(resp['posts']['data'])):
  
    urls = []

    for item in resp['posts']['data']:
      try:
        info = {}
        info['url'] = item['picture']
        info['id'] = item['id']
        urls.append(info)

      except:
        print "no urls"

    user['picture_urls'] = urls

  else:

    print "no image url"

  return user
