import CreationScreen from '../screens/creation';
import SelectCategory from '../screens/creation/SelectCategory';
import EditPost from '../screens/creation/EditPost';

// login
import LoginScreen from '../screens/login';
import RetrievePasswordScreen from '../screens/login/RetrievePasswordScreen';
import VerificationScreen from '../screens/login/VerificationScreen';

// wallet
import Wallet from '../screens/wallet';
import WithdrawApply from '../screens/wallet/WithdrawApply';
import WithdrawHistory from '../screens/wallet/WithdrawHistory';
import VerifyAccount from '../screens/wallet/VerifyAccount';
import WithdrawDetail from '../screens/wallet/WithdrawDetail';
import BindAliPay from '../screens/wallet/BindAliPay';

// feedback
import FeedbackScreen from '../screens/Feedback';
import FeedbackDetail from '../screens/Feedback/FeedbackDetail';

// Task
import TaskScreen from '../screens/task';

// find search
import SearchScreen from '../screens/search';

// user
import UserHomeScreen from '../screens/user';
import SocietyScreen from '../screens/user/Society';
import WorksScreen from '../screens/user/WorksScreen';
import LikedArticlesScreen from '../screens/user/LikedArticlesScreen';
import UserBlockScreen from '../screens/user/UserBlock';

// my
import BrowsingHistoryScreen from '../screens/my/HistoryScreen';
import CollectionsScreen from '../screens/my/Collections';
import EditProfileScreen from '../screens/profile/HomeScreen';

// content
import ArticleDetailScreen from '../screens/article/DetailScreen';
import CommentScreen from '../screens/comment/CommentScreen';
import PostDetailScreen from '../screens/post';

// category
import CategoryScreen from '../screens/category';

// notification
// import NewChatScreen from '../screens/chat/NewChatScreen';
import ChatScreen from '../screens/chat';
import ChatSettingScreen from '../screens/chat/ChatSetting';
import CommentsScreen from '../screens/notification/CommentsScreen';
import BeLikedScreen from '../screens/notification/BeLikedScreen';
import FollowNotificationsScreen from '../screens/notification/FollowScreen';
import OtherRemindScreen from '../screens/notification/OtherRemindScreen';

// settings
import SettingsScreen from '../screens/settings/HomeScreen';
import AboutUsScreen from '../screens/settings/AboutUsScreen';
import UserAgreementScreen from '../screens/settings/UserAgreementScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';
import BindingAccount from '../screens/settings/BindingAccount';
import ModifyPassword from '../screens/settings/ModifyPassword';
import AccountSecurity from '../screens/settings/AccountSecurity';
import VerifyAliPay from '../screens/settings/VerifyAliPay';
import LogoutAccount from '../screens/settings/LogoutAccount';
import CancellationAgreement from '../screens/settings/CancellationAgreement';
import PhoneVerification from '../screens/settings/PhoneVerification';
import VersionInformation from '../screens/settings/VersionInformation'; // 版本信息
import CommonQuestionScreen from '../screens/settings/CommonQuestionScreen'; // 版本信息

export default {
    Login: {
        component: LoginScreen,
    },
    CreatePost: {
        component: CreationScreen,
    },
    SelectCategory: {
        component: SelectCategory,
    },
    EditPost: {
        component: EditPost,
    },
    Wallet: {
        component: Wallet,
    },
    WithdrawApply: {
        component: WithdrawApply,
    },
    WithdrawHistory: {
        component: WithdrawHistory,
    },
    VerifyAccount: {
        component: VerifyAccount,
    },
    WithdrawDetail: {
        component: WithdrawDetail,
    },
    BindAliPay: {
        component: BindAliPay,
    },
    VersionInformation: {
        component: VersionInformation,
    },
    CommonQuestion: {
        component: CommonQuestionScreen,
    },
    CommentNotification: {
        component: CommentsScreen,
    },
    FollowNotification: {
        component: FollowNotificationsScreen,
    },
    BeLikedNotification: {
        component: BeLikedScreen,
    },
    OtherRemindNotification: {
        component: OtherRemindScreen,
    },
    Works: {
        component: WorksScreen,
    },
    Society: {
        component: SocietyScreen,
    },
    Setting: {
        component: SettingsScreen,
        path: 'setting/:route',
    },
    EditProfile: {
        component: EditProfileScreen,
    },
    AboutUs: {
        component: AboutUsScreen,
    },
    UserProtocol: {
        component: UserAgreementScreen,
    },
    PrivacyPolicy: {
        component: PrivacyPolicyScreen,
    },
    ModifyPassword: {
        component: ModifyPassword,
    },
    文章详情: {
        component: ArticleDetailScreen,
    },
    Category: {
        component: CategoryScreen,
    },
    Comment: {
        component: CommentScreen,
    },
    PostDetail: {
        component: PostDetailScreen,
    },
    Chat: {
        component: ChatScreen,
    },
    ChatSetting: {
        component: ChatSettingScreen,
    },
    // 新消息: {
    //     component:NewChatScreen,
    // },
    User: {
        component: UserHomeScreen,
    },
    喜欢: {
        component: LikedArticlesScreen,
    },
    RetrievePassword: {
        component: RetrievePasswordScreen,
    },
    获取验证码: {
        component: VerificationScreen,
    },
    我的收藏: {
        component: CollectionsScreen,
    },
    浏览记录: {
        component: BrowsingHistoryScreen,
    },
    BindingAccount: {
        component: BindingAccount,
    },
    AccountSecurity: {
        component: AccountSecurity,
    },
    Feedback: {
        component: FeedbackScreen,
    },
    FeedbackDetail: {
        component: FeedbackDetail,
    },
    VerifyAliPay: {
        component: VerifyAliPay,
    },
    LogoutAccount: {
        component: LogoutAccount,
    },

    CancellationAgreement: {
        component: CancellationAgreement,
    },
    TaskCenter: {
        component: TaskScreen,
    },
    PhoneVerification: {
        component: PhoneVerification,
    },
    UserBlockList: {
        component: UserBlockScreen,
    },
    Search: {
        component: SearchScreen,
    },
};
