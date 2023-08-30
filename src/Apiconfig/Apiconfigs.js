export let baseURL = "https://node.masplatform.net";
//export let baseURL = "https://mas-server-lk9j.onrender.com";
export let pageURL = "https://masplatform.net"
export let socketURL = "wss://node.masplatform.net";

/*if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
   baseURL = "http://localhost:1865";
   socketURL = "ws://localhost:1865";
}*/

const url = `${baseURL}/api/v1`;
const Apiconfigs = {
    connectWallet: `${url}/user/connectWallet`,
    updateprofile: `${url}/user/updateProfile`,
    donationTransactionlist: `${url}/user/donationTransactionlist`,
    sendOtp: `${url}/user/send-otp`,
    verifyOtp: `${url}/user/verify-otp`,
    profile: `${url}/user/profile`,
    myfeed: `${url}/user/myFeed`,
    getMyfeed: `${url}/user/getMyFeed`,
    myauction: `${url}/nft/listNFT`,
    mynft: `${url}/nft/nft/`,
    bundleList: `${url}/nft/bundleList`,
    nftall: `${url}/nft/allNftList`,
    likeDislikeFeed: `${url}/user/likeDislikeFeed/`,
    unSubscription: `${url}/user/unSubscription?_id=`,
    transactionList: `${url}/user/transactionList/`,

    mysubscription: `${url}/user/mySubscriptions`,
    delnft: `${url}/nft/nft/`,
    listorder: `${url}/order/listOrder`,
    ipfsupload: `${url}/nft/ipfsUpload`,
    subscribeNow: `${url}/user/subscribeNow/`,
    share: `${url}/user/shareWithAudience`,
    editAudience: `${url}/user/editAudience`,
    uploadft: `${url}/nft/uploadNFT`,
    createNft: `${url}/nft/createNft`,
    nftList: `${url}/nft/nftList`,
    myNftList: `${url}/nft/myNftList`,
    addNft: `${url}/nft/nft`,
    editNft: `${url}/nft/nft`,
    viewNft: `${url}/nft/viewNft/`,
    order: `${url}/order/order`,
    cancelOrder: `${url}/order/cancelOrder?_id=`,

    edit: `${url}/nft/nft`,
    del: `${url}/nft/nft`,
    placebid: `${url}/bid/bid`,
    getbid: `${url}/bid/bid`,
    myBid: `${url}/bid/myBid`,
    sublist: `${url}/user/subscriberList`,
    allorder: `${url}/order/allListOrder`,
    userlist: `${url}/user/userList`,
    orderwithid: `${url}/order/order/`,
    bids: `${url}/bid/bid/`,
    report: `${url}/user/reportNow/`,
    userlogin: `${url}/user/login`,
    sendOtpRegister: `${url}/user//sendOtpRegister`,
    register: `${url}/user/register`,
    forgotPassword: `${url}/user/forgotPassword/`,
    resetPassword: `${url}/user/resetPassword/`,


    withdraw: `${url}/blockchain/withdraw`,
    sendOrderToUser: `${url}/order/sendOrderToUser`,
    soldOrderList: `${url}/order/soldOrderList`,
    buyOrderList: `${url}/order/buyOrderList`,
    auctionNftList: `${url}/order/auctionNftList`,
    auctionNft: `${url}/order/auctionNft/`,
    myAuctionNftList: `${url}/order/myAuctionNftList`,
    likeDislikeNft: `${url}/user/likeDislikeNft/`,
    donation: `${url}/user/donation`,
    listBid: `${url}/bid/listBid`,
    acceptBid: `${url}/bid/acceptBid`,
    userAllDetails: `${url}/user/userAllDetails/`,
    getUser: `${url}/user/getUser/`,
    getCertificates: `${url}/user/getCertificates`,
    listAllNft: `${url}/nft/listAllNft`,
    followProfile: `${url}/user/followProfile/`,
    profileFollowersList: `${url}/user/profileFollowersList`,
    profileFollowingList: `${url}/user/profileFollowingList`,
    donateUserList: `${url}/user/donateUserList`,

    chatList: `${url}/chat/list/`,
    initChat: `${url}/chat/init/`,
    viewChat: `${url}/chat/view/`,
    readChat: `${url}/chat/read/`,
    chatUploadImage: `${url}/chat/uploadFile/`,

    latestUserList: `${url}/user/latestUserList`,
    listFee: `${url}/admin/listFee`,
    readNotification: `${url}/notification/read`,
    markAllNotificationsRead: `${url}/notification/markAllRead`,
    removeNotification: `${url}/notification/remove`,
    likeDislikeUser: `${url}/user/likeDislikeUser/`,
    bundlePostList: `${url}/user/bundlePostList/`,
    bundleContentList: `${url}/user/bundleContentList`,
    allUserList: `${url}/user/allUserList`,
    exportNFT: `${url}/user/exportNFT`,
    totalEarnings: `${url}/user/totalEarnings`,
    listSocial: `${url}/admin/listSocial`,
    getBanner: `${url}/user/getBanner`,
    listBanner: `${url}/user/listBanner`,
    getBannerDuration: `${url}/user/getBannerDuration`,
    landingContentList: `${url}/content/landingContentList`,
    staticContentList: `${url}/static/staticContentList`,
    viewStaticPage: `${url}/static/staticContent`,

    story: `${url}/story/`,
    likeDislikeStory: `${url}/story/likeDislikeStory/`,
    getAllStories: `${url}/story/getAllStories/`,
    getSubscription: `${url}/user/getSubscription`
};

export default Apiconfigs;
