 # =========================
# DJANGO & DRF IMPORTS
# =========================
from email.mime import message

from rest_framework import viewsets
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.conf import settings

from datetime import datetime
import pandas as pd
import os



from django.core.files.storage import default_storage


from detection.analyze import analyze_image   # 👈 IMPORTANT

# =========================
# MODELS & SERIALIZERS
# =========================
from .models import (
    Vegetable,
    Disease,
    PlantingGuide,
    Price,
    Pest,
    SmartPlanting,
)

from .serializers import (
    VegetableSerializer,
    DiseaseSerializer,
    PlantingGuideSerializer,
    PriceSerializer,
    PestSerializer,
    SmartPlantingSerializer,
)

# =========================
# VIEWSETS
# =========================

class VegetableViewSet(viewsets.ModelViewSet):
    queryset = Vegetable.objects.all()
    serializer_class = VegetableSerializer


class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

    def get_queryset(self):
        qs = Disease.objects.select_related("vegetable").all()
        vegetable = self.request.query_params.get("vegetable")
        if vegetable:
            qs = qs.filter(vegetable__name__iexact=vegetable)
        return qs


class PlantingGuideViewSet(viewsets.ModelViewSet):
    queryset = PlantingGuide.objects.select_related("vegetable").all()
    serializer_class = PlantingGuideSerializer


class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer


class PestViewSet(viewsets.ModelViewSet):
    queryset = Pest.objects.select_related("vegetable").all()
    serializer_class = PestSerializer


class SmartPlantingViewSet(ReadOnlyModelViewSet):
    queryset = SmartPlanting.objects.select_related("vegetable").all()
    serializer_class = SmartPlantingSerializer


# =========================
# SIMPLE LIST APIs
# =========================

@api_view(["GET"])
def planting_guides_api(request):
    guides = PlantingGuide.objects.select_related("vegetable").all()
    return Response(PlantingGuideSerializer(guides, many=True).data)


@api_view(["GET"])
def smart_planting_list(request):
    qs = SmartPlanting.objects.select_related("vegetable").all()
    return Response(SmartPlantingSerializer(qs, many=True).data)


# =========================
# MARKET PRICES (ULTRA ROBUST)
# =========================

@require_GET
def market_prices(request):
    veg = request.GET.get("veg")
    date_str = request.GET.get("date")

    if not veg or not date_str:
        return JsonResponse({"error": "veg and date are required"}, status=400)

    veg_clean = veg.strip().lower()

    BASE_DIR = settings.BASE_DIR.parent
    datasets_dir = os.path.join(BASE_DIR, "ml", "datasets")

    if not os.path.exists(datasets_dir):
        return JsonResponse({"error": "datasets folder not found"}, status=500)

    # -------------------------------------------------
    # FIND DATASET FILE (handles Radish/Raddish etc.)
    # -------------------------------------------------
    dataset_file = None
    for file in os.listdir(datasets_dir):
        fname = file.lower()
        if veg_clean in fname:
            dataset_file = file
            break
        if veg_clean == "radish" and "raddish" in fname:
            dataset_file = file
            break
         
    

    if not dataset_file:
        return JsonResponse({
            "error": f"No dataset found for vegetable '{veg}'",
            "available_files": os.listdir(datasets_dir)
        }, status=404)

    file_path = os.path.join(datasets_dir, dataset_file)

    # -------------------------------------------------
    # LOAD EXCEL
    # -------------------------------------------------
    df = pd.read_excel(file_path)

    # normalize column names VERY aggressively
    df.columns = [
        c.strip()
         .lower()
         .replace(" ", "_")
         .replace("-", "_")
        for c in df.columns
    ]

    # -------------------------------------------------
    # DETECT DATE COLUMN
    # -------------------------------------------------
    date_col = next((c for c in df.columns if "date" in c), None)
    if not date_col:
        return JsonResponse({
            "error": "Date column not found",
            "columns": list(df.columns)
        }, status=500)

    # -------------------------------------------------
    # DETECT PRICE COLUMNS (MIN / MAX / AVG)
    # -------------------------------------------------
    def veg_match(col):
        return (
            veg_clean in col
            or (veg_clean == "radish" and "raddish" in col)
        )

    min_col = next((c for c in df.columns if "min" in c and veg_match(c)), None)
    max_col = next((c for c in df.columns if "max" in c and veg_match(c)), None)
    avg_col = next((c for c in df.columns if "avg" in c and veg_match(c)), None)

    # if min/max missing but avg exists → use avg
    if not min_col or not max_col:
        if avg_col:
            min_col = avg_col
            max_col = avg_col
        else:
            return JsonResponse({
                "error": "Missing required columns",
                "detected_columns": list(df.columns),
                "expected_vegetable": veg
            }, status=500)

    # -------------------------------------------------
    # FILTER BY DATE
    # -------------------------------------------------
    df[date_col] = pd.to_datetime(df[date_col], errors="coerce").dt.date
    selected_date = datetime.strptime(date_str, "%Y-%m-%d").date()

    row = df[df[date_col] == selected_date]
    if row.empty:
        return JsonResponse({"error": "No data for selected date"}, status=404)

    # -------------------------------------------------
    # CLEAN PRICE VALUES
    # -------------------------------------------------
    def clean_price(val):
        if isinstance(val, str) and "-" in val:
            low, high = val.split("-")
            return float(low.strip()), float(high.strip())
        val = float(val)
        return val, val

    min_raw = row[min_col].values[0]
    max_raw = row[max_col].values[0]

    min_val, _ = clean_price(min_raw)
    _, max_val = clean_price(max_raw)
    avg_val = (min_val + max_val) / 2

    # -------------------------------------------------
    # RESPONSE
    # -------------------------------------------------
    return JsonResponse({
        "vegetable": veg,
        "date": date_str,
        "dataset_used": dataset_file,
        "min": round(min_val, 2),
        "max": round(max_val, 2),
        "avg": round(avg_val, 2),
    })

@require_GET
def monthly_prices(request):
    veg = request.GET.get("veg")
    month = request.GET.get("month")

    if not veg or not month:
        return JsonResponse({"error": "veg and month are required"}, status=400)

    veg_clean = veg.strip().lower()
    month = int(month)

    BASE_DIR = settings.BASE_DIR.parent
    datasets_dir = os.path.join(BASE_DIR, "ml", "datasets")

    dataset_file = None
    for file in os.listdir(datasets_dir):
        fname = file.lower()

        if veg_clean in fname:
            dataset_file = file
            break

        if veg_clean == "radish" and "raddish" in fname:
            dataset_file = file
            break

    if not dataset_file:
        return JsonResponse({"error": f"No dataset found for {veg}"}, status=404)

    file_path = os.path.join(datasets_dir, dataset_file)

    df = pd.read_excel(file_path)

    df.columns = [
        c.strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
        for c in df.columns
    ]

    date_col = next((c for c in df.columns if "date" in c), None)

    if not date_col:
        return JsonResponse({"error": "Date column not found"}, status=500)

    def veg_match(col):
        return (
            veg_clean in col
            or (veg_clean == "radish" and "raddish" in col)
        )

    min_col = next((c for c in df.columns if "min" in c and veg_match(c)), None)
    max_col = next((c for c in df.columns if "max" in c and veg_match(c)), None)

    if not min_col or not max_col:
        return JsonResponse({"error": "Price columns not found"}, status=500)

    df[date_col] = pd.to_datetime(df[date_col], errors="coerce")

    df = df[df[date_col].dt.month == month]

    years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]

    result = []

    for day in range(1, 32):

        row_data = {"day": day}

        for year in years:

            row = df[
                (df[date_col].dt.year == year)
                & (df[date_col].dt.day == day)
            ]

            if not row.empty:

                min_val = float(row[min_col].values[0])
                max_val = float(row[max_col].values[0])

                avg_val = round((min_val + max_val) / 2, 2)

                row_data[f"y{year}"] = avg_val

            else:
                row_data[f"y{year}"] = None

        result.append(row_data)

    return JsonResponse(result, safe=False)
@api_view(["GET"])
def forecast_range(request, vegetable):
    """
    Dynamic forecast generator.
    Trains model and generates fresh 30-day forecast automatically.
    """

    BASE_DIR = settings.BASE_DIR.parent
    datasets_dir = os.path.join(BASE_DIR, "ml", "datasets")

    veg_clean = vegetable.lower()

    # Find matching dataset
    dataset_file = None
    for file in os.listdir(datasets_dir):
        if veg_clean in file.lower():
            dataset_file = file
            break

    if not dataset_file:
        return Response({"error": f"No dataset found for '{vegetable}'"}, status=404)

    file_path = os.path.join(datasets_dir, dataset_file)

    # Load dataset
    df = pd.read_excel(file_path)

    df.columns = (
        df.columns
        .str.strip()
        .str.replace(" ", "_")
    )

    df["Date"] = pd.to_datetime(df["Date"])
    df = df[df["Date"] <= "2024-12-31"]
    df = df.sort_values("Date").reset_index(drop=True)

    # Detect price columns
    min_col = next((c for c in df.columns if "min" in c.lower() and veg_clean in c.lower()), None)
    max_col = next((c for c in df.columns if "max" in c.lower() and veg_clean in c.lower()), None)

    if not min_col or not max_col:
        return Response({"error": "Price columns not found"}, status=500)

    # Create lag features
    df["min_lag_1"] = df[min_col].shift(1)
    df["min_lag_3"] = df[min_col].shift(3)
    df["min_lag_7"] = df[min_col].shift(7)

    df["max_lag_1"] = df[max_col].shift(1)
    df["max_lag_3"] = df[max_col].shift(3)
    df["max_lag_7"] = df[max_col].shift(7)

    feature_cols = [
        "Labour_Cost",
        "Transportation_Cost",
        "Fertilizer_(Urea)",
        "Fertilizer(MOP)",
        "min_lag_1", "min_lag_3", "min_lag_7",
        "max_lag_1", "max_lag_3", "max_lag_7"
    ]

    feature_cols = [c for c in feature_cols if c in df.columns]

    data = df[feature_cols + [min_col, max_col]].dropna()

    from sklearn.linear_model import LinearRegression
    from sklearn.metrics import mean_squared_error
    import numpy as np

    X = data[feature_cols]
    y_min = data[min_col]
    y_max = data[max_col]

    split_index = int(len(data) * 0.8)

    X_train = X.iloc[:split_index]
    X_test = X.iloc[split_index:]

    y_min_train = y_min.iloc[:split_index]
    y_min_test = y_min.iloc[split_index:]

    y_max_train = y_max.iloc[:split_index]
    y_max_test = y_max.iloc[split_index:]

    lr_min = LinearRegression()
    lr_max = LinearRegression()

    lr_min.fit(X_train, y_min_train)
    lr_max.fit(X_train, y_max_train)

    rmse_min = np.sqrt(mean_squared_error(y_min_test, lr_min.predict(X_test)))
    rmse_max = np.sqrt(mean_squared_error(y_max_test, lr_max.predict(X_test)))

    # Always start from tomorrow
    today = pd.Timestamp.today().normalize()

    forecast_dates = pd.date_range(
        start=today + pd.Timedelta(days=1),
        periods=30,
        freq="D"
    )

    last_row = df.iloc[-1]

    min_lag_1 = last_row[min_col]
    min_lag_3 = df.iloc[-3][min_col]
    min_lag_7 = df.iloc[-7][min_col]

    max_lag_1 = last_row[max_col]
    max_lag_3 = df.iloc[-3][max_col]
    max_lag_7 = df.iloc[-7][max_col]

    predictions = []

    for date in forecast_dates:

        X_pred = pd.DataFrame([{
            **{col: last_row[col] for col in feature_cols if col in last_row},
            "min_lag_1": min_lag_1,
            "min_lag_3": min_lag_3,
            "min_lag_7": min_lag_7,
            "max_lag_1": max_lag_1,
            "max_lag_3": max_lag_3,
            "max_lag_7": max_lag_7
        }])

        pred_min = lr_min.predict(X_pred)[0]
        pred_max = lr_max.predict(X_pred)[0]

        predictions.append({
            "Date": date.strftime("%Y-%m-%d"),
            "Predicted_Min_Range": f"{round(pred_min - rmse_min,1)} - {round(pred_min + rmse_min,1)}",
            "Predicted_Max_Range": f"{round(pred_max - rmse_max,1)} - {round(pred_max + rmse_max,1)}",
            "Predicted_Avg": round((pred_min + pred_max) / 2, 2)
        })

        min_lag_7, min_lag_3, min_lag_1 = min_lag_3, min_lag_1, pred_min
        max_lag_7, max_lag_3, max_lag_1 = max_lag_3, max_lag_1, pred_max

    return Response(predictions)

from django.views.decorators.csrf import csrf_exempt
import json

from rapidfuzz import process
from django.conf import settings
import os
import pandas as pd
from datetime import datetime


@api_view(["POST"])
def chat_api(request):

    message = request.data.get("message", "").lower().strip()

    # ==================================
    # GREETING
    # ==================================
    if any(word in message for word in ["hi", "hello", "hey", "good morning", "good evening"]):
        return Response({
            "reply": "👋 Hello! I'm VegNova Assistant.\n"
                     "You can ask me about:\n"
                     "- Vegetable info\n"
                     "- Planting guides\n"
                     "- Vegetable prices\n"
                     "- Price forecasts\n"
                     "- Pests\n"
                     "- Diseases\n"
                     "- What should I plant?"
        })

    # ==================================
    # SMART PLANTING RECOMMENDATION
    # ==================================
    if any(word in message for word in [
        "what should i plant",
        "which is better",
        "best crop",
        "carrot or beans",
        "better to plant"
    ]):

        try:
            BASE_DIR = settings.BASE_DIR.parent
            veg_options = ["carrot", "beans"]

            forecast_data = {}

            for veg in veg_options:
                csv_path = os.path.join(BASE_DIR, "ml", f"{veg}_price_forecast.csv")

                if os.path.exists(csv_path):
                    df = pd.read_csv(csv_path)

                    if "Predicted_Avg" in df.columns:
                        avg_price = df.head(7)["Predicted_Avg"].mean()
                        forecast_data[veg] = avg_price

            if len(forecast_data) < 2:
                return Response({"reply": "Forecast data not available for comparison."})

            best_crop = max(forecast_data, key=forecast_data.get)

            carrot_avg = round(forecast_data.get("carrot", 0), 2)
            beans_avg = round(forecast_data.get("beans", 0), 2)

            reply = (
                f"📊 Upcoming 7-day average forecast:\n"
                f"- Carrot: Rs {carrot_avg}\n"
                f"- Beans: Rs {beans_avg}\n\n"
                f"🌱 Based on forecast prices, planting {best_crop.title()} "
                f"may give better market returns."
            )

            return Response({"reply": reply})

        except Exception as e:
            print("Smart recommendation error:", e)
            return Response({"reply": "⚠️ Unable to generate recommendation."})

    # ==================================
    # FUZZY VEGETABLE MATCHING
    # ==================================
    from rapidfuzz import process

    vegetables = [
    "carrot",
    "beans",
    "leeks",
    "leek",
    "tomato",
    "knolkhol",
    "cabbage",
    "radish",
    "raddish",
    "beetroot"
]

    veg_found = None
    match = process.extractOne(message, vegetables)

    if match and match[1] > 70:
        veg_found = match[0]

    if not veg_found:
        return Response({
            "reply": "🥕 Please mention a vegetable (e.g., carrot, beans, tomato)."
        })

    # ==================================
    # VEGETABLE INFO
    # ==================================
    if any(word in message for word in ["info", "about", "benefit"]):

        veg = Vegetable.objects.filter(name__iexact=veg_found).first()

        if not veg:
            return Response({"reply": "No information found."})

        reply = (
            f"🌱 {veg.name} Information:\n\n"
            f"{veg.info}\n\n"
            f"💚 Benefits:\n{veg.benefits}"
        )

        return Response({"reply": reply})

    # ==================================
    # PLANTING + HARVEST GUIDE
    # ==================================
    if any(word in message for word in ["plant", "grow", "planting guide", "harvest"]):

        guide = PlantingGuide.objects.filter(
            vegetable__name__iexact=veg_found
        ).first()

        if not guide:
            return Response({"reply": "No planting guide found."})

        reply = (
            f"🌿 Planting Guide for {veg_found.title()}:\n\n"
            f"{guide.planting_guide}\n\n"
            f"🌾 Harvest Guide:\n{guide.harvest_guide}"
        )

        return Response({"reply": reply})

    # ==================================
    # FORECAST QUERY (NEW ADDED)
    # ==================================
    if any(word in message for word in ["forecast", "predict", "upcoming"]):

        try:
            BASE_DIR = settings.BASE_DIR.parent
            csv_path = os.path.join(BASE_DIR, "ml", f"{veg_found}_price_forecast.csv")

            if not os.path.exists(csv_path):
                return Response({"reply": "Forecast file not found."})

            df = pd.read_csv(csv_path)

            if "Predicted_Avg" not in df.columns:
                return Response({"reply": "Forecast data format error."})

            avg_price = round(df.head(7)["Predicted_Avg"].mean(), 2)

            reply = (
                f"📈 {veg_found.title()} Upcoming 7-day average forecast:\n"
                f"Average Price: Rs {avg_price}"
            )

            return Response({"reply": reply})

        except Exception as e:
            print("Forecast error:", e)
            return Response({"reply": "⚠️ Forecast system error."})

    # ==================================
    # PEST QUERY
    # ==================================
    if any(word in message for word in ["pest", "insect", "bug", "attack"]):

        pests = Pest.objects.filter(vegetable__name__iexact=veg_found)

        if not pests.exists():
            return Response({"reply": f"No pest data found for {veg_found}."})

        pest_list = "\n".join([f"- {p.pest_name}" for p in pests[:5]])

        return Response({
            "reply": f"🐛 Common pests affecting {veg_found.title()}:\n{pest_list}"
        })

    # ==================================
    # DISEASE QUERY
    # ==================================
    if any(word in message for word in ["disease", "infection", "fungus", "virus"]):

        diseases = Disease.objects.filter(vegetable__name__iexact=veg_found)

        if not diseases.exists():
            return Response({"reply": f"No disease data found for {veg_found}."})

        disease_list = "\n".join([f"- {d.disease_name}" for d in diseases[:5]])

        return Response({
            "reply": f"🦠 Common diseases affecting {veg_found.title()}:\n{disease_list}"
        })
    # ==================================
# 🔥  # 🔥 FULL MONTH PRICE
    if "price-month" in message:

        try:
            parts = message.split()
            veg = parts[0]
            month = parts[-1]   # format: 2023-01

            BASE_DIR = settings.BASE_DIR.parent
            datasets_dir = os.path.join(BASE_DIR, "ml", "datasets")

            dataset_file = None
            for file in os.listdir(datasets_dir):
                if veg in file.lower():
                    dataset_file = file
                    break

            if not dataset_file:
                return Response({"reply": "Dataset file not found."})

            file_path = os.path.join(datasets_dir, dataset_file)
            df = pd.read_excel(file_path)

            df.columns = (
                df.columns
                .str.strip()
                .str.lower()
                .str.replace(" ", "_")
            )

            date_col = next((c for c in df.columns if "date" in c), None)

            if not date_col:
                return Response({"reply": "Date column not found."})

        # 🔥 IMPORTANT FIX HERE
            df["month"] = pd.to_datetime(df[date_col]).dt.strftime("%Y-%m")

            df_month = df[df["month"] == month]

            if df_month.empty:
                return Response({"reply": f"No data for {month}."})

             # ✅ SMART COLUMN DETECTION (SAFE)
            min_col = next(
                (c for c in df.columns if "min" in c and veg in c),
                next((c for c in df.columns if "min" in c), None)
            )

            max_col = next(
                (c for c in df.columns if "max" in c and veg in c),
                next((c for c in df.columns if "max" in c), None)
            )

            if not min_col or not max_col:
                return Response({"reply": "Price columns not found."})

            reply = f"📊 {veg.title()} Prices for {month}:\n\n"

            for _, row in df_month.iterrows():
                date_full = pd.to_datetime(row[date_col]).strftime("%Y-%m-%d")
                min_price = row[min_col]
                max_price = row[max_col]
                avg_price = (float(min_price) + float(max_price)) / 2

                reply += f"{date_full} → Rs {round(avg_price,2)}\n"

            return Response({"reply": reply})

        except Exception as e:
            print("Month price error:", e)
            return Response({"reply": "⚠️ Monthly price error."})
    # ==================================
    # PRICE QUERY (SMART DATE DETECTION)
    # ==================================
    elif any(word in message for word in ["price", "cost", "rate", "market"]):

        try:
            from dateutil import parser

            try:
                parsed_date = parser.parse(message, fuzzy=True)
                selected_date = parsed_date.strftime("%Y-%m-%d")
            except:
                selected_date = datetime.today().strftime("%Y-%m-%d")

            BASE_DIR = settings.BASE_DIR.parent
            datasets_dir = os.path.join(BASE_DIR, "ml", "datasets")

            dataset_file = None
            for file in os.listdir(datasets_dir):
                if veg_found in file.lower():
                    dataset_file = file
                    break

            if not dataset_file:
                return Response({"reply": "Dataset file not found."})

            file_path = os.path.join(datasets_dir, dataset_file)
            df = pd.read_excel(file_path)

            df.columns = (
                df.columns
                .str.strip()
                .str.lower()
                .str.replace(" ", "_")
            )

            date_col = next((c for c in df.columns if "date" in c), None)

            if not date_col:
                return Response({"reply": "Date column not found."})

            df[date_col] = pd.to_datetime(df[date_col]).dt.strftime("%Y-%m-%d")

            row = df[df[date_col] == selected_date]

            if row.empty:
                return Response({
                    "reply": f"No price data found for {selected_date}."
                })

             # ✅ SMART COLUMN DETECTION (SAFE)
            min_col = next(
                (c for c in df.columns if "min" in c and veg_found in c),
                next((c for c in df.columns if "min" in c), None)
            )

            max_col = next(
            (c for c in df.columns if "max" in c and veg_found in c),
            next((c for c in df.columns if "max" in c), None)
            )

            if not min_col or not max_col:
                return Response({"reply": "Price columns not found in dataset."})

            min_price = row[min_col].values[0]
            max_price = row[max_col].values[0]
            avg_price = (float(min_price) + float(max_price)) / 2

            reply = (
                f"📊 {veg_found.title()} price on {selected_date}:\n"
                f"Min: Rs {min_price}\n"
                f"Max: Rs {max_price}\n"
                f"Avg: Rs {round(avg_price, 2)}"
            )

            return Response({"reply": reply})

        except Exception as e:
            print("Price error:", e)
            return Response({"reply": "⚠️ Price system error."})

    # ==================================
    # FALLBACK
    # ==================================
    return Response({
        "reply": "🤔 I'm not sure what you mean.\n"
                 "Try asking:\n"
                 "- What should I plant now?\n"
                 "- Tomato forecast\n"
                 "- Tomato info\n"
                 "- Carrot price 2023-04-01\n"
                 "- Beans pests"
    })
@api_view(['POST'])
def detect_tomatoes(request):
    if 'image' not in request.FILES:
        return Response({"error": "No image provided"}, status=400)

    image_file = request.FILES['image']

    file_path = default_storage.save("temp.jpg", image_file)
    full_path = os.path.join(settings.MEDIA_ROOT, file_path)

    result = analyze_image(full_path)

    if os.path.exists(full_path):
        os.remove(full_path)

    return Response(result)