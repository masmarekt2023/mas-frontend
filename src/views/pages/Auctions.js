import React from "react";
import {
  Container,
  makeStyles,
  Grid, Typography,
} from "@material-ui/core";
import NftCard from "./NftCard";
import IMG1 from "./img/card 1.jpeg"
import IMG2 from "./img/card2.jpeg"
import IMG3 from "./img/card3.jpeg"
import IMG5 from "./img/card5.jpeg"
import IMG6 from "./img/card6.jpeg"

const AuctionPage = () => {
  const useStyles = makeStyles((theme) => ({
    main: {
      backgroundColor: '#D9AFD9',
      backgroundImage: 'linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)',
      padding: "10px 10px 15px 10px",
      borderRadius: "10px",
      width: "300px",
      height: "50vh",
      margin: "12px",
      overflow: "hiiden",

    },
    imgParent: {
      width: "100%",
      height: "77%!important",
      cursor: "pointer",
      overflow: "hiiden",
      "&:hover": {
        "& img": {
          transform: "scale(1.03 ,1.03 )"
        },
      },
      "& img": {
        transition: ".2s all linear",
        borderTopRightRadius: "10px",
        borderTopLeftRadius: "10px",
        overflow: "hiiden",
        width: "100%",
        height: "100%",


      },
    },
    nameSpec: {
      width: "100%",
      padding: "15px",
      background: "#eee",
      "& div": {
        width: "100%",
        textAlign: "center",
        fontSize: "16px",
      },
    },
    gridbox: {
      "@media(max-width:1280px)": {
        display: "flex",
        justifyContent: "center",
      },
    },
    heading: {
      padding: "1.5px 0 0",
      backgroundColor: "var(--white)",
      display: "flex",
      justifyContent: "center",
    },
    title: {
      fontSize: "30px",
      fontWeight: "600",
      marginBottom: "10px",
      textAlign: "center",
      borderBottom: "solid 1px #e5e3dd",
      paddingBottom: "10px",
      color: "#141518",
      [theme.breakpoints.down("sm")]: {
        fontSize: "20px",
      },
    },
  }))
  const classes = useStyles();
  var dataArray = [IMG1, IMG2, IMG3, IMG5, IMG6];

  return (
    <Container maxWidth='100%' style={{ padding: '0px' }} >
      <Typography variant="h3" className={classes.title}>
        {"NFT"}
      </Typography>
      <Grid container spacing={2}>
      {dataArray.length > 0 ?
          dataArray.map((data, i) => {
            return <Grid
                item
                key={i}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className={classes.gridbox}
            >
              <NftCard
                  data={data}
                  key={i}
              />
            </Grid>
          })
          : <div> no Item</div>
      }
      </Grid>
    </Container>
  );
};

export default AuctionPage;
