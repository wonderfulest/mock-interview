import type { Question } from "../types";

export const trace: Question[] = [
  {
    id: "trace-1",
    track: "链路追踪",
    difficulty: 2,
    prompt: "分布式追踪的三要素/核心字段有哪些？请结合一次实际排障说明价值。",
    points: [
      "traceId, spanId, parentId, baggage/attributes, timing",
      "可视化调用树与瓶颈定位",
    ],
    answer:
      "核心是 traceId、spanId、parentId 形成调用树，配合 tags/attributes 与时间戳。一次排障中，通过数据库 span 的 P99 飙升定位到索引失效，修复后链路恢复正常。",
    tags: ["OpenTelemetry", "可观测性"],
  },
  {
    id: "trace-2",
    track: "链路追踪",
    difficulty: 3,
    prompt:
      "Instana 与 Softrace 有何主要差异？从采集方式、开销、可视化与告警能力拆解。",
    points: [
      "探针类型：自动/半自动注入；",
      "采样：自适应/固定；",
      "开销与采集粒度；",
      "与日志/指标整合、告警规则与根因分析视图",
    ],
    answer:
      "Instana 倾向于自动探针与自适应采样，UI 具强关联拓扑与根因分析；Softrace 更轻量/可插拔，采集粒度与采样策略可定制。二者在 APM 生态集成、Agent 部署与商业能力上也有差异，需结合落地环境评估。",
    tags: ["Instana", "Softrace", "APM对比"],
  },
  {
    id: "trace-3",
    track: "链路追踪",
    difficulty: 3,
    prompt: "Explain OpenTelemetry 的核心组件结构（SDK、Collector、Exporter）及其工作流。",
    points: [
      "SDK 负责生成 Trace 数据并上报；",
      "Collector 提供聚合与二次处理；",
      "Exporter 将数据输出到后端（如 Jaeger、Tempo、Softrace）",
    ],
    answer:
      "OpenTelemetry 包含 API + SDK + Collector。应用通过 SDK 生成 span，Collector 负责统一接收、聚合、采样与导出，可接入多种 APM 后端，是现代追踪标准化核心。",
    tags: ["OpenTelemetry", "Collector"],
  },
  {
    id: "trace-4",
    track: "链路追踪",
    difficulty: 4,
    prompt: "谈谈分布式追踪中的采样策略（head-based vs tail-based）及其适用场景。",
    points: [
      "Head-based: 在请求进入时决定是否采样；",
      "Tail-based: 依据完整请求结果做采样决策；",
      "性能与精准度权衡",
    ],
    answer:
      "Head-based 轻量但可能错过异常请求；Tail-based 成本高但能聚焦慢链路与错误链路。生产环境常用混合策略：服务入口 head-based + Collector 端 tail-based。",
    tags: ["采样策略", "性能优化"],
  },
  {
    id: "trace-5",
    track: "链路追踪",
    difficulty: 3,
    prompt: "在跨语言调用（如 Java → Python → Go）时如何保持 Trace 上下文？",
    points: [
      "W3C Trace Context 规范；",
      "HTTP headers: traceparent, tracestate；",
      "语言 SDK 之间 context 传递与解析",
    ],
    answer:
      "不同语言的 SDK 遵循 W3C Trace Context 标准，通过 traceparent/tracestate 头传递 traceId/spanId，Collector 聚合后仍能形成完整调用链。",
    tags: ["跨语言", "Trace Context"],
  },
  {
    id: "trace-6",
    track: "链路追踪",
    difficulty: 4,
    prompt: "一次慢请求排障中，如何结合 Trace + Metrics + Logs 实现三位一体分析？",
    points: [
      "Trace 定位慢节点；Metrics 提供系统健康度；",
      "Logs 对应具体异常信息",
      "TraceID 贯穿三者建立关联"
    ],
    answer:
      "可从 Trace 中发现 DB span P95 超时，结合 Metrics 验证连接池饱和，再通过 traceId 对应的日志查到 SQL 参数。三者结合构成完整根因分析链路。",
    tags: ["三位一体", "可观测性", "Root Cause"],
  },
  {
    id: "trace-7",
    track: "链路追踪",
    difficulty: 2,
    prompt: "TraceID 与 SpanID 的区别是什么？为何需要 ParentID？",
    points: [
      "traceId：整条链唯一标识；",
      "spanId：单个调用片段标识；",
      "parentId：形成调用树层级结构"
    ],
    answer:
      "traceId 标识整个调用链；spanId 代表当前服务调用；parentId 指向上层调用形成树。结合时间信息后可绘制完整拓扑。",
    tags: ["Trace结构", "调用树"],
  },
  {
    id: "trace-8",
    track: "链路追踪",
    difficulty: 3,
    prompt: "追踪系统在高 QPS 服务下可能带来哪些性能问题？如何优化？",
    points: [
      "高采样率带来 CPU/IO 压力；",
      "Collector 吞吐瓶颈；",
      "Agent 阻塞主线程",
      "优化：异步上报、批量压缩、采样策略调整"
    ],
    answer:
      "Trace 写入或导出若为同步会阻塞业务线程；常用异步批量上报 + 轻量 JSON/Binary 编码；Collector 层通过分片、限流与 Tail Sampling 控制成本。",
    tags: ["性能优化", "采样策略"],
  },
  {
    id: "trace-9",
    track: "链路追踪",
    difficulty: 3,
    prompt: "链路追踪系统如何与告警体系集成实现自动化根因定位？",
    points: [
      "基于 Trace 属性生成告警上下文；",
      "Trace + Error Ratio + Latency 指标联合触发；",
      "Root Cause Grouping 自动归类",
    ],
    answer:
      "通过 Trace 聚合错误 span，结合指标系统的异常检测触发告警，附带 Trace 链接与关键标签（如 service.name、operation.name）实现快速根因定位。",
    tags: ["RootCause", "告警联动"],
  },
  {
    id: "trace-10",
    track: "链路追踪",
    difficulty: 4,
    prompt: "请简述一次你在真实项目中落地链路追踪的经验，包括接入、调优与收益。",
    points: [
      "接入方式：SDK + Collector；",
      "核心挑战：上下文丢失与性能影响；",
      "收益：快速定位性能瓶颈与异常链路",
    ],
    answer:
      "在 BFF 层引入 OpenTelemetry SDK，通过 HTTP header 传递 traceId；Collector 统一导出至 Tempo。初期遇到异步任务 trace 丢失问题，通过 context propagate 修复后，性能问题平均定位时间缩短 70%。",
    tags: ["落地经验", "实战案例"],
  },
  {
    id: "trace-11",
    track: "链路追踪",
    difficulty: 4,
    prompt: "Instana Agent / Collector 的探针原理是什么？它是如何自动检测应用服务的？",
    points: [
      "自动探针（auto-instrumentation）机制",
      "字节码增强 / 代理插桩 / 动态加载 agent",
      "心跳 / 发现服务 / 拓扑生成",
    ],
    answer: "Instana 的 Agent 会在运行时以探针形式注入到 JVM / 进程中，通过字节码增强或动态代理拦截关键库（如 HTTP 客户端、数据库、RPC 框架）的调用，并收集 span 数据；同时 Agent 会发送心跳与服务元数据，Instana 后端构建自动拓扑和服务依赖图。",
    tags: ["Instana Agent", "自动探针", "字节码增强"],
  },
  {
    id: "trace-12",
    track: "链路追踪",
    difficulty: 4,
    prompt: "SofaTracer（或 SOFATracer）如何在 SOFAStack / 微服务框架中接入？它的原理和优点是什么？",
    points: [
      "SOFATracer 的 SPI / 插件机制",
      "与 RPC 框架（Bolt / SofaRPC / HTTP）整合",
      "上下文传播（Context Propagation）",
      "低侵入、可配置采样、兼容 OpenTracing/OTLP",
    ],
    answer: "SOFATracer 是基于 SOFAStack 生态设计的链路追踪库，通常通过 SPI 插件或拦截器形式注入至 RPC/HTTP 层。当请求进入、退出 RPC 或 HTTP 时，SOFATracer 会创建 span、注入 trace context 到上下游。它支持可配置采样、标签注入、与 OpenTracing / OpenTelemetry 兼容能力，适用于 SOFA 体系内服务链追踪。",
    tags: ["SOFATracer", "SOFAStack", "上下文传播"],
  },
  {
    id: "trace-13",
    track: "链路追踪",
    difficulty: 5,
    prompt: "Instana 的自适应采样（Adaptive Sampling）算法如何工作？有什么优劣势？",
    points: [
      "动态采样率调整机制",
      "对慢 span / 错误 span 的优先保留",
      "控制开销与覆盖异常链路的权衡",
    ],
    answer: "Instana 的自适应采样通过监控各条链路的延迟、错误率、流量分布，在运行时调整采样比率。正常链路可能被降采样，而异常或高延迟链路则有更高概率被采样。优势是资源利用效率高、覆盖关键链路；劣势是可能丢失部分低频异常链路，需要策略调优。",
    tags: ["采样策略", "Adaptive Sampling", "Instana"],
  },
  {
    id: "trace-14",
    track: "链路追踪",
    difficulty: 5,
    prompt: "若你同时接入了 Instana 和 SOFATracer，两者数据如何统一融合？如何避免重复采集与冲突？",
    points: [
      "探针冲突问题（重复拦截）",
      "TraceContext 互通",
      "选择主系统 / 控制采样边界",
      "数据去重 / 合并规则",
    ],
    answer: "在一个服务中同时引入 Instana Agent 和 SOFATracer 时，需避免两者重复拦截同一调用（如 HTTP、RPC），可以让其中一个不对某些接口做探针或关闭默认拦截。TraceContext（traceparent/tracestate）需统一标准，保证上下游传递一致。后端在消费 Trace 数据时也要支持去重与融合，如以 traceId + spanId 作为联合 key，合并 span 属性或选择权重高的属性。",
    tags: ["探针融合", "冲突处理", "去重"],
  },
  {
    id: "trace-15",
    track: "链路追踪",
    difficulty: 4,
    prompt: "假设 SOFATracer 在微服务中报告的 span 数量远超过预期（出现“爆 span”），你如何排查这个问题？",
    points: [
      "确定哪些 span 被重复生成（拦截器重入／循环调用）",
      "检查 Filter / 拦截器链配置是否重复注入",
      "查看入口 / 出口 RPC 调用是否拆分太细",
      "采样配置是否异常",
    ],
    answer: "首先查日志/Trace 后端看是哪些 service.operation 产生了爆 span；再在代码层级看是否 Filter 或拦截器被多次注册；检查是否异步回调 / Future 回调时重复创建 span；查看是否将非常细粒度操作（如每次 DB 行）都做了 span 而不是批次；最后检查采样策略配置是否误设为高采样率。",
    tags: ["排查", "爆 span", "SOFATracer"],
  },
  {
    id: "trace-16",
    track: "链路追踪",
    difficulty: 5,
    prompt: "Instana 中如何实现根因分析（Root Cause Analysis）？Trace 数据如何用于自动展开根因链？",
    points: [
      "基于拓扑与因果图分析",
      "异常 span 聚合 / 分组",
      "上下游服务异常传播路径分析",
      "置信度 / 规则引擎",
    ],
    answer: "Instana 的根因分析依赖其自动生成的依赖拓扑与因果链模型。当某个服务或链路出现异常时，系统会沿调用图向上或向下遍历，根据延迟、错误比率、调用频度等指标判断最可能的异常源。Trace 数据提供 span-level 的时序与标签信息，可以聚合异常 span、标识热点服务，并生成可视化根因路径（例如：服务 A 调用 B 时出现时延上升，B 再调用 C 等）。",
    tags: ["根因分析", "Instana", "因果图"],
  },
  {
    id: "trace-17",
    track: "链路追踪",
    difficulty: 4,
    prompt: "在高并发场景下，Instana Agent 本地收集与传输压力如何缓解？",
    points: [
      "本地缓存 / 批量上报 / back-pressure 控制",
      "压缩 / 二进制协议 / 较低采样率",
      "限流、衰减、优先级队列",
    ],
    answer: "Instana Agent 在本地引入缓冲队列、批量打包以及压缩（或二进制格式）发送机制，以减少网络开销；当队列积压严重时，会启动背压策略（拒绝新 span、降采样）或延迟发送；在探针层面可设置优先级，对关键链路保留、对普通链路降采样；此外 agent 本身应异步执行、不阻塞业务线程。",
    tags: ["Agent 优化", "背压控制", "高并发"],
  },
  {
    id: "trace-18",
    track: "链路追踪",
    difficulty: 5,
    prompt: "请设计一个在 SOFATracer 中支持 tail-based 采样 + 异常追踪保留 的方案。说明你会如何在 Collector / 中间层做过滤与抽样决策。",
    points: [
      "入口 head-based 采样以控制流量",
      "Collector 端收集所有 span 或部分摘要",
      "使用 tail-based 逻辑判断高延迟 / 错误链路",
      "对选中链路重新降采样或完整保留",
    ],
    answer: "可以在服务入口做 head-based 采样（保留大致 1–5% trace），同时对每条链路记录摘要统计（如最大延迟、错误标记）并发送到 Collector。Collector 接收到摘要后，对延迟高或有错误标记的 trace 进行升级（保留全部 span），对其他 trace 做降采样或丢弃。SOFATracer Agent 需要支持上下文标记，允许在服务端做重新追踪决策。",
    tags: ["tail sampling", "SOFATracer", "采样升级"],
  },
  {
    id: "trace-19",
    track: "链路追踪",
    difficulty: 5,
    prompt: "你如何对比 Instana 与 SOFATracer 在 APM 体系中的优劣？请从技术架构、运营成本、可扩展性、开源/闭源、社区生态等多个维度分析。",
    points: [
      "Instana：商用 APM，自动探针、根因分析、可视化、告警能力强",
      "SOFATracer：偏开源 / 轻量、可定制、适合集成 SOFA 生态",
      "成本：Agent 授权 / 监控成本 vs 自运营成本",
      "可扩展：探针插入、Collector 多租户 / 多源扩展能力",
      "社区与生态：OpenTelemetry 兼容性、社区活跃度",
    ],
    answer: "在技术架构上，Instana 提供一体化 Agent + 后端 + 可视化平台，适用于快速部署与使用；SOFATracer 是轻量追踪 SDK，可灵活定制与扩展。运营成本方面，Instana 为商业产品，需购买许可；SOFATracer 自主部署成本低但需要运维投入。在可扩展性方面，Instana 后端需要横向扩展、分片设计；SOFATracer 可插入多种后端（如 OpenTelemetry Collector）。开源 / 闭源方面，SOFATracer 属于开源或内部组件，更开放；Instana 属于商业闭源，社区生态较弱。综合来看，两者可根据团队规模与预算混合使用。",
    tags: ["产品对比", "APM 战略", "技术选型"],
  },
  {
    id: "trace-20",
    track: "链路追踪",
    difficulty: 5,
    prompt: "在 SOFAStack 中，如何将链路追踪 (SOFATracer) 与监控指标系统（如 Prometheus / 阿里云监控）和日志系统整合，实现统一可观测性平台？",
    points: [
      "在每个 Trace span 上自动采集指标（如时延、调用次数）",
      "通过 traceId / spanId 将日志与 trace 关联（日志中注入 traceId）",
      "统一接入后端（如 OpenTelemetry Collector）做合并转发",
      "在监控系统中以 trace 补充指标告警 / 快速钻取能力",
    ],
    answer: "在 SOFATracer 拦截点上可自动记录调用次数、时延、错误率等指标，并暴露给监控系统（如通过 Prometheus Exporter）。同时，在日志库（如 Log4j / SLF4J）中注入 traceId、spanId，使得日志可按 traceId 关联回来。将 SOFATracer 与 OpenTelemetry Collector 集成，将 trace / metrics / logs 汇总进统一后端（如 Grafana Tempo + Prometheus + Loki）。在监控系统中，可在指标异常触发告警后钻取到对应 trace，从而实现一体化平台。",
    tags: ["可观测性整合", "日志 + 指标 + Trace", "平台设计"],
  }
];
