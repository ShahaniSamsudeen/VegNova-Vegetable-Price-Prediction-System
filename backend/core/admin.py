from django.contrib import admin
from .models import Vegetable, Disease, PlantingGuide, Price
from .models import Pest
from .models import SmartPlanting


admin.site.register(Vegetable)
admin.site.register(Disease)
admin.site.register(PlantingGuide)
admin.site.register(Price)
 
admin.site.register(Pest)
admin.site.register(SmartPlanting)



