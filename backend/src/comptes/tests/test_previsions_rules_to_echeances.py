import datetime

from django.test import SimpleTestCase

from comptes.models import PrevisionRules
from comptes.services.prevision import rules_to_echeances


class PrevisionRuleToEcheancesTestCase(SimpleTestCase):

    def test_rule_to_echeances_1(self):
        rules = []

        rules.append([])
        rules[0] = PrevisionRules()
        rules[0].categorie_id = 1
        rules[0].period = 1
        rules[0].amount = 280.00
        rules[0].start = datetime.date(2023, 11, 1)
        rules[0].end = None

        rules.append([])
        rules[1] = PrevisionRules()
        rules[1].categorie_id = 24
        rules[1].period = 3
        rules[1].amount = 25.00
        rules[1].start = datetime.date(2023, 11, 1)
        rules[1].end = None

        rules.append([])
        rules[2] = PrevisionRules()
        rules[2].categorie_id = 13
        rules[2].period = 1
        rules[2].amount = 600.00
        rules[2].start = datetime.date(2023, 11, 1)
        rules[2].end = None

        rules.append([])
        rules[3] = PrevisionRules()
        rules[3].categorie_id = 20
        rules[3].period = 1
        rules[3].amount = 538.70
        rules[3].start = datetime.date(2023, 11, 1)
        rules[3].end = None

        rules.append([])
        rules[4] = PrevisionRules()
        rules[4].categorie_id = 105
        rules[4].period = 12
        rules[4].amount = -180.00
        rules[4].start = datetime.date(2024, 10, 1)
        rules[4].end = None

        result = []
        for r in rules:
            result += rules_to_echeances(r, datetime.date(2024, 1, 1), 12)

        expected = [
            {
                "date": datetime.date(2024, 1, 1),
                "amount": 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 2, 1),
                "amount": 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 3, 1),
                "amount": 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 4, 1),
                "amount": 280.0,
                "categoryId": 1,
            },

            {
                "date": datetime.date(2024, 5, 1),
                "amount": 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 6, 1),
                "amount": 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 7, 1),
                "amount": 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 8, 1),
                "amount": 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 9, 1),
                "amount": 280.0,
                "categoryId": 1,
            },

            {
                "date": datetime.date(2024, 10, 1),
                "amount": 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 11, 1),
                'amount': 280.0,
                "categoryId": 1,
            },
            {
                "date": datetime.date(2024, 12, 1),
                "amount": 280.0,
                "categoryId": 1,
            },

            {
                "date": datetime.date(2024, 2, 1),
                'amount': 25.0,
                "categoryId": 24,
            },

            {
                "date": datetime.date(2024, 5, 1),
                "amount": 25.0,
                "categoryId": 24,
            },

            {
                "date": datetime.date(2024, 8, 1),
                "amount": 25.0,
                "categoryId": 24,
            },

            {
                "date": datetime.date(2024, 11, 1),
                "amount": 25.0,
                "categoryId": 24,
            },

            {
                "date": datetime.date(2024, 1, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 2, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 3, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 4, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 5, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 6, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 7, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 8, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                'date': datetime.date(2024, 9, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 10, 1),
                "amount": 600.0,
                "categoryId": 13,
            },
            {
                "date": datetime.date(2024, 11, 1),
                "amount": 600.0,
                "categoryId": 13,
            },
            {
                "date": datetime.date(2024, 12, 1),
                "amount": 600.0,
                "categoryId": 13,
            },

            {
                "date": datetime.date(2024, 1, 1),
                "amount": 538.7,
                "categoryId": 20,
            },

            {
                "date": datetime.date(2024, 2, 1),
                "amount": 538.7,
                "categoryId": 20,
            },
            {
                "date": datetime.date(2024, 3, 1),
                "amount": 538.7,
                "categoryId": 20,
            },
            {
                "date": datetime.date(2024, 4, 1),
                "amount": 538.7,
                "categoryId": 20,
            },

            {
                "date": datetime.date(2024, 5, 1),
                "amount": 538.7,
                "categoryId": 20,
            },
            {
                "date": datetime.date(2024, 6, 1),
                "amount": 538.7,
                "categoryId": 20,
            },

            {
                "date": datetime.date(2024, 7, 1),
                "amount": 538.7,
                "categoryId": 20,
            },

            {
                "date": datetime.date(2024, 8, 1),
                "amount": 538.7,
                "categoryId": 20,
            },
            {
                "date": datetime.date(2024, 9, 1),
                "amount": 538.7,
                "categoryId": 20,
            },
            {
                "date": datetime.date(2024, 10, 1),
                "amount": 538.7,
                "categoryId": 20,
            },

            {
                "date": datetime.date(2024, 11, 1),
                "amount": 538.7,
                "categoryId": 20,
            },
            {
                "date": datetime.date(2024, 12, 1),
                "amount": 538.7,
                "categoryId": 20,
            },
            {
                "date": datetime.date(2024, 10, 1),
                "amount": -180.0,
                "categoryId": 105,
            },

        ]

        self.assertEqual(result, expected)
