from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from gymApi.views import RegisterView
from django.urls import path


urlpatterns = [
    
    path('gymApi/auth/register/', RegisterView.as_view(), name='register'),
    path('gymApi/auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('gymApi/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]