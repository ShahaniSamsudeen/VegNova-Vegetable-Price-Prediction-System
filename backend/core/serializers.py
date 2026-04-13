from rest_framework import serializers
from .models import Vegetable, Disease, PlantingGuide, Price


class VegetableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vegetable
        fields = "__all__"


class DiseaseSerializer(serializers.ModelSerializer):
    vegetable_name = serializers.CharField(source="vegetable.name", read_only=True)

    class Meta:
        model = Disease
        fields = [
            "id",
            "vegetable_name",
            "disease_name",
            "image",
            "description",
            "cause",
            "symptoms",
            "solutions",
        ]


class PlantingGuideSerializer(serializers.ModelSerializer):
    vegetable_name = serializers.CharField(source="vegetable.name", read_only=True)

    class Meta:
        model = PlantingGuide
        fields = [
            "id",
            "vegetable_name",
            "planting_guide",
            "harvest_guide",
        ]


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = "__all__"


from .models import Pest

class PestSerializer(serializers.ModelSerializer):
    vegetable_name = serializers.CharField(source="vegetable.name", read_only=True)

    class Meta:
        model = Pest
        fields = [
            "id",
            "vegetable_name",
            "pest_name",
            "image",
            "cause",
            "symptoms",
            "management",
        ]
from rest_framework import serializers
from .models import SmartPlanting

class SmartPlantingSerializer(serializers.ModelSerializer):
    vegetable_name = serializers.CharField(
        source="vegetable.name", read_only=True
    )

    class Meta:
        model = SmartPlanting
        fields = [
            "vegetable_name",
            "plant_spacing_min_cm",
            "plant_spacing_max_cm",
            "row_spacing_min_cm",
            "row_spacing_max_cm",
            "notes",
        ]
