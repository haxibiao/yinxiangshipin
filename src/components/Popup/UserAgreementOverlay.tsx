import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ViewStyle, ScrollView } from 'react-native';
import { appStore, RecordKeys, Storage } from '@src/store';
import SafeText from '../Basic/SafeText';
// import Row from '../Basic/Row';

import { Overlay } from 'teaset';

type multipleChoiceProps = {
    children?: any;
    style?: ViewStyle;
    start: boolean;
    onPress: (start: boolean) => void;
};

const UserAgreementOverlayView = (props: any) => {
    const { hide, refused } = props;
    const [IsChoice, setIsChoice] = useState(true);
    const [isAgr, setisAgr] = useState(true);

    return (
        <View style={styles.overlayView}>
            <ScrollView contentContainerStyle={styles.agreementContent} showsVerticalScrollIndicator={false}>
                <SafeText style={styles.title}>用户协议与社区内容公约</SafeText>
                <View>
                    <Text style={styles.tintFont}>感谢您信任并使用{Config.AppName}</Text>
                </View>
                <View>
                    <Text style={styles.tintFont}>
                        {`您制作、评论、发布、传播的信息(包括但不限于随拍或上传至“${
                            Config.AppName
                        }”平台的未公开的私密视频)应自觉遵守法律法规、社会主义制度、国家利益、公民合法权益、社会公共秩序、道德风尚和信息真实性等"七条底线”要求，否则公司有权立即采取相应处理措施。您同意并承诺不制作、复制、发布、传播下列信息:
(1)反对宪法确定的基本原则的;
(2)危害国家安全，泄露国家秘密的;
(3)颠覆国家政权，推翻社会主义制度，煽动分裂国家，破坏国家统一的;
(4)损害国家荣誉和利益的;
(5)宣扬恐怖主义、极端主义的;
(6)宣扬民族仇恨、民族歧视，破坏民族团结的;
(7)煽动地域歧视、地域仇恨的;
(8)破坏国家宗教政策，宣扬邪教和封建迷信的;
(9)编造、散布谣言、虚假信息，扰乱经济秩序和社会秩序、破坏社会稳定的;
(10)散布、传播淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的;
(11)危害网络安全、利用网络从事危害国家安全、荣誉和利益的;
(12)侮辱或者诽谤他人，侵害他人合法权益的;
(13)对他人进行暴力恐吓、威胁，实施人肉搜索的;
(14)涉及他人隐私、个人信息或资料的;
(15)散布污言秽语，损害社会公序良俗的;
(16)侵犯他人隐私权、名誉权、肖像权、知识产权等合法权益内容的;
(17)散布商业广告，或类似的商业招揽信息、过度营销信息及垃圾信息;
(18)使用本网站常用语言文字以外的其他语言文字评论的;
(19)与所评论的信息毫无关系的;
(20)所发表的信息毫无意义的，或刻意使用字符组合以逃避技术审核的;
(21)侵害未成年人合法权益或者损害未成年人身心健康的;
(22)未获他人允许，偷拍、偷录他人，侵害他人合法权
(23)包含恐怖、暴力血腥、高危险性、危害表演者自身或他人身心健康内容的，包括但不限于以下情形:
    i.任何暴力和/或自残行为内容;
    ii.任何威胁生命健康、利用刀具等危险器械表演的危及自身或他人人身及/或财产权利的内容;
    i.怂恿、诱导他人参与可能会造成人身伤害或导致死亡的危险或违法活动的内容;
其他含有违反法律法规、政策及公序良俗、干扰"${Config.AppName}"正常运营或侵犯其他用户或第三方合法权益内容的信息。
`}
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.bottomBtn, { borderColor: '#EAEAEA', borderRightWidth: pixel(0.5) }]}
                    onPress={refused}>
                    <SafeText style={{ marginRight: 5, color: '#191919', fontWeight: 'bold' }}>不同意</SafeText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBtn} onPress={hide}>
                    <SafeText style={{ marginRight: 5, color: Theme.primaryColor, fontWeight: 'bold' }}>
                        我同意
                    </SafeText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

var isShow: any = null;
const UserAgreementOverlay = (onHide?: () => void, onRefused?: () => void) => {
    let overlayRef: any;
    if (!isShow) {
        isShow = Overlay.show(
            <Overlay.View
                style={styles.overlay}
                modal={true}
                ref={(ref: any) => {
                    overlayRef = ref;
                }}>
                <UserAgreementOverlayView
                    hide={() => {
                        appStore.setAppStorage(RecordKeys.agreeCreatePostAgreement, true);
                        appStore.agreeCreatePostAgreement = true;
                        overlayRef.close();
                        onHide && onHide();
                        isShow = null;
                    }}
                    refused={() => {
                        overlayRef.close();
                        onRefused && onRefused();
                        isShow = null;
                    }}
                />
            </Overlay.View>,
        );
    }
};

const styles = StyleSheet.create({
    overlay: { alignItems: 'center', justifyContent: 'center' },
    overlayView: {
        marginHorizontal: '10%',
        minHeight: '50%',
        maxHeight: '60%',
        padding: pixel(10),
        paddingHorizontal: 0,
        borderRadius: pixel(10),
        backgroundColor: '#FFF',
    },
    textLink: {
        color: '#259',
        fontSize: font(13),
    },
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    contentView: {
        backgroundColor: '#FFF',
        borderRadius: pixel(10),
        overflow: 'hidden',
        height: Device.WIDTH,
        width: Device.WIDTH * 0.8,
    },
    footer: {
        height: pixel(46),
        backgroundColor: '#FFF',
        borderColor: '#EAEAEA',
        borderTopWidth: pixel(0.5),
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    bottomBtn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    agreementContent: {
        flexGrow: 1,
        backgroundColor: '#FFF',
        padding: pixel(Theme.edgeDistance),
    },
    title: {
        color: '#212121',
        fontSize: font(16),
        fontWeight: 'bold',
        marginBottom: pixel(10),
        textAlign: 'center',
    },
    tintFont: {
        color: '#969696',
        fontSize: font(15),
        lineHeight: font(22),
        marginVertical: pixel(2),
    },
    link: {
        color: '#00B1FE',
        fontSize: font(15),
        lineHeight: font(22),
    },
});

export default UserAgreementOverlay;
