from django.test import TestCase
from rest_framework.test import APIClient


class TestAPI(TestCase):

    def setUp(self):
        self.client = APIClient()

    #  Diseases API
    def test_diseases_api(self):
        response = self.client.get('/api/diseases/')
        self.assertEqual(response.status_code, 200)

    # Chat API
    def test_chat_api(self):
        response = self.client.post(
            '/api/chat/',
            {"message": "tomato info"},
            format='json'
        )
        self.assertEqual(response.status_code, 200)

    #  Market Prices API
    def test_market_prices_api(self):
        response = self.client.get(
            '/api/market-prices/?veg=Carrot&date=2024-07-01'
        )
        self.assertEqual(response.status_code, 200)

    #  Tomato Detection API
    def test_tomato_detection_api(self):
        response = self.client.post('/detect/')
        self.assertIn(response.status_code, [200, 400])