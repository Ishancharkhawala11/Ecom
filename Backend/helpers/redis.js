const redis=require('redis')
require('dotenv').config()

const redisClient=redis.createClient(
    {
        url:process.env.REDIS_URL
    }
    
)
redisClient.on('error',(err)=>{
    console.log('redis connection err:',err)
})
redisClient.connect().then(() => console.log("Connected to Redis"))
.catch((err) => console.error("Redis connection failed:", err));
module.exports=redisClient