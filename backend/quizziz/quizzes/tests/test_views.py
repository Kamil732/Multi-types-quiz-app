from .test_setup import TestSetUp
from quizzes.models import Quiz


class TestViews(TestSetUp):
    ######## POST METHODS ########

    def test_create_quiz_not_authenticated(self):
        res = self.client.post(self.quizzes_create_url,
                               self.quizzes_create_data, format='json')

        self.assertEqual(res.status_code, 401)

    def test_create_quiz(self):
        res = self.client.post(self.quizzes_create_url, self.quizzes_create_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('title'),
                         self.quizzes_create_data['title'])
        self.assertEqual(res.data.get('description'),
                         self.quizzes_create_data['description'])
        self.assertEqual(res.data.get('image_url'),
                         self.quizzes_create_data['image_url'])
        self.assertEqual(res.data.get('section').get('name'),
                         self.quizzes_create_data['section'])
        self.assertEqual(res.data.get('category').get('name'),
                         self.quizzes_create_data['category'])

    def test_create_quiz_without_image_url_and_description(self):
        res = self.client.post(self.quizzes_create_url, self.quizzes_create_no_image_url_and_desciprtion_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('description'), Quiz.DEFAULT_DESCRIPTION)
        self.assertEqual(res.data.get('image_url'), Quiz.DEFAULT_IMAGE)

    def test_create_quiz_with_bad_image_url(self):
        res = self.client.post(self.quizzes_create_url, self.quizzes_create_bad_image_url_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('image_url'), Quiz.DEFAULT_IMAGE)

    def test_create_quiz_question_not_authenticated(self):
        res = self.client.post(self.quizzes_create_question_url, self.quizzes_create_question_data,
                               format='json')

        self.assertEqual(res.status_code, 401)

    def test_create_quiz_question(self):
        res = self.client.post(self.quizzes_create_question_url, self.quizzes_create_question_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('question'),
                         self.quizzes_create_question_data['question'])
        self.assertEqual(res.data.get('image_url'),
                         self.quizzes_create_question_data['image_url'])
        self.assertEqual(res.data.get('summery'),
                         self.quizzes_create_question_data['summery'])

    def test_create_quiz_question_bad_image_url(self):
        res = self.client.post(self.quizzes_create_question_url, self.quizzes_create_question_bad_image_url_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('image_url'), '')

    ######## GET METHODS ########

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

    ######## PUT METHODS ########

    def test_update_quiz_not_authenticated(self):
        res = self.client.put(self.quizzes_detail_url,
                              self.quizzes_update_data, format='json')

        self.assertEqual(res.status_code, 401)

    def test_update_quiz_not_owner(self):
        res = self.client.put(self.quizzes_detail_url, self.quizzes_update_data,
                              format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token_other}')

        self.assertEqual(res.status_code, 403)

    def test_update_quiz(self):
        res = self.client.put(self.quizzes_detail_url, self.quizzes_update_data,
                              format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data.get('title'),
                         self.quizzes_update_data['title'])
        self.assertEqual(res.data.get('description'),
                         self.quizzes_update_data['description'])
        self.assertEqual(res.data.get('image_url'), Quiz.DEFAULT_IMAGE)
        self.assertEqual(res.data.get('section').get('name'),
                         self.quizzes_update_data['section'])
        self.assertEqual(res.data.get('category').get('name'),
                         self.quizzes_update_data['category'])

    def test_update_question_not_authenticated(self):
        res = self.client.put(self.quizzes_questions_detail_url,
                              self.quizzes_questions_update_data, format='json')

        self.assertEqual(res.status_code, 401)

    def test_update_question_not_owner(self):
        res = self.client.put(self.quizzes_questions_detail_url, self.quizzes_questions_update_data,
                              format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token_other}')

        self.assertEqual(res.status_code, 403)

    def test_update_question(self):
        res = self.client.put(self.quizzes_questions_detail_url, self.quizzes_questions_update_data,
                              format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data.get('question'),
                         self.quizzes_questions_update_data['question'])
        self.assertEqual(res.data.get('image_url'),
                         self.quizzes_questions_update_data['image_url'])
        self.assertEqual(res.data.get('summery'),
                         self.quizzes_questions_update_data['summery'])

    ######## DELETE METHODS ########

    def test_delete_quiz_not_authenticated(self):
        res = self.client.delete(self.quizzes_detail_url)

        self.assertEqual(res.status_code, 401)

    def test_delete_quiz_not_owner(self):
        res = self.client.delete(self.quizzes_detail_url, data={
        }, format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token_other}')

        self.assertEqual(res.status_code, 403)

    def test_delete_quiz(self):
        res = self.client.delete(self.quizzes_detail_url, data={
        }, format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 204)

    def test_delete_question_not_authenticated(self):
        res = self.client.delete(
            self.quizzes_questions_detail_url, data={}, format='json')

        self.assertEqual(res.status_code, 401)

    def test_delete_question_not_owner(self):
        res = self.client.delete(self.quizzes_questions_detail_url, data={
        }, format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token_other}')

        self.assertEqual(res.status_code, 403)

    def test_delete_question(self):
        res = self.client.delete(self.quizzes_questions_detail_url, data={
        }, format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 204)
