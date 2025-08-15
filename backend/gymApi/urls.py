from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet , member_stats
from .auth_views import CookieTokenObtainPairView, CookieTokenRefreshView, HealthView

router = DefaultRouter()
router.register(r'members', MemberViewSet, basename='member')

urlpatterns = [
    path('', include(router.urls)),
    path('members/stats/', member_stats , name='member-stats'),
    path('auth/login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('health/', HealthView.as_view(), name='health-check'),
]