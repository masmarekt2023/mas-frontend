import React, { useEffect, useState } from "react";
import { Box, Typography, makeStyles, Grid } from "@material-ui/core";
import ItemCard from "src/component/NewItemCard";
import UserDetailsCard from "src/component/UserCard";
import axios from "axios";
import Apiconfigs from "../../../Apiconfig/Apiconfigs";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  subscriptionBox: {
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  input_fild: {
    backgroundColor: "#ffffff6e",

    border: " solid 0.5px #e5e3dd",
    color: "#141518",
    height: "48px",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    borderRadius: "20px",
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiInputBase-input": {
      color: "#141518",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent",
      borderWidth: 0,
    },
  },
  LoginBox: {
    paddingTop: "20px",
    marginLeft: "25px",
    marginRight: "15px",
    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
      fontSize: "20px",
      color: "#000",
      "& span": {
        fontWeight: "300",
      },
    },
  },
  TokenBox: {
    border: "solid 0.5px #e5e3dd",
    padding: "5px",
  },
  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
}));

export default function sales() {
  const classes = useStyles();
  const [state, setState] = useState({
    sales: [],
    subsPage: 1,
    subsPages: 1,
    userList: [],
    userPage: 1,
    userPages: 1,
  });
  const { sales, subsPage, subsPages, userList, userPage, userPages } =
    state;
  const updateState = (data) =>
    setState((prevState) => ({ ...prevState, ...data }));

  useEffect(() => {
    getItemSubscriptionListHandler().catch(console.error);
  }, [state.subsPage]);

  useEffect(() => {
    myFollowingHandler().catch(console.error);
  }, [state.userPage]);

  return (
    <div className={classes.subscriptionBox}>
      <Box className={classes.LoginBox} mb={5}>
        <Box className={classes.masBoxFlex}>
          <Typography variant="h6">sales Items</Typography>
        </Box>
        <Box>
          <Grid container>
            {sales.map((data, i) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <ItemCard data={data.nftId} key={i} index={i} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
        {subsPages > 1 && (
          <Box
            mb={2}
            mt={2}
            display="flex"
            justifyContent="center"
            style={{ marginTop: 40 }}
          >
            <Pagination
              count={subsPages}
              page={subsPage}
              onChange={(e, v) => updateState({ subsPage: v })}
            />
          </Box>
        )}
      </Box>
      <Box className={classes.LoginBox} mb={5}>
        <Box className={classes.masBoxFlex}>
          <Typography variant="h6">Users</Typography>
        </Box>
        <Box>
          <Grid container>
            {userList.map((data, i) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <UserDetailsCard data={data} index={i} />
                </Grid>
              );
            })}
          </Grid>
          {userPages > 1 && (
            <Box
              mb={2}
              mt={2}
              display="flex"
              justifyContent="center"
              style={{ marginTop: 40 }}
            >
              <Pagination
                count={userPages}
                page={userPage}
                onChange={(e, v) => updateState({ userPage: v })}
              />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );

  async function getItemSubscriptionListHandler() {
    await axios({
      method: "GET",
      url: Apiconfigs.mysales,
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: {
        limit: 4,
        page: subsPage,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          updateState({
            sales: res.data.result.docs,
            subsPages: res.data.result.pages,
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function myFollowingHandler() {
    await axios({
      method: "GET",
      url: Apiconfigs.profileFollowingList,
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: {
        limit: 4,
        page: userPage,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          updateState({
            userList: res.data.result.docs,
            userPages: res.data.result.pages,
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}
