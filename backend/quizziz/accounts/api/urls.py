from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.api.views import (
    SocialLoginView,
    SignupAPIView,
    AccountAPIView,
    AccountQuizzesAPIView,
    CurrentAccountAPIView,
    CurrentAccountQuizzesAPIView,
)


urlpatterns = [
    path('login/', include([
        path('', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('social/', SocialLoginView.as_view(), name="social-login"),
        path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    ])),
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('account/<slug:account_slug>/', include([
        path('', AccountAPIView.as_view(), name='account'),
        path('quizzes/', AccountQuizzesAPIView.as_view(), name='account-quizzes'),
    ])),
    path('current/', include([
        path('', CurrentAccountAPIView.as_view(), name='current-account'),
        path('quizzes/', CurrentAccountQuizzesAPIView.as_view(),
             name='current-account-quizzes')
    ])),
]
