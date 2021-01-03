from quizzes.models import Quiz, Question

from quizzes.api.permissions import CreateIsAuthenticated, IsOwner
from quizzes.api import serializers


class QuizMixin(object):
    queryset = Quiz.objects.order_by('-pub_date', '-solved_times')


class QuestionMixin(object):
    serializer_class = serializers.QuestionSerializer

    def get_queryset(self, *args, **kwargs):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')

        return Question.objects.filter(quiz__author__slug=author_slug, quiz__slug=quiz_slug)
