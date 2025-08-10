"""
Pydantic models for structured communication between bots
Defines the data structures used throughout the troubleshooting system
"""

from datetime import datetime
from typing import List, Dict, Any, Optional, Union
from enum import Enum
from pydantic import BaseModel, Field, validator


class Severity(str, Enum):
    """Issue severity levels"""
    CRITICAL = "critical"
    HIGH = "high"  
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class IssueType(str, Enum):
    """Types of issues that can be detected"""
    FRONTEND_ERROR = "frontend_error"
    DATABASE_ERROR = "database_error"
    API_ERROR = "api_error"
    PERFORMANCE_ISSUE = "performance_issue"
    AUTHENTICATION_ERROR = "authentication_error" 
    NETWORK_TIMEOUT = "network_timeout"
    RESOURCE_ERROR = "resource_error"
    DATA_INTEGRITY = "data_integrity"
    UI_BUG = "ui_bug"
    SECURITY_ISSUE = "security_issue"


class BotType(str, Enum):
    """Bot type enumeration"""
    COORDINATOR = "coordinator"
    WEB_DIAGNOSTIC = "web_diagnostic"
    DATABASE_DIAGNOSTIC = "database_diagnostic"
    NETWORK_DIAGNOSTIC = "network_diagnostic"
    WEB_FIX = "web_fix"
    DATABASE_FIX = "database_fix"
    NETWORK_FIX = "network_fix"


class SystemInfo(BaseModel):
    """System information for diagnostic purposes"""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    base_url: str
    environment: str = Field(default="production")
    version: Optional[str] = None
    
    # Health check data
    api_status: Dict[str, Any] = Field(default_factory=dict)
    database_status: Dict[str, Any] = Field(default_factory=dict) 
    performance_metrics: Dict[str, Any] = Field(default_factory=dict)
    
    # Recent logs and errors
    recent_logs: List[Dict[str, Any]] = Field(default_factory=list)
    error_patterns: List[str] = Field(default_factory=list)
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class Issue(BaseModel):
    """Represents a detected issue"""
    id: str = Field(..., description="Unique issue identifier")
    type: IssueType = Field(..., description="Type of issue detected")
    severity: Severity = Field(..., description="Issue severity level")
    title: str = Field(..., description="Brief issue description")
    description: str = Field(..., description="Detailed issue description")
    component: Optional[str] = Field(None, description="Affected component")
    detected_by: BotType = Field(..., description="Bot that detected the issue")
    detected_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Diagnostic information
    error_messages: List[str] = Field(default_factory=list)
    affected_endpoints: List[str] = Field(default_factory=list)
    performance_impact: Optional[Dict[str, Any]] = None
    
    # Context and metadata
    context: Dict[str, Any] = Field(default_factory=dict)
    stack_trace: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class DiagnosticReport(BaseModel):
    """Diagnostic report from a diagnostic bot"""
    bot_name: str = Field(..., description="Name of the diagnostic bot")
    bot_type: BotType = Field(..., description="Type of diagnostic bot")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    execution_time: float = Field(..., description="Execution time in seconds")
    
    # Findings
    issues_found: List[Issue] = Field(default_factory=list)
    health_status: str = Field(..., description="Overall health status")
    recommendations: List[str] = Field(default_factory=list)
    
    # Metrics and performance
    performance_metrics: Dict[str, Any] = Field(default_factory=dict)
    resource_usage: Dict[str, Any] = Field(default_factory=dict)
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class FixAction(BaseModel):
    """Represents a fix action to be performed"""
    id: str = Field(..., description="Unique action identifier")
    issue_id: str = Field(..., description="Related issue ID")
    action_type: str = Field(..., description="Type of fix action")
    priority: int = Field(..., ge=1, le=10, description="Action priority (1-10)")
    
    # Action details
    command: Optional[str] = Field(None, description="Command to execute")
    parameters: Dict[str, Any] = Field(default_factory=dict)
    expected_duration: int = Field(default=30, description="Expected duration in seconds")
    
    # Safety and rollback
    requires_confirmation: bool = Field(default=False)
    rollback_command: Optional[str] = None
    safety_checks: List[str] = Field(default_factory=list)
    
    # Dependencies
    depends_on: List[str] = Field(default_factory=list, description="Dependent action IDs")


class ResolutionReport(BaseModel):
    """Resolution report from a fix bot"""
    bot_name: str = Field(..., description="Name of the fix bot")
    bot_type: BotType = Field(..., description="Type of fix bot")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    execution_time: float = Field(..., description="Execution time in seconds")
    
    # Actions taken
    actions_attempted: List[FixAction] = Field(default_factory=list)
    actions_successful: List[str] = Field(default_factory=list)
    actions_failed: List[str] = Field(default_factory=list)
    
    # Results
    issues_resolved: List[str] = Field(default_factory=list)
    issues_remaining: List[str] = Field(default_factory=list)
    new_issues_created: List[Issue] = Field(default_factory=list)
    
    # Status and notes
    overall_success: bool = Field(..., description="Overall success status")
    notes: str = Field(default="", description="Additional notes")
    follow_up_required: bool = Field(default=False)
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }


class WorkflowState(BaseModel):
    """LangGraph workflow state"""
    session_id: str = Field(..., description="Unique session identifier")
    phase: str = Field(default="initialization", description="Current workflow phase")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # System information
    system_info: Optional[SystemInfo] = None
    
    # Reports and findings
    diagnostic_reports: List[DiagnosticReport] = Field(default_factory=list)
    resolution_reports: List[ResolutionReport] = Field(default_factory=list)
    
    # Issues tracking
    all_issues: List[Issue] = Field(default_factory=list)
    prioritized_issues: List[Issue] = Field(default_factory=list)
    resolved_issues: List[str] = Field(default_factory=list)
    
    # Workflow control
    current_step: str = Field(default="start")
    completed_steps: List[str] = Field(default_factory=list)
    failed_steps: List[str] = Field(default_factory=list)
    
    # Final results
    success: bool = Field(default=False)
    final_health_score: Optional[float] = None
    summary: str = Field(default="")
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
    
    def add_diagnostic_report(self, report: DiagnosticReport):
        """Add a diagnostic report and update issues"""
        self.diagnostic_reports.append(report)
        self.all_issues.extend(report.issues_found)
        self.updated_at = datetime.utcnow()
    
    def add_resolution_report(self, report: ResolutionReport):
        """Add a resolution report and update resolved issues"""
        self.resolution_reports.append(report)
        self.resolved_issues.extend(report.issues_resolved)
        self.updated_at = datetime.utcnow()
    
    def get_unresolved_issues(self) -> List[Issue]:
        """Get list of unresolved issues"""
        return [issue for issue in self.all_issues 
                if issue.id not in self.resolved_issues]
    
    def calculate_health_score(self) -> float:
        """Calculate overall system health score (0-100)"""
        if not self.all_issues:
            return 100.0
        
        total_severity_points = 0
        severity_weights = {
            Severity.CRITICAL: 25,
            Severity.HIGH: 15,
            Severity.MEDIUM: 8,
            Severity.LOW: 3,
            Severity.INFO: 1
        }
        
        unresolved_issues = self.get_unresolved_issues()
        for issue in unresolved_issues:
            total_severity_points += severity_weights.get(issue.severity, 5)
        
        # Calculate score (100 - penalties, minimum 0)
        health_score = max(0, 100 - total_severity_points)
        return round(health_score, 1)


class BotMessage(BaseModel):
    """Standard message format for bot communication"""
    sender: str = Field(..., description="Sender bot name")
    recipient: str = Field(..., description="Recipient bot name")
    message_type: str = Field(..., description="Type of message")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Message content
    content: Dict[str, Any] = Field(default_factory=dict)
    session_id: str = Field(..., description="Session identifier")
    
    # Message metadata
    priority: int = Field(default=5, ge=1, le=10)
    requires_response: bool = Field(default=False)
    correlation_id: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }