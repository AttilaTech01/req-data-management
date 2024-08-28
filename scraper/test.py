from urllib.parse import urlparse

urlstring = "https://www.lenouvelliste.ca › 2014/01/24 › le-clan-dyv..."
url = url = urlparse(urlstring)
good_url= url.hostname.split("›")

print(good_url)