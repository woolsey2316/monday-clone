from django.conf import settings
from django.db import models


class Workspace(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workspaces",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Board(models.Model):
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="boards",
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class BoardColumn(models.Model):
    class ColumnType(models.TextChoices):
        STATUS = "status", "Status"
        TEXT = "text", "Text"

    board = models.ForeignKey(
        Board,
        on_delete=models.CASCADE,
        related_name="columns",
    )
    title = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=ColumnType.choices)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return f"{self.title} ({self.type})"


class Group(models.Model):
    board = models.ForeignKey(
        Board,
        on_delete=models.CASCADE,
        related_name="groups",
    )
    title = models.CharField(max_length=255)
    color = models.CharField(max_length=20, default="#579bfc")
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return self.title


class Item(models.Model):
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="items",
    )
    name = models.CharField(max_length=255)
    position = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["position", "id"]

    def __str__(self):
        return self.name


class CellValue(models.Model):
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name="cells",
    )
    column = models.ForeignKey(
        BoardColumn,
        on_delete=models.CASCADE,
        related_name="cells",
    )
    value = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ("item", "column")

    def __str__(self):
        return f"{self.item_id}:{self.column_id}"
