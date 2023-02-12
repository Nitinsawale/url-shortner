from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from counter_service import CounterService
from url_hash_service import Base62Helper
from mongoengine import *
from datetime import datetime
connect("url_shortner")

class Urls(Document):
    
    id  = LongField(primary_key = True)
    url_hash = StringField(required = True)
    url = StringField(required = True)
    timeStamp = DateTimeField(default = datetime.now())


counter = CounterService()
base62Converter = Base62Helper()


app = FastAPI()
@app.post("/short-url")
async def short_url(request:Request):
    data= await request.json()

    url = data['url']
    url_id = await counter.get_next_counter()
    url_hash = base62Converter.encode(url_id)

    
    obj = {"id":url_id, "url_hash":url_hash, "url":url}
    Urls(**obj).save()
    return JSONResponse({"short url":f'http://localhost:8000/{url_hash}'})


@app.get("/get-url/{url_hash}")
async def get_Url(url_hash):

    if Urls.objects(url_hash = url_hash).count() == 0:
        raise HTTPException(status_code=400, detail="invalid data")

    db_entry = Urls.objects(url_hash = url_hash).get()
    print(db_entry.id)
    return JSONResponse({"url":db_entry.url})