/*
 * @flow
 * created by wyk made in 2019-06-18 10:28:20
 */
import { GiftedChat } from 'hxf-react-native-gifted-chat';
import { Keyboard } from 'react-native';
import { observable, action, runInAction } from 'mobx';
// import { Theme, Api, PxFit, Config, ISIOS } from '../utils';
// import ConfigStore from './ConfigStore';
import { userStore, appStore } from '@src/store';
import { useApolloClient, GQL } from '@src/apollo';
// import { CreateRoomMutation, CreateMesssageMutation, MessagesQuery, ChatsQuery } from '../graphql/chat.graphql';

interface Message {
    _id: number;
    text: string;
    user: User;
}

interface User {
    id: number;
    name: string;
    avatar: string;
}

// 聊天管理
class ChatStore {
    viewsName = {
        recording: 'recording',
        image: 'image',
        video: 'video',
        emoji: 'emoji',
    };

    @observable public chatId: number;
    @observable public isLoading: boolean = true;
    @observable public isError: boolean = false;
    @observable public isFinish: boolean = false;
    @observable public isLoadMore: boolean = false;

    @observable public messagesData: Message[] = [];
    @observable public currentPage: number = 1;
    @observable public hasMorePages: boolean = false;
    @observable public lastPage: number = 1;
    @observable public messageId: number = 1;

    @observable public viewState = null;
    @observable public textMessage = '';
    @observable public pickedImages = new Set();
    @observable public pickedVideo = null;

    @action.bound
    constructorSendMessage() {
        let incomingMessage = {
            _id: this.messageId,
            // createdAt: new Date(),
            user: {
                _id: userStore.me.id,
                name: userStore.me.name,
                avatar: userStore.me.avatar,
            },
        };
        this.messageId++;
        return incomingMessage;
    }

    @action.bound
    constructorMessage(message) {
        const incomingMessage = {
            _id: message.message_id,
            text: message.message_content,
            // createdAt: message.time_ago,
            user: {
                _id: message.user_id,
                name: message.user_name,
                avatar: message.user_avatar,
            },
        };
        return incomingMessage;
    }

    @action.bound
    createChat(user_id) {
        appStore.client
            .mutate({
                mutation: GQL.createChatMutation,
                variables: {
                    id: user_id,
                },
            })
            .then(result => {
                const chat = result.data.createChat;
                this.chatId = chat.id;
                console.log('id', chat);
                this.listenChat(chat.id);
                // this.fetchMessages(chat.id);
            })
            .catch(err => {
                console.log('err', err);
            });
    }

    @action.bound
    createMessage(payload) {
        console.log('payload', payload);
        console.log('ConfigStore.client', appStore.client);
        appStore.client
            .mutate({
                mutation: GQL.sendMessageMutation,
                variables: payload,
            })
            .then(data => {
                console.log('Data', data);
            })
            .catch(err => {
                console.log('err', err);
            });
    }

    // @action.bound
    // fetchMessages(chat_id) {
    //     appStore.client
    //         .query({
    //             query: GQL.messagesQuery,
    //             variables: payload,
    //         })
    //         .then(data => {
    //             console.log('Data', data);
    //         })
    //         .catch(err => {
    //             console.log('err', err);
    //         });
    // }

    @action.bound
    listenChat(chat_id) {
        console.log('appStore.echo', chat_id);
        if (appStore?.echo?.join) {
            appStore.echo
                .join(`chat.${chat_id}`)
                .here(users => {
                    console.log('echo join here users:', users);
                })
                .joining(user => {
                    console.log(user.name);
                })
                .leaving(user => {
                    console.log(user.name);
                })
                .listen('NewMessage', message => {
                    console.log('new message e', message);
                    console.log('e.user_id', message.user_id, Number(userStore.me.id));
                    if (message.user_id !== Number(userStore.me.id)) {
                        let incomingMessage = this.constructorMessage(message);
                        this.appendMessage(incomingMessage);
                        this.sendLocalNotification(message);
                    }
                });
        }
    }

    @action.bound
    sendLocalNotification = (data: any) => {
        // console.log('socket got data', data);
        // const currentDate = new Date();
        // JPushModule.sendLocalNotification({
        //     buildId: 1,
        //     id: data.message_id,
        //     content: data.message_content,
        //     extra: {},
        //     fireTime: currentDate.getTime() + 3000,
        //     title: data.message_title,
        // });
    };

    @action.bound
    prependMessage(message: Message[]) {
        // GiftedChat.prepend(this.messagesData, message);
        console.log('prependMessage', message);
        this.messagesData.push(message);
    }

    @action.bound
    appendMessage(message: Message[]) {
        // GiftedChat.append(this.messagesData, message);
        // this.hideChatView();
        console.log('appendMessage', message);
        this.messagesData.unshift(message);
    }

    @action.bound
    hideChatView() {
        this.viewState = null;
    }

    @action.bound
    setViewState(key) {
        if (this.viewState === this.viewsName[key]) {
            this.hideChatView();
        } else {
            this.viewState = this.viewsName[key];
        }
    }

    @action.bound
    openRecordingView() {
        this.setViewState(this.viewsName.recording);
    }

    @action.bound
    openImageView() {
        if (this.pickedImages.size > 0) {
            this.setViewState(this.viewsName.image);
        } else {
            this.openImagePicker();
        }
    }

    @action.bound
    openVideoView() {
        if (this.pickedVideo) {
            this.setViewState(this.viewsName.video);
        } else {
            this.openVideoPicker();
        }
    }

    @action.bound
    openEmojiView() {
        this.setViewState(this.viewsName.emoji);
    }

    @action.bound
    openImagePicker() {
        let option = { multiple: true };
        if (this.pickedImages.size > 5) {
            Toast('最多6张图片哦');
            return;
        }
        Api.imagePicker(images => {
            this.viewState = this.viewsName.image;
            images.map((image, index) => {
                if (this.pickedImages.size > 5) {
                    Toast('最多6张图片哦');
                    return;
                }
                this.pickedImages.add(image);
            });
        }, option);
    }

    @action.bound
    openVideoPicker() {
        let option = { multiple: false, mediaType: 'video' };
        Api.imagePicker(video => {
            this.viewState = this.viewsName.video;
            let path = video.path.substr(7);
            this.pickedVideo = path;
        }, option);
    }

    @action.bound
    changText(text) {
        this.textMessage = text;
    }

    @action.bound
    appendEmojiToMessage(emoji) {
        let s = this.textMessage;
        s += emoji.code;
        this.textMessage = s;
    }

    @action.bound
    deleteImage(image) {
        let images = this.pickedImages;
        images.delete(image);
        this.pickedImages = images;
        if (this.pickedImages.size === 0) {
            this.hideChatView();
        }
    }

    @action.bound
    deleteVideo() {
        this.pickedVideo = null;
        this.hideChatView();
    }

    @action.bound
    onSendTextMessage() {
        let incomingMessage = this.constructorSendMessage();
        incomingMessage.text = this.textMessage;
        this.textMessage = '';
        this.appendMessage(incomingMessage);
        console.log('chatId', this.chatId);
        this.createMessage({
            user_id: userStore.me.id,
            chat_id: this.chatId,
            message: incomingMessage.text,
        });

        // var data = new FormData();
        // data.append('text', incomingMessage.text);
        // data.append('room_id', this.roomId);
        // data.append('type', 0);
        // const config = {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'multipart/form-data',
        //         Authorization: 'Bearer ' + userStore.me.token,
        //     },
        //     body: data,
        // };
        // console.log('config', config);
        // fetch(Config.ServerRoot + '/api/messages', config)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log('data', data);
        //     })
        //     .catch(err => {
        //         console.log('err', err);
        //     });
    }

    @action.bound
    async onSendImageMessage() {
        [...this.pickedImages].map((elem, index) => {
            let incomingMessage = this.constructorSendMessage();
            incomingMessage.image = elem.path;
            this.deleteImage(elem);
            this.appendMessage(incomingMessage);
            console.log('userStore.me.token', userStore.me.token);
            console.log('elemelemelem', elem);
            console.log('this.roomId', this.roomId);
            var data = new FormData();
            data.append('file', {
                uri: elem.path,
                name: 'avatar.jpg',
                type: elem.mime,
            });
            data.append('room_id', this.roomId);
            data.append('type', 1);
            const config = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + userStore.me.token,
                },
                body: data,
            };
            console.log('config', config);
            fetch(Config.ServerRoot + '/api/messages', config)
                .then(response => response.json())
                .then(data => {
                    console.log('data', data);
                })
                .catch(err => {
                    console.log('err', err);
                });
        });
    }

    @action.bound
    onSendVideoMessage() {
        let incomingMessage = this.constructorSendMessage();
        incomingMessage.video = this.pickedVideo;
        this.deleteVideo();
        this.appendMessage(incomingMessage);
    }

    @action.bound
    onSendAudioMessage(audioMessage) {
        console.log('audioMessage', audioMessage);
        let incomingMessage = this.constructorSendMessage();
        incomingMessage.audio = audioMessage;
        this.appendMessage(incomingMessage);

        var data = new FormData();
        data.append('file', {
            uri: ISIOS ? audioMessage.audioFilePath : 'file://' + audioMessage.audioFilePath,
            name: 'test.aac',
            type: 'audio/aac',
        });
        data.append('room_id', this.roomId);
        data.append('type', 1);
        const config = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + userStore.me.token,
            },
            body: data,
        };
        console.log('config', config);
        fetch(Config.ServerRoot + '/api/messages', config)
            .then(response => response.json())
            .then(data => {
                console.log('data', data);
            })
            .catch(err => {
                console.log('err', err);
            });
    }
}

export default new ChatStore();
