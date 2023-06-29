import requests

from django.utils.translation import gettext as _
from django.conf import settings

from rest_framework.exceptions import ValidationError

VALID_IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
]


def valid_url_extension(url, extension_list=VALID_IMAGE_EXTENSIONS):
    try:
        image_request = requests.head(url)

        if image_request.status_code == requests.codes.ok:
            return any([url.endswith(e) for e in extension_list])
    except:
        return False


def validate_recaptcha(data):
    data = {
        'response': data.get('g-recaptcha-response'),
        'secret': settings.RECAPTCHA_SECRET_KEY
    }
    res = requests.post('https://www.google.com/recaptcha/api/siteverify',
                        data=data).json()
    print(res)

    # if not (res.get('success')):
    #     raise ValidationError(
    #         {'detail': _('Our system detected that you are a robot')})
