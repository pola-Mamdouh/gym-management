from django.http import JsonResponse
from rest_framework import viewsets , status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action  , api_view
from django.views.decorators.csrf import csrf_exempt
from .models import Member
from .serializers import MemberSerializer
import logging
from django.db.models import Count, Q


logger = logging.getLogger(__name__)


class MemberViewSet(viewsets.ModelViewSet):

    @csrf_exempt
    def stats_view(request):
        data = {"message": "Success"}
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "http://192.168.1.2:3000"
        response["Access-Control-Allow-Credentials"] = "true"
        return response
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [AllowAny]
    pagination_class = None  

    
    def list(self, request):
        logger.info("QuerySet: %s", self.get_queryset().query)
        return super().list(request)
    
    # Custom Action لتفعيل/تعليق العضو
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        member = self.get_object()
        member.status = 'suspended' if member.status == 'active' else 'active'
        member.save()
        return Response({'status': member.status})

    # Override دالة الحذف لتحسين الاستجابة
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'detail': 'Member deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['GET'])
def member_stats(request):
    stats = {
        'total_members': Member.objects.count(),
        'active_members': Member.objects.filter(status='active').count(),
        'expired_members': Member.objects.filter(status='expired').count(),
        'members_by_type': list(Member.objects
            .values('membership_type')
            .annotate(count=Count('id'))
            .order_by('-count'))
    }
    return Response(stats)

@api_view(['GET'])
def members_list(request):
    members = Member.objects.all()
    serializer = MemberSerializer(members, many=True)
    return Response(serializer.data)