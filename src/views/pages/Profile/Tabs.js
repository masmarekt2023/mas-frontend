import React, { useState, useEffect, useContext } from "react";
import { Box, Container, makeStyles, Button } from "@material-ui/core";
import { UserContext } from "src/context/User";
import Page from "src/component/Page";
import Auction from "./Auction";
import Bundles from "./Bundles";
import Subscriptions from "./Subscriptions";
import Feed from "./Feed";
import MyBids from "./MyBids";
import UserDetails from "./UserDetails";
import SoldBuyList from "./SoldBuyList";
import DonationsList from "./DonateList";
import TransactionHistory from "./TransactionsList";
import { isMobile } from "react-device-detect";

const useStyles = makeStyles(() => ({
  Padding_Top: {
    paddingTop: isMobile ? "15px" : "30px",
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  PageHeading: {
    fontWeight: "500",
    fontSize: "32px",
    lineHeight: "39px",
    color: "#000",
    paddingBottom: "10px",
  },
  active: {
    borderBottom: "2px solid #792034",
    borderRadius: "15px",
    color: "#FFF",
    background: "linear-gradient(180deg, #480048 0%, #c04848 100%)",
  },
}));

export default function Activity() {
  const auth = useContext(UserContext);
  const classes = useStyles();
  const [tabview, setTabView] = useState("bundles");

  useEffect(() => {
    if (auth?.userData?.userType !== "User") {
      setTabView("bundles");
    } else {
      setTabView("subscriptions");
    }
  }, [auth.userData]);

  return (
    <Page title="">
      <Box className={classes.Padding_Top}>
        <Container maxWidth="xl">
          <Box>
            {auth?.userData?.userType !== "User" && (
              <Button
                className={tabview === "bundles" ? classes.active : " "}
                onClick={() => setTabView("bundles")}
              >
                My Bundles
              </Button>
            )}
            <Button
              className={tabview === "subscriptions" ? classes.active : " "}
              onClick={() => setTabView("subscriptions")}
            >
              My subscriptions
            </Button>
            <Button
              className={tabview === "feed" ? classes.active : " "}
              onClick={() => setTabView("feed")}
            >
              My feed
            </Button>
            {auth?.userData?.userType !== "User" && (
              <Button
                className={tabview === "auctions" ? classes.active : " "}
                onClick={() => setTabView("auctions")}
              >
                My auctions
              </Button>
            )}
            <Button
              className={tabview === "bids" ? classes.active : " "}
              onClick={() => setTabView("bids")}
            >
              My Bids
            </Button>
            {auth?.userData?.userType !== "User" && (
              <Button
                className={tabview === "subscribe" ? classes.active : " "}
                onClick={() => setTabView("subscribe")}
              >
                Subscribers
              </Button>
            )}

            {auth?.userData?.userType !== "User" && (
              <Button
                className={tabview === "donor" ? classes.active : " "}
                onClick={() => setTabView("donor")}
              >
                Supporter List
              </Button>
            )}
            {auth?.userData?.userType !== "User" && (
              <Button
                className={tabview === "soldAuctions" ? classes.active : " "}
                onClick={() => setTabView("soldAuctions")}
              >
                Sold Auctions NFT
              </Button>
            )}
            <Button
              className={tabview === "BoughtAuctions" ? classes.active : " "}
              onClick={() => setTabView("BoughtAuctions")}
            >
              Bought Auctions NFT
            </Button>
            <Button
              className={tabview === "DonateList" ? classes.active : " "}
              onClick={() => setTabView("DonateList")}
            >
              Donate Transaction
            </Button>
            <Button
              className={
                tabview === "TransactionHistory" ? classes.active : " "
              }
              onClick={() => setTabView("TransactionHistory")}
            >
              Transaction History
            </Button>
          </Box>
          <Box>
            {tabview === "bundles" && <Bundles />}
            {tabview === "subscriptions" && <Subscriptions />}
            {tabview === "subscribe" && <UserDetails type="subscribers" />}
            {tabview === "feed" && <Feed />}
            {tabview === "auctions" && <Auction />}
            {tabview === "BoughtAuctions" && <SoldBuyList type="bought" />}
            {tabview === "soldAuctions" && <SoldBuyList type="sold" />}
            {tabview === "bids" && <MyBids />}
            {tabview === "donor" && <UserDetails type="donor" />}
            {tabview === "DonateList" && <DonationsList />}
            {tabview === "TransactionHistory" && <TransactionHistory />}
          </Box>
        </Container>
      </Box>
    </Page>
  );
}
