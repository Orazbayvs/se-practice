def analyze_marks(marks, pass_mark=50):
    """Structured but still incomplete: wrong keys and wrong pass_rate semantics."""
    if not marks:
        return {"avg": 0.0, "high": 0, "low": 0, "pass_rate": 0.0}

    values = []
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("marks must be numeric")
        if mark < 0 or mark > 100:
            raise ValueError("marks must be between 0 and 100")
        values.append(float(mark))

    avg = sum(values) / len(values)
    pass_rate = sum(1 for v in values if v >= pass_mark) / len(values)
    return {"avg": avg, "high": max(values), "low": min(values), "pass_rate": pass_rate}
