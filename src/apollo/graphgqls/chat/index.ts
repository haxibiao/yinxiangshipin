// 用户聊天系统
import chatsQuery from './chatsQuery.graphql';
import createChatMutation from './createChatMutation.graphql';
import deleteChatMutation from './deleteChatMutation.graphql';
import messagesQuery from './messagesQuery.graphql';
import sendMessageMutation from './sendMessageMutation.qraphql';

export const chat = {
    chatsQuery,
    createChatMutation,
    deleteChatMutation,
    messagesQuery,
    sendMessageMutation,
};
