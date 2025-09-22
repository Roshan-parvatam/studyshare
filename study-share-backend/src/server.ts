import app from './app';
import connectDB from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      console.log(`📖 API: http://localhost:${env.PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: any) => {
  console.error('Unhandled Promise Rejection:', err?.message || err);
  process.exit(1);
});

process.on('uncaughtException', (err: any) => {
  console.error('Uncaught Exception:', err?.message || err);
  process.exit(1);
});

startServer();

