# Generated manually on 2025-10-24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('notes', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='user',
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE, 
                related_name='categories', 
                to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddConstraint(
            model_name='category',
            constraint=models.UniqueConstraint(
                fields=['user', 'name'], 
                name='unique_category_per_user'
            ),
        ),
    ]

