from werkzeug.urls import url_quote_plus
import urllib2

app_id = "230292960713962"
app_secret = "f987b164682a2fdd43a12c57c307b7b1"
#redirect_url = url_quote_plus("http://localhost:5000/")
redirect_url = "http://localhost:5000/callback"
scope = "public_profile,user_photos,user_posts,user_relationships,user_friends,email"


code_url_token = "https://www.facebook.com/dialog/oauth?client_id={0}&redirect_uri={1}&scope={2}"

def code():
  try:
    #resp = urllib2.urlopen(code_url_token.format(app_id,redirect_url,public_profile))
    resp = code_url_token.format(str(app_id),str(redirect_url),scope)
    return resp

  except:
    return "failed"

def token(code):
  url_token = ("https://graph.facebook.com/oauth/access_token?client_id={0}&client_secret={1}&redirect_uri={2}&code={3}")
  try:
    resp = urllib2.urlopen(url_token.format(app_id,app_secret,redirect_url,code))
    data = resp.read().split('&')
    return data[0].strip('access_token=')

  except:
    return "failed"
