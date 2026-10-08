from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Board, BoardColumn, CellValue, Group, Item, Workspace
from .serializers import (
    BoardDetailSerializer,
    BoardListSerializer,
    CellUpsertSerializer,
    CellValueSerializer,
    GroupSerializer,
    ItemSerializer,
    WorkspaceSerializer,
)


def seed_board_defaults(board: Board) -> None:
    BoardColumn.objects.create(
        board=board,
        title="Status",
        type=BoardColumn.ColumnType.STATUS,
        position=0,
    )
    BoardColumn.objects.create(
        board=board,
        title="Text",
        type=BoardColumn.ColumnType.TEXT,
        position=1,
    )
    BoardColumn.objects.create(
        board=board,
        title="Timeline",
        type=BoardColumn.ColumnType.TIMELINE,
        position=2,
    )
    Group.objects.create(
        board=board,
        title="New Group",
        color="#579bfc",
        position=0,
    )


class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(owner=self.request.user).prefetch_related(
            "boards"
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class WorkspaceBoardViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated]

    def get_workspace(self):
        return get_object_or_404(
            Workspace,
            pk=self.kwargs["workspace_pk"],
            owner=self.request.user,
        )

    def get_queryset(self):
        return Board.objects.filter(workspace=self.get_workspace())

    def get_serializer_class(self):
        if self.action == "list":
            return BoardListSerializer
        return BoardListSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        board = serializer.save(workspace=self.get_workspace())
        seed_board_defaults(board)


class BoardViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    serializer_class = BoardDetailSerializer

    def get_queryset(self):
        return (
            Board.objects.filter(workspace__owner=self.request.user)
            .prefetch_related("columns", "groups__items__cells__column")
        )


class BoardGroupCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, board_pk):
        board = get_object_or_404(
            Board,
            pk=board_pk,
            workspace__owner=request.user,
        )
        next_position = board.groups.count()
        serializer = GroupSerializer(
            data={
                "title": request.data.get("title", "New Group"),
                "color": request.data.get("color", "#579bfc"),
                "position": request.data.get("position", next_position),
            }
        )
        serializer.is_valid(raise_exception=True)
        group = Group.objects.create(board=board, **serializer.validated_data)
        return Response(GroupSerializer(group).data, status=status.HTTP_201_CREATED)


class GroupViewSet(
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer

    def get_queryset(self):
        return Group.objects.filter(board__workspace__owner=self.request.user)


class GroupItemCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, group_pk):
        group = get_object_or_404(
            Group,
            pk=group_pk,
            board__workspace__owner=request.user,
        )
        next_position = group.items.count()
        name = request.data.get("name", "New Item")
        item = Item.objects.create(
            group=group,
            name=name,
            position=request.data.get("position", next_position),
        )
        return Response(ItemSerializer(item).data, status=status.HTTP_201_CREATED)


class ItemViewSet(
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer

    def get_queryset(self):
        return Item.objects.filter(
            group__board__workspace__owner=self.request.user
        ).prefetch_related("cells")


class CellUpsertView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, item_pk, column_id):
        item = get_object_or_404(
            Item,
            pk=item_pk,
            group__board__workspace__owner=request.user,
        )
        column = get_object_or_404(BoardColumn, pk=column_id, board=item.group.board)
        serializer = CellUpsertSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cell, _ = CellValue.objects.update_or_create(
            item=item,
            column=column,
            defaults={"value": serializer.validated_data["value"]},
        )
        return Response(CellValueSerializer(cell).data)
