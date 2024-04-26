import {
  Box,
  Container,
  Dialog,
  IconButton,
  Grid,
  Typography,
 
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "src/context/User";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import Loader from "src/component/Loader";
import { toast } from "react-toastify";
import ReactPlayer from "react-player";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: { padding: "70px 0px" },
  bannerimg: {
    overflow: "hidden",
    backgroundPosition: "center !important",
    backgroundSize: "100% !important",
    backgroundRepeat: " no-repeat !important",
    height: "260px",
    borderRadius: "10px",
    "@media(max-width:1010px)": {
      height: "140px",
      borderRadius: "25px",
    },
    "& img": {
      minHeight: "100%",
      minWidth: "100%",
      height: "auto",
      width: "auto",
    },
  },
  subsection: {
    display: "flex",
    justifyContent: "start",
    "& h4": {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "40px",
      lineHeight: "130%",
    },
    "& h5": {
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "130%",
      color: "rgba(0, 0, 0, 0.5)",
    },
  },
  text1: {
    marginLeft: "16px",
    "@media(max-width:375px)": {
      marginTop: "5px",
      marginLeft: "0px",
    },
    "& h4": {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "40px",
      lineHeight: "130%",
      "@media(max-width:1010px)": {
        fontSize: "30px",
      },
      "@media(max-width:930px)": {
        fontSize: "25px",
      },
    },
    "& h5": {
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "130%",
      color: "#000",
    },
  },
  whitebox: {
    background: "#FFFFFF",
    filter: "drop-shadow(0px 0px 40px rgba(0, 0, 0, 0.25))",
    boxShadow: "rgb(99 99 99 / 20%) 0px 2px 8px 0px",
    borderRadius: "10px",
    paddingTop: "10px",
    paddingBottom: "10px",
  },

  idtxt: {
    display: "flex",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "18px",
    alignItems: "center",
    "@media(max-width:818px)": {
      display: "block",
    },
  },
  file: {
    padding: "10px 10px 10px 10px",
    // background: "#FCF2FA",
    borderRadius: "50%",
  },

  boxsection: {
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "40px",
    "& h6": {
      color: " #3B0D60",
      fontWeight: "bold",
      fontSize: "18px",
      paddingTop: "7px",
      textAlign: "center",
    },
  },
  box3: {
    display: "flex",
    alignItems: "center",
    paddingTop: "13px",
    "& h6": {
      color: "#C6BECC",
      marginLeft: "10px",
      paddingBottom: "10px",
      [theme.breakpoints.up("sm")]: {
        fontSize: "15px",
      },
      [theme.breakpoints.up("xs")]: {
        fontSize: "12px",
      },
    },
  },
  text3: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "10px",
    "& h5": {
      color: "#E4C3DE",
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "130%",
    },
  },
  text4: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "10px",
    "& h4": {
      color: "#D200A5",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "14px",
      lineHeight: "130%",
    },
  },
  btnbox1: {
    "@media(max-width:818px)": {
      marginTop: "5px",
    },
    "& Button": {
      margin: "5px",
    },
    "& h6": {
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "130%",
    },
  },
  price: {
    paddingBottom: "11px",
    "& h6": {
      fontWeight: "bold",
      fontSize: "10px",
      lineHeight: "130%",
      color: "#E4C3DE",
    },
  },
  box4: {
    backgroundColor: "#FCF2FA",
    borderRadius: "16px",
  },
  dotimg: {
    background: "#D200A5",
    boxShadow: "0px 4px 7px rgba(210, 0, 165, 0.25)",
  },
  socialMediaIcon: {
    fontSize: "30px",
    color: "#C6BECC",
  },
  btnfollow2: {
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(24px)",
    borderRadius: "10px",
    marginRight: "10px",
    padding: "15px 15px",
    [theme.breakpoints.down("sm")]: {
      background: "rgb(52 162 240 / 60%)",
    },
    "@media(max-width:818px)": {
      padding: "6px 16px",
    },
    "& h2": {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "28px",
      lineHeight: "130%",
      textAlign: "center",
      color: "#FFFFFF",
      "@media(max-width:818px)": {
        fontSize: "18px",
      },
    },
    "& h5": {
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: "14px",
      lineHeight: "130%",
      color: "#FFFFFF",
      textAlign: "center",
      "@media(max-width:818px)": {
        fontSize: "12px",
      },
    },
  },

  headbox2: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    marginBottom: "15px",
    "@media(max-width:767px)": {
      display: "block",
      padding: "0 10px",
    },
  },
  btnhead: {
    display: "flex",
    flexDirection: "column",
    marginTop: "-100px",
    "@media(max-width:800px)": { marginTop: "20px", marginBottom: "20px" },
  },
  profileimg: {
    backgroundColor: "#fafafa",
    marginTop: "-130px",
    overflow: "hidden",
    width: "175px",
    height: "175px",
    borderRadius: "10px",
    position: "relative",
    border: "2px solid #FFFFFF",
    "@media(max-width:1010px)": {
      marginTop: "-65px",
      width: "110px",
      height: "110px",
    },
    "@media(max-width:800px)": {
      marginTop: "-65px",
      width: "90px",
      height: "90px",
    },
    "& .editprofilebutton": {
      background: "linear-gradient(261.87deg, #62D3F0 13.12%, #35A5F5 83.57%)",
      position: "absolute",
      right: "3px",
      bottom: "3px",
      "@media(max-width:800px)": {
        width: "35px",
        height: "35px",
      },
      "& svg": {
        color: "#FFFFFF",
      },
    },
    "& img": {
      minHeight: "100%",
      minWidth: "100%",
      height: "auto",
      width: "auto",
    },
  },

  FollowingBox: {
    overflowx: "scroll",
  },
  profileWallet: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    "@media(max-width:767px)": {
      borderBottom: "1px solid gray",
    },

    "& h6": {
      color: "#00000",
      "@media(max-width:800px)": { fontSize: "17px" },
    },
  },
  customizedButton: {
    position: "absolute",
    top: "-42px",
    right: "-9px",
    color: "#fff",
  },
  tabBtn: {
    "@media(max-width:767px)": {
      marginTop: "10px",
    },

    "& button": {
      borderRadius: "10px",
      fontWeight: "600",
      fontSize: "14px",
      marginRight: "4px",
      "&.active": {
        color: "#fff",
        boxShadow: "0px 4px 4px rgb(0 0 0 / 25%)",
        background:
          "linear-gradient(261.87deg, #62D3F0 13.12%, #35A5F5 83.57%)",
      },
    },
  },
  dlflex: {
    "& label": {
      padding: "0px",
    },
  },
  buttonBox: {
    display: "flex",
    "@media(max-width:768px)": {
      marginTop: "10px",
    },
  },
  ItemData: {
    display: "flex",
    alignItems: "center",
    "& h4": {
      fontSize: "14px",
      fontWeight: "400",
    },
  },
  galleryContainer: {
    display: 'flex',        // Enables flexbox
    flexDirection: 'row',   // Children in a row
    flexWrap: 'wrap',       // Allows wrapping items to the next line if no space
    justifyContent: 'center', // Centers items horizontally if there's extra space
    gap: theme.spacing(2),  // Adds space between the boxes
  },
  profileimg1: {
    width: 'calc(10% - theme.spacing(5))', // Three images per row, adjust for gap
    height: 'auto', // Keeps image aspect ratio
  },
  detailBox: {
    width: '1200px', // Adjust width as necessary
    height: '140px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    padding: '20px',
    backgroundColor: '#fff',
    overflowY: 'auto', // Allows vertical scrolling
    overflowX: 'auto' // Prevents horizontal scrolling
  },
}));

const currencies = [
  {
    value: "PUBLIC",
    label: "PUBLIC",
  },
  {
    value: "PRIVATE",
    label: "PRIVATE",
  },
];
export default function itemDetails() {
  const navigate = useNavigate();
  const auth = useContext(UserContext);
  const location = useLocation();
  const classes = useStyles();
  const isLogin = !!sessionStorage.getItem("token");
  const [selectedFilter, setSelectedFilter] = useState({
    startDate: "",
    endDate: "",
    searchKey: "",
    type: "",
  });

  const [itemDetails, setitemDetails] = useState({});
  const [isVideo, setIsVideo] = useState(false);
  const [openBuy, setOpenBuy] = useState(false);
  const [contentList, setContentList] = useState([]);
  const [isLoadingBunldeView, setIsLoadingItemView] = useState(false);
  const [isLoadingConetent, setIsLoadingContent] = useState(false);
  const [isFilterTrue, setIsFilterTrue] = useState(false);
  const [bunfleId, setItemId] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState('');

  const _onInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const temp = { ...selectedFilter, [name]: value };
    setSelectedFilter(temp);
  };
  const clearFilterHandler = () => {
    setSelectedFilter({
      startDate: "",
      endDate: "",
      searchKey: "",
      type: "",
    });
    getItemContentListHandler(itemDetails?._id);
    setIsFilterTrue(false);
  };
  const getitemDetailsHandler = async (id) => {
    try {
      setIsLoadingItemView(true);
      const res = await axios({
        method: "GET",
        url: Apiconfigs.mynft1 + id,
      });
      if (res.data.statusCode === 200) {
        console.log("responseItemDeatils-----", res.data.result);
        setitemDetails(res.data.result);
        getItemContentListHandler(res.data.result._id);
        setIsLoadingItemView(false);
        const filterFunForCurrentSubscriber =
          res.data.result.subscribers?.filter((value) => {
            return value === auth?.userData?._id;
          });
        console.log("responseFilter---->>>", filterFunForCurrentSubscriber);
        if (filterFunForCurrentSubscriber[0]) {
          setIsSubscribed(true);
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoadingItemView(false);
    }
  };
  const getItemContentListHandler = async (ItemId) => {
    try {
      setContentList([]);
      setIsLoadingContent(true);
      const res = await axios({
        method: "GET",
        url: Apiconfigs.ItemContentList,
        params: {
          nftId: ItemId,
          search: selectedFilter.searchKey ? selectedFilter.searchKey : null,
          fromDate: selectedFilter.startDate ? selectedFilter.startDate : null,
          toDate: selectedFilter.endDate ? selectedFilter.endDate : null,
        },
        headers: {
          token: sessionStorage.getItem("token"),
        },
      });
      if (res.data.statusCode === 200) {
        console.log("response--list---", res.data.result.docs);
        setContentList(res.data.result.docs);
        setIsLoadingContent(false);
        setIsFilterTrue(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingContent(false);
    }
  };
  useEffect(() => {
    const ItemId = location.search.split("?");
    if (ItemId[1]) {
      getitemDetailsHandler(ItemId[1]);
      setItemId(ItemId[1]);
    }
  }, [location]);
  useEffect(() => {
    if (
      selectedFilter.startDate !== "" ||
      selectedFilter.endDate !== "" ||
      selectedFilter.searchKey !== "" ||
      selectedFilter.type !== ""
    ) {
      if (isFilterTrue) {
        getItemContentListHandler(itemDetails?._id);
      }
    }
  }, [selectedFilter, isFilterTrue]);

  useEffect(() => {
    if (itemDetails.mediaUrl) {
      setIsVideo(handleVideo(itemDetails.mediaUrl));
    }
  }, [itemDetails]);
  const subscribeNowHandler = async (isCheck) => {
    // if (parseFloat(auth?.userData?.masBalance) > 0) {
    setIsloading(true);
    await axios({
      method: "GET",
      url: Apiconfigs.subscribeNow + bunfleId,
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        setIsloading(false);
        if (res.data.statusCode === 200) {
          auth.updateUserData();
          toast.success("You have subscribed successfully");
          getitemDetailsHandler(bunfleId);
          // if (callbackFn) {
          //   callbackFn()
          // }
        }
      })
      .catch((err) => {
        setIsloading(false);
        console.log(err.message);
        toast.error(err?.response?.data?.responseMessage);
      });
    // } else {
    //   toast.error('Your wallet balance is insufficient')
    // }

    // } else {
    //   toast.error("Balance is low");
    //   setIsloading(false);
    // }
  };
  const unSubscribeNowHandler = async () => {
    // const coinDetails = getCoinkDetails(data.coinName)
    setIsloading(true);
    await axios({
      method: "DELETE",
      url: Apiconfigs.unSubscription + bunfleId,
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        setIsloading(false);
        if (res.data.statusCode === 200) {
          setIsloading(false);
          auth.updateUserData();
          setIsSubscribed(false);
          toast.success("You have unsubscribed successfully.");
          getitemDetailsHandler(bunfleId);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };
  const handleClickOpen = (imgUrl) => {
    setCurrentImg(imgUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
    <Box className={classes.root}>
      {isLoadingBunldeView ? (
        <Loader />
      ) : (
        <Container maxWidth="lg">
          <Box
            className={classes.bannerimg}
            style={{ background: "url(/images/banner1.png)" }}
          ></Box>
          <Box className={classes.headbox2}>
            <Box style={{ display: "flex", flexWrap: "wrap" }}>
              {isVideo ? (
                <Box>
                  <Box className={classes.profileimg}>
                    <ReactPlayer
                      url={itemDetails?.mediaUrl1}
                      playing
                      controls
                      width={"100%"}
                      height={"100%"}
                    />
                  </Box>
                </Box>
              ) : (
                <Box
                  //style={{ background: `url(${itemDetails?.mediaUrl})` }}
                  className={classes.profileimg}
                >
                  <img
                    src={itemDetails?.mediaUrl1}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Box>
              )}
              <br />
              
              <Box className={`${classes.text1} seats`}>
                <Typography variant="h2">
                  {itemDetails?.itemName ? itemDetails?.itemName : ""}
                </Typography>
                </Box>
                <Box>
                <Typography variant="h5">Details:</Typography>&nbsp;
                <Box className={classes.detailBox}>
                 <Typography variant="h5">
                  {itemDetails?.details ? itemDetails?.details : ''}
                </Typography> 
                </Box>
                <Box mt={1}>
                  <Box
                    display="flex"
                    alignItems="center"
                    className={classes.ItemData}
                  >
                    <Typography variant="h5">Price:</Typography>&nbsp;
                    <Typography variant="h5">
                      {itemDetails?.donationAmount
                        ? itemDetails?.donationAmount
                        : "0"}
                      {itemDetails.coinName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className={classes.btnhead}>
              <Box
                className={classes.btnfollow2}
                onClick={() => setOpenBuy(true)}
              >
                <Typography variant="h2">
                  {itemDetails?.subscribers
                    ? itemDetails?.subscribers?.length
                    : "0"}
                </Typography>
                <Typography variant="h5">buyers</Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      )}
    </Box>

    <Box className={classes.galleryContainer} style={{ display: "flex", flexWrap: "wrap" }}>
  {Array.from({ length: 9 }).map((_, index) => (
    <Box 
      key={index} 
      style={{
        width: "33.33%", 
        padding: "5px", 
        boxSizing: "border-box", 
        border: "5px solid #808080" // Default border color
      }}
      onMouseEnter={e => e.currentTarget.style.border = "5px solid red"} // Change to red on mouse enter
      onMouseLeave={e => e.currentTarget.style.border = "5px solid #808080"} // Revert to default on mouse leave
    >
      <img
        src={itemDetails?.[`mediaUrl${index + 1}`]}
        alt={`Profile Image ${index + 1}`}
        style={{
          width: "100%", 
          height: "auto", 
          display: "block"
        }}
        onClick={() => handleClickOpen(itemDetails?.[`mediaUrl${index + 1}`])}
        onError={(e) => (e.target.src = "defaultImage.png")}
      />
    </Box>
  ))}
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="image-dialog-title"
    aria-describedby="image-dialog-description"
  >
    <IconButton onClick={handleClose} style={{ position: 'absolute', right: '10px', top: '10px' }}>
      <CloseIcon />
    </IconButton>
    <img src={currentImg} alt="Enlarged view" style={{ width: '100%', height: 'auto' }} />
  </Dialog>
</Box>
    </>
  );

  function handleVideo(url) {
    const videoFormats = [
      "mp4",
      "avi",
      "wmv",
      "mov",
      "mkv",
      "flv",
      "webm",
      "mpeg",
      "3gp",
      "ogv",
    ];
    const format = url.split(".").slice(-1)[0];
    return videoFormats.includes(format);
  }
}
