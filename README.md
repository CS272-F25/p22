# Smart Sausage  
## CS472: Intro to Web Development – Final Project  
University of Wisconsin–Madison  
Group 22 – Smart Sausage

---

### Group Members

| Name (Canvas) | GitHub Username |
|---------------|-----------------|
| Hetvi Pethad | prettyspoon |
| Ayush Kedari | kedariayush |
| Porter Provan | pprovan-wisc |

---

### Project Description

Smart Sausage is a playful, fast-paced online learning platform designed to make education feel casual and enjoyable rather than formal or academic.  
It draws inspiration from curiosity-based sites such as GeoGuessr, Human Benchmark, and Philosophy Experiments.

Instead of acting like traditional study tools (Quizlet, Coursera), Smart Sausage provides:
- Short quizzes
- Flashcards
- Subject-based challenges
- Light facts and trivia

The goal is to encourage users to explore knowledge when bored, competitive, or curious, with no pressure to "study."  
Each subject page supports Flashcards, Learn Mode, and Quiz Mode, powered by a question API.

A dedicated Leaderboard / Stats system displays user history, best scores, time spent, and game activity.

---

### Key Features

#### Subject-Based Learning
- Math, Science, Geography, History, Art  
- Each includes facts, flashcards, and quizzes  
- Three learning modes: Flashcards, Learn Mode, Quiz Mode  
- Dynamic API-loaded questions  
- Automatic progress tracking with LocalStorage  

#### Flashcard + Quiz System
- Flip card interaction  
- Multiple-choice quiz interface  
- Timer, submit locking, answer review  
- Flagging and navigation features  
- Save-to-favourites functionality  

#### Leaderboard & Stats
- Summary cards for overall performance  
- Per-subject analytics:  
  - Best time  
  - Average score  
  - Total games  
  - Total time spent  
- Activity graph showing quizzes played per day  
- Saved quiz history  

#### Favourites (Saved Flashcards)
- Users can bookmark questions  
- Saved with subject, difficulty, correct answer, and date  
- Filter by:  
  - Subject  
  - Difficulty  
  - Date (Today, Week, Month)  
- Responsive card grid layout  

---

### Technology Stack

- HTML5  
- CSS3  
- JavaScript (ES6)  
- LocalStorage API  
- Chart.js (Leaderboard graphs)  
- Git + GitHub  
- GitHub Pages hosting  

---

### Project Structure

```
/p22
│
├── global.css
│
├── app.js
├── api_constants.js
│
├── index.html
│
├── images/
│   ├── logo.png
│   ├── ball.png
│   ├── math1.png
│   ├── math2.png
│   ├── science1.png
│   ├── science2.png
│   ├── geo1.png
│   ├── geo2.png
│   ├── history1.png
│   ├── history2.png
│   ├── art1.png
│   ├── art2.png
│   ├── random1.png
│   └── random2.png
│
└── pages/
    ├── math.html
    ├── science.html
    ├── geography.html
    ├── history.html
    ├── art.html
    ├── flashcard.html
    ├── leaderboard.html
    ├── saved.html
    │
    ├── math.js
    ├── science.js
    ├── geography.js
    ├── history.js
    ├── art.js
    ├── leaderboard.js
    └── saved.js
```

---

### Future Plans

- Real login / user authentication system  
- Cloud database for quiz history  
- Multiplayer timed challenges  
- Daily quizzes and streak bonuses  
- Achievements, badges, and ranks  
- More subjects and mini-games  

---

### Project Goal

Smart Sausage aims to create an informal, curiosity-driven learning environment that users enjoy casually.  
It focuses on:
- Short, fun interactions  
- Discovery over memorization  
- Competition without pressure  
- A clean, modern interface  

The platform is designed to make knowledge feel lightweight, accessible, and enjoyable.

---
