import type { Question } from "../types";

import type { Question } from "../types";

export const distributed: Question[] = [
  {
    id: "distributed-1",
    track: "分布式系统",
    difficulty: 1,
    prompt: "什么是 CAP 定理？请说明三个要素分别代表什么及其权衡关系。",
    points: [
      "C：Consistency，一致性（所有节点数据一致）",
      "A：Availability，可用性（每个请求都能得到响应）",
      "P：Partition tolerance，分区容错（网络分区时系统仍能工作）",
      "4️⃣ 在分区容错前提下，系统需在 C 与 A 之间取舍"
    ],
    answer:
      "CAP 定理指出分布式系统中无法同时满足一致性 C、可用性 A 和分区容错性 P。\n在真实网络环境中，分区容错 P 必须满足。\n因此系统在网络分区时必须在 C 与 A 中取舍：如 CP 模式（Zookeeper）强调一致性，AP 模式（Eureka）强调可用性。",
    tags: ["CAP", "一致性", "分区容错"]
  },
  {
    id: "distributed-2",
    track: "分布式系统",
    difficulty: 2,
    prompt: "请解释一致性模型中的强一致性、最终一致性和因果一致性的区别。",
    points: [
      "强一致性：更新后所有节点立即可见（线性化）",
      "最终一致性：短暂不一致，最终达到一致",
      "因果一致性：有因果关系的操作保持一致"
    ],
    answer:
      "强一致性要求所有节点视图一致，如同单机执行，延迟高。\n最终一致性允许短暂不一致，系统最终收敛，适合高可用场景。\n因果一致性介于两者之间，保持逻辑顺序但允许部分并发。",
    tags: ["一致性模型", "线性化", "最终一致性"]
  },
  {
    id: "distributed-3",
    track: "分布式系统",
    difficulty: 3,
    prompt: "Raft 共识算法如何保证分布式节点之间的一致性？",
    points: [
      "通过 Leader 选举保证写入唯一入口",
      "日志复制机制同步操作日志",
      "多数派提交原则确保安全提交",
      "4️⃣ 心跳维持 Leader 权威与集群稳定"
    ],
    answer:
      "Raft 通过选举产生 Leader 作为唯一写入者。\n所有写入先记录到 Leader 日志，再复制到多数节点。\n多数节点确认后日志提交，保证一致性。\n4️⃣ Leader 定期心跳维持集群状态。",
    tags: ["Raft", "共识算法", "日志复制"]
  },
  {
    id: "distributed-4",
    track: "分布式系统",
    difficulty: 3,
    prompt: "分布式事务的常见解决方案有哪些？请简述 2PC、TCC 与本地消息表的机制。",
    points: [
      "2PC：两阶段提交（prepare / commit）",
      "TCC：Try-Confirm-Cancel 补偿机制",
      "本地消息表：本地事务 + 异步消息"
    ],
    answer:
      "2PC 强一致但阻塞严重，协调者单点风险高。\nTCC 将事务拆为 Try/Confirm/Cancel 三阶段，支持业务补偿。\n本地消息表结合事务与异步消息队列，确保最终一致性。",
    tags: ["分布式事务", "2PC", "TCC"]
  },
  {
    id: "distributed-5",
    track: "分布式系统",
    difficulty: 2,
    prompt: "Zookeeper 在分布式系统中主要起什么作用？",
    points: [
      "提供分布式协调与命名服务",
      "支持 Leader 选举、分布式锁、注册中心",
      "基于 Zab 协议保证强一致性"
    ],
    answer:
      "Zookeeper 提供分布式协调与配置管理功能。\n常用于 Leader 选举、分布式锁、服务注册。\n其 Zab 协议保证强一致性，适合 CP 模式系统。",
    tags: ["Zookeeper", "Zab", "分布式协调"]
  },
  {
    id: "distributed-6",
    track: "分布式系统",
    difficulty: 2,
    prompt: "分布式锁常见的实现方式有哪些？各自优缺点是什么？",
    points: [
      "Redis 锁（SET NX EX + Lua 脚本）",
      "Zookeeper 锁（临时顺序节点）",
      "数据库锁（唯一索引插入）"
    ],
    answer:
      "Redis 实现简单性能高，但容错弱。\nZookeeper 可靠性强但开销大。\n数据库锁实现方便但性能差，适合小规模系统。\n4️⃣ 常见优化方案：Redlock 或基于 Zookeeper 的锁。",
    tags: ["分布式锁", "Redis", "Zookeeper"]
  },
  {
    id: "distributed-7",
    track: "分布式系统",
    difficulty: 3,
    prompt: "谈谈微服务架构中的服务注册与发现机制。",
    points: [
      "注册中心保存服务实例信息",
      "服务启动时注册、停止时下线",
      "客户端或网关通过注册中心发现目标服务"
    ],
    answer:
      "注册中心（如 Eureka、Consul、Nacos）负责维护服务实例。\n服务启动注册，宕机或下线时自动移除。\n调用方可主动发现（客户端模式）或通过网关路由（服务端模式）。",
    tags: ["服务注册", "服务发现", "Eureka", "Consul"]
  },
  {
    id: "distributed-8",
    track: "分布式系统",
    difficulty: 2,
    prompt: "负载均衡有哪些常见算法？各自的适用场景是什么？",
    points: [
      "轮询（Round Robin）",
      "加权轮询（Weighted RR）",
      "一致性哈希（Consistent Hashing）",
      "4️⃣ 最小连接数（Least Connections）"
    ],
    answer:
      "轮询：简单高效，适合无状态服务。\n加权轮询：适合节点性能差异场景。\n一致性哈希：适合状态保持或缓存服务。\n4️⃣ 最小连接：适合长连接或高负载差异的服务。",
    tags: ["负载均衡", "一致性哈希"]
  },
  {
    id: "distributed-9",
    track: "分布式系统",
    difficulty: 3,
    prompt: "什么是一致性哈希？它如何解决节点增减带来的缓存失效问题？",
    points: [
      "节点映射到哈希环",
      "数据通过哈希定位到最近节点",
      "节点增减仅影响局部数据"
    ],
    answer:
      "一致性哈希将节点与数据映射到环形空间。\n数据分配依据哈希值的顺时针邻近节点。\n当节点变化时，仅迁移相邻部分数据，减少缓存失效。",
    tags: ["一致性哈希", "缓存", "扩展性"]
  },
  {
    id: "distributed-10",
    track: "分布式系统",
    difficulty: 4,
    prompt: "在消息队列系统中，如何保证消息的『不丢失、不重复、按顺序』？",
    points: [
      "不丢失：持久化 + ACK 机制",
      "不重复：幂等性 + 去重表",
      "顺序：分区键 + 单线程消费"
    ],
    answer:
      "通过磁盘持久化与 ACK 机制防止消息丢失。\n通过幂等逻辑、唯一键或去重表防止重复消费。\nKafka 等系统通过分区键与顺序消费模型保证顺序性。",
    tags: ["消息队列", "幂等性", "顺序消费"]
  },
  {
    id: "distributed-11",
    track: "分布式系统",
    difficulty: 4,
    prompt: "什么是 Gossip 协议？它如何保证节点状态的传播一致？",
    points: [
      "节点周期性随机选取目标节点交换状态",
      "通过类似病毒传播的方式实现最终一致",
      "具备去中心化与高容错特性"
    ],
    answer:
      "Gossip 协议模仿流行病传播机制，节点随机选择其他节点同步状态，逐步使全网收敛至一致状态。广泛用于 Consul、Cassandra 等系统中。",
    tags: ["Gossip", "一致性传播", "去中心化"]
  },
  {
    id: "distributed-12",
    track: "分布式系统",
    difficulty: 3,
    prompt: "请说明幂等性在分布式系统中的重要性，以及常见实现方式。",
    points: [
      "幂等性保证重复请求不会引发副作用",
      "实现方式包括唯一请求 ID、幂等表、版本号控制",
      "结合 MQ、重试机制使用"
    ],
    answer:
      "幂等性是分布式系统高可用与重试机制的基础。通过唯一请求 ID 或业务幂等键防止重复执行，常与消息补偿、重试机制配合使用。",
    tags: ["幂等性", "重试", "分布式安全"]
  },
  {
    id: "distributed-13",
    track: "分布式系统",
    difficulty: 4,
    prompt: "分布式缓存一致性问题如何解决？",
    points: [
      "缓存淘汰策略 + 数据过期机制",
      "写穿/写回/延迟双删策略",
      "订阅数据库变更（CDC）实现同步"
    ],
    answer:
      "可通过延迟双删或消息通知机制保持缓存一致；高端方案如基于 CDC（Change Data Capture）监听数据库变更同步缓存。",
    tags: ["缓存一致性", "CDC", "延迟双删"]
  },
  {
    id: "distributed-14",
    track: "分布式系统",
    difficulty: 4,
    prompt: "在分布式系统中如何实现全局唯一 ID？雪花算法的原理是什么？",
    points: [
      "全局唯一 ID 保证不同节点生成不冲突 ID",
      "雪花算法：时间戳 + 机器号 + 序列号",
      "可通过 Redis、自增表或号段模式生成"
    ],
    answer:
      "雪花算法以时间戳为高位，结合机器标识与自增序列生成 64 位唯一 ID，具备趋势递增与高性能特征，常用于高并发场景。",
    tags: ["雪花算法", "唯一ID", "高并发"]
  },
  {
    id: "distributed-15",
    track: "分布式系统",
    difficulty: 3,
    prompt: "分布式限流的常见实现方式有哪些？",
    points: [
      "本地限流：令牌桶、漏桶算法",
      "分布式限流：Redis + Lua 脚本或滑动窗口计数",
      "借助网关层实现全局限流（如 Nginx、Envoy）"
    ],
    answer:
      "分布式限流可通过 Redis 实现集中计数控制；令牌桶适合突发流量，漏桶适合稳定速率控制。云原生架构中常通过网关插件统一限流。",
    tags: ["限流", "令牌桶", "Redis"]
  },
  {
    id: "distributed-16",
    track: "分布式系统",
    difficulty: 5,
    prompt: "跨机房部署如何解决数据同步与延迟一致性问题？",
    points: [
      "主从复制 + 异步同步机制",
      "引入多活架构与冲突解决策略",
      "通过异步事件总线或中间件（如 Kafka）解耦"
    ],
    answer:
      "跨机房系统需在一致性与可用性间权衡。常采用多活架构 + 异步事件同步，通过幂等机制与版本冲突解决策略实现最终一致。",
    tags: ["跨机房", "多活架构", "延迟一致性"]
  },
  {
    id: "distributed-17",
    track: "分布式系统",
    difficulty: 4,
    prompt: "Paxos 与 Raft 的主要区别是什么？",
    points: [
      "Raft 简化了 Paxos 的实现，角色更明确（Leader/Follower/Candidate）",
      "Raft 增加日志复制与快照机制，工程实现更友好",
      "Paxos 理论完整但复杂，Raft 实用性更强"
    ],
    answer:
      "Paxos 是理论共识算法，Raft 则是工程化优化版。Raft 提供更易理解的状态机复制过程，并被广泛用于 etcd、Consul 等项目。",
    tags: ["Paxos", "Raft", "共识算法"]
  },
  {
    id: "distributed-18",
    track: "分布式系统",
    difficulty: 5,
    prompt: "分布式快照算法（Chandy-Lamport）如何工作？",
    points: [
      "用于一致性检查点（Checkpoint）捕获系统全局状态",
      "节点收到标记消息后记录自身状态与通道消息",
      "最终汇总形成全局一致快照"
    ],
    answer:
      "Chandy-Lamport 算法通过标记消息让每个节点在收到标记后记录本地状态及通道未处理消息，从而形成全局一致的系统快照，用于容错与恢复。",
    tags: ["快照算法", "Chandy-Lamport", "一致性检查点"]
  },
  {
    id: "distributed-19",
    track: "分布式系统",
    difficulty: 3,
    prompt: "分布式系统中如何检测节点故障？",
    points: [
      "心跳检测 + 超时判断（如 Ping/Pong）",
      "Gossip 协议传播节点状态",
      "引入 Phi Accrual Failure Detector 动态阈值判断"
    ],
    answer:
      "常见机制为心跳检测配合超时控制，Gossip 协议提高去中心化；Phi 检测器可自适应网络延迟，广泛用于 Cassandra、Akka 等系统。",
    tags: ["故障检测", "Gossip", "Phi Accrual"]
  },
  {
    id: "distributed-20",
    track: "分布式系统",
    difficulty: 5,
    prompt: "谈谈你在实际项目中如何保证分布式系统的可观测性（Observability）。",
    points: [
      "埋点追踪：TraceId + SpanId 构建调用链（OpenTelemetry）",
      "指标监控：Prometheus + Grafana",
      "日志收集：ELK / Loki / Fluentd，统一上下文"
    ],
    answer:
      "可观测性通过『三板斧』实现：日志、指标、链路。利用 TraceId 贯穿请求上下文，结合 Prometheus/Grafana 实现指标监控与告警，ELK 提供全链路排障能力。",
    tags: ["可观测性", "OpenTelemetry", "监控"]
  }
];
