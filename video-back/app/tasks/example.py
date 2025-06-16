from app.celery_app import celery_app
import time

@celery_app.task(name="example_task")
def example_task(x: int, y: int) -> int:
    """Example task that adds two numbers after a delay."""
    time.sleep(5)  # Simulate some work
    return x + y 