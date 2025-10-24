from rest_framework import serializers
from api.notes.models import Note, Category


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model
    """

    note_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'color', 'note_count')
        read_only_fields = ('id', 'note_count')

    def validate_name(self, value):
        """
        Validate that category name is unique for this user
        """
        user = self.context['request'].user
        name = value.strip()
        
        # Check if updating existing category
        if self.instance:
            # Exclude current instance from uniqueness check
            if Category.objects.filter(user=user, name=name).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("You already have a category with this name.")
        else:
            # Check for new category
            if Category.objects.filter(user=user, name=name).exists():
                raise serializers.ValidationError("You already have a category with this name.")
        
        return name

    def create(self, validated_data):
        """
        Create category with authenticated user
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NoteSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Note
        fields = (
            'id', 'title', 'content', 'category', 'category_id',
            'created_at', 'updated_at', 'user_id'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'user_id')

    def validate_category_id(self, value):
        user = self.context['request'].user
        try:
            category = Category.objects.get(id=value, user=user)
            return value
        except Category.DoesNotExist:
            raise serializers.ValidationError("Invalid category ID or category does not belong to you")

    def create(self, validated_data):
        category_id = validated_data.pop('category_id')
        user = self.context['request'].user
        category = Category.objects.get(id=category_id, user=user)
        return Note.objects.create(
            category=category,
            **validated_data
        )

    def update(self, instance, validated_data):
        # Validate category_id if provided
        if 'category_id' in validated_data:
            category_id = validated_data.pop('category_id')
            user = self.context['request'].user
            try:
                category = Category.objects.get(id=category_id, user=user)
                instance.category = category
            except Category.DoesNotExist:
                raise serializers.ValidationError({
                    "category_id": "Invalid category ID or category does not belong to you"
                })
        
        # Update other fields
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance
