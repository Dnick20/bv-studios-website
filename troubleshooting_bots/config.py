"""
Configuration module for the Troubleshooting Bot System
Handles environment variables, settings, and system configuration
"""

import os
from pathlib import Path
from typing import Optional, Dict, Any
from pydantic import Field, validator
from pydantic_settings import BaseSettings
from enum import Enum


class LogLevel(str, Enum):
    """Logging levels enumeration"""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class TroubleshootingConfig(BaseSettings):
    """Main configuration class for the troubleshooting system"""
    
    # API Configuration
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    agentops_api_key: Optional[str] = Field(None, env="AGENTOPS_API_KEY")
    
    # BV Studios Database Configuration  
    database_url: str = Field(..., env="DATABASE_URL")
    database_max_connections: int = Field(10, env="DATABASE_MAX_CONNECTIONS")
    
    # System Configuration
    max_retry_attempts: int = Field(3, env="MAX_RETRY_ATTEMPTS")
    circuit_breaker_threshold: int = Field(5, env="CIRCUIT_BREAKER_THRESHOLD")
    circuit_breaker_timeout: int = Field(60, env="CIRCUIT_BREAKER_TIMEOUT")
    
    # Logging Configuration
    log_level: LogLevel = Field(LogLevel.INFO, env="LOG_LEVEL")
    log_file_path: Optional[str] = Field(None, env="LOG_FILE_PATH")
    enable_structured_logging: bool = Field(True, env="ENABLE_STRUCTURED_LOGGING")
    
    # Bot Configuration
    diagnostic_timeout: int = Field(30, env="DIAGNOSTIC_TIMEOUT")
    fix_timeout: int = Field(60, env="FIX_TIMEOUT")
    verification_timeout: int = Field(20, env="VERIFICATION_TIMEOUT")
    
    # BV Studios Specific
    bv_studios_base_url: str = Field(
        "https://bv-studios-website-9100d7w18-dominic-lewis-projects-bb97ca42.vercel.app",
        env="BV_STUDIOS_BASE_URL"
    )
    admin_api_endpoints: Dict[str, str] = {
        "health": "/api/admin/bots/health",
        "logs": "/api/admin/bots/logs",
        "database": "/api/admin/bots/database",
        "content": "/api/admin/bots/content",
        "lead": "/api/admin/bots/lead"
    }
    
    # Monitoring Configuration
    enable_agentops: bool = Field(True, env="ENABLE_AGENTOPS")
    enable_performance_metrics: bool = Field(True, env="ENABLE_PERFORMANCE_METRICS")
    metrics_collection_interval: int = Field(10, env="METRICS_COLLECTION_INTERVAL")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    @validator("database_url")
    def validate_database_url(cls, v):
        """Validate database URL format"""
        if not v.startswith(("postgresql://", "postgres://")):
            raise ValueError("Database URL must start with postgresql:// or postgres://")
        return v
    
    @validator("bv_studios_base_url") 
    def validate_base_url(cls, v):
        """Validate base URL format"""
        if not v.startswith(("http://", "https://")):
            raise ValueError("Base URL must start with http:// or https://")
        return v


class BotRoles:
    """Defines roles and responsibilities for each bot"""
    
    COORDINATOR = {
        "name": "TroubleshootingCoordinator",
        "role": "Troubleshooting Supervisor",
        "goal": "Coordinate system diagnosis and resolution workflow",
        "backstory": """You are the chief troubleshooting coordinator for BV Studios' 
        video production platform. You manage a team of specialized diagnostic and 
        resolution bots to ensure optimal system performance.""",
        "max_execution_time": 300
    }
    
    WEB_DIAGNOSTIC = {
        "name": "BotWebDiagnostic", 
        "role": "Web Frontend Diagnostic Specialist",
        "goal": "Detect and analyze frontend, UI, and client-side issues",
        "backstory": """You are an expert at diagnosing web frontend issues including 
        React components, Next.js routing, CSS styling, and client-side JavaScript errors. 
        You analyze user experience problems and performance bottlenecks.""",
        "max_execution_time": 30
    }
    
    DATABASE_DIAGNOSTIC = {
        "name": "BotDatabaseDiagnostic",
        "role": "Database Diagnostic Specialist", 
        "goal": "Detect and analyze database connectivity and performance issues",
        "backstory": """You are a database expert specializing in PostgreSQL, Prisma ORM, 
        and connection management. You detect slow queries, connection issues, and 
        data integrity problems in the BV Studios platform.""",
        "max_execution_time": 30
    }
    
    NETWORK_DIAGNOSTIC = {
        "name": "BotNetworkDiagnostic",
        "role": "Network and API Diagnostic Specialist",
        "goal": "Detect and analyze API, network, and integration issues",
        "backstory": """You are a network diagnostics expert focusing on API endpoints, 
        external integrations, authentication flows, and communication between services. 
        You identify bottlenecks and failures in the BV Studios platform.""",
        "max_execution_time": 30
    }
    
    WEB_FIX = {
        "name": "BotWebFix",
        "role": "Web Frontend Resolution Specialist", 
        "goal": "Resolve frontend and client-side issues",
        "backstory": """You are an expert at fixing web frontend issues. You implement 
        solutions for React components, routing problems, performance optimization, 
        and user experience improvements in the BV Studios platform.""",
        "max_execution_time": 60
    }
    
    DATABASE_FIX = {
        "name": "BotDatabaseFix", 
        "role": "Database Resolution Specialist",
        "goal": "Resolve database and data management issues", 
        "backstory": """You are a database solutions expert. You implement fixes for 
        connection issues, optimize queries, resolve data conflicts, and ensure 
        database integrity in the BV Studios platform.""",
        "max_execution_time": 60
    }
    
    NETWORK_FIX = {
        "name": "BotNetworkFix",
        "role": "Network and API Resolution Specialist",
        "goal": "Resolve API, network, and integration issues",
        "backstory": """You are a network solutions expert. You implement fixes for 
        API endpoints, resolve authentication problems, optimize network performance, 
        and ensure reliable integrations in the BV Studios platform.""",
        "max_execution_time": 60
    }


# Global configuration instance
config = TroubleshootingConfig()