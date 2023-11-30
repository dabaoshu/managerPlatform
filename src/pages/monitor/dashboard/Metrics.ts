export const Metrics = Object.freeze([
  {
    title: 'ClickHouse Table KPIs',
    metrics: [{
      expect: 'clickhouse Query',
      metric: 'ClickHouseMetrics_Query{instance=~"{{.hosts}}"}',
    }],
  }, {
    title: 'ClickHouse Node KPIs',
    metrics: [{
      expect: 'cpu usage',
      metric: '100 * (1 - sum(increase(node_cpu_seconds_total{mode="idle",instance=~"{{.hosts}}"}[1m])) by (instance) / sum(increase(node_cpu_seconds_total{instance=~"{{.hosts}}"}[1m])) by (instance))',
    }, {
      expect: 'memory usage',
      metric: '100 * (1 - (node_memory_MemFree_bytes{instance=~"{{.hosts}}"}+node_memory_Buffers_bytes{instance=~"{{.hosts}}"}+node_memory_Cached_bytes{instance=~"{{.hosts}}"})/node_memory_MemTotal_bytes{instance=~"{{.hosts}}"})',
    }, {
      expect: 'disk usage',
      metric: '100 * (1 - node_filesystem_avail_bytes{fstype !~"tmpfs",instance=~"{{.hosts}}"} / node_filesystem_size_bytes{fstype !~"tmpfs",instance=~"{{.hosts}}"})',
    }, {
      expect: 'IOPS',
      metric: 'irate(node_disk_writes_completed_total{instance=~"{{.hosts}}"}[1m])+irate(node_disk_reads_completed_total{instance=~"{{.hosts}}"}[1m])',
    }],
  },
]);



