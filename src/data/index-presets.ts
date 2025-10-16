export type GroupPreset = { title: string; ids: string[] }

export const indexPresets: Record<string, GroupPreset[]> = {
  mysql: [
    { title: '🔎 索引与执行计划', ids: ['mysql-1','mysql-4','mysql-9','mysql-10','mysql-11','mysql-20'] },
    { title: '🔒 事务与锁/MVCC', ids: ['mysql-3','mysql-6','mysql-7'] },
    { title: '🧱 存储引擎与日志', ids: ['mysql-8','mysql-13','mysql-14'] },
    { title: '⚡ 性能优化与慢查询', ids: ['mysql-15','mysql-16','mysql-18','mysql-19'] },
    { title: '🔁 复制与高可用', ids: ['mysql-17','mysql-5'] },
    { title: '🧰 工程实践/其他', ids: ['mysql-2','mysql-12'] },
  ],
  redis: [
    { title: '⚙️ 性能与原理', ids: ['redis-1','redis-8','redis-9','redis-14','redis-18','redis-20','redis-29'] },
    { title: '💾 数据结构与存储', ids: ['redis-5','redis-6','redis-13','redis-21','redis-22'] },
    { title: '🧠 分布式与高可用', ids: ['redis-4','redis-7','redis-11','redis-17','redis-19','redis-24','redis-30'] },
    { title: '🧩 一致性与事务', ids: ['redis-3','redis-12','redis-26','redis-27'] },
    { title: '🔒 稳定性与防护', ids: ['redis-2','redis-10','redis-15','redis-16'] },
    { title: '🧰 工程实践', ids: ['redis-23','redis-25','redis-28'] },
  ],
  consul: [
    { title: '🧩 核心能力与架构', ids: ['consul-1','consul-9','consul-12'] },
    { title: '🩺 服务注册与健康检查', ids: ['consul-4','consul-5','consul-10'] },
    { title: '💾 KV / Session / 一致性', ids: ['consul-6','consul-14','consul-17'] },
    { title: '🌐 多数据中心与联邦', ids: ['consul-7'] },
    { title: '🕸 Service Mesh / Connect', ids: ['consul-8','consul-18'] },
    { title: '🔒 安全与 ACL', ids: ['consul-3','consul-11','consul-20'] },
    { title: '🛠 运维与容灾', ids: ['consul-13','consul-15','consul-16','consul-19'] },
    { title: '🚦 发布与流量治理', ids: ['consul-2'] },
  ],
  distributed: [
    { title: '📐 理论与一致性', ids: ['distributed-1','distributed-2','distributed-13'] },
    { title: '🗳 共识与选举', ids: ['distributed-3','distributed-17','distributed-5'] },
    { title: '🔗 事务与幂等/MQ', ids: ['distributed-4','distributed-10','distributed-12'] },
    { title: '🧭 注册/发现/负载', ids: ['distributed-7','distributed-8','distributed-9'] },
    { title: '🔒 锁 / ID / 限流', ids: ['distributed-6','distributed-14','distributed-15'] },
    { title: '🛰 跨机房与可观测', ids: ['distributed-16','distributed-18','distributed-19','distributed-20','distributed-11'] },
  ],
  batch: [
    { title: '🔎 索引与执行计划', ids: ['batch-1','batch-4','batch-9','batch-10','batch-11','batch-20'] },
    { title: '🔒 事务与锁/MVCC', ids: ['batch-3','batch-6','batch-7'] },
    { title: '🧱 存储引擎与日志', ids: ['batch-8','batch-13','batch-14'] },
    { title: '⚡ 性能优化与慢查询', ids: ['batch-15','batch-16','batch-18','batch-19'] },
    { title: '🔁 复制与高可用', ids: ['batch-17','batch-5'] },
    { title: '🧰 工程实践/其他', ids: ['batch-2','batch-12'] },
  ],
};
