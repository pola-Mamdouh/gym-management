# api/auth_views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class CookieTokenObtainPairView(TokenObtainPairView):
    # Login: returns access in body and sets refresh as HttpOnly cookie
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh = response.data.get('refresh')
        if refresh:
            response.set_cookie(
                key='refresh',
                value=refresh,
                httponly=True,
                samesite='Lax',
                secure=False  # True in production with HTTPS
            )
            response.data.pop('refresh', None)  # remove refresh from body
        return response

class CookieTokenRefreshView(APIView):
    # Use refresh cookie (or body) to return a new access token
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh') or request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'No refresh token'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
            return Response({'access': access})
        except TokenError:
            return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

# Simple health check
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class HealthView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({'status': 'ok'})
