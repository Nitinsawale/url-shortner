from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from mongoengine import *
from datetime import datetime
import threading
import requests
connect("url_shortner")




class Urls(Document):
    
    id  = LongField(primary_key = True)
    url_hash = StringField(required = True)
    url = StringField(required = True)
    timeStamp = DateTimeField(default = datetime.now())



app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def call_hit_api(url_hash):
    requests.get(f"http://localhost:8000/update-hit/{url_hash}")
    print('request done')
  
def fire_and_forget(url_hash):
    threading.Thread(target=call_hit_api, args=(url_hash)).start()

@app.get("/{url_hash}")
async def get_Url(url_hash, background_tasks:BackgroundTasks):

    if Urls.objects(url_hash = url_hash).count() == 0:
        raise HTTPException(status_code=400, detail="invalid URL")
    db_entry = Urls.objects(url_hash = url_hash).get()
    # call_hit_api(url_hash)
    background_tasks.add_task(call_hit_api, url_hash)
    print("called")
    return RedirectResponse(db_entry.url)