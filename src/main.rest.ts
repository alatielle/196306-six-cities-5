import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { RestApplication, createRestApplicationContainer } from './rest/index.js';

async function bootstrap() {
  const appContainer = Container.merge(createRestApplicationContainer());

  const application = appContainer.get<RestApplication>(
    Component.RestApplication,
  );
  await application.init();
}

bootstrap();
