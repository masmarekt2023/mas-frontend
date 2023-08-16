import React, { useEffect, useState } from "react";
import { Box, Typography, makeStyles, Grid } from "@material-ui/core";

import FeedCard from "src/component/FeedCard";

import NoDataFound from "src/component/NoDataFound";
import axios from "axios";
import Apiconfigs from "../../../Apiconfig/Apiconfigs";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  LoginBox: {
    paddingTop: "20px",
    "& h6": {
      fontWeight: "bold",
      marginBottom: "10px",
      fontSize: "20px",
      color: "#1b1a1a",
      "& span": {
        fontWeight: "300",
      },
    },
  },

  masBoxFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
}));

export default function Login() {
  const [state, setState] = useState({
    allFeed: [],
    page: 1,
    pages: 1,
  });
  const { allFeed, page, pages } = state;
  const updateState = (data) =>
    setState((prevState) => ({ ...prevState, ...data }));

  const privateFeeds = allFeed.filter((i) => i.postType === "PRIVATE");

  const classes = useStyles();

  useEffect(() => {
    getFeedListHandler().catch(console.error);
  }, [state.page]);

  return (
    <Box className={classes.LoginBox} mb={5}>
      <Box className={classes.masBoxFlex}>
        <Typography variant="h6">My feed</Typography>
      </Box>
      <Box>
        {allFeed && allFeed.length === 0 ? (
          <Box align="center" mt={4} mb={5}>
            <NoDataFound />
          </Box>
        ) : (
          ""
        )}
        <Grid container>
          {allFeed?.map((data, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <FeedCard
                  updateList={getFeedListHandler}
                  data={data}
                  index={i}
                  key={i}
                />
              </Grid>
            );
          })}
        </Grid>
        {pages > 1 && (
          <Box
            mb={2}
            mt={2}
            display="flex"
            justifyContent="center"
            style={{ marginTop: 40 }}
          >
            <Pagination
              count={pages}
              page={page}
              onChange={(e, v) => updateState({ page: v })}
            />
          </Box>
        )}
      </Box>
    </Box>
  );

  async function getFeedListHandler() {
    await axios({
      method: "GET",
      url: Apiconfigs.getMyfeed,
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          updateState({ allFeed: res.data.result.docs });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}
