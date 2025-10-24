from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.notes.models import Category

class Command(BaseCommand):
    help = "Creates a superuser with a predefined password (for testing only)."

    def handle(self, *args, **kwargs):
        User = get_user_model()
        username = "admin@example.com"
        email = "admin@example.com"
        password = "123456789ABC"

        if not User.objects.filter(username=username).exists():
            user = User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' created successfully!"))
        else:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.WARNING(f"Superuser '{username}' already exists."))


        default_categories = [
            {"name": "Random Thoughts", "color": "#EF9C66"},
            {"name": "School", "color": "#FCDC94"},
            {"name": "Personal", "color": "#78ABA8"}
        ]
          
        try:
            for category in default_categories:
                obj, created = Category.objects.get_or_create(
                    user=user,
                    name=category["name"],
                    defaults={"color": category["color"]}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Category '{category['name']}' created successfully for user '{username}'!"))
                else:
                    self.stdout.write(self.style.WARNING(f"Category '{category['name']}' already exists for user '{username}'."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to create default categories: {str(e)}"))
