import { CreateTagDto, ITag } from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getTagsForAccount = (accountId: number) =>
  apiHelperPublic<ITag[]>({ url: `tags/${accountId}` });

export const createTag = (dto: CreateTagDto) =>
  apiHelperPublic<ITag>({ url: 'tags/create', method: Method.POST, data: dto });
