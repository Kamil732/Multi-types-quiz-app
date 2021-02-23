from django.utils.translation import gettext as _
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from bulk_sync import bulk_sync
from rest_framework import views, generics, viewsets, permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound

from quizzes.models import Quiz, QuizFeedback, QuizPunctation, Section, Category, Question, PsychologyResults, Answer

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


class AnswerListAPIView(mixins.AnswerMixin, generics.ListCreateAPIView):
    def perform_create(self, serializer):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        question_slug = self.kwargs.get('question_slug')
        question = Question.objects.get(quiz__author__slug=author_slug, quiz__slug=quiz_slug, slug=question_slug)

        serializer.save(question_id=question.id)


class AnswerDetailAPIView(mixins.AnswerMixin, generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'slug'
    lookup_url_kwarg = 'answer_slug'


class QuizDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Quiz.objects.order_by(
        '-pub_date', '-solved_times')
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
        '-pub_date', '-solved_times').filter(is_published=True)
    permission_classes = (permissions.CreateIsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class QuizFinishAPIView(views.APIView):
    def post(self, request, fromat=False, *args, **kwargs):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        section = request.data.get('section')

        # Psychology
        results = []

        retrieveData = {
            'summery': '',
            'points': 0,
            'data': [],
        }

        # Check if quiz exists
        try:
            quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)
            # Add 1 to solved_times
            quiz.solved_times += 1
            quiz.save
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
                correct_answers = [answer.get('slug') for answer in Answer.objects.filter(
                    question__id=question_id, is_correct=True).values('slug')]

                # Add 1 to points if it is correct answer
                retrieveData['points'] += 1 if answer_slug in correct_answers else 0
                retrieveData['data'].append({
                    'correct_answers': correct_answers,
                    'questionId': question_id,
                    'selected': answer_slug,
                })

            elif section == 'universal_quiz':
                points = int(Answer.objects.filter(question__id=question_id,
                                                   slug=answer_slug).values_list('points', flat=True).first())

                retrieveData['points'] += points
                retrieveData['data'].append({
                    'questionId': question_id,
                    'selected': answer_slug,
                })
            elif section == 'preferential_quiz':
                answer = Answer.objects.get(question__id=question_id, slug=answer_slug)
                answer.answered_times += 1
                answer.save()

                retrieveData['data'].append({
                    'questionId': question_id,
                    'selected': answer_slug,
                })

            elif section == 'psychology_quiz':
                answer = Answer.objects.get(question__id=question_id, slug=answer_slug)
                results.append(answer.results.values_list('id', flat=True))

                retrieveData['data'].append({
                    'questionId': question_id,
                    'selected': answer_slug,
                })

        if section == 'knowledge_quiz' or section == 'universal_quiz':
            quiz.answers_data.append(retrieveData['points'])
            quiz.save()

            summery = QuizPunctation.objects.filter(
                quiz=quiz, from_score__lte=retrieveData['points'], to_score__gte=retrieveData['points']).values_list('result', 'description').first()

        elif section == 'preferential_quiz':
            summery = QuizPunctation.objects.filter(quiz=quiz).values_list('result', 'description').first()

        elif section == 'psychology_quiz':
            results = [x for result in results for x in result]
            most_occur_result_id = max(results, key=results.count)

            summery = PsychologyResults.objects.filter(
                id=most_occur_result_id).values_list('result', 'description').first()

        retrieveData['summery'] = summery

        return Response(retrieveData, status=status.HTTP_200_OK)


class QuizPunctationListAPIView(mixins.QuizPunctationMixin, generics.ListCreateAPIView, generics.UpdateAPIView):
    def perform_create(self, serializer):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)

        serializer.save(quiz_id=quiz.id)

    def update(self, request, *args, **kwargs):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')

        quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)
        new_models = [QuizPunctation(quiz=quiz, result=model['result'], description=model['description'], from_score=model['from_score'],
                                     to_score=model['to_score']) for model in request.data]

        bulk_sync(
            new_models=new_models,
            filters=Q(quiz_id=quiz.id),
            fields=['result', 'description', 'from_score', 'to_score'],
            key_fields=('id',)
        )

        return Response(request.data, status=status.HTTP_200_OK)


class QuizFeedbackAPIView(generics.ListCreateAPIView):
    serializer_class = serializers.QuizFeedbackSerializer

    def get_queryset(self):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')

        try:
            quiz = QuizFeedback.objects.filter(quiz__author__slug=author_slug, quiz__slug=quiz_slug)
        except ObjectDoesNotExist:
            raise NotFound(
                _('The quiz you are looking for does not exist'))

        return quiz

    def get_serializer_context(self):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        quiz = Quiz.objects.filter(author__slug=author_slug, slug=quiz_slug).values(
            'ask_name', 'ask_email', 'ask_gender').first()

        return {
            'quiz': quiz,
            'request': self.request,
        }

    def perform_create(self, serializer):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')
        quiz = Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)

        serializer.save(quiz_id=quiz.id)
