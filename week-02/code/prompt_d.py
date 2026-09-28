def analyze_marks(marks, pass_mark=50):
    """Correct implementation matching the test harness."""
    if not marks:
        raise ValueError("marks cannot be empty")

    values = []
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("marks must all be numeric and within 0 to 100")
        if mark < 0 or mark > 100:
            raise ValueError("marks must all be numeric and within 0 to 100")
        values.append(float(mark))

    average = sum(values) / len(values)
    highest = max(values)
    lowest = min(values)
    pass_rate = round((sum(1 for v in values if v >= pass_mark) / len(values)) * 100, 2)
    return {"average": average, "highest": highest, "lowest": lowest, "pass_rate": pass_rate}
