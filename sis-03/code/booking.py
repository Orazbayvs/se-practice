def can_book(start, end, now, blocked, existing):
    """Return whether the requested time is valid and available."""
    if (isinstance(start, bool) or not isinstance(start, int)
            or isinstance(end, bool) or not isinstance(end, int)):
        return False

    if not (0 <= start < end <= 1440 and start > now):
        return False

    if end - start > 120:
        return False

    if blocked:
        return False

    for existing_start, existing_end in existing:
        if start < existing_end and existing_start < end:
            return False

    return True
