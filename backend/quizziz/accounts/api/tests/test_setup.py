from django.urls import reverse
from rest_framework.test import APITestCase

from faker import Faker


class TestSetUp(APITestCase):
    def setUp(self):
        self.fake = Faker()

        email = self.fake.email()
        username = self.fake.email().split('@')[0]
        password = self.fake.email()

        self.register_url = reverse('signup')
        self.login_url = reverse('token_obtain_pair')
        self.refresh_token_url = reverse('token_refresh')
        self.account_url = reverse('account', args=[username])
        self.my_profile_url = reverse('account-profile')
        self.account_quizzes_url = reverse('account-quizzes')

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

        return super(TestSetUp, self).setUp()

    def tearDown(self):
        return super(TestSetUp, self).tearDown()
