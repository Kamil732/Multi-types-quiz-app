from django.urls import reverse
from rest_framework.test import APITestCase

from faker import Faker

from accounts.models import Account
from quizzes.models import Quiz, QuizPunctation, Question, Answer, Category


class TestSetUp(APITestCase):
    def setUp(self):
        self.fake = Faker()

        email = self.fake.email()
        username = self.fake.email().split('@')[0][:12]
        password = self.fake.email()

        email_other = self.fake.email()
        username_other = self.fake.email().split('@')[0][:12]

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

        register_data_other = {
            'email': email_other,
            'username': username_other,
            'password': password,
            'password2': password,
        }

        login_data_other = {
            'email': email_other,
            'password': password,
        }

        for _ in range(12):
            Category.objects.create(display_name=self.fake.unique.name())

        categories = [category for category in Category.objects.all()]
        category_names = [category.name for category in Category.objects.all()]

        title = self.fake.sentence()
        description = self.fake.sentence()
        image_url = 'https://cdn.pixabay.com/photo/2020/12/19/03/27/person-5843476_960_720.jpg'

        user_data = register_data
        user_data.pop('password2')
        user = Account.objects.create_user(**user_data)

        quiz = Quiz.objects.create(author=user, title=title, description=description, image_url=image_url,
                                   section=self.fake.random.choice(Quiz.SECTION), category=self.fake.random.choice(categories))

        questions = [Question.objects.create(
            quiz=quiz, question=self.fake.unique.sentence()) for _ in range(7)]

        # Knowledge answers
        knowledge_answers = [Answer.objects.create(question=self.fake.random.choice(
            questions), answer=self.fake.sentence(), is_correct=self.fake.boolean(chance_of_getting_true=40)) for _ in range(20)]

        self.image_validator_data = {
            'image_url': image_url
        }

        self.quizzes_create_data = {
            'title': title,
            'description': description,
            'image_url': image_url,
            'section': self.fake.random.choice(Quiz.SECTION),
            'category': self.fake.random.choice(category_names),
        }

        self.quizzes_create_no_image_url_data = {
            'title': title,
            'description': description,
            'image_url': '',
            'section': self.fake.random.choice(Quiz.SECTION),
            'category': self.fake.random.choice(category_names),
        }

        self.quizzes_create_bad_image_url_data = {
            'title': title,
            'description': description,
            'image_url': title,
            'section': self.fake.random.choice(Quiz.SECTION),
            'category': self.fake.random.choice(category_names),
        }

        self.quizzes_update_data = {
            'title': description,
            'description': title,
            'image_url': '',
            'section': self.fake.random.choice(Quiz.SECTION),
            'category': self.fake.random.choice(category_names),
        }

        self.quizzes_create_question_data = {
            'question': title,
            'image_url': image_url,
            'summery': '',
        }

        self.quizzes_create_question_bad_image_url_data = {
            'question': title,
            'image_url': title,
            'summery': '',
        }

        from_score = self.fake.random_int(min=0, max=10)
        to_score = from_score + self.fake.random_int(min=0, max=10)

        self.quiz_punctation_data = {
            'from_score': from_score,
            'to_score': to_score,
            'result': self.fake.sentence(),
            'description': self.fake.sentence(),
        }

        self.finish_knowledge_quiz_data = {
            'section': 'knowledge_quiz',
            'data': [
                {
                    'questionId': answer.question.id,
                    'answer': answer.slug,
                } for answer in knowledge_answers
            ],
        }

        self.feedback_quiz_data = {
            'name': username,
            'email': email,
            'gender': self.fake.random.choice(['woman', 'man']),
            'opinion': description,
            'score': 0,
        }

        self.client.post(register_url, register_data, format='json')
        self.access_token = self.client.post(
            login_url, login_data, format='json').data.get('access')
        self.client.post(register_url, register_data_other, format='json')
        self.access_token_other = self.client.post(
            login_url, login_data_other, format='json').data.get('access')

        self.image_validator_url = reverse('image-validator')
        self.categories_url = reverse('category-list')
        self.quizzes_list_url = reverse('quiz-list')
        self.quizzes_detail_url = reverse(
            'quiz-detail', args=[quiz.author.slug, quiz.slug])
        self.quizzes_question_list_url = reverse(
            'quiz-question-list', args=[quiz.author.slug, quiz.slug])
        self.quiz_punctation_list_url = reverse('quiz-punctation-list', args=[quiz.author.slug, quiz.slug])
        self.finish_quiz_url = reverse('quiz-finish', args=[quiz.author.slug, quiz.slug])
        self.feedback_quiz_url = reverse('quiz-feedbacks', args=[quiz.author.slug, quiz.slug])

        return super(TestSetUp, self).setUp()

    def tearDown(self):
        return super(TestSetUp, self).tearDown()
