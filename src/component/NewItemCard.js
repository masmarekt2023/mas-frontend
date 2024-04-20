import React, { useState, useContext, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Apiconfigs, { pageURL } from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import "./componentStyle.css";
import {
  Typography,
  Box,
  makeStyles,
  Grid,
  TextField,
  InputAdornment,
  Input,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Button,
} from "@material-ui/core";

import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { toast } from "react-toastify";


import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ReactPlayer from "react-player";
import AdditemDialog from "../component/AddItemDialog";
import CloseIcon from '@material-ui/icons/Close';


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 300,
    maxHeight: 420,
    margin: 10,
    textAlign: "left",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    cursor: "pointer",
  },
  expand: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    padding: "0 10px",
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  avatar: {
    backgroundColor: red[500],
    cursor: "pointer",
  },
}));

export default function ItemCard({ data }) {
  const navigate = useNavigate();
  const classes = useStyles();
  const auth = useContext(UserContext);
  

  const [isLike, setisLike] = useState(false);
  const [nbLike, setnbLike] = useState(0);
  const [openSubscribe, setOpenSubscribe] = useState(false);
  const [isSubscribed, setisSubscribed] = useState(false);
  const [activeSubscribe, setActiveSubscribe] = useState(true);
  const [nbSubscribed, setnbSubscribed] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [isVideo, setisVideo] = useState(false);
  const [openBillingDialog, setOpenBillingDialog] = useState(false); // Manages the billing dialog
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const openMenu = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  let itemData = data;

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClose3 = () => {
    setOpen3(false);
  };

  const handleClickOpen2 = () => {
    setOpenSubscribe(false);
    setOpen2(true);
  };
  let userId =
    typeof itemData.userId === "object" &&
    !Array.isArray(itemData.userId) &&
    itemData.userId !== null
      ? itemData.userId._id
      : itemData.userId;
  const isUseritem = auth.userData._id === userId;
  let userName = itemData.userId.userName || itemData.userDetail.userName;
  let userSpeciality =
    itemData.userId?.speciality || itemData.userDetail?.speciality;
  let profilePic =
    itemData?.userId?.profilePic ||
    itemData?.userDetail?.profilePic ||
    `https://avatars.dicebear.com/api/miniavs/${userName}.svg`;
  
  const groupedImages = [
    [itemData.mediaUrl1, itemData.mediaUrl2, itemData.mediaUrl3],
    [itemData.mediaUrl4, itemData.mediaUrl5, itemData.mediaUrl6],
    [itemData.mediaUrl7, itemData.mediaUrl8, itemData.mediaUrl9],
  ];

  useEffect(() => {
    setnbLike(itemData.likesUsers.length);
    setnbSubscribed(itemData.subscribers.length);
    if (auth.userData?._id) {
      setisLike(itemData.likesUsers?.includes(auth.userData._id));
      setisSubscribed(itemData.subscribers?.includes(auth.userData._id));
    }
    if (auth.userData._id && itemData._id) {
      //getSubscription().catch(console.error);
    }
  }, []);

  /*const getSubscription = async () => {
          try {
            const data = await axios({
              method: "GET",
              url: `${Apiconfigs.getSubscription}/${auth.userData._id}/${BundleData._id}`,
              headers: {
                token: sessionStorage.getItem("token"),
              },
            });
            if (data.status === 200) {
              setActiveSubscribe(data.data.result.subscriptionStatus === "ACTIVE");
            }
          } catch (err) {
            console.log(err.message);
          }
        };*/

        const subscribeToBundleHandler = async () => {
          setIsloading(true);
          await axios({
            method: "GET",
            url: Apiconfigs.subscribeNow + itemData._id,
            headers: {
              token: sessionStorage.getItem("token"),
            },
          })
            .then(async (res) => {
              setIsloading(false);
              if (res.data.statusCode === 200) {
                setisSubscribed(res.data.result.subscribed === "yes");
                setnbSubscribed(res.data.result.nb);
                setActiveSubscribe(true);
                setOpen2(false);
                toast.success("Subscribe Successfully");
                navigate("/items-details?" + itemData?._id);
              } else {
                toast.error(res.data.responseMessage);
              }
            })
            .catch((err) => {
              setIsloading(false);
              console.log(err.message);
              toast.error(err?.response?.data?.responseMessage);
            });
        };
        const unSubscribeToBundleHandler = async () => {
          setIsloading(true);
          await axios({
            method: "DELETE",
            url: Apiconfigs.unSubscription + itemData?._id,
            headers: {
              token: sessionStorage.getItem("token"),
            },
          })
            .then(async (res) => {
              setIsloading(false);
              if (res.data.statusCode === 200) {
                setIsloading(false);
                toast.success("You have unsubscribed successfully.");
                setisSubscribed(false);
                setnbSubscribed((nb) => nb - 1);
              } else {
                toast.error("Something went wrong");
              }
            })
            .catch((err) => {
              toast.error("Something went wrong");
            });
        };
        const likeDislikeNfthandler = async (id) => {
          if (auth.userData?._id) {
            try {
              const res = await axios.get(Apiconfigs.likeDislikeNft + id, {
                headers: {
                  token: sessionStorage.getItem("token"),
                },
              });
              if (res.data.statusCode === 200) {
                setisLike((liked) => !liked);
                setnbLike((nb) => (isLike ? nb - 1 : nb + 1));
              } else {
                setisLike(false);
                toast.error(res.data.responseMessage);
              }
            } catch (error) {
              console.log("ERROR", error);
            }
          } else {
            toast.error("Please login");
          }
        };

  function BillingDialog({ open, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phoneNumber: '',
        email: '',
        postcode: '',
        address1: '',
        address2: '',
    });
    const [error, setError] = useState('');
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
      // This function runs when the component mounts and sets up the isMounted ref
      return () => {
          isMounted.current = false; // Set isMounted to false on cleanup
      };
  }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            console.log("data:", formData);
            const res = await axios({
                method: "PUT",
                url: Apiconfigs.bill,
                data: formData,
                headers: {
                    token: sessionStorage.getItem("token") || "default-token",
                },
            });

            console.log("Response from server:", res.data);
            if (res.status !== 200) {
                throw new Error('Form submission failed with status: ' + res.status);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            if (isMounted.current) {
                setError("Failed to submit form: " + error.message);
            }
        }
    };

    const buyNow = async () => {
        try {
            console.log("Initiating purchase:");
            console.log("Data needed:", itemData.details, itemData.coinName, itemData.donationAmount,userName);
            console.log("sellerId", userId);
            console.log("ItemId", itemData._id);
            console.log("buyerId",auth.userData._id );
            const response = await axios({
                method: "PUT",
                url: Apiconfigs.order ,
                data: {
                    //sellerId:userId, 
                    userBuyer:auth.userData._id,
                    nft1Id: itemData._id,
                    //mediaUrl: itemData.mediaUrl1,
                    //details: itemData.details,
                    //tokenName: itemData.coinName,
                    //Price: itemData.donationAmount,
                    
                },
                headers: {
                  token: sessionStorage.getItem("token"),
                },
            });

            console.log("Order response:", response.data);
            if (response.status !== 200) {

                throw new Error('Order placement failed with status: ' + response.status);
            }
        } catch (error) {
            console.error("Order placement error:", error);
            if (isMounted.current) {
                setError("Failed to place order: " + error.message);
            }
        }
    };

    const handleBuy = async () => {
      try {
          await handleSubmit();
          await buyNow();
          if (isMounted.current) {
              setShowConfirmationDialog(true);
          }
      } catch (error) {
          console.error("Unable to complete purchase:", error.message);
      }
    };
    const downloadPDF = () => {
    console.log("Downloading PDF...");
    const pdfUrl = "your-pdf-download-url"; // Ensure this URL is correct
    window.open(pdfUrl, '_blank'); // Opens the PDF in a new tab/window
    handleCancel();
    };
  const handleCancel = () => {
    setShowConfirmationDialog(false);  // Close dialog on cancel
    onClose();  // Also close the main dialog
    setOpen2(false);
    };
  
  
    return (
      <>
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="billing-dialog-title"
            maxWidth="sm"
            fullWidth={true}
        >
            <DialogTitle id="billing-dialog-title">Billing Information</DialogTitle>
            <DialogContent>
                <Typography variant="body1">Please enter your billing information below:</Typography>
                {error && <Typography color="error">{error}</Typography>}  
                {["name", "surname", "phoneNumber", "email", "postcode", "address1", "address2"].map((item) => (
                    <TextField
                        key={item}
                        margin="dense"
                        label={item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                        type="text"
                        fullWidth
                        name={item}
                        value={formData[item]}
                        onChange={handleChange}
                    />
                ))}
            </DialogContent>
            <br />
            <Box textAlign="center" width="100%">
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleBuy} color="secondary" variant="contained">Buy Now</Button>
            </Box>
            <br />
        </Dialog>
        
        <Dialog open={showConfirmationDialog} onClose={() => {}} aria-labelledby="successed-dialog-title" maxWidth="sm" fullWidth={true}>
            <DialogTitle id="successed-dialog-title">successed Purchase</DialogTitle>
            <DialogContent>
                <Typography variant="body1"> your purchase successed.... You can download your bill now.</Typography>
                <Box textAlign="center" mt={2}>
                    <Button onClick={downloadPDF} color="secondary" variant="contained">Download Bill</Button>
                    <Button onClick={handleCancel} color="primary">Cancel</Button>
                </Box>
            </DialogContent>
        </Dialog>
        </>
    );
}

  const handleOpenImageDialog = (url) => {
    setSelectedImageUrl(url);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  const handleCloseParentDialog = () => {
    setOpen2(false); // This assumes `setOpen2` is the state setter for controlling the visibility of the parent dialog
  };
  
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="user"
            alt={userName}
            src={profilePic}
            className={classes.avatar}
            onClick={() => {
              navigate("/user-profile/" + userName);
            }}
          />
        }
        action={
          <IconButton
            aria-label="more"
            onClick={handleClick}
            aria-haspopup="true"
            aria-controls="long-menu"
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={<p style={{ fontWeight: "bold", margin: 0 }}>{userName}</p>}
        subheader={
          <p style={{ margin: 0, color: "black" }}>{userSpeciality}</p>
        }
      />
      {isVideo ? (
        <div
          style={{ cursor: "pointer", background: '#000'}}
          onClick={() =>
            isSubscribed || isUseritem
              ? navigate("/items-details?" + itemData?._id)
              : handleClickOpen2()
          }
        >
          <ReactPlayer
            url={itemData.mediaUrl1}
            muted
            playing
            width="100%"
            height={"166px"}
          />
        </div>
      ) : (
        <CardMedia
          className={classes.media}
          image={itemData.mediaUrl1}
          title={itemData.itemName}
          onClick={() =>
            (isSubscribed && activeSubscribe) || isUseritem
              ? navigate("/items-details?" + itemData?._id)
              : handleClickOpen2()
          }
        />
      )}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        onClose={handleCloseMenu}
        open={openMenu}
      >
        {isUseritem && (
          <MenuItem
            key={"Edit"}
            onClick={() => {
              setAnchorEl(false);
              setOpenEdit(true);
            }}
            style={{ fontSize: 14 }}
          >
            {"Edit"}
          </MenuItem>
        )}
        <MenuItem
          key={"Copy"}
          onClick={() => {
            navigator.clipboard.writeText(
              `${pageURL}/items-details?${itemData?._id}`
            );
            setAnchorEl(false);
          }}
          style={{ fontSize: 12 }}
        >
          {"Copy"}
        </MenuItem>
      </Menu>
      <CardContent>
        <Typography
          variant="h5"
          component="h5"
          style={{ color: "#000", fontWeight: "bold" }}
        >
          {itemData.itemName}
        </Typography>
        <Typography
          variant="h5"
          component="h5"
          style={{ color: "#000", fontWeight: "bold", marginTop: 5 }}
        >
          {"( "}
          {itemData?.donationAmount
            ? itemData?.donationAmount
            : "Any amount"}{" "}
          {" )"}{" "}
          {itemData && itemData.coinName ? itemData.coinName : "MAS"}{" "}
          {" for "}
          {itemData?.duration ? itemData?.duration : "Ever"}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          style={{ marginTop: 5 }}
        >
          {itemData?.details}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => likeDislikeNfthandler(itemData._id)}
        >
          <FavoriteIcon
            style={isLike ? { color: red[800] } : { color: red[200] }}
          />
        </IconButton>
        <span>{nbLike}</span>
        {auth.userData &&
          auth.userLoggedIn &&
          auth.userData._id !== userId &&
          isSubscribed && (
            <Button
              className={classes.expand}
              disabled={isSubscribed && activeSubscribe}
              onClick={() => (activeSubscribe ? {} : handleClickOpen2())}
            >
              {activeSubscribe ? "Buyed" : "Renew"}
            </Button>
          )}
        {auth?.userData?._id !== userId && !isSubscribed && (
          <Button className={classes.expand} onClick={handleClickOpen2}>
            Details
          </Button>
        )}
        {auth.userData && auth.userLoggedIn && auth.userData._id === userId && (
          <Button
            className={classes.expand}
            onClick={() => navigate("/items-details?" + itemData?._id)}
          >
            View
          </Button>
        )}
      </CardActions>

      {/* edit */}
      <Dialog
        open={open}
        fullWidth="sm"
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              variant="h4"
              align="center"
              style={{ color: "#792034", margiBottom: "10px" }}
            >
              {itemData.itemTitle}
            </Typography>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <label> Donation Amount</label>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    id="standard-basic"
                    placeholder="30"
                    className={classes.input_fild2}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box
              style={{
                paddingBotton: "10px",
                borderBottom: "solid 0.5px #e5e3dd",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <label> Duration</label>
                </Grid>
                <Grid item xs={12} md={8} className={classes.donation}>
                  <span>7 Days</span>
                  <span>14 Days</span>
                  <span>30 Days</span>
                  <span>60 Days</span>
                  <span>1 Year</span>
                  <span>Forever</span>
                </Grid>
              </Grid>
            </Box>

            <Box align="center">
              <label> Services:</label>
              <Typography
                variant="body2"
                componant="p"
                style={{ color: "#000", fontSize: "20px" }}
              >
                I will send you a special video every <br />
                month specially for you! (edit)
              </Typography>
            </Box>
            <Box mt={2} className={classes.changepic}>
              <small>
                Change/upload a photo or video
                <input type="file" />
              </small>
              <img src="/images/Rectangle.png" alt="" />
            </Box>
            <Box mt={4}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item md={4}>
                  <Link style={{ color: "#000" }} onClick={handleClose}>
                    Delete this item
                  </Link>
                </Grid>
                <Grid item md={4}>
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item md={4}>
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={handleClose}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {/* view */}
      <Dialog
        open={open1}
        fullWidth="sm"
        maxWidth="sm"
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography
              variant="h4"
              align="center"
              style={{ color: "#792034", margiBottom: "10px" }}
            >
              item I
            </Typography>
            <Typography
              variant="h6"
              align="center"
              style={{ color: "#000", borderBottom: "solid 0.5px #e5e3dd" }}
            >
              My basic supporter
            </Typography>

            <Box align="center" mt={3}>
              <Typography
                variant="h6"
                component="h6"
                style={{ color: "#000", fontWeight: "400" }}
              >
                <span style={{ color: "#707070" }}>Donation amount: </span>10
                MAS
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                style={{ color: "#000", fontWeight: "400" }}
              >
                <span style={{ color: "#707070" }}>Duration: </span>One month
              </Typography>
              <Typography
                variant="h6"
                component="h6"
                style={{ color: "#000", fontWeight: "400" }}
              >
                <span style={{ color: "#707070" }}>Number of subscribers:</span>
                100
              </Typography>
            </Box>

            <Box align="center">
              <label> Services:</label>
              <Typography
                variant="body2"
                componant="p"
                style={{ color: "#000", fontSize: "20px" }}
              >
                I will send you a special video every <br />
                month specially for you!
              </Typography>
            </Box>
            <Box mt={2} className={classes.changepic}>
              <img src="/images/Rectangle.png" alt="" />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {/* buy now */}
      <Dialog
        fullWidth="sm"
        maxWidth="sm"
        open={open2}
        onClose={handleClose2}
        aria-labelledby="max-width-dialog-title"
        disableBackdropClick={isLoading}
        disableEscapeKeyDown={isLoading}
      >
        <DialogContent>
  {groupedImages.map((group, index) => (
    <Box key={index} className={classes.PhotoBox}>
      <Grid container spacing={2}>
        {group.map((url, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <img
              src={url}
              alt={`Media ${index * 3 + idx + 1}`}
              style={{ width: "100%", height: "150px" }}  // Adjust the size as needed
              onClick={() => handleOpenImageDialog(url)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  ))}

  <Box mt={3} className={classes.itemText} textAlign="center">
    <Typography variant="h4">{itemData.itemTitle}</Typography>
  </Box>
  <Box mt={2} className={classes.deskiText}>
    <Typography variant="h4" align="left" color="textSecondary">
      Price:
      <span>
        {itemData.donationAmount} {itemData.coinName}
      </span>
    </Typography>
    <Typography variant="h4" align="left" color="textSecondary">
      Duration: <span>{itemData.duration}</span>
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={3} lg={2}>
        <Typography variant="h4" align="left" color="textSecondary">
          Details:
        </Typography>
      </Grid>
      <Grid item xs={12} md={9} lg={10}>
        <Typography variant="body2" align="left" color="textSecondary">
          {itemData.details}
        </Typography>
      </Grid>
    </Grid>
  </Box>
   {/* Buy Now and Cancel Buttons */}
   <Box mt={3} mb={3} textAlign="center">
    <Button className={classes.LoginButton} onClick={handleClose2}>
      Cancel
    </Button>
    &nbsp;&nbsp;
    <Button
      className={classes.BuyButton}
      onClick={() => setOpenBillingDialog(true)}
      color="secondary"  // This gives the button a distinctive color, usually the primary theme color
      variant="contained"  // This makes the button have a filled style
    >
      Buy Now
    </Button>
  </Box>
  <BillingDialog
  open={openBillingDialog}
  onClose={() => setOpenBillingDialog(false)}
  onSuccessfulPurchase={handleCloseParentDialog} 
/>

  

  {/* Login and Subscribe Buttons */}
  {!auth.userLoggedIn && (
    <Box mt={3} mb={3} textAlign="center">
      <Button className={classes.LoginButton} onClick={handleClose2}>
        Cancel
      </Button>
      &nbsp;&nbsp;
      <Button
        className={classes.LoginButton}
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </Button>
    </Box>
  )}
</DialogContent>
      {/* New Image Dialog */}
      <Dialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        aria-labelledby="image-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <IconButton
          onClick={handleCloseImageDialog}
          style={{ position: 'absolute', right: '10px', top: '10px' }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <img src={selectedImageUrl} alt="Selected" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>

      </Dialog>

      <Dialog
        open={open3}
        fullWidth="sm"
        maxWidth="sm"
        onClose={handleClose3}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className={classes.dilogBody}>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="h4" align="center" style={{ color: "#000" }}>
              Enter an amount
            </Typography>
            <Box mt={4}>
              <Input
                placeholder="300"
                className={classes.input_fild2}
                endAdornment={
                  <InputAdornment position="end">Select a token</InputAdornment>
                }
              />
            </Box>

            <Box mt={4}>
              <Typography variant="h4" align="center" style={{ color: "#000" }}>
                Send a message
              </Typography>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                className={classes.input_fild}
                defaultValue="Default Value"
                variant="outlined"
              />
            </Box>
            <Box mt={2} mb={4}>
              <Button variant="contained" size="large" color="secondary">
                Donate now
              </Button>
            </Box>
            <small>ETH fees and ETH fees and apply. apply.</small>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <AdditemDialog
        handleClose={() => setOpenEdit(false)}
        show={openEdit}
        itemData={data}
      />
    </Card>
  );
}
