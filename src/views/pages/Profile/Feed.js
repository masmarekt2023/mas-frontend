import React from "react";
import { Box, Typography, makeStyles, Grid } from "@material-ui/core";

import FeedCard from "src/component/FeedCard";
import FeedCardPrivate from "src/component/FeedCardPrivate";

import NoDataFound from "src/component/NoDataFound";
import { useMediaQuery } from "react-responsive";
import { Carousel } from "react-responsive-carousel";

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

export default function Login({ allFeed, feeds, updateList, privateFeeds }) {
  const classes = useStyles();
  const isMaxScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const isLargeScreen = useMediaQuery({ query: "(min-width: 992px)" });
  const isMediumScreen = useMediaQuery({ query: "(min-width: 768px)" });

  let numItemsToShow = 1;
  if (isMaxScreen) {
    numItemsToShow = 4;
  } else if (isLargeScreen) {
    numItemsToShow = 3;
  } else if (isMediumScreen) {
    numItemsToShow = 2;
  }

  return (
    <Box className={classes.LoginBox} mb={5}>
      <Box className={classes.masBoxFlex}>
        <Typography variant="h6">My feed</Typography>
      </Box>
      <Box>
        {feeds && feeds.length === 0 ? (
          <Box align="center" mt={4} mb={5}>
            <NoDataFound />
          </Box>
        ) : (
          ""
        )}
        <div style={{marginLeft: 10, marginRight: 10}}>
          <Carousel
            centerMode={true}
            centerSlidePercentage={100 / numItemsToShow}
            infiniteLoop={false}
          >
            {feeds?.map((data, i) => (
              <FeedCard updateList={updateList} data={data} index={i} key={i} />
            ))}
          </Carousel>
          {privateFeeds && (
            <Carousel
              centerMode={true}
              centerSlidePercentage={100 / numItemsToShow}
              infiniteLoop={false}
            >
              {privateFeeds?.map((data, i) => (
                <FeedCardPrivate
                  allFeed={allFeed}
                  updateList={updateList}
                  data={data}
                  index={i}
                  key={i}
                />
              ))}
            </Carousel>
          )}
        </div>
      </Box>
    </Box>
  );
}
