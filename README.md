# PantryPal

PantryPal is a modern food management application that helps you keep track of your pantry, discover recipes based on available ingredients, and visualize your food items with interactive 3D models and animations.

## Getting Started

Follow these steps to set up the project locally:

1. Clone the repository
```bash
git clone https://github.com/your-username/PantryPal.git
cd PantryPal
```

2. Install dependencies
```bash
npm install
```

3. Download visual assets (3D models and Lottie animations)
```bash
npm run setup-visuals
```
This will download both 3D models and Lottie animations. If you prefer to download them separately:
```bash
npm run download-models    # Download 3D models only
npm run download-lottie    # Download Lottie animations only
```

4. Set up your environment variables
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your API keys and configuration.

5. Start the development server
```bash
npm run dev
```

## Visualizations

This application uses both 3D models and Lottie animations to enhance the user experience.

### 3D Models

The 3D models are loaded from the `public/models/` directory using Three.js and React Three Fiber.

#### Automatic Download

When you run `npm run download-models`, the script will attempt to download the following 3D models:

- apple.glb
- broccoli.glb
- chicken.glb
- cheese.glb
- bread.glb
- salmon.glb
- cinnamon.glb
- pasta.glb

If the automatic download fails for any model, a placeholder file will be created. You will need to manually replace these placeholder files with actual 3D models.

### Lottie Animations

As an alternative to 3D models, the application also supports Lottie animations. These are loaded from the `public/lottie/` directory.

#### Automatic Download

When you run `npm run download-lottie`, the script will attempt to download the following Lottie animations:

- fruit_animation.json
- vegetable_animation.json
- meat_animation.json
- dairy_animation.json
- grain_animation.json
- seafood_animation.json
- spice_animation.json
- pasta_animation.json
- default_food_animation.json

If the automatic download fails for any animation, a simple pulsating circle animation will be created as a fallback.

### Manual Setup (if automatic download fails)

If the automatic download fails, you'll need to:

1. Find appropriate 3D models in GLB format or Lottie animations in JSON format
2. Place 3D models in the `public/models/` directory
3. Place Lottie animations in the `public/lottie/` directory
4. Make sure the filenames exactly match the ones listed above

You can find free resources at:
- **3D Models:** [Sketchfab](https://sketchfab.com), [TurboSquid](https://www.turbosquid.com), [CGTrader](https://www.cgtrader.com)
- **Lottie Animations:** [LottieFiles](https://lottiefiles.com/), [IconScout](https://iconscout.com/lottie-animations)

## Features

- Pantry inventory management
- Recipe suggestions based on available ingredients
- Interactive food visualizations with 3D models and Lottie animations
- Nutritional information
- Shopping list generation

## License

[MIT](LICENSE)
