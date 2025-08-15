from rest_framework import serializers
from .models import Member
from datetime import date

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    end_date = serializers.SerializerMethodField()

    def validate(self, data):
        # التحقق من أن تاريخ الانتهاء بعد تاريخ البداية
        if data.get('end_date') and data['end_date'] < data.get('start_date', date.today()):
            raise serializers.ValidationError("End date must be after start date")
        return data
    
    def get_created_at(self, obj):
        return obj.formatted_created_at() if obj.created_at else None

    def get_updated_at(self, obj):
        return obj.formatted_updated_at() if obj.updated_at else None
    
    def get_end_date(self, obj):
        return obj.end_date.isoformat() if obj.end_date else None