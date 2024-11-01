import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";

const isLocal = !process.env.FUNCTION_NAME;
const expressServer = express();

async function createNestServer(expressInstance) {
	const app = await NestFactory.create(
		AppModule,
		new ExpressAdapter(expressInstance),
	);

	if (isLocal) {
		const config = new DocumentBuilder()
			.setTitle("Test API")
			.setDescription("The Test API description")
			.setVersion("1.0")
			.addTag("test")
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup("api", app, document);
	}

	app.enableCors({
		origin: "*",
		methods: "GET,POST,PUT,DELETE",
		allowedHeaders: "Content-Type,Authorization",
		credentials: true,
	});

	await app.init();
}

createNestServer(expressServer).then(() => {
	if (isLocal) {
		expressServer.listen(3000, () => {
			console.log("NestJS app is running on http://localhost:3000");
		});
	}
});
