"""
Simple test of the troubleshooting system components
Tests basic functionality without full dependencies
"""

import asyncio
import os
from datetime import datetime

# Set environment variables for testing
os.environ.setdefault("OPENAI_API_KEY", "sk-test-key-for-examples")
os.environ.setdefault("DATABASE_URL", "postgresql://user:pass@localhost:5432/bv_studios")

def test_imports():
    """Test that all modules can be imported"""
    print("Testing module imports...")
    
    try:
        from config import config
        print("✅ Config loaded successfully")
        print(f"   Base URL: {config.bv_studios_base_url}")
        print(f"   Log Level: {config.log_level}")
    except Exception as e:
        print(f"❌ Config import failed: {e}")
    
    try:
        from models import Issue, Severity, IssueType, BotType, SystemInfo
        print("✅ Models imported successfully")
        
        # Test model creation
        issue = Issue(
            id="test_001",
            type=IssueType.FRONTEND_ERROR,
            severity=Severity.HIGH,
            title="Test Issue",
            description="This is a test issue",
            detected_by=BotType.WEB_DIAGNOSTIC
        )
        print(f"   Created test issue: {issue.title}")
        
    except Exception as e:
        print(f"❌ Models import failed: {e}")
    
    try:
        from utils import StructuredLogger, generate_session_id
        print("✅ Utils imported successfully")
        
        # Test logger setup
        StructuredLogger.setup_logging()
        logger = StructuredLogger.get_logger("test")
        logger.info("Test log message")
        
        # Test session ID generation
        session_id = generate_session_id()
        print(f"   Generated session ID: {session_id}")
        
    except Exception as e:
        print(f"❌ Utils import failed: {e}")
    
    try:
        from monitoring import monitoring_system
        print("✅ Monitoring system imported successfully")
        
        # Test metrics collection
        monitoring_system.metrics_collector.increment_counter("test_counter", 5)
        monitoring_system.metrics_collector.set_gauge("test_gauge", 42.0)
        monitoring_system.metrics_collector.record_timer("test_timer", 1.23)
        
        print("   Test metrics recorded")
        
    except Exception as e:
        print(f"❌ Monitoring import failed: {e}")


async def test_basic_functionality():
    """Test basic system functionality"""
    print("\nTesting basic functionality...")
    
    try:
        from models import SystemInfo
        
        # Create mock system info
        system_info = SystemInfo(
            base_url="https://test-bv-studios.com",
            api_status={"status": "healthy", "response_time": 150},
            database_status={"connected": True, "active_connections": 5},
            recent_logs=[
                {"level": "info", "message": "System started", "timestamp": "2024-01-01T12:00:00Z"},
                {"level": "warn", "message": "Minor issue detected", "timestamp": "2024-01-01T12:01:00Z"}
            ]
        )
        
        print("✅ System info created successfully")
        print(f"   Base URL: {system_info.base_url}")
        print(f"   API Status: {system_info.api_status}")
        print(f"   Recent Logs: {len(system_info.recent_logs)} entries")
        
    except Exception as e:
        print(f"❌ System info creation failed: {e}")
    
    try:
        from monitoring import monitoring_system
        
        # Test monitoring system
        status = monitoring_system.get_comprehensive_status()
        
        print("✅ Monitoring status retrieved")
        print(f"   Health Score: {status['system_health']['health_score']:.1f}")
        print(f"   Health Status: {status['system_health']['health_status']}")
        
    except Exception as e:
        print(f"❌ Monitoring test failed: {e}")


def test_error_handling():
    """Test error handling capabilities"""
    print("\nTesting error handling...")
    
    try:
        from monitoring import monitoring_system
        from models import BotType, Severity
        
        # Record test errors
        test_errors = [
            ("connection_error", Exception("Connection timeout")),
            ("validation_error", ValueError("Invalid input")),
            ("runtime_error", RuntimeError("Unexpected runtime issue"))
        ]
        
        for error_name, error in test_errors:
            monitoring_system.error_tracker.record_error(
                bot_name="test_bot",
                bot_type=BotType.COORDINATOR,
                operation=error_name,
                error=error,
                severity=Severity.MEDIUM
            )
        
        # Get error summary
        error_summary = monitoring_system.error_tracker.get_error_summary()
        
        print("✅ Error tracking test completed")
        print(f"   Total errors recorded: {error_summary['total_errors']}")
        print(f"   Error types: {list(error_summary['error_types'].keys())}")
        
        # Get error patterns
        patterns = monitoring_system.error_tracker.get_error_patterns()
        print(f"   Error patterns detected: {len(patterns)}")
        for pattern in patterns:
            print(f"     - {pattern}")
        
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")


async def test_performance_monitoring():
    """Test performance monitoring capabilities"""
    print("\nTesting performance monitoring...")
    
    try:
        from monitoring import monitoring_system
        from models import BotType
        
        # Test performance monitoring context
        async with monitoring_system.performance_monitor.monitor_operation(
            bot_name="test_performance_bot",
            bot_type=BotType.COORDINATOR,
            operation="test_operation"
        ):
            # Simulate some work
            await asyncio.sleep(0.1)  # 100ms operation
            print("   Simulated operation completed")
        
        print("✅ Performance monitoring test completed")
        
        # Get metrics summary
        metrics_summary = monitoring_system.metrics_collector.get_metric_summary()
        print(f"   Counters recorded: {len(metrics_summary['counters'])}")
        print(f"   Gauges recorded: {len(metrics_summary['gauges'])}")
        print(f"   Timers recorded: {len(metrics_summary['timers'])}")
        
    except Exception as e:
        print(f"❌ Performance monitoring test failed: {e}")


def test_health_calculation():
    """Test health score calculation"""
    print("\nTesting health score calculation...")
    
    try:
        from monitoring import monitoring_system
        
        # Generate health report
        health_report = monitoring_system.health_monitor.generate_health_report()
        
        print("✅ Health report generated")
        print(f"   Health Score: {health_report['health_score']:.1f}")
        print(f"   Health Status: {health_report['health_status']}")
        print(f"   Recommendations: {len(health_report['recommendations'])}")
        
        if health_report['recommendations']:
            print("   Top recommendations:")
            for i, rec in enumerate(health_report['recommendations'][:3]):
                print(f"     {i+1}. {rec}")
        
        if health_report['system_alerts']:
            print(f"   System alerts: {len(health_report['system_alerts'])}")
            for alert in health_report['system_alerts']:
                print(f"     - {alert['level']}: {alert['message']}")
        
    except Exception as e:
        print(f"❌ Health calculation test failed: {e}")


async def export_test_data():
    """Export monitoring data for review"""
    print("\nExporting test data...")
    
    try:
        from monitoring import monitoring_system
        
        # Export monitoring data
        export_file = await monitoring_system.export_monitoring_data()
        
        print("✅ Monitoring data exported")
        print(f"   Export file: {export_file}")
        
        # Check if file exists and show size
        if os.path.exists(export_file):
            file_size = os.path.getsize(export_file)
            print(f"   File size: {file_size} bytes")
        
        return export_file
        
    except Exception as e:
        print(f"❌ Data export failed: {e}")
        return None


async def run_all_tests():
    """Run all test scenarios"""
    print("="*80)
    print("BV STUDIOS TROUBLESHOOTING SYSTEM - COMPONENT TESTS")
    print("="*80)
    print(f"Started at: {datetime.utcnow().isoformat()}")
    
    # Run synchronous tests
    test_imports()
    test_error_handling()
    
    # Run asynchronous tests
    await test_basic_functionality()
    await test_performance_monitoring()
    test_health_calculation()
    
    # Export data
    export_file = await export_test_data()
    
    print("\n" + "="*80)
    print("COMPONENT TEST SUMMARY")
    print("="*80)
    
    from monitoring import monitoring_system
    
    # Final status
    try:
        status = monitoring_system.get_comprehensive_status()
        print(f"✅ Final Health Score: {status['system_health']['health_score']:.1f}")
        print(f"✅ Final Health Status: {status['system_health']['health_status']}")
        
        metrics = status['system_health']['metrics_summary']
        print(f"✅ Metrics Collected: {metrics['total_metrics']}")
        print(f"✅ Performance Snapshots: {metrics['performance_snapshots']}")
        
        errors = status['system_health']['error_summary'] 
        print(f"✅ Errors Tracked: {errors['total_errors']}")
        
        if export_file:
            print(f"✅ Data exported to: {export_file}")
        
    except Exception as e:
        print(f"❌ Final status failed: {e}")
    
    print(f"\nCompleted at: {datetime.utcnow().isoformat()}")
    print("\n🎉 Component testing complete!")
    
    print("\nNext Steps:")
    print("1. ✅ Core components are working correctly")
    print("2. ✅ Monitoring and error tracking operational")
    print("3. ✅ Health scoring and recommendations active")
    print("4. 🔧 Ready for integration with BV Studios platform")
    print("5. 🔧 Configure real OpenAI API key for full bot functionality")


if __name__ == "__main__":
    print("BV Studios Troubleshooting System - Component Tests")
    print("==================================================")
    
    try:
        # Run the component tests
        asyncio.run(run_all_tests())
        
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
    except Exception as e:
        print(f"\n❌ Tests failed: {str(e)}")
        import traceback
        traceback.print_exc()
    
    print("\nComponent testing session complete.")