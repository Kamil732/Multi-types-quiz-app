def create_user(strategy, details, backend, user=None, *args, **kwargs):
    if user:
        return {'is_new': False}

    fields = dict((name, kwargs.get(name, details.get(name)))
                  for name in ['email', 'first_name'])

    if not(fields):
        return

    fields['username'] = fields['first_name'][:12]
    del fields['first_name']

    return {
        'is_new': True,
        'user': strategy.create_user(**fields)
    }
