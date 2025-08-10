"""
Utility functions for the troubleshooting bot system
Includes logging, circuit breaker, retry logic, and helper functions
"""

import asyncio
import functools
import hashlib
import json
import logging
import time
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import Any, Callable, Dict, List, Optional, TypeVar, Union
from urllib.parse import urljoin

import aiohttp
import structlog
from config import config, LogLevel

# Type definitions
T = TypeVar('T')


class CircuitBreaker:
    """Circuit breaker implementation for fault tolerance"""
    
    def __init__(self, failure_threshold: int = 5, timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    async def call(self, func: Callable[..., T], *args, **kwargs) -> T:
        """Execute function with circuit breaker protection"""
        if self.state == "OPEN":
            if self._should_attempt_reset():
                self.state = "HALF_OPEN"
            else:
                raise CircuitBreakerOpenError("Circuit breaker is OPEN")
        
        try:
            result = await func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt reset"""
        if self.last_failure_time is None:
            return True
        return time.time() - self.last_failure_time >= self.timeout
    
    def _on_success(self):
        """Handle successful execution"""
        self.failure_count = 0
        self.state = "CLOSED"
    
    def _on_failure(self):
        """Handle failed execution"""
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"


class CircuitBreakerOpenError(Exception):
    """Exception raised when circuit breaker is open"""
    pass


def retry_async(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """Async retry decorator with exponential backoff"""
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs) -> T:
            last_exception = None
            current_delay = delay
            
            for attempt in range(max_attempts):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        await asyncio.sleep(current_delay)
                        current_delay *= backoff
                    
            raise last_exception
        return wrapper
    return decorator


class StructuredLogger:
    """Structured logger setup for the troubleshooting system"""
    
    @staticmethod
    def setup_logging():
        """Configure structured logging"""
        # Configure structlog
        structlog.configure(
            processors=[
                structlog.stdlib.filter_by_level,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.stdlib.PositionalArgumentsFormatter(),
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.processors.StackInfoRenderer(),
                structlog.processors.format_exc_info,
                structlog.processors.UnicodeDecoder(),
                structlog.processors.JSONRenderer()
            ],
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )
        
        # Configure standard logging
        logging.basicConfig(
            format="%(message)s",
            level=getattr(logging, config.log_level.value),
            filename=config.log_file_path
        )
    
    @staticmethod
    def get_logger(name: str):
        """Get a structured logger instance"""
        return structlog.get_logger(name)


class AsyncHTTPClient:
    """Async HTTP client with retry and circuit breaker"""
    
    def __init__(self):
        self.circuit_breaker = CircuitBreaker(
            failure_threshold=config.circuit_breaker_threshold,
            timeout=config.circuit_breaker_timeout
        )
        self.logger = StructuredLogger.get_logger("http_client")
    
    @asynccontextmanager
    async def session(self):
        """Async context manager for HTTP session"""
        timeout = aiohttp.ClientTimeout(total=30)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            yield session
    
    @retry_async(max_attempts=3, delay=1.0, backoff=2.0)
    async def get(self, url: str, headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Perform GET request with retry and circuit breaker"""
        return await self.circuit_breaker.call(self._get, url, headers)
    
    async def _get(self, url: str, headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Internal GET implementation"""
        async with self.session() as session:
            self.logger.info("Making GET request", url=url)
            
            async with session.get(url, headers=headers) as response:
                if response.status >= 400:
                    raise aiohttp.ClientResponseError(
                        request_info=response.request_info,
                        history=response.history,
                        status=response.status,
                        message=f"HTTP {response.status}"
                    )
                
                try:
                    return await response.json()
                except json.JSONDecodeError:
                    return {"text": await response.text()}
    
    @retry_async(max_attempts=3, delay=1.0, backoff=2.0) 
    async def post(self, url: str, data: Dict[str, Any], 
                  headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Perform POST request with retry and circuit breaker"""
        return await self.circuit_breaker.call(self._post, url, data, headers)
    
    async def _post(self, url: str, data: Dict[str, Any],
                   headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Internal POST implementation"""
        async with self.session() as session:
            self.logger.info("Making POST request", url=url)
            
            async with session.post(url, json=data, headers=headers) as response:
                if response.status >= 400:
                    raise aiohttp.ClientResponseError(
                        request_info=response.request_info,
                        history=response.history,
                        status=response.status,
                        message=f"HTTP {response.status}"
                    )
                
                try:
                    return await response.json()
                except json.JSONDecodeError:
                    return {"text": await response.text()}


class BVStudiosAPI:
    """API client for BV Studios platform"""
    
    def __init__(self):
        self.base_url = config.bv_studios_base_url
        self.endpoints = config.admin_api_endpoints
        self.client = AsyncHTTPClient()
        self.logger = StructuredLogger.get_logger("bv_studios_api")
    
    def _build_url(self, endpoint: str) -> str:
        """Build full URL for endpoint"""
        return urljoin(self.base_url, endpoint)
    
    async def get_system_health(self) -> Dict[str, Any]:
        """Get system health information"""
        url = self._build_url(self.endpoints["health"])
        try:
            return await self.client.get(url)
        except Exception as e:
            self.logger.error("Failed to get system health", error=str(e))
            return {"error": str(e), "status": "unavailable"}
    
    async def get_recent_logs(self, limit: int = 50) -> Dict[str, Any]:
        """Get recent system logs"""
        url = self._build_url(f"{self.endpoints['logs']}?limit={limit}")
        try:
            return await self.client.get(url)
        except Exception as e:
            self.logger.error("Failed to get recent logs", error=str(e))
            return {"logs": [], "error": str(e)}
    
    async def test_database_connection(self) -> Dict[str, Any]:
        """Test database connectivity"""
        url = self._build_url(self.endpoints["database"])
        try:
            return await self.client.post(url, {"type": "health-check"})
        except Exception as e:
            self.logger.error("Failed to test database", error=str(e))
            return {"success": False, "error": str(e)}
    
    async def test_bot_operations(self) -> Dict[str, Any]:
        """Test bot operations"""
        results = {}
        
        # Test each bot endpoint
        for bot_name, endpoint in self.endpoints.items():
            if bot_name in ["content", "lead"]:
                url = self._build_url(endpoint)
                try:
                    # Try a simple health check operation
                    result = await self.client.post(url, {"type": "health-check"})
                    results[bot_name] = {"status": "healthy", "result": result}
                except Exception as e:
                    results[bot_name] = {"status": "error", "error": str(e)}
        
        return results


def generate_session_id() -> str:
    """Generate unique session ID"""
    timestamp = datetime.utcnow().isoformat()
    hash_input = f"{timestamp}_{time.time()}"
    return hashlib.md5(hash_input.encode()).hexdigest()[:12]


def calculate_execution_time(start_time: datetime) -> float:
    """Calculate execution time in seconds"""
    return (datetime.utcnow() - start_time).total_seconds()


def sanitize_error_message(error: Exception) -> str:
    """Sanitize error message for logging"""
    error_msg = str(error)
    # Remove sensitive information
    sensitive_patterns = [
        r'password=\w+',
        r'token=\w+', 
        r'key=\w+',
        r'secret=\w+'
    ]
    
    import re
    for pattern in sensitive_patterns:
        error_msg = re.sub(pattern, pattern.split('=')[0] + '=***', error_msg, flags=re.IGNORECASE)
    
    return error_msg


def format_duration(seconds: float) -> str:
    """Format duration in human readable format"""
    if seconds < 1:
        return f"{seconds * 1000:.0f}ms"
    elif seconds < 60:
        return f"{seconds:.1f}s"
    else:
        minutes = int(seconds // 60)
        remaining_seconds = seconds % 60
        return f"{minutes}m {remaining_seconds:.1f}s"


def extract_error_patterns(logs: List[Dict[str, Any]]) -> List[str]:
    """Extract common error patterns from logs"""
    error_patterns = []
    
    for log in logs:
        if log.get("status") == "error" and "data" in log:
            try:
                log_data = json.loads(log["data"]) if isinstance(log["data"], str) else log["data"]
                if "error" in log_data:
                    error_patterns.append(log_data["error"])
            except (json.JSONDecodeError, KeyError):
                continue
    
    # Remove duplicates while preserving order
    seen = set()
    unique_patterns = []
    for pattern in error_patterns:
        if pattern not in seen:
            seen.add(pattern)
            unique_patterns.append(pattern)
    
    return unique_patterns[:10]  # Return top 10 patterns


def is_critical_error(error_message: str) -> bool:
    """Determine if error message indicates critical issue"""
    critical_keywords = [
        "database", "connection", "timeout", "crash", "fatal",
        "critical", "emergency", "down", "unavailable", "failed to start"
    ]
    
    error_lower = error_message.lower()
    return any(keyword in error_lower for keyword in critical_keywords)


def prioritize_issues(issues: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Prioritize issues based on severity and impact"""
    severity_order = {
        "critical": 5,
        "high": 4, 
        "medium": 3,
        "low": 2,
        "info": 1
    }
    
    def priority_score(issue):
        severity_score = severity_order.get(issue.get("severity", "low"), 1)
        
        # Boost score for certain issue types
        issue_type = issue.get("type", "")
        if "database" in issue_type:
            severity_score += 1
        elif "authentication" in issue_type:
            severity_score += 1
        
        return severity_score
    
    return sorted(issues, key=priority_score, reverse=True)


# Global HTTP client instance
http_client = AsyncHTTPClient()
bv_studios_api = BVStudiosAPI()

# Setup logging
StructuredLogger.setup_logging()