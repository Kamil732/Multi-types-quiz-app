from django.utils.translation import gettext as _
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import views, generics, viewsets, permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound

from quizzes.models import Quiz, QuizFeedback, Section, Category, Question, Answer

from . import serializers, permissions, mixins


class ImageValidatorAPIView(generics.GenericAPIView):
    serializer_class = serializers.ImageValidatorSerailizer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.SectionSerializer
    queryset = Section.objects.all()
    lookup_field = 'name'


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.CategorySerializer
    queryset = Category.objects.all()
    lookup_field = 'name'


class QuestionListAPIView(mixins.QuestionMixin, generics.ListCreateAPIView):
    def perform_create(self, serializer):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        quiz_id = Quiz.objects.filter(
            author__slug=author_slug, slug=quiz_slug).values_list('id', flat=True).first()

        serializer.save(quiz_id=quiz_id)


class QuestionDetailAPIView(mixins.QuestionMixin, generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'slug'
    lookup_url_kwarg = 'question_slug'


class AnswerListAPIView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsOwner,)
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


class QuizDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.order_by(
        '-pub_date', '-solves')
    permission_classes = (permissions.IsOwner,)
    serializer_class = serializers.QuizDetailSerializer

    def get_object(self, *args, **kwargs):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')

        try:
            return Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)
        except ObjectDoesNotExist:
            raise NotFound(
                _('The quiz you are looking for does not exist'))


class QuizListAPIView(mixins.QuizListMixin, generics.ListCreateAPIView):
    queryset = Quiz.objects.order_by(
        '-pub_date', '-solves').filter(is_published=True)
    permission_classes = (permissions.CreateIsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class QuizFinishAPIView(views.APIView):
    def post(self, request, fromat=False, *args, **kwargs):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        section = request.data.get('section')

        retrieveData = {
            'section': section,
            'correctAnswers': 0,
            'data': [],
        }

        # Check if quiz exists
        try:
            quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)
        except ObjectDoesNotExist:
            raise NotFound(
                _('The quiz you are looking for does not exist'))

        for answer in request.data.get('data'):
            question_id = answer.get('questionId')
            answer_slug = answer.get('answer')

            if not(answer_slug):
                raise ValidationError(
                    _('You have not answered all the questions'))

            if section == 'knowledge_quiz':
                # Get all the correct answers from question
                correct_answers = [answer.get('slug') for answer in Answer.objects.filter(
                    question__id=question_id, is_correct=True).values('slug')]

                # Add 1 to correctAnswers if it is correct answer
                retrieveData['correctAnswers'] += 1 if answer_slug in correct_answers else 0
                retrieveData['data'].append({
                    'questionId': question_id,
                    'selected': answer_slug,
                    'correct_answers': correct_answers,
                })

            elif section == 'psychology_quiz':
                pass
            elif section == 'preferential_quiz':
                pass
            elif section == 'universal_quiz':
                pass

        if section == 'knowledge_quiz':
            quiz.solves.append(retrieveData['correctAnswers'])
            quiz.save()

        return Response(retrieveData, status=status.HTTP_200_OK)


class QuizFeedbackAPIView(generics.ListCreateAPIView):
    serializer_class = serializers.QuizFeedbackSerializer

    def get_queryset(self):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')

        try:
            quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)
        except ObjectDoesNotExist:
            raise NotFound(
                _('The quiz you are looking for does not exist'))

        return QuizFeedback.objects.filter(quiz=quiz)

    def perform_create(self, serializer):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)

        serializer.save(quiz_id=quiz.id)
