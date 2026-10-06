from django.contrib import admin

from .models import Board, BoardColumn, CellValue, Group, Item, Workspace

admin.site.register(Workspace)
admin.site.register(Board)
admin.site.register(BoardColumn)
admin.site.register(Group)
admin.site.register(Item)
admin.site.register(CellValue)
