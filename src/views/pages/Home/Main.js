import React, { useEffect, useState } from "react";
import AuctionPage from "./AuctionPage";
import BannerSection from "./BannerSection";
import HowItWorks from "./HowItWorks";
import OurSolutions from "./OurSolutions";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";

export default function Main() {
  const [bannerDetails, setBannerDetails] = useState([]);
  const [ourSolutions, setOurSolutions] = useState({});
  const [howItWorks, setHowItWorks] = useState({});

  const getBannerContentHandler = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.listBanner,
      });
      if (res.data.statusCode === 200) {
        setBannerDetails(res.data.result.docs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLandingPageSectionsHandler = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.landingContentList,
      });
      if (res.data.statusCode === 200) {
        setOurSolutions(res.data.result.find((sec) => sec.type == "solution"));
        setHowItWorks(res.data.result.find((sec) => sec.type == "howItWorks"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBannerContentHandler();
    getLandingPageSectionsHandler();
  }, []);
  return (
    <>
      {bannerDetails.length > 0 && <BannerSection bannerDetails={bannerDetails} />}
      <OurSolutions ourSolutions={ourSolutions} />
      <HowItWorks howItWorks={howItWorks} />
      <AuctionPage />
    </>
  );
}
