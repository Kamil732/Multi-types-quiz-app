from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED

from quizzes.api.views import QuizListAPIView
from accounts.api.serializers import AccountSerializer, RegisterSerializer

from quizzes.models import Quiz
from accounts.models import Account


class SignupView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(AccountSerializer(user, context=self.get_serializer_context()).data, status=HTTP_201_CREATED)


class AccountAPI(generics.RetrieveAPIView):
    serializer_class = AccountSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'account_slug'
    queryset = Account.objects.all()


class CurrentAccountAPI(generics.RetrieveAPIView):
    serializer_class = AccountSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class CurrentAccountQuizzesAPI(QuizListAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self, *args, **kwargs):
        return Quiz.objects.filter(author=self.request.user).order_by('-pub_date')
