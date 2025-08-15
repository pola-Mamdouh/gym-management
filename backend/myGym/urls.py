# gymApi/urls.py
from django.contrib import admin
from django.urls import path, include
from gymApi.auth_views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    HealthView
)
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('gymApi/', include('gymApi.urls')),
    
    # Authentication Endpoints
    path('gymApi/auth/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    
    # Health Check
    path('gymApi/health/', HealthView.as_view(), name='health-check'),
    
    # API Documentation
    path('gymApi/docs/', TemplateView.as_view(
        template_name='swagger-ui.html',
        extra_context={'schema_url': 'openapi-schema'}
    ), name='swagger-ui'),
    
    path('gymApi/openapi/', get_schema_view(
        title="Gym Management API",
        description="API for managing gym members",
        version="1.0.0"
    ), name='openapi-schema'),
]