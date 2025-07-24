module.exports = {
  apps: [
    {
      name: "TextGuard",
      cwd: "/var/www/textguard.chrishacia.com",
      script: "server-dist/index.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        ROLLUP_DISABLE_NATIVE: "1",
        SERVER_PROTOCOL: "http",
        SERVER_DOMAIN: "textguard.chrishacia.com",
        SERVER_PORT: "4052",
        DEBUG_SPAM: "1",
        SPAM_HEURISTIC_WEIGHT: "0.3",
        SPAM_THRESHOLD: "0.5",
      },
      node_args: '-r dotenv/config'
    },
  ],
};
