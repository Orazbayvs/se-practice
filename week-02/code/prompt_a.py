def report(marks, pass_mark=50):
    """A vague, incomplete solution."""
    if not marks:
        return {"avg": 0.0, "high": 0, "low": 0, "pass_pct": 0.0}
    values = [float(m) for m in marks]
    average = sum(values) / len(values)
    return {
        "avg": average,
        "high": max(values),
        "low": min(values),
        "pass_pct": sum(1 for v in values if v >= pass_mark) / len(values)
    }
