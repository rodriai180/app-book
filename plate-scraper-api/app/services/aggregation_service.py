import asyncio
import time
from typing import List, Optional, Any
from datetime import datetime
from loguru import logger

from app.models.vehicle import VehicleReport, VehicleQueryResponse, ScraperStatus
from app.scrapers.base import BaseScraper
from app.scrapers.mapfre_registration_scraper import MapfreRegistrationScraper
from app.scrapers.fecha_matricula_scraper import FechaMatriculaScraper
from app.utils.plate_validator import PlateValidator

class AggregationService:
    def __init__(self):
        # Register available scrapers
        self.scrapers: List[BaseScraper] = [
            MapfreRegistrationScraper(),
            FechaMatriculaScraper()
        ]

    async def lookup_plate(self, plate: str) -> VehicleQueryResponse:
        start_time = time.time()
        
        # 1. Validate and normalize
        is_valid, normalized = PlateValidator.validate(plate)
        
        if not is_valid:
            logger.warning(f"Invalid plate format received: {plate}")
            return self._build_error_response(plate, normalized, "Invalid plate format", start_time)

        logger.info(f"Processing lookup for plate: {normalized}")

        # 2. Execute scrapers in parallel
        tasks = [scraper.fetch(normalized) for scraper in self.scrapers]
        reports = await asyncio.gather(*tasks, return_exceptions=True)

        # 3. Consolidate results
        final_report = self._merge_reports(normalized, reports)
        
        duration_ms = int((time.time() - start_time) * 1000)
        
        # 4. Format to output JSON
        return self._format_response(final_report, is_valid, duration_ms)

    def _merge_reports(self, plate: str, results: List[Any]) -> VehicleReport:
        merged = VehicleReport(plate=plate, normalized_plate=plate)
        found_any = False
        
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Scraper error: {result}")
                continue
            
            if result is None:
                continue

            found_any = True
            report: VehicleReport = result
            
            # Merge logic: prioritize non-null values
            if not merged.registration_date and report.registration_date:
                merged.registration_date = report.registration_date
            
            if report.previous_holders:
                merged.previous_holders.extend(report.previous_holders)
            
            if report.transfer_history:
                merged.transfer_history.extend(report.transfer_history)
                
            if report.inspections:
                merged.inspections.extend(report.inspections)
            
            if report.itv_mileage_records:
                merged.itv_mileage_records.extend(report.itv_mileage_records)

            if report.liens.has_liens:
                merged.liens.has_liens = True
                merged.liens.details.extend(report.liens.details)
            
            if report.use_type and not merged.use_type:
                merged.use_type = report.use_type
                
            # Collect sources
            merged.sources.extend(report.sources)

        # Determine final status
        if not found_any:
            merged.status = ScraperStatus.NOT_FOUND
        elif all(s.status == ScraperStatus.SUCCESS for s in merged.sources if s.status != ScraperStatus.UNAVAILABLE):
            merged.status = ScraperStatus.SUCCESS
        else:
            merged.status = ScraperStatus.PARTIAL_SUCCESS

        return merged

    def _format_response(self, report: VehicleReport, is_valid: bool, duration_ms: int) -> VehicleQueryResponse:
        return VehicleQueryResponse(
            plate=report.plate,
            registrationDate=report.registration_date
        )

    def _build_error_response(self, plate: str, normalized: str, error_msg: str, start_time: float) -> VehicleQueryResponse:
        return VehicleQueryResponse(
            plate=plate,
            registrationDate=None
        )
