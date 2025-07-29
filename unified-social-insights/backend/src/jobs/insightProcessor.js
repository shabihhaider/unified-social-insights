// backend/src/jobs/insightProcessor.js
const { insightProcessor } = require('../services/aiIntegrationService');

// Start the insight processor
if (process.env.NODE_ENV !== 'test') {
  // Wait a bit before starting to ensure DB is ready
  setTimeout(() => {
    insightProcessor.start();
  }, 5000);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('🔄 Shutting down insight processor...');
    await insightProcessor.stop();
  });

  process.on('SIGINT', async () => {
    console.log('🔄 Shutting down insight processor...');
    await insightProcessor.stop();
  });
}

module.exports = insightProcessor;