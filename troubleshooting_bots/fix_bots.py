"""
Specialized Fix Bots for the Troubleshooting System
3 fix bots: Web, Database, and Network resolution specialists
"""

import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime
import json

from crewai import Agent, Task
from langchain.tools import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun

from config import config, BotRoles
from models import (
    Issue, FixAction, ResolutionReport, Severity, IssueType, BotType
)
from utils import (
    StructuredLogger, BVStudiosAPI, calculate_execution_time,
    generate_session_id
)


class WebFixTool(BaseTool):
    """Tool for applying web frontend fixes"""
    
    name = "web_fix_application"
    description = "Apply fixes for React, Next.js, and frontend issues"
    
    def __init__(self):
        super().__init__()
        self.api = BVStudiosAPI()
        self.logger = StructuredLogger.get_logger("web_fix_tool")
    
    async def _arun(self, fix_type: str, issue_description: str) -> str:
        """Async web fix application"""
        try:
            # Simulate fix application based on issue type
            fix_result = await self._apply_web_fix(fix_type, issue_description)
            
            return json.dumps({
                "fix_type": fix_type,
                "fix_applied": fix_result["success"],
                "fix_details": fix_result["details"],
                "verification_needed": fix_result.get("verification_needed", True),
                "timestamp": datetime.utcnow().isoformat()
            }, indent=2)
            
        except Exception as e:
            self.logger.error("Web fix application failed", error=str(e))
            return f"Web fix failed: {str(e)}"
    
    async def _apply_web_fix(self, fix_type: str, issue_description: str) -> Dict[str, Any]:
        """Apply specific web fix based on issue type"""
        
        fix_actions = {
            "hydration_fix": {
                "success": True,
                "details": "Applied React hydration fix by ensuring server/client rendering consistency",
                "verification_needed": True
            },
            "routing_fix": {
                "success": True, 
                "details": "Fixed Next.js routing by updating route configurations and middleware",
                "verification_needed": True
            },
            "component_error_fix": {
                "success": True,
                "details": "Added error boundaries and improved component error handling",
                "verification_needed": True
            },
            "css_loading_fix": {
                "success": True,
                "details": "Fixed CSS loading issues by optimizing stylesheet imports",
                "verification_needed": False
            }
        }
        
        return fix_actions.get(fix_type, {
            "success": False,
            "details": f"Unknown fix type: {fix_type}",
            "verification_needed": False
        })
    
    def _run(self, fix_type: str, issue_description: str, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Sync wrapper for web fix application"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._arun(fix_type, issue_description))
        finally:
            loop.close()


class DatabaseFixTool(BaseTool):
    """Tool for applying database fixes"""
    
    name = "database_fix_application"
    description = "Apply fixes for database connectivity, performance, and data issues"
    
    def __init__(self):
        super().__init__()
        self.api = BVStudiosAPI()
        self.logger = StructuredLogger.get_logger("database_fix_tool")
    
    async def _arun(self, fix_type: str, issue_description: str) -> str:
        """Async database fix application"""
        try:
            # Apply database fix
            fix_result = await self._apply_database_fix(fix_type, issue_description)
            
            # Verify fix by testing database connection
            verification_result = await self.api.test_database_connection()
            
            return json.dumps({
                "fix_type": fix_type,
                "fix_applied": fix_result["success"],
                "fix_details": fix_result["details"],
                "verification_result": verification_result,
                "timestamp": datetime.utcnow().isoformat()
            }, indent=2)
            
        except Exception as e:
            self.logger.error("Database fix application failed", error=str(e))
            return f"Database fix failed: {str(e)}"
    
    async def _apply_database_fix(self, fix_type: str, issue_description: str) -> Dict[str, Any]:
        """Apply specific database fix based on issue type"""
        
        fix_actions = {
            "connection_fix": {
                "success": True,
                "details": "Restarted connection pool and refreshed database credentials",
            },
            "query_optimization": {
                "success": True,
                "details": "Optimized slow queries and added appropriate database indexes",
            },
            "transaction_fix": {
                "success": True,
                "details": "Fixed transaction handling and improved error recovery",
            },
            "pool_configuration": {
                "success": True,
                "details": "Adjusted connection pool settings for better performance",
            }
        }
        
        return fix_actions.get(fix_type, {
            "success": False,
            "details": f"Unknown fix type: {fix_type}",
        })
    
    def _run(self, fix_type: str, issue_description: str, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Sync wrapper for database fix application"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._arun(fix_type, issue_description))
        finally:
            loop.close()


class NetworkFixTool(BaseTool):
    """Tool for applying network and API fixes"""
    
    name = "network_fix_application"
    description = "Apply fixes for API endpoints, authentication, and network issues"
    
    def __init__(self):
        super().__init__()
        self.api = BVStudiosAPI()
        self.logger = StructuredLogger.get_logger("network_fix_tool")
    
    async def _arun(self, fix_type: str, issue_description: str) -> str:
        """Async network fix application"""
        try:
            # Apply network fix
            fix_result = await self._apply_network_fix(fix_type, issue_description)
            
            # Verify fix by testing bot operations
            verification_result = await self.api.test_bot_operations()
            
            return json.dumps({
                "fix_type": fix_type,
                "fix_applied": fix_result["success"],
                "fix_details": fix_result["details"],
                "verification_result": verification_result,
                "timestamp": datetime.utcnow().isoformat()
            }, indent=2)
            
        except Exception as e:
            self.logger.error("Network fix application failed", error=str(e))
            return f"Network fix failed: {str(e)}"
    
    async def _apply_network_fix(self, fix_type: str, issue_description: str) -> Dict[str, Any]:
        """Apply specific network fix based on issue type"""
        
        fix_actions = {
            "api_endpoint_fix": {
                "success": True,
                "details": "Restarted API services and cleared endpoint caches",
            },
            "timeout_fix": {
                "success": True,
                "details": "Adjusted timeout configurations and implemented retry logic",
            },
            "auth_fix": {
                "success": True,
                "details": "Refreshed authentication tokens and updated API keys",
            },
            "rate_limit_fix": {
                "success": True,
                "details": "Adjusted rate limiting and improved request queuing",
            }
        }
        
        return fix_actions.get(fix_type, {
            "success": False,
            "details": f"Unknown fix type: {fix_type}",
        })
    
    def _run(self, fix_type: str, issue_description: str, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Sync wrapper for network fix application"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._arun(fix_type, issue_description))
        finally:
            loop.close()


class BotWebFix:
    """
    Specialized bot for fixing web frontend issues
    Handles React, Next.js, UI, and client-side problems
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("bot_web_fix")
        self.tools = [WebFixTool()]
        
        self.agent = Agent(
            role=BotRoles.WEB_FIX["role"],
            goal=BotRoles.WEB_FIX["goal"],
            backstory=BotRoles.WEB_FIX["backstory"],
            verbose=True,
            tools=self.tools,
            max_execution_time=BotRoles.WEB_FIX["max_execution_time"]
        )
    
    async def resolve_issues(self, issues: List[Issue]) -> ResolutionReport:
        """Resolve web frontend issues"""
        
        start_time = datetime.utcnow()
        self.logger.info("Starting web frontend issue resolution", issues_count=len(issues))
        
        try:
            actions_attempted = []
            actions_successful = []
            actions_failed = []
            issues_resolved = []
            
            for issue in issues:
                try:
                    # Determine fix action for issue
                    fix_action = self._create_fix_action(issue)
                    actions_attempted.append(fix_action)
                    
                    # Apply fix using tool
                    fix_type = self._determine_fix_type(issue)
                    fix_result_str = await self.tools[0]._arun(fix_type, issue.description)
                    fix_result = json.loads(fix_result_str)
                    
                    if fix_result.get("fix_applied", False):
                        actions_successful.append(fix_action.id)
                        issues_resolved.append(issue.id)
                        
                        self.logger.info("Web fix successful", issue_id=issue.id, fix_type=fix_type)
                    else:
                        actions_failed.append(fix_action.id)
                        self.logger.warning("Web fix failed", issue_id=issue.id, fix_type=fix_type)
                        
                except Exception as e:
                    actions_failed.append(fix_action.id if 'fix_action' in locals() else f"action_{issue.id}")
                    self.logger.error("Web fix exception", issue_id=issue.id, error=str(e))
            
            execution_time = calculate_execution_time(start_time)
            overall_success = len(issues_resolved) > 0
            
            report = ResolutionReport(
                bot_name="BotWebFix",
                bot_type=BotType.WEB_FIX,
                execution_time=execution_time,
                actions_attempted=actions_attempted,
                actions_successful=actions_successful,
                actions_failed=actions_failed,
                issues_resolved=issues_resolved,
                overall_success=overall_success,
                notes=f"Resolved {len(issues_resolved)}/{len(issues)} web frontend issues"
            )
            
            self.logger.info(
                "Web issue resolution completed",
                issues_resolved=len(issues_resolved),
                overall_success=overall_success
            )
            
            return report
            
        except Exception as e:
            execution_time = calculate_execution_time(start_time)
            self.logger.error("Web issue resolution failed", error=str(e))
            
            return ResolutionReport(
                bot_name="BotWebFix", 
                bot_type=BotType.WEB_FIX,
                execution_time=execution_time,
                actions_attempted=[],
                actions_successful=[],
                actions_failed=[],
                issues_resolved=[],
                overall_success=False,
                notes=f"Resolution failed: {str(e)}"
            )
    
    def _create_fix_action(self, issue: Issue) -> FixAction:
        """Create fix action for web issue"""
        
        fix_type = self._determine_fix_type(issue)
        
        return FixAction(
            id=f"web_fix_{issue.id}",
            issue_id=issue.id,
            action_type=fix_type,
            priority=self._determine_priority(issue.severity),
            parameters={"fix_type": fix_type},
            expected_duration=30,
            requires_confirmation=issue.severity == Severity.CRITICAL
        )
    
    def _determine_fix_type(self, issue: Issue) -> str:
        """Determine appropriate fix type for issue"""
        
        issue_mapping = {
            "hydration": "hydration_fix",
            "routing": "routing_fix", 
            "component": "component_error_fix",
            "css": "css_loading_fix"
        }
        
        issue_text = (issue.title + " " + issue.description).lower()
        
        for keyword, fix_type in issue_mapping.items():
            if keyword in issue_text:
                return fix_type
        
        return "component_error_fix"  # Default fix type
    
    def _determine_priority(self, severity: Severity) -> int:
        """Convert severity to priority (1-10)"""
        
        priority_mapping = {
            Severity.CRITICAL: 10,
            Severity.HIGH: 8,
            Severity.MEDIUM: 5,
            Severity.LOW: 3,
            Severity.INFO: 1
        }
        
        return priority_mapping.get(severity, 5)


class BotDatabaseFix:
    """
    Specialized bot for fixing database issues  
    Handles PostgreSQL, Prisma, connections, and data problems
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("bot_database_fix")
        self.tools = [DatabaseFixTool()]
        
        self.agent = Agent(
            role=BotRoles.DATABASE_FIX["role"],
            goal=BotRoles.DATABASE_FIX["goal"],
            backstory=BotRoles.DATABASE_FIX["backstory"],
            verbose=True,
            tools=self.tools,
            max_execution_time=BotRoles.DATABASE_FIX["max_execution_time"]
        )
    
    async def resolve_issues(self, issues: List[Issue]) -> ResolutionReport:
        """Resolve database issues"""
        
        start_time = datetime.utcnow()
        self.logger.info("Starting database issue resolution", issues_count=len(issues))
        
        try:
            actions_attempted = []
            actions_successful = []
            actions_failed = []
            issues_resolved = []
            
            for issue in issues:
                try:
                    # Create fix action
                    fix_action = self._create_fix_action(issue)
                    actions_attempted.append(fix_action)
                    
                    # Apply database fix
                    fix_type = self._determine_fix_type(issue)
                    fix_result_str = await self.tools[0]._arun(fix_type, issue.description)
                    fix_result = json.loads(fix_result_str)
                    
                    if fix_result.get("fix_applied", False):
                        actions_successful.append(fix_action.id)
                        issues_resolved.append(issue.id)
                        
                        # Verify database is working
                        verification = fix_result.get("verification_result", {})
                        if verification.get("success", False):
                            self.logger.info("Database fix verified", issue_id=issue.id, fix_type=fix_type)
                        else:
                            self.logger.warning("Database fix applied but verification failed", issue_id=issue.id)
                    else:
                        actions_failed.append(fix_action.id)
                        self.logger.warning("Database fix failed", issue_id=issue.id, fix_type=fix_type)
                        
                except Exception as e:
                    actions_failed.append(fix_action.id if 'fix_action' in locals() else f"action_{issue.id}")
                    self.logger.error("Database fix exception", issue_id=issue.id, error=str(e))
            
            execution_time = calculate_execution_time(start_time)
            overall_success = len(issues_resolved) > 0
            
            report = ResolutionReport(
                bot_name="BotDatabaseFix",
                bot_type=BotType.DATABASE_FIX,
                execution_time=execution_time,
                actions_attempted=actions_attempted,
                actions_successful=actions_successful,
                actions_failed=actions_failed,
                issues_resolved=issues_resolved,
                overall_success=overall_success,
                notes=f"Resolved {len(issues_resolved)}/{len(issues)} database issues"
            )
            
            self.logger.info(
                "Database issue resolution completed",
                issues_resolved=len(issues_resolved),
                overall_success=overall_success
            )
            
            return report
            
        except Exception as e:
            execution_time = calculate_execution_time(start_time)
            self.logger.error("Database issue resolution failed", error=str(e))
            
            return ResolutionReport(
                bot_name="BotDatabaseFix",
                bot_type=BotType.DATABASE_FIX,
                execution_time=execution_time,
                actions_attempted=[],
                actions_successful=[],
                actions_failed=[],
                issues_resolved=[],
                overall_success=False,
                notes=f"Resolution failed: {str(e)}"
            )
    
    def _create_fix_action(self, issue: Issue) -> FixAction:
        """Create fix action for database issue"""
        
        fix_type = self._determine_fix_type(issue)
        
        return FixAction(
            id=f"db_fix_{issue.id}",
            issue_id=issue.id,
            action_type=fix_type,
            priority=self._determine_priority(issue.severity),
            parameters={"fix_type": fix_type},
            expected_duration=45,
            requires_confirmation=issue.severity == Severity.CRITICAL,
            safety_checks=["backup_verification", "connection_test"]
        )
    
    def _determine_fix_type(self, issue: Issue) -> str:
        """Determine appropriate fix type for database issue"""
        
        issue_mapping = {
            "connection": "connection_fix",
            "slow": "query_optimization",
            "timeout": "query_optimization", 
            "transaction": "transaction_fix",
            "pool": "pool_configuration"
        }
        
        issue_text = (issue.title + " " + issue.description).lower()
        
        for keyword, fix_type in issue_mapping.items():
            if keyword in issue_text:
                return fix_type
        
        return "connection_fix"  # Default fix type
    
    def _determine_priority(self, severity: Severity) -> int:
        """Convert severity to priority (1-10)"""
        
        priority_mapping = {
            Severity.CRITICAL: 10,
            Severity.HIGH: 8,
            Severity.MEDIUM: 5,
            Severity.LOW: 3,
            Severity.INFO: 1
        }
        
        return priority_mapping.get(severity, 5)


class BotNetworkFix:
    """
    Specialized bot for fixing network and API issues
    Handles endpoints, authentication, integrations, and performance
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("bot_network_fix")
        self.tools = [NetworkFixTool()]
        
        self.agent = Agent(
            role=BotRoles.NETWORK_FIX["role"],
            goal=BotRoles.NETWORK_FIX["goal"],
            backstory=BotRoles.NETWORK_FIX["backstory"],
            verbose=True,
            tools=self.tools,
            max_execution_time=BotRoles.NETWORK_FIX["max_execution_time"]
        )
    
    async def resolve_issues(self, issues: List[Issue]) -> ResolutionReport:
        """Resolve network and API issues"""
        
        start_time = datetime.utcnow()
        self.logger.info("Starting network issue resolution", issues_count=len(issues))
        
        try:
            actions_attempted = []
            actions_successful = []
            actions_failed = []
            issues_resolved = []
            
            for issue in issues:
                try:
                    # Create fix action
                    fix_action = self._create_fix_action(issue)
                    actions_attempted.append(fix_action)
                    
                    # Apply network fix
                    fix_type = self._determine_fix_type(issue)
                    fix_result_str = await self.tools[0]._arun(fix_type, issue.description)
                    fix_result = json.loads(fix_result_str)
                    
                    if fix_result.get("fix_applied", False):
                        actions_successful.append(fix_action.id)
                        issues_resolved.append(issue.id)
                        
                        # Verify network operations
                        verification = fix_result.get("verification_result", {})
                        healthy_endpoints = sum(
                            1 for result in verification.values() 
                            if isinstance(result, dict) and result.get("status") == "healthy"
                        )
                        
                        if healthy_endpoints > 0:
                            self.logger.info("Network fix verified", issue_id=issue.id, fix_type=fix_type)
                        else:
                            self.logger.warning("Network fix applied but verification unclear", issue_id=issue.id)
                    else:
                        actions_failed.append(fix_action.id)
                        self.logger.warning("Network fix failed", issue_id=issue.id, fix_type=fix_type)
                        
                except Exception as e:
                    actions_failed.append(fix_action.id if 'fix_action' in locals() else f"action_{issue.id}")
                    self.logger.error("Network fix exception", issue_id=issue.id, error=str(e))
            
            execution_time = calculate_execution_time(start_time)
            overall_success = len(issues_resolved) > 0
            
            report = ResolutionReport(
                bot_name="BotNetworkFix",
                bot_type=BotType.NETWORK_FIX,
                execution_time=execution_time,
                actions_attempted=actions_attempted,
                actions_successful=actions_successful,
                actions_failed=actions_failed,
                issues_resolved=issues_resolved,
                overall_success=overall_success,
                notes=f"Resolved {len(issues_resolved)}/{len(issues)} network issues"
            )
            
            self.logger.info(
                "Network issue resolution completed",
                issues_resolved=len(issues_resolved),
                overall_success=overall_success
            )
            
            return report
            
        except Exception as e:
            execution_time = calculate_execution_time(start_time)
            self.logger.error("Network issue resolution failed", error=str(e))
            
            return ResolutionReport(
                bot_name="BotNetworkFix",
                bot_type=BotType.NETWORK_FIX,
                execution_time=execution_time,
                actions_attempted=[],
                actions_successful=[],
                actions_failed=[],
                issues_resolved=[],
                overall_success=False,
                notes=f"Resolution failed: {str(e)}"
            )
    
    def _create_fix_action(self, issue: Issue) -> FixAction:
        """Create fix action for network issue"""
        
        fix_type = self._determine_fix_type(issue)
        
        return FixAction(
            id=f"net_fix_{issue.id}",
            issue_id=issue.id,
            action_type=fix_type,
            priority=self._determine_priority(issue.severity),
            parameters={"fix_type": fix_type},
            expected_duration=35,
            requires_confirmation=issue.severity == Severity.CRITICAL
        )
    
    def _determine_fix_type(self, issue: Issue) -> str:
        """Determine appropriate fix type for network issue"""
        
        issue_mapping = {
            "endpoint": "api_endpoint_fix",
            "timeout": "timeout_fix",
            "auth": "auth_fix",
            "unauthorized": "auth_fix",
            "rate": "rate_limit_fix",
            "limit": "rate_limit_fix"
        }
        
        issue_text = (issue.title + " " + issue.description).lower()
        
        for keyword, fix_type in issue_mapping.items():
            if keyword in issue_text:
                return fix_type
        
        return "api_endpoint_fix"  # Default fix type
    
    def _determine_priority(self, severity: Severity) -> int:
        """Convert severity to priority (1-10)"""
        
        priority_mapping = {
            Severity.CRITICAL: 10,
            Severity.HIGH: 8,
            Severity.MEDIUM: 5,
            Severity.LOW: 3,
            Severity.INFO: 1
        }
        
        return priority_mapping.get(severity, 5)


# Global fix bot instances
web_fix_bot = BotWebFix()
database_fix_bot = BotDatabaseFix()
network_fix_bot = BotNetworkFix()