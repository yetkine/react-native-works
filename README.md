# TaskFlow Mobile

TaskFlow Mobile is a React Native mobile application built with Expo and TypeScript.  
It allows users to register, log in, and manage their personal tasks with Firebase Authentication and Firestore.

This project was built to improve my React Native skills and to create a portfolio-ready mobile application with real user flows, authentication, database integration, and clean UI structure.

## Features

- User registration with Firebase Authentication
- User login and logout
- Auth-protected screens
- Create tasks
- List tasks from Firestore
- Update task status (completed / pending)
- Delete tasks
- User-specific task data
- Loading, empty state, and simple UI polish
- Reusable input and button components

## Tech Stack

- React Native
- Expo
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Expo Router
- Git & GitHub

## Screens

- Login Screen
- Register Screen
- Profile Screen
- Tasks Screen
- User List Screen
- User Detail Screen

## Firebase Features

- Email/password authentication
- Firestore database integration
- User-based task filtering
- Task create / read / update / delete operations

## Project Structure


app/
  (tabs)/
    index.tsx
    explore.tsx
  hooks/
    useAuth.ts
  services/
    authService.ts
    taskService.ts
  types/
    task.ts
  users/
    [id].tsx
  login.tsx
  register.tsx
  profile.tsx
  tasks.tsx

components/
  CustomInput.tsx
  PrimaryButton.tsx

firebase/
  config.ts


## Getting Started


Clone the repository

Install dependencies

npm install

Start the Expo development server

npx expo start

Create a Firebase project

Enable Authentication (Email/Password)

Enable Firestore Database

Add your Firebase config into:

firebase/config.ts

Future Improvements

Better task filtering

Due date support

Task categories

Better form validation

Improved design system

Global auth context

Deployment build preparation

Purpose

This project was created as a hands-on React Native learning project and evolved into a portfolio-ready mobile app.
It demonstrates mobile UI development, Firebase integration, REST API usage, navigation, authentication flow, and clean component/service structure.
