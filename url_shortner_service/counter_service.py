
import asyncio
import random

class CounterService:
    lock = ""
    counter = 1;
    def __init__(self):
        self.counter = 0;
        self.lock = asyncio.Lock();


    async def get_next_counter(self):
        async with self.lock:
            self.counter = self.counter + 1
        return self.counter
