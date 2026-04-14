from django.test import TestCase
from core.models import (
    Vegetable, Disease, Pest, Price, PlantingGuide, SmartPlanting
)
from datetime import date


class TestModels(TestCase):

    def setUp(self):
        self.vegetable = Vegetable.objects.create(
            name="Carrot",
            info="Test info",
            benefits="Test benefits"
        )

    # 🥕 Vegetable
    def test_vegetable_creation(self):
        self.assertEqual(self.vegetable.name, "Carrot")

    # 🦠 Disease
    def test_disease_creation(self):
        disease = Disease.objects.create(
            vegetable=self.vegetable,
            disease_name="Leaf Spot",
            symptoms="Spots",
            solutions="Fungicide"
        )
        self.assertEqual(disease.disease_name, "Leaf Spot")

    # 🐛 Pest
    def test_pest_creation(self):
        pest = Pest.objects.create(
            vegetable=self.vegetable,
            pest_name="Aphids",
            cause="Insects",
            symptoms="Leaf damage",
            management="Pesticide"
        )
        self.assertEqual(pest.pest_name, "Aphids")

    # 💰 Price
    def test_price_creation(self):
        price = Price.objects.create(
            vegetable=self.vegetable,
            date=date.today(),
            price=100.50
        )
        self.assertEqual(price.price, 100.50)

    # 🌱 Planting Guide
    def test_planting_guide_creation(self):
        guide = PlantingGuide.objects.create(
            vegetable=self.vegetable,
            planting_guide="Plant in rows",
            harvest_guide="Harvest in 90 days"
        )
        self.assertEqual(guide.planting_guide, "Plant in rows")

    # 🤖 Smart Planting
    def test_smart_planting_creation(self):
        smart = SmartPlanting.objects.create(
            vegetable=self.vegetable,
            plant_spacing_min_cm=10,
            plant_spacing_max_cm=20,
            row_spacing_min_cm=30,
            row_spacing_max_cm=40,
            notes="Test notes"
        )
        self.assertEqual(smart.plant_spacing_min_cm, 10)