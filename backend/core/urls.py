from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    VegetableViewSet,
    DiseaseViewSet,
    PlantingGuideViewSet,
    PriceViewSet,
    PestViewSet,
    SmartPlantingViewSet,
    market_prices,
    forecast_range,
    chat_api,
    detect_tomatoes,
    monthly_prices,
)

# Router
router = DefaultRouter()
router.register(r"vegetables", VegetableViewSet)
router.register(r"diseases", DiseaseViewSet)
router.register(r"planting-guides", PlantingGuideViewSet)
router.register(r"prices", PriceViewSet)
router.register(r"pests", PestViewSet)
router.register(r"smart-planting", SmartPlantingViewSet)

# Final urlpatterns (ONLY ONE)
urlpatterns = [
    # API routes
    path("", include(router.urls)),

    # Custom endpoints
    path("market-prices/", market_prices, name="market-prices"),
    path("forecast/<str:vegetable>/range/", forecast_range),
    path("chat/", chat_api),

    # Tomato detection
    path("detect/", detect_tomatoes),
    path("monthly-prices/", monthly_prices),
]