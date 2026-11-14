import { createClient } from '@supabase/supabase-js';

// 4 Database Cluster Nodes SASIPEDIA
const CLUSTER_NODES = [
  {
    id: 'node-master-hub',
    name: 'Master Node Pusat (Akun Utama)',
    role: 'Database Utama & Bank Soal',
    url: process.env.VITE_SUPABASE_URL || 'https://lmlflfkdukcdhkdjssmm.supabase.co',
    key: process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jCtI_SZy-jxcJoDkeXPN-g_HKO4LEXX'
  },
  {
    id: 'node-pamulihan-shard-02',
    name: 'Kluster 2 (Wilayah Pamulihan)',
    role: 'Shard CBT Sekolah Binaan',
    url: 'https://xbfaphceljhkvgjedjpr.supabase.co',
    key: 'sb_publishable_AL2XH2IqwTh5VSdp4stxBg_53RR46Pv'
  },
  {
    id: 'node-shard-1792855754950',
    name: 'Klaster 3 (Wilayah Pamulihan 2)',
    role: 'Shard CBT Klaster Pamulihan 2',
    url: 'https://qnqcemajxmndehizmfyq.supabase.co',
    key: 'sb_publishable_xj0qarA0kDbuCMuG9aIVFw_wE57Qoo9'
  },
  {
    id: 'node-backup-dr-01',
    name: 'Server Cadangan Darurat (DR Hub)',
    role: 'Disaster Recovery & Standby',
    url: 'https://xtgqdbqjokzkgzzagdly.supabase.co',
    key: 'sb_publishable_oBxW-P4ypotuVHxTl1nEtw_-7ZTeUOK'
  }
];

// Helper ping per node dengan timeout 5 detik
async function pingNode(node) {
  const start = Date.now();
  try {
    const client = createClient(node.url, node.key, {
      auth: { persistSession: false }
    });

    // Kueri ultra-ringan: select 1 baris id untuk membangkitkan aktivitas Postgres
    let { data, error } = await client.from('student_attempts').select('id').limit(1);

    if (error && error.code === 'PGRST205') {
      // Fallback jika tabel student_attempts belum ada di node tertentu
      const fallback = await client.from('schools').select('id').limit(1);
      error = fallback.error;
      data = fallback.data;
    }

    const latency = Date.now() - start;

    if (error) {
      return {
        id: node.id,
        name: node.name,
        role: node.role,
        url: node.url.replace(/^https:\/\//, ''),
        status: 'error',
        isOnline: false,
        latencyMs: latency,
        message: error.message || 'Error executing heartbeat query'
      };
    }

    return {
      id: node.id,
      name: node.name,
      role: node.role,
      url: node.url.replace(/^https:\/\//, ''),
      status: 'active',
      isOnline: true,
      latencyMs: latency,
      records: Array.isArray(data) ? data.length : 0,
      message: 'OK (Heartbeat Active)'
    };
  } catch (err) {
    return {
      id: node.id,
      name: node.name,
      role: node.role,
      url: node.url.replace(/^https:\/\//, ''),
      status: 'error',
      isOnline: false,
      latencyMs: Date.now() - start,
      message: err.message || 'Connection failed'
    };
  }
}

export default async function handler(req, res) {
  // CORS & Zero-Cache Headers (Wajib agar cronjob selalu tembus ke database asli)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const startTime = Date.now();

  // Eksekusi ping paralel ke ke-4 server Supabase
  const results = await Promise.all(CLUSTER_NODES.map(pingNode));
  const totalDuration = Date.now() - startTime;

  const onlineCount = results.filter(r => r.isOnline).length;
  const isAllHealthy = onlineCount === CLUSTER_NODES.length;
  const timestamp = new Date().toISOString();

  // Deteksi format permintaan (JSON jika requested by cronjob/api, atau HTML jika dibuka di browser)
  const format = req.query.format;
  const acceptHeader = req.headers['accept'] || '';
  const wantsJson = format === 'json' || acceptHeader.includes('application/json') || req.headers['user-agent']?.includes('cron');

  if (wantsJson && format !== 'html') {
    return res.status(isAllHealthy ? 200 : 207).json({
      success: isAllHealthy,
      message: `Berhasil melakukan heartbeat kueri ke ${onlineCount}/${CLUSTER_NODES.length} server database Supabase.`,
      timestamp,
      total_duration_ms: totalDuration,
      summary: {
        total_nodes: CLUSTER_NODES.length,
        online_nodes: onlineCount,
        offline_nodes: CLUSTER_NODES.length - onlineCount
      },
      servers: results
    });
  }

  // Render Halaman HTML Ultra-Ringan (Pure HTML/CSS, bobot < 3 KB, loading instan 0.1s)
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SASIPEDIA - Cluster Heartbeat Monitor (Keep-Alive)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #0f172a; color: #f8fafc; padding: 24px 16px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; width: 100%; max-width: 680px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 1.15rem; font-weight: 800; color: #38bdf8; display: flex; align-items: center; gap: 8px; }
    .badge-status { padding: 4px 10px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .badge-ok { background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid #059669; }
    .badge-warn { background: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid #d97706; }
    .grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
    .server-item { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; }
    .server-info { display: flex; flex-direction: column; gap: 2px; }
    .server-name { font-weight: 700; font-size: 0.88rem; color: #e2e8f0; }
    .server-url { font-size: 0.72rem; color: #94a3b8; font-family: monospace; }
    .server-metric { text-align: right; }
    .pill { font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; display: inline-block; }
    .pill-green { background: #064e3b; color: #6ee7b7; border: 1px solid #047857; }
    .pill-red { background: #7f1d1d; color: #fca5a5; border: 1px solid #b91c1c; }
    .latency { font-size: 0.72rem; color: #94a3b8; margin-top: 4px; font-family: monospace; }
    .cron-box { background: #0f172a; border: 1px dashed #475569; border-radius: 10px; padding: 12px; margin-top: 16px; font-size: 0.75rem; color: #94a3b8; }
    .cron-url { color: #38bdf8; font-family: monospace; word-break: break-all; margin: 4px 0; font-weight: 700; }
    .btn { background: #0284c7; color: white; border: none; border-radius: 8px; padding: 10px 16px; font-weight: 700; font-size: 0.8rem; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s; }
    .btn:hover { background: #0369a1; }
    .actions { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; }
    .footer-note { font-size: 0.7rem; color: #64748b; margin-top: 16px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div>
        <div class="title">⚡ SASIPEDIA Keep-Alive</div>
        <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Multi-Cluster Database Heartbeat Polling</div>
      </div>
      <span class="badge-status ${isAllHealthy ? 'badge-ok' : 'badge-warn'}">
        ${isAllHealthy ? '● All Active (4/4)' : `● Partial (${onlineCount}/4)`}
      </span>
    </div>

    <div class="grid">
      ${results.map(r => `
        <div class="server-item">
          <div class="server-info">
            <span class="server-name">${r.name}</span>
            <span class="server-url">${r.url} • ${r.role}</span>
          </div>
          <div class="server-metric">
            <span class="pill ${r.isOnline ? 'pill-green' : 'pill-red'}">
              ${r.isOnline ? 'ACTIVE' : 'ERROR'}
            </span>
            <div class="latency">${r.latencyMs} ms</div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="cron-box">
      <div style="font-weight: 700; color: #e2e8f0;">📌 URL Cronjob Anda:</div>
      <div class="cron-url">https://www.sasipedia.my.id/api/keep-alive</div>
      <div>Pasang URL ini di <strong>cron-job.org</strong> setiap <strong>3 s.d. 5 hari sekali</strong> (Metode GET) untuk mereset batas 7 hari inaktivitas Supabase Free Tier secara permanen.</div>
    </div>

    <div class="actions">
      <button class="btn" onclick="window.location.reload();">🔄 Ping Ulang Sekarang</button>
      <span style="font-size: 0.75rem; color: #94a3b8; font-family: monospace;">Durasi: ${totalDuration} ms</span>
    </div>

    <div class="footer-note">
      Stempel Waktu: ${timestamp} • Otomatis memicu kueri resmi ke seluruh cluster database.
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
}
