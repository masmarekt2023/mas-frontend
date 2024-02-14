import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  makeStyles,
} from "@material-ui/core";
import "./style.css";
import { Link } from "react-router-dom";
import { UserContext } from "src/context/User";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { green } from '@material-ui/core/colors';
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { toast } from "react-toastify";

//import KYCForm from './KYCForm'; // Adjust the path accordingly
import { useRef } from 'react';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  loginBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    maxWidth: '600px',
    width: '100%',
  },
  box: {
    width: '100%',
    height: '100%',
    // Add more styles as needed
  },
  kycFormContainer: {
    width: '100%',
    margin: theme.spacing(2),
    backgroundColor: 'white',  // Add red background
    padding: theme.spacing(3),  // Add padding to increase size
    borderRadius: theme.shape.borderRadius,
  },
  kycForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  kycFormTitle: {
    color: 'black',  // Set text color to white or any other color you prefer
  },
  formGroup: {
    margin: theme.spacing(1),
  },
  span: {
    marginRight: theme.spacing(1),
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  cameraButtons: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: theme.spacing(2),
  },
  video: {
    width: '100%',
    height: 'auto',
    marginTop: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  cancelButton: {
    marginRight: theme.spacing(1),
  },
}));

export default function kyc() {
  const user = useContext(UserContext);
  const classes = useStyles();
  const [isLoading, setIsloading] = useState(false);
  const [name, setname] = useState();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    document1: null,
    document2: null,
  });
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [file1Uploaded, setFile1Uploaded] = useState(false);
  const [file2Uploaded, setFile2Uploaded] = useState(false);
  const [showCheckMark, setShowCheckMark] = useState(false);

const handleNameChange = (e) => {
  setname(e.target.value);
};
const handleDateOfBirthChange = (e) => {
  setDateOfBirth(e.target.value);
};
const handleFile1Change = (e) => {
  setFile1(e.target.files[0]);
};
const handleFile2Change = (e) => {
  setFile2(e.target.files[0]);
};
const handleUpload = async () => {
  try {
    if (!name || !dateOfBirth || (!file1 && !file2)) {
      console.error('Please fill in all fields and select at least one file.');
      return;
    }

    setFile1Uploaded(false);
    setFile2Uploaded(false);

    if (file1) {
      const formData1 = new FormData();
      formData1.append('name', name);
      formData1.append('dateOfBirth', dateOfBirth);
      formData1.append('document1', file1);

      const response1 = await fetch('http://localhost:1865/upload/document1', {
        method: 'POST',
        body: formData1,
      });

      const data1 = await response1.json();
      console.log(data1);

      // Assume the upload is successful
      console.log('Uploading File 1');
      setFile1Uploaded(true);
    }

    if (file2) {
      const formData2 = new FormData();
      formData2.append('document2', file2);

      const response2 = await fetch('http://localhost:1865/upload/document2', {
        method: 'POST',
        body: formData2,
      });

      const data2 = await response2.json();
      console.log(data2);

      // Assume the upload is successful
      console.log('Uploading File 2');
      setFile2Uploaded(true);
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    // Handle error scenarios if needed
    setFile1Uploaded(false);
    setFile2Uploaded(false);
  }
};

useEffect(() => {
  console.log('file1Uploaded:', file1Uploaded);
  console.log('file2Uploaded:', file2Uploaded);

  if (!name || !dateOfBirth || !file1) {
    setFile1Uploaded(false);
  }

  if (!name || !dateOfBirth || !file2) {
    setFile2Uploaded(false);
  }

  const timer = setTimeout(() => {
    // Logic to handle the upload status after a delay (if needed)
  }, 30000);

  // Cleanup function for the timer
  return () => clearTimeout(timer);
}, [file1Uploaded, file2Uploaded]);

const startCamera = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
};
const stopCamera = () => {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setStream(null);
  }
};

const takePictureAndSendToBackend = async () => {
  try {
    // Ensure the camera is started before taking a picture
    await startCamera();

    if (videoRef.current) {
      await new Promise((resolve) => {
        videoRef.current.addEventListener('canplaythrough', resolve, { once: true });
        videoRef.current.play().then(() => videoRef.current.pause());
      });

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Draw a green check mark on the canvas
      context.beginPath();
      context.moveTo(10, 10);
      context.lineTo(canvas.width - 10, canvas.height - 10);
      context.strokeStyle = 'green';
      context.lineWidth = 5;
      context.stroke();

      // Convert the canvas content to a Blob (binary format)
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      // Ensure blob is a valid Blob
      if (!(blob instanceof Blob)) {
        throw new Error('Invalid blob type');
      }

      // Stop the camera
      stopCamera();

      // Create FormData object and append the image Blob with the key 'image'
      const formData = new FormData();
      formData.append('image', blob, 'filename.png'); // Adjust the filename if needed

      // Log the MIME type of the image
      console.log('Type of image:', blob.type);

      // Log FormData content
      console.log('FormData content:', formData);

      // Set the state to show the check mark
      setShowCheckMark(true);

      // Send the captured image data (Blob) to the backend
      await sendImageToBackend(formData);
    } else {
      console.error('Video element not found');
    }
  } catch (error) {
    console.error('Error capturing and sending image:', error);
  } finally {
    // Reset the state after a delay (adjust the delay as needed)
    setTimeout(() => {
      setShowCheckMark(false);
    }, 3000); // 3000 milliseconds (3 seconds) as an example
  }
};

const sendImageToBackend = async (formData) => {
  try {
    // Make a POST request to your backend endpoint
    const response = await fetch('http://localhost:1865/uploadImage', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Image successfully sent to the backend');
    } else {
      console.error('Failed to send image to the backend');
    }
  } catch (error) {
    console.error('Error sending image to the backend:', error);
  }
};
const processing = () => {
  // Perform your deactivation logic here
  try {
    const response =  axios({
      method: "PUT",
      url: Apiconfigs.processing, // Update the URL to your new endpoint
      headers: {
        token: sessionStorage.getItem("token"),
      },
    });
    if (response.data.statusCode === 200) {
      toast.success("processing successfully");
    } else {
      toast.error(response.data.responseMessage);
    }
  } catch (error) {
    console.error("processing Error ", error);
  }
};
useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        // Now it's safe to call takePicture or startCamera
      });
    }
  }, [videoRef]);

return (
  <Box className={classes.root}>
  <Box className={classes.loginBox}>
    <div className={classes.kycFormContainer}>
    <Typography variant="h5" align="center" gutterBottom className={classes.kycFormTitle}>
         KYC Form 
     </Typography>
      <form className={classes.kycForm} >
        <div className={classes.formGroup}>
          <label>
            <span className={classes.span}>Name:</span>
            <input type="text" value={name} onChange={handleNameChange} className={classes.input} />
          </label>
        </div>
        <div className={classes.formGroup}>
          <label>
            <span className={classes.span}>Date of Birth:</span>
            <input type="text" value={dateOfBirth} onChange={handleDateOfBirthChange} className={classes.input} />
          </label>
        </div>
        <div className={classes.formGroup}>
          <label>
            <span className={classes.span}>Document1:</span>
            <input type="file" onChange={(e) => setFile1(e.target.files[0])} className={classes.input}/>
            {file1Uploaded && (
        <CheckCircleOutlineIcon fontSize="small" style={{ color: green[500] }} />
      )}
          </label>
        </div>
        <div className={classes.formGroup}>
          <label>
            <span className={classes.span}>Document2:</span>
            <input type="file" onChange={(e) => setFile2(e.target.files[0])} className={classes.input}/>
            {file2Uploaded && (
        <CheckCircleOutlineIcon fontSize="small" style={{ color: green[500] }} />
      )}
          </label>
        </div>
      </form>
    </div>
    <Button
        variant="contained"
        color="secondary"
        onClick={handleUpload}
        className={classes.cancelButton}
        disabled={isLoading}
      >
       Upload Files
      </Button>
    <div className={classes.cameraButtons}>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={stopCamera}>Stop Camera</button>
      <button onClick={takePictureAndSendToBackend}>Take Picture</button>
      {showCheckMark && (
        <CheckCircleOutlineIcon fontSize="small" style={{ color: green[500] }} />
      )}
    </div>
    <video ref={videoRef} autoPlay playsInline muted className={classes.video} />
    <div className={classes.buttonContainer}>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        className={classes.cancelButton}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
      variant="contained"
      color="secondary"  // Using "secondary" for the color prop
      onClick={processing}
      className={`${classes.cancelButton} ${classes.redButton}`}
      disabled={isLoading}
    >
      Processing
    </Button>
      
      
      {/* Add other buttons as needed */}
    </div>
  </Box>
</Box>
  );}
