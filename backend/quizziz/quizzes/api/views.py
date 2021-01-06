from django.utils.translation import gettext as _
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import generics, viewsets, permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from quizzes.models import Quiz, Section, Category, KnowledgeAnswer, Question
from .pagination import QuizListPagination
from . import serializers, permissions, mixins


class ImageValidatorAPIView(generics.GenericAPIView):
    serializer_class = serializers.ImageValidatorSerailizer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # image_url = serializer.data.get('image_url')
        # data = {}

        # try:
        #     image_request = requests.head(image_url)
        #     data['success'] = image_request.status_code == requests.codes.ok
        # except:
        #     data['success'] = False

        # data['image_url'] = image_url if data['success'] else Quiz.DEFAULT_IMAGE

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


class QuizDetailAPIView(mixins.QuizMixin, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsOwner,)
    serializer_class = serializers.QuizDetailSerializer

    def get_object(self, *args, **kwargs):
        author_slug = self.kwargs.get('author_slug')
        quiz_slug = self.kwargs.get('quiz_slug')

        try:
            return Quiz.objects.get(author__slug=author_slug, slug=quiz_slug)
        except ObjectDoesNotExist:
            raise APIException(
                _('The quiz you are looking for does not exist'))


class QuizListAPIView(mixins.QuizMixin, generics.ListCreateAPIView):
    permission_classes = (permissions.CreateIsAuthenticated,)
    serializer_class = serializers.QuizListSerializer
    pagination_class = QuizListPagination
    filterset_fields = ('title', 'category__name', 'section__name',)
    filterset_fields = {
        'title': ['istartswith'],
        'category__name': ['exact'],
        'section__name': ['exact'],
    }

    def list(self, request):
        qs = self.filter_queryset(
            self.get_queryset()).filter(is_published=True)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)

        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
