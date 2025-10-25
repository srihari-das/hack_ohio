## CSE5914 Backend

## Requirements

- Python 3.13 (matches `.python-version` and `pyproject.toml`)
- Poetry (dependency and environment manager)

```bash
# Verify Python version is 3.13+
python3 --version

# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -
```

## Setup

```bash
# install deps into a virtualenv
poetry install

# Install poetry shell
poetry self add poetry-plugin-shell

# activate the venv
poetry shell
```

## Run (development)

```bash
# With an active poetry shell
uvicorn app.main:app --reload
```

Visit:

- Local API: http://127.0.0.1:8000/
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Configuration

Settings are managed with `pydantic-settings` and loaded from environment variables and `.env` at the project root.

Current settings (see `app/core/config.py`):

Example `.env`:

```bash
GOOGLE_API_KEY=true
```

## Testing and code quality

```bash
# Lint (ruff)
poetry run ruff check . --fix

# Format (black)
poetry run black .
```
