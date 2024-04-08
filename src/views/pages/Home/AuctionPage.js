import React, { useState, useEffect } from "react";
import { Container, Box, Typography, makeStyles } from "@material-ui/core";
import UserDetailsCard from "src/component/UserCard";
import BundleCard from "src/component/NewBundleCard";
import { Carousel } from "react-responsive-carousel";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { useNavigate } from "react-router";
import "./style.css";

const AuctionPage = ({ staticSections }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [auctionList, setAuctionList] = useState([]);
  const [allNFTList, setAllNFTList] = useState([]);
  const [userListToDisplay, setUserListToDisplay] = useState([]);
  const [isLoadingAuctions, setIsLaodingAuctions] = useState(false);

  useEffect(() => {
    auctionNftListHandler().catch(console.error);
    listAllNftHandler().catch(console.error);
    getuser().catch(console.error);
    let resize = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);
    return () => clearTimeout(resize);
  }, []);

  // Start My Code "Here I have started writing the code"
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(getWindowSize());
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // End My Code

  return (
    <>
      {CreatorsSection()}
      {BundlesSection()}
      {ItemsSection()}
      {NFTSection()}
    </>
  );

  function NFTSection() {
    const item = staticSections.find((i) => i?.title === "NFT");
    return (
      <Container
        maxWidth="100%"
        style={{
          backgroundSize: "cover",
          backgroundImage: item?.background
            ? `url(${item?.background})`
            : "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
          height: "100%",
          display: item?.status === "ACTIVE" ? "block" : "none",
        }}
      >
        <div id="auctions_section" className={classes.sectionHeading}>
          <Typography
            variant="h2"
            component="h2"
            onClick={() => navigate("/auctions")}
            style={{
              cursor: "pointer",
              margin: "20px auto",
              fontSize: "66px",
              color: "#fff",
            }}
          >
            NFT Auction
          </Typography>
        </div>
        {!isLoadingAuctions && auctionList.length === 0 ? (
          <Box
            align="center"
            style={{
              margin: "0px",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              minHeight: "300px",
              mixBlendMode: "darken",
              backgroundImage: "url(/images/home/nft-comingsoon-bg.png)",
              backgroundSize: "cover",
              backgroundPosition: "50% 50%",
            }}
            mt={4}
            mb={5}
          >
            <Typography
              variant="h1"
              style={{
                color: "#fffa",
                textAlign: "center",
                fontSize: "10vw",
                textShadow: "rgb(81 13 29) 1px 1px 4px",
              }}
            >
              COMING SOON
            </Typography>
          </Box>
        ) : (
          ""
        )}
      </Container>
    );
  }

  function BundlesSection() {
    const item = staticSections.find((i) => i?.title === "Bundles");
    return (
      <Container
        maxWidth="100%"
        style={{
          marginBottom: "-20px",
          backgroundSize: "cover",
          backgroundImage: item?.background
            ? `url(${item?.background})`
            : "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
          height: "100%",
          display: item?.status === "ACTIVE" ? "block" : "none",
        }}
      >
        <div id="bundle_section" className={classes.sectionHeading}>
          <Typography
            variant="h2"
            component="h2"
            onClick={() => navigate("/bundles")}
            style={{
              cursor: "pointer",
              margin: "20px auto",
              fontSize: "66px",
              color: "#fff",
            }}
          >
            Bundles
          </Typography>
        </div>
        <Carousel
          infiniteLoop={false}
          centerMode={true}
          centerSlidePercentage={35000 / windowSize.innerWidth}
          numItemsPerView={5}
        >
          {allNFTList &&
            allNFTList.map((data, i) => {
              return <BundleCard data={data} key={i} />;
            })}
        </Carousel>
      </Container>
    );
  }
  function ItemsSection() {
    const item = staticSections.find((i) => i?.title === "Bundles");
    return (
      <Container
        maxWidth="100%"
        style={{
          marginBottom: "-20px",
          backgroundSize: "cover",
          backgroundImage: item?.background
            ? `url(${item?.background})`
            : "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
          height: "100%",
          display: item?.status === "ACTIVE" ? "block" : "none",
        }}
      >
        <div id="bundle_section" className={classes.sectionHeading}>
          <Typography
            variant="h2"
            component="h2"
            onClick={() => navigate("/bundles")}
            style={{
              cursor: "pointer",
              margin: "20px auto",
              fontSize: "66px",
              color: "#fff",
            }}
          >
            Marketplace
          </Typography>
        </div>
        <Carousel
          infiniteLoop={false}
          centerMode={true}
          centerSlidePercentage={35000 / windowSize.innerWidth}
          numItemsPerView={5}
        >
          {allNFTList &&
            allNFTList.map((data, i) => {
              return <BundleCard data={data} key={i} />;
            })}
        </Carousel>
      </Container>
    );
  }

  function CreatorsSection() {
    const item = staticSections.find((i) => i?.title === "Users");
    return (
      <Container
        maxWidth="100%"
        style={{
          marginBottom: "-20px",
          backgroundSize: "cover",
          backgroundImage: item?.background
            ? `url(${item?.background})`
            : "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
          height: "100%",
          display: item?.status === "ACTIVE" ? "block" : "none",
        }}
      >
        <div id="creators_section" className={classes.sectionHeading}>
          <Typography
            variant="h2"
            component="h2"
            onClick={() => navigate("/creators")}
            style={{
              cursor: "pointer",
              margin: "20px auto",
              fontSize: "66px",
              color: "#fff",
            }}
          >
            Creators
          </Typography>
        </div>
        <Carousel
          infiniteLoop={false}
          centerMode={true}
          centerSlidePercentage={30000 / windowSize.innerWidth}
          numItemsPerView={5}
        >
          {userListToDisplay.map((data, i) => {
            return <UserDetailsCard key={i} data={data} />;
          })}
        </Carousel>
      </Container>
    );
  }

  async function auctionNftListHandler() {
    setIsLaodingAuctions(true);
    await axios({
      method: "GET",
      url: Apiconfigs.allorder,
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          if (res.data.result) {
            setAuctionList(res.data.result);
            setIsLaodingAuctions(false);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
        setIsLaodingAuctions(false);
      });
  }

  async function listAllNftHandler() {
    await axios({
      method: "GET",
      url: Apiconfigs.listAllNft,
      params: {
        page: 1,
        limit: 10,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setAllNFTList(res.data.result.docs);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function getuser() {
    axios({
      method: "GET",
      url: Apiconfigs.latestUserList,
      params: {
        limit: 10,
        userType: "Creator",
      },
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          if (res.data.result.docs) {
            setUserListToDisplay(res.data.result.docs);
          }
        }
      })
      .catch(() => {});
  }
};

export default AuctionPage;

const useStyles = makeStyles(() => ({
  mas: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: "32px",
    fontWeight: "700",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.51",
    letterSpacing: "normal",
    texAlign: "left",
    color: "#141518",
    marginTop: "0px",
  },
  LoginBox: {},
  sectionHeading: {
    display: "flex",
    justifyContent: "center",
  },
  search: {
    border: "0px solid #e5e3dd",
    display: "flex",
    alignItems: "center",
    borderRadius: "0px",
  },
  box: {
    flexWrap: "inherit",
  },
  gridbox: {
    "@media(max-width:1280px)": {
      display: "flex",
      justifyContent: "center",
    },
  },
}));
