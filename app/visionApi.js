
export async function analyzeImageWithGptVisionAPI(imageUrl) {
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
  
      const data = await response.json();
    
      if (data.length === 0) {
        alert("No items recognized in the image.");
      }
      return data;
    } catch (error) {
      console.error("Error creating completion:", error);
      throw error;
    }
  }
  