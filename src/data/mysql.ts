import type { Question } from "../types";

export const mysql: Question[] = [
  {
    id: "mysql-1",
    track: "MySQL",
    difficulty: 2,
    prompt: "MySQL 索引的底层结构是什么？为什么 InnoDB 使用 B+Tree 而不是 Hash 或 B-Tree？",
    points: [
      "B+Tree 节点存储范围有序，可支持范围查询与排序",
      "叶子节点链表结构提高范围扫描效率",
      "Hash 仅适合等值查询；B-Tree 范围效率低、磁盘局部性差",
    ],
    answer:
      "InnoDB 的索引采用 B+Tree，支持高效范围扫描、排序与磁盘页缓存友好。Hash 索引仅适合等值查询，不支持范围；B-Tree 范围性能差。",
    tags: ["索引结构", "B+Tree", "存储引擎"]
  },
  {
    id: "mysql-2",
    track: "MySQL",
    difficulty: 3,
    prompt: "谈谈聚簇索引与非聚簇索引的区别，以及回表查询的过程。",
    points: [
      "聚簇索引：数据行与索引存放在一起（主键索引）",
      "非聚簇索引：仅存主键指针，需二次查找",
      "二级索引查询流程：先定位主键，再回表查数据页",
    ],
    answer:
      "InnoDB 的聚簇索引以主键为顺序组织数据；二级索引只存主键值，因此 SELECT 需先查二级索引再回表查主键页，称为回表。",
    tags: ["聚簇索引", "回表", "InnoDB"]
  },
  {
    id: "mysql-3",
    track: "MySQL",
    difficulty: 3,
    prompt: "MySQL 中的事务隔离级别有哪些？各级别会出现哪些并发问题？",
    points: [
      "四种隔离级别：读未提交、读已提交、可重复读、串行化",
      "并发问题：脏读、不可重复读、幻读",
      "InnoDB 默认可重复读，利用 MVCC 避免幻读",
    ],
    answer:
      "MySQL 支持 4 种隔离级别：READ UNCOMMITTED、READ COMMITTED、REPEATABLE READ、SERIALIZABLE。默认可重复读，利用 MVCC 版本链防止脏读与幻读。",
    tags: ["事务", "隔离级别", "MVCC"]
  },
  {
    id: "mysql-migrate-1",
    track: "MySQL-洗库",
    difficulty: 4,
    prompt: "如何设计一套千万级 MySQL 三表（A-B-C 关联）洗库方案，确保数据清洗、迁移与切换安全可控？",
    points: [
        "一、数据清洗规则：去重（ROW_NUMBER）、格式标准化（手机号、邮箱、时间）、枚举映射、孤儿数据清理、异常兜底（NULL/默认值）",
        "二、影子表策略：创建 *_new 影子表，仅保留主外键，不建二级索引；在该阶段完成结构变更（字段类型、默认值、命名调整）",
        "三、分片回灌：按主键范围分批导入（A→B→C），使用 FORCE INDEX 固定执行计划并JOIN _new 父表去孤儿",
        "四、增量同步：触发器适合同库小规模；CDC（binlog）适合高并发、跨库场景，需保证幂等与顺序",
        "五、对账校验：行数比对、外键一致性检查、CRC 抽样校验字段一致性、异常审计留痕",
        "六、索引与性能：导入后补建覆盖索引，结合慢查询日志验证执行计划与性能回归",
        "七、切换与回滚：停写窗口内最终对账后，RENAME TABLE 原子切换；保留 *_bak 7~14 天可回滚",
        "八、参数优化与执行稳定：导入期调低刷盘参数、批事务 50k、FORCE INDEX 保计划稳定、软删孤儿数据可追溯"
    ],
    answer:
        "完整流程如下：\n" +
        "1️⃣ 清洗规则：通过窗口函数去重、正则格式化字段、JOIN 维表转码、LEFT JOIN 清孤儿、非法值统一 NULL。\n" +
        "2️⃣ 建影子表：A_new/B_new/C_new 不建索引，仅保留 PK/FK，并在此阶段完成结构调整。\n" +
        "3️⃣ 分片回灌：A→B→C 顺序分批导入，每批 50k~200k，FORCE INDEX 固定计划，JOIN _new 父级去孤儿。\n" +
        "4️⃣ 增量同步：小规模可用触发器（INSERT/UPDATE/DELETE→_new），大规模用 CDC（binlog→Kafka/Flink→_new）。\n" +
        "5️⃣ 对账：行数比对、孤儿检测=0、CRC32 抽样校验、审计修复日志。\n" +
        "6️⃣ 补索引与压测：导入完成后统一 ADD INDEX，并用慢日志/性能指标验证。\n" +
        "7️⃣ 切换与回滚：停写、最终对账、RENAME TABLE 原子切换；保留 *_bak 可回滚。\n" +
        "8️⃣ 性能优化：innodb_flush_log_at_trx_commit=2、sync_binlog=0、显式事务、FORCE INDEX/STRAIGHT_JOIN 固定执行计划。",
    tags: ["洗库方案","影子表","增量同步","对账校验","原子切换","高性能迁移"]
  },
  {
    id: "mysql-4",
    track: "MySQL",
    difficulty: 4,
    prompt: "Explain 执行计划中 type、key、rows、extra 字段分别代表什么？",
    points: [
      "type 表示访问类型：system、const、ref、range、index、ALL",
      "key 是使用的索引；rows 预估扫描行数",
      "extra 显示额外信息：Using index / Using where / filesort / temporary",
    ],
    answer:
      "Explain 输出展示 MySQL 优化器执行路径。type 是访问方式，越靠前越优；key 为选定索引；rows 为扫描行数；extra 展示排序与过滤行为。",
    tags: ["执行计划", "Explain", "优化器"]
  },
  {
    id: "mysql-5",
    track: "MySQL",
    difficulty: 2,
    prompt: "MySQL 中主键自增是如何实现的？在并发场景下可能会出现哪些问题？",
    points: [
      "InnoDB 通过 auto_increment 锁控制分配",
      "并发插入会竞争自增锁（5.7 后改为轻量锁）",
      "主从复制需注意自增步长（auto_increment_increment）",
    ],
    answer:
      "自增键通过表级自增锁控制。高并发下可能产生锁争用或主从 ID 冲突，需设置步长或使用分布式 ID 方案。",
    tags: ["自增主键", "锁", "主从复制"]
  },
  {
    id: "mysql-6",
    track: "MySQL",
    difficulty: 3,
    prompt: "InnoDB 的行锁是怎么实现的？锁粒度与死锁检测机制是怎样的？",
    points: [
      "行锁通过索引项上的锁实现（Record Lock + Gap Lock）",
      "锁粒度细，但需索引支持；否则升级为表锁",
      "InnoDB 内部检测死锁并回滚代价小的事务",
    ],
    answer:
      "InnoDB 行锁基于索引项，若无索引将退化为表锁。内部死锁检测通过等待图回溯回滚代价最小的事务。",
    tags: ["锁机制", "死锁", "InnoDB"]
  },
  {
    id: "mysql-7",
    track: "MySQL",
    difficulty: 3,
    prompt: "MVCC 的实现依赖哪些隐藏字段？简述版本链的读取逻辑。",
    points: [
      "隐藏列：trx_id, roll_pointer",
      "更新产生 undo log 形成版本链",
      "读操作根据当前事务 ID 过滤可见版本",
    ],
    answer:
      "每行记录包含事务 ID 与回滚指针，形成版本链。读取时根据快照时间点判断可见性，实现非锁定读。",
    tags: ["MVCC", "undo log", "可见性"]
  },
  {
    id: "mysql-8",
    track: "MySQL",
    difficulty: 2,
    prompt: "InnoDB 与 MyISAM 的区别有哪些？",
    points: [
      "InnoDB 支持事务、行锁、崩溃恢复；MyISAM 不支持",
      "InnoDB 聚簇索引存储数据；MyISAM 独立数据文件",
      "InnoDB 写性能略低但数据安全性高",
    ],
    answer:
      "InnoDB 提供事务、行级锁与崩溃恢复机制，主键聚簇存储；MyISAM 性能快但不安全，表锁与非事务。",
    tags: ["存储引擎", "事务", "锁"]
  },
  {
    id: "mysql-9",
    track: "MySQL",
    difficulty: 3,
    prompt: "联合索引中列顺序对查询的影响是什么？什么是最左前缀原则？",
    points: [
      "索引 (a,b,c) 仅支持 a / a,b / a,b,c 前缀匹配",
      "范围查询会截断索引匹配",
      "合理调整字段顺序可优化命中率",
    ],
    answer:
      "联合索引遵循最左前缀原则：从最左列连续匹配生效，遇范围条件停止。字段顺序需根据常见查询优化。",
    tags: ["联合索引", "最左前缀", "优化"]
  },
  {
    id: "mysql-10",
    track: "MySQL",
    difficulty: 4,
    prompt: "MySQL 优化器在选择索引时，会参考哪些代价因素？",
    points: [
      "索引基数（cardinality）、数据分布、统计信息",
      "是否覆盖索引、排序代价、随机 I/O 成本",
      "执行计划缓存命中",
    ],
    answer:
      "优化器通过统计信息估算代价，包括索引选择性、过滤率、I/O 成本等，并动态选择最优索引。",
    tags: ["优化器", "索引选择", "统计信息"]
  },
  {
    id: "mysql-11",
    track: "MySQL",
    difficulty: 2,
    prompt: "什么是覆盖索引？它能带来哪些性能优化？",
    points: [
      "查询列包含在索引中，无需回表",
      "减少随机 I/O 与数据页访问",
      "Explain 显示 Using index",
    ],
    answer:
      "覆盖索引是查询列完全在索引中，可直接返回结果，避免回表访问，显著减少 I/O。",
    tags: ["覆盖索引", "性能优化"]
  },
  {
    id: "mysql-12",
    track: "MySQL",
    difficulty: 3,
    prompt: "简述 MySQL 查询缓存（Query Cache）的工作机制及弃用原因。",
    points: [
      "缓存 SQL 与结果集；任意写入导致失效",
      "适合读多写少场景",
      "8.0 起彻底移除，因失效频繁、锁竞争严重",
    ],
    answer:
      "查询缓存存储完整 SQL→结果映射，但任意表更新即全表失效，易造成锁竞争，8.0 已弃用。",
    tags: ["Query Cache", "优化", "MySQL8"]
  },
  {
    id: "mysql-13",
    track: "MySQL",
    difficulty: 4,
    prompt: "简述 InnoDB 日志系统的组成（redo、undo、binlog）及作用。",
    points: [
      "redo log：保证事务持久性（崩溃恢复）",
      "undo log：支持回滚与 MVCC",
      "binlog：记录逻辑操作用于主从复制",
    ],
    answer:
      "InnoDB 使用 redo log 保证崩溃恢复，undo log 支撑回滚和多版本读；binlog 记录逻辑变更用于复制与审计。",
    tags: ["日志系统", "redo log", "binlog"]
  },
  {
    id: "mysql-14",
    track: "MySQL",
    difficulty: 4,
    prompt: "简述一条 SQL 的执行过程（从客户端到存储引擎）。",
    points: [
      "连接管理 → 解析器 → 优化器 → 执行器 → 存储引擎",
      "优化器生成执行计划",
      "执行器根据计划调用引擎接口取数据",
    ],
    answer:
      "SQL 执行流程：客户端连接 → 解析语法 → 优化生成计划 → 执行器调用存储引擎 → 返回结果。",
    tags: ["执行流程", "优化器", "存储引擎"]
  },
  {
    id: "mysql-15",
    track: "MySQL",
    difficulty: 3,
    prompt: "为什么 count(1)、count(*)、count(列) 性能不同？",
    points: [
      "count(*) = count(1)，优化后性能最佳",
      "count(列) 仅统计非空值",
      "InnoDB 无行数缓存，需逐行扫描",
    ],
    answer:
      "count(*) 经过优化与 count(1) 等价，统计所有行；count(列) 仅非空。InnoDB 没有行数元数据，因此都需全表扫描。",
    tags: ["count优化", "聚合函数"]
  },
  {
    id: "mysql-16",
    track: "MySQL",
    difficulty: 4,
    prompt: "在大表中删除大量数据后，为什么表空间不释放？如何处理？",
    points: [
      "InnoDB 不会自动收缩 ibd 文件",
      "DELETE 仅标记为删除，空间复用不回收",
      "可通过 OPTIMIZE TABLE 重建表释放空间",
    ],
    answer:
      "InnoDB 删除仅标记删除，不会收缩物理文件。需执行 OPTIMIZE TABLE 或导出重建以释放空间。",
    tags: ["空间管理", "InnoDB", "优化"]
  },
  {
    id: "mysql-17",
    track: "MySQL",
    difficulty: 3,
    prompt: "主从复制的三种模式：异步、半同步、组复制的区别是什么？",
    points: [
      "异步：主提交即返回，可能丢数据",
      "半同步：至少一从确认收到 binlog",
      "组复制：多主、多副本一致提交",
    ],
    answer:
      "异步复制最快但不可靠；半同步在主返回前等待至少一从确认；组复制支持分布式一致提交。",
    tags: ["复制", "高可用", "一致性"]
  },
  {
    id: "mysql-18",
    track: "MySQL",
    difficulty: 4,
    prompt: "如何排查 SQL 慢查询？请描述完整分析路径。",
    points: [
      "开启 slow_query_log 定位 SQL",
      "使用 explain / show profile / performance_schema",
      "分析索引命中、rows 扫描数、锁等待",
    ],
    answer:
      "慢 SQL 优化流程：通过慢日志定位 → explain 分析执行计划 → profile 量化耗时 → 索引优化或 SQL 重写。",
    tags: ["慢查询", "性能优化", "诊断"]
  },
  {
    id: "mysql-19",
    track: "MySQL",
    difficulty: 3,
    prompt: "分页查询 (limit offset) 在大表中性能差，如何优化？",
    points: [
      "limit offset+n 会扫描前 offset 行",
      "优化方式：基于主键范围条件分页或记录上次 ID",
      "可借助子查询/覆盖索引减少扫描",
    ],
    answer:
      "大 offset 会导致扫描浪费。可通过“基于主键 > 上次 ID”分页或使用子查询优化，提高性能。",
    tags: ["分页优化", "limit", "大数据量"]
  },
  {
    id: "mysql-20",
    track: "MySQL",
    difficulty: 4,
    prompt: "Explain 中出现 Using temporary / Using filesort 时意味着什么？如何优化？",
    points: [
      "Using temporary：中间结果需临时表保存",
      "Using filesort：无法利用索引排序",
      "优化：创建复合索引或减少排序字段",
    ],
    answer:
      "表示排序或分组无法走索引，需要额外内存或磁盘排序。可通过复合索引、减少字段优化。",
    tags: ["Explain", "排序优化", "索引"]
  }
];
