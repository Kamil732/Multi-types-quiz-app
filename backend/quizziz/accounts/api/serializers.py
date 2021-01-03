from django.utils.translation import gettext as _
from rest_framework import serializers

from accounts.models import Account


class AccountSerializer(serializers.ModelSerializer):
    def validate_picture(self, value):
        if not(value):
            return Account.DEFAULT_PROFILE_PICTURE
        return value

    class Meta:
        model = Account
        fields = ('email', 'username', 'picture', 'bio',)


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input_type': 'password'}
    )

    class Meta:
        model = Account
        fields = ('id', 'email', 'username', 'password', 'password2',)
        extra_kwargs = {
            'email': {
                'error_messages': {
                    'required': _('This field is required'),
                    'blank': _('This field cannot be blank'),
                }
            },
            'username': {
                'error_messages': {
                    'required': _('This field is required'),
                    'blank': _('This field cannot be blank'),
                }
            },
            'password': {
                'write_only': True,
                'error_messages': {
                    'required': _('This field is required'),
                    'blank': _('This field cannot be blank'),
                }
            },
            'password2': {
                'write_only': True,
                'error_messages': {
                    'required': _('This field is required'),
                    'blank': _('This field cannot be blank'),
                }
            },
        }

    def validate(self, data):
        password = data['password']
        password2 = data['password2']

        if not(password == password2):
            raise serializers.ValidationError(
                {'password': _('Passwords do not match')})

        return data

    def create(self, validated_data):
        email = validated_data['email']
        username = validated_data['username']
        password = validated_data['password']

        return Account.objects.create_user(email=email, username=username, password=password)
