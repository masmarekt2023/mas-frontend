import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {
  Grid,
  Input,
  InputAdornment,
  makeStyles,
  Select,
  MenuItem,
  Button,
  Box,
} from "@material-ui/core";
import { useController, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Apiconfigs from "../Apiconfig/Apiconfigs";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";
import { Pagination } from "@material-ui/lab";

const ShareForAudienceDialog = ({ show, handleClose, audienceData }) => {
  const classes = useStyles();
  const [state, setState] = useState({
    mediaUrl: "",
    uploadCounter: 0,
    bundleList: [],
    page: 1,
    pages: 1,
    isEdit: !!audienceData,
  });
  const { mediaUrl, uploadCounter, page, pages, bundleList, isEdit } = state;
  const updateState = (data) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Yup inputs validation
  const schema = yup.object({
    file: !isEdit ? yup.mixed().required("File is required") : null,
    title: yup.string().min(3, "Enter title please"),
    details: yup.string().min(3, "Enter description please"),
    bundleIds: yup.array().min(1, "Select 1 bundle at least"),
  });

  // React hook form for handle form data
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, dirtyFields },
      register
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    defaultValues: {
      file: null,
      title: isEdit ? audienceData.title : "",
      details: isEdit ? audienceData.details : "",
      type: isEdit ? audienceData.postType : "PUBLIC",
      bundleIds: isEdit ? audienceData.nftId : [],
    },
  });

  useEffect(() => {
    updateState({ mediaUrl: isEdit ? audienceData.mediaUrl : "" });
  }, [show]);

  useEffect(() => {
    getBundleListHandler().catch(console.error);
  }, [page]);

  /* Main Return */

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
      open={show}
      onClose={uploadCounter === 0 ? handleClose : null}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle
        style={{ textAlign: "center", color: "black", fontWeight: "bold" }}
      >
        {isEdit ? "Edit Audience" : "Share For Audience"}
      </DialogTitle>
      <DialogContent style={{ padding: 40, paddingTop: 10 }}>
        <Grid container spacing={5}>
          {InputList()}
          <Grid item xs={12} sm={5}>
            {MediaInput()}
            {MediaBox()}
          </Grid>
          {FormButtons()}
        </Grid>
      </DialogContent>
    </Dialog>
  );

  /* Main Return */

  function MediaBox() {
    const { name } = watch("file") ? watch("file") : { type: "", name: "" };

    const isVideo = watch("file")
      ? watch("file")?.type?.split("/")[0] !== "image"
      : isEdit
      ? isVideoType(mediaUrl)
      : false;

    const onRemove = () => {
      updateState({ mediaUrl: "" });
      setValue("file", null);
    };

    return (
      <Box
        style={{ display: mediaUrl !== "" ? "block" : "none" }}
        className={classes.mediaBox}
      >
        {isVideo ? (
          <div
            style={{ borderRadius: "10px 10px 0px 0px", overflow: "hidden" }}
          >
            <ReactPlayer
              url={mediaUrl}
              playing
              controls
              width={"100%"}
              height={"100%"}
            />
          </div>
        ) : (
          <img
            src={mediaUrl}
            width="100%"
            height={"50%"}
            alt={"bundle image"}
            style={{ borderRadius: "10px 10px 0px 0px" }}
          />
        )}
        <div className={classes.mediaBoxInfo}>
          <div>
            <p
              style={{
                color: "#777",
                fontWeight: "600",
                margin: 0,
                fontSize: 14,
              }}
            >
              Filename
            </p>
            <p style={{ marginTop: 5, fontWeight: "500" }}>
              {name ? name : ""}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <DeleteIcon
              fontSize={"medium"}
              style={{ color: "red", cursor: "pointer" }}
              onClick={onRemove}
            />
          </div>
        </div>
        {uploadCounter > 0 && (
          <div className={classes.uploadCounter}>
            <CloudUploadIcon
              fontSize={"large"}
              style={{ color: "rgb(192, 72, 72)" }}
              className={classes.uploadCounterIcon}
            />
            <p>Uploading {uploadCounter}%</p>
          </div>
        )}
      </Box>
    );
  }

  function FormButtons() {
    const onSubmit = handleSubmit(
      (data) => isEdit ? editAudience(data) : shareForAudience(data),
      () => console.log(errors)
    );

    return (
      <Grid xs={12} className={classes.buttonContainerStyle}>
        <Button
          variant="contained"
          onClick={handleClose}
          color="primary"
          size="large"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          size="large"
          className={classes.submitButton}
        >
          {isEdit ? "Edit" : "Share"}
        </Button>
      </Grid>
    );
  }

  function MediaInput() {
    const {
      field,
      fieldState: { error },
    } = useController({
      name: "file",
      control,
    });

    const { onChange, ref, name } = field;

    return (
      <label htmlFor="raised-button-file">
        <input
          accept="image/*,video/*"
          style={{ display: "none" }}
          className={classes.input}
          id="contained-button-file-add-bun"
          multiple
          onChange={(e) => {
            onChange(e.target.files[0]);
            updateState({ mediaUrl: URL.createObjectURL(e.target.files[0]) });
          }}
          ref={ref}
          name={name}
          type="file"
        />
        <label htmlFor="contained-button-file-add-bun">
          <Button
            variant="outined"
            color="primary"
            component="span"
            className={classes.uploadBox}
            style={{
              borderColor: error ? "red" : "#ddd",
              display: mediaUrl === "" ? "flex" : "none",
            }}
          >
            <div className={classes.uploadIcon}>
              <CloudUploadIcon />
            </div>
            <p>Upload image/video</p>
          </Button>
        </label>
      </label>
    );
  }

  function InputList() {
    return (
      <Grid item xs={12} sm={7}>
        <>
          <Grid
              sm={12}
              className={classes.inputContainer}
              style={{ borderColor: errors.title ? "red" : "#ddd" }}
          >
            <label>Title</label>
            <Input
                {...register("title")}
                className={classes.input}
                placeholder={"Enter Title"}
                disabled={isEdit}
            />
          </Grid>
          <p style={{ margin: "-5px 0px 15px 5px", color: "red" }}>
            {errors.title?.message}
          </p>
        </>
        <Grid
            sm={12}
            className={classes.inputContainer}
        >
          <label>Type</label>
          <Input
              {...register("type")}
              className={classes.input}
              placeholder={"Enter Type"}
              disabled={true}
              endAdornment={<TypeSelector />}
          />
        </Grid>
        <>
          <Grid
              sm={12}
              className={classes.inputContainer}
              style={{ borderColor: errors.details ? "red" : "#ddd" }}
          >
            <label>Details</label>
            <Input
                {...register("details")}
                className={classes.input}
                placeholder={"Enter details"}
                multiline={true}
            />
          </Grid>
          <p style={{ margin: "-5px 0px 15px 5px", color: "red" }}>
            {errors.details?.message}
          </p>
        </>
        <BundleSelector />
      </Grid>
    );
  }

  function TypeSelector() {
    return (
      <InputAdornment position="end">
        <Select
          className={classes.select}
          value={watch("type")}
          onChange={(event) => setValue("type", event.target.value)}
        >
          {["PUBLIC", "PRIVATE"].map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </InputAdornment>
    );
  }

  function BundleSelector() {
    const formBundles = watch("bundleIds");
    const selectItem = (id) => {
      if (formBundles.includes(id)) {
        setValue(
          "bundleIds",
          formBundles.filter((i) => i !== id)
        );
      } else {
        setValue("bundleIds", [...formBundles, id]);
      }
    };

    return (
      <div style={{ margin: 10 }}>
        <p className={classes.selectorTitleStyle}>
          Chose Bundles To Share with
        </p>
        <Grid container spacing={2}>
          {bundleList.map((item) => {
            const isChosen = formBundles.includes(item._id);
            return (
              <Grid item key={item._id} lg={3} md={4} sm={6} xm={12}>
                <div
                  className={classes.bundleCardStyle}
                  style={{
                    borderColor: isChosen ? "rgb(192, 72, 72)" : "#ddd",
                  }}
                  onClick={() => (isEdit ? {} : selectItem(item._id))}
                >
                  <p style={{ textAlign: "center" }}>{item.bundleName}</p>
                </div>
              </Grid>
            );
          })}
        </Grid>
        {errors?.bundleIds && (
          <p style={{ color: "red" }}>{errors.bundleIds?.message}</p>
        )}
        {pages > 0 && (
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
      </div>
    );
  }

  async function shareForAudience(data) {
    const formData = new FormData();
    formData.append("mediaUrl", data.file);
    formData.append("title", data.title);
    formData.append("details", data.details);
    formData.append("postType", data.type);
    formData.append("nftIds", JSON.stringify(data.bundleIds));
    try {
      const res = await axios({
        method: "POST",
        url: Apiconfigs.share,
        data: formData,
        headers: {
          token: sessionStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => onUploadProgress(progressEvent),
      });
      if (res.data.statusCode === 200) {
        toast.success(res.data?.responseMessage);
        handleClose();
      } else {
        toast.error(res.data.responseMessage);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function editAudience(data) {
    const formData = new FormData();
    formData.append("id", audienceData._id);
    if (dirtyFields.file) {
      formData.append("mediaUrl", data.file);
    }
      formData.append("details", data.details);
      formData.append("postType", data.type);
    try {
      const res = await axios({
        method: "PUT",
        url: Apiconfigs.editAudience,
        data: formData,
        headers: {
          token: sessionStorage.getItem("token"),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => onUploadProgress(progressEvent),
      });
      if (res.data.statusCode === 200) {
        handleClose();
        window.location.reload();
        toast.success(res.data?.responseMessage);
      } else {
        toast.error(res.data.responseMessage);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getBundleListHandler() {
    await axios({
      method: "GET",
      url: Apiconfigs.myNftList,
      headers: {
        token: sessionStorage.getItem("token"),
      },
      params: {
        page,
        limit: 4,
      },
    })
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          updateState({ bundleList: res.data.result.docs });
          updateState({ pages: res.data.result.pages });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function onUploadProgress(progressEvent) {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    updateState({ uploadCounter: percentCompleted });
  }

  function isVideoType(url) {
    return url.includes("video");
  }
};

export default ShareForAudienceDialog;

const useStyles = makeStyles(() => ({
  inputContainer: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "solid",
    borderRadius: 5,
    padding: "10px",
    marginBottom: 10,
    transition: "border-color 0.3s ease-in",
    "&:focus-within": {
      borderColor: "rgb(192, 72, 72)",
      "& label": {
        color: "rgb(192, 72, 72)",
        transition: "color 0.3s ease-in",
      },
    },
    "&>label": {
      fontWeight: "500",
      color: "black",
      fontSize: 14,
    },
  },

  input: {
    width: "100%",
    "&::before": {
      content: "none",
    },
    "&::after": {
      content: "none",
    },
    "&>input": {
      width: "100%",
    },
  },

  select: {
    "&::before": {
      content: "none",
    },
    "&::after": {
      content: "none",
    },
    "& div:focus": {
      background: "transparent",
    },
  },

  uploadBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    height: "calc(100% - 10px)",
    border: "2px #ddd solid",
    "&>.MuiButton-label": {
      flexDirection: "column",
    },
  },

  uploadIcon: {
    width: 70,
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px #ddd solid",
    borderRadius: "50%",
  },

  buttonContainerStyle: {
    padding: "0px 20px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },

  submitButton: {
    backgroundColor: "rgb(192, 72, 72)",
    color: "#fff",
    "&:hover": {
      boxShadow: "0px 0px 0px 0px",
      backgroundColor: "rgba(192, 72, 72, 0.95) !important",
    },
  },

  mediaBox: {
    width: "100%",
    marginBottom: 0,
  },

  mediaBoxInfo: {
    background: "rgba(0,0,0,0.1)",
    marginTop: -6,
    padding: 20,
    borderRadius: "0px 0px 10px 10px",
    height: "50%",
  },

  uploadCounter: {
    position: "relative",
    marginTop: 30,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadCounterIcon: {
    position: "absolute",
    marginBottom: 20,
    animation: "$upAndDown 2s ease-in-out infinite",
  },

  selectorTitleStyle: {
    fontWeight: "500",
    color: "black",
    fontSize: 16,
    margin: "20px 0px",
  },

  bundleCardStyle: {
    width: 100,
    height: 100,
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px #ddd solid",
  },

  "@keyframes upAndDown": {
    "0%": {
      top: 0,
    },
    "50%": {
      top: -15,
    },
    "100%": {
      top: 0,
    },
  },
}));
