import datetime
import decimal
import traceback
import csv

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

# import the models from the database
from .models import Transaction

# Create your views here.
def index(request):
    return render(request, 'index.html')

# functions that handle the api logic
@csrf_exempt
def upload_csv(request):
    if request.method == 'POST' and request.FILES.get('csv_file'):
        try:
            csv_file = request.FILES['csv_file']
            decoded_file = csv_file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)

            transactions = []
            for row in reader:
                transactions.append(
                    Transaction(
                        amount=decimal.Decimal(row['amount']),
                        date=datetime.datetime.strptime(row['date'], "%Y-%m-%d").date(),
                        description=row['description'],
                        category=row['category']
                    )
                )

            Transaction.objects.bulk_create(transactions)
            return JsonResponse({'message': 'CSV file uploaded successfully'})
        except Exception as e:
            print("Error in upload_csv:", e)
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)

    return HttpResponse(status=400)


@csrf_exempt
def delete_all_transactions(request):
    if request.method == "DELETE":
        deleted_count, _ = Transaction.objects.all().delete()
        return JsonResponse({"message": f"Deleted {deleted_count} transactions"}, status=200)

    return JsonResponse({"error": "Invalid request method"}, status=400)

def get_monthly_spending(request):
    # Query all transactions
    monthly_spending = Transaction.objects.all()

    # Convert QuerySet to a list of dictionaries
    data = [
        {
            "date": transaction.date.strftime("%Y-%m-%d"),
            "category": transaction.category,
            "description": transaction.description,
            "amount": float(transaction.amount)
        }
        for transaction in monthly_spending
    ]

    return JsonResponse(data, safe=False)

