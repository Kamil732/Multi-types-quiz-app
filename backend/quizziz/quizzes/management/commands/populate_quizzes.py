from django.core.management.base import BaseCommand

from quizzes.models import Quiz, Section, Category
from accounts.models import Account

import factory
import factory.fuzzy
from factory.django import DjangoModelFactory


class QuizFactory(DjangoModelFactory):
    class Meta:
        model = Quiz

    author = factory.fuzzy.FuzzyChoice(i for i in Account.objects.all())
    title = factory.Faker('sentence', nb_words=7)
    description = factory.Faker('sentence', nb_words=12)
    section = factory.fuzzy.FuzzyChoice([i for i in Section.objects.all()])
    category = factory.fuzzy.FuzzyChoice([i for i in Category.objects.all()])
    is_published = True


class Command(BaseCommand):
    help = 'Populate database with quizzes'

    def add_arguments(self, parser):
        parser.add_argument('amount', type=int)

    def _create_tags(self, amount):
        for i in range(amount):
            quiz = QuizFactory()

            author = quiz.author
            title = quiz.title
            description = quiz.description
            section = quiz.section
            category = quiz.category
            is_published = quiz.is_published

            Quiz.objects.get_or_create(author=author, title=title, description=description,
                                       section=section, category=category, is_published=is_published)

    def handle(self, *args, **options):
        print('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=')
        print('Wait\n')
        try:
            self._create_tags(options['amount'])
        finally:
            print('complete!')
            print(
                '=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=')
