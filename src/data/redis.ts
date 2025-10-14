import type { Question } from "../types";

export const redis: Question[] = [
  {
    id: "redis-1",
    track: "Redis",
    difficulty: 2,
    prompt:
      "Redis 为什么单线程仍然很快？说明其 IO 模型与核心数据结构的时间复杂度。",
    points: [
      "内存+紧凑编码（SDS、ziplist/listpack、intset 等）",
      "单线程避免上下文切换与锁开销；多路复用（epoll/kqueue）",
      "命令时间复杂度示例：HGET O(1), LRANGE O(n), ZRANGE by-score O(logN+M)",
      "避免系统调用次数（pipeline、RESP 简洁协议）",
    ],
    answer:
      "Redis 基于内存、单线程、事件驱动和高效数据结构。其多路复用避免阻塞，命令多为 O(1)/O(logN)。批量管道减少系统调用，使整体延迟极低。",
    tags: ["io多路复用", "数据结构", "复杂度"],
  },
  {
    id: "redis-2",
    track: "Redis",
    difficulty: 3,
    prompt: "谈谈缓存击穿、雪崩、穿透的区别与治理策略（结合生产落地手段）。",
    points: [
      "穿透：布隆过滤器/参数校验；",
      "击穿：热点 Key 互斥更新/逻辑过期+异步刷新；",
      "雪崩：随机过期、降级、限流、预热、分区多副本；",
    ],
    answer:
      "穿透：不存在的 key 导致回源；用布隆过滤器或参数校验。击穿：热点失效瞬间并发打爆；用互斥锁或逻辑过期。雪崩：大面积失效；随机化 TTL、限流和预热。",
    tags: ["稳定性", "限流降级", "布隆过滤器"],
  },
  {
    id: "redis-3",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 事务、Lua 与原子性的边界？举一个你做过的原子扣减方案。",
    points: [
      "MULTI/EXEC 非隔离；WATCH 乐观锁；Lua 原子执行；",
      "扣减库存：HINCRBY -1 + 校验库存>0",
    ],
    answer:
      "MULTI/EXEC 仅保证原子提交，Lua 可保证原子执行。扣减方案常用 Lua 校验库存>0 再扣减，失败返回错误码，防止超卖。",
    tags: ["Lua", "CAS", "一致性"],
  },
  {
    id: "redis-4",
    track: "Redis",
    difficulty: 4,
    prompt:
      "哨兵与集群（Cluster）的故障转移流程要点？客户端需要做什么以实现无感切换？",
    points: [
      "哨兵：主观/客观下线、投票切换；",
      "Cluster：槽迁移+MOVED/ASK 重定向；",
      "客户端：刷新槽位、重试退避、幂等",
    ],
    answer:
      "哨兵通过投票检测主挂，提升从库为主；Cluster 按槽分片，迁移时返回 MOVED/ASK。客户端需更新槽表、实现重连与幂等重放。",
    tags: ["高可用", "哨兵", "cluster"],
  },
  {
    id: "redis-5",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis RDB 与 AOF 的区别与混合持久化机制？",
    points: [
      "RDB：快照，启动快；AOF：追加日志，安全性高；",
      "混合持久化：RDB + 增量 AOF；",
      "AOF rewrite 降低文件膨胀",
    ],
    answer:
      "RDB 快速恢复但可能丢数据，AOF 实时但体积大。混合模式结合两者优点：RDB 提速，AOF 保证最后状态。",
    tags: ["持久化", "AOF", "RDB"],
  },
  {
    id: "redis-6",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 的内存淘汰策略有哪些？生产中如何选择？",
    points: [
      "noeviction / allkeys-lru / volatile-lru / allkeys-random 等",
      "业务：热点缓存建议 allkeys-lru，限时缓存用 volatile-lru",
      "需配合 maxmemory-policy + maxmemory 设置",
    ],
    answer:
      "Redis 有 8 种淘汰策略。一般推荐 allkeys-lru 或 volatile-lru，搭配合理内存上限与监控，避免频繁淘汰。",
    tags: ["LRU", "内存管理"],
  },
  {
    id: "redis-7",
    track: "Redis",
    difficulty: 4,
    prompt: "Redis 集群分片原理？hash slot 如何计算？迁移过程怎么保证一致性？",
    points: [
      "CRC16(key)%16384 确定槽；",
      "迁移：源节点标记 importing/migrating 状态；ASK 重定向",
      "客户端更新槽位映射",
    ],
    answer:
      "集群按 16384 槽分片，CRC16(key)%16384 决定槽。迁移时双标记并返回 ASK 重定向，客户端更新路由表保持一致。",
    tags: ["Cluster", "分片", "一致性"],
  },
  {
    id: "redis-8",
    track: "Redis",
    difficulty: 2,
    prompt: "Redis 中的字符串（SDS）与 C 字符串区别？",
    points: [
      "保存 len 与 free，支持二进制安全；",
      "避免重复计算长度；",
      "支持动态扩容与惰性释放",
    ],
    answer:
      "SDS 记录长度和未使用空间，能存二进制数据且扩展高效，避免 C 字符串 O(n) 操作和越界风险。",
    tags: ["SDS", "基础结构"],
  },
  {
    id: "redis-9",
    track: "Redis",
    difficulty: 3,
    prompt: "ZSet 的底层结构是什么？如何高效支持排名与范围查询？",
    points: [
      "跳表 + 哈希表组合；",
      "按 score 排序 O(logN)，随机访问 O(1)",
    ],
    answer:
      "ZSet 使用 skiplist + dict 双结构：跳表按 score 排序支持 range 操作，哈希表用于 O(1) 查找。",
    tags: ["跳表", "ZSet"],
  },
  {
    id: "redis-10",
    track: "Redis",
    difficulty: 2,
    prompt: "Redis 如何实现延迟队列？",
    points: [
      "ZSet 存 (timestamp, msg)",
      "轮询 ZRANGEBYSCORE 获取到期任务",
      "配合 Stream 或 Lua 实现可靠消费",
    ],
    answer:
      "用 ZSet 存任务时间戳，每次取 score<=now 的数据。可用 Lua 保证原子性，或用 Stream 消费确认机制。",
    tags: ["延迟队列", "ZSet"],
  },
  {
    id: "redis-11",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 分布式锁实现原理与缺陷？Redlock 是否可靠？",
    points: [
      "SET NX EX 原子锁；",
      "Redlock 跨节点取多数确认；",
      "时钟漂移问题、非严格 CAP 一致性",
    ],
    answer:
      "分布式锁基于 SET NX EX，Redlock 通过多数节点确认提高可靠性，但仍受时钟漂移影响，不保证强一致。",
    tags: ["分布式锁", "一致性"],
  },
  {
    id: "redis-12",
    track: "Redis",
    difficulty: 4,
    prompt: "Pipeline 与事务的区别？Pipeline 会丢原子性吗？",
    points: [
      "Pipeline 批量发送命令减少 RTT；",
      "事务保证命令原子执行但多次 IO；",
      "Pipeline 无原子性，仅提升性能",
    ],
    answer:
      "Pipeline 仅优化网络延迟，不保证原子性；事务则原子但延迟高。两者可结合使用。",
    tags: ["Pipeline", "事务"],
  },
  {
    id: "redis-13",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 过期键删除策略有哪些？为什么不用定时删除？",
    points: [
      "惰性删除+定期随机抽查",
      "避免大规模过期造成阻塞",
      "定时删除成本高",
    ],
    answer:
      "Redis 用惰性+定期随机删除平衡性能与内存。定时删除会占用 CPU 导致抖动。",
    tags: ["过期键", "内存管理"],
  },
  {
    id: "redis-14",
    track: "Redis",
    difficulty: 2,
    prompt: "Redis 为什么不推荐大 key？如何发现与治理？",
    points: [
      "阻塞线程、复制膨胀、迁移慢",
      "治理：拆分/压缩/scan 分析",
    ],
    answer:
      "大 key 会造成阻塞和网络延迟。可通过 `MEMORY USAGE`、`SCAN` 找出并拆分为多个小 key。",
    tags: ["性能优化", "大key"],
  },
  {
    id: "redis-15",
    track: "Redis",
    difficulty: 4,
    prompt: "Redis Stream 的消息确认与消费组机制？",
    points: [
      "XADD、XREADGROUP、XACK",
      "pending list 未确认消息",
      "可重试与 claim 机制",
    ],
    answer:
      "Stream 消费组支持多消费者，未确认消息在 pending list。通过 XACK 确认消费，XCLAIM 实现转移重试。",
    tags: ["Stream", "消息队列"],
  },
  {
    id: "redis-16",
    track: "Redis",
    difficulty: 3,
    prompt: "如何用 Redis 实现限流？",
    points: [
      "滑动窗口：ZSet 记录时间戳；",
      "固定窗口：INCR+EXPIRE；",
      "令牌桶：定期补充 token",
    ],
    answer:
      "滑动窗口最精确，用 ZADD 记录请求时间戳并 ZREMRANGEBYSCORE 清理过期，再判断计数。",
    tags: ["限流", "滑动窗口"],
  },
  {
    id: "redis-17",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 主从复制流程？PSYNC 作用是什么？",
    points: [
      "初次全量同步：RDB 传输；",
      "断线增量：PSYNC 偏移量 + replid",
    ],
    answer:
      "主从复制基于 PSYNC，断线后比对 offset 与 replid 进行增量续传，减少全量压力。",
    tags: ["复制", "PSYNC"],
  },
  {
    id: "redis-18",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 的内存碎片率高说明什么？如何排查？",
    points: [
      "内存分配器碎片、频繁分配释放；",
      "排查：INFO memory、MEMORY stats",
      "可重启、调整 jemalloc 参数",
    ],
    answer:
      "碎片率>1.5 常见于频繁写删场景。可定期重启或手动触发 `MEMORY PURGE` 减少浪费。",
    tags: ["内存优化"],
  },
  {
    id: "redis-19",
    track: "Redis",
    difficulty: 4,
    prompt: "Redis 脑裂如何发生？如何防止？",
    points: [
      "主节点与哨兵隔离导致双主；",
      "保护：min-replicas-to-write、集群多数写入策略",
    ],
    answer:
      "网络分区时主认为自己在线导致写入分叉。通过强制写入至少N副本和集群投票可防止数据不一致。",
    tags: ["脑裂", "高可用"],
  },
  {
    id: "redis-20",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 的慢查询日志如何配置与分析？",
    points: [
      "CONFIG set slowlog-log-slower-than N",
      "SLOWLOG get / len",
      "结合监控系统统计慢命令占比",
    ],
    answer:
      "设置阈值记录慢命令，结合命令统计与 QPS 监控发现热点与阻塞点。",
    tags: ["慢查询", "性能优化"],
  },
  {
    id: "redis-21",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 内部如何实现过期字典？",
    points: [
      "独立 dict 保存 key 与 expire 时间",
      "定期随机抽查 + 惰性触发",
    ],
    answer:
      "Redis 用过期字典存放 TTL，过期不立即清除，而是访问时惰性删除或定期随机抽查。",
    tags: ["过期机制"],
  },
  {
    id: "redis-22",
    track: "Redis",
    difficulty: 2,
    prompt: "Redis hash 在小数据量时使用何种结构？为什么？",
    points: [
      "ziplist/listpack 结构；节省内存",
      "达到阈值自动转为 hashtable",
    ],
    answer:
      "小 hash 用 ziplist/listpack 减少内存碎片；元素过多自动升级为哈希表提高性能。",
    tags: ["内存优化", "ziplist"],
  },
  {
    id: "redis-23",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis key 的命名规范与扫描策略？",
    points: [
      "分层命名 user:123:profile",
      "避免 keys * 命令，使用 scan 游标遍历",
    ],
    answer:
      "规范命名便于分组与迁移。禁止 `keys *`，用 `SCAN` 分批遍历防止阻塞。",
    tags: ["命名规范", "scan"],
  },
  {
    id: "redis-24",
    track: "Redis",
    difficulty: 4,
    prompt: "Redis 如何实现发布订阅？Stream 与 pub/sub 区别？",
    points: [
      "pub/sub 即时推送，无存储",
      "Stream 支持持久化与消费确认",
    ],
    answer:
      "pub/sub 无法回溯，Stream 支持历史消息与消费组，可替代 Kafka 轻量场景。",
    tags: ["pubsub", "Stream"],
  },
  {
    id: "redis-25",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 为什么不适合直接用作数据库？",
    points: [
      "内存成本高；",
      "无事务隔离；",
      "持久化与恢复成本高",
    ],
    answer:
      "Redis 偏向缓存场景，缺乏完整事务与查询语言，不适合高一致性持久存储。",
    tags: ["数据库", "限制"],
  },
  {
    id: "redis-26",
    track: "Redis",
    difficulty: 3,
    prompt: "Redis 如何解决缓存与数据库双写一致性问题？",
    points: [
      "延迟双删、Binlog异步补偿、消息队列同步",
    ],
    answer:
      "方案包括延迟双删（写DB后删缓存两次）或基于 Binlog 异步回调刷新缓存，保障最终一致。",
    tags: ["一致性", "缓存更新"],
  },
  {
    id: "redis-27",
    track: "Redis",
    difficulty: 4,
    prompt: "Redis 如何支持分布式计数器并防止并发丢失？",
    points: [
      "INCR/DECR 原子操作",
      "Cluster 模式需哈希标签如 {counter}",
    ],
    answer:
      "INCR/DECR 在单节点原子。分布式场景用哈希标签绑定同槽或 Lua 实现。",
    tags: ["计数器", "原子性"],
  },
  {
    id: "redis-28",
    track: "Redis",
    difficulty: 4,
    prompt: "Redis 内存达到上限时写命令会发生什么？",
    points: [
      "根据淘汰策略处理",
      "若 noeviction 报错",
    ],
    answer:
      "超过 maxmemory 时触发策略淘汰；若配置 noeviction，写操作报错。",
    tags: ["内存淘汰"],
  },
  {
    id: "redis-29",
    track: "Redis",
    difficulty: 5,
    prompt: "你如何在生产排查 Redis 延迟抖动？",
    points: [
      "INFO stats、latency doctor",
      "排查大key、慢查询、AOF rewrite",
      "使用监控图表与采样追踪",
    ],
    answer:
      "通过 latency doctor 检测延迟源，结合慢查询日志、大 key 分析与系统层 IO 观测定位问题。",
    tags: ["性能排查", "监控"],
  },
  {
    id: "redis-30",
    track: "Redis",
    difficulty: 5,
    prompt: "Redis cluster 如何实现强一致写入？",
    points: [
      "WAIT 命令等待复制确认",
      "结合 min-replicas-to-write",
    ],
    answer:
      "通过 WAIT 指令等待从节点确认，可在集群配置最小副本写入，近似实现强一致。",
    tags: ["一致性", "高可用"],
  },
];
