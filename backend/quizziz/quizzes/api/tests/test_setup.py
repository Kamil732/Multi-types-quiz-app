from django.urls import reverse
from rest_framework.test import APITestCase

from faker import Faker

from accounts.models import Account
from quizzes.models import Quiz, Question, Section, Category


class TestSetUp(APITestCase):
    def setUp(self):
        self.fake = Faker()

        email = self.fake.email()
        username = self.fake.email().split('@')[0]
        password = self.fake.email()

        register_url = reverse('signup')
        login_url = reverse('token_obtain_pair')

        register_data = {
            'email': email,
            'username': username,
            'password': password,
            'password2': password,
        }

        login_data = {
            'email': email,
            'password': password,
        }

        for _ in range(4):
            Section.objects.create(display_name=self.fake.unique.name())

        for _ in range(12):
            Category.objects.create(display_name=self.fake.unique.name())

        sections = [section for section in Section.objects.all()]
        section_names = [section.name for section in Section.objects.all()]
        categories = [category for category in Category.objects.all()]
        category_names = [category.name for category in Category.objects.all()]

        title = self.fake.sentence()
        description = self.fake.sentence()

        self.quizzes_create_data = {
            'title': title,
            'description': description,
            'image_url': '',
            'section': self.fake.random.choice(section_names),
            'category': self.fake.random.choice(category_names),
        }

        self.quizzes_create_question_data = {
            'question': self.fake.sentence(),
        }

        user_data = register_data
        del user_data['password2']
        self.user = Account.objects.create_user(**user_data)

        quiz = Quiz.objects.create(author=self.user, title=title, description=description, image_url='',
                                   section=self.fake.random.choice(sections), category=self.fake.random.choice(categories))

        Question.objects.create(
            quiz=quiz, question=self.fake.unique.sentence())

        self.client.post(register_url, register_data, format='json')
        self.access_token = self.client.post(
            login_url, login_data, format='json').data.get('access')

        self.sections_url = reverse('section-list')
        self.categories_url = reverse('category-list')
        self.quizzes_url = reverse('quiz-list')
        self.quizzes_detail_url = reverse(
            'quiz-detail', args=[quiz.author.slug, quiz.slug])
        self.quizzes_questions_url = reverse(
            'quiz-questions', args=[quiz.author.slug, quiz.slug])
        self.quizzes_questions_detail_url = reverse(
            'quiz-questions-detail', args=[quiz.author.slug, quiz.slug, quiz.questions.first().slug])
        self.quizzes_create_url = reverse('quiz-list')
        self.quizzes_create_question_url = reverse(
            'quiz-questions', args=[quiz.author.slug, quiz.slug])

        return super(TestSetUp, self).setUp()

    def tearDown(self):
        return super(TestSetUp, self).tearDown()
