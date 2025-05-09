module.exports = {
    apps: [
        {
            name: 'hanoi-api',
            script: './dist/index.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            merge_logs: true,
            max_memory_restart: '256M',
        },
    ],
};
export {};
