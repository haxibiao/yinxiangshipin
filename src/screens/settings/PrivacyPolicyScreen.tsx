import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { PageContainer, SafeText } from '@src/components';
export default function PrivacyPolicyScreen() {
    return (
        <PageContainer title="隐私协议" white>
            <ScrollView style={styles.container}>
                <View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
                    <SafeText style={styles.title}>
                        {Config.AppName}
                        隐私政策
                    </SafeText>
                    <View style={styles.fontWrap}>
                        <Text style={styles.tintFont}>
                            感谢您使用{Config.AppName}! 本次{Config.AppName}
                            运营和开发团队（以下简称“我们”或“公司”）依据《中华人民共和国网络安全法》、《信息安全技术个人信息安全规范》（GB/T
                            35273-2017）以及其他相关法律法规和技术规范更新了一些内容，其中主要包括如下内容：本《
                            {Config.AppName}
                            隐私政策》相关词语释义、我们如何收集和使用您的个人信息、我们如何共享、转让、公开披露您的个人信息。请您在使用/继续使用
                            {Config.AppName}
                            的产品与/或服务前仔细阅读和充分理解全文，并在同意全部内容后使用/继续使用。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>导言</Text>
                        <Text style={styles.tintFont}>
                            {Config.AppName}
                            （以下也称“我们”）深知个人信息对您的重要性，因此我们非常重视保护您的隐私和个人信息，我们亦将本《
                            {Config.AppName}
                            隐私政策》（以下也称“本政策”）中的内容以高度审慎的义务对待和处理。本政策与您所使用的我们的产品与/或服务息息相关，您在下载、安装、启动、浏览、注册、登录、使用我们的产品与/或服务（以下统称“使用我们的产品与/或服务”或“使用产品与/或服务”）时，我们将按照本政策的约定处理和保护您的个人信息，因此我们希望您能够仔细阅读、充分理解本政策的全文，并在需要时，按照本政策的指引，作出您认为适当的选择。本政策之中涉及的相关技术词汇，我们尽量以简明扼要的表述向您解释，以便于您理解。
                        </Text>
                        <Text style={styles.tintFont}>
                            您应当在仔细阅读、充分理解本《
                            {Config.AppName}
                            隐私政策》后选择是否同意本政策的内容以及是否同意使用我们的产品与/或服务，如果您不同意本政策的内容，将可能导致我们的产品与/或服务无法正常运行，或者无法达到我们拟达到的服务效果，您应立即停止访问/使用我们的产品与/或服务。您使用或继续使用我们提供的产品与/或服务的行为，都表示您充分理解和同意本《
                            {Config.AppName}
                            隐私政策》（包括更新版本）的全部内容。
                        </Text>
                        <Text style={styles.tintFont}>
                            {Config.AppName}
                            已经以字体加粗或其他合理方式提示您重点阅读协议中与您的权益（可能）存在重大关系的条款，且双方同意其不属于《合同法》第
                            40 条规定的“免除其责任、加重对方责任、排除对方主要权利”的条款，即您和
                            {Config.AppName}
                            均认可该类条款的合法性及有效性，您不会以
                            {Config.AppName}
                            未尽到合理提示义务为由而声称协议中条款非法或无效。
                        </Text>
                        <Text style={styles.tintFont}>
                            如您在阅读本《
                            {Config.AppName}
                            隐私政策》过程中有任何疑惑或其他相关事宜的，我们为您提供了多种反馈渠道，具体请见本政策“如何联系我们”章节，我们会尽快为您作出解答。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>
                            本《
                            {Config.AppName}
                            隐私政策》将帮助您了解以下内容
                        </Text>
                        <Text style={styles.tintFont}>
                            一、 本《
                            {Config.AppName}
                            隐私政策》适用范围、相关词语涵义
                        </Text>
                        <Text style={styles.tintFont}>二、 我们如何收集和使用您的个人信息</Text>
                        <Text style={styles.tintFont}>三、 我们如何使用 Cookie 和同类技术</Text>
                        <Text style={styles.tintFont}>四、 我们如何共享、转让、公开披露您的个人信息</Text>
                        <Text style={styles.tintFont}>五、 您对个人信息享有的控制权</Text>
                        <Text style={styles.tintFont}>六、 我们如何存储和保护您的个人信息</Text>
                        <Text style={styles.tintFont}>七、 未成年人保护</Text>
                        <Text style={styles.tintFont}>
                            八、 本《
                            {Config.AppName}
                            隐私政策》的更新
                        </Text>
                        <Text style={styles.tintFont}>九、 如何联系我们</Text>
                        <Text style={styles.tintFont}>十、 其他</Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>
                            一、本《
                            {Config.AppName}
                            隐私政策》适用范围、相关词语涵义
                        </Text>
                        {/* 一 */}
                        <Text style={styles.titleItem}>
                            （一）本《
                            {Config.AppName}
                            隐私政策》适用范围
                        </Text>
                        <Text style={styles.tintFont}>
                            本《
                            {Config.AppName}
                            隐私政策》为我们的所有产品与/或服务统一适用的通用内容，当您使用我们的任何产品与/或服务时，
                            本《
                            {Config.AppName}
                            隐私政策》即适用，但如该产品与/或服务单独设置了隐私条款/隐私协议的，单独的隐私条款/隐私协议优先适用；单独的隐私条款/隐私协议未提及的内容，适用本政策。
                            但请您注意，本《
                            {Config.AppName}
                            隐私政策》不适用于以下情况：
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont} textAlign="center">
                                ·
                            </Text>
                            为我们的产品与/或服务提供广告服务的第三方的信息收集/处理做法；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont} textAlign="center">
                                ·
                            </Text>
                            我们的产品与/或服务可能会包含或链接至第三方提供的信息与/或第三方服务（包括任何第三方应用、网站、产品、服务等），这些信息与/或服务由第三方负责运营，
                            您使用该等信息与/或服务与我们无关。我们在此善意的提醒您，您在使用第三方信息与/或服务时，应留意和仔细阅读第三方向您展示的相关用户协议和隐私政策，
                            并妥善保管和谨慎提供您的个人信息。本《
                            {Config.AppName}
                            隐私政策》仅适用于我们所收集的您的个人信息，并不适用于任何第三方对您的个人信息的收集，以及任何第三方提供的服务或第三方的信息使用规则，
                            我们对任何第三方收集、储存和使用的您个人信息的行为在法律允许的范围内亦不承担任何责任；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont} textAlign="center">
                                ·
                            </Text>
                            其他非
                            {Config.AppName}
                            向您提供的产品与/或服务内容。
                        </Text>
                        {/* 二 */}
                        <Text style={styles.titleItem}>（二）相关词语涵义</Text>
                        <Text style={styles.tintFont}>
                            我们的产品与/或服务：包括但不限于我们提供的软件、网站、服务（含站外服务，例如：我们的广告服务和“通过我们的服务申请或分享”的插件等）以及包含的相关产品或服务功能。
                        </Text>
                        <Text style={styles.tintFont}>
                            我们需要特别提醒您的是：由于我们的产品和服务较多，为您提供的产品和服务内容也有所不同，本《
                            {Config.AppName}
                            隐私政策》为{Config.AppName}统一适用的一般性隐私条款，
                            本政策约定的用户权利和我们提供的相关信息安全保护措施均适用于我们的所有产品和服务；
                            本政策所述之“我们的产品与/或服务”以及我们收集的您个人信息的类型和对应的使用、处理规则等可能会因您使用的具体的产品/服务（包括客户端类型、软件版本等）而有所不同，
                            具体以您实际使用的产品/服务的实际情况为准。针对我们的某些特定产品/服务，我们还将制定特定隐私条款或隐私协议，以便更具体地向您阐明我们的隐私规则和保护措施等内容。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            个人信息（出自于 GB/T
                            35273-2017《信息安全技术个人信息安全规范》）：指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
                            本隐私政策中涉及的个人信息包括个人基本资料（包括个人姓名、生日、性别、住址、个人电话号码）、网络身份标识信息（包括系统账号、IP
                            地址）、个人财产信息（包括交易和消费记录、流水记录、虚拟货币（如智慧点）等虚拟财产信息）个人上网记录（包括浏览记录、软件使用记录、点击记录）、个人常用设备信息（包括硬件序列号、硬件型号、设备
                            MAC 地址、操作系统类型、软件列表、唯一设备识别码如（如 IMEI/ANDROID
                            ID/IDFA/OPENUDID/GUID、SIM 卡 IMSI
                            信息等在内的描述个人常用设备基本情况的信息）、个人位置信息（包括大概地理位置、精准定位信息）。我们实际具体收集的个人信息种类以下文描述为准。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            个人敏感信息（出自于 GB/T 35273-2017《信息安全技术个人信息安全规范》）：
                            <Text style={{ color: '#000' }}>
                                指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。
                                本隐私政策中涉及的个人敏感信息包括您的个人财产信息（包括交易和消费记录、流水记录、虚拟货币（如优惠券等）、兑换码等虚拟财产信息）、网络身份识别信息（包括系统账号、IP
                                地址）、其他信息（包括个人电话号码、精准定位信息、收货地址、网页浏览记录）。您同意您的个人敏感信息按本《
                                {Config.AppName}
                                隐私政策》所述的目的和方式来处理。
                                我们实际具体收集的个人敏感信息种类以下文描述为准。相比其他个人信息，个人敏感信息可能对您的个人权益影响更大。我们在此善意的提醒您需在谨慎考虑后再向我们提供您的个人敏感信息。
                            </Text>
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            儿童：指不满十四周岁的未成年人。（出自于《儿童个人信息网络保护规定》）
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            匿名化：指通过对个人信息的技术处理，使得个人信息主体无法被识别，且处理后的信息不能被复原的过程。（出自于
                            GB/T 35273-2017《信息安全技术个人信息安全规范》）
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            去标识化：指通过对个人信息的技术处理，使其在不借助额外信息的情况下，无法识别个人信息主体的过程。（出自于
                            GB/T 35273-2017《信息安全技术个人信息安全规范》）
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            删除：指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。（出自于
                            GB/T 35273-2017《信息安全技术个人信息安全规范》）
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>二、我们如何收集和使用您的个人信息 </Text>
                        <Text style={styles.tintFont}>
                            您在使用我们的产品与/或服务时，我们需要/可能需要收集和使用您的一些个人信息，我们收集和使用的您的个人信息类型包括两种：
                            第一种：我们产品与/或服务的核心业务功能所必需的信息：此类信息为产品与/或服务正常运行的必备信息，您须授权我们收集。如您拒绝提供，您将无法正常使用我们的产品与/或服务；
                            第二种：我们产品与/或服务的附加业务功能可能需要收集的信息：此信息为非核心业务功能所需的信息，您可以选择是否授权我们收集。
                            如您拒绝提供，将导致附加业务功能无法实现或无法达到我们拟达到的效果，但不影响您对核心业务功能的正常使用。
                        </Text>
                        <Text style={styles.tintFont}>
                            我们需要特别提醒您的是：由于我们的产品和服务较多，为您提供的内容也不同，因此核心业务功能（包括其收集的您的个人信息类型）也会因产品/服务的内容不同而有所区别，
                            具体以产品/服务实际提供为准。除此之外，您理解并同意，我们希望提供给您的产品和服务是完善的，所以我们会不断改进我们的产品和服务，包括技术，这意味着我们可能会经常推出新的业务功能，
                            可能需要收集新的个人信息或变更个人信息使用目的或方式。如果某一需要收集您的个人信息的功能或产品/服务未能在本《
                            {Config.AppName}
                            隐私政策》中予以说明的，
                            我们会通过更新本政策、系统提示、弹窗、公告、站内信等方式另行向您说明该信息收集的目的、内容、使用方式和范围，并为您提供自主选择同意的方式，且在征得您明示同意后收集。
                            在此过程中，如果您对相关事宜有任何疑惑的，可以通过文末提供的方式联系我们，我们会尽快为您作出解答。
                        </Text>
                        <Text style={styles.tintFont}>具体业务功能场景包括： </Text>
                        <Text style={styles.titleItem}>（一） 保障“{Config.AppName}”软件及相关服务的正常运行 </Text>
                        <Text style={styles.tintFont}>
                            请您了解，我们为提供服务和保障产品正常、安全运行所必须收集的基本信息有：您设备的
                            <Text style={styles.Focus}>
                                硬件型号、操作系统版本号、国际移动设备识别码（IMEI）
                                、国际移动用户识别码（IMSI）、网络设备硬件地址（MAC）、IP地址、软件版本号、网络接入方式及类型、操作日志，
                                并需您授权对应的权限。
                            </Text>
                            这些信息和权限是我们提供服务必须的，我们收集这些信息用于保障网络安全或运营安全，
                            同时也将根据这些信息为您做对应的版本适配，以保障软件的正常启动运营。
                        </Text>
                        <Text style={styles.tintFont}>
                            您理解并同意，您需要授权我们
                            <Text style={styles.Focus}>“电话”权限</Text>来允许我们获取前述的
                            <Text style={styles.Focus}>“设备的硬件型号”</Text>和
                            <Text style={styles.Focus}>“国际移动设备识别码” （IMEI）</Text>
                            信息，我们不会调用
                            <Text style={styles.Focus}>“电话”权限</Text>
                            下的
                            <Text style={styles.Focus}>其他权限</Text>。
                            您可以选择拒绝授权或关闭该权限，您拒绝授权或关闭“电话”权限后，您仍然可以使用我们的服务，但可能会影响您的用户体验。
                            为更好地了解“{Config.AppName}
                            ”软件及相关服务的运行情况，以便确保运行与提供服务的安全，同时为履行《网络安全法》下的网络安全义务，我们将记录网络日志信息，
                            以及使用软件及相关服务的频率、崩溃数据、总体安装、使用情况、性能数据信息。这些信息可能包括
                            <Text style={styles.Focus}>个人敏感信息（如个人电话号码等手机信息)</Text>
                            ,是您收到转账或者礼品所必要的， 如果您拒绝提供这些信息，我们将可能无法向您转账或发放礼品。
                        </Text>
                        <Text style={styles.titleItem}>（二）视频展示和播放功能</Text>
                        <Text style={styles.tintFont}>
                            我们的产品与/或服务为您提供视频展示和播放服务，在此过程中，我们需要收集您的一些信息，包括如下个人信息：
                            <Text style={styles.Focus}>
                                设备型号、设备名称、设备标识、操作系统和应用程序版本、登录 IP
                                地址、接入网络的方式、移动网络信息（包括运营商名称）、产品版本号、日志信息（如操作日志、服务日志）等。同时为了收集上述基本的个人设备信息，
                                我们将会申请访问您的设备信息的权限，
                            </Text>
                            我们收集这些信息是为了向您提供我们最核心的视频展示和播放服务，如您拒绝提供上述权限将可能导致您无法使用我们的产品与服务。
                        </Text>
                        <Text style={styles.titleItem}>（三）搜索功能</Text>
                        <Text style={styles.tintFont}>
                            当您使用搜索功能时，我们需要收集您的一些信息，包括如下个人信息：搜索的字词、浏览记录和时间、搜索的时间以及与它们互动的次数。
                            我们收集这些信息是为了向您提供您所需要的内容和可能更感兴趣的服务，同时亦可以改进我们的产品和服务。
                        </Text>
                        <Text style={styles.titleItem}>（四）注册与登录功能 </Text>
                        <Text style={styles.tintFont}>
                            当您使用注册功能时，您需要按照我们的指引完成一系列注册的程序，在您成为注册用户后，我们将为您提供专属于注册用户的产品与/或服务。
                            在此过程中，您需要提供给我们一些单独或者结合识别您的用户身份的信息，可能包括：
                            <Text style={styles.Focus}>
                                姓名、电子邮箱、手机号码、验证码匹配结果，并创建账号 UID。
                                我们收集这些信息是用以完成注册程序、为您持续稳定提供注册服务，并保护您注册账号的安全。您应知悉，手机号码和验证码匹配结果属于您的个人敏感信息，
                                我们收集该类信息是为了满足相关法律法规的要求，如您拒绝提供可能导致您无法使用我们的此功能，
                            </Text>
                            请您谨慎考虑后再提供
                            我们收集这些信息是用以完成注册程序、为您持续稳定提供注册服务，并保护您注册账号的安全。您应知悉，
                            <Text style={styles.Focus}>手机号码和验证码匹配结果属于您的个人敏感信息</Text>，
                            我们收集该类信息是为了满足相关法律法规的要求，如您拒绝提供可能导致您无法使用我们的此功能，请您谨慎考虑后再提供。同时，您也可以在注册时或
                            后续使用过程中填写或补充您的性别、昵称、头像、生日等信息，如您未填写或后续删除、变更此类信息的，可能会影响（包括无法获取到）
                            我们为您提供的基于您的个人画像信息的影视作品推荐、您感兴趣的广告呈现等，但不会影响注册功能的正常使用。
                            如您使用若您以其他方式关联登录、使用“{Config.AppName}
                            ”软件及相关服务，我们将根据您的授权获取该第三方账号下的相关信息
                            （包括：用户名、昵称、头像，具体以您的授权内容为准）以及身份验证信息（个人敏感信息），在您使用发布、评论以及其他要求实名认证的功能与服务前，
                            我们将另行收集您的手机号码以完成实名认证。我们收集这些信息是用于为您提供账号登录服务以及保障您的账号安全，防范安全风险。如您拒绝授权此类信息的，
                            您将无法使用第三方平台的账号登录我们平台，但不影响我们为您提供的其他产品和服务的正常使用。您知悉并同意，对于您在使用产品与/或服务的过程中提供的您的联系方式（如联系电话），
                            我们在运营中可能会向其中的一种或多种发送多类通知，用于用户消息告知、身份验证、安全验证等用途。
                        </Text>
                        <Text style={styles.titleItem}>（五）服务推荐功能 </Text>
                        <Text style={styles.tintFont}>
                            视频推荐、广告推荐、服务内容推荐及相关推荐功能为我们的产品与/或服务的核心业务功能，在此过程中，我们需要收集您在我们的产品与/或服务中的一些信息，
                            包括如下个人信息：您观看的内容、您搜索的字词、浏览内容和广告的次数以及与它们互动的次数、您点赞/分享/评论/互动的对象，
                            我们收集这些信息是为了向您实时推荐更优质、您可能更感兴趣的服务内容，例如：推荐您可能喜欢的视频、广告等。
                        </Text>
                        <Text style={styles.titleItem}>（六）基于设备相册权限的附加业务功能 </Text>
                        <Text style={styles.tintFont}>
                            当您使用视频分享、发布图片、授权设备登录等业务功能时，我们将需要获取您的设备相册权限，并收集您提供的图文及视频内容信息（个人信息）。
                            如您拒绝提供的仅会使您无法使用该功能，但并不影响您正常使用产品与/或服务的其他功能。相册权限是您设备上的一项设置，您可以通过设备设置页面进行管理。
                            您开启该权限即视为您授权我们可以访问、获取、收集、使用您的该等个人信息；当您取消该授权后，我们将不再收集该信息，也无法再为您提供上述与之对应的服务；
                            但除非您依照法律的规定删除了您的个人信息，否则您的取消行为不会影响我们基于您之前的授权进行的个人信息的处理、存储。
                        </Text>
                        <Text style={styles.titleItem}>（七）身份认证功能 </Text>
                        <Text style={styles.tintFont}>
                            当您使用我们的产品与/或服务中的身份认证功能或服务时，为满足相关法律规定及监管要求、确保用户身份真实性、实现反欺诈等风险控制、保障系统和服务安全或提供服务之需要，
                            我们将需要收集您的真实身份信息（可能包括手机号码等个人敏感信息）以完成实名认证，相关业务场景可能包括：注册产品时、使用信息发布等服务时、申请使用“
                            {Config.AppName}”服务时、申请注销“{Config.AppName}”账号时以及其他需要进行身份认证的场景。
                            为实现实名认证的目的，您同意我们可以自行或委托第三方向有关机构（如个人征信机构、政府机构等）提供、查询、核对您的前述身份信息。
                            在您实名认证成功后，如无正当事由，实名信息将无法修改，如确需修改，请您与我们联系解决。
                        </Text>
                        <Text style={styles.tintFont}>
                            同时，为协助您快速完成实名认证、风控核验等，对于您曾经在我们的产品与/或服务中提供的相关实名认证信息（包括手机号码等个人敏感信息），
                            您同意我们可以将前述信息的全部或部分自动预填于其他需要您实名认证的页面，您知悉并认可，我们仅协助填写，并未直接传输，只有在您点击下一步操作后才由您自行提供至对应服务系统
                        </Text>
                        <Text style={styles.titleItem}>（八）客服、其他用户响应功能 </Text>
                        <Text style={styles.tintFont}>
                            当您联系我们的客服或使用其他用户响应功能时（包括：行使您的相关个人信息控制权、其他客户投诉和需求），为了您的账号与系统安全，我们可能需要您先行提供账号信息，
                            并与您之前的个人信息相匹配以验证您的用户身份。在您使用客服或其他用户响应功能时，我们可能还会需要收集您的如下个人敏感信息：
                            联系方式（您与我们联系时使用的电话号码或您向我们主动提供的其他联系方式）、您与我们的沟通信息（包括文字/图片/音视频/通话记录形式）、与您需求相关联的其他必要信息。
                            我们收集这些信息是为了调查事实与帮助您解决问题，如您拒绝提供可能导致您无法使用我们的客服等用户响应机制。
                        </Text>
                        <Text style={styles.titleItem}>（九）保障账号安全功能 </Text>
                        <Text style={styles.tintFont}>
                            我们需要收集您的一些信息来保障您使用我们的产品与/或服务时的账号与系统安全，并协助提升我们的产品与/服务的安全性和可靠性，
                            以防产生任何危害用户、{Config.AppName}
                            、社会的行为，包括：您的如下个人信息：个人常用设备信息、登录 IP
                            地址、产品版本号、浏览记录、网络使用习惯、服务故障信息，以及个人敏感信息如实名认证信息。
                            我们会根据上述信息来综合判断您账号、账户及交易风险、进行身份验证、客户服务、检测及防范安全事件、诈骗监测、存档和备份用途，并依法采取必要的记录、审计、分析、处置措施，
                            一旦我们检测出存在或疑似存在账号安全风险时，我们会使用相关信息进行安全验证与风险排除，确保我们向您提供的产品和服务的安全性，以用来保障您的权益不受侵害。
                            同时，当发生账号或系统安全问题时，我们会收集这些信息来优化我们的产品和服务。
                        </Text>
                        <Text style={styles.titleItem}>（十）从外部第三方间接收集的您的个人信息 </Text>
                        <Text style={styles.tintFont}>
                            您知悉，您向外部第三方（{Config.AppName}
                            旗下公司不在此限）提供的个人信息，或外部第三方收集的您的个人信息，我们无法获取，更不会使用非常规方式
                        </Text>
                        <Text style={styles.tintFont}>
                            （如：恶意干预对方系列 APP
                            数据）擅自以软件程序获得您的个人信息。如果因业务发展的必要而需要从第三方间接收集（如共享等）您的个人信息的，且由我们直接或联合为您提供产品或服务的，
                            我们（或第三方）在收集前会向您明示共享的您个人信息的来源、类型、使用目的、方式和所用于的业务功能、授权同意范围（如果使用方式和范围超出您在第三方原授权范围的，
                            我们会再次征得您的授权同意），此种场景包括您通过第三方账户直接登录我们的产品与/或服务时，
                            我们从第三方获取的您授权共享的账户信息（包括头像、昵称）、我们的某些产品/服务由业务合作伙伴提供或者我们与业务合作伙伴共同提供时，为了必要/合理的业务的顺利开展，
                            我们从部分业务合作伙伴处间接收集的您的部分信息、其他方使用我们的产品与/或服务时所提供有关您的信息（包括发布的与您相关的内容，包括评论、图片、照片、视频）。
                        </Text>
                        <Text style={styles.tintFont}>
                            此外，我们会在间接收集您的个人信息前，明确以书面形式（如协议、承诺书）要求该第三方在已经取得您明示同意后收集个人信息，并向您告知共享的信息内容，
                            且涉及敏感信息的在提供给我们使用前需经过您的再次确认，在协议等层面要求第三方对个人信息来源的合法性和合规性作出承诺，如第三方有违反行为的，我们会明确要求对方承担相应法律责任；
                            同时，我们的专业安全团队对个人信息进行安全加固（包括敏感信息报备、敏感信息加密存储、访问权限控制等）。我们会使用不低于我们对自身用户个人信息同等的保护手段与措施对间接获取的个人信息进行保护。
                        </Text>
                        <Text style={styles.titleItem}>（十一）发布与互动 </Text>
                        <Text style={styles.tintFont}>
                            为保障{Config.AppName}社区内容的质量并向您推荐可能感兴趣的内容，{Config.AppName}
                            可能会手机相关必要的日志信息。日志信息包括：
                            您操作、使用的行为信息：点击、关注、收藏、搜索、浏览、分享；您主动提供的信息：反馈、发布、点赞（喜欢）、评论；
                        </Text>
                        <Text style={styles.tintFont}>
                            您发布图文、视频等内容或进行评论时，我们将收集您发布的信息，并展示您的昵称、头像、发布内容和信息；您使用发布图片、视频功能时，我们会请求您授权
                            <Text style={styles.Focus}>相机</Text>、<Text style={styles.Focus}>照片</Text>、
                            <Text style={styles.Focus}>麦克风权限</Text>。
                            <Text style={styles.Focus}>
                                您如果拒绝授权提供，将无法使用此功能，但不影响您正常使用{Config.AppName}的其他功能；
                            </Text>
                            用户因使用我们的产品或者服务而被我们手机的信息，
                            例如其他用户发布的信息中可能含有您的部分信息（如：评论、留言、发布图文中涉及到与您相关的信息）；
                        </Text>
                        <Text style={styles.titleItem}>
                            （十二）个性化推荐/定向推送、维护/改进我们的产品与/或服务之必需
                        </Text>
                        <Text style={styles.tintFont}>
                            为了向您提供更优质和更适合您的产品与/或服务、让您有更好的产品与/或服务的使用体验或您同意的其他用途，在符合相关法律法规的前提下，我们可能将我们的某一项产品与/或服务所收集的您的个人信息，
                            以综合统计、分析的方式单独或与来自其他服务的某些信息结合进行使用，以便于向您提供个性化服务/定向推送，包括我们向您提供相关个性化信息、
                            在征得您同意的情况下与我们的合作伙伴共享信息以便他们向您发送有关其产品和服务的信息等，同时，我们也为您提供了相关定向推送的退出机制。
                            但未经您的同意，我们不会主动将前述信息传输至该第三方），以便我们向您推荐所在地区的最新消息或更适合您的服务内容等，如您决定退出我们基于位置信息作出的个性化推荐/定向推送的，
                            您可通过设备设置页面予以取消授权；您可以授权我们在移动端通过“消息”推送您可能更感兴趣的相关内容，如您希望我们停止继续推送的，您可通过相关功能设置页面予以取消授权。
                        </Text>
                        <Text style={styles.tintFont}>
                            我们可能会收集您使用我们的产品与/或服务时的答题记录、搜索记录、观看历史、收藏记录、观看时长、IP
                            地址、访问日期和时间、您的偏向网络行为、
                            兴趣偏好等信息形成用户画像用于帮助使我们更加了解您如何接入和使用我们的产品与/或服务、维护和改进我们的产品与/或服务或对您作出其他方面的回应。
                            同时，我们可能会收集您使用我们的产品与/或服务时的其他信息做一些其他合理用途，包括：调查问卷回复、您与
                            {Config.AppName}旗下公司/我们的合作伙伴之间互动时我们获得的相关信息用于研发和改进、
                            综合统计、数据分析或加工等处理、经您同意或授权的其他用途、遵守法律规定或其他一些合理用途。如我们在相关产品与/或服务之中提供了相应选项，
                            您也可以主动要求我们将您在该产品与/或服务所提供和储存的个人信息用于我们或我们合作方的其他服务。
                        </Text>
                        <Text style={styles.titleItem}>（十三）分享与活动参与 </Text>
                        <Text style={styles.tintFont}>
                            在您分享或接收被分享的信息、参加活动等情形下，我们需要访问您的剪切板，读取其中包含的口令、分享码、链接，以实现跳转、分享、活动联动等功能或服务。
                        </Text>
                        <Text style={styles.titleItem}>（十四）消息通知 </Text>
                        <Text style={styles.tintFont}>
                            您知悉并同意，对于您在使用产品及/或服务的过程中提供的您的联系方式（例如：联系电话），我们在运营中可能会向其中的一种或多种发送多类通知，用于用户消息告知、身份验证、安全验证、用户使用体验调研等用途；
                            此外，我们也可能会以短信、电话的方式，为您提供您可能感兴趣的服务、功能或活动等商业性信息的用途，但请您放心，如您不愿接受这些信息，您可以通过手机短信中提供的退订方式进行退订，也可以直接与我们联系进行退订。
                        </Text>
                        <Text style={styles.titleItem}>（十五）其他 </Text>
                        <Text style={styles.tintFont}>
                            如上文所述，如果某一需要收集您的个人信息的功能或产品/服务未能在本《
                            {Config.AppName}
                            隐私政策》中予以说明的，或者我们超出了与收集您的个人信息时所声称的目的及具有直接或合理关联范围的，我们将在收集和使用你的个人信息前，通过更新本《
                            {Config.AppName}
                            隐私政策》、页面提示、弹窗、消息通知、网站公告或其他便于您获知的方式另行向您说明，并为您提供自主选择同意的方式，且在征得您明示同意后收集和使用。
                        </Text>
                        <Text style={styles.tintFont}>例外情形</Text>
                        <Text style={styles.tintFont}>
                            另外，您充分理解并同意，我们在以下情况下收集、使用您的个人信息无需您的授权同意：
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>与国家安全、国防安全有关的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>与公共安全、公共卫生、重大公共利益有关的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>与犯罪侦查、起诉、审判和判决执行等直接相关的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            出于维护您或其他个人的生命、财产等重大合法权益但又很难得到您本人同意的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            所收集的信息是您自行向社会公开的或者是从合法公开的渠道（如合法的新闻报道、
                            政府信息公开等渠道）中收集到的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>根据与您签订和履行相关协议或其他书面文件所必需的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            用于维护我们的产品与/或服务的安全稳定运行所必需的，例如：发现、处置产品与/或服务的故障；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>有权机关的要求、法律法规等规定的其他情形。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>三、我们如何使用 Cookie 和同类技术</Text>
                        <Text style={styles.titleItem}>（一）关于 Cookie 和同类技术</Text>
                        <Text style={styles.tintFont}>
                            Cookie
                            是包含字符串的小文件，在您登入和使用网站或其他网络内容时发送、存放在您的计算机、移动设备或其他装置内（通常经过加密）。Cookie
                            同类技术是可用于与 Cookie 类似用途的其他技术，例如：Web Beacon、Proxy、嵌入式脚本等。
                        </Text>
                        <Text style={styles.tintFont}>
                            目前，我们主要使用 Cookie
                            收集您的个人信息。您知悉并同意，随着技术的发展和我们产品和服务的进一步完善，我们也可能会使用
                            Cookie 同类技术。
                        </Text>
                        <Text style={styles.titleItem}>（二）我们如何使用 Cookie 和同类技术</Text>
                        <Text style={styles.tintFont}>
                            在您使用我们的产品与/或服务时，我们可能会使用 Cookie
                            和同类技术收集您的一些个人信息，包括：您访问网站的习惯、您的浏览信息、您的登录信息，Cookie
                            和同类技术收集该类信息是为了您使用我们的产品与/或服务的必要、简化您重复操作的步骤（如注册、登录）、便于您查看使用历史（如视频观看历史）、
                            向您提供更切合您个人需要的服务内容和您可能更感兴趣的内容、保护您的信息和账号安全性、改善我们的产品和服务等。我们承诺仅在本《
                            {Config.AppName}
                            隐私政策》所述目的范围内使用 Cookie 和同类技术。
                        </Text>
                        <Text style={styles.tintFont}>
                            如果您的浏览器允许，您可以通过您的浏览器的设置以管理、（部分/全部）拒绝 Cookie
                            与/或同类技术；或删除已经储存在您的计算机、移动设备或其他装置内的 Cookie
                            与/或同类技术，从而实现我们无法全部或部分追踪您的个人信息。您如需详细了解如何更改浏览器设置，请具体查看您使用的浏览器的相关设置页面。您理解并知悉：我们的某些产品/服务只能通过使用
                            Cookie
                            或同类技术才可得到实现，如您拒绝使用或删除的，您可能将无法正常使用我们的相关产品与/或服务或无法通过我们的产品与/或服务获得最佳的服务体验，同时也可能会对您的信息保护和账号安全性造成一定的影响。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>四、我们如何共享、转让、公开披露您的个人信息</Text>
                        <Text style={styles.titleItem}>（一）共享</Text>
                        <Text style={[styles.titleItem, { fontSize: font(15) }]}>1.共享原则</Text>
                        <Text style={styles.tintFont}>
                            我们不会向其他任何公司、组织和个人分享您的个人信息，但以下情况除外：
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            与授权合作伙伴共享：我们将审慎评估第三方使用共享信息的目的，对这些合作方的安全保障能力进行综合评估，并要求其遵循合作法律协议。
                            我们会对合作方获取信息的软件工具开发包（SDK）、应用程序接口（API）进行严格的安全监测，以保护数据安全。对我们与之共享个人信息的公司、组织和个人，
                            我们会与其签署严格的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。
                        </Text>
                        <Text style={styles.tintFont}>{Config.AppName}APP接入第三方SDK清单：</Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            Alipay（支付宝）
                            SDK：主要收集您的手机状态、网络状态、读取写入外部储存，用于处理和缓存您的账单状态，便于您在应用内使用支付宝绑定、交易功能；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            微信开放平台
                            SDK：主要收集您的设备标识信息，用于微信授权登录、微信分享您感兴趣的内容和微信支付；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            QQ分享SDK：主要收集您的设备标识信息，用于将您感兴趣的内容分享至QQ、QQ空间；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            京东金融SDK：主要收集您的IMEI、mac地址、系统版本、网络环境，用于京东金融账号绑定，处理和缓存您的账单交易状态；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            穿山甲SDK：主要收集您的位置信息、设备标识信息、使用数据、诊断信息等，用于广告投放与监测归因，便于给您推荐您感兴趣的广告内容、减少崩溃、确保服务器正常运行；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            优量汇SDK：主要收集您的位置信息、设备标识信息、使用数据、诊断信息等，用于广告投放与监测归因，便于给您推荐您感兴趣的广告内容、减少崩溃、确保服务器正常运行；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            Sentry
                            SDK：主要收集运行过程中的崩溃信息、性能数据，用于crash监控、异常监控，最大程度减少APP奔溃、确保服务器正常运行、提升可扩展性和性能等；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            Matomo
                            SDK：主要收集您的IP地址、浏览器类型、使用语言、访问日期和时间、软硬件特征信息及您需求的网页记录、设备型号、设备识别码、操作系统、分辨率用于数据统计，帮助提升推送消息触达和保障系统运行稳定，以便提供更好的服务体验；
                        </Text>
                        <Text style={[styles.titleItem, { fontSize: font(15) }]}>2.实现功能或服务的共享信息 </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            当您在使用{Config.AppName}
                            中由我们的关联方、第三方提供的功能，或者当软件服务提供商、智能设备提供商、系统服务提供商与我们联合为您提供服务时我们会将实现业务所必需的信息与这些关联方、
                            第三方共享，用于综合统计并通过算法做特征与偏好分析，形成间接人群画像，用以向您进行推荐、展示或推送您可能感兴趣的信息，或者推送更适合您的特定功能、服务或商业广告。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            与授权合作伙伴共享：我们将审慎评估第三方使用共享信息的目的，对这些合作方的安全保障能力进行综合评估，并要求其遵循合作法律协议。
                            我们会对合作方获取信息的软件工具开发包（SDK）、应用程序接口（API）进行严格的安全监测，以保护数据安全。对我们与之共享个人信息的公司、组织和个人，
                            我们会与其签署严格的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            登录、绑定其他第三方帐号：当您使用{Config.AppName}帐号登录其他第三方的产品或服务时，或将
                            {Config.AppName}帐号与其他第三方帐号绑定，经过您的同意，我们会将您的昵称、头像、
                            直接或间接关注、粉丝等通讯关系及其他您授权的信息与前述产品或服务共享。您可以在【设置】-【帐号与安全】-【第三方帐号绑定】中管理您绑定的第三方帐号，
                            也可以通过提交【反馈与帮助】寻找客服帮助。请您注意，在您取消对其他第三方产品或服务的授权后，您可能无法使用已取消授权的
                            {Config.AppName}帐号再次登录该第三方产品或服务；如需登录，可能需要您再次授权。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            当您选择发布信息可以同步到我们的关联方或第三方的产品或服务（微博等）后，{Config.AppName}
                            可能会使用SDK或相关技术与这些产品或服务的提供方共享发布的内容及评论、点赞信息。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            小程序：当您使用小程序时，未经您同意，我们不会向这些开发者、运营者共享您的个人信息。当您使用小程序时，小程序可能会使用您授权的相关系统权限，您可以在小程序中撤回授权。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            地理位置服务：当您使用地理位置相关服务时，我们会通过SDK或相关技术将GPS信息与位置服务提供商进行共享以便可以向您返回位置结果。GPS信息是个人敏感信息，拒绝提供，仅会影响地理位置服务功能，但不影响其他功能的正常使用。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            钱包功能：钱包功能中的相关服务由我们的关联方及合作伙伴提供，当您使用钱包相关功能时我们的关联方和合作伙伴会根据功能或服务必需而收集必要限度内的信息。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            支付功能：支付功能由与我们合作的第三方支付机构向您提供服务。第三方支付机构可能需要收集
                            <Text style={styles.Focus}>
                                您的姓名、银行卡类型及卡号、有效期及手机号码。银行卡号、有效期及手机号码
                            </Text>
                            是个人敏感信息，
                            这些信息是支付功能所必需的信息，拒绝提供将导致您无法使用该功能，但不影响其他功能的正常使用。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            为与您使用的终端机型适配消息推送功能，我们可能会通过SDK等技术与终端设备制造商（华为、小米、OPPO、VIVO等）共享手机型号、版本及相关设备信息。
                        </Text>
                    </View>
                    <Text style={[styles.titleItem, { fontSize: font(15) }]}>3.实现广告相关的共享信息 </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        <Text style={styles.Focus}>广告推送与投放：</Text>
                        我们可能与进行推广和广告投放的合作伙伴共享信息，但我们不会共享用于识别您个人身份的信息（姓名、身份证号），
                        仅会向这些合作伙伴提供不能识别您个人身份的间接画像标签及去标识化的设备信息或匿名化后的设备、网络、渠道等信息，以帮助其在不识别您个人身份的前提下提升广告有效触达率。
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        <Text style={styles.Focus}>广告统计：</Text>
                        我们可能与业务的服务商、供应商和其他合作伙伴共享分析去标识化的设备信息或统计信息，这些信息难以或无法与您的真实身份相关联。这些信息将帮助我们分析、衡量广告和相关服务的有效性。
                    </Text>
                    <Text style={[styles.titleItem, { fontSize: font(15) }]}>4.实现安全与分析统计的共享信息 </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        <Text style={styles.Focus}>保障使用安全：</Text>
                        我们非常重视帐号、服务及内容安全，为保障您和其他用户的帐号与财产安全，使您和我们的正当合法权益免受不法侵害，我们和关联方或服务提供商可能会共享必要的设备、帐号及日志信息。
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        <Text style={styles.Focus}>分析产品使用情况：</Text>
                        为分析我们服务的使用情况，提升用户使用的体验，可能会与关联方或第三方共享产品使用情况（崩溃、闪退）的统计性数据，这些数据难以与其他信息结合识别您的个人身份。
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        <Text style={styles.Focus}>学术研究与科研：</Text>
                        为提升相关领域的科研能力，促进科技发展水平，我们在确保数据安全与目的正当的前提下，可能会与科研院所、高校等机构共享去标识化或匿名化的数据。
                    </Text>
                    <Text style={[styles.titleItem, { fontSize: font(15) }]}>5.帮助您参加营销推广活动 </Text>
                    <Text style={styles.tintFont}>
                        当您选择参加我们及我们的关联方或第三方举办的有关营销活动时，可能需要您提供姓名、通信地址、联系方式、银行帐号等信息。
                        其中部分信息是个人敏感信息，拒绝提供可能会影响您参加相关活动，但不会影响其他功能。只有经过您的同意，我们才会将这些信息与关联方或第三方共享，
                        以保障您在联合活动中获得体验一致的服务，或委托第三方及时向您兑现奖励。
                    </Text>
                    <Text style={styles.titleItem}>（二）转让 </Text>
                    <Text style={styles.tintFont}>
                        转让是指将个人信息控制权向其他公司、组织或个人转移的过程。原则上我们不会将您的个人信息转让，但以下情况除外：
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        您自行提出要求的；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        事先已征得您的明确授权同意；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        如我们进行兼并、收购、重组、分立、破产、资产转让或类似的交易，而您的个人信息有可能作为此类交易的一部分而被转移，
                        我们会要求新持有人继续遵守和履行该《
                        {Config.AppName}
                        隐私政策》的全部内容（包括使用目的、使用规则、安全保护措施等），否则我们将要求其重新获取您的明示授权同意；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        法律法规等规定的其他情形。
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        如具备上述事由确需转让的，我们会在转让前向您告知转让的信息的目的、类型（如涉及您的个人敏感信息的，我们还会向您告知涉及的敏感信息的内容），
                        并在征得您的授权同意后再转让，但法律法规另有规定的或本政策另有约定的除外。
                    </Text>
                    <Text style={styles.titleItem}>（三）公开披露 </Text>
                    <Text style={styles.tintFont}>
                        公开披露是指向社会或不特定人群发布信息的行为。除了因需要对违规账号、欺诈行为等进行处罚公告、公布中奖/获胜者等名单时脱敏展示相关信息等必要事宜而进行的必要披露外，
                        我们不会对您的个人信息进行公开披露，如具备合理事由确需公开披露的，我们会在公开披露前向您告知公开披露的信息的目的、类型（如涉及您的个人敏感信息的，我们还会向您告知涉及的敏感信息的内容），
                        并在征得您的授权同意后再公开披露，但法律法规另有规定的或本政策另有约定的除外。
                    </Text>
                    <Text style={styles.tintFont}>
                        对于公开披露的您的个人信息，我们会充分重视风险，在收到公开披露申请后第一时间且审慎审查其正当性、合理性、合法性，
                        并在公开披露时和公开披露后采取不低于本《
                        {Config.AppName}
                        隐私政策》约定的个人信息安全保护措施和手段的程度对其进行保护。
                    </Text>
                    <Text style={styles.tintFont}>
                        请您知悉，即使已经取得您的授权同意，我们也仅会出于合法、正当、必要、特定、明确的目的公开披露您的个人信息，并尽量对公开披露内容中的个人信息进行匿名化处理。
                    </Text>
                    <Text style={styles.tintFont}>例外情形</Text>
                    <Text style={styles.tintFont}>
                        根据法律法规等规定，在下述情况下，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        与国家安全、国防安全直接相关的；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        与公共安全、公共卫生、重大公共利益直接相关的；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        与犯罪侦查、起诉、审判和判决执行等直接相关的；或根据法律法规的要求、行政机关或公检法等有权机关的要求的；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        出于维护您或其他个人的生命、财产等重大合法权益但又很难得到您本人同意的；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        个人信息是您自行向社会公开的或者是从合法公开的渠道（如合法的新闻报道、政府信息公开等渠道）中收集到的；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        根据与您签订和履行相关协议或其他书面文件所必需的；
                    </Text>
                    <Text style={styles.tintFont}>
                        <Text style={styles.dotFont}>·</Text>
                        法律法规等规定的其他情形。
                    </Text>
                    <Text style={styles.titleItem}>（四）共享、转让、公开披露的相关责任 </Text>
                    <Text style={styles.tintFont}>
                        我们将严格按照本隐私政策的约定及相关法律法规的要求执行对个人信息的共享、转让、公开披露的操作，如因我们的过错原因导致您的合法权益遭受损害的，我们愿意就我们的过错在法律规定的范围内向您承担相应的损害赔偿责任。
                    </Text>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>五、您对个人信息享有的控制权 </Text>
                        <Text style={styles.tintFont}>
                            您对我们产品与/或服务中的您的个人信息享有多种方式的控制权，包括：您可以访问、更正/修改、删除您的个人信息，也可以撤回之前作出的对您个人信息的同意。
                            为便于您行使您的上述控制权，我们在产品的相关功能页面为您提供了操作指引和操作设置，您可以自行进行操作，如您在操作过程中有疑惑或困难的可以通过文末的方式联系我们来进行控制，我们会及时为您处理。
                        </Text>
                        <Text style={styles.titleItem}>（一）访问权 </Text>
                        <Text style={styles.tintFont}>
                            您可以在我们的产品与/或服务中查询或访问您的相关个人信息，包括：
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            账号信息：您可以通过相关产品页面随时登录您的个人账号，以访问您的账号中的个人资料信息，包括：头像、昵称、生日、性别等，
                            例如： “头像/昵称/生日/性别/个性签名”信息在“{Config.AppName}
                            ”中的更正/修改路径为：我的—头像—编辑资料；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            使用信息：您可以通过相关产品页面随时查阅您的使用信息，包括：答题记录、收藏记录、观看历史记录、离线缓存记录、搜索记录、上传内容、账单信息等，
                            例如：“历史记录”信息在“{Config.AppName}”中的访问路径为：我的-历史记录；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            其他信息：如您在此访问过程中遇到操作问题的或如需获取其他前述无法获知的个人信息内容，您可通过文末提供的方式联系我们，
                            我们将在核实您的身份后在合理期限内向您提供，但法律法规另有规定的或本政策另有约定的除外。
                        </Text>
                        <Text style={styles.titleItem}>（二）更正/修改权</Text>
                        <Text style={styles.tintFont}>
                            您可以在我们的产品与/或服务中更正/修改您的相关个人信息。为便于您行使您的上述权利，我们为您提供了在线自行更正/修改和向我们提出更正/修改申请两种方式。
                        </Text>
                        <Text style={styles.tintFont}>
                            对于您的部分个人信息，我们在产品的相关功能页面为您提供了操作指引和操作设置，您可以直接进行更正/修改，例如：“头像/昵称/生日/性别”信息在“
                            {Config.AppName}”中的更正/修改路径为：我的—头像—编辑资料；
                        </Text>
                        <Text style={styles.tintFont}>
                            对于您在行使上述权利过程中遇到的困难，或其他可能未/无法向您提供在线自行更正/修改权限的，
                            经对您的身份进行验证，且更正不影响信息的客观性和准确性的情况下，您有权对错误或不完整的信息作出更正或修改，或在特定情况下，尤其是数据错误时，
                            通过我们公布的反馈与报错等措施将您的更正/修改申请提交给我们，要求我们更正或修改您的数据，但法律法规另有规定的除外。但出于安全性和身份识别的考虑，您可能无法修改注册时提交的某些初始注册信息。
                        </Text>
                        <Text style={styles.titleItem}>（三）删除权 </Text>
                        <Text style={styles.tintFont}>
                            一般而言，我们只会在法律法规规定或必需且最短的时间内保存您的个人信息。为便于您行使您的上述删除权，我们为您提供了在线自行删除和向我们提出删除申请两种方式。
                        </Text>
                        <Text style={styles.tintFont}>
                            对于您的部分个人信息，我们在产品的相关功能页面为您提供了操作指引和操作设置，您可以直接进行删除，例如：“历史记录”信息在“
                            {Config.AppName}
                            ”中的删除路径为：我的—历史记录—编辑。一旦您删除后，我们即会对此类信息进行删除或匿名化处理，除非法律法规另有规定。
                        </Text>
                        <Text style={styles.tintFont}>
                            在以下情形下，您可以直接向我们提出删除您个人信息的请求，但已做数据匿名化处理或法律法规另有规定的除外。
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            我们违反法律法规规定，收集、使用您的个人信息的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            我们违反了与您的约定，收集、使用您的个人信息的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            法律法规等规定的其他情形。
                        </Text>
                        <Text style={styles.tintFont}>
                            关于您不再使用我们提供的产品与/或服务后、以及我们终止部分或全部产品与/或服务后我们对您的个人信息的处理，我们将在本文其他专门章/节中为您详细作出说明。
                        </Text>
                        <Text style={styles.tintFont}>
                            您理解并同意：当您从我们的产品与/或服务中删除信息后，我们可能不会立即从备份系统中删除相应的信息，但会在备份更新时删除这些信息。
                        </Text>
                        <Text style={styles.titleItem}>（四）索取权</Text>
                        <Text style={styles.tintFont}>
                            如您需要您的个人数据的副本，您可以通过本《
                            {Config.AppName}
                            隐私政策》文末提供的方式联系我们，在核实您的身份后，我们将向您提供您在我们的服务中的个人信息副本（包括基本资料、身份信息），
                            但法律法规另有规定的或本政策另有约定的除外。
                        </Text>
                        <Text style={styles.titleItem}>（五） 撤回同意权 </Text>
                        <Text style={styles.tintFont}>
                            如您想更改相关权限的授权（例如：位置、相册等），您可以通过您的硬件设备进行修改。如您在此过程中遇到操作问题的，可以通过本《
                            {Config.AppName}
                            隐私政策》文末提供的方式联系我们。
                        </Text>
                        <Text style={styles.tintFont}>
                            当您取消相关个人信息收集的授权后，我们将不再收集该信息，也无法再为您提供上述与之对应的服务；但您知悉并同意，除非您行使前述“
                            删除权”，否则您的该行为不会影响我们基于您之前的授权进行的个人信息的处理、存储。
                        </Text>
                        <Text style={styles.titleItem}>（六）注销权 </Text>
                        <Text style={styles.tintFont}>
                            我们为您提供{Config.AppName}
                            账号注销权限，您可以通过访问产品页面内的设置-账号安全-注销账号功能来注销您的账号。一旦您注销账号，将无法使用我们提供的产品和服务且视为自动放弃已有的权益，
                            因此请您谨慎操作。除法律法规另有规定外，注销账号之后，我们将停止为您提供我们所有的产品和服务，您曾通过该账号使用的我们的产品与服务下的所有内容、信息、数据、记录将会被删除或匿名化处理。
                        </Text>
                        <Text style={styles.titleItem}>（七）提前获知产品与/或服务停止运营权 </Text>
                        <Text style={styles.tintFont}>
                            我们将持续为您提供优质服务，若因特殊原因导致我们的部分或全部产品与/或服务被迫停止运营，我们将提前在显著位置或向您发送推送消息或以其他方式通知您，
                            并将停止对您个人信息的收集，同时在超出法律法规规定的必需且最短期限后，我们将会对所持有的您的个人信息进行删除或匿名化处理。
                        </Text>
                        <Text style={styles.titleItem}>（八）帮助反馈权 </Text>
                        <Text style={styles.tintFont}>
                            我们为您提供了多种反馈渠道，具体请见本政策“如何联系我们”章节。
                        </Text>
                        <Text style={styles.tintFont}>例外情形</Text>
                        <Text style={styles.tintFont}>
                            请您理解并知悉，根据法律法规等规定，在下述情况下，我们可能不会响应您的关于访问、更正/修改权、删除权、撤回同意权、索取权的请求：
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            与国家安全、国防安全有关的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            与公共安全、公共卫生、重大公共利益有关的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            与犯罪侦查、起诉、审判和判决执行等有关的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            我们有充分证据表明您存在主观恶意或滥用权利的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            涉及商业秘密的；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            法律法规等规定的其他情形。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>六、我们如何存储和保护您的个人信息 </Text>
                        <Text style={styles.titleItem}>（一）个人信息的存储 </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            存储地点：我们依照法律法规的规定，将您的个人信息存储于中华人民共和国境内。目前我们暂时不存在跨境存储您的个人信息或向境外提供个人信息的场景。
                            如需跨境存储或向境外提供个人信息的，我们会单独向您明确告知（包括出境的目的、接收方、使用方式与范围、使用内容、安全保障措施、安全风险等）并再次征得您的授权同意，并严格要求接收方按照本《
                            {Config.AppName}
                            隐私政策》以及其他相关要求来处理您的个人信息；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            存储期限：我们在为提供我们的产品和服务之目的所必需且最短的期间内保留您的个人信息，例如：当您使用我们的注册功能时，我们需要收集您的手机号码，且在您提供后并在您使用该功能期间，我们需要持续为您保留您的手机号码，
                            以向您正常提供该功能、保障您的账号和系统安全。
                            在超出上述存储期限后，我们会对您的个人信息进行删除或匿名化处理。但您行使删除权或法律法规另有规定的除外（例如：《电子商务法》规定：商品和服务信息、交易信息保存时间自交易完成之日起不少于三年）。
                        </Text>
                        <Text style={styles.titleItem}>（二）个人信息的保护措施 </Text>
                        <Text style={styles.tintFont}>
                            我们一直都极为重视保护用户的个人信息安全，为此我们采用了符合行业标准的安全技术措施及配套的组织架构和管理体系等多层面保护措施以最大程度降低您的信息被泄露、毁损、误用、非授权访问、非授权披露和更改的风险。包括：
                        </Text>
                        <Text style={[styles.tintFont, { color: '#000', fontSize: font(14), fontWeight: 'bold' }]}>
                            <Text style={styles.dotFont}>·</Text>
                            数据安全技术措施
                        </Text>
                        <Text style={styles.tintFont}>
                            （1）数据安全收集方面，通过个人信息安全影响评估确认数据收集的合法性、正当性和必要性，识别并以清晰、准确的方式告知用户以征得同意，同时对用户的授权同意采集行为进行日志记录；
                            采用敏感识别工具对收集的用户数据进行分类分级，针对不同级别的数据设置不同等级的安全策略；采用技术措施对收集或产生数据的来源方进行身份识别，确保数据来源的准确性和抗抵赖性；
                        </Text>
                        <Text style={styles.tintFont}>
                            （2）
                            数据安全传输方面，使用安全通道传输个人信息，并通过合适的加密算法进行安全加密、脱敏处理，确保数据传输过程中个人信息的秘密性和完整性；
                        </Text>
                        <Text style={styles.tintFont}>
                            （3）数据安全存储方面，采用数据分类分级管理制度，针对数据分类分级结果采取不同的信息存储策略；采用数据分类分级管理制度，针对数据分类分级结果采取不同的信息存储策略；
                            个人敏感信息需加密存储，确保数据安全使用规范能够落实到位；针对存储有个人信息的数据库加强权限控制与安全审计；定期对个人信息进行备份与恢复，确保个人信息在存储使用过程中的完整性；
                        </Text>
                        <Text style={styles.tintFont}>
                            （4）数据安全处理方面，依照使用场景和安全需求对个人信息进行脱敏处理，例如：在前端显示个人敏感信息之前需在服务端完成脱敏处理；开发、测试环境严禁使用真实用户信息；
                            实施严格的数据权限控制机制，采取多重身份认证、网络/数据隔离等技术措施，确保能够对处理个人信息的行为进行有效监控，避免数据被违规访问和未授权使用；
                        </Text>
                        <Text style={styles.tintFont}>
                            （5）数据安全销毁方面，根据法律法规要求和业务实际需求设定个人信息存储的最小可用期限，对到期的数据通过安全删除技术进行处理，确保已销毁数据不可恢复，技术手段包括但不限于数据彻底清除方案、磁盘销毁、物理销毁等；
                        </Text>
                        <Text style={styles.tintFont}>
                            （6）
                            建立完整的审计机制，对数据生命周期的全流程进行监控与审计，防止您的个人信息遭遇未经授权的访问、公开披露、使用、修改、人为或意外的损坏或丢失；
                        </Text>
                        <Text style={styles.tintFont}>（7） 其他实现数据安全保护的措施。</Text>
                        <Text style={[styles.tintFont, { color: '#000', fontSize: font(14), fontWeight: 'bold' }]}>
                            <Text style={styles.dotFont}>·</Text>
                            数据安全组织和管理措施
                        </Text>
                        <Text style={styles.tintFont}>
                            （1）成立专门的个人信息保护责任部门，建立相关的内控管理流程，对可能接触到您的信息的工作人员采取最小化权限原则；
                        </Text>
                        <Text style={styles.tintFont}>
                            （2）建立数据分类分级制度、业务数据安全使用规范、数据合作规范等管理体系，保障您的信息在收集、传输、使用、存储、转移、销毁等环节的处置满足法律法规相关规范和安全要求；
                        </Text>
                        <Text style={styles.tintFont}>
                            （3）定期组织员工参加安全与隐私保护相关培训并要求完成规定的考核，加强员工对于保护个人信息重要性的认知；
                        </Text>
                        <Text style={styles.tintFont}>（4）其他可行的安全组织和管理措施。</Text>
                        <Text style={[styles.tintFont, { color: '#000', fontSize: font(14), fontWeight: 'bold' }]}>
                            <Text style={styles.dotFont}>·</Text>
                            合作协议条款保证
                        </Text>
                        <Text style={styles.tintFont}>
                            （1）在我们从第三方间接收集您的个人信息前，我们会明确以书面形式（如合作协议、承诺书）要求该第三方在已经取得您明示同意后收集以及处理（如共享等）个人信息，
                            在书面协议层面要求第三方对个人信息来源的合法性和合规性作出承诺，如第三方有违反行为的，我们会明确要求该第三方承担相应法律责任；
                        </Text>
                        <Text style={styles.tintFont}>
                            （2）在我们向业务合作伙伴共享您的个人信息前，我们会严格要求合作伙伴的信息保护义务与责任，并要求业务合作伙伴在合作前签署关于数据安全的保护协议，一旦业务合作伙伴有任何违反协议的行为，将须承担相应法律责任；
                        </Text>
                        <Text style={styles.tintFont}>（3）其他合作协议中明确约定的内容。</Text>
                        <Text style={[styles.tintFont, { color: '#000', fontSize: font(14), fontWeight: 'bold' }]}>
                            <Text style={styles.dotFont}>·</Text>
                            安全事件的处理
                        </Text>
                        <Text style={styles.tintFont}>
                            （1）如不幸发生个人信息安全事件的，我们将按照法律法规的要求，及时向您告知安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。
                            我们将及时将事件相关情况以短信、推送通知、站内消息等一种或多种方式告知您，难以逐一告知个人信息主体时，
                            我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况；
                        </Text>
                        <Text style={styles.tintFont}>
                            （2）请您知悉并理解，互联网并非绝对安全的环境，我们强烈建议您通过安全方式、使用复杂密码，协助我们保证您的账号安全。
                            如您发现自己的个人信息泄密，尤其是您的账户或密码发生泄露，请您立即根据本隐私政策文末中提供的联系方式联络我们，以便我们采取相应措施来保护您的信息安全。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>七、未成年人保护 </Text>
                        <Text style={styles.tintFont}>
                            {Config.AppName}一直非常注重对未成年人的保护，致力于践行我们的企业社会责任。
                            {Config.AppName}
                            的绝大部分产品与/或服务主要面向成年人提供，针对这部分产品与/或服务，我们不会主动直接向未成年人收集其个人信息，如未成年人需要使用的，应首先取得其监护人的同意（包括本政策），
                            在监护人同意后和指导下进行使用、提交个人信息；我们希望监护人亦能积极的教育和引导未成年人增强个人信息保护意识和能力，保护未成年人个人信息安全。
                            {Config.AppName}会严格履行法律规定的未成年人保护义务与责任，
                            我们只会在法律允许、监护人同意或保护未成年人所必要的情况下收集、使用、共享、转让或披露未成年人个人信息，如果我们发现未成年人在未事先获得其监护人同意的情况下使用了我们的产品与/或服务的，
                            我们会尽最大努力与监护人取得联系，并在监护人要求下尽快删除相关未成年人个人信息。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>
                            八、本《
                            {Config.AppName}
                            隐私政策》的更新{' '}
                        </Text>
                        <Text style={styles.tintFont}>
                            我们鼓励您在每次使用我们的产品或服务时都查阅我们的《
                            {Config.AppName}
                            隐私政策》。 为了给您提供更好的服务，我们会根据产品的更新情况及法律法规的相关要求更新本《
                            {Config.AppName}
                            隐私政策》的条款，该等更新构成本《
                            {Config.AppName}
                            隐私政策》的一部分。 如该等更新造成您在本《
                            {Config.AppName}
                            隐私政策》下权利的实质减少或重大变更，我们将在本政策生效前通过在显著位置提示或向您发送推送消息或以其他方式通知您，
                            若您继续使用我们的服务，即表示您充分阅读、理解并同意受经修订的《
                            {Config.AppName}
                            隐私政策》的约束。为保障您的合法权益，我们建议您可以定期在我们平台的设置页面中查看本政策。
                        </Text>
                        <Text style={styles.tintFont}>上述的“重大变更”包括但不限于：</Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息的类型、个人信息的使用方式等；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            我们在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有者变更等；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            个人信息共享、转让或公开披露的主要对象发生变化；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            您参与个人信息处理方面的权利及其行使方式发生重大变化；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            个人信息安全影响评估报告表明存在高风险时；
                        </Text>
                        <Text style={styles.tintFont}>
                            <Text style={styles.dotFont}>·</Text>
                            其他重要的或可能严重影响您的个人权益的情况发生时。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>九、如何联系我们 </Text>
                        <Text style={styles.titleItem}>
                            （一）如您对本《
                            {Config.AppName}
                            隐私政策》的执行或使用我们的服务时遇到的与隐私保护相关的事宜有任何问题（包括问题咨询、建议、投诉等），您可以通过产品功能页面的反馈与帮助在线提交意见反馈；
                            也可以将问题发送至邮箱（lejunhao@haxifang.com）与我们联系，我们会在收到您的意见及建议后，并在验证您的用户身份后的
                            15 个工作日内或法律法规规定的期限内尽快向您回复。
                        </Text>
                    </View>
                    <View style={styles.fontWrap}>
                        <Text style={styles.textTitle}>十、其他 </Text>
                        <Text style={styles.titleItem}>
                            （一）本《
                            {Config.AppName}
                            隐私政策》的标题仅为方便及阅读而设，并不影响正文其中任何规定的含义或解释。
                        </Text>
                        <Text style={styles.titleItem}>
                            （二）本《隐私政策》的版权为公司所有，在法律允许的范围内，公司保留最终解释和修改的权利。
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
        lineHeight: font(22),
        color: Theme.subTextColor,
    },
    tintFont: {
        fontSize: font(15),
        lineHeight: font(22),
        color: Theme.subTextColor,
    },
    textTitle: {
        fontSize: font(18),
        color: '#000',
        fontWeight: 'bold',
    },
    titleItem: {
        fontWeight: 'bold',
        fontSize: font(16),
        color: '#000',
    },
    dotFont: {
        color: '#000',
        fontSize: 25,
    },
    Focus: {
        color: '#000',
        fontWeight: 'bold',
    },
});
