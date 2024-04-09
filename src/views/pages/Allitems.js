import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Container,
  Box,
  Typography,
  makeStyles,
} from "@material-ui/core";
import Bundlecard from "src/component/NewBundleCard";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import DataLoading from "src/component/DataLoading";
import NoDataFound from "src/component/NoDataFound";
import {Pagination} from "@material-ui/lab";

const useStyles = makeStyles(() => ({
  pageTitle: {
    height: "24.5px",
    textAlign: "center",
    padding: "20px 0px",
    marginBottom: 20,
    fontFamily: "Poppins",
    fontSize: "21.5px",
    fontWeight: "700",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "1.51",
    letterSpacing: "normal",
    texAlign: "left",
    color: "#141518",
  },
  container: {
    padding: "50px 0px",
  },
  heading: {
    padding: "1.5px 0 0",
    backgroundColor: "var(--white)",
    display: "flex",
    justifyContent: "center",
  },
  search: {
    border: "0.5px solid #e5e3dd",
    display: "flex",
    alignItems: "center",
    borderRadius: "6.5px",
  },
  box: {
    paddingleft: "0",
    flexWrap: "inherit",
  },
  gridbox: {
    "@media(max-width:1280px)": {
      display: "flex",
      justifyContent: "center",
    },
  },
}));

const AllItemsPage = () => {
  const classes = useStyles();
  const auth = useContext(UserContext);
  const [allNFTList, setAllNFTList] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const listAllNft1Handler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.listAllNft1,
      params: {
        page: page,
        limit: 10
      }
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setAllNFTList(res.data.result.docs);
          setPages(res.data.result.pages)
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);

        console.log(err.message);
      });
  };

  useEffect(() => {
    if (auth.userData?._id && auth.userLoggedIn) {
      listAllNft1Handler();
    }
  }, [auth.userLoggedIn, auth.userData, page]);

  return (
    <Box className={classes.container}>
      {isLoading ? (
        <DataLoading />
      ) : (
        <section>
          {auth.userLoggedIn && auth.userData?._id && (
            <>
              <div className={classes.heading}>
                <Typography variant="h2" className={classes.pageTitle}>ALL Items</Typography>
              </div>
              <Container maxWidth="lg">
                {allNFTList.length === 0 ? (
                  <Box align="center" mt={4} mb={5}>
                    <NoDataFound />
                  </Box>
                ) : (
                  ""
                )}
                <Grid container spacing={2}>
                  {allNFTList.map((data, i) => {
                    return (
                      <Grid
                        item
                        key={i}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        className={classes.gridbox}
                      >
                        <Bundlecard
                          data={data}
                          index={i}
                          callbackFn={listAllNft1Handler}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Container>
              <Box mb={2} mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={pages}
                    page={page}
                    onChange={(e, v) => setPage(v)}
                />
              </Box>
            </>
          )}
        </section>
      )}
    </Box>
  );
};

export default AllItemsPage;
