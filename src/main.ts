import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
const cors = require('cors')

async function start() {
    const PORT = '3000';
    const app = await NestFactory.create(AppModule);

    const bodyparser = require('body-parser');

    app.use(
        cookieParser(),
        bodyparser.urlencoded({ limit: '50mb', extended: false })
    );

    app.use(cors({
        origin: ['https://great-collections-front.vercel.app'],
        credentials: true,
    }))

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start();