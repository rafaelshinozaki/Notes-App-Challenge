# Generated manually on 2025-10-24
# Data migration to populate user field for existing categories

from django.db import migrations
from django.conf import settings


def populate_category_user(apps, schema_editor):
    """
    Assign all existing categories (with null user) to the first superuser.
    If no superuser exists, delete orphaned categories.
    """
    Category = apps.get_model('notes', 'Category')
    User = apps.get_model(settings.AUTH_USER_MODEL.split('.')[0], settings.AUTH_USER_MODEL.split('.')[1])
    
    # Get all categories with null user
    categories_without_user = Category.objects.filter(user__isnull=True)
    
    if categories_without_user.exists():
        # Try to get the first superuser
        superuser = User.objects.filter(is_superuser=True).first()
        
        if superuser:
            # Assign all categories to this superuser
            categories_without_user.update(user=superuser)
        else:
            # If no superuser exists, assign to the first user
            first_user = User.objects.first()
            if first_user:
                categories_without_user.update(user=first_user)
            else:
                # If no users exist at all, delete orphaned categories
                # They will be recreated by create_init_objects command
                categories_without_user.delete()


def reverse_populate_category_user(apps, schema_editor):
    """
    Reverse migration - set user to null for all categories
    """
    Category = apps.get_model('notes', 'Category')
    Category.objects.all().update(user=None)


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0003_category_user_unique_category_per_user'),
    ]

    operations = [
        migrations.RunPython(populate_category_user, reverse_populate_category_user),
    ]

