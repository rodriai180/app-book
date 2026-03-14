import asyncio
import re
from typing import Optional
from datetime import datetime
from playwright.async_api import async_playwright
from loguru import logger

from app.scrapers.base import BaseScraper
from app.models.vehicle import VehicleReport, ScraperStatus, SourceResult

class MapfreRegistrationScraper(BaseScraper):
    def __init__(self):
        super().__init__(name="MapfreRegistration")
        self.url = "https://www.mapfre.es/particulares/seguros-de-coche/calculadora-fecha-matriculacion/"

    def _normalize_date(self, date_str: str) -> Optional[str]:
        """
        Converts MM/YYYY to YYYY-MM-01 or DD/MM/YYYY to YYYY-MM-DD
        """
        date_str = date_str.strip()
        
        # Format MM/YYYY
        match_mm_yyyy = re.match(r'^(\d{2})/(\d{4})$', date_str)
        if match_mm_yyyy:
            mm, yyyy = match_mm_yyyy.groups()
            return f"{yyyy}-{mm}-01"
            
        # Format DD/MM/YYYY
        match_dd_mm_yyyy = re.match(r'^(\d{2})/(\d{2})/(\d{4})$', date_str)
        if match_dd_mm_yyyy:
            dd, mm, yyyy = match_dd_mm_yyyy.groups()
            return f"{yyyy}-{mm}-{dd}"
            
        return None

    async def fetch(self, plate: str) -> Optional[VehicleReport]:
        logger.info(f"[{self.name}] Starting scraper for plate: {plate}")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
            )
            page = await context.new_page()
            
            try:
                # 1. Navigate
                logger.debug(f"[{self.name}] Navigating to {self.url}")
                await page.goto(self.url, wait_until="domcontentloaded", timeout=30000)
                
                # 2. Handle Cookies (OneTrust)
                try:
                    cookie_btn = page.locator("#onetrust-accept-btn-handler")
                    if await cookie_btn.is_visible(timeout=5000):
                        await cookie_btn.click()
                        logger.debug(f"[{self.name}] Cookies accepted.")
                except Exception:
                    logger.debug(f"[{self.name}] No cookie banner found or already accepted.")

                # 3. Find Input and type plate
                # We look for the input that likely takes the license plate
                plate_input = page.locator('input[placeholder*="matrícula"], input[name*="plate"], input#plate')
                
                # If multiple, pick the first visible
                count = await plate_input.count()
                target_input = None
                for i in range(count):
                    if await plate_input.nth(i).is_visible():
                        target_input = plate_input.nth(i)
                        break
                
                if not target_input:
                    logger.error(f"[{self.name}] Plate input not found.")
                    return None

                logger.debug(f"[{self.name}] Input found. Typing plate...")
                await target_input.fill(plate)
                
                # Simulate pressing Enter or wait for dynamic update
                await target_input.press("Enter")
                
                # 4. Wait for result
                # Based on the screenshot, the result appears below the input.
                # It usually looks like "MM/YYYY" or contains "/"
                logger.debug(f"[{self.name}] Waiting for result UI...")
                
                # We wait for an element that contains a date pattern
                # Mapfre's result is often in a specific div or just text that changes.
                # Let's try to locate it by text content or position.
                result_pattern = re.compile(r'\d{2}/\d{4}')
                
                # We wait up to 10s for the text to appear
                # The screenshot shows the date right below the input.
                try:
                    # Generic wait for a date-like string to appear in the page
                    await page.wait_for_function(
                        """
                        (pattern) => {
                            const bodyText = document.body.innerText;
                            const regex = new RegExp(pattern);
                            return regex.test(bodyText);
                        }
                        """,
                        arg=r'\d{2}/\d{4}',
                        timeout=10000
                    )
                except Exception:
                    logger.warning(f"[{self.name}] Timeout waiting for result text.")
                    return None

                # Extract the result
                # We can refine this by looking at the page's innerText
                page_text = await page.inner_text("body")
                matches = re.findall(r'(\d{2}/\d{4})', page_text)
                
                if not matches:
                    # Try DD/MM/YYYY
                    matches = re.findall(r'(\d{2}/\d{2}/\d{4})', page_text)
                
                if matches:
                    raw_date = matches[0]
                    normalized_date = self._normalize_date(raw_date)
                    logger.info(f"[{self.name}] Found date: {raw_date} -> {normalized_date}")
                    
                    return VehicleReport(
                        plate=plate,
                        normalized_plate=plate,
                        status=ScraperStatus.SUCCESS,
                        registration_date=normalized_date,
                        sources=[SourceResult(source_name=self.name, status=ScraperStatus.SUCCESS)]
                    )
                else:
                    logger.warning(f"[{self.name}] No date pattern found in page text.")
                    return None

            except Exception as e:
                logger.error(f"[{self.name}] Error during scraping: {str(e)}")
                return None
            finally:
                await browser.close()
