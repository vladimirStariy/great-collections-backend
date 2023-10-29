import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function start() {
    const PORT = '5000';
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder() 
        .setTitle('Great-collections')
        .setDescription('Great-collections documentation')
        .setVersion('1.0.0')
        .addTag('Developed by Vladimir Starovoyt')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    app.enableCors({
        origin: '*'
    });

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}

start();