# Django Setup Guide
---

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

### Create the Backend Project
```powershell
django-admin startproject <backend>
```

### Create an App
Change directory to the backend folder and run:
```powershell
python manage.py startapp server
```

### Register the App
In my `settings.py`, add the app to `INSTALLED_APPS`:
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

### Update `settings.py` for CORS
Add `corsheaders` to my installed apps and configure middleware:
```python
INSTALLED_APPS = [
    'corsheaders',
]

MIDDLEWARE = [ 
    # Place above CommonMiddleware
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

```powershell
create frontend
```

---

## 5. Run the Server

To start the Django development server:
```powershell
python manage.py runserver
```

---

## 6. Database Migrations

### Create Migrations
Whenever I add new models, run:
```powershell
python manage.py makemigrations
```

### Apply Migrations to the Database
```powershell
python manage.py migrate
```

---

## 7. Merge Frontend into Backend

### Build the Frontend
```powershell
npm run build
```

### Integrate the Frontend HTML
- **Copy the HTML File:**  
  Copy `dist/index.html` into the templates folder:
  ```powershell
  dist/index.html to <backend>/templates/index.html
  ```

### Set Up Static Files
- **Create the Static Folder:**  
  ```powershell
  create static folder in <backend>/static
  ```
- **Copy Assets:**  
  ```powershell
  copy the dist/assets folder into the static folder
  ```

### Update `index.html` with Asset Paths
Edit the `index.html` file in my templates folder to reference the static assets:
```html
    {% load static %}
    <script type="module" crossorigin src="{% static 'assets/<index-#####.js>' %}"></script>
    <link rel="stylesheet" crossorigin href="{% static 'assets/<index-#####.css>' %}">
```

### Update Static Files Settings in `settings.py`
```python
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),  # Update if using a different path
]
```

### Update CORS Settings for the New Server
```python
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:8000",  
]
```

---

## 8. Host on a VPS

### Collect Static Files
```powershell
python manage.py collectstatic
```

### Freeze Requirements
Activate the virtual environment (if not already active) and run:
```powershell
cd <venv>
<venv>\Scripts\Activate (if not running)
pip3 freeze > requirements.txt
```

### Verify `requirements.txt`
Ensure that `requirements.txt` is located in the backend folder.

### VPS Setup (Hostinger)

- **Access the Hostinger Dashboard**
- **Install OpenLiteSpeed and Django**

#### OpenLiteSpeed Setup
- **Access in Browser:**  
  Open `<ip>:7080`
- **Check Port Status:**  
  ```ssh
  sudo ufw status
  ```
- **Allow Port if Necessary:**  
  ```ssh
  sudo ufw allow 7080/tcp
  ```

#### Retrieve Admin Password
In root directory `cd ../..`
```ssh
cat .litespeed_password
```

#### Deploy Files to the Server
Copy backend project into html directory:
```ssh
cd usr/local/lsws/<host>/html
```

#### Activate the Virtual Host Environment
```ssh
source /usr/local/lsws/<host>/html/bin/activate
```

#### Install Python Requirements
```ssh
pip install -r requirements.txt
```

---

## 9. Configure OpenLiteSpeed

### Configure Virtual Hosts

#### Edit App Server Settings

Set the following options in my OpenLiteSpeed App Server configuration:

- **Location:** `/usr/local/lsws/<Host>/html/<Backend>/`
- **Startup File:** `<Backend>/wsgi.py`
- **Environment:** `PYTHONPATH=/usr/local/lsws/<host>/html/lib/python3.12:/usr/local/lsws/<host>/html/<backend>`
- **LS_PYTHONBIN:** `/usr/local/lsws/<host>/html/bin/python`

Then click **save**.

#### Edit Static File Settings

Configure the static files settings by providing these details:

- **URI:** `/static/`
- **Location:** `/usr/local/lsws/Example/html/<backend>/staticfiles`

Then click **save**.

### Configure Listeners

#### Edit Default Listener Settings

For the default listener, use the following configuration:

- **Virtual Host:** `<host>`
- **Domain:** `<domain>`

Then click **save**.

---

## 10. Set Permissions

#### Give LiteSpeed Ownership

Change the owner to the user OpenLiteSpeed runs as (typically `nobody`):
```ssh
sudo chown -R nobody:nogroup /usr/local/lsws/<host>/html/<backend>
```

#### Set Directory Permissions
```ssh
sudo chmod -R 755 /usr/local/lsws/<host>/html/<backend>
```

#### (Optional) Adjust Database File Permissions
```ssh
sudo chmod 664 /usr/local/lsws/<host>/html/<backend>/db.sqlite3
```
