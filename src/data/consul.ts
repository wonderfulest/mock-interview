import type { Question } from "../types";

export const consul: Question[] = [
  {
    id: "consul-1",
    track: "Consul",
    difficulty: 2,
    prompt: "Consul 的核心能力有哪些？Raft 在其中承担什么角色？",
    points: [
      "服务发现（Catalog）、健康检查（Health）、KV、ACL、Intentions、Connect/Service Mesh",
      "Raft 维护一致性状态（leader、日志复制、commit）",
    ],
    answer:
      "Consul 提供服务发现、健康检查、KV 存储、ACL、网格（Connect）。Raft 协议用于保持服务目录、KV 等核心状态在集群内的一致复制与容错。",
    tags: ["服务发现", "Raft", "ServiceMesh"],
  },
  {
    id: "consul-2",
    track: "Consul",
    difficulty: 3,
    prompt:
      "如何基于 Consul + Nginx/Envoy 做金丝雀发布与熔断限流？给出关键配置思路。",
    points: [
      "标签/权重注册、健康检查门槛",
      "Envoy/HAProxy 基于权重路由、熔断阈值、重试与超时",
      "回滚与观测指标：失败率、P99 延迟",
    ],
    answer:
      "通过将新老版本以不同权重注册到 Consul，网关（Nginx/Envoy）按权重分流，结合健康检查与熔断阈值控制放量；设置超时/重试与熔断开关，指标不达标自动回滚。",
    tags: ["金丝雀", "熔断", "Envoy"],
  },
  {
    id: "consul-3",
    track: "Consul",
    difficulty: 3,
    prompt: "Consul 与 Nacos/Etcd 的差异？在银行内网如何部署更稳妥？",
    points: [
      "CAP 取舍、生态组件、ACL 安全、跨机房联邦",
      "银行内网：多 DC、限制出网、审计、最小权限、备份与演练",
    ],
    answer:
      "Consul 强于 Catalog/Health 与 Service Mesh 能力，带 ACL 与多数据中心；Etcd 更偏 KV/配置；Nacos 侧重 Spring Cloud。银行环境建议多 DC、禁公网、TLS/ACL、审计与定期快照备份，并进行切主与灾备演练。",
    tags: ["对比", "安全", "多DC"],
  },
  {
    id: "consul-4",
    track: "Consul",
    difficulty: 2,
    prompt: "Consul 的服务注册是如何工作的？注册信息存储在哪？",
    points: [
      "Agent 本地维护注册缓存",
      "Server 端通过 Raft 持久化 Catalog",
    ],
    answer:
      "Consul Client 通过 HTTP API 注册服务信息（如名称、IP、端口、健康检查），Client 将注册请求上报给 Server，Server 通过 Raft 同步 Catalog 状态。",
    tags: ["注册机制", "Catalog"],
  },
  {
    id: "consul-5",
    track: "Consul",
    difficulty: 3,
    prompt: "Consul 的健康检查有哪些类型？检查结果如何影响服务发现？",
    points: [
      "类型：HTTP、TCP、TTL、自定义脚本",
      "检查失败则服务从查询结果中过滤掉",
    ],
    answer:
      "Consul 支持多种健康检查类型，Agent 定期执行检查并上报状态；当服务连续失败时，Server 将该实例标记为 critical，不再出现在 DNS 或 API 查询结果中。",
    tags: ["健康检查", "高可用"],
  },
  {
    id: "consul-6",
    track: "Consul",
    difficulty: 2,
    prompt: "Consul 的 KV 存储常见应用有哪些？与 Etcd KV 有何不同？",
    points: [
      "配置中心、Leader 选举、分布式锁",
      "一致性 vs 可用性、Raft 复制 vs MVCC",
    ],
    answer:
      "Consul KV 可用于轻量配置、Leader 选举、分布式锁，但不适合高频写；Etcd 使用 MVCC 结构支持版本化与事务，Consul KV 偏轻量、弱事务。",
    tags: ["KV存储", "分布式锁"],
  },
  {
    id: "consul-7",
    track: "Consul",
    difficulty: 4,
    prompt: "Consul 如何实现多数据中心联邦（WAN Federation）？",
    points: [
      "WAN gossip 通信、跨 DC 查询路由",
      "跨 DC ACL token、延迟与一致性权衡",
    ],
    answer:
      "多 DC 通过 WAN gossip 通信与 RPC 实现，每个 DC 独立的 Raft 集群；跨 DC 查询通过 Server proxy 转发。需配置 WAN 端口、ACL、TLS 证书。",
    tags: ["多数据中心", "WAN", "联邦"],
  },
  {
    id: "consul-8",
    track: "Consul",
    difficulty: 3,
    prompt: "Consul Connect 实现 Service Mesh 的关键机制是什么？",
    points: [
      "Sidecar 代理 + Intentions + mTLS",
      "证书由内置 CA 或 Vault 自动签发",
    ],
    answer:
      "Consul Connect 基于 sidecar 代理（Envoy）实现服务间零信任通信，通过 Intentions 控制访问策略，支持内置 CA 或与 Vault 集成自动签发证书。",
    tags: ["ServiceMesh", "安全", "mTLS"],
  },
  {
    id: "consul-9",
    track: "Consul",
    difficulty: 4,
    prompt: "Consul 的 Gossip 协议作用是什么？与 Raft 的关系？",
    points: [
      "Gossip 用于节点状态传播与健康检测",
      "Raft 用于一致性状态复制",
    ],
    answer:
      "Gossip 协议基于 SWIM 传播节点状态（alive、suspect、dead），维持 Agent 之间的 membership；Raft 仅用于 Server 集群一致性复制，两者互补。",
    tags: ["Gossip", "Raft", "一致性"],
  },
  {
    id: "consul-10",
    track: "Consul",
    difficulty: 2,
    prompt: "Consul 的 DNS 接口如何工作？适用于哪些场景？",
    points: [
      "通过 .consul 域名解析服务地址",
      "支持 round-robin 负载均衡",
    ],
    answer:
      "Consul 内置 DNS 服务（默认端口 8600），解析 `service.consul` 域名返回健康实例 IP；适合非 SDK 接入、传统服务发现。",
    tags: ["DNS", "服务发现"],
  },
  {
    id: "consul-11",
    track: "Consul",
    difficulty: 3,
    prompt: "Consul 的 ACL 模型是怎样的？常见安全实践有哪些？",
    points: [
      "Token、Policy、Role、Namespace",
      "最小权限原则、Root token 隔离、Token Rotation",
    ],
    answer:
      "Consul ACL 基于 RBAC 模型，token 绑定策略控制对 KV、Catalog、Session 等的访问。生产建议：禁用匿名访问、使用 namespace 隔离环境、启用 TLS 与 Token Rotation。",
    tags: ["ACL", "安全"],
  },
  {
    id: "consul-12",
    track: "Consul",
    difficulty: 4,
    prompt: "如何设计高可用的 Consul 集群拓扑？",
    points: [
      "3~5 个 Server、奇数节点 Raft 仲裁",
      "多个 Client 节点分布式注册",
    ],
    answer:
      "生产环境推荐 3~5 个 Server 形成 Raft 集群，保持奇数；Client 节点分布在各可用区；Server 间使用 TLS 与心跳检测，关键数据定期快照备份。",
    tags: ["高可用", "Raft"],
  },
  {
    id: "consul-13",
    track: "Consul",
    difficulty: 3,
    prompt: "Consul Template 的原理是什么？如何用于配置热更新？",
    points: [
      "监听 KV 变化事件",
      "模板渲染并触发 reload 脚本",
    ],
    answer:
      "Consul Template 监听 KV/Service 变化，动态渲染配置文件并执行自定义脚本（如 reload nginx）；常用于服务发现与配置热加载。",
    tags: ["配置中心", "自动化"],
  },
  {
    id: "consul-14",
    track: "Consul",
    difficulty: 3,
    prompt: "Consul Session 的机制是什么？如何用它实现分布式锁？",
    points: [
      "Session + KV 锁定机制",
      "TTL 过期自动释放",
    ],
    answer:
      "创建 Session 绑定客户端，使用 KV PUT 加锁；当 Session 断开或 TTL 超时锁自动释放，可避免死锁。",
    tags: ["Session", "分布式锁"],
  },
  {
    id: "consul-15",
    track: "Consul",
    difficulty: 4,
    prompt: "Consul 的性能优化手段有哪些？",
    points: [
      "Server 节点 SSD + 内网高带宽",
      "合理健康检查频率、使用缓存查询",
    ],
    answer:
      "优化手段包括：减小健康检查频率、防止 DNS 泄洪、Server 使用 SSD、开启 `cache` API 缓存、分层部署 Client 节点。",
    tags: ["性能", "优化"],
  },
  {
    id: "consul-16",
    track: "Consul",
    difficulty: 4,
    prompt: "Consul 如何与 Prometheus/Alertmanager 集成实现监控告警？",
    points: [
      "Export Metrics via /v1/agent/metrics",
      "Prometheus Job 发现、异常触发告警",
    ],
    answer:
      "Prometheus 可通过 Consul SD 自动发现服务；Consul 自身指标可通过 `/v1/agent/metrics` 暴露，结合 Alertmanager 设置告警规则。",
    tags: ["监控", "Prometheus"],
  },
  {
    id: "consul-17",
    track: "Consul",
    difficulty: 3,
    prompt: "在混合云/多集群环境中，Consul 如何保证一致性与隔离？",
    points: [
      "Namespace + ACL 控制",
      "Federation + WAN 加密",
    ],
    answer:
      "通过 Federation 联邦多集群，结合 Namespace 实现逻辑隔离；使用 TLS 加密、ACL 限权访问，避免跨环境污染。",
    tags: ["混合云", "隔离"],
  },
  {
    id: "consul-18",
    track: "Consul",
    difficulty: 3,
    prompt: "Consul 在微服务架构中的定位是什么？",
    points: [
      "服务注册发现中心",
      "与 API Gateway、Service Mesh 协同",
    ],
    answer:
      "Consul 是服务网格的控制面，负责注册发现、健康检查、流量控制；结合 Envoy 实现零信任与灰度控制。",
    tags: ["微服务", "服务网格"],
  },
  {
    id: "consul-19",
    track: "Consul",
    difficulty: 4,
    prompt: "Consul Raft 日志损坏或 Leader 失效如何修复？",
    points: [
      "使用 snapshot 进行恢复",
      "强制移除失效节点重新加入",
    ],
    answer:
      "通过 `consul operator raft list-peers` 查看状态，移除失效节点并从快照恢复；严重时可 `force-leave` 节点并重新引导选举。",
    tags: ["容灾", "Raft", "修复"],
  },
  {
    id: "consul-20",
    track: "Consul",
    difficulty: 5,
    prompt: "企业级 Consul 落地的安全加固 checklist 包括哪些？",
    points: [
      "TLS 双向认证、禁用匿名访问",
      "ACL + Namespace + Token Rotation",
      "快照备份、日志审计、系统最小化部署",
    ],
    answer:
      "企业级加固建议：启用 mTLS、ACL、Namespace；定期轮换 Token；限制管理端口、禁公网暴露；开启审计日志、快照备份与灾备演练。",
    tags: ["安全", "加固", "企业实践"],
  },
];
