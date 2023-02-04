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


