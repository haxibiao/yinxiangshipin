import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { PageContainer, SafeText } from '@src/components';
export default function UserAgreementScreen() {
    return (
        <PageContainer title="用户协议" white titleStyle={{ fontSize: font(14) }}>
            <ScrollView style={styles.container}>
                <View style={{ paddingHorizontal: 15 }}>
                    <SafeText style={styles.title}>
                        {Config.AppName}
                        用户协议
                    </SafeText>
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
                            ”软件及相关服务，系指近邻乐（深圳）有限责任公司（以下简称“公司”）合法拥有并运营的、标注名称为“
                            {Config.AppName}
                            ”的客户端应用程序（同时含其简化版等不同版本）向您提供的产品与服务，包括但不限于个性化音视频推荐、视频播放、发布信息、交流互动、搜索查询等核心功能及其他功能。《“
                            {Config.AppName}
                            ”用户服务协议》（以下称“本协议”）是您与公司就您下载、安装、使用（以下统称“使用”）“
                            {Config.AppName}”软件，并获得“{Config.AppName}”软件提供的相关服务所订立的协议。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            为了更好地为您提供服务，请您在开始使用“{Config.AppName}
                            ”软件及相关服务之前，认真阅读并充分理解本协议，特别是涉及免除或者限制责任的条款、权利许可和信息使用的条款、同意开通和使用特殊单项服务的条款、法律适用和争议解决条款等。
                            <Text style={{ color: '#000' }}>
                                其中，免除或者限制责任条款等重要内容将以加粗形式提示您注意，您应重点阅读。如您未满 18
                                周岁，请您在法定监护人陪同下仔细阅读并充分理解本协议，并征得法定监护人的同意后使用“
                                {Config.AppName}”软件及相关服务。
                            </Text>
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            如您不同意本协议，这将导致公司无法为您提供完整的产品和服务，您也可以选择停止使用。如您自主选择同意或使用“
                            {Config.AppName}
                            ”软件及相关服务，则视为您已充分理解本协议，并同意作为本协议的一方当事人接受本协议以及其他与“
                            {Config.AppName}”软件及相关服务相关的协议和规则（包括但不限于《“{Config.AppName}
                            ”隐私政策》）的约束。 公司有权依“{Config.AppName}
                            ”软件及相关服务或运营的需要单方决定，安排或指定其关联公司、控制公司、继承公司或公司认可的第三方公司继续运营“
                            {Config.AppName}
                            ”软件。并且，就本协议项下涉及的某些服务，可能会由公司的关联公司、控制公司、继承公司或公司认可的第三方公司向您提供。您知晓并同意接受相关服务内容，即视为接受相关权利义务关系亦受本协议约束。
                        </Text>
                    </View>
                    <Text style={[styles.darkFont, { marginTop: pixel(8) }]}>
                        如对本协议内容有任何疑问、意见或建议，您可通过发送邮件至yangliu@haxifang.com与公司联系。
                    </Text>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>
                            2、 “{Config.AppName}
                            ”软件及相关服务
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.1 您使用“{Config.AppName}”软件及相关服务，可以通过预装、公司已授权的第三方下载等方式获取“
                            {Config.AppName}”客户端应用程序。
                            <Text style={{ color: '#000' }}>
                                若您并非从公司或经公司授权的第三方获取“{Config.AppName}
                                ”软件的，公司无法保证非官方版本的“{Config.AppName}
                                ”软件能够正常使用，您因此遭受的损失与公司无关。
                            </Text>
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.2
                            公司可能为不同的终端设备开发不同的应用程序软件版本，您应当根据实际设备状况获取、下载、安装合适的版本。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.3 您可根据需要自行使用“{Config.AppName}”软件及相关服务或更新“{Config.AppName}
                            ”版本，如您不再需要使用“{Config.AppName}”软件及相关服务，您也可自行卸载相应的应用程序软件。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.4 为更好的提升用户体验及服务，公司将不定期提供“{Config.AppName}
                            ”软件及相关服务的更新或改变（包括但不限于软件修改、升级、功能强化、开发新服务、软件替换等），您可根据需要自行选择是否更新相应的版本。为保证“
                            {Config.AppName}”软件及相关服务安全、提升用户服务，“{Config.AppName}
                            ”软件及相关服务部分或全部更新后，公司将在可行情况下以适当方式（包括但不限于系统提示、公告、站内信等）提示您，您有权选择接受更新后版本；如您选择不作更新，则“
                            {Config.AppName}”软件及相关服务的部分功能将受到限制或不能正常使用。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.5 除非得到公司明示事先书面授权，您不得以任何形式对“{Config.AppName}
                            ”软件及相关服务进行包括但不限于改编、复制、传播、垂直搜索、镜像或交易等未经授权的访问或使用。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.6 您理解，您使用“{Config.AppName}
                            ”软件及相关服务需自行准备与软件及相关服务有关的终端设备（如电脑、手机等装置），一旦您在您终端设备中打开“
                            {Config.AppName}”软件，即视为您使用“{Config.AppName}”软件及相关服务。为充分实现“
                            {Config.AppName}
                            ”的全部功能，您可能需要将您的终端设备联网，您理解您应自行承担所需要的费用（如流量费、上网费等）。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.7 公司许可您一项个人的、可撤销的、不可转让的、非独占地和非商业的合法使用“{Config.AppName}
                            ”软件及相关服务的权利。本协议未明示授权的其他一切权利仍由公司保留，您在行使该些权利前须另行获得公司的书面许可，同时公司如未行使前述任何权利，并不构成对该权利的放弃。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.8 您需要注册才可以开始使用“{Config.AppName}
                            ”软件及相关服务。同时，您也理解，为使您更好地使用“{Config.AppName}
                            ”软件及相关服务，保障您的账号安全，某些功能和/或某些单项服务项目，如评论服务、视频播放服务等，要求您按照国家相关法律法规的规定，提供真实的身份信息实名注册并登录后方可使用。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            2.9 如您发现“{Config.AppName}
                            ”客户端或官方网站内存在任何侵犯您权利的内容，请立即通过邮箱yangliu@haxifang.com的方式通知公司，提供您有相关权利的证据，公司将会依据相关法律规定及时处理您的投诉。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>3、关于“账号”</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            3.1 “{Config.AppName}
                            ”软件及相关服务为您提供了注册和登陆通道，您有权选择手机号注册登陆。用户选择的手机号账号是用户用以登录并以注册用户身份使用“
                            {Config.AppName}”软件及相关服务的凭证。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>3.2账号注销</Text>
                        <Text style={styles.tintFont}>
                            在需要终止使用“ {Config.AppName}”账号服务时，符合以下条件的，您可以申请注销您的“
                            {Config.AppName}”账号：
                        </Text>
                        <Text style={styles.tintFont}>
                            （1）您仅能申请注销您本人的账号，并依照“{Config.AppName}”的流程进行注销；
                        </Text>
                        <Text style={styles.tintFont}>
                            （2）您仍应对您在注销账号前且使用“{Config.AppName}”服务期间的行为承担相应责任；
                        </Text>
                        <Text style={styles.tintFont}>
                            （3）除法律法规另有规定外，注销成功后，您曾通过该账号使用的我们的产品与服务下的所有内容、信息、数据、记录将会被删除或匿名化处理。
                            如您需要注销您的“{Config.AppName}
                            ”账号，您可以在应用内的设置-账号安全页面，按提示进行注销操作。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            3.3 您理解并承诺，您所设置的账号不得违反国家法律法规及“{Config.AppName}
                            ”的相关规则，您的账号名称、头像和简介等注册信息及其他个人信息中不得出现违法和不良信息，未经他人许可不得用他人名义（包括但不限于冒用他人姓名、名称、字号、头像等或采取其他足以让人引起混淆的方式）开设账号，不得恶意注册“
                            {Config.AppName}
                            ”账号（包括但不限于频繁注册、批量注册账号等行为）。您在账号注册及使用过程中需遵守相关法律法规，不得实施任何侵害国家利益、损害其他公民合法权益，有害社会道德风尚的行为。公司有权对您提交的注册信息进行审核。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            3.4 您在“{Config.AppName}
                            ”中的注册账号仅限于您本人使用，未经公司书面同意，禁止以任何形式赠与、借用、出租、转让、售卖或以其他方式许可他人使用该账号。如果公司发现或者有合理理由认为使用者并非账号初始注册人，为保障账号安全，公司有权立即暂停或终止向该注册账号提供服务，并有权永久禁用该账号。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            3.5
                            您有责任维护个人账号的安全性与保密性，并对您以注册账号名义所从事的活动承担全部法律责任，包括但不限于您在“
                            {Config.AppName}
                            ”软件及相关服务上进行的任何数据修改、言论发表、款项支付等操作行为可能引起的一切法律责任。您应高度重视对账号的保密，在任何情况下不向他人透露账号。若发现他人未经许可使用您的账号或发生其他任何安全漏洞问题时，您应当立即通知公司。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            3.6
                            在注册、使用和管理账号时，您应保证注册账号时填写的身份信息的真实性，请您在注册、管理账号时使用真实、准确、合法、有效的相关身份证明材料及必要信息（包括您的手机号等）。依照国家法律法规的规定，为使用“
                            {Config.AppName}
                            ”软件及相关服务的部分功能，您需要填写真实的身份信息，请您按照相关法律规定完成实名认证，并注意及时更新上述相关信息。若您提交的材料或提供的信息不准确、不真实、不规范、不合法或者公司有理由怀疑为错误、不实或不合法的资料，则公司有权拒绝为您提供相关服务，您可能无法使用“
                            {Config.AppName}”软件及相关服务或在使用过程中部分功能受到限制。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            3.7 除自行注册“{Config.AppName}
                            ”账号外，您也可选择通过授权使用您合法拥有的包括但不限于公司和/或其关联方其他软件或平台用户账号，以及实名注册的第三方软件或平台用户账号登录使用“
                            {Config.AppName}
                            ”软件及相关服务，但第三方软件或平台对此有限制或禁止的除外。当您以前述已有账号登录使用的，应保证相应账号已进行实名注册登记，并同样适用本协议中的相关条款。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            3.8 您理解并同意，除您登录、使用“{Config.AppName}”软件及相关服务外，您还可以用“
                            {Config.AppName}”账号登录使用公司及其关联方或其他合作方提供的其他软件、服务。您以“
                            {Config.AppName}
                            ”账号登录并使用前述服务的，同样应受其他软件、服务实际提供方的用户协议及其他协议条款约束。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            3.9 为提高您内容曝光量及发布效率，您同意您在“{Config.AppName}
                            ”软件及相关服务的账号及相应账号所发布的全部内容均授权公司以您的账号自动同步发布至公司及/或关联方运营的其他软件及网站。您在“
                            {Config.AppName}”软件/网站发布、修改、删除内容的操作，均会同步到上述其他软件及网站。
                            您通过已注册或者已同步的账号登录公司及/或关联方运营的系列客户端软件产品及网站时（如有），应遵守该软件产品及网站自身的用户协议及其他协议条款的规定。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            3.10 当您完成“{Config.AppName}
                            ”的账号注册、登录并进行合理和必要的身份验证后，您可随时浏览、修改自己提交的个人身份信息。
                            <Text style={{ color: '#000' }}>
                                您理解并同意，出于安全性和身份识别的考虑，您可能无法修改注册时提供的初始注册信息及其他验证信息。
                            </Text>
                            您也可以申请注销账号，公司会在完成个人身份、安全状态、设备信息、侵权投诉等方面的合理和必要的验证后协助您注销账号，您曾通过该账号使用的我们的产品与服务下的所有内容、信息、数据、记录将会被删除或匿名化处理，法律法规另有规定的除外。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>4、 用户个人信息获取及保护</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            4.1
                            个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。14
                            岁以下（含）儿童的个人信息属于个人敏感信息。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            我们提供的产品和服务需要依赖您的部分信息才得以运行，因此在您使用{Config.AppName}
                            的时候，需要向我们提供或允许我们收集的必要信息以供我们使用这些信息向您提供基本服务及更优更好的个性化服务，包括：
                        </Text>
                        <Text style={styles.tintFont}>
                            （1）为了帮助您成为我们的用户，需要获取您的
                            <Text>电话号码以及手机设备号</Text>
                            ，以用于注册、登录{Config.AppName}账户使用{Config.AppName}
                            产品和服务，及我们的客服和售后为您提供咨询服务，并保障您的账户安全。如不提供，您将仅能浏览、了解
                            {Config.AppName}，无法享受相关服务；如果您仅需使用浏览、了解{Config.AppName}
                            ，您不需要注册成为我们的用户及提供上述信息；
                        </Text>
                        <Text style={styles.tintFont}>
                            (2）便于我们向您提供服务，您填写的个人资料，包括您的
                            <Text style={{ color: '#000' }}>姓名或昵称、性别、个人简介</Text>
                            以用于评论互动、随机推荐题目，您可以根据是否需要个性化服务选择是否提供上述信息；如不提供，不会影响您使用本产品的其他功能和服务。
                        </Text>
                        <Text style={styles.tintFont}>
                            (3)
                            当您与我们联系时，我们可能会保存您的通信或通话记录和内容或您留下的联系方式，以便帮助您解决问题，或记录相关问题的处理方案及结果。我们的客服会使用您的帐号信息与您核验您的身份。您有可能会在与我们的客服人员沟通时，提供给出上述信息外的其他信息。如不提供，不会影响您使用本产品的其他功能和服务。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            4.2 公司与您一同致力于您个人信息（即能够独立或与其他信息结合后识别您身份的信息）的保护。
                            保护用户个人信息是公司的基本原则之一，在使用“{Config.AppName}
                            ”软件及相关服务的过程中，您可能需要提供您的个人信息（包括但不限于您的手机号、位置信息、设备信息等），以便公司向您提供更好的服务和相应的技术支持。公司将依法保护您浏览、修改、删除相关个人信息以及撤回授权的权利，并将运用加密技术、匿名化处理等其他与“
                            {Config.AppName}”软件及相关服务相匹配的技术措施及其他安全措施保护您的个人信息。
                            更多关于您个人信息保护的内容，请参看《{Config.AppName}隐私政策》。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>5、用户行为规范</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>5.1 用户行为要求</Text>
                        <Text style={styles.tintFont}>
                            您应对您使用“{Config.AppName}
                            ”软件及相关服务的行为负责，除非法律允许或者经公司事先书面许可，您使用“{Config.AppName}
                            ”软件及相关服务不得具有下列行为：
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            5.1.1 使用未经公司授权或许可的任何插件、外挂、系统或第三方工具对“{Config.AppName}
                            ”软件及相关服务的正常 运行进行干扰、破坏、修改或施加其他影响。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            5.1.2 利用或针对“{Config.AppName}
                            ”软件及相关服务进行任何危害计算机网络安全的行为，包括但不限于：
                        </Text>
                        <Text style={styles.tintFont}>
                            （1）非法侵入网络、干扰网络正常功能、窃取网络数据等危害网络安全的活动；
                        </Text>
                        <Text style={styles.tintFont}>
                            （2）提供专门用于从事侵入网络、干扰网络正常功能及防护措施、窃取网络数据等危害网络安全活动的程序、工具；
                        </Text>
                        <Text style={styles.tintFont}>
                            （3）明知他人从事危害网络安全的活动的，为其提供技术支持、广告推广、支付结算等帮助；
                        </Text>
                        <Text style={styles.tintFont}>（4）使用未经许可的数据或进入未经许可的服务器/账号；</Text>
                        <Text style={styles.tintFont}>
                            （5）未经允许进入公众计算机网络或者他人计算机系统并删除、修改、增加存储信息；
                        </Text>
                        <Text style={styles.tintFont}>
                            （6）未经许可，企图探查、扫描、测试“{Config.AppName}
                            ”系统或网络的弱点或其它实施破坏网络安全的行为；
                        </Text>
                        <Text style={styles.tintFont}>
                            （7）企图干涉、破坏“{Config.AppName}
                            ”系统或网站的正常运行，故意传播恶意程序或病毒以及其他破坏干扰正常网络信息服务的行为；
                        </Text>
                        <Text style={styles.tintFont}>（8）伪造 TCP/IP 数据包名称或部分名称；</Text>
                        <Text style={styles.tintFont}>
                            （9）恶意注册“{Config.AppName}”账号，包括但不限于频繁、批量注册账号；
                        </Text>
                        <Text style={styles.tintFont}>
                            （10）对“{Config.AppName}”软件及相关服务进行反向工程、反向汇编、编译或者以其他方式尝试发现“
                            {Config.AppName}”软件及相关服务的源代码；
                        </Text>
                        <Text style={styles.tintFont}>
                            （11）违反法律法规、本协议、公司的相关规则及侵犯他人合法权益的其他行为。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            5.1.3
                            如果公司有理由认为您的行为违反或可能违反上述约定的，公司可独立进行判断并处理，且在任何时候有权在不事先通知的情况下终止向您提供服务，并依法追究相关责任。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>5.2 信息内容规范</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            5.2.1 您按规定完成实名认证后，可以以注册账号或“{Config.AppName}”合作平台账号登录“
                            {Config.AppName}”发布信息、互动交流、评论等。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            5.2.2
                            公司致力使发布信息、互动交流成为文明、理性、友善、高质量的意见交流。在推动发布信息、互动交流业务发展的同时，不断加强相应的信息安全管理能力，完善发布信息、互动交流自律，切实履行社会责任，遵守国家法律法规，尊重公民合法权益，尊重社会公序良俗。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            5.2.3 您制作、评论、发布、传播的信息（包括但不限于上传至“{Config.AppName}
                            ”平台的未公开的私密图片、视频等）应自觉遵守法律法规、社会主义制度、国家利益、公民合法权益、社会公共秩序、道德风尚和信息真实性等“七条底线”要求，否则公司有权立即采取相应处理措施。您同意并承诺不制作、复制、发布、传播下列信息：
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>（1）反对宪法确定的基本原则的；</Text>
                        <Text style={styles.tintFont}>（2）危害国家安全，泄露国家秘密的；</Text>
                        <Text style={styles.tintFont}>
                            （3）颠覆国家政权，推翻社会主义制度，煽动分裂国家，破坏国家统一的；
                        </Text>
                        <Text style={styles.tintFont}>（4）损害国家荣誉和利益的；</Text>
                        <Text style={styles.tintFont}>（5）宣扬恐怖主义、极端主义的；</Text>
                        <Text style={styles.tintFont}>（6）宣扬民族仇恨、民族歧视，破坏民族团结的；</Text>
                        <Text style={styles.tintFont}>（7）煽动地域歧视、地域仇恨的；</Text>
                        <Text style={styles.tintFont}>（8）破坏国家宗教政策，宣扬邪教和封建迷信的；</Text>
                        <Text style={styles.tintFont}>
                            （9）编造、散布谣言、虚假信息，扰乱经济秩序和社会秩序、破坏社会稳定的；
                        </Text>
                        <Text style={styles.tintFont}>
                            （10）散布、传播淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
                        </Text>
                        <Text style={styles.tintFont}>
                            （11）危害网络安全、利用网络从事危害国家安全、荣誉和利益的；
                        </Text>
                        <Text style={styles.tintFont}>（12）侮辱或者诽谤他人，侵害他人合法权益的；</Text>

                        <Text style={styles.tintFont}>（13）对他人进行暴力恐吓、威胁，实施人肉搜索的；</Text>
                        <Text style={styles.tintFont}>（14）涉及他人隐私、个人信息或资料的；</Text>
                        <Text style={styles.tintFont}>（15）散布污言秽语，损害社会公序良俗的；</Text>
                        <Text style={styles.tintFont}>
                            （16）侵犯他人隐私权、名誉权、肖像权、知识产权等合法权益内容的；
                        </Text>
                        <Text style={styles.tintFont}>
                            （17）散布商业广告，或类似的商业招揽信息、过度营销信息及垃圾信息；
                        </Text>
                        <Text style={styles.tintFont}>（18）使用本网站常用语言文字以外的其他语言文字评论的；</Text>
                        <Text style={styles.tintFont}>（19）与所评论的信息毫无关系的；</Text>
                        <Text style={styles.tintFont}>
                            （20）所发表的信息毫无意义的，或刻意使用字符组合以逃避技术审核的；
                        </Text>
                        <Text style={styles.tintFont}>（21）侵害未成年人合法权益或者损害未成年人身心健康的；</Text>
                        <Text style={styles.tintFont}>（22）未获他人允许，偷拍他人，侵害他人合法权利的；</Text>
                        <Text style={styles.tintFont}>
                            （23）包含恐怖、暴力血腥、高危险性、危害表演者自身或他人身心健康内容的，包括但不限于以下情形：
                        </Text>
                        <Text style={styles.tintFont}>i. 任何暴力和/或自残行为内容；</Text>
                        <Text style={styles.tintFont}>
                            ii. 任何威胁生命健康、利用刀具等危险器械表演的危及自身或他人人身及/或财产权利的内容；
                        </Text>
                        <Text style={styles.tintFont}>
                            iii. 怂恿、诱导他人参与可能会造成人身伤害或导致死亡的危险或违法活动的内容；
                        </Text>
                        <Text style={styles.tintFont}>
                            （24）其他含有违反法律法规、政策及公序良俗、干扰“{Config.AppName}
                            ”正常运营或侵犯其他用户或第三方合法权益内容的信息。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            5.3
                            公司设立公众投诉、举报平台，您可按照公司公示的投诉举报制度向公司举报各类违法违规行为、违法传播活动、违法有害信息等内容，公司将及时受理和处理您的投诉举报，以共同营造风清气正的网络空间。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>6、“{Config.AppName}”信息内容使用规范</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            6.1 未经公司书面许可，您不得自行或授权、允许、协助任何第三人对“{Config.AppName}
                            ”软件及相关服务中信息内容进行如下行为：
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            （1）复制、读取、采用“{Config.AppName}
                            ”软件及相关服务的信息内容，用于包括但不限于宣传、增加阅读量、浏览量等商业用途；
                        </Text>
                        <Text style={styles.tintFont}>
                            （2）擅自编辑、整理、编排“{Config.AppName}”软件及相关服务的信息内容后在“{Config.AppName}
                            ”软件及相关服务的源页面以外的渠道进行展示；
                        </Text>
                        <Text style={styles.tintFont}>
                            （3）采用包括但不限于特殊标识、特殊代码等任何形式的识别方法，自行或协助第三人对“
                            {Config.AppName}”软件及相关服务的信息内容产生流量、阅读量引导、转移、劫持等不利影响；
                        </Text>
                        <Text style={styles.tintFont}>
                            （4）其他非法获取或使用“{Config.AppName}”软件及相关服务的信息内容的行为。 6.2
                            经公司书面许可后，用户对“{Config.AppName}
                            ”软件及相关服务的信息内容的分享、转发等行为，还应符合以下规范：
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            6.2 经公司书面许可后，用户对“{Config.AppName}
                            ”软件及相关服务的信息内容的分享、转发等行为，还应符合以下规范：
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            （1）对抓取、统计、获得的相关搜索热词、命中率、分类、搜索量、点击率、阅读量等相关数据，未经公司事先书面同意，不得将上述数据以任何方式公示、提供、泄露给任何第三人；
                        </Text>
                        <Text style={styles.tintFont}>
                            （2）不得对“{Config.AppName}”软件及相关服务的源网页进行任何形式的任何改动，包括但不限于“
                            {Config.AppName}”软件及相关服务的首页链接、广告系统链接等入口，也不得对“{Config.AppName}
                            ”软件及相关服务的源页面的展示进行任何形式的遮挡、插入、弹窗等妨碍；
                        </Text>
                        <Text style={styles.tintFont}>
                            （3）应当采取安全、有效、严密的措施，防止“{Config.AppName}
                            ”软件及相关服务的信息内容被第三方通过包括但不限于“蜘蛛”（spider）程序等任何形式进行非法获取；
                        </Text>
                        <Text style={styles.tintFont}>
                            （4）不得把相关数据内容用于公司书面许可范围之外的目的，进行任何形式的销售和商业使用，或向第三方泄露、提供或允许第三方为任何方式的使用。
                        </Text>
                        <Text style={styles.tintFont}>
                            （5）用户向任何第三人分享、转发、复制“{Config.AppName}
                            ”软件及相关服务信息内容的行为，还应遵守公司为此制定的其他规范和标准，如 “{Config.AppName}
                            ”其他功能的相关协议。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>7、违约处理</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            7.1
                            针对您违反本协议或其他服务条款的行为，公司有权独立判断并视情况采取预先警示、拒绝发布、立即停止传输信息、删除评论、音频、视频、音视频、图片等内容、短期禁止发言、限制账号部分或者全部功能直至终止提供服务、永久关闭账号等措施。公司有权公告处理结果，且有权根据实际情况决定是否恢复相关账号的使用。对涉嫌违反法律法规、涉嫌违法犯罪的行为，公司将保存有关记录，并有权依法向有关主管部门报告、配合有关主管部门调查、向公安机关报案等。对已删除内容公司有权不予恢复。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            7.2
                            因您违反本协议或其他服务条款规定，引起第三方投诉或诉讼索赔的，您应当自行处理并承担可能因此产生的全部法律责任。因您的违法或违约等行为导致公司及其关联方、控制公司、继承公司向任何第三方赔偿或遭受国家机关处罚的，您还应足额赔偿公司及其关联方、控制公司、继承公司因此遭受的全部损失。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            7.3 公司尊重并保护用户及他人的知识产权、名誉权、姓名权、隐私权等合法权益。您保证，在使用“
                            {Config.AppName}
                            ”软件及相关服务时上传的文字、图片、视频、音频、链接等不侵犯任何第三方的知识产权、名誉权、姓名权、隐私权等权利及合法权益。否则，公司有权在收到权利方或者相关方通知的情况下移除该涉嫌侵权内容。针对第三方提出的全部权利主张，您应自行处理并承担可能因此产生的全部法律责任；如因您的侵权行为导致公司及其关联方、控制公司、继承公司遭受损失的（包括但不限于经济、商誉等损失），您还应足额赔偿公司及其关联方、控制公司、继承公司遭受的全部损失。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>8、服务内容</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            8.1 “{Config.AppName}
                            ”软件的具体内容由本程序根据实际运营需要提供，您可以根据自身的需要选择相应的文字、图文、音视频等服务内容。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            8.2 “{Config.AppName}
                            ”软件中的答题功能，题目答案以程序给出的答案为准，如有发现题目给出答案不准确，请通过本软件的反馈功能与官方联系，官方在审核后会对问题进行正确的修改。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            8.3 为确保“{Config.AppName}
                            ”软件的提现功能正常使用，需要您按照提现规范中所写的正常流程进行操作，如出现提现账户为实名认证、提现前解绑账号、使用第三方工具或破解软件进行提现等原因造成的提现失败问题，后果将由您自己承担，如遇情节严重者，公司保有依据相关法律法规进行正当权益维护的权力。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            8.3.1
                            您理解并同意如遇到提现高峰期，提现到账时间会有所延长。正常情况下，提现将在1-3个工作日内到账。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            8.3.2
                            您理解并同意提现相关的政策和规则，公司有权根据实际运营情况，在法律允许的范围之内进行适当的调整和改动，并通过官方公告、活动说明等方式进行告知。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>9、服务的变更、中断和终止</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            9.1 您理解并同意，公司提供的“{Config.AppName}
                            ”软件及相关服务是按照现有技术和条件所能达到的现状提供的。公司会尽最大努力向您提供服务，确保服务的连贯性和安全性。您理解，公司不能随时或始终预见和防范法律、技术以及其他风险，包括但不限于不可抗力、网络原因、第三方服务瑕疵、第三方网站等原因可能导致的服务中断、不能正常使用“
                            {Config.AppName}”软件及相关服务以及其他的损失和风险。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            9.2
                            您理解并同意，公司为了整体服务运营、平台运营安全的需要，有权视具体情况决定服务/功能的设置及其范围修改、中断、中止或终止“
                            {Config.AppName}”软件及相关服务。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>10、 广告</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            10.1 您理解并同意，在您使用“{Config.AppName}
                            ”软件及相关服务过程中，公司可能会向您推送具有相关性的信息、广告发布或品牌推广服务，且公司将在“
                            {Config.AppName}”软件及相关服务中展示“{Config.AppName}
                            ”软件及相关服务和/或第三方供应商、合作伙伴的商业广告、推广或信息（包括商业或非商业信息）。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            10.2
                            公司依照法律规定履行广告及推广相关义务，您应当自行判断该广告或推广信息的真实性和可靠性并为自己的判断行为负责。除法律法规明确规定外，您因该广告或推广信息进行的购买、交易或因前述内容遭受的损害或损失，您应自行承担，公司不予承担责任。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>11、 知识产权</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            11.1 公司在“{Config.AppName}
                            ”软件及相关服务中提供的内容（包括但不限于软件、技术、程序、网页、文字、图片、图像、图表、音频、视频、版面设计、电子文档等）的知识产权属于公司所有。公司提供“
                            {Config.AppName}
                            ”及相关服务时所依托的软件的著作权、专利权及其他知识产权均归公司所有。未经公司许可，任何人不得擅自使用（包括但不限于通过任何机器人、“蜘蛛”等程序或设备监视、复制、传播、展示、镜像、上载、下载）“
                            {Config.AppName}”软件及相关服务中的内容。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            11.2 您理解并承诺，您在使用“{Config.AppName}
                            ”软件及相关服务时发布上传的内容（包括但不限于文字、图片、视频、音频等各种形式的内容及其中包含的音乐、声音、台词、视觉设计等所有组成部分）均由您原创或已获合法授权（且含转授权）。您通过“
                            {Config.AppName}”上传、发布所产生内容的知识产权归属您或原始著作权人所有。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            11.3 您知悉、理解并同意，您通过“{Config.AppName}
                            ”软件及相关服务上传、发布或传输的内容（包括但不限文字、图片、视频、音频等各种形式的内容及其中包括的音乐、声音、台词、视觉设计等所有组成部分），您授予公司及其关联方、控制公司、继承公司一项全球范围内、免费、非独家、可再许可（通过多层次）的权利（包括但不限于复制权、翻译权、汇编权、信息网络传播权、改编权、制作衍生品、表演和展示等权利），使用范围包括但不限于在当前或其他网站、应用程序、产品或终端设备等。您在此确认并同意，上述授予的权利包括在与上述内容、“
                            {Config.AppName}
                            ”软件及相关服务、公司和/或公司品牌有关的任何宣传、推广、广告、营销和/或研究中使用和以其他方式开发内容（全部或部分）的权利和许可。为避免疑义，您理解并同意，上述授予的权利包括使用、复制和展示您拥有或被许可使用并植入内容中的个人形象、肖像、姓名、商标、服务标志、品牌、名称、标识和公司标记（如有）以及任何其他品牌、营销或推广资产、物料、素材等的权利和许可。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            11.4
                            您确认并同意授权公司以公司自己的名义或委托专业第三方对侵犯您上传发布的享有知识产权的内容进行代维权，维权形式包括但不限于：监测侵权行为、发送维权函、提起诉讼或仲裁、调解、和解等，公司有权对维权事宜做出决策并独立实施。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            11.5 公司为“{Config.AppName}”开发、运营提供技术支持，并对“{Config.AppName}
                            ”软件及相关服务的开发和运营等过程中产生的所有数据和信息等享有法律法规允许范围内的全部权利。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            11.6 请您在任何情况下都不要私自使用公司的包括但不限于 “{Config.AppName}
                            ”等在内的任何商标、服务标记、商号、域名、网站名称或其他显著品牌特征等（以下统称为“标识”）。未经公司事先书面同意，您不得将本条款前述标识以单独或结合任何方式展示、使用或申请注册商标、进行域名注册等，也不得实施向他人明示或暗示有权展示、使用、或其他有权处理该些标识的行为。由于您违反本协议使用公司上述商标、标识等给公司或他人造成损失的，由您承担全部法律责任。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>12、 免责声明</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.1 您理解并同意，“{Config.AppName}
                            ”软件及相关服务可能会受多种因素的影响或干扰，公司不保证(包括但不限于)：
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.1.1 “{Config.AppName}”软件及相关服务完全适合用户的使用要求；
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.1.2 “{Config.AppName}
                            ”软件及相关服务不受干扰，及时、安全、可靠或不出现错误；用户经由公司取得的任何软件、服务或其他材料符合用户的期望；
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.1.3 “{Config.AppName}”软件及相关服务中任何错误都将能得到更正。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.2
                            如有涉嫌借款、投融资、理财或其他涉财产的网络信息、账户密码、广告或推广等信息的，请您谨慎对待并自行进行判断，对您因此遭受的利润、商业信誉、资料损失或其他有形或无形损失，公司不承担任何直接、间接、附带、特别、衍生性或惩罚性的赔偿责任。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.3 您理解并同意，在使用“{Config.AppName}
                            ”软件及相关服务过程中，可能遇到不可抗力等因素（不可抗力是指不能预见、不能克服并不能避免的客观事件），包括但不限于政府行为、自然灾害（如洪水、地震、台风等）、网络原因、战争、罢工、骚乱等。出现不可抗力情况时，公司将努力在第一时间及时修复，但因不可抗力造成的暂停、中止、终止服务或造成的任何损失，公司在法律法规允许范围内免于承担责任。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.4
                            公司依据本协议约定获得处理违法违规内容的权利，该权利不构成公司的义务或承诺，公司不能保证及时发现违法行为或进行相应处理。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.5 您理解并同意：关于“{Config.AppName}
                            ”软件及相关，公司不提供任何种类的明示或暗示担保或条件，包括但不限于商业适售性、特定用途适用性等。您对“
                            {Config.AppName}”软件及相关服务的使用行为应自行承担相应风险。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.6
                            您理解并同意，本协议旨在保障遵守国家法律法规、维护公序良俗，保护用户和他人合法权益，公司在能力范围内尽最大的努力按照相关法律法规进行判断，但并不保证公司判断完全与司法机关、行政机关的判断一致，如因此产生的后果您已经理解并同意自行承担。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            12.7
                            在任何情况下，公司均不对任何间接性、后果性、惩罚性、偶然性、特殊性或刑罚性的损害，包括因您使用“
                            {Config.AppName}
                            ”软件及相关服务而遭受的利润损失，承担责任。除法律法规另有明确规定外，公司对您承担的全部责任，无论因何原因或何种行为方式，始终不超过您因使用“
                            {Config.AppName}”软件及相关服务期间而支付给公司的费用（如有）。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>13、 关于单项服务与第三方服务的特殊约定</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            13.1 “{Config.AppName}
                            ”软件及相关服务中包含公司以各种合法方式获取的信息或信息内容链接，同时也包括公司及其关联方合法运营的其他单项服务。这些服务在“
                            {Config.AppName}
                            ”可能以单独板块形式存在。公司有权不时地增加、减少或改动这些特别板块的设置及服务。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            13.2 您可以在“{Config.AppName}
                            ”软件中开启和使用上述单项服务功能。某些单项服务可能需要您同时接受就该服务特别制订的协议或者其他约束您与该项服务提供者之间的规则。必要时公司将以醒目的方式提供这些协议、规则供您查阅。一旦您开始使用上述服务，则视为您理解并接受有关单项服务的相关协议、规则的约束。如未标明使用期限、或未标明使用期限为“永久”、“无限期”或“无限制”的，则这些服务的使用期限为自您开始使用该服务至该服务在“
                            {Config.AppName}”软件停止提供之日为止。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            13.3 您在“{Config.AppName}”软件中使用第三方提供的软件及相关服务时，除遵守本协议及“
                            {Config.AppName}
                            ”软件中的其他相关规则外，还可能需要同意并遵守第三方的协议、相关规则。如因第三方软件及相关服务产生的争议、损失或损害，由您自行与第三方解决，公司并不就此而对您或任何第三方承担任何责任。
                        </Text>
                    </View>

                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>14、未成年人使用条款</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            14.1 若您是未满 18
                            周岁的未成年人，您应在您的监护人监护、指导下并获得监护人同意的情况下，认真阅读并同意本协议后，方可使用“
                            {Config.AppName}”软件及相关服务。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            14.2
                            公司重视对未成年人个人信息的保护，未成年用户请加强个人保护意识并谨慎对待，并应在取得监护人的同意以及在监护人指导下正确使用“
                            {Config.AppName}”软件及相关服务。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            14.3
                            未成年人用户及其监护人理解并确认，如您违反法律法规、本协议内容，则您及您的监护人应依照法律规定承担因此而可能导致的全部法律责任。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>14.4 未成年人用户特别提示。</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            14.4.1 未成年人使用“{Config.AppName}
                            ”软件及相关服务应该在其监护人的监督指导下，在合理范围内正确学习使用网络，避免沉迷虚拟的网络空间，养成良好上网习惯。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            14.4.2 青少年用户必须遵守《全国青少年网络文明公约》：
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>（1）要善于网上学习，不浏览不良信息；</Text>
                        <Text style={[styles.tintFont, { color: '#000' }]}>（2）要诚实友好交流，不侮辱欺诈他人；</Text>
                        <Text style={[styles.tintFont, { color: '#000' }]}>（3）要增强自护意识，不随意约会网友；</Text>
                        <Text style={[styles.tintFont, { color: '#000' }]}>（4）要维护网络安全，不破坏网络秩序；</Text>
                        <Text style={[styles.tintFont, { color: '#000' }]}>（5）要有益身心健康，不沉溺虚拟时空。</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            14.4.3
                            为更好地保护未成年人隐私权益，公司特别提醒您慎重发布包含未成年人素材的内容，一经发布，即视为您已获得权利人同意在“
                            {Config.AppName}
                            ”软件及相关服务展示未成年人的肖像、声音等信息，且允许公司依据本协议使用、处理该等与未成年人相关的内容。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>14.4.4 监护人特别提示</Text>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            如您的被监护人使用“{Config.AppName}
                            ”软件及相关服务的，您作为监护人应指导并监督被监护人的使用行为，公司将有权认为其已取得您的同意。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.darkFont}>15、其它</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            15.1
                            本协议的成立、生效、履行、解释及争议的解决均应适用中华人民共和国法律。倘若本协议之任何规定因与中华人民共和国法律抵触而无效，则这些条款应在不违反法律的前提下按照尽可能接近本协议原条文目的之原则进行重新解释和适用，且本协议其它规定仍应具有完整的效力及效果。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont, { color: '#000' }]}>
                            15.2
                            为给您提供更好的服务或因国家法律法规、政策调整、技术条件、产品功能等变化需要，公司会适时对本协议进行修订，修订内容构成本协议的组成部分。本协议更新后，公司会在“
                            {Config.AppName}”发出更新版本，您可以在软件内查阅最新版本的协议条款。如您继续使用“
                            {Config.AppName}”软件及相关服务，即表示您已同意接受修订后的本协议内容。
                            如您对修订后的协议内容存有异议的，请立即停止使用“{Config.AppName}
                            ”软件及相关服务。若您继续使用“{Config.AppName}
                            ”软件及相关服务，即视为您认可并接受修订后的协议内容。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            15.3 本协议中的标题仅为方便阅读而设，并不影响本协议中任何规定的含义或解释。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={[styles.tintFont]}>
                            15.4
                            您和公司均是独立的主体，在任何情况下本协议不构成公司对您的任何形式的明示或暗示担保或条件，双方之间亦不构成代理、合伙、合营或雇佣关系。
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.backgroundColor,
    },
    fontWrap: {
        marginTop: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: Theme.black,
    },
    darkFont: {
        fontSize: font(15),
        lineHeight: font(22),
        color: '#000',
    },
    tintFont: {
        fontSize: font(15),
        lineHeight: font(22),
        color: Theme.subTextColor,
    },
});
