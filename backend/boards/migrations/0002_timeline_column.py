from django.db import migrations, models


def add_timeline_columns(apps, schema_editor):
    Board = apps.get_model("boards", "Board")
    BoardColumn = apps.get_model("boards", "BoardColumn")
    for board in Board.objects.all():
        if board.columns.filter(type="timeline").exists():
            continue
        next_position = board.columns.count()
        BoardColumn.objects.create(
            board=board,
            title="Timeline",
            type="timeline",
            position=next_position,
        )


def remove_timeline_columns(apps, schema_editor):
    BoardColumn = apps.get_model("boards", "BoardColumn")
    BoardColumn.objects.filter(type="timeline").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("boards", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="boardcolumn",
            name="type",
            field=models.CharField(
                choices=[
                    ("status", "Status"),
                    ("text", "Text"),
                    ("timeline", "Timeline"),
                ],
                max_length=20,
            ),
        ),
        migrations.RunPython(add_timeline_columns, remove_timeline_columns),
    ]
