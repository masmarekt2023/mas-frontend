import React, {useState, useEffect} from "react";
import {
    Container, Grid,
    makeStyles,
    Typography,
} from "@material-ui/core";
import {useLocation, useParams} from "react-router";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import axios from "axios";
import MetaverseCard from "./MetaverseCard";
import IMG1 from "./img/card 1.jpeg"
import IMG2 from "./img/card2.jpeg"
import IMG3 from "./img/card3.jpeg"
import IMG5 from "./img/card5.jpeg"
import IMG6 from "./img/card6.jpeg"

const useStyles = makeStyles((theme) => ({

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
}));


export default function StaticPage() {
    var dataArray = [IMG1, IMG2, IMG3, IMG5, IMG6];

    const classes = useStyles();
    const location = useLocation();
    const {pageName} = useParams();
    let data = location.state?.data;
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [datas, setdatas] = useState();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        if (!data) {
            const fetcher = async (url) => axios.get(url).then(res => {
                setTitle(res.data.result.title);
                setContent(res.data.result.description);
            });
            fetcher(Apiconfigs.viewStaticPage + `?type=${pageName}`)
        } else {
            setTitle(data.title);
            setContent(data.html);
        }
    }, [data])


    return (title && content) ? (
        <Container maxWidth="lg">
            <Typography variant="h3" className={classes.title}>
                {title}
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
                            <MetaverseCard
                                data={data}
                                key={i}
                            />
                        </Grid>
                    })
                    : <div> no Item</div>
                }
            </Grid>

        </Container>
    ) : null
}

/*
<MetaverseCard
                data={data}
                key={i}
              />
*/
