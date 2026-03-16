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


## Architecture Notes

This project uses a cleaner structure compared to a basic tutorial app:

Screens are focused on UI and user interaction

Services handle Firebase logic

Types define shared data models

Context manages global authentication state

Reusable components reduce code duplication

This approach makes the project easier to maintain and closer to a real product environment.

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

## Current Product Capabilities

This version of the project already demonstrates:

Mobile authentication flow

Protected route logic

CRUD operations with Firestore

Search and filtering

Reusable UI components

Global auth state handling

A more maintainable React Native project structure

## Future Improvements

Better Firebase error message mapping

Toast/snackbar improvements

Due date support

Task categories

Better design system

Global task context or caching

Real-time Firestore listeners

Better responsive polish

Deployment preparation

## Purpose

This project was built to improve my React Native skills and to create a more realistic mobile application for portfolio use.

It demonstrates:

React Native fundamentals

Expo-based mobile development

TypeScript usage

REST API integration

Firebase Authentication

Firestore CRUD logic

Navigation and route protection

Reusable component design

Cleaner folder and service structure