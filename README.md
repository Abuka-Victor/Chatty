# Chatty

"Chatty" is a foundational real-time chat application built using Socket.io, serving as an excellent starting point for understanding web sockets and real-time communication.

# Credits

This project is adapted from an existing chat application to be used as a practical base for educational purposes. We extend our gratitude to the original creator for their work, which provides a solid foundation for further development and learning. You can find the original video from youtube here [Codesistency](https://www.youtube.com/watch?v=ntKkVrQqBYY&t=7340s). [Github Repo](https://github.com/burakorkmez/fullstack-chat-app).

The original project is written in plain javascript but this version has included Typescript support on the frontend. Please do check out the Codesistency Youtube channel for other awesome tutorials.

# Purpose for Genkit AI Class

This "Chatty" application will be used as a starting project for a Genkit AI class. Genkit AI is a powerful framework for building AI-powered applications, allowing developers to orchestrate complex AI workflows, integrate with various LLMs (Large Language Models), and create robust, production-ready AI features.

In this class, we will leverage the existing real-time communication capabilities of "Chatty" to demonstrate how to integrate and build intelligent features using Genkit AI. This includes, but is not limited to, adding AI-powered chatbots, implementing content moderation, providing message summarization, and exploring other generative AI functionalities directly within a live chat environment.

Features (Current)
User Authentication: Secure user signup and login.

Real-time Messaging: Instant message delivery between online users.

Online User Tracking: Displays users currently connected to the chat.

User Profiles: Basic user profiles including a profile picture.

Toast Notifications: User feedback via react-hot-toast for actions like login/signup success or errors.

Technologies Used
Frontend: React, Zustand (for state management), React Hot Toast (for notifications)

Backend: Node.js (with Express)

Real-time Communication: Socket.io

HTTP Client: Axios

Language: TypeScript and Javascript

# Setup Instructions

To get "Chatty" up and running locally, follow these steps:

## Clone the repository:

```bash
git clone https://github.com/Abuka-Victor/Chatty
cd chatty
```

## Install dependencies:

### For the frontend

```bash
cd frontend
npm install # or yarn install
```

### For the backend

```bash
cd backend
npm install # or yarn install
```

## Configure Environment Variables:

Create a .env file in the backend directory for sensitive information such as database connection strings, API keys, etc.

Ensure the BASE_URL in src/stores/authStore.ts matches your Socket.io server's address (e.g., wss://localhost:8080).

## Run the application:

### Start the backend server

```bash
npm start # or yarn start
```

# Start the frontend development server

```bash
npm start # or yarn start
```

The application should now be accessible in your browser, typically at http://localhost:5173.

# Future Enhancements (Genkit AI Integration)

This project is ready to be enhanced with powerful AI features using Genkit AI. Here are some ideas we might explore in the class:

AI Chatbot: Integrate an LLM to act as a chatbot within specific channels or for direct user queries.

Message Summarization: Implement a feature to summarize long chat conversations.

Sentiment Analysis: Analyze message sentiment to help moderators or provide user insights.

Content Moderation: Automatically flag or filter inappropriate content using AI.

Language Translation: Provide real-time translation of messages between users.

Personalized Recommendations: Offer recommendations based on chat content or user interests.

# License

This project is open-sourced under the MIT License.
