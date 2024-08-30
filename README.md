# 🌟 Calmify AI 🌟

**AI-Powered Flashcards for Emotional Support**

Calmify AI is a cutting-edge platform designed to bring peace and emotional support directly to your fingertips. Combining advanced AI technologies, real-time mood detection, and personalized content, Calmify AI helps you navigate your emotions and improve your well-being. Built with Next.js, OpenAI, Stripe, and Firebase, this platform offers a seamless and responsive user experience.

## 🚀 Features

- 🎴 **AI-Driven Flashcards**: Experience the power of AI with personalized flashcards tailored to your emotional state, generated using OpenAI's GPT models.
- 😌 **Real-Time Mood Detection**: Capture your emotions in real time with AWS Rekognition and receive flashcards that resonate with your current mood.
- 💳 **Subscription Management**: Unlock premium features with integrated Stripe payment processing for an enhanced user experience.
- ⚡ **Responsive Design**: Enjoy fast and seamless interactions, thanks to Next.js and optimized performance.
- 🔥 **Firebase Integration**: Robust backend support with Firebase for database management, user authentication, and secure storage.

## 🛠️ Technologies Used

- **Next.js**: Powerful React framework for server-side rendering and static site generation.
- **OpenAI**: Leveraging state-of-the-art GPT models for generating dynamic, personalized content.
- **AWS Rekognition**: Advanced facial recognition for real-time emotion analysis.
- **Stripe**: Secure and reliable payment processing for managing subscriptions.
- **Firebase**: Comprehensive backend solutions, including Firestore, authentication, and cloud storage.

## 🎥 Demo Video & Live Website

- [Watch the Demo Video](https://www.youtube.com/watch?v=6Bv7J_ynfhs) 🎬
- [Visit the Live Website](https://calmify-ten.vercel.app/) 🌐

## 📦 Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase project with Firestore and Storage set up
- Stripe account for payment processing
- OpenAI API key
- AWS account for Rekognition

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/calmify-ai.git
    cd calmify-ai
    ```

2. **Install the dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory and add your keys:

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
    OPENAI_API_KEY=your_openai_api_key
    AWS_ACCESS_KEY_ID=your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```

4. **Run the development server**:

    ```bash
    npm run dev
    ```

5. **Open your browser and navigate to** `http://localhost:3000`.

## 🌈 Usage

- **Capture Emotion**: Use the camera to capture your facial expression, which is analyzed in real-time to detect your mood.
- **Generate Flashcards**: Based on the detected mood, Calmify AI generates personalized flashcards using the power of AI.
- **Manage Subscription**: Upgrade to access premium features and a richer experience through Stripe integration.

## 🤝 Contributing

We welcome contributions! If you'd like to help, please submit issues or pull requests. Be sure to adhere to the project's coding standards and practices.

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 📧 Contact

For more information or support, please reach out to Pranav Chhabra at [pranav@example.com](mailto:pranav@example.com).

---

Thank you for visiting Calmify AI! We hope it brings calmness and support to your daily life.
