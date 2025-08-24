const logger = (msg) => {
    console.log(`[${new Date().toISOString()}] ${msg}`);
};

module.exports = { logger };
