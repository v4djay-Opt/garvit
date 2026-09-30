module.exports = {
  apps: [{
    name: "garvit", cwd: "/var/www/garvit/current", script: "server.js",
    node_args: "--env-file=/var/www/garvit/shared/.env.production",
    exec_mode: "fork", instances: 1, autorestart: true, watch: false,
    max_memory_restart: "500M",
    env_production: { NODE_ENV: "production", PORT: 3000, HOSTNAME: "127.0.0.1" },
    log_date_format: "YYYY-MM-DD HH:mm:ss", merge_logs: true,
  }],
};
