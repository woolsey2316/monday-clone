from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BoardGroupCreateView,
    BoardViewSet,
    CellUpsertView,
    GroupItemCreateView,
    GroupViewSet,
    ItemViewSet,
    WorkspaceBoardViewSet,
    WorkspaceViewSet,
)

router = DefaultRouter()
router.register("workspaces", WorkspaceViewSet, basename="workspace")
router.register("boards", BoardViewSet, basename="board")
router.register("groups", GroupViewSet, basename="group")
router.register("items", ItemViewSet, basename="item")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "workspaces/<int:workspace_pk>/boards/",
        WorkspaceBoardViewSet.as_view({"get": "list", "post": "create"}),
        name="workspace-boards",
    ),
    path(
        "boards/<int:board_pk>/groups/",
        BoardGroupCreateView.as_view(),
        name="board-groups",
    ),
    path(
        "groups/<int:group_pk>/items/",
        GroupItemCreateView.as_view(),
        name="group-items",
    ),
    path(
        "items/<int:item_pk>/cells/<int:column_id>/",
        CellUpsertView.as_view(),
        name="item-cell",
    ),
]
