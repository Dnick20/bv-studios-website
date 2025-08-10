"""
Specialized Diagnostic Bots for the Troubleshooting System
3 diagnostic bots: Web, Database, and Network diagnostics
"""

import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
import re

from crewai import Agent, Task
from langchain.tools import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun

from config import config, BotRoles
from models import (
    SystemInfo, Issue, DiagnosticReport, Severity, IssueType, BotType
)
from utils import (
    StructuredLogger, BVStudiosAPI, extract_error_patterns,
    is_critical_error, calculate_execution_time
)


class WebDiagnosticTool(BaseTool):
    """Tool for web frontend diagnostics"""
    
    name = "web_diagnostic_analysis"
    description = "Analyze web frontend for React, Next.js, and UI issues"
    
    def __init__(self):
        super().__init__()
        self.api = BVStudiosAPI()
        self.logger = StructuredLogger.get_logger("web_diagnostic_tool")
    
    async def _arun(self, **kwargs) -> str:
        """Async web diagnostic analysis"""
        try:
            # Get system health for frontend analysis
            health_data = await self.api.get_system_health()
            
            # Analyze frontend-specific issues
            frontend_issues = self._analyze_frontend_health(health_data)
            
            return json.dumps({
                "frontend_health": health_data,
                "identified_issues": frontend_issues,
                "analysis_timestamp": datetime.utcnow().isoformat()
            }, indent=2)
            
        except Exception as e:
            self.logger.error("Web diagnostic analysis failed", error=str(e))
            return f"Web diagnostic failed: {str(e)}"
    
    def _analyze_frontend_health(self, health_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze health data for frontend-specific issues"""
        issues = []
        
        # Check for React hydration issues
        if "error" in health_data and "hydration" in str(health_data.get("error", "")).lower():
            issues.append({
                "type": "hydration_mismatch",
                "severity": "medium",
                "description": "React hydration mismatch detected"
            })
        
        # Check for Next.js routing issues
        if health_data.get("status") == "error" and "404" in str(health_data):
            issues.append({
                "type": "routing_error", 
                "severity": "high",
                "description": "Next.js routing issues detected"
            })
        
        return issues
    
    def _run(self, **kwargs, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Sync wrapper for web diagnostic analysis"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._arun(**kwargs))
        finally:
            loop.close()


class DatabaseDiagnosticTool(BaseTool):
    """Tool for database diagnostics"""
    
    name = "database_diagnostic_analysis"
    description = "Analyze database connectivity, performance, and data integrity"
    
    def __init__(self):
        super().__init__()
        self.api = BVStudiosAPI()
        self.logger = StructuredLogger.get_logger("database_diagnostic_tool")
    
    async def _arun(self, **kwargs) -> str:
        """Async database diagnostic analysis"""
        try:
            # Test database connection
            db_health = await self.api.test_database_connection()
            
            # Get recent logs for database errors
            logs_data = await self.api.get_recent_logs(100)
            db_errors = self._extract_db_errors(logs_data.get("logs", []))
            
            return json.dumps({
                "database_health": db_health,
                "connection_status": db_health.get("success", False),
                "database_errors": db_errors,
                "analysis_timestamp": datetime.utcnow().isoformat()
            }, indent=2)
            
        except Exception as e:
            self.logger.error("Database diagnostic analysis failed", error=str(e))
            return f"Database diagnostic failed: {str(e)}"
    
    def _extract_db_errors(self, logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extract database-specific errors from logs"""
        db_errors = []
        db_keywords = ["database", "postgres", "prisma", "connection", "query", "sql"]
        
        for log in logs:
            log_text = str(log).lower()
            if any(keyword in log_text for keyword in db_keywords) and "error" in log_text:
                db_errors.append({
                    "timestamp": log.get("timestamp", "unknown"),
                    "message": str(log.get("message", log)),
                    "severity": "high" if "critical" in log_text else "medium"
                })
        
        return db_errors[:10]  # Return top 10 database errors
    
    def _run(self, **kwargs, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Sync wrapper for database diagnostic analysis"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._arun(**kwargs))
        finally:
            loop.close()


class NetworkDiagnosticTool(BaseTool):
    """Tool for network and API diagnostics"""
    
    name = "network_diagnostic_analysis" 
    description = "Analyze API endpoints, authentication, and network performance"
    
    def __init__(self):
        super().__init__()
        self.api = BVStudiosAPI()
        self.logger = StructuredLogger.get_logger("network_diagnostic_tool")
    
    async def _arun(self, **kwargs) -> str:
        """Async network diagnostic analysis"""
        try:
            # Test bot operations (API endpoints)
            bot_health = await self.api.test_bot_operations()
            
            # Analyze API response times and errors
            api_analysis = self._analyze_api_health(bot_health)
            
            return json.dumps({
                "api_health": bot_health,
                "endpoint_analysis": api_analysis,
                "analysis_timestamp": datetime.utcnow().isoformat()
            }, indent=2)
            
        except Exception as e:
            self.logger.error("Network diagnostic analysis failed", error=str(e))
            return f"Network diagnostic failed: {str(e)}"
    
    def _analyze_api_health(self, bot_health: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze API health for network issues"""
        analysis = {
            "healthy_endpoints": 0,
            "error_endpoints": 0,
            "timeout_issues": 0,
            "auth_issues": 0
        }
        
        for bot_name, result in bot_health.items():
            if result.get("status") == "healthy":
                analysis["healthy_endpoints"] += 1
            elif result.get("status") == "error":
                analysis["error_endpoints"] += 1
                
                error_msg = str(result.get("error", "")).lower()
                if "timeout" in error_msg:
                    analysis["timeout_issues"] += 1
                if "auth" in error_msg or "unauthorized" in error_msg:
                    analysis["auth_issues"] += 1
        
        return analysis
    
    def _run(self, **kwargs, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Sync wrapper for network diagnostic analysis"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._arun(**kwargs))
        finally:
            loop.close()


class BotWebDiagnostic:
    """
    Specialized bot for diagnosing web frontend issues
    Focuses on React, Next.js, UI, and client-side problems
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("bot_web_diagnostic")
        self.tools = [WebDiagnosticTool()]
        
        self.agent = Agent(
            role=BotRoles.WEB_DIAGNOSTIC["role"],
            goal=BotRoles.WEB_DIAGNOSTIC["goal"],
            backstory=BotRoles.WEB_DIAGNOSTIC["backstory"],
            verbose=True,
            tools=self.tools,
            max_execution_time=BotRoles.WEB_DIAGNOSTIC["max_execution_time"]
        )
    
    async def run_diagnostics(self, system_info: SystemInfo) -> DiagnosticReport:
        """Run comprehensive web frontend diagnostics"""
        
        start_time = datetime.utcnow()
        self.logger.info("Starting web frontend diagnostics")
        
        try:
            # Create diagnostic task
            diagnostic_task = Task(
                description=f"""
                Analyze the BV Studios web frontend for issues:
                
                1. Check React component errors and hydration issues
                2. Analyze Next.js routing and page load performance  
                3. Review client-side JavaScript errors from logs
                4. Assess UI/UX problems and rendering issues
                5. Check for browser compatibility issues
                
                System Information:
                - Base URL: {system_info.base_url}
                - API Status: {system_info.api_status}
                - Recent Logs: {len(system_info.recent_logs)} entries
                - Error Patterns: {system_info.error_patterns}
                
                Focus on frontend-specific issues that impact user experience.
                """,
                agent=self.agent,
                expected_output="Detailed diagnostic report with identified frontend issues and recommendations"
            )
            
            # Execute diagnostics using the tool
            diagnostic_result = await self.tools[0]._arun()
            diagnostic_data = json.loads(diagnostic_result)
            
            # Process results into issues
            issues_found = []
            
            # Analyze frontend issues from diagnostic data
            for issue_data in diagnostic_data.get("identified_issues", []):
                issue = Issue(
                    id=f"web_{len(issues_found) + 1:03d}",
                    type=self._map_issue_type(issue_data["type"]),
                    severity=self._map_severity(issue_data["severity"]),
                    title=f"Web Frontend: {issue_data['type'].replace('_', ' ').title()}",
                    description=issue_data["description"],
                    component="frontend",
                    detected_by=BotType.WEB_DIAGNOSTIC,
                    context={"diagnostic_data": issue_data}
                )
                issues_found.append(issue)
            
            # Analyze error patterns from logs
            log_issues = self._analyze_log_patterns(system_info.recent_logs)
            issues_found.extend(log_issues)
            
            # Generate recommendations
            recommendations = self._generate_web_recommendations(issues_found)
            
            execution_time = calculate_execution_time(start_time)
            
            report = DiagnosticReport(
                bot_name="BotWebDiagnostic",
                bot_type=BotType.WEB_DIAGNOSTIC,
                execution_time=execution_time,
                health_status=self._determine_health_status(issues_found),
                issues_found=issues_found,
                recommendations=recommendations
            )
            
            self.logger.info(
                "Web diagnostics completed",
                issues_found=len(issues_found),
                health_status=report.health_status
            )
            
            return report
            
        except Exception as e:
            execution_time = calculate_execution_time(start_time)
            self.logger.error("Web diagnostics failed", error=str(e))
            
            return DiagnosticReport(
                bot_name="BotWebDiagnostic",
                bot_type=BotType.WEB_DIAGNOSTIC,
                execution_time=execution_time,
                health_status="error",
                issues_found=[],
                recommendations=[f"Diagnostic failed: {str(e)}"]
            )
    
    def _map_issue_type(self, diagnostic_type: str) -> IssueType:
        """Map diagnostic type to IssueType enum"""
        mapping = {
            "hydration_mismatch": IssueType.FRONTEND_ERROR,
            "routing_error": IssueType.FRONTEND_ERROR,
            "ui_bug": IssueType.UI_BUG,
            "performance": IssueType.PERFORMANCE_ISSUE
        }
        return mapping.get(diagnostic_type, IssueType.FRONTEND_ERROR)
    
    def _map_severity(self, diagnostic_severity: str) -> Severity:
        """Map diagnostic severity to Severity enum"""
        mapping = {
            "critical": Severity.CRITICAL,
            "high": Severity.HIGH,
            "medium": Severity.MEDIUM,
            "low": Severity.LOW
        }
        return mapping.get(diagnostic_severity, Severity.MEDIUM)
    
    def _analyze_log_patterns(self, logs: List[Dict[str, Any]]) -> List[Issue]:
        """Analyze logs for web-specific error patterns"""
        
        web_issues = []
        web_patterns = [
            (r"hydration.*failed", IssueType.FRONTEND_ERROR, Severity.HIGH),
            (r"component.*error", IssueType.FRONTEND_ERROR, Severity.MEDIUM),
            (r"404.*not.*found", IssueType.FRONTEND_ERROR, Severity.MEDIUM),
            (r"javascript.*error", IssueType.FRONTEND_ERROR, Severity.MEDIUM),
            (r"css.*not.*loaded", IssueType.UI_BUG, Severity.LOW)
        ]
        
        for i, log in enumerate(logs[:50]):  # Check first 50 logs
            log_text = str(log).lower()
            
            for pattern, issue_type, severity in web_patterns:
                if re.search(pattern, log_text):
                    issue = Issue(
                        id=f"web_log_{i + 1:03d}",
                        type=issue_type,
                        severity=severity,
                        title=f"Web Log Pattern: {pattern.replace('.*', ' ').title()}",
                        description=f"Pattern '{pattern}' found in logs",
                        detected_by=BotType.WEB_DIAGNOSTIC,
                        error_messages=[str(log)[:200]],
                        context={"log_index": i, "pattern": pattern}
                    )
                    web_issues.append(issue)
                    break
        
        return web_issues[:5]  # Return top 5 log issues
    
    def _generate_web_recommendations(self, issues: List[Issue]) -> List[str]:
        """Generate recommendations based on found web issues"""
        
        recommendations = []
        issue_types = [issue.type for issue in issues]
        
        if IssueType.FRONTEND_ERROR in issue_types:
            recommendations.append("Review React component implementation and fix hydration issues")
            recommendations.append("Add error boundaries to prevent component crash propagation")
        
        if IssueType.UI_BUG in issue_types:
            recommendations.append("Audit CSS loading and styling issues")
            recommendations.append("Test UI components across different browsers")
        
        if IssueType.PERFORMANCE_ISSUE in issue_types:
            recommendations.append("Optimize component rendering and implement React.memo where appropriate")
            recommendations.append("Review bundle size and implement code splitting")
        
        if not recommendations:
            recommendations.append("Web frontend appears healthy - continue monitoring")
        
        return recommendations
    
    def _determine_health_status(self, issues: List[Issue]) -> str:
        """Determine overall web health status"""
        
        if not issues:
            return "healthy"
        
        critical_count = sum(1 for issue in issues if issue.severity == Severity.CRITICAL)
        high_count = sum(1 for issue in issues if issue.severity == Severity.HIGH)
        
        if critical_count > 0:
            return "critical"
        elif high_count > 2:
            return "degraded"
        elif len(issues) > 5:
            return "degraded"
        else:
            return "warning"


class BotDatabaseDiagnostic:
    """
    Specialized bot for diagnosing database issues
    Focuses on PostgreSQL, Prisma, connections, and data integrity
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("bot_database_diagnostic")
        self.tools = [DatabaseDiagnosticTool()]
        
        self.agent = Agent(
            role=BotRoles.DATABASE_DIAGNOSTIC["role"],
            goal=BotRoles.DATABASE_DIAGNOSTIC["goal"],
            backstory=BotRoles.DATABASE_DIAGNOSTIC["backstory"],
            verbose=True,
            tools=self.tools,
            max_execution_time=BotRoles.DATABASE_DIAGNOSTIC["max_execution_time"]
        )
    
    async def run_diagnostics(self, system_info: SystemInfo) -> DiagnosticReport:
        """Run comprehensive database diagnostics"""
        
        start_time = datetime.utcnow()
        self.logger.info("Starting database diagnostics")
        
        try:
            # Execute database diagnostics using the tool
            diagnostic_result = await self.tools[0]._arun()
            diagnostic_data = json.loads(diagnostic_result)
            
            # Process database health
            issues_found = []
            
            # Check connection status
            if not diagnostic_data.get("connection_status", False):
                connection_issue = Issue(
                    id="db_001",
                    type=IssueType.DATABASE_ERROR,
                    severity=Severity.CRITICAL,
                    title="Database Connection Failed",
                    description="Unable to establish database connection",
                    detected_by=BotType.DATABASE_DIAGNOSTIC,
                    error_messages=[str(diagnostic_data.get("database_health", {}).get("error", "Connection failed"))]
                )
                issues_found.append(connection_issue)
            
            # Process database errors from logs
            for i, db_error in enumerate(diagnostic_data.get("database_errors", [])):
                issue = Issue(
                    id=f"db_{i + 2:03d}",
                    type=IssueType.DATABASE_ERROR,
                    severity=self._map_severity(db_error["severity"]),
                    title="Database Error from Logs",
                    description=db_error["message"][:200],
                    detected_by=BotType.DATABASE_DIAGNOSTIC,
                    error_messages=[db_error["message"]],
                    context={"timestamp": db_error["timestamp"]}
                )
                issues_found.append(issue)
            
            # Generate recommendations
            recommendations = self._generate_db_recommendations(issues_found, diagnostic_data)
            
            execution_time = calculate_execution_time(start_time)
            
            report = DiagnosticReport(
                bot_name="BotDatabaseDiagnostic",
                bot_type=BotType.DATABASE_DIAGNOSTIC,
                execution_time=execution_time,
                health_status=self._determine_db_health_status(issues_found, diagnostic_data),
                issues_found=issues_found,
                recommendations=recommendations
            )
            
            self.logger.info(
                "Database diagnostics completed",
                issues_found=len(issues_found),
                health_status=report.health_status
            )
            
            return report
            
        except Exception as e:
            execution_time = calculate_execution_time(start_time)
            self.logger.error("Database diagnostics failed", error=str(e))
            
            return DiagnosticReport(
                bot_name="BotDatabaseDiagnostic",
                bot_type=BotType.DATABASE_DIAGNOSTIC,
                execution_time=execution_time,
                health_status="error",
                issues_found=[],
                recommendations=[f"Diagnostic failed: {str(e)}"]
            )
    
    def _generate_db_recommendations(self, issues: List[Issue], diagnostic_data: Dict[str, Any]) -> List[str]:
        """Generate database-specific recommendations"""
        
        recommendations = []
        
        if not diagnostic_data.get("connection_status", False):
            recommendations.append("Verify database connection string and credentials")
            recommendations.append("Check database server availability and network connectivity")
            recommendations.append("Review Prisma configuration and connection pooling settings")
        
        if diagnostic_data.get("database_errors"):
            recommendations.append("Investigate recent database errors in application logs")
            recommendations.append("Consider implementing database query optimization")
            recommendations.append("Review database transaction handling and error recovery")
        
        if not recommendations:
            recommendations.append("Database appears healthy - monitor connection pool usage")
        
        return recommendations
    
    def _determine_db_health_status(self, issues: List[Issue], diagnostic_data: Dict[str, Any]) -> str:
        """Determine database health status"""
        
        if not diagnostic_data.get("connection_status", False):
            return "critical"
        
        if not issues:
            return "healthy"
        
        critical_count = sum(1 for issue in issues if issue.severity == Severity.CRITICAL)
        high_count = sum(1 for issue in issues if issue.severity == Severity.HIGH)
        
        if critical_count > 0:
            return "critical"
        elif high_count > 1:
            return "degraded"
        else:
            return "warning"
    
    def _map_severity(self, diagnostic_severity: str) -> Severity:
        """Map diagnostic severity to Severity enum"""
        mapping = {
            "critical": Severity.CRITICAL,
            "high": Severity.HIGH,
            "medium": Severity.MEDIUM,
            "low": Severity.LOW
        }
        return mapping.get(diagnostic_severity, Severity.MEDIUM)


class BotNetworkDiagnostic:
    """
    Specialized bot for diagnosing network and API issues
    Focuses on endpoints, authentication, integrations, and performance
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("bot_network_diagnostic")
        self.tools = [NetworkDiagnosticTool()]
        
        self.agent = Agent(
            role=BotRoles.NETWORK_DIAGNOSTIC["role"],
            goal=BotRoles.NETWORK_DIAGNOSTIC["goal"],
            backstory=BotRoles.NETWORK_DIAGNOSTIC["backstory"],
            verbose=True,
            tools=self.tools,
            max_execution_time=BotRoles.NETWORK_DIAGNOSTIC["max_execution_time"]
        )
    
    async def run_diagnostics(self, system_info: SystemInfo) -> DiagnosticReport:
        """Run comprehensive network and API diagnostics"""
        
        start_time = datetime.utcnow()
        self.logger.info("Starting network diagnostics")
        
        try:
            # Execute network diagnostics using the tool
            diagnostic_result = await self.tools[0]._arun()
            diagnostic_data = json.loads(diagnostic_result)
            
            # Process API health analysis
            issues_found = []
            endpoint_analysis = diagnostic_data.get("endpoint_analysis", {})
            
            # Check for API endpoint errors
            if endpoint_analysis.get("error_endpoints", 0) > 0:
                api_issue = Issue(
                    id="net_001",
                    type=IssueType.API_ERROR,
                    severity=Severity.HIGH,
                    title="API Endpoint Errors Detected",
                    description=f"{endpoint_analysis['error_endpoints']} API endpoints are failing",
                    detected_by=BotType.NETWORK_DIAGNOSTIC,
                    context={"endpoint_analysis": endpoint_analysis}
                )
                issues_found.append(api_issue)
            
            # Check for timeout issues
            if endpoint_analysis.get("timeout_issues", 0) > 0:
                timeout_issue = Issue(
                    id="net_002",
                    type=IssueType.NETWORK_TIMEOUT,
                    severity=Severity.MEDIUM,
                    title="Network Timeout Issues",
                    description=f"{endpoint_analysis['timeout_issues']} endpoints experiencing timeouts",
                    detected_by=BotType.NETWORK_DIAGNOSTIC,
                    context={"timeout_count": endpoint_analysis["timeout_issues"]}
                )
                issues_found.append(timeout_issue)
            
            # Check for authentication issues
            if endpoint_analysis.get("auth_issues", 0) > 0:
                auth_issue = Issue(
                    id="net_003",
                    type=IssueType.AUTHENTICATION_ERROR,
                    severity=Severity.HIGH,
                    title="Authentication Issues Detected",
                    description=f"{endpoint_analysis['auth_issues']} endpoints have authentication problems",
                    detected_by=BotType.NETWORK_DIAGNOSTIC,
                    context={"auth_failures": endpoint_analysis["auth_issues"]}
                )
                issues_found.append(auth_issue)
            
            # Generate recommendations
            recommendations = self._generate_network_recommendations(issues_found, diagnostic_data)
            
            execution_time = calculate_execution_time(start_time)
            
            report = DiagnosticReport(
                bot_name="BotNetworkDiagnostic",
                bot_type=BotType.NETWORK_DIAGNOSTIC,
                execution_time=execution_time,
                health_status=self._determine_network_health_status(issues_found, endpoint_analysis),
                issues_found=issues_found,
                recommendations=recommendations
            )
            
            self.logger.info(
                "Network diagnostics completed",
                issues_found=len(issues_found),
                health_status=report.health_status
            )
            
            return report
            
        except Exception as e:
            execution_time = calculate_execution_time(start_time)
            self.logger.error("Network diagnostics failed", error=str(e))
            
            return DiagnosticReport(
                bot_name="BotNetworkDiagnostic",
                bot_type=BotType.NETWORK_DIAGNOSTIC,
                execution_time=execution_time,
                health_status="error",
                issues_found=[],
                recommendations=[f"Diagnostic failed: {str(e)}"]
            )
    
    def _generate_network_recommendations(self, issues: List[Issue], diagnostic_data: Dict[str, Any]) -> List[str]:
        """Generate network-specific recommendations"""
        
        recommendations = []
        endpoint_analysis = diagnostic_data.get("endpoint_analysis", {})
        
        if endpoint_analysis.get("error_endpoints", 0) > 0:
            recommendations.append("Investigate failing API endpoints and review error handling")
            recommendations.append("Check server resources and scaling configuration")
        
        if endpoint_analysis.get("timeout_issues", 0) > 0:
            recommendations.append("Review network timeout configurations and server response times")
            recommendations.append("Consider implementing request retry logic with backoff")
        
        if endpoint_analysis.get("auth_issues", 0) > 0:
            recommendations.append("Review authentication token expiration and refresh logic")
            recommendations.append("Verify API key configuration and permissions")
        
        if endpoint_analysis.get("healthy_endpoints", 0) > 0:
            recommendations.append(f"{endpoint_analysis['healthy_endpoints']} endpoints are healthy - monitor for consistency")
        
        if not recommendations:
            recommendations.append("Network and API layer appears healthy - continue monitoring")
        
        return recommendations
    
    def _determine_network_health_status(self, issues: List[Issue], endpoint_analysis: Dict[str, Any]) -> str:
        """Determine network health status"""
        
        total_endpoints = (
            endpoint_analysis.get("healthy_endpoints", 0) + 
            endpoint_analysis.get("error_endpoints", 0)
        )
        error_endpoints = endpoint_analysis.get("error_endpoints", 0)
        
        if total_endpoints == 0:
            return "unknown"
        
        error_ratio = error_endpoints / total_endpoints
        
        if error_ratio >= 0.5:
            return "critical"
        elif error_ratio >= 0.2:
            return "degraded"
        elif issues:
            return "warning"
        else:
            return "healthy"


# Global diagnostic bot instances
web_diagnostic_bot = BotWebDiagnostic()
database_diagnostic_bot = BotDatabaseDiagnostic()
network_diagnostic_bot = BotNetworkDiagnostic()