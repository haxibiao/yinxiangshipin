// creation
import CreationScreen from '../screens/creation';
import SelectCategory from '../screens/creation/SelectCategory';
import EditPostScreen from '../screens/creation/EditPost';
import TagListScreen from '../screens/creation/TagList';

// login
import LoginScreen from '../screens/login';
import RetrievePasswordScreen from '../screens/login/RetrievePasswordScreen';
import VerificationScreen from '../screens/login/VerificationScreen';
import AccountLoginScreen from '../screens/login/AccountLogin';
import LoginHelpScreen from '../screens/login/loginHelp';
import MobileLoginScreen from '../screens/login/MobileLogin';

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
import SpiderVideoTaskScreen from '../screens/task/SpiderVideoTask';
import PraiseScreen from '../screens/task/Praise';

// find search
import SearchScreen from '../screens/search';
import SearchedShortVideoScreen from '../screens/search/shortVideo';
import SearchedShortVideoListScreen from '../screens/search/shortVideo/List';

// user
import UserScreen from '../screens/user';
import FavoriteCollection from '../screens/user/FavoriteCollection';
import SocietyScreen from '../screens/user/Society';
import UserBlockScreen from '../screens/user/UserBlock';
// user personage
import EditProfileScreen from '../screens/user/personage/EditProfile';

// comment
import CommentScreen from '../screens/comment/CommentScreen';

// post
import PostDetailScreen from '../screens/post';
import SharedPostDetail from '../screens/post/SharedPostDetail';

// tag
import TagDetailScreen from '../screens/tag';
import TagVideoListScreen from '../screens/tag/VideoList';

// collection
import CollectionScreen from '../screens/collection';
import RandomCollectionScreen from '../screens/collection/RandomList';
import CreateCollectionScreen from '../screens/collection/CreateCollection';
import CollectionDetailScreen from '../screens/collection/CollectionDetail';
import EpisodeVideoListScreen from '../screens/collection/EpisodeVideoList';
import CollectionVideoListScreen from '../screens/collection/VideoList';
import PostsSelectScreen from '../screens/collection/PostsSelect';
import EditCollectionScreen from '../screens/creation/EditCollection';

// category
import CategoryScreen from '../screens/category';

// notification
import NotificationScreen from '../screens/notification';
import ChatScreen from '../screens/chat';
import ChatSettingScreen from '../screens/chat/ChatSetting';
import CommentsScreen from '../screens/notification/CommentsScreen';
import BeLikedScreen from '../screens/notification/BeLiked';
import FollowNotificationsScreen from '../screens/notification/FollowScreen';
import OtherRemindScreen from '../screens/notification/OtherRemindScreen';

// settings
import SettingsScreen from '../screens/settings';
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

// movie
import MovieDetail from '../screens/movie/MovieDetail';
import MovieCategories from '../screens/movie/categories';
import CategoriesTab from '../screens/movie/categories/CategoriesTab';
import MovieHistories from '../screens/movie/Histories';
import MovieFavorites from '../screens/movie/Favorites';

export default {
    Login: {
        component: LoginScreen,
    },
    AccountLogin: {
        component: AccountLoginScreen,
    },
    MobileLogin: {
        component: MobileLoginScreen,
    },
    LoginHelp: {
        component: LoginHelpScreen,
    },
    CreatePost: {
        component: CreationScreen,
    },
    SelectCategory: {
        component: SelectCategory,
    },
    EditPost: {
        component: EditPostScreen,
    },
    TagList: {
        component: TagListScreen,
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
    Search: {
        component: SearchScreen,
    },
    SearchVideo: {
        component: SearchedShortVideoScreen,
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
    SharedPostDetail: {
        component: SharedPostDetail,
    },
    TagDetail: {
        component: TagDetailScreen,
    },
    TagVideoList: {
        component: TagVideoListScreen,
    },
    SearchedVideoList: {
        component: SearchedShortVideoListScreen,
    },
    CollectionVideoList: {
        component: CollectionVideoListScreen,
    },
    EpisodeVideoList: {
        component: EpisodeVideoListScreen,
    },
    NotificationCenter: {
        component: NotificationScreen,
    },
    Chat: {
        component: ChatScreen,
    },
    ChatSetting: {
        component: ChatSettingScreen,
    },
    User: {
        component: UserScreen,
    },
    RetrievePassword: {
        component: RetrievePasswordScreen,
    },
    获取验证码: {
        component: VerificationScreen,
    },
    FavoriteCollection: {
        component: FavoriteCollection,
    },
    RandomCollection: {
        component: RandomCollectionScreen,
    },
    CreateCollection: {
        component: CreateCollectionScreen,
    },
    SelectPost: {
        component: PostsSelectScreen,
    },
    EditCollection: {
        component: EditCollectionScreen,
    },
    CollectionDetail: {
        component: CollectionDetailScreen,
    },
    UserCollection: {
        component: CollectionScreen,
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
    SpiderVideoTask: {
        component: SpiderVideoTaskScreen,
    },
    Praise: {
        component: PraiseScreen,
    },
    PhoneVerification: {
        component: PhoneVerification,
    },
    UserBlockList: {
        component: UserBlockScreen,
    },
    MovieCategories: {
        component: MovieCategories,
    },
    MovieDetail: {
        component: MovieDetail,
    },
    CategoriesTab: {
        component: CategoriesTab,
    },
    MovieHistories: {
        component: MovieHistories,
    },
    MovieFavorites: {
        component: MovieFavorites,
    },
};
