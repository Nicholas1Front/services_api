import app from '@/app';
import { logger } from '@/config/logger';

const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});