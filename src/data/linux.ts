import type { Question } from "../types";

export const summary: Question[] = [
    {
        id: "linux-1",
        track: "运维与故障排查",
        difficulty: 2,
        prompt: "线上服务器常见问题如何系统化排查？请从 CPU、内存、磁盘、网络、进程等角度说明常见命令与分析思路。",
        points: [
            "整体思路：先确认现象 → 收集数据 → 定位瓶颈 → 验证假设 → 复盘总结",
            "CPU 异常：top、pidstat、perf、strace 定位高占用线程与系统调用热点",
            "内存异常：free、vmstat、pmap、jmap 检查内存泄漏、Swap、GC 频率",
            "磁盘 / IO 异常：iostat、iotop、sar -d、df、du 定位高延迟或空间占满问题",
            "网络异常：ping、mtr、ss、netstat、tcpdump 分析延迟、丢包与连接堆积",
            "进程卡死：strace、jstack、lsof 分析线程阻塞、文件锁与系统调用卡点",
            "日志与系统：dmesg、journalctl、systemctl 检查内核与服务级别异常",
            "形成固定排查流程模板，记录问题现象、命令输出、原因分析与复盘结论"
        ],
        answer:
            "线上服务器问题排查应遵循“由外到内、由浅入深”的原则，按资源维度逐层定位。\n\n" +
            "1️⃣ **CPU 异常**：使用 `top -H`、`pidstat -u 1`、`perf top` 等命令定位高占用线程；如发现线程陷入系统调用（如 futex、poll、epoll_wait），可用 `strace -tt -p pid` 分析阻塞点。\n\n" +
            "2️⃣ **内存问题**：`free -h`、`vmstat 1` 可观测整体内存趋势；`pmap -x pid` 查看进程内存分布；`dmesg | grep -i kill` 检查是否触发 OOM。Java 进程可用 `jstat -gcutil` 和 `jmap -histo` 定位 Full GC 与对象泄漏。\n\n" +
            "3️⃣ **磁盘 / IO 异常**：`iostat -x 1` 观察磁盘利用率和延迟；`iotop` 定位高 IO 进程；`df -h`、`du -sh /*` 检查空间是否被日志占满；若 IO 等待高（wa% 上升），需排查随机 IO 与磁盘健康。\n\n" +
            "4️⃣ **网络异常**：通过 `ping`、`mtr` 判断丢包与延迟；`ss -s`、`netstat -antp` 分析连接状态；`tcpdump -nn -i eth0 port 80` 抓包确认请求方向。半连接堆积常见于 backlog 满或 SYN flood 攻击。\n\n" +
            "5️⃣ **进程卡死**：用 `strace -p pid` 追踪系统调用；`jstack pid` 检查 Java 死锁或阻塞线程；`lsof -p pid` 检查文件或网络句柄泄漏。若 load 高但 CPU 空闲，通常是 IO 或锁等待导致。\n\n" +
            "6️⃣ **日志与系统消息**：`journalctl -xe`、`dmesg -T` 关注内核层错误（如磁盘坏块、OOM kill、文件系统只读等）；`systemctl status app` 检查服务启动与退出状态。\n\n" +
            "7️⃣ **总结与模板化**：每次排查应形成记录模板，包括【告警时间】【现象】【排查步骤】【命令输出】【原因分析】【修复措施】等内容，形成可复用的知识库。\n\n" +
            "通过以上方法，可系统化地应对线上 CPU、内存、磁盘、网络及应用层的常见故障，确保快速定位、稳态恢复与经验沉淀。",
        tags: ["服务器排查", "性能问题", "CPU", "内存", "IO", "网络", "strace", "jstack"]
    },
    {
        id: "linux-2",
        track: "Linux 调试",
        difficulty: 2,
        prompt: "如何使用 strace 排查 Linux 进程的异常状态与性能问题？",
        points: [
            "strace 可跟踪进程的系统调用与信号，帮助定位阻塞点、性能瓶颈或资源异常",
            "通过 `strace -p <pid>` 实时观察系统调用，分析进程在做什么",
            "使用 `-tt` 显示时间戳定位卡顿，`-c` 汇总调用次数与耗时比例",
            "结合 `-e trace=file|network|signal` 可过滤特定类型调用",
            "典型排查思路：",
            "① 进程卡死：`strace -tt -p pid` → 看是否卡在 futex、read、recv、poll 等调用",
            "② 高 CPU：`strace -c -p pid` → 查看哪类系统调用占用时间最多",
            "③ 无法读写文件：`strace -e trace=file -p pid` → 检查文件路径、权限错误或不存在",
            "④ 网络问题：`strace -e trace=network -p pid` → 查看 connect、sendto、recvfrom 是否阻塞或超时",
            "⑤ fork 过多：`strace -f -p pid` → 跟踪子进程的频繁创建行为"
        ],
        answer:
            "strace 是分析 Linux 进程行为的底层利器，能捕获与内核交互的系统调用及信号。\n\n" +
            "在排查进程异常时，可以根据不同场景使用：\n" +
            "1️⃣ **进程卡死**：执行 `strace -tt -p pid`，观察是否卡在 `futex`（锁等待）、`read`/`recv`（IO阻塞）、`poll`（事件等待）等系统调用上。\n" +
            "2️⃣ **高 CPU**：执行 `strace -c -p pid`，查看哪些系统调用占用时间最多，如频繁的 `futex`、`gettimeofday`、`write` 等。\n" +
            "3️⃣ **无法读写文件**：执行 `strace -e trace=file -p pid`，分析文件打开路径是否正确、权限是否被拒绝（如 `ENOENT`、`EACCES` 错误）。\n" +
            "4️⃣ **网络问题**：执行 `strace -e trace=network -p pid`，重点看 `connect`、`sendto`、`recvfrom` 调用是否超时或返回错误码。\n" +
            "5️⃣ **fork 过多**：执行 `strace -f -p pid`，观察进程是否频繁调用 `fork` 或 `clone` 导致资源耗尽。\n\n" +
            "结合 `lsof -p pid`、`cat /proc/pid/status`、`top` 等命令，可以快速定位进程状态、锁等待与资源瓶颈。",
        tags: ["strace", "系统调用", "进程调试", "性能排查", "Linux 工具"]
    },
    {
        id: "linux-1",
        track: "Linux 调试",
        difficulty: 2,
        prompt: "如何使用 strace 排查 Linux 进程的异常状态与性能问题？",
        points: [
            "strace 可跟踪进程的系统调用与信号，帮助定位阻塞点、性能瓶颈或资源异常",
            "通过 `strace -p <pid>` 实时观察系统调用，分析进程在做什么",
            "使用 `-tt` 显示时间戳定位卡顿，`-c` 汇总调用次数与耗时比例",
            "结合 `-e trace=file|network|signal` 可过滤特定类型调用",
            "典型排查思路：",
            "① 进程卡死：`strace -tt -p pid` → 看是否卡在 futex、read、recv、poll 等调用",
            "② 高 CPU：`strace -c -p pid` → 查看哪类系统调用占用时间最多",
            "③ 无法读写文件：`strace -e trace=file -p pid` → 检查文件路径、权限错误或不存在",
            "④ 网络问题：`strace -e trace=network -p pid` → 查看 connect、sendto、recvfrom 是否阻塞或超时",
            "⑤ fork 过多：`strace -f -p pid` → 跟踪子进程的频繁创建行为"
        ],
        answer:
            "strace 是分析 Linux 进程行为的底层利器，能捕获与内核交互的系统调用及信号。\n\n" +
            "在排查进程异常时，可以根据不同场景使用：\n" +
            "1️⃣ **进程卡死**：执行 `strace -tt -p pid`，观察是否卡在 `futex`（锁等待）、`read`/`recv`（IO阻塞）、`poll`（事件等待）等系统调用上。\n" +
            "2️⃣ **高 CPU**：执行 `strace -c -p pid`，查看哪些系统调用占用时间最多，如频繁的 `futex`、`gettimeofday`、`write` 等。\n" +
            "3️⃣ **无法读写文件**：执行 `strace -e trace=file -p pid`，分析文件打开路径是否正确、权限是否被拒绝（如 `ENOENT`、`EACCES` 错误）。\n" +
            "4️⃣ **网络问题**：执行 `strace -e trace=network -p pid`，重点看 `connect`、`sendto`、`recvfrom` 调用是否超时或返回错误码。\n" +
            "5️⃣ **fork 过多**：执行 `strace -f -p pid`，观察进程是否频繁调用 `fork` 或 `clone` 导致资源耗尽。\n\n" +
            "结合 `lsof -p pid`、`cat /proc/pid/status`、`top` 等命令，可以快速定位进程状态、锁等待与资源瓶颈。",
        tags: ["strace", "系统调用", "进程调试", "性能排查", "Linux 工具"]
    },
    {
        id: "linux-2",
        track: "Linux 调试",
        difficulty: 3,
        prompt: "线上服务器常见问题该如何使用 strace 等工具快速排查？",
        points: [
            "线上环境排查以『最小侵入 + 快速定位』为原则，优先通过系统调用与资源状态分析确定问题来源",
            "strace 是首选的系统调用级排查工具，可结合 top、lsof、netstat、iostat、vmstat 等命令综合分析",
            "典型排查思路：",
            "① 进程卡死：`strace -tt -p pid` → 查看是否卡在 futex、read、recv、poll 等调用；确认锁等待或IO阻塞",
            "② 高CPU：`strace -c -p pid` → 汇总调用耗时分布；结合 top/pidstat 确定是否系统调用频繁或死循环",
            "③ 无法读写文件：`strace -e trace=file -p pid` → 检查文件路径、权限、ENOENT/EACCES 错误",
            "④ 网络问题：`strace -e trace=network -p pid` → 查看 connect、sendto、recvfrom 是否超时或 ECONNRESET",
            "⑤ fork 过多或线程异常：`strace -f -p pid` → 跟踪子进程行为；观察是否频繁 fork/clone",
            "⑥ CPU 飙高但无调用：结合 `perf top` 或 `pstack pid` → 定位用户态死循环或锁自旋",
            "⑦ IO 慢：`iostat -x 1` / `vmstat 1` → 查看磁盘队列与内存换页；`strace` 验证是否频繁 sync/fsync",
            "⑧ 网络延迟：`ss -s` / `netstat -anp` → 结合 `strace -e trace=network` 定位连接数与阻塞原因",
            "⑨ 文件句柄泄露：`lsof -p pid` → 检查打开文件数量是否异常；可配合 `strace -p pid` 查看未关闭文件句柄"
        ],
        answer:
            "线上服务器出现异常时，首要目标是**在不中断业务的前提下快速定位瓶颈**。`strace` 能精确跟踪系统调用，是最有效的进程级排查手段。\n\n" +
            "🧩 常见问题与命令思路：\n" +
            "1️⃣ **进程卡死**：`strace -tt -p pid` 查看卡在哪个系统调用，常见 futex（锁等待）、read/poll（IO等待）。\n" +
            "2️⃣ **高CPU**：`strace -c -p pid` 统计调用耗时，若系统调用频繁则为内核态开销；若调用少可用 `pstack` 查用户态死循环。\n" +
            "3️⃣ **无法读写文件**：`strace -e trace=file -p pid` 检查路径、权限或文件不存在错误码（ENOENT / EACCES）。\n" +
            "4️⃣ **网络问题**：`strace -e trace=network -p pid` 查看 connect/send/recv 是否超时；配合 `ss -s`、`netstat` 查看连接状态。\n" +
            "5️⃣ **fork 过多**：`strace -f -p pid` 跟踪子进程频繁创建；需检查守护进程逻辑或线程池配置。\n" +
            "6️⃣ **IO 性能差**：`iostat -x 1` 查看磁盘使用率、队列长度；`strace` 检查是否频繁 sync/fsync 写盘。\n" +
            "7️⃣ **文件句柄泄露**：`lsof -p pid` 检查 FD 数量是否激增，结合 `strace` 验证 close 调用缺失。\n\n" +
            "🛠 推荐组合工具链：\n" +
            "- 系统资源层：`top`, `pidstat`, `vmstat`, `iostat`, `dmesg`\n" +
            "- 进程层：`strace`, `lsof`, `pstack`, `/proc/<pid>/status`\n" +
            "- 网络层：`ss`, `netstat`, `tcpdump`\n\n" +
            "通过以上工具可实现『从症状到内核行为』的全链路排查，快速定位线上服务器 CPU、IO、锁、网络、资源等各类问题根因。",
        tags: ["strace", "线上排查", "系统调用", "性能瓶颈", "服务器调优", "Linux 工具"]
    }
];

