import logging, sys

logger = logging.Logger('uvicorn.error')

def get_logger(class_name: str):
    adapter = logging.LoggerAdapter(logger, {'class_name': class_name})
    adapter.process = lambda msg, kwargs: (f'[{class_name}] {msg}', kwargs)
    return adapter