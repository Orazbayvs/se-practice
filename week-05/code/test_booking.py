import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_partial_overlap_is_rejected(self):
        self.assertIs(can_book(630, 690, 540, False, [(600, 660)]), False)

    def test_blocked_room_is_rejected(self):
        self.assertIs(can_book(660, 720, 540, True, [(600, 660)]), False)

    def test_exactly_two_hours_is_allowed(self):
        self.assertIs(can_book(720, 840, 540, False, [(600, 660)]), True)

    def test_over_two_hours_is_rejected(self):
        self.assertIs(can_book(720, 841, 540, False, [(600, 660)]), False)

    def test_starting_now_is_rejected(self):
        self.assertIs(can_book(540, 570, 540, False, [(600, 660)]), False)

    def test_zero_length_is_rejected(self):
        self.assertIs(can_book(600, 600, 540, False, [(700, 760)]), False)

    def test_reversed_interval_is_rejected(self):
        self.assertIs(can_book(660, 600, 540, False, [(700, 760)]), False)

    def test_end_at_1440_is_allowed(self):
        self.assertIs(can_book(1380, 1440, 540, False, []), True)

    def test_end_after_1440_is_rejected(self):
        self.assertIs(can_book(1380, 1441, 540, False, []), False)

    def test_empty_existing_bookings_allow_request(self):
        self.assertIs(can_book(600, 660, 540, False, []), True)

    def test_overlap_with_second_of_several_bookings_is_rejected(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        self.assertIs(can_book(720, 780, 540, False, existing), False)

    def test_request_containing_existing_booking_is_rejected(self):
        self.assertIs(can_book(570, 690, 540, False, [(600, 660)]), False)

    def test_touching_existing_start_is_allowed(self):
        self.assertIs(can_book(570, 600, 540, False, [(600, 660)]), True)

    def test_existing_is_unchanged_after_success(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        before = list(existing)
        self.assertIs(can_book(780, 840, 540, False, existing), True)
        self.assertEqual(existing, before)

    def test_existing_is_unchanged_after_rejection(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        before = list(existing)
        self.assertIs(can_book(610, 650, 540, False, existing), False)
        self.assertEqual(existing, before)

    def test_non_integer_start_returns_false_by_declared_assumption(self):
        self.assertIs(can_book(600.5, 660, 540, False, []), False)

    def test_integer_subclass_is_accepted(self):
        class Minute(int):
            pass

        self.assertIs(can_book(Minute(600), Minute(660), 540, False, []), True)

    def test_boolean_start_returns_false_by_declared_assumption(self):
        self.assertIs(can_book(True, 61, 0, False, []), False)
