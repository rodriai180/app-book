from abc import ABC, abstractmethod
from typing import Optional
from app.models.vehicle import VehicleReport, SourceResult, ScraperStatus
from datetime import datetime

class BaseScraper(ABC):
    """
    Base class for all scrapers.
    Each scraper must implement the fetch method.
    """
    
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def fetch(self, plate: str) -> Optional[VehicleReport]:
        """
        Fetches data for a given plate.
        Should handle its own exceptions and return None or a partial report.
        """
        pass

    def create_empty_report(self, plate: str, normalized_plate: str) -> VehicleReport:
        """
        Helper to create an empty report for this source.
        """
        return VehicleReport(
            plate=plate,
            normalized_plate=normalized_plate,
            status=ScraperStatus.NOT_FOUND,
            sources=[SourceResult(source_name=self.name, status=ScraperStatus.NOT_FOUND)]
        )
