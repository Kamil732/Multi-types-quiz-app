from .test_setup import TestSetUp
from quizzes.models import Quiz


class TestViews(TestSetUp):
    ######## POST METHODS ########

    def test_image_validation(self):
        res = self.client.post(self.image_validator_url, self.image_validator_data, format='json')

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['image_url'], self.image_validator_data['image_url'])
        self.assertIsInstance(res.data['success'], bool)

    def test_create_quiz_not_authenticated(self):
        res = self.client.post(self.quizzes_list_url,
                               self.quizzes_create_data, format='json')

        self.assertEqual(res.status_code, 401)

    def test_create_quiz(self):
        res = self.client.post(self.quizzes_list_url, self.quizzes_create_data,
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

    def test_create_quiz_without_image_url(self):
        res = self.client.post(self.quizzes_list_url, self.quizzes_create_no_image_url_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('image_url'), Quiz.DEFAULT_IMAGE)

    def test_create_quiz_with_bad_image_url(self):
        res = self.client.post(self.quizzes_list_url, self.quizzes_create_bad_image_url_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('image_url'), Quiz.DEFAULT_IMAGE)

    def test_create_quiz_question_not_authenticated(self):
        res = self.client.post(self.quizzes_question_list_url, self.quizzes_create_question_data,
                               format='json')

        self.assertEqual(res.status_code, 401)

    def test_create_quiz_question(self):
        res = self.client.post(self.quizzes_question_list_url, self.quizzes_create_question_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('question'),
                         self.quizzes_create_question_data['question'])
        self.assertEqual(res.data.get('image_url'),
                         self.quizzes_create_question_data['image_url'])
        self.assertEqual(res.data.get('summery'),
                         self.quizzes_create_question_data['summery'])

    def test_create_quiz_question_bad_image_url(self):
        res = self.client.post(self.quizzes_question_list_url, self.quizzes_create_question_bad_image_url_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('image_url'), '')

    def test_create_quiz_punctation_not_authenticated(self):
        res = self.client.post(self.quiz_punctation_list_url, self.quiz_punctation_data, format='json')

        self.assertEqual(res.status_code, 401)

    def test_create_quiz_punctation_not_owner(self):
        res = self.client.post(self.quiz_punctation_list_url, self.quiz_punctation_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token_other}')

        self.assertEqual(res.status_code, 403)

    def test_create_quiz_punctation(self):
        res = self.client.post(self.quiz_punctation_list_url, self.quiz_punctation_data,
                               format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data['from_score'], self.quiz_punctation_data['from_score'])
        self.assertEqual(res.data['to_score'], self.quiz_punctation_data['to_score'])
        self.assertEqual(res.data['result'], self.quiz_punctation_data['result'])
        self.assertEqual(res.data['description'], self.quiz_punctation_data['description'])

    def test_finish_knowledge_quiz_no_answer(self):
        request_data = self.finish_knowledge_quiz_data
        request_data['data'][0]['answer'] = None
        res = self.client.post(self.finish_quiz_url, request_data, format='json')

        self.assertEqual(res.status_code, 400)

    def test_finish_knowledge_quiz(self):
        res = self.client.post(self.finish_quiz_url, self.finish_knowledge_quiz_data, format='json')

        self.assertEqual(res.status_code, 200)
        self.assertIsInstance(res.data['data'][0]['correct_answers'], list)
        self.assertIsInstance(res.data['data'][0]['questionId'], int)
        self.assertIsInstance(res.data['data'][0]['selected'], str)
        self.assertIsNotNone(res.data['data'][0]['selected'])

    def test_feedback_quiz(self):
        res = self.client.post(self.feedback_quiz_url, self.feedback_quiz_data, format='json')

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data.get('email'), self.feedback_quiz_data['email'])
        self.assertEqual(res.data.get('name'), self.feedback_quiz_data['name'])
        self.assertEqual(res.data.get('gender'), self.feedback_quiz_data['gender'])
        self.assertEqual(res.data.get('opinion'), self.feedback_quiz_data['opinion'])

    ######## GET METHODS ########

    def test_get_quiz_punctations_not_authenticated(self):
        res = self.client.get(self.quiz_punctation_list_url, self.quiz_punctation_data, format='json')

        self.assertEqual(res.status_code, 401)

    def test_get_quiz_punctations_not_owner(self):
        res = self.client.get(self.quiz_punctation_list_url, self.quiz_punctation_data,
                              format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token_other}')

        self.assertEqual(res.status_code, 403)

    def test_get_quiz_punctations(self):
        res = self.client.get(self.quiz_punctation_list_url, data={
        }, format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

        self.assertEqual(res.status_code, 200)

    def test_get_sections(self):
        res = self.client.get(self.sections_url)

        self.assertEqual(res.status_code, 200)

    def test_get_categories(self):
        res = self.client.get(self.categories_url)

        self.assertEqual(res.status_code, 200)

    def test_get_quizzes(self):
        res = self.client.get(self.quizzes_list_url)

        self.assertEqual(res.status_code, 200)

    def test_get_quiz_detail(self):
        res = self.client.get(self.quizzes_detail_url)

        self.assertEqual(res.status_code, 200)

    ######## PATCH METHODS ########

    def test_update_quiz_not_authenticated(self):
        res = self.client.patch(self.quizzes_detail_url,
                                self.quizzes_update_data, format='json')

        self.assertEqual(res.status_code, 401)

    def test_update_quiz_not_owner(self):
        res = self.client.patch(self.quizzes_detail_url, self.quizzes_update_data,
                                format='json', HTTP_AUTHORIZATION=f'Bearer {self.access_token_other}')

        self.assertEqual(res.status_code, 403)

    def test_update_quiz(self):
        res = self.client.patch(self.quizzes_detail_url, self.quizzes_update_data,
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
