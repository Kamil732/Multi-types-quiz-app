from django.utils.translation import gettext as _
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.exceptions import NotFound

from quizzes.models import Quiz, QuizPunctation, Question, Answer
from .permissions import IsOwner, IsOwnerEverything
from .pagination import QuizListPagination
from . import serializers


class QuizListMixin(object):
    serializer_class = serializers.QuizListSerializer
    pagination_class = QuizListPagination
    filterset_fields = ('title', 'category__name', 'section__name',)
    filterset_fields = {
        'title': ['istartswith'],
        'category__name': ['exact'],
        'section__name': ['exact'],
    }

    def list(self, request, *args, **kwargs):
        qs = self.filter_queryset(
            self.get_queryset())

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)

        return Response(serializer.data)


class QuizPunctationMixin(object):
    serializer_class = serializers.QuizPunctationSerializer
    permission_classes = (IsOwnerEverything,)

    def get_queryset(self):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')

        return QuizPunctation.objects.filter(quiz__author__slug=author_slug, quiz__slug=quiz_slug)


class QuestionMixin(object):
    permission_classes = (IsOwner,)
    serializer_class = serializers.QuestionSerializer

    def get_queryset(self, *args, **kwargs):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')

        try:
            quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)
        except ObjectDoesNotExist:
            raise NotFound(
                _('The quiz you are looking for does not exist'))

        return Question.objects.filter(quiz=quiz)


class AnswerMixin(object):
    permission_classes = (IsOwner,)
    serializer_class = serializers.AnswerSerializer

    def get_queryset(self):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        question_slug = self.kwargs.get('question_slug')

        try:
            quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)
            question = Question.objects.get(quiz=quiz, slug=question_slug)
        except ObjectDoesNotExist:
            raise NotFound(
                _('The quiz you are looking for does not exist'))

        return Answer.objects.filter(question=question)
