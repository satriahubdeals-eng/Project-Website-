module.exports = {
  apps: [
    {
      name: 'web-yestin',
      script: 'server.js', // ganti ke 'server.js' atau 'app.js' sesuai file utama repo
      instances: 'max',   // memanfaatkan seluruh core CPU server (Cluster Mode)
      exec_mode: 'cluster',
      watch: false,       // false di production agar tidak restart acak
      max_memory_restart: '300M', // auto-restart jika ada memory leak > 300MB
      env: {
        NODE_ENV: 'production',
        PORT: 23,
        HOST: '0.0.0.0'
      }
    }
  ]
};
