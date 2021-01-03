from django.urls import path, include
from rest_framework.routers import DefaultRouter

from quizzes.api.views import ImageValidatorAPIView, QuizListAPIView, QuizDetailAPIView, SectionViewSet, CategoryViewSet, QuestionListAPIView, QuestionDetailAPIView

router = DefaultRouter()
# router.register('quizzes', QuizViewSet)
router.register('sections', SectionViewSet)
router.register('categories', CategoryViewSet)

# quiz_detail = QuizViewSet.as_view({
#     'get': 'retrieve',
#     'put': 'update',
#     'patch': 'partial_update',
#     'delete': 'destroy',
# })

urlpatterns = [
    path('', include(router.urls)),
    path('image-url-validation/',
         ImageValidatorAPIView.as_view(), name='image-validator'),
    path('quizzes/', include([
        path('', QuizListAPIView.as_view(), name='quiz-list'),
        path('<slug:author_slug>/<slug:quiz_slug>/', include([
            path('', QuizDetailAPIView.as_view(), name='quiz-detail'),
            path('questions/', include([
                path('', QuestionListAPIView.as_view(), name='quiz-questions'),
                path('<slug:question_slug>/', QuestionDetailAPIView.as_view(),
                     name='quiz-questions-detail'),
            ])),
        ])),
    ])),
]
