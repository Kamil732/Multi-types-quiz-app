from django.urls import reverse
from django.template.defaultfilters import slugify
from rest_framework.test import APITestCase

from faker import Faker


class TestSetUp(APITestCase):
    def setUp(self):
        self.fake = Faker()

        email = self.fake.email()
        username = self.fake.email().split('@')[0][:12]
        password = self.fake.email()

        self.register_url = reverse('signup')
        self.login_url = reverse('token_obtain_pair')
        self.refresh_token_url = reverse('token_refresh')
        self.account_url = reverse('account', args=[username])
        self.account_quizzes_url = reverse(
            'account-quizzes', args=[slugify(username)])
        self.current_account_url = reverse('current-account')
        self.current_account_quizzes_url = reverse('current-account-quizzes')

        self.register_data = {
            'email': email,
            'username': username,
            'password': password,
            'password2': password,
        }

        self.login_data = {
            'email': email,
            'password': password,
        }

        self.patch_data = {
            'username': self.fake.email().split('@')[0],
            'bio': username,
        }

        return super(TestSetUp, self).setUp()

    def tearDown(self):
        return super(TestSetUp, self).tearDown()
