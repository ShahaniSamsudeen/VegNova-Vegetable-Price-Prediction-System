 # =========================
# 1. IMPORT LIBRARIES
# =========================
import pandas as pd
import numpy as np
import os
from sklearn.metrics import mean_squared_error
from sklearn.linear_model import LinearRegression


# =========================
# 2. PATH CONFIGURATION
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "Leeks_complete_growth_dataset.xlsx"
)

OUTPUT_CSV = os.path.join(BASE_DIR, "leeks_price_forecast.csv")
OUTPUT_XLSX = os.path.join(BASE_DIR, "leeks_price_forecast.xlsx")


# =========================
# 3. LOAD DATA
# =========================
df = pd.read_excel(DATASET_PATH)

df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values("Date").reset_index(drop=True)


# =========================
# 4. CREATE LAG FEATURES
# =========================
df["min_lag_1"] = df["Leeks_Min_Price"].shift(1)
df["min_lag_3"] = df["Leeks_Min_Price"].shift(3)
df["min_lag_7"] = df["Leeks_Min_Price"].shift(7)

df["max_lag_1"] = df["Leeks_Max_Price"].shift(1)
df["max_lag_3"] = df["Leeks_Max_Price"].shift(3)
df["max_lag_7"] = df["Leeks_Max_Price"].shift(7)

feature_cols = [
    "Labour Cost",
    "Transportation Cost",
    "Fertilizer (Urea)",
    "Fertilizer(MOP)",
    "min_lag_1", "min_lag_3", "min_lag_7",
    "max_lag_1", "max_lag_3", "max_lag_7"
]

data = df[feature_cols + ["Leeks_Min_Price", "Leeks_Max_Price"]]
data = data.dropna().reset_index(drop=True)

X = data[feature_cols]
y_min = data["Leeks_Min_Price"]
y_max = data["Leeks_Max_Price"]


# =========================
# 5. TRAIN–TEST SPLIT
# =========================
split_index = int(len(data) * 0.8)

X_train, X_test = X.iloc[:split_index], X.iloc[split_index:]
y_min_train, y_min_test = y_min.iloc[:split_index], y_min.iloc[split_index:]
y_max_train, y_max_test = y_max.iloc[:split_index], y_max.iloc[split_index:]


# =========================
# 6. TRAIN MODELS
# =========================
lr_min = LinearRegression()
lr_max = LinearRegression()

lr_min.fit(X_train, y_min_train)
lr_max.fit(X_train, y_max_train)

rmse_min = np.sqrt(mean_squared_error(y_min_test, lr_min.predict(X_test)))
rmse_max = np.sqrt(mean_squared_error(y_max_test, lr_max.predict(X_test)))

print("RMSE Min:", round(rmse_min, 2))
print("RMSE Max:", round(rmse_max, 2))


# =========================
# 7. FUTURE FORECASTING (NEXT 30 DAYS)
# =========================
today = pd.Timestamp.today().normalize()

forecast_dates = pd.date_range(
    start=today,
    periods=30,
    freq="D"
)

last_row = df.iloc[-1]

min_lag_1 = last_row["Leeks_Min_Price"]
min_lag_3 = df.iloc[-3]["Leeks_Min_Price"]
min_lag_7 = df.iloc[-7]["Leeks_Min_Price"]

max_lag_1 = last_row["Leeks_Max_Price"]
max_lag_3 = df.iloc[-3]["Leeks_Max_Price"]
max_lag_7 = df.iloc[-7]["Leeks_Max_Price"]

predictions = []

for date in forecast_dates:

    X_pred = pd.DataFrame([{
        "Labour Cost": last_row["Labour Cost"],
        "Transportation Cost": last_row["Transportation Cost"],
        "Fertilizer (Urea)": last_row["Fertilizer (Urea)"],
        "Fertilizer(MOP)": last_row["Fertilizer(MOP)"],
        "min_lag_1": min_lag_1,
        "min_lag_3": min_lag_3,
        "min_lag_7": min_lag_7,
        "max_lag_1": max_lag_1,
        "max_lag_3": max_lag_3,
        "max_lag_7": max_lag_7
    }])

    pred_min = lr_min.predict(X_pred)[0]
    pred_max = lr_max.predict(X_pred)[0]

    min_low = round(pred_min - rmse_min, 1)
    min_high = round(pred_min + rmse_min, 1)

    max_low = round(pred_max - rmse_max, 1)
    max_high = round(pred_max + rmse_max, 1)

    if min_high >= max_low:
        min_high = max_low - 1

    predictions.append({
        "Date": date.strftime("%Y-%m-%d"),
        "Predicted_Min_Range": f"{min_low} - {min_high}",
        "Predicted_Max_Range": f"{max_low} - {max_high}",
        "Predicted_Avg": round((pred_min + pred_max) / 2, 2)
    })

    min_lag_7, min_lag_3, min_lag_1 = min_lag_3, min_lag_1, pred_min
    max_lag_7, max_lag_3, max_lag_1 = max_lag_3, max_lag_1, pred_max


forecast_df = pd.DataFrame(predictions)


# =========================
# 8. SAVE FORECAST
# =========================
forecast_df.to_csv(OUTPUT_CSV, index=False)
forecast_df.to_excel(OUTPUT_XLSX, index=False)

print("\n✅ Daily forecast generated successfully")
print(f"📄 CSV  → {OUTPUT_CSV}")
print(f"📊 XLSX → {OUTPUT_XLSX}")
