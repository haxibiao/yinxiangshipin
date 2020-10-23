import { account } from './account';
import { chat } from './chat';
import { collection } from './collection';
import { comment } from './comment';
import { favorite } from './favorite';
import { feedback } from './feedback';
import { follow } from './follow';
import { like } from './like';
import { notification } from './notification';
import { post } from './post';
import { report } from './report';
import { reward } from './reward';
import { search } from './search';
import { share } from './share';
import { tag } from './tag';
import { task } from './task';
import { user } from './user';
import { wallet } from './wallet';

export const GQL = {
    ...account,
    ...chat,
    ...collection,
    ...comment,
    ...favorite,
    ...feedback,
    ...follow,
    ...like,
    ...notification,
    ...post,
    ...report,
    ...reward,
    ...search,
    ...share,
    ...tag,
    ...task,
    ...user,
    ...wallet,
};
