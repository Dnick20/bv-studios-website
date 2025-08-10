"""
Example Usage and Testing Scenarios for the Hierarchical Troubleshooting System
Demonstrates how to use the troubleshooting bots and provides test scenarios
"""

import asyncio
import os
from typing import Dict, Any, Optional
from datetime import datetime

# Set environment variables for testing
os.environ.setdefault("OPENAI_API_KEY", "sk-test-key-for-examples")
os.environ.setdefault("DATABASE_URL", "postgresql://user:pass@localhost:5432/bv_studios")

from workflow import troubleshooting_workflow
from coordinator import troubleshooting_coordinator
from monitoring import monitoring_system
from models import Issue, Severity, IssueType, BotType
from utils import StructuredLogger


class TroubleshootingExamples:
    """
    Collection of example scenarios for the troubleshooting system
    Demonstrates various use cases and testing approaches
    """
    
    def __init__(self):
        self.logger = StructuredLogger.get_logger("troubleshooting_examples")
        self.monitoring = monitoring_system
    
    async def example_1_basic_troubleshooting(self):
        """
        Example 1: Basic troubleshooting workflow
        Demonstrates a simple end-to-end troubleshooting session
        """
        
        print("\n" + "="*60)
        print("EXAMPLE 1: Basic Troubleshooting Workflow")
        print("="*60)
        
        try:
            # Start monitoring
            async with self.monitoring.performance_monitor.monitor_operation(
                bot_name="example_workflow",
                bot_type=BotType.COORDINATOR,
                operation="basic_troubleshooting"
            ):
                
                # Run the complete troubleshooting workflow
                result = await troubleshooting_workflow.run_troubleshooting(
                    initial_issue="Users reporting slow page load times"
                )
                
                print(f"Troubleshooting completed!")
                print(f"Session ID: {result.get('session_id', 'unknown')}")
                print(f"Success: {result.get('success', False)}")
                print(f"Health Score: {result.get('health_score', 0)}%")
                print(f"Duration: {result.get('execution_time', 0):.1f}s")
                
                if result.get('summary'):
                    print(f"\nSummary:\n{result['summary']}")
                
                return result
                
        except Exception as e:
            print(f"Example 1 failed: {str(e)}")
            self.logger.error("Example 1 failed", error=str(e))
            return None
    
    async def example_2_coordinator_only(self):
        """
        Example 2: Using only the coordinator bot
        Demonstrates direct coordinator usage without full workflow
        """
        
        print("\n" + "="*60)
        print("EXAMPLE 2: Coordinator Bot Only")
        print("="*60)
        
        try:
            # Start a troubleshooting session
            session = await troubleshooting_coordinator.start_troubleshooting_session(
                initial_issue="Database connection errors"
            )
            
            print(f"Session started: {session.session_id}")
            print(f"Phase: {session.phase}")
            print(f"System Info Gathered: {session.system_info is not None}")
            
            # Run diagnostic phase
            diagnostic_reports = await troubleshooting_coordinator.execute_diagnostic_phase()
            
            print(f"\nDiagnostic Phase Complete:")
            print(f"- Reports generated: {len(diagnostic_reports)}")
            print(f"- Issues found: {len(session.all_issues)}")
            
            for report in diagnostic_reports:
                print(f"  * {report.bot_name}: {report.health_status} ({len(report.issues_found)} issues)")
            
            # Generate final report
            final_report = await troubleshooting_coordinator.generate_final_report()
            
            print(f"\nFinal Report:")
            print(f"Success: {final_report.get('success', False)}")
            print(f"Health Score: {final_report.get('health_score', 0)}%")
            
            return final_report
            
        except Exception as e:
            print(f"Example 2 failed: {str(e)}")
            self.logger.error("Example 2 failed", error=str(e))
            return None
    
    async def example_3_individual_diagnostic_bots(self):
        """
        Example 3: Testing individual diagnostic bots
        Demonstrates using diagnostic bots independently
        """
        
        print("\n" + "="*60)
        print("EXAMPLE 3: Individual Diagnostic Bots")
        print("="*60)
        
        try:
            from diagnostic_bots import (
                web_diagnostic_bot, database_diagnostic_bot, network_diagnostic_bot
            )
            from models import SystemInfo
            
            # Create mock system info
            system_info = SystemInfo(
                base_url="https://bv-studios-website.vercel.app",
                api_status={"status": "online", "response_time": 250},
                database_status={"connected": True, "pool_size": 10},
                recent_logs=[
                    {"level": "error", "message": "React hydration failed", "timestamp": "2024-01-01T12:00:00Z"},
                    {"level": "warn", "message": "Database query slow", "timestamp": "2024-01-01T12:01:00Z"},
                    {"level": "error", "message": "API timeout", "timestamp": "2024-01-01T12:02:00Z"}
                ]
            )
            
            # Test each diagnostic bot
            diagnostic_bots = [
                ("Web Diagnostic", web_diagnostic_bot),
                ("Database Diagnostic", database_diagnostic_bot), 
                ("Network Diagnostic", network_diagnostic_bot)
            ]
            
            results = {}
            
            for bot_name, bot in diagnostic_bots:
                print(f"\nTesting {bot_name}...")
                
                try:
                    report = await bot.run_diagnostics(system_info)
                    
                    print(f"- Health Status: {report.health_status}")
                    print(f"- Issues Found: {len(report.issues_found)}")
                    print(f"- Execution Time: {report.execution_time:.2f}s")
                    print(f"- Recommendations: {len(report.recommendations)}")
                    
                    if report.issues_found:
                        print("  Issues:")
                        for issue in report.issues_found[:3]:  # Show first 3 issues
                            print(f"    * {issue.title} ({issue.severity.value})")
                    
                    results[bot_name] = report
                    
                except Exception as e:
                    print(f"- ERROR: {str(e)}")
                    results[bot_name] = None
            
            return results
            
        except Exception as e:
            print(f"Example 3 failed: {str(e)}")
            self.logger.error("Example 3 failed", error=str(e))
            return None
    
    async def example_4_individual_fix_bots(self):
        """
        Example 4: Testing individual fix bots
        Demonstrates using fix bots to resolve issues
        """
        
        print("\n" + "="*60)
        print("EXAMPLE 4: Individual Fix Bots")
        print("="*60)
        
        try:
            from fix_bots import web_fix_bot, database_fix_bot, network_fix_bot
            
            # Create mock issues to resolve
            mock_issues = [
                Issue(
                    id="web_001",
                    type=IssueType.FRONTEND_ERROR,
                    severity=Severity.HIGH,
                    title="React hydration mismatch",
                    description="React components showing hydration errors on page load",
                    detected_by=BotType.WEB_DIAGNOSTIC,
                    error_messages=["Hydration failed", "Text content does not match"]
                ),
                Issue(
                    id="db_001", 
                    type=IssueType.DATABASE_ERROR,
                    severity=Severity.CRITICAL,
                    title="Database connection timeout",
                    description="Database connections timing out after 30 seconds",
                    detected_by=BotType.DATABASE_DIAGNOSTIC,
                    error_messages=["Connection timeout", "Pool exhausted"]
                ),
                Issue(
                    id="net_001",
                    type=IssueType.API_ERROR,
                    severity=Severity.MEDIUM,
                    title="API endpoint returning 500 errors",
                    description="Multiple API endpoints returning server errors",
                    detected_by=BotType.NETWORK_DIAGNOSTIC,
                    error_messages=["Internal server error", "Service unavailable"]
                )
            ]
            
            # Test each fix bot
            fix_bots = [
                ("Web Fix", web_fix_bot, [mock_issues[0]]),
                ("Database Fix", database_fix_bot, [mock_issues[1]]),
                ("Network Fix", network_fix_bot, [mock_issues[2]])
            ]
            
            results = {}
            
            for bot_name, bot, issues in fix_bots:
                print(f"\nTesting {bot_name}...")
                print(f"Issues to resolve: {len(issues)}")
                
                try:
                    report = await bot.resolve_issues(issues)
                    
                    print(f"- Overall Success: {report.overall_success}")
                    print(f"- Actions Attempted: {len(report.actions_attempted)}")
                    print(f"- Actions Successful: {len(report.actions_successful)}")
                    print(f"- Issues Resolved: {len(report.issues_resolved)}")
                    print(f"- Execution Time: {report.execution_time:.2f}s")
                    print(f"- Notes: {report.notes}")
                    
                    results[bot_name] = report
                    
                except Exception as e:
                    print(f"- ERROR: {str(e)}")
                    results[bot_name] = None
            
            return results
            
        except Exception as e:
            print(f"Example 4 failed: {str(e)}")
            self.logger.error("Example 4 failed", error=str(e))
            return None
    
    async def example_5_monitoring_and_metrics(self):
        """
        Example 5: Monitoring and metrics collection
        Demonstrates the monitoring system capabilities
        """
        
        print("\n" + "="*60)
        print("EXAMPLE 5: Monitoring and Metrics")
        print("="*60)
        
        try:
            # Generate some sample metrics
            self.monitoring.metrics_collector.increment_counter("test_operations", 10)
            self.monitoring.metrics_collector.set_gauge("system_health", 85.5)
            self.monitoring.metrics_collector.record_timer("operation_duration", 2.34)
            
            # Record some test errors
            test_error = Exception("Test error for demonstration")
            self.monitoring.error_tracker.record_error(
                bot_name="test_bot",
                bot_type=BotType.COORDINATOR,
                operation="test_operation",
                error=test_error,
                severity=Severity.MEDIUM
            )
            
            # Get comprehensive status
            status = self.monitoring.get_comprehensive_status()
            
            print("Monitoring System Status:")
            print(f"- Status: {status['monitoring_system']['status']}")
            print(f"- Health Score: {status['system_health']['health_score']:.1f}")
            print(f"- Health Status: {status['system_health']['health_status']}")
            
            print(f"\nMetrics Summary:")
            metrics_summary = status['system_health']['metrics_summary']
            print(f"- Total Counters: {len(metrics_summary['counters'])}")
            print(f"- Total Gauges: {len(metrics_summary['gauges'])}")
            print(f"- Total Timers: {len(metrics_summary['timers'])}")
            
            print(f"\nError Summary:")
            error_summary = status['system_health']['error_summary']
            print(f"- Total Errors: {error_summary['total_errors']}")
            print(f"- Error Types: {list(error_summary['error_types'].keys())}")
            
            print(f"\nRecommendations:")
            for recommendation in status['system_health']['recommendations']:
                print(f"- {recommendation}")
            
            # Export monitoring data
            export_file = await self.monitoring.export_monitoring_data()
            print(f"\nMonitoring data exported to: {export_file}")
            
            return status
            
        except Exception as e:
            print(f"Example 5 failed: {str(e)}")
            self.logger.error("Example 5 failed", error=str(e))
            return None
    
    async def example_6_error_scenarios(self):
        """
        Example 6: Error handling scenarios
        Demonstrates how the system handles various error conditions
        """
        
        print("\n" + "="*60)
        print("EXAMPLE 6: Error Handling Scenarios")
        print("="*60)
        
        try:
            print("Testing error scenarios...")
            
            # Scenario 1: Invalid configuration
            print("\n1. Testing invalid configuration handling...")
            try:
                # This should handle missing API keys gracefully
                from config import config
                print(f"   Base URL configured: {config.bv_studios_base_url}")
                print("   ✓ Configuration loaded successfully")
            except Exception as e:
                print(f"   ⚠ Configuration error handled: {str(e)}")
            
            # Scenario 2: Network connectivity issues
            print("\n2. Testing network error handling...")
            try:
                from utils import BVStudiosAPI
                api = BVStudiosAPI()
                
                # This might fail due to network issues
                health_data = await api.get_system_health()
                print("   ✓ Network connectivity successful")
            except Exception as e:
                print(f"   ⚠ Network error handled: {str(e)}")
            
            # Scenario 3: Bot execution errors
            print("\n3. Testing bot error resilience...")
            try:
                # Start a session with potential issues
                session = await troubleshooting_coordinator.start_troubleshooting_session(
                    initial_issue="Test error scenario"
                )
                print(f"   ✓ Session started: {session.session_id}")
                
                # This might encounter errors but should handle them gracefully
                try:
                    diagnostic_reports = await troubleshooting_coordinator.execute_diagnostic_phase()
                    print(f"   ✓ Diagnostics completed with {len(diagnostic_reports)} reports")
                except Exception as e:
                    print(f"   ⚠ Diagnostic errors handled: {str(e)}")
                
            except Exception as e:
                print(f"   ⚠ Bot execution error handled: {str(e)}")
            
            print("\n✓ Error scenario testing completed")
            
            # Show error tracking
            error_summary = self.monitoring.error_tracker.get_error_summary()
            print(f"\nError Tracking Summary:")
            print(f"- Total errors tracked: {error_summary['total_errors']}")
            
            if error_summary['error_types']:
                print("- Error types encountered:")
                for error_type, count in error_summary['error_types'].items():
                    print(f"  * {error_type}: {count}")
            
            return error_summary
            
        except Exception as e:
            print(f"Example 6 failed: {str(e)}")
            self.logger.error("Example 6 failed", error=str(e))
            return None
    
    async def run_all_examples(self):
        """
        Run all example scenarios
        Demonstrates the complete system functionality
        """
        
        print("\n" + "="*80)
        print("RUNNING ALL TROUBLESHOOTING SYSTEM EXAMPLES")
        print("="*80)
        print(f"Started at: {datetime.utcnow().isoformat()}")
        
        examples = [
            ("Basic Troubleshooting Workflow", self.example_1_basic_troubleshooting),
            ("Coordinator Bot Only", self.example_2_coordinator_only),
            ("Individual Diagnostic Bots", self.example_3_individual_diagnostic_bots),
            ("Individual Fix Bots", self.example_4_individual_fix_bots),
            ("Monitoring and Metrics", self.example_5_monitoring_and_metrics),
            ("Error Handling Scenarios", self.example_6_error_scenarios)
        ]
        
        results = {}
        
        for example_name, example_func in examples:
            print(f"\n{'='*20} {example_name} {'='*20}")
            
            try:
                start_time = datetime.utcnow()
                result = await example_func()
                end_time = datetime.utcnow()
                duration = (end_time - start_time).total_seconds()
                
                results[example_name] = {
                    "success": result is not None,
                    "result": result,
                    "duration": duration
                }
                
                print(f"✓ {example_name} completed in {duration:.1f}s")
                
            except Exception as e:
                results[example_name] = {
                    "success": False,
                    "error": str(e),
                    "duration": 0
                }
                print(f"✗ {example_name} failed: {str(e)}")
        
        # Final summary
        print("\n" + "="*80)
        print("EXAMPLES SUMMARY")
        print("="*80)
        
        successful = sum(1 for r in results.values() if r["success"])
        total = len(results)
        
        print(f"Examples completed: {successful}/{total}")
        print(f"Success rate: {(successful/total)*100:.1f}%")
        
        for example_name, result in results.items():
            status = "✓" if result["success"] else "✗"
            duration = result.get("duration", 0)
            print(f"{status} {example_name}: {duration:.1f}s")
        
        print(f"\nCompleted at: {datetime.utcnow().isoformat()}")
        
        return results


# Main execution function
async def run_examples():
    """Run example scenarios"""
    
    # Setup logging
    StructuredLogger.setup_logging()
    
    # Create examples instance
    examples = TroubleshootingExamples()
    
    # Run all examples
    results = await examples.run_all_examples()
    
    return results


# Entry point for running examples
if __name__ == "__main__":
    print("BV Studios Hierarchical Troubleshooting System - Examples")
    print("========================================================")
    
    try:
        # Run the examples
        results = asyncio.run(run_examples())
        
        print("\n🎉 All examples completed!")
        print("\nNext steps:")
        print("1. Review the monitoring data exported")
        print("2. Check system logs for detailed execution traces")
        print("3. Integrate the troubleshooting system with your BV Studios platform")
        print("4. Set up regular health monitoring and alerting")
        
    except KeyboardInterrupt:
        print("\n⚠️  Examples interrupted by user")
    except Exception as e:
        print(f"\n❌ Examples failed: {str(e)}")
    
    print("\nExample session complete.")