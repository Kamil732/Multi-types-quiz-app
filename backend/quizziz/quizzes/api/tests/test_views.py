from .test_setup import TestSetUp


class TestViews(TestSetUp):
    def test_create_quiz_not_authenticated(self):
        res = self.client.post(self.quizzes_create_url, self.quizzes_create_data,
                               format='json')

        self.assertEqual(res.status_code, 401)

    def test_create_quiz(self):
        res = self.client.post(self.quizzes_create_url, self.quizzes_create_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)

    def test_create_quiz_question_not_authenticated(self):
        res = self.client.post(self.quizzes_create_question_url, self.quizzes_create_question_data,
                               format='json')

        self.assertEqual(res.status_code, 401)

    def test_create_quiz_question(self):
        res = self.client.post(self.quizzes_create_question_url, self.quizzes_create_question_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)

    def test_get_sections(self):
        res = self.client.get(self.sections_url)

        self.assertEqual(res.status_code, 200)

    def test_get_categories(self):
        res = self.client.get(self.categories_url)

        self.assertEqual(res.status_code, 200)

    def test_get_quizzes(self):
        res = self.client.get(self.quizzes_url)

        self.assertEqual(res.status_code, 200)

    def test_get_quiz_detail(self):
        res = self.client.get(self.quizzes_detail_url)

        self.assertEqual(res.status_code, 200)

    def test_get_quiz_quesitons(self):
        res = self.client.get(self.quizzes_questions_detail_url)

        self.assertEqual(res.status_code, 200)
