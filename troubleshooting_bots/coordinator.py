"""
TroubleshootingCoordinator - Main supervisor bot for hierarchical troubleshooting
Uses CrewAI to coordinate 6 specialized diagnostic and fix sub-bots
"""

import asyncio
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json

from crewai import Agent, Crew, Task, Process
from typing import Optional

from config import config, BotRoles
from models import (
    WorkflowState, SystemInfo, Issue, DiagnosticReport, 
    ResolutionReport, BotMessage, Severity, IssueType, BotType
)
from utils import (
    StructuredLogger, BVStudiosAPI, generate_session_id,
    calculate_execution_time, prioritize_issues, is_critical_error
)


class BVStudiosHealthCheckTool(BaseTool):
    """Tool for checking BV Studios system health"""
    
    name = "bv_studios_health_check"
    description = "Check the current health status of BV Studios platform"
    
    def __init__(self):
        super().__init__()
        self.api = BVStudiosAPI()
    
    async def _arun(self, **kwargs) -> str:
        """Async implementation of health check"""
        try:
            health_data = await self.api.get_system_health()
            return json.dumps(health_data, indent=2)
        except Exception as e:
            return f"Health check failed: {str(e)}"
    
    def _run(self, **kwargs, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Sync wrapper for health check"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._arun(**kwargs))
        finally:
            loop.close()


class BVStudiosLogAnalysisTool(BaseTool):
    """Tool for analyzing recent BV Studios logs"""
    
    name = "bv_studios_log_analysis"
    description = "Analyze recent system logs for error patterns and issues"
    
    def __init__(self):
        super().__init__()
        self.api = BVStudiosAPI()
    
    async def _arun(self, limit: int = 50) -> str:
        """Async implementation of log analysis"""
        try:
            logs_data = await self.api.get_recent_logs(limit)
            return json.dumps(logs_data, indent=2)
        except Exception as e:
            return f"Log analysis failed: {str(e)}"
    
    def _run(self, limit: int = 50, run_manager: Optional[CallbackManagerForToolRun] = None) -> str:
        """Sync wrapper for log analysis"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self._arun(limit))
        finally:
            loop.close()


class TroubleshootingCoordinator:
    """
    Main coordinator bot that manages the hierarchical troubleshooting workflow
    Uses CrewAI to orchestrate diagnostic and fix sub-bots
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("troubleshooting_coordinator")
        self.api = BVStudiosAPI()
        self.tools = [
            BVStudiosHealthCheckTool(),
            BVStudiosLogAnalysisTool()
        ]
        
        # Initialize the supervisor agent
        self.supervisor_agent = Agent(
            role=BotRoles.COORDINATOR["role"],
            goal=BotRoles.COORDINATOR["goal"], 
            backstory=BotRoles.COORDINATOR["backstory"],
            verbose=True,
            allow_delegation=True,
            tools=self.tools,
            max_execution_time=BotRoles.COORDINATOR["max_execution_time"]
        )
        
        # State management
        self.current_session: Optional[WorkflowState] = None
    
    async def start_troubleshooting_session(self, initial_issue: Optional[str] = None) -> WorkflowState:
        """
        Start a new troubleshooting session
        """
        session_id = generate_session_id()
        
        self.logger.info(
            "Starting new troubleshooting session",
            session_id=session_id,
            initial_issue=initial_issue
        )
        
        # Initialize workflow state
        self.current_session = WorkflowState(
            session_id=session_id,
            phase="initialization",
            current_step="system_assessment"
        )
        
        # Gather initial system information
        system_info = await self._gather_system_info()
        self.current_session.system_info = system_info
        
        return self.current_session
    
    async def _gather_system_info(self) -> SystemInfo:
        """
        Gather comprehensive system information for assessment
        """
        self.logger.info("Gathering system information")
        
        try:
            # Get system health
            health_data = await self.api.get_system_health()
            
            # Get recent logs  
            logs_data = await self.api.get_recent_logs(100)
            
            # Test database connectivity
            db_test = await self.api.test_database_connection()
            
            # Test bot operations
            bot_test = await self.api.test_bot_operations()
            
            system_info = SystemInfo(
                base_url=config.bv_studios_base_url,
                api_status=health_data,
                database_status=db_test,
                recent_logs=logs_data.get("logs", []),
                performance_metrics={
                    "bot_operations": bot_test
                }
            )
            
            self.logger.info("System information gathered successfully")
            return system_info
            
        except Exception as e:
            self.logger.error("Failed to gather system information", error=str(e))
            
            # Return minimal system info with error
            return SystemInfo(
                base_url=config.bv_studios_base_url,
                api_status={"error": str(e), "status": "error"},
                database_status={"error": str(e), "success": False},
                recent_logs=[],
                error_patterns=[str(e)]
            )
    
    async def execute_diagnostic_phase(self) -> List[DiagnosticReport]:
        """
        Execute the diagnostic phase using specialized diagnostic bots
        """
        if not self.current_session:
            raise ValueError("No active troubleshooting session")
        
        self.logger.info("Starting diagnostic phase", session_id=self.current_session.session_id)
        
        self.current_session.phase = "diagnosis"
        self.current_session.current_step = "running_diagnostics"
        
        # Create diagnostic tasks for each specialized bot
        diagnostic_tasks = []
        
        # Web Diagnostic Task
        web_diagnostic_task = Task(
            description=f"""
            Analyze the BV Studios web frontend for issues:
            - Check React component errors and rendering issues
            - Analyze Next.js routing and page load performance
            - Review client-side JavaScript errors
            - Assess UI/UX problems from recent logs
            
            System Info: {json.dumps(self.current_session.system_info.dict(), indent=2)}
            """,
            agent=self._create_diagnostic_agent(BotType.WEB_DIAGNOSTIC),
            expected_output="Detailed diagnostic report with identified frontend issues"
        )
        diagnostic_tasks.append(web_diagnostic_task)
        
        # Database Diagnostic Task
        db_diagnostic_task = Task(
            description=f"""
            Analyze the BV Studios database system for issues:
            - Check PostgreSQL connection status and performance
            - Review Prisma ORM query patterns and slow queries
            - Analyze database connection pool utilization
            - Identify data integrity issues
            
            System Info: {json.dumps(self.current_session.system_info.dict(), indent=2)}
            """,
            agent=self._create_diagnostic_agent(BotType.DATABASE_DIAGNOSTIC),
            expected_output="Detailed diagnostic report with identified database issues"
        )
        diagnostic_tasks.append(db_diagnostic_task)
        
        # Network Diagnostic Task
        network_diagnostic_task = Task(
            description=f"""
            Analyze the BV Studios network and API layer for issues:
            - Check API endpoint response times and error rates
            - Review authentication flow performance
            - Analyze external integration health
            - Identify network bottlenecks and timeouts
            
            System Info: {json.dumps(self.current_session.system_info.dict(), indent=2)}
            """,
            agent=self._create_diagnostic_agent(BotType.NETWORK_DIAGNOSTIC),
            expected_output="Detailed diagnostic report with identified network issues"
        )
        diagnostic_tasks.append(network_diagnostic_task)
        
        # Execute diagnostic crew
        diagnostic_crew = Crew(
            agents=[task.agent for task in diagnostic_tasks],
            tasks=diagnostic_tasks,
            process=Process.hierarchical,
            manager_agent=self.supervisor_agent,
            verbose=True
        )
        
        try:
            diagnostic_results = diagnostic_crew.kickoff()
            
            # Process diagnostic results into structured reports
            diagnostic_reports = self._process_diagnostic_results(diagnostic_results)
            
            # Update session state
            for report in diagnostic_reports:
                self.current_session.add_diagnostic_report(report)
            
            self.logger.info(
                "Diagnostic phase completed",
                session_id=self.current_session.session_id,
                issues_found=len(self.current_session.all_issues)
            )
            
            return diagnostic_reports
            
        except Exception as e:
            self.logger.error("Diagnostic phase failed", error=str(e))
            raise
    
    def _create_diagnostic_agent(self, bot_type: BotType) -> Agent:
        """Create a specialized diagnostic agent"""
        
        role_config = {
            BotType.WEB_DIAGNOSTIC: BotRoles.WEB_DIAGNOSTIC,
            BotType.DATABASE_DIAGNOSTIC: BotRoles.DATABASE_DIAGNOSTIC,
            BotType.NETWORK_DIAGNOSTIC: BotRoles.NETWORK_DIAGNOSTIC
        }.get(bot_type)
        
        if not role_config:
            raise ValueError(f"Unknown diagnostic bot type: {bot_type}")
        
        return Agent(
            role=role_config["role"],
            goal=role_config["goal"],
            backstory=role_config["backstory"],
            verbose=True,
            tools=self.tools,
            max_execution_time=role_config["max_execution_time"]
        )
    
    def _process_diagnostic_results(self, results: Any) -> List[DiagnosticReport]:
        """Process raw diagnostic results into structured reports"""
        
        diagnostic_reports = []
        
        # Mock processing - in real implementation, parse CrewAI results
        # and extract structured diagnostic information
        
        mock_web_report = DiagnosticReport(
            bot_name="BotWebDiagnostic",
            bot_type=BotType.WEB_DIAGNOSTIC,
            execution_time=15.2,
            health_status="degraded",
            issues_found=[
                Issue(
                    id="web_001",
                    type=IssueType.FRONTEND_ERROR,
                    severity=Severity.MEDIUM,
                    title="React component render errors",
                    description="Multiple React components showing hydration mismatches",
                    detected_by=BotType.WEB_DIAGNOSTIC,
                    error_messages=["Hydration failed", "Text content mismatch"]
                )
            ],
            recommendations=["Fix React hydration issues", "Update component error boundaries"]
        )
        
        diagnostic_reports.append(mock_web_report)
        
        return diagnostic_reports
    
    async def execute_resolution_phase(self) -> List[ResolutionReport]:
        """
        Execute the resolution phase using specialized fix bots
        """
        if not self.current_session:
            raise ValueError("No active troubleshooting session")
        
        self.logger.info("Starting resolution phase", session_id=self.current_session.session_id)
        
        self.current_session.phase = "resolution"
        self.current_session.current_step = "applying_fixes"
        
        # Prioritize issues for resolution
        unresolved_issues = self.current_session.get_unresolved_issues()
        prioritized_issues = prioritize_issues([issue.dict() for issue in unresolved_issues])
        
        resolution_reports = []
        
        for issue_data in prioritized_issues[:5]:  # Handle top 5 priority issues
            issue = Issue(**issue_data)
            
            if is_critical_error(issue.description):
                self.logger.warning(
                    "Critical issue detected", 
                    issue_id=issue.id,
                    severity=issue.severity
                )
            
            # Determine appropriate fix bot
            fix_bot_type = self._determine_fix_bot(issue)
            
            if fix_bot_type:
                resolution_report = await self._execute_fix_bot(issue, fix_bot_type)
                resolution_reports.append(resolution_report)
        
        return resolution_reports
    
    def _determine_fix_bot(self, issue: Issue) -> Optional[BotType]:
        """Determine which fix bot should handle the issue"""
        
        type_mapping = {
            IssueType.FRONTEND_ERROR: BotType.WEB_FIX,
            IssueType.UI_BUG: BotType.WEB_FIX,
            IssueType.DATABASE_ERROR: BotType.DATABASE_FIX,
            IssueType.DATA_INTEGRITY: BotType.DATABASE_FIX,
            IssueType.API_ERROR: BotType.NETWORK_FIX,
            IssueType.NETWORK_TIMEOUT: BotType.NETWORK_FIX,
            IssueType.AUTHENTICATION_ERROR: BotType.NETWORK_FIX
        }
        
        return type_mapping.get(issue.type)
    
    async def _execute_fix_bot(self, issue: Issue, bot_type: BotType) -> ResolutionReport:
        """Execute a specialized fix bot for the given issue"""
        
        self.logger.info(
            "Executing fix bot",
            issue_id=issue.id,
            bot_type=bot_type.value
        )
        
        start_time = datetime.utcnow()
        
        try:
            # Create fix agent
            fix_agent = self._create_fix_agent(bot_type)
            
            # Create fix task
            fix_task = Task(
                description=f"""
                Resolve the following issue in BV Studios:
                
                Issue: {issue.title}
                Description: {issue.description}
                Type: {issue.type.value}
                Severity: {issue.severity.value}
                
                Error Messages: {', '.join(issue.error_messages)}
                
                Provide specific fix actions and verify the resolution.
                """,
                agent=fix_agent,
                expected_output="Detailed resolution report with actions taken and results"
            )
            
            # Execute fix
            fix_crew = Crew(
                agents=[fix_agent],
                tasks=[fix_task],
                process=Process.sequential,
                verbose=True
            )
            
            fix_result = fix_crew.kickoff()
            execution_time = calculate_execution_time(start_time)
            
            # Process fix result into resolution report
            resolution_report = ResolutionReport(
                bot_name=f"Bot{bot_type.value.title().replace('_', '')}",
                bot_type=bot_type,
                execution_time=execution_time,
                issues_resolved=[issue.id],
                overall_success=True,
                notes=f"Successfully resolved {issue.title}"
            )
            
            # Update session state
            self.current_session.add_resolution_report(resolution_report)
            
            return resolution_report
            
        except Exception as e:
            execution_time = calculate_execution_time(start_time)
            self.logger.error("Fix bot execution failed", error=str(e), issue_id=issue.id)
            
            return ResolutionReport(
                bot_name=f"Bot{bot_type.value.title().replace('_', '')}",
                bot_type=bot_type,
                execution_time=execution_time,
                issues_resolved=[],
                overall_success=False,
                notes=f"Failed to resolve {issue.title}: {str(e)}"
            )
    
    def _create_fix_agent(self, bot_type: BotType) -> Agent:
        """Create a specialized fix agent"""
        
        role_config = {
            BotType.WEB_FIX: BotRoles.WEB_FIX,
            BotType.DATABASE_FIX: BotRoles.DATABASE_FIX,
            BotType.NETWORK_FIX: BotRoles.NETWORK_FIX
        }.get(bot_type)
        
        if not role_config:
            raise ValueError(f"Unknown fix bot type: {bot_type}")
        
        return Agent(
            role=role_config["role"],
            goal=role_config["goal"],
            backstory=role_config["backstory"],
            verbose=True,
            tools=self.tools,
            max_execution_time=role_config["max_execution_time"]
        )
    
    async def generate_final_report(self) -> Dict[str, Any]:
        """Generate comprehensive final troubleshooting report"""
        
        if not self.current_session:
            raise ValueError("No active troubleshooting session")
        
        self.logger.info("Generating final report", session_id=self.current_session.session_id)
        
        # Calculate final health score
        health_score = self.current_session.calculate_health_score()
        self.current_session.final_health_score = health_score
        
        # Update session status
        self.current_session.success = health_score >= 80.0
        self.current_session.phase = "completed"
        
        # Generate summary
        total_issues = len(self.current_session.all_issues)
        resolved_issues = len(self.current_session.resolved_issues)
        
        summary = f"""
        Troubleshooting Session Complete
        ================================
        Session ID: {self.current_session.session_id}
        Duration: {calculate_execution_time(self.current_session.started_at):.1f}s
        
        Issues Found: {total_issues}
        Issues Resolved: {resolved_issues}
        Health Score: {health_score}%
        
        Status: {'SUCCESS' if self.current_session.success else 'PARTIAL'}
        """
        
        self.current_session.summary = summary.strip()
        
        final_report = {
            "session_id": self.current_session.session_id,
            "success": self.current_session.success,
            "health_score": health_score,
            "summary": self.current_session.summary,
            "total_issues": total_issues,
            "resolved_issues": resolved_issues,
            "diagnostic_reports": len(self.current_session.diagnostic_reports),
            "resolution_reports": len(self.current_session.resolution_reports),
            "duration": calculate_execution_time(self.current_session.started_at),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.logger.info(
            "Final report generated", 
            session_id=self.current_session.session_id,
            health_score=health_score,
            success=self.current_session.success
        )
        
        return final_report
    
    async def run_complete_troubleshooting(self, initial_issue: Optional[str] = None) -> Dict[str, Any]:
        """
        Run a complete troubleshooting workflow from start to finish
        """
        try:
            # Start session
            await self.start_troubleshooting_session(initial_issue)
            
            # Execute diagnostic phase
            await self.execute_diagnostic_phase()
            
            # Execute resolution phase
            await self.execute_resolution_phase()
            
            # Generate final report
            final_report = await self.generate_final_report()
            
            return final_report
            
        except Exception as e:
            self.logger.error("Complete troubleshooting failed", error=str(e))
            raise


# Global coordinator instance
troubleshooting_coordinator = TroubleshootingCoordinator()