from django.db import models


class Vegetable(models.Model):
    name = models.CharField(max_length=100, unique=True)
    info = models.TextField()
    benefits = models.TextField()

    def __str__(self):
        return self.name


class Disease(models.Model):
    vegetable = models.ForeignKey(
        Vegetable,
        on_delete=models.CASCADE,
        related_name="diseases"
    )
    disease_name = models.CharField(max_length=150)
    image = models.ImageField(upload_to="diseases/", blank=True, null=True)
    description = models.TextField(blank=True)
    cause = models.TextField(blank=True)
    symptoms = models.TextField()
    solutions = models.TextField()

    def __str__(self):
        return f"{self.disease_name} ({self.vegetable.name})"


class PlantingGuide(models.Model):
    vegetable = models.ForeignKey(
        Vegetable,
        on_delete=models.CASCADE,
        related_name="planting_guides"
    )
    planting_guide = models.TextField()
    harvest_guide = models.TextField()

    def __str__(self):
        return f"{self.vegetable.name} guide"


class Price(models.Model):
    vegetable = models.ForeignKey(
        Vegetable,
        on_delete=models.CASCADE,
        related_name="prices"
    )
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.vegetable.name} - {self.date}"
    
class Pest(models.Model):
    vegetable = models.ForeignKey(
        Vegetable,
        on_delete=models.CASCADE,
        related_name="pests"
    )
    pest_name = models.CharField(max_length=150)
    image = models.ImageField(upload_to="pests/", blank=True, null=True)
    cause = models.TextField()
    symptoms = models.TextField()
    management = models.TextField()

    def __str__(self):
        return f"{self.pest_name} ({self.vegetable.name})"

class SmartPlanting(models.Model):
    vegetable = models.OneToOneField(
        Vegetable,
        on_delete=models.CASCADE,
        related_name="smart_planting"
    )

   
     
    # Optional ranges
    plant_spacing_min_cm = models.PositiveIntegerField(
        null=True, blank=True
    )
    plant_spacing_max_cm = models.PositiveIntegerField(
        null=True, blank=True
    )

    row_spacing_min_cm = models.PositiveIntegerField(
        null=True, blank=True
    )
    row_spacing_max_cm = models.PositiveIntegerField(
        null=True, blank=True
    )

    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.vegetable.name} Smart Planting"
