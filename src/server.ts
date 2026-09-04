import app from '@/app';
import { logger } from '@/config/logger';
import { connectRedis} from '@/config/redis';

const PORT = Number(process.env.PORT) || 3333;

const startServer = async() =>{
  await connectRedis();

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();