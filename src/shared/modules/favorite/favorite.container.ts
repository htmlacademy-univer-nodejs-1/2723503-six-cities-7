import { ContainerModule } from 'inversify';
import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { FavoriteController } from './favorite.controller.js';

export const favoriteContainerModule = new ContainerModule((bind) => {
  bind<Controller>(Component.FavoriteController).to(FavoriteController).inSingletonScope();
});
