# Spanish Plate Scraper API

Professional vehicle data extraction system for Spanish license plates.

## Architecture
The project follows a modular architecture designed for scalability and maintainability:

- **Scrapers**: Decoupled providers for different data sources.
- **Services**: Aggregation and merging logic.
- **Models**: Pydantic models for data normalization and validation.
- **API**: FastAPI endpoints for easy integration.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python -m app.main
   ```

3. Access the API documentation:
   Open `http://localhost:8000/docs` in your browser.

## Features
- **Validation**: Strict validation for modern Spanish license plates (4 numbers + 3 letters).
- **Parallel Execution**: Scrapers run in parallel to minimize response time.
- **Normalization**: Consistently returns a standard JSON structure even if some sources fail.
- **Logging**: Detailed logs using `loguru`.

## Example
**Input:** `4131KCC`
**Output:** Standardized JSON with registration date, previous holders, inspections, and more.
