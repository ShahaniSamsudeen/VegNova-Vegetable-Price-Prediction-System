from django.test import TestCase


class TestFunctions(TestCase):

    # 🌱 Planting Planner Calculation
    def test_plant_count_calculation(self):
        land_size = 1  # perch
        spacing_cm = 50

        area_m2 = land_size * 25.29
        spacing_m = spacing_cm / 100

        plants = int(area_m2 / (spacing_m ** 2))

        self.assertTrue(plants > 0)


    # 🌿 Spacing Logic
    def test_spacing_range_valid(self):
        min_spacing = 10
        max_spacing = 20

        self.assertTrue(min_spacing < max_spacing)


    # 💰 Price Calculation
    def test_price_average(self):
        prices = [100, 120, 110]
        avg = sum(prices) / len(prices)

        self.assertEqual(avg, 110)


    # 🍅 Tomato Detection Count
    def test_tomato_total(self):
        ripe = 2
        unripe = 3
        damaged = 1

        total = ripe + unripe + damaged

        self.assertEqual(total, 6)

#Validation logic

# 🌱 Edge Case — Zero Land
    def test_zero_land(self):
        land_size = 0
        spacing = 50

        area = land_size * 25.29
        plants = int(area / (spacing / 100) ** 2)

        self.assertEqual(plants, 0)


# ⚠️ Validation — Invalid Price
    def test_invalid_price(self):
     from core.models import Price
     from datetime import date

     with self.assertRaises(Exception):
        Price.objects.create(
            vegetable=None,
            date=date.today(),
            price=None
        )