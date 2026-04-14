from django.test import TestCase
from rest_framework.test import APIClient

class TestIntegration(TestCase):

    def setUp(self):
        self.client = APIClient()

    # 🍅 Tomato Detection (Frontend → Backend → Response)
    def test_tomato_detection_flow(self):
        response = self.client.post('/detect/')
        self.assertIn(response.status_code, [200, 400])

    # 💰 Market Prices (Frontend → API → Database)
    def test_market_price_flow(self):
        response = self.client.get(
            '/api/market-prices/?veg=Carrot&date=2024-07-01'
        )
        self.assertEqual(response.status_code, 200)

    # 🤖 Chat Assistant (Frontend → API → Response)
    def test_chat_flow(self):
        response = self.client.post(
            '/api/chat/',
            {"message": "tomato info"},
            format='json'
        )
        self.assertEqual(response.status_code, 200)

    # 🌱 Diseases (Frontend → API → Database)
    def test_disease_flow(self):
        response = self.client.get('/api/diseases/')
        self.assertEqual(response.status_code, 200)