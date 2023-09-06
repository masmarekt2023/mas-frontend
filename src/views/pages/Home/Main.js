import React, { useEffect, useState } from "react";
import AuctionPage from "./AuctionPage";
import BannerSection from "./BannerSection";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import LandingSection from "src/views/pages/Home/LandingSection";

export default function Main() {
  const [state, setState] = useState({
    bannerDetails: [],
    bannerDuration: undefined,
    landingSections: [],
    staticSections: []
  });
  const { bannerDuration, bannerDetails, landingSections, staticSections } = state;
  const updateState = (data) =>
    setState((prevState) => ({ ...prevState, ...data }));

  const getBannerContentHandler = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.listBanner,
      });
      if (res.data.statusCode === 200) {
        updateState({ bannerDetails: res.data.result.docs });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBannerDuration = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.getBannerDuration,
      });
      if (res.data.statusCode === 200) {
        updateState({ bannerDuration: res.data.result });
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
        updateState({ landingSections: res.data.result });
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getStaticSections() {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.staticSectionList,
      });
      if (res.data.statusCode === 200) {
        updateState({ staticSections: res.data.result });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBannerDuration().catch(console.error);
    getBannerContentHandler().catch(console.error);
    getLandingPageSectionsHandler().catch(console.error);
    getStaticSections().catch(console.error);
  }, []);

  useEffect(() => {
    console.log(bannerDuration);
  }, [bannerDuration]);
  return (
    <>
      {bannerDetails.length > 0 && (
        <BannerSection
          bannerDetails={bannerDetails}
          bannerDuration={bannerDuration}
        />
      )}
      {landingSections.map((item, index) => (
        <LandingSection key={item._id} item={item} index={index} />
      ))}
      <AuctionPage staticSections={staticSections}/>
    </>
  );
}
