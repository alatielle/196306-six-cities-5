import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import {
  RestApplication,
  createRestApplicationContainer,
} from './rest/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';
import { createCityContainer } from './shared/modules/city/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createCityContainer(),
    createAuthContainer(),
  );

  const application = appContainer.get<RestApplication>(
    Component.RestApplication,
  );
  await application.init();
}

bootstrap();
