import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
const bodyparser = require('body-parser');

async function start() {
    const PORT = '3000';
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
        origin: true,
        allowedHeaders: ['content-type', 'authorization'],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    })

    app.use(
        cookieParser(),
        bodyparser.urlencoded({ limit: '50mb', extended: false })
    );

    await app.listen(PORT)
}

start();