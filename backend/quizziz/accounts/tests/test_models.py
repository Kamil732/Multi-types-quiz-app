from .test_setup import TestSetUp
from django.conf import settings

from accounts.models import Account


class TestAccounts(TestSetUp):
    def test_save_blank_picture(self):
        self.client.post(
            self.register_url, self.register_data, format='json')
        access_token = self.client.post(
            self.login_url, self.login_data, format='json').data.get('access')

        res = self.client.get(self.current_account_url, data={
        }, format='json', HTTP_AUTHORIZATION=f'Bearer {access_token}')

        self.assertURLEqual(res.data.get('picture'),
                            f'http://testserver{settings.MEDIA_URL}{Account.DEFAULT_PROFILE_PICTURE}')
