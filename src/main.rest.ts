import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { RestApplication, createRestApplicationContainer } from './rest/index.js';
import { createUserContainer } from './shared/modules/user/index.js';

async function bootstrap() {
  const appContainer = Container.merge(createRestApplicationContainer(), createUserContainer());

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
