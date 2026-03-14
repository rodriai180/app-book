import re
from typing import Optional, Tuple

class PlateValidator:
    """
    Validator for Spanish license plates.
    Supports modern format (4 numbers + 3 letters).
    """
    
    # Modern Spanish plate: 1234BBB (since 2000)
    MODERN_PATTERN = re.compile(r'^(\d{4})([BCDFGHJKLMNPQRSTVWXYZ]{3})$')
    
    @staticmethod
    def normalize(plate: str) -> str:
        """
        Removes spaces and hyphens, converts to uppercase.
        """
        return re.sub(r'[\s\-]', '', plate).upper()

    @classmethod
    def validate(cls, plate: str) -> Tuple[bool, Optional[str]]:
        """
        Validates the plate and returns (is_valid, normalized_plate).
        """
        normalized = cls.normalize(plate)
        
        if cls.MODERN_PATTERN.match(normalized):
            return True, normalized
        
        # Add support for older formats if needed, e.g., M-1234-AB
        # For now, we strictly follow the requested modern format validation.
        
        return False, normalized
