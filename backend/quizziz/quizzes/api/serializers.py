from django.utils.translation import gettext as _
from rest_framework import serializers
from rest_framework.reverse import reverse
from rest_framework.response import Response

from quizziz.settings import valid_url_extension
from quizzes.models import (
    Quiz,
    Question,
    Category,
    Section,
    PsychologyAnswer,
    PreferentialAnswer,
    PsychologyResults,
    UniversalAnswer,
    KnowledgeAnswer
)


class ImageValidatorSerailizer(serializers.Serializer):
    image_url = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        fields = ('image_url',)

    # def create(self, validated_data):
    #     return {
    #         'is_valid': True,
    #     }


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('name', 'display_name')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('name', 'display_name')


# class PsychologyResultsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PsychologyResults
#         fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = (
            'question',
            'image_url',
            'summery',
            'slug',
        )
        read_only_fields = ('slug',)


class QuizSerializer(ImageValidatorSerailizer):
    pub_date = serializers.SerializerMethodField('get_pub_date')

    # section = SectionSerializer(read_only=True)
    # section_id = serializers.IntegerField(write_only=True)

    section = serializers.CharField()
    category = serializers.CharField()
    # category = CategorySerializer(read_only=True)
    # category_id = serializers.IntegerField(write_only=True)

    def get_pub_date(self, obj):
        return f'{obj.pub_date.day}-{obj.pub_date.month}-{obj.pub_date.year}'

    def validate_description(self, value):
        if not(value.strip()):
            return Quiz.DEFAULT_DESCRIPTION
        return value

    def validate_image_url(self, value):
        if not(value.strip()):
            return Quiz.DEFAULT_IMAGE
        if not(valid_url_extension(value)):
            raise serializers.ValidationError(_('URL have to direct to image'))
        return value

    def to_representation(self, instance):
        self.fields['section'] = SectionSerializer(read_only=True)
        self.fields['category'] = CategorySerializer(read_only=True)

        return super(QuizSerializer, self).to_representation(instance)


class QuizListSerializer(QuizSerializer, serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    author_slug = serializers.ReadOnlyField(source='author.slug')

    def create(self, validated_data):
        validated_data['section'] = Section.objects.get(
            name=validated_data['section'])

        validated_data['category'] = Category.objects.get(
            name=validated_data['category'])

        return super(self.__class__, self).create(validated_data)

    class Meta:
        model = Quiz
        fields = (
            'pub_date',
            'image_url',
            'section',
            'category',
            'title',
            'description',
            'solved_times',
            'slug',
            'author',
            'author_slug',
            'section',
            # 'section_id',
            'category',
            # 'category_id',
        )
        read_only_fields = ('slug', 'solved_times',)


class QuizDetailSerializer(QuizSerializer, serializers.ModelSerializer):
    questions = serializers.SerializerMethodField('get_questions')
    author = serializers.SerializerMethodField('get_author')

    def get_author(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(reverse('account', args=[obj.author.slug]))

    def get_questions(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(reverse('quiz-questions', args=[obj.author.slug, obj.slug]))

    def update(self, instance, validated_data):
        section_name = validated_data.pop('section')
        section_id = Section.objects.filter(
            name=section_name).values_list('id', flat=True).first()
        instance.section_id = section_id

        category_name = validated_data.pop('category')
        category_id = Category.objects.filter(
            name=category_name).values_list('id', flat=True).first()
        instance.category_id = category_id

        return instance

    class Meta:
        model = Quiz
        exclude = (
            'id',
            'is_published',
            'solved_times',
        )
        read_only_fields = ('questions', 'author',)
