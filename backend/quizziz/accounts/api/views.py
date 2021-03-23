from django.contrib.auth import login
from django.utils.translation import gettext as _
from django.conf import settings

from quizziz.utils import validate_recaptcha

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.status import HTTP_201_CREATED

from rest_framework_simplejwt.tokens import RefreshToken

import requests
from requests.exceptions import HTTPError

from social_django.utils import load_strategy, load_backend
from social_core.backends.oauth import BaseOAuth2
from social_core.exceptions import MissingBackend, AuthTokenError, AuthForbidden

from quizzes.api.mixins import QuizListMixin
from accounts.api.serializers import AccountSerializer, UpdateCurrentAccountSettingsSerializer, RegisterSerializer, SocialSerializer

from quizzes.models import Quiz
from accounts.models import Account


class SocialLoginView(generics.GenericAPIView):
    """Log in using facebook"""
    serializer_class = SocialSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """Authenticate user through the provider and access_token"""
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        provider = serializer.data.get('provider', None)
        strategy = load_strategy(request)

        try:
            backend = load_backend(strategy=strategy, name=provider,
                                   redirect_uri=None)

        except MissingBackend:
            return Response({'error': 'Please provide a valid provider'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            if isinstance(backend, BaseOAuth2):
                access_token = serializer.data.get('access_token')
            user = backend.do_auth(access_token)
        except HTTPError as error:
            return Response({
                "error": "Invalid token",
                "details": str(error)
            }, status=status.HTTP_400_BAD_REQUEST)
        except AuthTokenError as error:
            return Response({
                "error": "Invalid credentials",
                "details": str(error)
            }, status=status.HTTP_400_BAD_REQUEST)
        except:
            if provider == 'facebook':
                return Response({
                    "error": "Please log in to your account with Google.",
                }, status=status.HTTP_400_BAD_REQUEST)
            elif provider == 'google-oauth2':
                return Response({
                    "error": "Error occurred while logging with Google, try again.",
                }, status=status.HTTP_400_BAD_REQUEST)

        try:
            authenticated_user = backend.do_auth(access_token, user=user)

        except HTTPError as error:
            return Response({
                "error": "invalid token",
                "details": str(error)
            }, status=status.HTTP_400_BAD_REQUEST)

        except AuthForbidden as error:
            return Response({
                "error": "invalid token",
                "details": str(error)
            }, status=status.HTTP_400_BAD_REQUEST)

        if authenticated_user and authenticated_user.is_active:
            # generate JWT token
            login(request, authenticated_user)

            token = RefreshToken.for_user(user)

            response = {
                "token": str(token.access_token),
                "refresh": str(token),
                "user": AccountSerializer(request.user).data,
            }
            return Response(status=status.HTTP_200_OK, data=response)


class SignupAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        validate_recaptcha(request.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(AccountSerializer(user, context=self.get_serializer_context()).data, status=HTTP_201_CREATED)


class AccountAPIView(generics.RetrieveAPIView):
    serializer_class = AccountSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'account_slug'
    queryset = Account.objects.all()


class AccountQuizzesAPIView(QuizListMixin, generics.ListAPIView):
    lookup_field = 'slug'
    lookup_url_kwarg = 'account_slug'

    def get_queryset(self):
        quizzes = Quiz.objects.filter(author__slug=self.kwargs.get(self.lookup_url_kwarg),
                                      is_published=True).order_by('-pub_date', '-solved_times')

        for quiz in quizzes:
            if not(quiz.questions.exists()):
                quizzes = quizzes.exclude(id=quiz.id)

        return quizzes


class CurrentAccountAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class UpdateCurrentAccountSettingsAPIView(generics.UpdateAPIView):
    serializer_class = UpdateCurrentAccountSettingsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        password = request.data['password']
        newPassword = request.data['newPassword']
        newPassword2 = request.data['newPassword2']

        if not(request.user.check_password(password)) and request.user.has_usable_password():
            raise ValidationError({'password': [_('Incorrect password')]})

        if newPassword or newPassword2:
            if not(newPassword == newPassword2):
                raise ValidationError({'newPassword': [_('Password do not match')]})

            request.user.set_password(newPassword)
            request.user.save()

        return super(UpdateCurrentAccountSettingsAPIView, self).update(request, *args, **kwargs)

    def get_object(self):
        return self.request.user


class CurrentAccountQuizzesAPIView(QuizListMixin, generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self, *args, **kwargs):
        return Quiz.objects.filter(author=self.request.user).order_by('-pub_date')
