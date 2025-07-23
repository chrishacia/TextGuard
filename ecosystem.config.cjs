module.exports = {
  apps: [
    {
      name: 'TextGuard',
      script: './server/dist/index.js',
      cwd: '/var/www/textguard.chrishacia.com',
      env: {
        NODE_ENV: 'production'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
