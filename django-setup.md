# Django Setup Guide (PowerShell)

## 1. Setup Virtual Environment

### Create Virtual Environment
```powershell
python -m venv <venv>
```

### Activate Virtual Environment
```powershell
<venv>\Scripts\Activate
```

### Install Django
```powershell
pip install django
```

---

## 2. Create Django Project

### Create Backend
```powershell
django-admin startproject backend
```

### Create an App
```powershell
cd backend
python manage.py startapp server
```

### Register the App in `settings.py`
```python
INSTALLED_APPS = [
    'server',
]
```

---

## 3. Configure CORS

### Install CORS Headers
```powershell
pip install django-cors-headers
```

### Add CORS to `settings.py`
```python
INSTALLED_APPS = [
    'corsheaders',
]

MIDDLEWARE = [ 
    #above ComonMiddleware
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  
]

ALLOWED_HOSTS = ['*']
```

---

## 4. Create Frontend
(Assuming React as frontend framework)
```powershell
create frontend
```

---

## 5. Run the Server
```powershell
python manage.py runserver
```

---

## 6. Database Migrations

### Create Migrations (When New Models Are Added)
```powershell
python manage.py makemigrations
```

### Apply Migrations to Database
```powershell
python manage.py migrate
```

---

## 7. Merge frontend into backend

### Build frontend
```powershell
npm run build
```

### Copy html file into templates foler
```powershell
dist/index.html to <venv>/templates/index.html
```

### Copy html file into templates foler
```powershell
dist/index.html to <venv>/templates/index.html
```

### Create static folder
```powershell
create static folder in <venv>/static
```

### Create static folder
```powershell
copy the dist/assets folder into the static folder
```

### Change the index.html in the template folder to include the new paths to the assets
```powershell
    {% load static %}
    <script type="module" crossorigin src="{% static 'assets/<index-#####.js>' %}"></script>
    <link rel="stylesheet" crossorigin href="{% static 'assets/<index-#####.css>' %}">
```

### Add Static folder to `settings.py`
```python
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),  # Update if using a different path
]

```

### update CORS in `settings.py` to accept new server
```python
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:8000",  
]

```

## 7. Host to VPS

### Collect static files
```powershell
python manage.py collectstatic
```

### Freeze requirements
```powershell
cd <venv>
<venv>\Scripts\Activate (if not running)
pip3 freeze > requirements.txt
```
