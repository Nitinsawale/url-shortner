
class Base62Helper:

    base62 = list("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")

    def __init__(self):
        print("Helle")

    def encode(self, number):
        result = []
        while(number > 0):
        
            result.insert(0, self.base62[number % 62])
            number = number // 62

        return "".join(result)
    

    def decode(self, hash:str):
        number = 0
        
        for c, ind in hash.split(""):
            
            number = number + self.base62.index(c) * (62 ** ind)
        return number