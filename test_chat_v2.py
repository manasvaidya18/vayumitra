import urllib.request
import json
import urllib.error

url = "http://localhost:8000/chat"
data = json.dumps({"message": "Hello"}).encode("utf-8")
headers = {"Content-Type": "application/json"}

req = urllib.request.Request(url, data=data, headers=headers, method="POST")

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.status}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Error Response: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
