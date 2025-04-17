"use client";
import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { storage, db } from "../app/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { 
  Box, 
  Button, 
  LinearProgress, 
  Typography, 
  Paper, 
  Container, 
  Grid,
  IconButton,
  Fade,
  Grow,
  CircularProgress,
  Chip,
  Tooltip,
  Backdrop,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { analyzeImageWithGptVisionAPI } from "../app/visionApi";
import { useRouter } from "next/router";

// Icons
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FlashOffIcon from '@mui/icons-material/FlashOff';
import HighlightIcon from '@mui/icons-material/Highlight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Detect mobile device
const isMobileDevice = () => {
  return typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
};

const ImageCapture = () => {
  const theme = useTheme();
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [facingMode, setFacingMode] = useState("environment"); // Default to back camera
  const [isMobile, setIsMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const [flashMode, setFlashMode] = useState(false);
  const [showGuideLines, setShowGuideLines] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const router = useRouter();

  // Check if running on mobile device
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  // Capture image from camera
  const captureImage = () => {
    try {
    const photo = camera.current.takePhoto();
    fetch(photo)
      .then((res) => res.blob())
      .then((blob) => {
          const file = new File([blob], `pantry-scan-${Date.now()}.png`, { type: "image/png" });
        setFile(file);
        setImage(photo);
          
          // Show success message
          displayAlert("Image captured successfully", "success");
          setShowGuideLines(false);
        })
        .catch(err => {
          console.error("Error processing capture:", err);
          displayAlert("Failed to process image", "error");
        });
    } catch (err) {
      console.error("Error capturing image:", err);
      displayAlert("Could not capture image", "error");
    }
  };

  // Upload and analyze the captured image
  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          displayAlert("Upload failed", "error");
          setIsUploading(false);
        },
        async () => {
          try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Upload complete, start analysis
            setIsUploading(false);
            setIsAnalyzing(true);
            displayAlert("Analyzing image with AI...", "info");

          // Analyze the image and get item names using the URL
          const items = await analyzeImageWithGptVisionAPI(downloadURL);
            setDetectedItems(items || []);

          // Store the image URL in Firestore
          await addDoc(collection(db, "images"), {
            imageUrl: downloadURL,
            createdAt: new Date(),
          });

          // Store the detected items in Firestore
          if (!items || items.length === 0) {
              displayAlert("No food items recognized in the image", "warning");
          } else {
              // Delay adding items slightly to show the detected items UI
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              const promises = items.map(async (item) => {
                return addDoc(collection(db, "items"), {
                name: item.name,
                quantity: item.quantity || 1,
                category: item.category || "Unknown",
                unit: item.unit || "piece",
                imageUrl: downloadURL,
                createdAt: new Date(),
              });
            });
              
              await Promise.all(promises);
              displayAlert(`Added ${items.length} items to your pantry!`, "success");
              
              // Allow time to see the success message before redirecting
              setTimeout(() => {
                resetState();
                router.push("/");
              }, 2000);
            }
          } catch (error) {
            console.error("Error in processing:", error);
            setIsAnalyzing(false);
            displayAlert("Error processing your image", "error");
          }
        }
      );
    }
  };

  // Toggle between front and back camera
  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
    setShowGuideLines(true);
  };
  
  // Toggle flash mode
  const toggleFlash = () => {
    if (camera.current) {
      try {
        setFlashMode(!flashMode);
        // Note: Flash control depends on browser/device support
      } catch (err) {
        displayAlert("Flash control not supported on this device", "warning");
      }
    }
  };
  
  // Toggle guide lines
  const toggleGuideLines = () => {
    setShowGuideLines(!showGuideLines);
  };
  
  // Reset state for a new capture
  const resetState = () => {
    setProgress(0);
    setFile(null);
    setImage(null);
    setIsUploading(false);
    setIsAnalyzing(false);
    setDetectedItems([]);
    setShowGuideLines(true);
  };
  
  // Display alert message
  const displayAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 4, 
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        bgcolor: '#121212',
      }}>
        {/* Header with back button */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => router.push("/")}
              sx={{ color: 'white', mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="h1" color="white">
              Scan Food Items
            </Typography>
          </Box>
          
          {isMobile && !image && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={flashMode ? "Turn flash off" : "Turn flash on"}>
                <IconButton 
                  onClick={toggleFlash} 
                  sx={{ color: 'white' }}
                >
                  {flashMode ? <FlashOnIcon /> : <FlashOffIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Toggle guidelines">
                <IconButton 
                  onClick={toggleGuideLines} 
                  sx={{ color: showGuideLines ? 'white' : 'rgba(255,255,255,0.5)' }}
                >
                  <HighlightIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Switch camera">
                <IconButton 
                  onClick={toggleFacingMode} 
                  sx={{ color: 'white' }}
                >
                  <FlipCameraIosIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        
        {/* Main content area */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative',
        }}>
          {/* Camera or captured image view */}
          <Box sx={{
            flexGrow: 1,
            position: 'relative',
            minHeight: { xs: '50vh', md: 'auto' },
          }}>
            {!image ? (
              // Camera view with guidelines
              <Box sx={{ height: '100%', position: 'relative' }}>
                <Camera 
                  ref={camera} 
                  facingMode={facingMode} 
                  key={facingMode}
                  aspectRatio="cover"
                  errorMessages={{
                    noCameraAccessible: 'No camera available on your device.',
                    permissionDenied: 'Camera permission denied. Please enable camera access.',
                    switchCamera: 'Error switching camera.',
                    canvas: 'Error with camera display.'
                  }}
                />
                
                {/* Guidelines overlay */}
                {showGuideLines && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}>
                    <Box sx={{
                      width: '80%',
                      height: '80%',
                      border: '2px dashed rgba(255,255,255,0.6)',
                      borderRadius: 4,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                    }}>
                      <Typography 
                        variant="body2" 
                        color="white" 
      sx={{
                          textAlign: 'center', 
                          bgcolor: 'rgba(0,0,0,0.5)', 
                          p: 1,
                          borderRadius: 2,
                          maxWidth: '80%',
                        }}
                      >
                        Position food items within this area
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                {/* Central capture button for mobile */}
                <Box sx={{
                  position: 'absolute',
                  bottom: { xs: 20, md: 20 },
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <IconButton
                    onClick={captureImage}
        sx={{
                      width: 70,
                      height: 70,
                      bgcolor: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.8)',
                      },
                      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                  </IconButton>
                  
                  <Typography variant="body2" color="white" sx={{ mt: 1 }}>
                    Tap to capture
                  </Typography>
                </Box>
      </Box>
            ) : (
              // Captured image preview
              <Box sx={{ height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {image && (
      <Box
                      component="img"
                      src={image}
                      alt="Captured food items"
        sx={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </Box>
                
                {/* Processing overlay */}
                {(isUploading || isAnalyzing) && (
                  <Backdrop
                    open={true}
          sx={{
                      position: 'absolute',
                      zIndex: 999,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <CircularProgress color="primary" />
                    <Typography variant="h6">
                      {isUploading ? 'Uploading image...' : 'Analyzing with AI...'}
                    </Typography>
                    {isUploading && progress > 0 && (
                      <Box sx={{ width: '80%', maxWidth: 300 }}>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                          {`${Math.round(progress)}%`}
                        </Typography>
                      </Box>
                    )}
                  </Backdrop>
                )}
                
                {/* Detected items overlay */}
                {!isUploading && !isAnalyzing && detectedItems.length > 0 && (
                  <Fade in={true}>
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                    }}>
                      <Typography variant="body1" gutterBottom>
                        Detected Food Items:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {detectedItems.map((item, index) => (
                          <Grow in={true} key={index} style={{ transformOrigin: '0 0 0' }} timeout={(index + 1) * 200}>
                            <Chip 
                              label={`${item.name} (${item.quantity} ${item.unit})`}
                              color="primary"
                              variant="outlined"
                              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                            />
                          </Grow>
                        ))}
                      </Box>
                    </Box>
                  </Fade>
                )}
              </Box>
            )}
          </Box>
          
          {/* Side panel for controls */}
          <Paper
            elevation={0}
            sx={{
              width: { xs: '100%', md: '280px' },
              display: 'flex',
              flexDirection: 'column',
              p: 3,
              gap: 2,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderLeft: { xs: 'none', md: '1px solid rgba(0,0,0,0.1)' },
              borderTop: { xs: '1px solid rgba(0,0,0,0.1)', md: 'none' },
            }}
          >
            <Typography variant="h6" gutterBottom>
              {!image ? 'Capture Food Items' : 'Review & Upload'}
            </Typography>
            
            {!image ? (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Position your food items clearly in the frame and tap the camera button to capture them.
                </Typography>
                
                <Grid container spacing={2}>
                  {!isMobile && (
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PhotoCameraIcon />}
                        onClick={captureImage}
                        sx={{
                          py: 1.5,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          fontWeight: 'bold',
                          '&:hover': {
                            bgcolor: theme.palette.primary.dark,
                          },
                          borderRadius: 2,
                        }}
                      >
                        Capture Image
          </Button>
                    </Grid>
                  )}
                  
                  {isMobile && (
                    <>
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<FlipCameraIosIcon />}
                          onClick={toggleFacingMode}
                          sx={{ borderRadius: 2 }}
                        >
                          Flip
                        </Button>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={showGuideLines ? <HighlightIcon /> : <HighlightIcon />}
                          onClick={toggleGuideLines}
                          sx={{ borderRadius: 2 }}
                        >
                          {showGuideLines ? 'Hide Guide' : 'Show Guide'}
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
                
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push("/")}
                    sx={{ mt: 2, color: 'text.secondary' }}
                  >
                    Back to Pantry
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {detectedItems.length > 0 
                    ? `We've detected ${detectedItems.length} food items in your image.`
                    : 'Review your captured image and upload to analyze with AI.'}
                </Typography>
                
                {detectedItems.length > 0 ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => router.push("/")}
                    sx={{
                      py: 1.5,
                      fontWeight: 'bold',
                      borderRadius: 2,
                    }}
                  >
                    Return to Pantry
                  </Button>
                ) : (
            <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
                    disabled={isUploading || isAnalyzing || !file}
              sx={{
                      py: 1.5,
                      bgcolor: theme.palette.secondary.main,
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: theme.palette.secondary.dark,
                      },
                      borderRadius: 2,
                    }}
                  >
                    {isUploading || isAnalyzing ? 'Processing...' : 'Analyze with AI'}
                  </Button>
                )}
                
                {!isUploading && !isAnalyzing && !detectedItems.length && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={resetState}
                    sx={{ mt: 2, borderRadius: 2 }}
                  >
                    Retake Photo
                  </Button>
                )}
                
                {!isUploading && !isAnalyzing && !detectedItems.length && (
                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push("/")}
                    sx={{ mt: 2, color: 'text.secondary' }}
                  >
                    Cancel
            </Button>
                )}
              </>
            )}
          </Paper>
          </Box>
      </Paper>
      
      {/* Alert snackbar */}
      <Snackbar 
        open={showAlert} 
        autoHideDuration={6000} 
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity={alertSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ImageCapture;
