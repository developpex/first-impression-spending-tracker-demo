from django.db import models

# Create your models here.
# Create database class
class Transaction(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.CharField(max_length=255)
    category = models.CharField(max_length=50)

    # string that represents a transaction
    def __str__(self):
        return f"{self.date} - {self.category} - {self.description} - {self.amount}"



