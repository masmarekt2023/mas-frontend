import React, { useState } from "react";
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
import { tokensDetails } from "../constants/index";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import ReactPlayer from "react-player";
import { toast } from "react-toastify";

const AddBundleDialog = ({ show, handleClose }) => {
  const classes = useStyles();
  const [mediaUrl, setMediaUrl] = useState("");
  const [uploadCounter, setUploadCounter] = useState(0);

  // Yup inputs validation
  const schema = yup.object({
    file: yup.mixed().required("File is required"),
    bundleTitle: yup.string().required("Enter title please"),
    bundleName: yup.string().required("Enter name please"),
    details: yup.string().required("Enter description please"),
    duration: yup.number().min(1, "Select a ending date"),
    donationAmount: yup
      .number()
      .min(1, "Enter donation amount please")
      .positive("the price should be positive number"),
    coinName: yup.string().required("Enter coin name"),
  });

  // React hook form for handle form data
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onSubmit",
    defaultValues: {
      file: null,
      bundleTitle: "",
      bundleName: "",
      donationAmount: 0,
      duration: 0,
      details: "",
      coinName: "MAS",
    },
  });

  /* Main Return */

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
      open={show}
      //onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle
        style={{ textAlign: "center", color: "black", fontWeight: "bold" }}
      >
        Create a bundle
      </DialogTitle>
      <DialogContent style={{ padding: 40 }}>
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
    const { type, name } = watch("file")
      ? watch("file")
      : { type: "", name: "" };
    const isVideo = type?.split("/")[0] !== "image";
    const onRemove = () => {
      setMediaUrl("");
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
      (data) => createBundle(data),
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
          Create
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
            setMediaUrl(URL.createObjectURL(e.target.files[0]));
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
        <CustomInput
          name={"bundleTitle"}
          control={control}
          title={"Bundle Title"}
          placeholder={"Enter Bundle Title"}
        />
        <CustomInput
          name={"bundleName"}
          control={control}
          title={"Bundle Name"}
          placeholder={"Enter Bundle Name"}
        />
        <CustomInput
          name={"donationAmount"}
          control={control}
          title={"Donation Amount"}
          placeholder={"Enter Donation Amount"}
          type={"number"}
          endAdornment={CoinSelector()}
        />
        <CustomInput
          name={"duration"}
          control={control}
          title={"Duration"}
          placeholder={"Enter Duration"}
          type={"number"}
          endAdornment={
            <p style={{ margin: "0px 10px", fontSize: 14 }}>days</p>
          }
        />
        <CustomInput
          name={"details"}
          control={control}
          title={"Details"}
          placeholder={"Enter a details about your bundle"}
          multiline={true}
        />
      </Grid>
    );
  }

  function CustomInput({
    control,
    name,
    title,
    placeholder,
    endAdornment = null,
    type = "text",
    multiline = false,
  }) {
    const {
      field,
      fieldState: { error },
      //formState: { touchedFields, dirtyFields },
    } = useController({
      name,
      control,
    });

    const { onChange, ref, value, onBlur } = field;

    return (
      <>
        <Grid
          sm={12}
          className={classes.inputContainer}
          style={{ borderColor: error ? "red" : "#ddd" }}
        >
          <label>{title}</label>
          <Input
            onChange={onChange}
            onBlur={onBlur}
            inputRef={ref}
            value={value}
            name={name}
            className={classes.input}
            placeholder={placeholder}
            endAdornment={endAdornment}
            type={type}
            multiline={multiline}
          />
        </Grid>
        <p style={{ margin: "-5px 0px 15px 5px", color: "red" }}>
          {error?.message}
        </p>
      </>
    );
  }

  function CoinSelector() {
    return (
      <InputAdornment position="end">
        <Select
          className={classes.select}
          value={watch("coinName")}
          onChange={(event) => setValue("coinName", event.target.value)}
        >
          {tokensDetails.map((item, index) => (
            <MenuItem key={index} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </InputAdornment>
    );
  }

  async function createBundle(data) {
    //setIsSubmit(true);
    try {
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadCounter(percentCompleted);
      };

      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("tokenName", data.bundleName);
      formData.append("bundleTitle", data.bundleTitle);
      formData.append(
        "duration",
        `${data.duration} ${data.duration > 1 ? "days" : "day"}`
      );
      formData.append("bundleName", data.bundleName);
      formData.append("details", data.details);
      formData.append("donationAmount", data.donationAmount);
      formData.append("coinName", data.coinName);

      const res = await axios({
        method: "POST",
        url: Apiconfigs.addNft,
        data: formData,
        headers: {
          token: sessionStorage.getItem("token"),
        },
        onUploadProgress: onUploadProgress,
      });

      if (res.data.statusCode === 200) {
        toast.success("Bundle created");
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  }
};

export default AddBundleDialog;

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
