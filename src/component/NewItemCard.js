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
import ButtonCircularProgress from "./ButtonCircularProgress";


import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ReactPlayer from "react-player";
import AdditemDialog from "../component/AddItemDialog";
import CloseIcon from '@material-ui/icons/Close';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import bwipjs from 'bwip-js';


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
  const [isBuyed, setisBuyed] = useState(false);
  const [activeBuy, setActiveBuy] = useState(true);
  const [nbBuyed, setnbBuyed] = useState(0);
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
            url: Apiconfigs.order + itemData._id,
            headers: {
              token: sessionStorage.getItem("token"),
            },
          })
            .then(async (res) => {
              setIsloading(false);
              if (res.data.statusCode === 200) {
                setisBuyed(res.data.result.buyed === "yes");
                setnbBuyed(res.data.result.nb);
                setActiveBuy(true);
                setOpen2(false);
                toast.success("Buy Successfully");
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
                toast.success("You have unbuyed successfully.");
                setisBuyed(false);
                setnbBuyed((nb) => nb - 1);
              } else {
                toast.error("Something went wrong");
              }
            })
            .catch((err) => {
              toast.error("Something went wrong");
            });
        };
 const likeDislikeNft1handler = async (id) => {
          if (auth.userData?._id) {
            try {
              const res = await axios.get(Apiconfigs.likeDislikeNft1 + id, {
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
useEffect(() => {
          setnbLike(itemData.likesUsers.length);
          setnbBuyed(itemData.subscribers.length);
          if (auth.userData?._id) {
            setisLike(itemData.likesUsers?.includes(auth.userData._id));
            setisBuyed(itemData.subscribers?.includes(auth.userData._id));
          }
          if (auth.userData._id && itemData._id) {
            //getSubscription().catch(console.error);
          }
        }, []);      

 function BillingDialog({ open, onClose }) {
          const [formData, setFormData] = useState({
              name: '',
              surname: '',
              phoneNumber: '',
              email: '',
              postcode: '',
              address1: '',
              address2: '',
              serialNumber: '',
          });
          const [error, setError] = useState('');
          const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
          const isMounted = useRef(true);
          const [showBillDialog, setShowBillDialog] = useState(false);
          const [showPurchaseDialog, setshowPurchaseDialog] = useState(false);
          const [billPdfUrl, setBillPdfUrl] = useState(null);
      
      
          useEffect(() => {
            // Function to generate the serial number
            const generateSerialNumber = () => {
                const now = new Date();
                return 'SN' + now.getFullYear().toString() + (now.getMonth() + 1).toString().padStart(2, '0') + now.getDate().toString().padStart(2, '0') + now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(3, '0') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            };
        
            if (open) {
                const newSerialNumber = generateSerialNumber();
                setFormData(prevFormData => ({
                    ...prevFormData,
                    serialNumber: newSerialNumber  // Set the new serial number
                }));
            }
        
            // Cleanup function
            return () => {
                isMounted.current = false;
            };
        }, [open]);  // Dependency array includes `open` to trigger the effect when it changes
        
      
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
                if (isMounted.current) {
                    //setShowConfirmationDialog(true);
                    //setShowBillDialog(true);
                    setshowPurchaseDialog(true);
                }
            } catch (error) {
                console.error("Order placement error:", error);
                if (isMounted.current) {
                    if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
                        setError("Failed to place order: your balance is low");
                    } else {
                        setError("Failed to place order: " + error.message);
                    }
                }
            }
        };
      
          const handleBuy = async () => {
            try {
                await handleSubmit();
                await buyNow();
            } catch (error) {
                console.error("Unable to complete purchase:", error.message);
            }
          };
        
        const generatePDF = async (formData, itemData) => {
          const doc = new jsPDF();

          // Get current date and time
          const now = new Date();
          const formattedDate = now.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
          const formattedTime = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
      
          const serialNumber = formData.serialNumber;  // Generate serial number
          console.log("serialNumber:",serialNumber);
      
          // Create an element to render the barcode into (a canvas)
          const canvas = document.createElement("canvas");
          let barcodeDataUrl = null; // Declare outside to widen scope
      
          try {
              bwipjs.toCanvas(canvas, {
                  bcid: 'code128',       // Barcode type
                  text: serialNumber,    // Text to encode
                  scale: 3,              // 3x scaling factor
                  height: 10,            // Bar height, in millimeters
                  includetext: true,     // Include text in the barcode
                  textxalign: 'center',  // Center-align text
              });
      
              barcodeDataUrl = canvas.toDataURL("image/png"); // Convert canvas to data URL
          } catch (error) {
              console.error('Barcode generation failed:', error);
              // Consider handling the failure case, possibly with a fallback or a message
          }
      
          const tableColumn = ["Field", "Value"];
          const tableRows = [];
      
          // Extract data from formData to populate the table
          Object.entries(formData).forEach(([key, value]) => {
              const field = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
              const rowData = [field, value];
              tableRows.push(rowData);
          });
      
          // Additional data from itemData
          tableRows.push(["Price", `${itemData.donationAmount} ${itemData.coinName}`]);
          tableRows.push(["Details", `${itemData.details}`]);
          tableRows.push(["Serial Number", serialNumber]);
          tableRows.push(["Date", formattedDate]);  // Add formatted date
          tableRows.push(["Time", formattedTime]);  // Add formatted time
      
          // Title of the document
          doc.text("Billing Information", 14, 15);
          // Adding the table to the PDF
          autoTable(doc, {
              head: [tableColumn],
              body: tableRows,
              startY: 40,
          });
      
          // If barcode is generated, position it at the top right
          if (barcodeDataUrl) {
            // Assuming the width of your barcode is about 50mm (adjust as necessary)
            const pageWidth = 210;  // A4 width in mm
            const barcodeWidth = 50;  // Width in mm
            const marginRight = 10;  // Right margin in mm
            const marginTop = 10;    // Top margin in mm
            doc.addImage(barcodeDataUrl, 'PNG', pageWidth - marginRight - barcodeWidth, marginTop, barcodeWidth, 20); // Height adjusted to 20mm
        }
        
      // Generate a Blob from the PDF
    const pdfBlob = doc.output("blob");

    try {
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setshowPurchaseDialog(true);
        //setShowBillDialog(true);
        setBillPdfUrl(pdfUrl);
    } catch (error) {
        console.error('Error creating Blob URL:', error);
    }
};
          const downloadPDF = () => {
            console.log("Preparing to display bill...");
            
            generatePDF(formData, itemData);
            
        };
        const handlePreviewBill = async () => {
          setShowBillDialog(true);
          await generatePDF(formData, itemData); // Generate PDF and set URL
      };
        const handleCancel = () => {
          setShowConfirmationDialog(false);  // Close dialog on cancel
          setShowBillDialog(false);
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
                      {["name", "surname", "phoneNumber", "email", "postcode", "address1", "address2","serialNumber"].map((item) => (
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
                      <Typography variant="body1"> your purchase successed.... You can dawnload your bill now.</Typography>
                      <Box textAlign="center" mt={2}>
                          <Button onClick={downloadPDF} color="secondary" variant="contained">Download Bill</Button>
                          <Button onClick={handleCancel} color="primary">Cancel</Button>
                      </Box>
                  </DialogContent>
              </Dialog>
      
              <Dialog open={showPurchaseDialog} onClose={() => {}} aria-labelledby="bill-dialog-title" maxWidth="sm" fullWidth={true}>
            <DialogTitle id="bill-dialog-title">Your Bill Preview</DialogTitle>
            <DialogContent>
            <Typography variant="h6" component="h2" id="successed-dialog-title" gutterBottom>
            Successful Purchase
            </Typography>
            <Typography variant="body1" gutterBottom>
            Your purchase was successful. You can view your bill below:
            </Typography>
            <Box textAlign="center" mt={2}>
            <Button onClick={handlePreviewBill} color="secondary" variant="contained">show your Bill now</Button>
            </Box>
            </DialogContent>
            </Dialog>

            <Dialog 
        open={showBillDialog} 
        onClose={() => {}}
        aria-labelledby="bill-dialog-title" 
        maxWidth="sm" 
        fullWidth={true}
          >
           <DialogContent>
            <iframe src={billPdfUrl} style={{ width: '100%', height: '500px', border: 'none' }} title="Bill Preview"></iframe>
            </DialogContent>
            <br />
            <Box textAlign="center" mt={2}>
                <Button onClick={handleCancel} color="primary">Close</Button>
                </Box>
                <br />
                
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
            isBuyed || isUseritem
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
            (isBuyed && activeBuy) || isUseritem
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
          style={{ color: "#008000", fontWeight: "bold", marginTop: 5 }}
        >
          {"( "}
          {itemData?.donationAmount
            ? itemData?.donationAmount
            : "Any amount"}{" "}
          {" )"}{" "}
          {itemData && itemData.coinName ? itemData.coinName : "MAS"}{" "}
          {/*" for "*/}
          {/*{itemData?.duration ? itemData?.duration : "Ever"}*/}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          component="p"
          style={{ color: "#000", fontWeight: "bold", marginTop: 5 }}
        >
          {/*{itemData?.details}*/}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => likeDislikeNft1handler(itemData._id)}
        >
          <FavoriteIcon
            style={isLike ? { color: red[800] } : { color: red[200] }}
          />
        </IconButton>
        <span>{nbLike}</span>
        {auth.userData &&
          auth.userLoggedIn &&
          auth.userData._id !== userId &&
          isBuyed && (
            <Button
              className={classes.expand}
              disabled={isBuyed && activeBuy}
              onClick={() => (activeBuy ? {} : handleClickOpen2())}
            >
              {activeBuy ? "Buyed" : "Renew"}
            </Button>
          )}
        {auth?.userData?._id !== userId && !isBuyed && (
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
                <span style={{ color: "#707070" }}>Number of buyers:</span>
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
    <Typography variant="h4" align="left" color="#000"  style={{ color: "#008000", fontWeight: "bold", marginTop: 5 }}>
      Price:
      <span>
        {itemData.donationAmount} {itemData.coinName}
      </span>
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={3} lg={2}>
        <Typography variant="h4" align="left" color="#000">
          Details:
        </Typography>
      </Grid>
      <Grid item xs={12} md={9} lg={10}>
        <Typography variant="body2" align="left" color="#000" style={{ color: "#000", fontWeight: "bold", marginTop: 5 }}>
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
      disabled={isLoading}
    >
      {isLoading ? "pending..." : "Buy Now"}
      {isLoading && <ButtonCircularProgress />}
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
