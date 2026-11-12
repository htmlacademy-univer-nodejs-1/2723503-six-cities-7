import { types } from '@typegoose/typegoose';
import { ContainerModule } from 'inversify';
import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferController } from './offer.controller.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity, OfferModel } from './offer.entity.js';

export const offerContainerModule = new ContainerModule((bind) => {
  bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();
});
