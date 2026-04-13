import os
from ultralytics import YOLO
import torch
from torchvision import transforms, models
from PIL import Image
import torch.nn as nn
import numpy as np
from django.conf import settings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ----------------------
# Load Detection Model
# ----------------------
detect_model = YOLO(os.path.join(BASE_DIR, "model.pt"))

# ----------------------
# Load Classification Model
# ----------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class_model = models.resnet18(weights=None)
class_model.fc = nn.Linear(class_model.fc.in_features, 3)

class_model.load_state_dict(
    torch.load(
        os.path.join(BASE_DIR, "classification_model", "tomato_classifier.pth"),
        map_location=device
    )
)

class_model = class_model.to(device)
class_model.eval()

class_names = ['Damaged', 'Ripe', 'Unripe']

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# ----------------------
# MAIN FUNCTION
# ----------------------
def analyze_image(image_path):

    results = detect_model(image_path, conf=0.5, iou=0.6)
    boxes = results[0].boxes

    if boxes is None or len(boxes) == 0:
        return {
            "total": 0,
            "ripe": 0,
            "unripe": 0,
            "damaged": 0
        }

    orig_image = Image.open(image_path).convert("RGB")

    counts = {
        "Damaged": 0,
        "Ripe": 0,
        "Unripe": 0
    }

    total = 0

    for box in boxes:

        # Count EVERY detection (same as old project)
        total += 1

        x1, y1, x2, y2 = map(int, box.xyxy[0])

        # Expand crop
        pad = 10
        x1 = max(0, x1 - pad)
        y1 = max(0, y1 - pad)
        x2 = x2 + pad
        y2 = y2 + pad

        crop = orig_image.crop((x1, y1, x2, y2))
        crop_tensor = transform(crop).unsqueeze(0).to(device)

        # Classification
        with torch.no_grad():
            outputs = class_model(crop_tensor)
            probs = torch.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probs, 1)

        conf_value = confidence.item()
        predicted_class = class_names[predicted.item()]

        # 🍅 COLOR FIX (CRITICAL)
        crop_np = np.array(crop)
        red = crop_np[:, :, 0].mean()
        green = crop_np[:, :, 1].mean()

        if red > green + 20:
            predicted_class = "Ripe"

        # 🔥 DAMAGE CONTROL
        if predicted_class == "Damaged" and conf_value < 0.8:
            predicted_class = "Unripe"

        # ⚠️ LOW CONFIDENCE FALLBACK
        if conf_value < 0.3:
            predicted_class = "Unripe"

        counts[predicted_class] += 1

    return {
        "total": total,
        "ripe": counts["Ripe"],
        "unripe": counts["Unripe"],
        "damaged": counts["Damaged"]
    }