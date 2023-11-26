import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
const cors = require('cors')

async function start() {
    const PORT = '3000';
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
        origin: 'https://great-collections-front.vercel.app',
        allowedHeaders: ['content-type', 'authorization'],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    })
    
    const bodyparser = require('body-parser');

    app.use(
        cookieParser(),
        bodyparser.urlencoded({ limit: '50mb', extended: false })
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(PORT)
}

start();