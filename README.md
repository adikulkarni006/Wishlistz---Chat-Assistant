# Wishlistz Backend 🛍️

A **modular, scalable backend** for the **Wishlistz Shopping Assistant Chatbot**, built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

This backend enables an intelligent shopping assistant experience including:
- Personalized product recommendations
- Trip / Gift / Theme planning flows
- Chat-based interaction and navigation
- Wishlist management and user activity tracking

---

## ✨ Features

### Chat System
- Custom NLU-based intent handling
- Supports shopping queries:
  - Trending products
  - Search queries
  - Category exploration
- Planner queries:
  - Trip planner
  - Gift planner
  - Theme planner
- Navigation assistance (example: *“Where is men’s section?”*)

### Planner Engine
- **Trip Planner**: checklist generation + missing item suggestions  
- **Gift Planner**: suggestions based on age, relation, and budget  
- **Theme Planner**: outfit, decoration, and color theme recommendations  

### Recommendation Engine
- Personalized recommendations based on user behavior
- Trending and popular product suggestions
- Gap-based recommendations using wishlist + user history

### User & Product Management
- JWT authentication
- Wishlist CRUD
- User activity logging
- Product catalog management

### Database Layer
- MongoDB Atlas integration
- Clean schema design using Mongoose

---

## 🏗️ Architecture

```text
Client (Web / App)
        ↓ REST API
Node.js + Express Backend
        ↓
Routes → Controllers → Services → Models
        ↓
MongoDB Atlas (wishlistz_chatbot)