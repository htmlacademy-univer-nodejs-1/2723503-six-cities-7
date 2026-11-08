import { types } from '@typegoose/typegoose';
import { ContainerModule } from 'inversify';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { DefaultCommentService } from './default-comment.service.js';

export const commentContainerModule = new ContainerModule((bind) => {
  bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
});
