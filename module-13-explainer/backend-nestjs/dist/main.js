"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = process.env.PORT || 5000;
    await app.listen(port);
    logger.log(`=======================================================`);
    logger.log(`🚀 VibeProofLens Module 13 Backend running on Port ${port}`);
    logger.log(`📡 Endpoints:`);
    logger.log(`   - GET  http://localhost:${port}/api/v1/findings`);
    logger.log(`   - GET  http://localhost:${port}/api/v1/findings/:id`);
    logger.log(`   - POST http://localhost:${port}/api/v1/findings/:id/fix`);
    logger.log(`   - POST http://localhost:${port}/api/v1/findings/:id/retest`);
    logger.log(`=======================================================`);
}
bootstrap();
//# sourceMappingURL=main.js.map