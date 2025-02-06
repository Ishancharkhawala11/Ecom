const redis=require('redis')

const redisClient=redis.createClient(
    {
        url:'rediss://red-ctudhfa3esus739b41m0:r4Sog2UwNox8Xg0E4YEsQkE8QetYBiaQ@oregon-redis.render.com:6379'
    }
    
)
redisClient.on('error',(err)=>{
    console.log('redis connection err:',err)
})
redisClient.connect().then(() => console.log("Connected to Redis"))
.catch((err) => console.error("Redis connection failed:", err));
module.exports=redisClient