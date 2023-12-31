from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from counter_service import CounterService
from url_hash_service import Base62Helper
from fastapi.middleware.cors import CORSMiddleware
from mongoengine import *
from datetime import datetime
import uuid
import json
from bson.json_util import dumps,loads
import qrcode
import io
import os
import base64

QR_IMAGE_PATH = "./QR_IMAGES/" 
if not os.path.exists(QR_IMAGE_PATH):
    os.mkdir(QR_IMAGE_PATH)

connect("url_shortner")
class Urls(Document):
    
    id  = LongField(primary_key = True)
    url_hash = StringField(required = True)
    url = StringField(required = True)
    timeStamp = DateTimeField(default = datetime.now())

class UrlAnalysis(Document):
    id = StringField(primary_key = True)
    url_hash = StringField(required = True)
    hits = IntField(default = 0)

class UrlQrCode(Document):
    id = StringField(primary_key = True, default = lambda: str(uuid.uuid4().hex))
    url_hash = StringField(required = True)
    image = StringField(required = True)

counter = CounterService()
base62Converter = Base62Helper()


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def generate_qr_image(url):
    img = qrcode.make(url)
    buffer = io.BytesIO()
    img.save(buffer, "PNG")
    image_in_str = base64.b64encode(buffer.getvalue()).decode("ascii")   
    return str(image_in_str)
    


@app.post("/short-url")
async def short_url(request:Request):
    data= await request.json()
    back_half = data.get("back_half",None)
    domain = data.get('domain', None)
    url = data['long_url']
    
    if back_half and Urls.objects(url_hash = back_half).count() == 1:
        raise HTTPException(status_code = 400, detail="back half not available")
    url_id = await counter.get_next_counter()
    url_hash = back_half
    if not back_half:
        url_hash = base62Converter.encode(url_id)
    obj = {"id":url_id, "url_hash":url_hash, "url":url}
    new_id = Urls(**obj).save().id
    UrlAnalysis(**{"url_hash":url_hash,"id":str(uuid.uuid4().hex)}).save()
    url = f'http://localhost:8001/{url_hash}'
    image_in_str = generate_qr_image(url)
    UrlQrCode(**{"url_hash":url_hash, "image":image_in_str}).save()
    return JSONResponse({"short url":f'http://localhost:8001/{url_hash}', 'qr_image':image_in_str})



@app.get("/get-dashboard-data")
async def get_dashboard_data():
    
    maxHits = UrlAnalysis.objects().order_by('-hits').limit(1).first().hits;
    totalUrls = Urls.objects.count()
    return JSONResponse({"maxHits":maxHits, "totalUrls":totalUrls})

@app.get("/update-hit/{url_hash}")
def update_hits(url_hash):
    try:
        UrlAnalysis.objects(url_hash = url_hash).update(inc__hits = 1)
    except:
        raise HTTPException(status_code = 400, detail="invalid url")
    

@app.get("/search-qr/{url_hash}")
async def update_hits(url_hash):
    qr_object = UrlQrCode.objects(url_hash =url_hash) 
    print(qr_object)
    if not qr_object:
        raise HTTPException(status_code = 400, detail="Invalid Url")
    
    image = qr_object[0].image
    return JSONResponse({"qr_image":image})