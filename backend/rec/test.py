# test_flask.py
import flask
print(f"Flask version: {flask.__version__}")
print(f"Blueprint available: {'Blueprint' in dir(flask)}")