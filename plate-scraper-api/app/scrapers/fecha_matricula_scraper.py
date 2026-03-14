import httpx
import re
from typing import Optional
from loguru import logger

from app.scrapers.base import BaseScraper
from app.models.vehicle import VehicleReport, ScraperStatus, SourceResult

class FechaMatriculaScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="FechaMatricula")
        self.url = "https://fechamatricula.es/fs/data/mat-euro.php"
        self.months_map = {
            "enero": "01", "febrero": "02", "marzo": "03", "abril": "04",
            "mayo": "05", "junio": "06", "julio": "07", "agosto": "08",
            "septiembre": "09", "octubre": "10", "noviembre": "11", "diciembre": "12"
        }

    def _parse_spanish_date(self, text: str) -> Optional[str]:
        """
        Parses 'Julio de 2017' to '2017-07-01'
        """
        text = text.lower().strip()
        # Look for 'month de year'
        match = re.search(r'([a-z]+)\s+de\s+(\d{4})', text)
        if match:
            month_name, year = match.groups()
            month_num = self.months_map.get(month_name)
            if month_num:
                return f"{year}-{month_num}-01"
        
        # Fallback for other potential formats like DD/MM/YYYY
        match_dd_mm_yyyy = re.search(r'(\d{2})/(\d{2})/(\d{4})', text)
        if match_dd_mm_yyyy:
            dd, mm, yyyy = match_dd_mm_yyyy.groups()
            return f"{yyyy}-{mm}-{dd}"
            
        return None

    async def fetch(self, plate: str) -> Optional[VehicleReport]:
        logger.info(f"[{self.name}] Starting scraper for plate: {plate}")
        
        # Prepare data (4 numbers + 3 letters)
        # Modern Spanish plate is always 4 numbers + 3 letters
        match = re.match(r'^(\d{4})([A-Z]{3})$', plate)
        if not match:
            logger.warning(f"[{self.name}] Plate format not compatible: {plate}")
            return None
            
        nnumero, nletra = match.groups()
        
        payload = {
            "nnumero": nnumero,
            "nletra": nletra
        }
        
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Referer": "https://fechamatricula.es/"
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(self.url, data=payload, headers=headers)
                
                if response.status_code != 200:
                    logger.error(f"[{self.name}] Error response: {response.status_code}")
                    return None
                
                body = response.text.strip()
                logger.debug(f"[{self.name}] Response body: {body}")
                
                # Format: "4131KCC: Julio de 2017"
                if ":" in body:
                    date_part = body.split(":", 1)[1].strip()
                    normalized_date = self._parse_spanish_date(date_part)
                    
                    if normalized_date:
                        logger.info(f"[{self.name}] Found date: {date_part} -> {normalized_date}")
                        return VehicleReport(
                            plate=plate,
                            normalized_plate=plate,
                            status=ScraperStatus.SUCCESS,
                            registration_date=normalized_date,
                            sources=[SourceResult(source_name=self.name, status=ScraperStatus.SUCCESS)]
                        )
                
                logger.warning(f"[{self.name}] Could not parse date from body: {body}")
                return None

        except Exception as e:
            logger.error(f"[{self.name}] Exception: {str(e)}")
            return None
