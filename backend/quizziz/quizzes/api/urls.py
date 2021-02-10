from django.urls import path, include
from rest_framework.routers import DefaultRouter

from quizzes.api.views import (
    ImageValidatorAPIView,
    QuizListAPIView,
    QuizDetailAPIView,
    QuizPunctationAPIView,
    QuizFinishAPIView,
    QuizFeedbackAPIView,
    SectionViewSet,
    CategoryViewSet,
    QuestionListAPIView,
    QuestionDetailAPIView,
    AnswerListAPIView
)

router = DefaultRouter()
router.register('sections', SectionViewSet)
router.register('categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('image-url-validation/', ImageValidatorAPIView.as_view(), name='image-validator'),
    path('quizzes/', include([
        path('', QuizListAPIView.as_view(), name='quiz-list'),
        path('<slug:author_slug>/<slug:quiz_slug>/', include([
            path('', QuizDetailAPIView.as_view(), name='quiz-detail'),
            path('punctation/', QuizPunctationAPIView.as_view(), name='quiz-punctaction'),
            path('finish/', QuizFinishAPIView.as_view(), name='quiz-finish'),
            path('feedback/', QuizFeedbackAPIView.as_view(), name='quiz-feedback'),
            path('questions/', include([
                path('', QuestionListAPIView.as_view(), name='quiz-questions'),
                path('<slug:question_slug>/', include([
                    path('', QuestionDetailAPIView.as_view(), name='quiz-questions-detail'),
                    path('answers/', include([
                        path('', AnswerListAPIView.as_view(), name='quiz-question-answers'),
                        # path('<slug:answer_slug>/', name='quiz-question-answer-detail')
                    ])),
                ])),
            ])),
        ])),
    ])),
]
