'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import { PageContainer } from '@src/components';

class UserAgreementScreen extends Component {
    render() {
        return (
            <PageContainer title="用户协议" white>
                <ScrollView style={styles.container}>
                    <View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
                        <Text style={styles.title}>
                            {Config.AppName}
                            用户协议
                        </Text>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>1、导言</Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                欢迎您使用
                                {Config.AppName}
                                软件及相关服务！
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                “{Config.AppName}
                                ”软件及相关服务,系指公司通过合法拥有并运营的、标注名称为“
                                {Config.AppName}
                                ”的客户端应用程序向您提供的产品与服务,包括但不限于图片、文字、短视频发布、浏览及推荐等功能,以及连接人与信息的新型服务。《
                                {Config.AppName}
                                用户使用协议》（以下简称“本协议”）是您与公司之间就您注册、登录、使用（以下统称“使用”）“
                                {Config.AppName}
                                ”软件及相关服务所订立的协议。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                为了更好地为您提供服务,请您在开始使用“
                                {Config.AppName}
                                ”软件及相关服务之前,务必认真阅读并充分理解本协议,特别是涉及免除或者限制责任的条款、权利许可和信息使用的条款、同意开通和使用特殊单项服务的条款、法律适用和争议解决条款等。其中,免除或者限制责任条款等重要内容将以加粗形式提示您注意,您应重点阅读。如您未满18周岁,请您在法定监护人陪同下仔细阅读并充分理解本协议,并征得法定监护人的同意后使用“
                                {Config.AppName}
                                ”软件及相关服务。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>
                                除非您接受本协议的全部内容,否则您将无法正常注册、登录、使用（以下统称“使用”）“
                                {Config.AppName}
                                ”软件及相关服务。一旦您使用“
                                {Config.AppName}
                                ”软件及相关服务,则视为您已充分理解本协议,并同意作为本协议的一方当事人接受本协议以及其他与“
                                {Config.AppName}
                                ”软件及相关服务相关的协议和规则（包括但不限于《隐私政策》）的约束。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>
                                2、 “{Config.AppName}
                                ”软件及相关服务
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                2.1 您使用“
                                {Config.AppName}
                                ”软件及相关服务,可以通过预装、公司已授权的第三方下载等方式获取“
                                {Config.AppName}
                                ”客户端应用程序。若您并非从公司或经公司授权的第三方获取本软件的,公司无法保证非官方版本的“
                                {Config.AppName}
                                ”软件能够正常使用,您因此遭受的损失与公司无关。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                2.2
                                公司可能为不同的终端设备开发了不同的应用程序软件版本,您应当根据实际设备状况获取、下载、安装合适的版本。如您不再使用“
                                {Config.AppName}
                                ”软件及相关服务,您也可自行卸载相应的应用程序软件。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                2.3 为更好的提升用户体验及服务,公司将不定期提供“
                                {Config.AppName}
                                ”软件及相关服务的更新或改变（包括但不限于软件修改、升级、功能强化、开发新服务、软件替换等）,您可根据自行需要更新相应的版本。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>
                                为保证“
                                {Config.AppName}
                                ”软件及相关服务安全、提升用户服务,在“
                                {Config.AppName}
                                ”软件及相关服务的部分或全部更新后,公司将在可行的情况下以妥当的方式（包括但不限于系统提示、公告、站内信等）提示您,您有权选择接受更新后的版本；如您选择不作更新,“
                                {Config.AppName}
                                ”软件及相关服务的部分功能将受到限制或不能正常使用
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>3、关于“账号”</Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                3.1 “{Config.AppName}
                                ”软件及相关服务为您提供了注册通道,您有权选择合法且符合公司要求的字符组合作为自己的账号,并自行设置符合安全要求的密码。用户设置的账号、密码是用户用以登录并以注册用户身份使用“
                                {Config.AppName}
                                ”软件及相关服务的凭证。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                3.2
                                您理解并承诺,您所设置的账号不得违反国家法律法规及公司的相关规则,您的账号名称、头像和简介等注册信息及其他个人信息中不得出现违法和不良信息,未经他人许可不得用他人名义（包括但不限于冒用他人姓名、名称、字号、头像等足以让人引起混淆的方式）开设账号,不得恶意注册“
                                {Config.AppName}
                                ”账号（包括但不限于频繁注册、批量注册账号等行为）。您在账号注册及使用过程中需遵守相关法律法规,不得实施任何侵害国家利益、损害其他第三方合法权益,有害社会道德风尚的行为。公司有权对您提交的注册信息进行审核。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                3.3
                                您的账号仅限于您本人使用,未经公司书面同意,禁止以任何形式赠与、借用、出租、转让、售卖或以其他方式许可他人使用该账号。如果公司发现或者有合理理由认为使用者并非账号初始注册人,公司有权在未通知您的情况下,暂停或终止向该注册账号提供服务,并注销该账号。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                3.4
                                您有责任维护个人账号、密码的安全性与保密性,并对您以注册账号名义所从事的活动承担全部法律责任,包括但不限于您在“
                                {Config.AppName}
                                ”软件及相关服务上进行的任何数据修改、信息发布、款项支付等操作行为可能引起的一切法律责任。您应高度重视对账号与密码的保密,在任何情况下不向他人透露账号及密码。若发现他人未经许可使用您的账号或发生其他任何安全漏洞问题时,您应当立即通知公司。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                3.5在丢失账号或遗忘密码时,您可遵照公司的申诉途径及时申诉请求找回账号或密码。您理解并认可,公司的密码找回机制仅需要识别申诉单上所填资料与系统记录资料具有一致性,而无法识别申诉人是否系真正账号有权使用者。公司特别提醒您应妥善保管您的账号和密码。当您使用完毕后,应安全退出。如因您保管不当等自身原因或其他不可抗因素导致遭受盗号或密码丢失,您将自行承担相应责任。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>4、 用户行为规范</Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>
                                您应当对您使用本产品及相关服务的行为负责,除非法律允许或者经公司事先书面许可,您使用“
                                {Config.AppName}
                                ”软件及相关服务不得具有下列行为：
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                4.1 使用未经公司授权或许可的任何插件、外挂、系统或第三方工具对“
                                {Config.AppName}
                                ”软件及相关服务的正常运行进行干扰、破坏、修改或施加其他影响。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                4.2 利用或针对“
                                {Config.AppName}
                                ”软件及相关服务进行任何危害计算机网络安全的行为
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                4.3
                                在任何情况下,如果公司有理由认为您的任何行为违反或可能违反上述约定的,公司可独立进行判断并处理,且有权在不进行任何事先通知的情况下终止向您提供服务,并追究相关法律责任。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>
                                4.4
                                公司致力使跟帖评论成为文明、理性、友善、高质量的意见交流。在推动跟帖评论业务发展的同时,不断加强相应的信息安全管理能力,完善跟帖评论自律,切实履行社会责任,遵守国家法律法规,尊重公民合法权益,尊重社会公序良俗。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>
                                4.5
                                您评论、发布、传播的内容应自觉遵守宪法法律、法规、遵守公共秩序,尊重社会公德、社会主义制度、国家利益、公民合法权益、道德风尚和信息真实性等要求。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>
                                4.6
                                公司设立公众投诉、举报平台,您可按照公司公示的投诉举报制度向公司投诉、举报各类违法违规行为、违法传播活动、违法有害信息等内容,公司将及时受理和处理您的投诉举报,以共同营造风清气正的网络空间。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>5、知识产权</Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                5.1 公司在“
                                {Config.AppName}
                                ”软件及相关服务中提供的内容（包括但不限于软件、技术、程序、网页、文字、图片、图像、音频、视频、图表、版面设计、电子文档等）的知识产权属于公司所有。公司提供本服务时所依托的软件的著作权、专利权及其他知识产权均归公司所有。未经公司许可,任何人不得擅自使用（包括但不限于通过任何机器人、蜘蛛等程序或设备监视、复制、传播、展示、镜像、上载、下载）“
                                {Config.AppName}
                                ”软件及相关服务中的内容。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                5.2 您理解并同意,在使用“
                                {Config.AppName}
                                ”软件及相关服务时发布上传的文字、图片、视频、音频等均由您原创或已获合法授权。您通过“
                                {Config.AppName}
                                ”上传、发布的任何内容的知识产权归属您或原始著作权人所有。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                5.3 您知悉、理解并同意您通过“
                                {Config.AppName}
                                ”软件及相关服务发布上传的内容,授权公司及其关联公司、控制公司可在全球范围内、免费、非独家、可转授权地使用,使用范围包括但不限于在当前或其他网站、应用程序、产品或终端设备等,并授权公司及其关联公司、控制公司对相应内容可进行修改、复制、改编、翻译、汇编或制作衍生产品。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                5.4
                                您确认并同意授权公司以公司自己的名义或委托专业第三方对侵犯您上传发布的享有知识产权的内容进行代维权,维权形式包括但不限于：监测侵权行为、发送维权函、提起诉讼或仲裁、调解、和解等,公司有权对维权事宜做出决策并独立实施。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                5.5 公司为“
                                {Config.AppName}
                                ”开发、运营提供技术支持,并对“
                                {Config.AppName}
                                ”软件及相关服务的开发和运营等过程中产生的所有数据和信息等享有法律法规允许范围内的全部权利。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>6、免责声明</Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                6.1 您理解并同意,“
                                {Config.AppName}
                                ”软件及相关服务可能会受多种因素的影响
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                6.2对于涉嫌借款、理财或其他涉财产的网络信息、账户密码、广告或推广等信息的,请您谨慎对待并自行进行判断,基于前述原因您因此遭受的财产、利润、商业信誉、资料损失或其他有形或无形损失,公司不承担任何直接、间接、附带、特别、衍生性或惩罚性的赔偿责任
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                6.3 您理解并同意,在使用“
                                {Config.AppName}
                                ”软件及相关服务过程中,可能遇到不可抗力等因素（不可抗力是指不能预见、不能克服并不能避免的客观事件）,包括但不限于政府行为、监管政策、自然灾害、网络原因、黑客攻击、战争或任何其它类似事件。出现不可抗力情况时,公司将努力在第一时间及时修复,但因不可抗力给您造成暂停、中止、终止服务或造成任何损失的,您同意公司不承担任何法律责任。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                6.4
                                公司依据本协议约定获得处理违法违规内容的权利,该权利不构成公司的义务或承诺,公司不能保证及时发现违法行为或进行相应处理。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.tintFont}>
                                6.5 您理解并同意,关于“
                                {Config.AppName}
                                ”软件及相关服务,公司不提供任何种类的明示或暗示担保或条件,包括但不限于商业适售性、特定用途适用性等。您对“
                                {Config.AppName}
                                ”软件及相关服务的使用行为必须自行承担相应风险。
                            </Text>
                        </View>
                        <View style={styles.fontWrap}>
                            <Text style={styles.darkFont}>
                                6.6
                                您理解并同意,本协议是在保障遵守国家法律法规、维护公序良俗,保护他人合法权益,公司在能力范围内尽最大的努力按照相关法律法规进行判断,但并不保证公司判断完全与司法机关、行政机关的判断一致,如因此产生的后果您已经理解并同意自行承担。
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    fontWrap: {
        marginTop: 10,
    },
    title: {
        fontSize: font(18),
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 10,
        color: Theme.defaultTextColor,
    },
    darkFont: {
        fontSize: font(15),
        lineHeight: 20,
        color: Theme.subTextColor,
    },
    tintFont: {
        fontSize: font(15),
        lineHeight: 20,
        color: Theme.subTextColor,
    },
});

export default UserAgreementScreen;
