---
tags: [Web, Redis]
---

# Redis

## Redis Commands

### Basic Commands

- `SET key value`.
- `SET key value EX seconds`: set key with expire time.
- `SET key value NX`: only set key not exists.
- `DEL key`.
- `GET key`.
- `EXISTS key`.
- `KEYS pattern`: `KEYS *message*`.
- `EXPIRE key seconds`.
- `TTL key`: `-1` for no expire time.
- `FLUSHALL`.
- `FLUSHDB`.

### List Commands

- `LPUSH key element`: add head value.
- `RPUSH key element`: add tail value.
- `LPOP key [count]`: remove and return head value.
- `RPOP key [count]`: remove and return tail value.
- `LRANGE key start stop`: get elements.
- `LRANGE key 0 -1`: get all elements.
- `LTRIM key start stop`: trim list to range.
- `LLEN key`: get length.

### Set Commands

- `SADD key member`: add value.
- `SREM key member`: remove value.
- `SPOP key [count]`: remove and return random value.
- `SMEMBERS key`: get all values.
- `SRANDMEMBER key [count]`: get random value.
- `SISMEMBER key member`: check value.
- `SCARD key`: get length.

### SortedSet Commands

- `ZADD key score member`: add value with score.
- `ZREM key member`: remove value.
- `ZSCORE key member`: get score.
- `ZRANK key member`: get rank.
- `ZREVRANK key member`: get reverse rank.
- `ZRANGE key start stop`: get values.
- `ZRANGE key start stop WITHSCORES`: get values with scores.
- `ZCARD key`: get length.

### Hash Commands

- `HSET key field value`: set field and value.
- `HDEL key field`: delete field.
- `HGET key field`: get field value.
- `HKEYS key`: get all fields.
- `HVALS key`: get all values.
- `HGETALL key`: get all fields and values.
- `HEXISTS key field`: check field.
- `HLEN key`: get length.

### Pub/Sub Commands

- `SUBSCRIBE channel`: subscribe channel.
- `PUBLISH channel message`: publish message to channel.
- `UNSUBSCRIBE channel`: unsubscribe channel.

### Stream Commands

- `XADD key id field value`: add value.
- `XDEL key id`: delete value.
- `XRANGE key start end`: get values.
- `XRANGE key - +`: get all values.
- `XREAD COUNT count BLOCK milliseconds STREAMS key id`: read values.
- `XLEN key`: get length.

Stream group:

- `XGROUP CREATE key group id`: create group.
- `XGROUP CREATECONSUMER key group consumer`: create consumer.
- `XREADGROUP GROUP group consumer COUNT count BLOCK milliseconds STREAMS key id`: read values.
- `XINFO GROUPS key`: get groups info.

### Geospatial Commands

- `GEOADD key longitude latitude member`: add value.
- `GEOPOS key member`: get value.
- `GEODIST key member1 member2`: get distance.
- `GEOSEARCH key FROMMEMBER member BYRADIUS radius`: search by radius.
- `GEORADIUS key longitude latitude radius`: search by radius.
- `GEORADIUSBYMEMBER key member radius`: search by radius.

### HyperLogLog Commands

使用随机数来统计数量 (基数), 牺牲精度换取性能:

- `PFADD key element`: add value.
- `PFCOUNT key`: get count.
- `PFMERGE destkey [sourcekey [sourcekey ...]]`: merge.

### Bitmap Commands

- `SETBIT key offset value`: set value.
- `GETBIT key offset`: get value.
- `BITCOUNT key`: get count.
- `BITPOS key bit`: get first position.

```bash
> SET mykey "\xff\xf0\x00"
OK

> BITPOS mykey 0
(integer) 12
```

### Bitfield Commands

- `BITFIELD key SET type offset value`: set value.
- `BITFIELD key GET type offset`: get value.
- `BITFIELD key INCRBY type offset increment`: increment value.

```md
BITFIELD mystring SET i8 #0 100 SET i8 #1 200
BITFIELD mystring INCRBY i8 #0 10
```

### Transaction Commands

- `MULTI`: start transaction.
- `EXEC`: execute transaction.
- `DISCARD`: discard transaction.
- `WATCH key`: watch key.
- `UNWATCH`: unwatch key.

### Replication Commands

主从复制:

- `REPLICAOF NO ONE`: master instance.
- `REPLICAOF host port`: slave instance.
- `INFO`: get info.

```bash
> REPLICAOF NO ONE
"OK"

> REPLICAOF 127.0.0.1 6799
"OK"
```

### Sentinel Commands

```bash
> ROLE
1) "sentinel"
2) 1) "resque-master"
   2) "html-fragments-master"
   3) "stats-master"
   4) "metadata-master"
```
