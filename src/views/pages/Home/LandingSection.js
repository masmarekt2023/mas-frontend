import React from "react";
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
} from "@material-ui/core";
import HomeCard from "src/component/HomeCard";
import parse from "html-react-parser";

export default function LandingSection({ item, index }) {
  const classes = useStyles();
  return (
    <Box
      className={classes.mainSection}
      style={{
        backgroundSize: "cover",
        backgroundImage: item?.background
          ? `url(${item?.background})`
          : "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)",
        height: "100%",
        display: item?.status === "ACTIVE" ? 'flex' : 'none'
      }}
    >
      <Container>
        <Grid container spacing={3}>
          <Grid item lg={6} sm={6} md={6} xs={12}>
            {index % 2 === 1 ? SectionImage() : SectionInfo()}
          </Grid>
          <Grid item lg={6} sm={6} md={6} xs={12}>
            {index % 2 === 0 ? SectionImage() : SectionInfo()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  function SectionInfo() {
    return (
      <Box className={classes.rightSection}>
        <Typography variant="h2">{item?.title}</Typography>
        <Typography variant="h4">
          {item?.description && parse(item?.description)}
        </Typography>
        <Box className={classes.cardSection}>
          {item?.contents &&
            item?.contents.map((data, i) => {
              return <HomeCard data={data} key={i} />;
            })}
        </Box>
      </Box>
    );
  }

  function SectionImage() {
    return (
      <Box
        className={classes.leftSection}
        style={{ justifyContent: index % 2 === 1 ? "flex-start" : "flex-end" }}
      >
        <img src={item?.contentFile ? item?.contentFile : ""} alt="" />
      </Box>
    );
  }
}

const useStyles = makeStyles(() => ({
  rightSection: {
    color: "#fafafa",
    padding: "20px 0px",
    "& h2": {
      fontSize: "48px",
      fontWeight: "600",
      letterSpacing: "4px",
      marginBottom: "30px",
      "@media(max-width:767px)": {
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "0px",
        letterSpacing: "3px",
      },
    },
    "& h4": {
      color: "#fff",
      fontSize: "16px",
      fontWeight: "500",
      lineHeight: "28px",
      letterSpacing: "2px",
      "@media(max-width:767px)": {
        fontSize: "10px",
        fontWeight: "300",
        lineHeight: "25px",
        letterSpacing: "2px",
      },
    },
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    width: '100%',
    padding: 10,
    marginRight: 60,
    "& img": {
      width: "100%",
      height: "100%",
      maxWidth: "500px",
      maxHeight: "600px",
      minHeight: "400px",
      borderRadius: "12px",
    },
  },
}));
