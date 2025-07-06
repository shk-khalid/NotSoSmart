from .models import Category

def suggest_category(title: str, description: str) -> str:
    text = f"{title} {description}".lower()
    # Pull all category names
    for cat in Category.objects.all():
        name = cat.name.lower()
        if name in text:
            return cat.name
    # Fallback
    return "Uncategorized"