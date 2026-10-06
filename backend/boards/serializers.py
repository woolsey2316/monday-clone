from rest_framework import serializers

from .models import Board, BoardColumn, CellValue, Group, Item, Workspace


class CellValueSerializer(serializers.ModelSerializer):
    column_id = serializers.IntegerField(source="column.id", read_only=True)

    class Meta:
        model = CellValue
        fields = ("id", "column_id", "value")


class ItemSerializer(serializers.ModelSerializer):
    cells = CellValueSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ("id", "name", "position", "cells", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class GroupSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ("id", "title", "color", "position", "items")


class BoardColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardColumn
        fields = ("id", "title", "type", "position")


class BoardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ("id", "name", "description", "workspace", "created_at", "updated_at")
        read_only_fields = ("workspace", "created_at", "updated_at")


class BoardDetailSerializer(serializers.ModelSerializer):
    columns = BoardColumnSerializer(many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = (
            "id",
            "name",
            "description",
            "workspace",
            "columns",
            "groups",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("workspace", "created_at", "updated_at")


class WorkspaceSerializer(serializers.ModelSerializer):
    boards = BoardListSerializer(many=True, read_only=True)

    class Meta:
        model = Workspace
        fields = ("id", "name", "description", "boards", "created_at", "updated_at")
        read_only_fields = ("created_at", "updated_at")


class CellUpsertSerializer(serializers.Serializer):
    value = serializers.JSONField()
