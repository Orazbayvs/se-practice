def analyze_marks(marks, pass_mark=50):
    """Example-based version with a pass_rate ratio instead of a percentage."""
    if not marks:
        raise ValueError("marks cannot be empty")

    values = []
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("marks must all be numeric and within 0 to 100")
        if mark < 0 or mark > 100:
            raise ValueError("marks must all be numeric and within 0 to 100")
        values.append(float(mark))

    avg = sum(values) / len(values)
    pass_rate = sum(1 for v in values if v >= pass_mark) / len(values)
    return {"average": avg, "highest": max(values), "lowest": min(values), "pass_rate": pass_rate}
