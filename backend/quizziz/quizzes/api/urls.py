from django.urls import path, include
from rest_framework.routers import DefaultRouter

from quizzes.api.views import (
    ImageValidatorAPIView,
    QuizListAPIView,
    QuizDetailAPIView,
    QuizPunctationListAPIView,
    QuizPunctationDetailAPIView,
    QuizFinishAPIView,
    QuizFeedbackAPIView,
    SectionViewSet,
    CategoryViewSet,
    QuestionListAPIView,
    QuestionDetailAPIView,
    AnswerListAPIView,
    AnswerDetailAPIView
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
            path('finish/', QuizFinishAPIView.as_view(), name='quiz-finish'),
            path('feedback/', QuizFeedbackAPIView.as_view(), name='quiz-feedback'),
            path('punctation/', include([
                path('', QuizPunctationListAPIView.as_view(), name='quiz-punctation-list'),
                path('<int:punctation_id>/', QuizPunctationDetailAPIView.as_view(), name='quiz-punctation-detail'),
            ])),
            path('questions/', include([
                path('', QuestionListAPIView.as_view(), name='quiz-question-list'),
                path('<slug:question_slug>/', include([
                    path('', QuestionDetailAPIView.as_view(), name='quiz-question-detail'),
                    path('answers/', include([
                        path('', AnswerListAPIView.as_view(), name='quiz-answer-list'),
                        path('<slug:answer_slug>/', AnswerDetailAPIView.as_view(), name='quiz-answer-detail')
                    ])),
                ])),
            ])),
        ])),
    ])),
]
