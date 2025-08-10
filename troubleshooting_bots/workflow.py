"""
LangGraph Workflow Orchestration for Hierarchical Troubleshooting System
Orchestrates the flow between diagnostic and fix bots using state management
"""

import asyncio
from typing import Dict, List, Any, Optional, TypedDict, Annotated
from datetime import datetime
import json
from enum import Enum

from models import (
    WorkflowState, SystemInfo, Issue, DiagnosticReport, ResolutionReport,
    Severity, IssueType, BotType
)
from utils import (
    StructuredLogger, generate_session_id, calculate_execution_time,
    prioritize_issues
)

# Mock LangGraph imports for compatibility
class StateGraph:
    """Mock StateGraph implementation"""
    def __init__(self):
        self.nodes = {}
        self.edges = []
        self.conditional_edges = []
        self.entry_point = None
        self.finish_nodes = []
    
    def add_node(self, name: str, func):
        self.nodes[name] = func
        return self
    
    def add_edge(self, from_node: str, to_node: str):
        self.edges.append((from_node, to_node))
        return self
    
    def add_conditional_edges(self, from_node: str, condition_func, mapping: Dict[str, str]):
        self.conditional_edges.append({
            "from": from_node,
            "condition": condition_func,
            "mapping": mapping
        })
        return self
    
    def set_entry_point(self, node: str):
        self.entry_point = node
        return self
    
    def set_finish_point(self, node: str):
        self.finish_nodes.append(node)
        return self
    
    def compile(self):
        return CompiledStateGraph(self)


class CompiledStateGraph:
    """Mock compiled state graph"""
    def __init__(self, graph: StateGraph):
        self.graph = graph
        self.logger = StructuredLogger.get_logger("workflow_graph")
    
    async def ainvoke(self, initial_state: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the workflow asynchronously"""
        current_state = initial_state.copy()
        current_node = self.graph.entry_point
        
        self.logger.info("Starting workflow execution", entry_point=current_node)
        
        while current_node and current_node not in self.graph.finish_nodes:
            if current_node in self.graph.nodes:
                # Execute current node
                self.logger.info("Executing node", node=current_node)
                node_func = self.graph.nodes[current_node]
                current_state = await node_func(current_state)
                
                # Determine next node
                next_node = self._determine_next_node(current_node, current_state)
                current_node = next_node
            else:
                self.logger.error("Unknown node", node=current_node)
                break
        
        self.logger.info("Workflow execution completed", final_node=current_node)
        return current_state
    
    def _determine_next_node(self, current_node: str, state: Dict[str, Any]) -> Optional[str]:
        """Determine the next node based on edges and conditions"""
        
        # Check conditional edges first
        for conditional in self.graph.conditional_edges:
            if conditional["from"] == current_node:
                condition_result = conditional["condition"](state)
                return conditional["mapping"].get(condition_result)
        
        # Check regular edges
        for from_node, to_node in self.graph.edges:
            if from_node == current_node:
                return to_node
        
        return None


class WorkflowPhase(str, Enum):
    """Workflow phase enumeration"""
    INITIALIZATION = "initialization"
    SYSTEM_ASSESSMENT = "system_assessment" 
    DIAGNOSTIC_PHASE = "diagnostic_phase"
    ISSUE_PRIORITIZATION = "issue_prioritization"
    RESOLUTION_PHASE = "resolution_phase"
    VERIFICATION = "verification"
    FINAL_REPORT = "final_report"
    COMPLETED = "completed"


class TroubleshootingWorkflow:
    """
    LangGraph-based workflow orchestration for hierarchical troubleshooting
    Manages the complete flow from system assessment through issue resolution
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("troubleshooting_workflow")
        
        # Import bot instances
        from coordinator import troubleshooting_coordinator
        from diagnostic_bots import (
            web_diagnostic_bot, database_diagnostic_bot, network_diagnostic_bot
        )
        from fix_bots import web_fix_bot, database_fix_bot, network_fix_bot
        
        self.coordinator = troubleshooting_coordinator
        self.diagnostic_bots = {
            BotType.WEB_DIAGNOSTIC: web_diagnostic_bot,
            BotType.DATABASE_DIAGNOSTIC: database_diagnostic_bot,
            BotType.NETWORK_DIAGNOSTIC: network_diagnostic_bot
        }
        self.fix_bots = {
            BotType.WEB_FIX: web_fix_bot,
            BotType.DATABASE_FIX: database_fix_bot,
            BotType.NETWORK_FIX: network_fix_bot
        }
        
        # Build workflow graph
        self.workflow = self._build_workflow()
    
    def _build_workflow(self) -> CompiledStateGraph:
        """Build the LangGraph workflow"""
        
        graph = StateGraph()
        
        # Add workflow nodes
        graph.add_node("initialize", self._initialize_workflow)
        graph.add_node("assess_system", self._assess_system_health)
        graph.add_node("run_diagnostics", self._run_diagnostic_phase)
        graph.add_node("prioritize_issues", self._prioritize_issues)
        graph.add_node("resolve_issues", self._resolve_issues)
        graph.add_node("verify_resolution", self._verify_resolution)
        graph.add_node("generate_report", self._generate_final_report)
        graph.add_node("complete", self._complete_workflow)
        
        # Define workflow edges
        graph.add_edge("initialize", "assess_system")
        graph.add_edge("assess_system", "run_diagnostics")
        graph.add_edge("run_diagnostics", "prioritize_issues")
        
        # Conditional edge based on issues found
        graph.add_conditional_edges(
            "prioritize_issues",
            self._should_resolve_issues,
            {
                "resolve": "resolve_issues",
                "skip_resolution": "verify_resolution"
            }
        )
        
        graph.add_edge("resolve_issues", "verify_resolution")
        graph.add_edge("verify_resolution", "generate_report")
        graph.add_edge("generate_report", "complete")
        
        # Set entry and exit points
        graph.set_entry_point("initialize")
        graph.set_finish_point("complete")
        
        return graph.compile()
    
    async def _initialize_workflow(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Initialize the troubleshooting workflow"""
        
        session_id = generate_session_id()
        start_time = datetime.utcnow()
        
        # Create workflow state
        workflow_state = WorkflowState(
            session_id=session_id,
            phase=WorkflowPhase.INITIALIZATION.value,
            current_step="initialize",
            started_at=start_time
        )
        
        self.logger.info("Workflow initialized", session_id=session_id)
        
        return {
            **state,
            "workflow_state": workflow_state,
            "session_id": session_id,
            "start_time": start_time,
            "phase": WorkflowPhase.SYSTEM_ASSESSMENT.value
        }
    
    async def _assess_system_health(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Assess system health and gather initial information"""
        
        workflow_state: WorkflowState = state["workflow_state"]
        workflow_state.phase = WorkflowPhase.SYSTEM_ASSESSMENT.value
        workflow_state.current_step = "gathering_system_info"
        
        self.logger.info("Starting system assessment", session_id=workflow_state.session_id)
        
        # Gather system information using coordinator
        system_info = await self.coordinator._gather_system_info()
        workflow_state.system_info = system_info
        
        self.logger.info(
            "System assessment completed",
            session_id=workflow_state.session_id,
            api_status=system_info.api_status.get("status", "unknown")
        )
        
        return {
            **state,
            "workflow_state": workflow_state,
            "system_info": system_info,
            "phase": WorkflowPhase.DIAGNOSTIC_PHASE.value
        }
    
    async def _run_diagnostic_phase(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Run comprehensive diagnostics using specialized bots"""
        
        workflow_state: WorkflowState = state["workflow_state"]
        system_info: SystemInfo = state["system_info"]
        
        workflow_state.phase = WorkflowPhase.DIAGNOSTIC_PHASE.value
        workflow_state.current_step = "running_diagnostics"
        
        self.logger.info("Starting diagnostic phase", session_id=workflow_state.session_id)
        
        diagnostic_reports = []
        
        # Run diagnostics in parallel
        diagnostic_tasks = []
        for bot_type, diagnostic_bot in self.diagnostic_bots.items():
            task = diagnostic_bot.run_diagnostics(system_info)
            diagnostic_tasks.append(task)
        
        try:
            # Execute all diagnostic bots
            diagnostic_results = await asyncio.gather(*diagnostic_tasks, return_exceptions=True)
            
            for i, result in enumerate(diagnostic_results):
                if isinstance(result, Exception):
                    self.logger.error("Diagnostic bot failed", error=str(result))
                else:
                    diagnostic_reports.append(result)
                    workflow_state.add_diagnostic_report(result)
            
            self.logger.info(
                "Diagnostic phase completed",
                session_id=workflow_state.session_id,
                reports_generated=len(diagnostic_reports),
                total_issues=len(workflow_state.all_issues)
            )
            
        except Exception as e:
            self.logger.error("Diagnostic phase failed", error=str(e))
        
        return {
            **state,
            "workflow_state": workflow_state,
            "diagnostic_reports": diagnostic_reports,
            "phase": WorkflowPhase.ISSUE_PRIORITIZATION.value
        }
    
    async def _prioritize_issues(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Prioritize issues based on severity and impact"""
        
        workflow_state: WorkflowState = state["workflow_state"]
        workflow_state.phase = WorkflowPhase.ISSUE_PRIORITIZATION.value
        workflow_state.current_step = "prioritizing_issues"
        
        self.logger.info("Starting issue prioritization", session_id=workflow_state.session_id)
        
        # Convert issues to dict format for prioritization
        issues_data = [issue.dict() for issue in workflow_state.all_issues]
        
        # Prioritize issues
        prioritized_issues_data = prioritize_issues(issues_data)
        
        # Convert back to Issue objects
        prioritized_issues = [Issue(**issue_data) for issue_data in prioritized_issues_data]
        workflow_state.prioritized_issues = prioritized_issues
        
        self.logger.info(
            "Issue prioritization completed",
            session_id=workflow_state.session_id,
            total_issues=len(prioritized_issues),
            critical_issues=sum(1 for issue in prioritized_issues if issue.severity == Severity.CRITICAL),
            high_issues=sum(1 for issue in prioritized_issues if issue.severity == Severity.HIGH)
        )
        
        return {
            **state,
            "workflow_state": workflow_state,
            "prioritized_issues": prioritized_issues,
            "phase": WorkflowPhase.RESOLUTION_PHASE.value
        }
    
    def _should_resolve_issues(self, state: Dict[str, Any]) -> str:
        """Determine if issues need resolution"""
        
        workflow_state: WorkflowState = state.get("workflow_state")
        if not workflow_state or not workflow_state.prioritized_issues:
            return "skip_resolution"
        
        # Check if there are any issues that need resolution
        resolvable_issues = [
            issue for issue in workflow_state.prioritized_issues
            if issue.severity in [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM]
        ]
        
        return "resolve" if resolvable_issues else "skip_resolution"
    
    async def _resolve_issues(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Resolve issues using specialized fix bots"""
        
        workflow_state: WorkflowState = state["workflow_state"]
        workflow_state.phase = WorkflowPhase.RESOLUTION_PHASE.value
        workflow_state.current_step = "resolving_issues"
        
        self.logger.info("Starting issue resolution", session_id=workflow_state.session_id)
        
        resolution_reports = []
        
        # Group issues by type for fix bots
        issues_by_type = {
            BotType.WEB_FIX: [],
            BotType.DATABASE_FIX: [],
            BotType.NETWORK_FIX: []
        }
        
        for issue in workflow_state.prioritized_issues[:10]:  # Handle top 10 issues
            fix_bot_type = self._determine_fix_bot_type(issue)
            if fix_bot_type:
                issues_by_type[fix_bot_type].append(issue)
        
        # Execute fix bots
        for bot_type, issues in issues_by_type.items():
            if issues:
                try:
                    fix_bot = self.fix_bots[bot_type]
                    resolution_report = await fix_bot.resolve_issues(issues)
                    resolution_reports.append(resolution_report)
                    workflow_state.add_resolution_report(resolution_report)
                    
                except Exception as e:
                    self.logger.error("Fix bot failed", bot_type=bot_type.value, error=str(e))
        
        self.logger.info(
            "Issue resolution completed",
            session_id=workflow_state.session_id,
            resolution_reports=len(resolution_reports),
            total_resolved=len(workflow_state.resolved_issues)
        )
        
        return {
            **state,
            "workflow_state": workflow_state,
            "resolution_reports": resolution_reports,
            "phase": WorkflowPhase.VERIFICATION.value
        }
    
    def _determine_fix_bot_type(self, issue: Issue) -> Optional[BotType]:
        """Determine appropriate fix bot for issue"""
        
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
    
    async def _verify_resolution(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Verify that issues have been resolved"""
        
        workflow_state: WorkflowState = state["workflow_state"]
        workflow_state.phase = WorkflowPhase.VERIFICATION.value
        workflow_state.current_step = "verifying_resolution"
        
        self.logger.info("Starting resolution verification", session_id=workflow_state.session_id)
        
        # Re-assess system health to verify fixes
        try:
            updated_system_info = await self.coordinator._gather_system_info()
            
            # Compare with previous system info
            verification_results = {
                "previous_health": state.get("system_info", {}).api_status,
                "current_health": updated_system_info.api_status,
                "improvement_detected": self._detect_health_improvement(
                    state.get("system_info", {}), updated_system_info
                )
            }
            
            self.logger.info(
                "Resolution verification completed",
                session_id=workflow_state.session_id,
                improvement_detected=verification_results["improvement_detected"]
            )
            
        except Exception as e:
            self.logger.error("Resolution verification failed", error=str(e))
            verification_results = {"error": str(e)}
        
        return {
            **state,
            "workflow_state": workflow_state,
            "verification_results": verification_results,
            "phase": WorkflowPhase.FINAL_REPORT.value
        }
    
    def _detect_health_improvement(self, previous_info: SystemInfo, current_info: SystemInfo) -> bool:
        """Detect if system health has improved"""
        
        # Simple comparison of API status
        previous_status = previous_info.api_status.get("status", "unknown")
        current_status = current_info.api_status.get("status", "unknown")
        
        status_priority = {
            "healthy": 4,
            "warning": 3,
            "degraded": 2,
            "critical": 1,
            "error": 0,
            "unknown": 0
        }
        
        previous_score = status_priority.get(previous_status, 0)
        current_score = status_priority.get(current_status, 0)
        
        return current_score > previous_score
    
    async def _generate_final_report(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive final report"""
        
        workflow_state: WorkflowState = state["workflow_state"]
        workflow_state.phase = WorkflowPhase.FINAL_REPORT.value
        workflow_state.current_step = "generating_report"
        
        self.logger.info("Generating final report", session_id=workflow_state.session_id)
        
        # Calculate final health score
        final_health_score = workflow_state.calculate_health_score()
        workflow_state.final_health_score = final_health_score
        
        # Determine overall success
        workflow_state.success = final_health_score >= 80.0 and len(workflow_state.resolved_issues) > 0
        
        # Generate summary
        execution_time = calculate_execution_time(workflow_state.started_at)
        
        summary = f"""
Hierarchical Troubleshooting Complete
===================================
Session: {workflow_state.session_id}
Duration: {execution_time:.1f}s
Health Score: {final_health_score}%

Diagnostic Phase:
- {len(workflow_state.diagnostic_reports)} diagnostic bots executed
- {len(workflow_state.all_issues)} issues identified

Resolution Phase: 
- {len(workflow_state.resolution_reports)} fix bots executed
- {len(workflow_state.resolved_issues)} issues resolved

Status: {'SUCCESS' if workflow_state.success else 'PARTIAL SUCCESS'}
        """.strip()
        
        workflow_state.summary = summary
        
        # Create final report
        final_report = {
            "session_id": workflow_state.session_id,
            "success": workflow_state.success,
            "health_score": final_health_score,
            "execution_time": execution_time,
            "summary": summary,
            "metrics": {
                "issues_found": len(workflow_state.all_issues),
                "issues_resolved": len(workflow_state.resolved_issues),
                "diagnostic_bots_run": len(workflow_state.diagnostic_reports),
                "fix_bots_run": len(workflow_state.resolution_reports)
            },
            "workflow_phases": workflow_state.completed_steps,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.logger.info(
            "Final report generated",
            session_id=workflow_state.session_id,
            success=workflow_state.success,
            health_score=final_health_score
        )
        
        return {
            **state,
            "workflow_state": workflow_state,
            "final_report": final_report,
            "phase": WorkflowPhase.COMPLETED.value
        }
    
    async def _complete_workflow(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Complete the workflow"""
        
        workflow_state: WorkflowState = state["workflow_state"]
        workflow_state.phase = WorkflowPhase.COMPLETED.value
        workflow_state.current_step = "complete"
        workflow_state.completed_steps.append("complete")
        
        self.logger.info("Workflow completed", session_id=workflow_state.session_id)
        
        return state
    
    async def run_troubleshooting(self, initial_issue: Optional[str] = None) -> Dict[str, Any]:
        """Run the complete troubleshooting workflow"""
        
        self.logger.info("Starting hierarchical troubleshooting workflow")
        
        try:
            # Initialize state
            initial_state = {
                "initial_issue": initial_issue,
                "start_timestamp": datetime.utcnow().isoformat()
            }
            
            # Execute workflow
            final_state = await self.workflow.ainvoke(initial_state)
            
            return final_state.get("final_report", {})
            
        except Exception as e:
            self.logger.error("Workflow execution failed", error=str(e))
            raise


# Global workflow instance
troubleshooting_workflow = TroubleshootingWorkflow()