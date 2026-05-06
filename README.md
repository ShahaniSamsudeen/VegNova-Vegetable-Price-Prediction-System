
# 🌱 VegNova – Vegetable Price Prediction Driven Farmer Advisory System

VegNova is a web-based agricultural decision-support platform developed to support upcountry vegetable farmers in Sri Lanka in making informed and data-driven farming decisions.

The system was designed to address key agricultural challenges such as vegetable price volatility, inefficient crop planning, limited access to structured farming knowledge, and the lack of integrated digital agricultural tools. Unlike many existing solutions that focus on individual functionalities, VegNova combines market analysis, price prediction, planting planning, pest and disease information, AI-assisted support, and image-based tomato detection into a single unified platform.

The platform integrates machine learning, data analytics, computer vision, and interactive web technologies to assist farmers with crop planning, market understanding, and agricultural decision-making. A Linear Regression model enhanced with lag-based, weather-related, and cost-related features is used for 30-day vegetable price forecasting. The forecasting process incorporates a growth-window-based feature engineering approach, where weather conditions are aggregated according to the cultivation period of each vegetable to better reflect real agricultural behaviour. In addition, a YOLOv8 deep learning model is used for tomato detection and classification.

VegNova was developed as a full-stack application using React for the frontend, Django REST Framework for the backend, and Python-based machine learning and deep learning technologies for intelligent system functionalities.

---

# 🚀 Features

- 📈 30-Day Vegetable Price Forecasting (Weather & Cost-Based)
- 📅 Historical Market Price Analysis
- 📉 Market Trend Visualization
- 📊 Interactive Forecast Dashboard
- 🌿 Smart Planting Recommendation System
- 🪴 3D Planting Planner Visualization
- 🦠 Vegetable Disease Information
- 🐛 Pest Information Syst
- 🍅 YOLO-Based Tomato Detection
- 🤖 Agricultural Chat Assistant
 


---

# 🛠️ Technologies Used

## Frontend
- React.js
- React Router
- Recharts
- Framer Motion
- CSS

## Backend
- Django
- Django REST Framework (DRF)
- SQLite

## Machine Learning & AI
- Scikit-learn
- Pandas
- NumPy
- PyTorch
- YOLOv8
- OpenCV

## 3D Visualization
- Three.js
- React Three Fiber

## Development Tools
- Visual Studio Code
- Git & GitHub
- Figma (UI/UX Designs)

---

# 📂 Additional Resources

## Icons
- React Icons Library  
https://react-icons.github.io/react-icons/

## 3D Visualization
- React Three Fiber  
https://docs.pmnd.rs/react-three-fiber

- Three.js  
https://threejs.org/

## Machine Learning
- Scikit-learn  
https://scikit-learn.org/

- Ultralytics YOLOv8  
https://docs.ultralytics.com/

## Images
- Agricultural and background images sourced from Pinterest and free online resources.

---

# ⚙️ How to Run the Project

## Clone the Repository

```bash
git clone https://github.com/ShahaniSamsudeen/VegNova-Full.git
````

---

# 🔧 Backend Setup

## Navigate to backend folder

```bash
cd backend
```

## Create virtual environment

```bash
python -m venv venv
```

## Activate virtual environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Apply migrations

```bash
python manage.py migrate
```

## Load initial data

```bash
python manage.py loaddata data.json
```

## Run Django server

```bash
python manage.py runserver
```

Backend runs on:

```bash
http://127.0.0.1:8000/
```

---

# 💻 Frontend Setup

## Open a new terminal

```bash
cd frontend
```

## Install frontend dependencies

```bash
npm install
```

## Run frontend server

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173/
```

---

# 🎯 Project Objectives

* Improve agricultural decision-making
* Support farmers with market insights
* Provide data-driven crop planning tools
* Integrate prediction, planning, detection, and advisory features into one platform
* Enhance accessibility through an easy-to-use interface

---

# 👨‍💻 Author

**Shahani Samsudeen**
BSc (Hons) Data Science
Plymouth University / NSBM Green University

---

# 📄 License

This project was developed for academic and educational purposes.


```
