from rest_framework.exceptions import ValidationError


def get_username(strategy, details, backend, user=None, *args, **kwargs):
    # Get the logged in user (if any)
    logged_in_user = strategy.storage.user.get_username(user)

    # Custom: check for email being provided
    if not details.get('email'):
        error = "Sorry, but your social network (Facebook or Google) needs to provide us your email address."
        raise ValidationError({'detail': error})

    # Custom: if user is already logged in, double check his email matches the social network email
    if logged_in_user:
        if not(logged_in_user.lower() == details.get('email').lower()):
            error = "Sorry, but you are already logged in with another account, and the email addresses do not match. Try logging out first, please."
            raise ValidationError({'detail': error})

    return {
        'username': details.get('email')[:12].lower(),
    }
