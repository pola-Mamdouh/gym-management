from django.db import models
from datetime import date,timedelta , datetime
from .choices import MembershipType, MembershipStatus
from django.core.validators import RegexValidator


numeric_validator = RegexValidator(
    regex=r'^\d{8,15}$',
    message="Phone number must be between 8 and 15 digits "
)

class Member(models.Model):

    full_name = models.CharField(max_length = 50) 
    member_id= models.CharField(max_length =  10,unique = True) 
    email =  models.EmailField(null = True,blank=True) 
    phone= models.CharField(max_length = 15,validators= [numeric_validator], unique= True,null=True,blank=True)
    membership_type= models.CharField(max_length = 20,choices = MembershipType ) 
    status=  models.CharField(max_length = 20, choices= MembershipStatus,default='active')
    start_date= models.DateField( default = date.today )
    end_date= models.DateField(blank =True,null=True )
    notes =  models.CharField(null =True,blank=True , max_length= 200 )
    created_at= models.DateTimeField(auto_now_add = True) 
    updated_at= models.DateTimeField(auto_now = True)


    def formatted_created_at(self):
        return self.created_at.strftime("%Y-%m-%d %H:%M")
    
    def formatted_updated_at(self):
        return self.updated_at.strftime("%Y-%m-%d %H:%M")
    

    def save(self,*args, **kwargs):
        if not self.end_date:
            if self.membership_type == 'monthly':
                self.end_date = self.start_date + timedelta(days=30) 
            elif self.membership_type == 'quarterly':
                self.end_date = self.start_date + timedelta(days=90) 
            elif self.membership_type == 'annual':
                self.end_date = self.start_date + timedelta(days=365)
        super().save(*args,**kwargs) 

    def __str__(self):
        return f"{self.full_name} ({self.member_id})"

    class Meta():
        ordering = ['-created_at']


