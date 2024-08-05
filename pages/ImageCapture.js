"use client";
import React, { useState, useRef,useEffect } from "react";
import { Camera } from "react-camera-pro";
import { storage, db } from "../app/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { Box, Button, LinearProgress } from "@mui/material";
import { analyzeImageWithGptVisionAPI } from "../app/visionApi";
import { useRouter } from "next/router";

const isMobileDevice = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const ImageCapture = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [facingMode, setFacingMode] = useState('user');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const captureImage = () => {
    const photo = camera.current.takePhoto();
    fetch(photo)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "capture.png", { type: "image/png" });
        setFile(file);
        setImage(photo);
      });
  };

  const handleUpload = async () => {
    if (file) {
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
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Analyze the image and get item names using the URL
          const items = await analyzeImageWithGptVisionAPI(downloadURL);

          // Store the image URL in Firestore
          await addDoc(collection(db, "images"), {
            imageUrl: downloadURL,
            createdAt: new Date(),
          });

          // Store the detected items in Firestore
          if (!items || items.length === 0) {
            alert("No items recognized in the image.");
          } else {
            items.forEach(async (item) => {
              await addDoc(collection(db, "items"), {
                name: item.name,
                quantity: item.quantity || 1,
                category: item.category || "Unknown",
                imageUrl: downloadURL,
                createdAt: new Date(),
              });
            });
          }

          setProgress(0);
          setFile(null);
          setImage(null);
          router.push("/");
        }
      );
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1000px',
          aspectRatio: '16/9',
          position: 'relative',
          flexGrow: 1,
        }}
      >
        <Camera ref={camera} facingMode={facingMode}/>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Button
          onClick={captureImage}
          sx={{
            borderRadius: '10px',
            backgroundColor: '#FF5722',
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '10px 20px',
            width: '100%',
            maxWidth: '200px',
            '@media (max-width: 600px)': {
              fontSize: '14px',
              padding: '8px 16px',
            },
          }}
        >
          Capture
        </Button>
        {isMobile && (
          <Button
            onClick={toggleFacingMode}
            sx={{
              borderRadius: '10px',
              backgroundColor: '#FF5722',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '10px 20px',
              width: '100%',
              maxWidth: '200px',
              '@media (max-width: 600px)': {
                fontSize: '14px',
                padding: '8px 16px',
              },
            }}
          >
            Flip Camera
          </Button>
        )}
        {image && (
          <img
            src={image}
            alt="captured"
            style={{ width: '100%', marginTop: '10px' }}
          />
        )}
        {file && (
          <Box>
            <Button
              onClick={handleUpload}
              disabled={!file}
              sx={{
                borderRadius: '10px',
                backgroundColor: '#4CAF50',
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '10px 20px',
                width: '100%',
                maxWidth: '200px',
                '@media (max-width: 600px)': {
                  fontSize: '14px',
                  padding: '8px 16px',
                },
              }}
            >
              Upload and Analyze
            </Button>
            {progress > 0 && (
              <LinearProgress variant="determinate" value={progress} sx={{ marginTop: '10px' }} />
            )}
          </Box>
        )}
        <Button
          onClick={() => router.push('/')}
          sx={{
            borderRadius: '10px',
            backgroundColor: '#2196F3',
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '10px 20px',
            width: '100%',
            maxWidth: '200px',
            '@media (max-width: 600px)': {
              fontSize: '14px',
              padding: '8px 16px',
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default ImageCapture;
